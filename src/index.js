import React, { useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import Timeline from "./Timeline.js";
import Toolbox from "./Toolbox.js";
import HelpComponent from "./HelpComponent.js";
import timelineItems from "./timelineItems.js";
import { TIMELINE_CONFIG } from "./config.js";
import "./app.css";

// Main application component that manages timeline state and renders all components
function App() {
  const [pixelsPerDay, setPixelsPerDay] = useState(
    TIMELINE_CONFIG.ZOOM_DEFAULT
  );
  const [showHelp, setShowHelp] = useState(false);
  const timelineRef = useRef();

  // Updates the timeline zoom level state
  const handleZoomChange = (newZoom) => {
    setPixelsPerDay(newZoom);
  };

  // Updates zoom level while preserving scroll position
  const handleZoomChangeWithScrollPreservation = (newZoom) => {
    if (timelineRef.current && timelineRef.current.zoomWithScrollPreservation) {
      timelineRef.current.zoomWithScrollPreservation(newZoom);
    } else {
      handleZoomChange(newZoom);
    }
  };

  // Opens the help popup
  const handleHelpOpen = () => {
    setShowHelp(true);
  };

  // Closes the help popup
  const handleHelpClose = () => {
    setShowHelp(false);
  };

  return (
    <div>
      <h1>Project Timeline</h1>
      <Toolbox
        pixelsPerDay={pixelsPerDay}
        onZoomChange={handleZoomChangeWithScrollPreservation}
        minZoom={TIMELINE_CONFIG.ZOOM_MIN}
        maxZoom={TIMELINE_CONFIG.ZOOM_MAX}
        onHelpOpen={handleHelpOpen}
      />
      <Timeline
        ref={timelineRef}
        items={timelineItems}
        pixelsPerDay={pixelsPerDay}
        onZoomChange={handleZoomChange}
        minZoom={TIMELINE_CONFIG.ZOOM_MIN}
        maxZoom={TIMELINE_CONFIG.ZOOM_MAX}
      />

      {showHelp && <HelpComponent onClose={handleHelpClose} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
