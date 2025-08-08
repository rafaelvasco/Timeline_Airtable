import React, { useState, useRef, useEffect, useCallback } from "react";
import moment from "moment";
import TimelineItem from "./TimelineItem.js";
import ItemDetailPopup from "./ItemDetailPopup.js";
import { TIMELINE_CONFIG } from "./config.js";

// Assigns timeline items to compact horizontal lanes to minimize vertical space
function assignLanes(items) {
  const sortedItems = items.sort(
    (a, b) => moment(a.start).valueOf() - moment(b.start).valueOf()
  );
  const lanes = [];

  function assignItemToLane(item) {
    for (const lane of lanes) {
      if (moment(lane[lane.length - 1].end).isBefore(moment(item.start))) {
        lane.push(item);
        return;
      }
    }
    lanes.push([item]);
  }

  for (const item of sortedItems) {
    assignItemToLane(item);
  }
  return lanes;
}

const Timeline = React.forwardRef(
  (
    {
      items,
      pixelsPerDay,
      onZoomChange,
      minZoom = TIMELINE_CONFIG.ZOOM_MIN,
      maxZoom = TIMELINE_CONFIG.ZOOM_MAX,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [scrollStart, setScrollStart] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const timelineRef = useRef(null);
    const lanes = assignLanes(items);

    let minDate, maxDate;

    // Converts YYYY-MM-DD string to moment object for consistent date handling
    const createMoment = (dateString) => {
      return moment(dateString, "YYYY-MM-DD");
    };

    const allDates = items.flatMap((item) => [
      createMoment(item.start),
      createMoment(item.end),
    ]);
    minDate = moment.min(allDates);
    maxDate = moment.max(allDates);

    const timelineEndDate = maxDate.clone().add(1, "month").endOf("month");
    const totalDays = timelineEndDate.diff(minDate, "days") + 1;
    const timelineWidth = totalDays * pixelsPerDay;

    const zoomFactor = TIMELINE_CONFIG.ZOOM_FACTOR;

    const stateRef = useRef();
    stateRef.current = { pixelsPerDay, minZoom, maxZoom };
    
    const wheelDeltaRef = useRef(0);


    // Handles zoom change while preserving scroll position
    const handleZoomWithScrollPreservation = useCallback(
      (newZoom) => {
        if (!timelineRef.current) return;

        const currentScrollLeft = timelineRef.current.scrollLeft;
        const currentScrollWidth = timelineRef.current.scrollWidth;
        const containerWidth = timelineRef.current.clientWidth;

        // Calculate scroll position as a ratio
        const scrollRatio =
          currentScrollLeft / Math.max(1, currentScrollWidth - containerWidth);

        // Apply the zoom change
        onZoomChange(newZoom);

        // Restore scroll position after the DOM updates
        requestAnimationFrame(() => {
          if (timelineRef.current) {
            const newScrollWidth = timelineRef.current.scrollWidth;
            const newMaxScroll = Math.max(0, newScrollWidth - containerWidth);
            const newScrollLeft = scrollRatio * newMaxScroll;
            timelineRef.current.scrollLeft = newScrollLeft;
          }
        });
      },
      [onZoomChange]
    );

    React.useImperativeHandle(
      ref,
      () => ({
        zoomWithScrollPreservation: handleZoomWithScrollPreservation,
      }),
      [handleZoomWithScrollPreservation]
    );

    const handleWheel = useCallback(
      (e) => {
        e.preventDefault();

        const WHEEL_SNAP_THRESHOLD = TIMELINE_CONFIG.WHEEL_SNAP_THRESHOLD;
        wheelDeltaRef.current += e.deltaY;

        if (Math.abs(wheelDeltaRef.current) >= WHEEL_SNAP_THRESHOLD) {
          const {
            pixelsPerDay: currentPixels,
            minZoom: currentMinZoom,
            maxZoom: currentMaxZoom,
          } = stateRef.current;

          if (wheelDeltaRef.current < 0) {
            const newZoom = Math.min(
              currentPixels * zoomFactor,
              currentMaxZoom
            );
            handleZoomWithScrollPreservation(newZoom);
          } else {
            const newZoom = Math.max(
              currentPixels / zoomFactor,
              currentMinZoom
            );
            handleZoomWithScrollPreservation(newZoom);
          }
          
          wheelDeltaRef.current = 0;
        }
      },
      [handleZoomWithScrollPreservation]
    );

    // Initiates middle mouse button dragging for timeline panning
    const handleMouseDown = (e) => {
      if (e.button !== 1) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setScrollStart(timelineRef.current.scrollLeft);
      e.preventDefault();
    };

    // Updates timeline scroll position during drag operation
    const handleMouseMove = (e) => {
      if (!isDragging || !dragStart) return;

      const deltaX = e.clientX - dragStart.x;
      const newScrollLeft = scrollStart - deltaX;

      timelineRef.current.scrollLeft = newScrollLeft;
    };

    // Ends drag operation and resets drag state
    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
      setScrollStart(0);
    };

    // Cancels drag operation when mouse leaves timeline area
    const handleMouseLeave = () => {
      setIsDragging(false);
      setDragStart(null);
      setScrollStart(0);
    };

    // Opens detail popup for clicked timeline item
    const handleItemClick = (item) => {
      setSelectedItem(item);
    };

    // Closes the item detail popup
    const handlePopupClose = () => {
      setSelectedItem(null);
    };

    useEffect(() => {
      const timeline = timelineRef.current;
      if (timeline) {
        timeline.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
          timeline.removeEventListener("wheel", handleWheel);
        };
      }
    }, [handleWheel]);

    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, dragStart, scrollStart]);

    const laneHeight = TIMELINE_CONFIG.LANE_HEIGHT;
    const timelineHeight = lanes.length * laneHeight + 80;

    // Calculates pixel position and width for a timeline item
    const getItemPosition = (item) => {
      const startDate = createMoment(item.start);
      const endDate = createMoment(item.end);
      const daysFromStart = startDate.diff(minDate, "days");
      const duration = endDate.diff(startDate, "days") + 1;

      return {
        left: daysFromStart * pixelsPerDay,
        width: Math.max(
          duration * pixelsPerDay,
          TIMELINE_CONFIG.MIN_ITEM_WIDTH
        ),
      };
    };

    // Generates month header markers for the timeline axis
    const generateMonthMarks = () => {
      const marks = [];
      const current = minDate.clone().startOf("month");
      const endBoundary = maxDate.clone().add(1, "month").startOf("month");

      while (current.isSameOrBefore(endBoundary)) {
        const daysFromStart = current.diff(minDate, "days");
        const position = Math.max(0, daysFromStart * pixelsPerDay);

        marks.push({
          date: current.clone(),
          position: position,
          label: current.format("MMMM YYYY"),
        });

        current.add(1, "month");
      }

      return marks;
    };

    // Generates day markers for the timeline axis extending through complete months
    const generateDayMarks = () => {
      const marks = [];
      const current = minDate.clone();
      const endBoundary = maxDate.clone().add(1, "month").endOf("month");

      while (current.isSameOrBefore(endBoundary)) {
        const daysFromStart = current.diff(minDate, "days");
        const position = daysFromStart * pixelsPerDay;

        marks.push({
          date: current.clone(),
          position: position,
          weekday: current.format("ddd"),
          day: current.date(),
        });

        current.add(1, "day");
      }

      return marks;
    };

    const monthMarks = generateMonthMarks();
    const dayMarks = generateDayMarks();

    return (
      <div
        className={`timeline-container ${
          isDragging ? "timeline-dragging" : ""
        }`}
        ref={timelineRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? "grabbing" : "default" }}
      >
        <div className="timeline-header">
          <div className="time-axis" style={{ width: timelineWidth }}>
            {/* Month row */}
            <div className="time-axis-row time-axis-months">
              {monthMarks.map((mark, index) => (
                <div
                  key={index}
                  className="time-mark month-mark"
                  style={{ left: mark.position }}
                >
                  <div className="time-mark-label">{mark.label}</div>
                </div>
              ))}
            </div>

            {/* Day row */}
            <div className="time-axis-row time-axis-days">
              {dayMarks.map((mark, index) => (
                <div
                  key={index}
                  className="time-mark day-mark"
                  style={{ left: mark.position }}
                >
                  <div className="time-mark-line"></div>
                  <div className="day-mark-content">
                    <div className="day-weekday">{mark.weekday}</div>
                    <div className="day-number">{mark.day}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="timeline-content"
          style={{
            width: timelineWidth,
            height: timelineHeight - 80,
          }}
        >
          {lanes.map((lane, laneIndex) => (
            <div
              key={laneIndex}
              className="timeline-lane"
              style={{
                top: laneIndex * laneHeight,
                height: laneHeight,
              }}
            >
              {lane.map((item) => {
                const position = getItemPosition(item);
                const itemVerticalOffset =
                  (laneHeight - TIMELINE_CONFIG.ITEM_HEIGHT) / 2;
                return (
                  <TimelineItem
                    key={item.id}
                    item={item}
                    style={{
                      left: position.left,
                      width: position.width,
                      top: itemVerticalOffset,
                    }}
                    onClick={handleItemClick}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <ItemDetailPopup item={selectedItem} onClose={handlePopupClose} />
      </div>
    );
  }
);

export default Timeline;
