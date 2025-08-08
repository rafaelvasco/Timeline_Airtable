import React from "react";
import { TIMELINE_CONFIG } from "./config.js";

// Renders zoom control buttons with zoom in/out/reset functionality
function ZoomControls({
  pixelsPerDay,
  onZoomChange,
  minZoom = TIMELINE_CONFIG.ZOOM_MIN,
  maxZoom = TIMELINE_CONFIG.ZOOM_MAX,
}) {
  const zoomFactor = TIMELINE_CONFIG.ZOOM_FACTOR;

  // Increases zoom level up to the maximum limit
  const handleZoomIn = () => {
    const newZoom = Math.min(pixelsPerDay * zoomFactor, maxZoom);
    onZoomChange(newZoom);
  };

  // Decreases zoom level down to the minimum limit
  const handleZoomOut = () => {
    const newZoom = Math.max(pixelsPerDay / zoomFactor, minZoom);
    onZoomChange(newZoom);
  };

  // Resets zoom level to the default minimum value
  const handleZoomReset = () => {
    onZoomChange(minZoom);
  };

  return (
    <div className="timeline-controls">
      <div className="zoom-controls">
        <button
          className="zoom-btn"
          onClick={handleZoomOut}
          disabled={pixelsPerDay <= minZoom}
          title="Zoom out"
        >
          −
        </button>
        <div className="zoom-indicator">{Math.round(pixelsPerDay)}px/day</div>
        <button
          className="zoom-btn"
          onClick={handleZoomIn}
          disabled={pixelsPerDay >= maxZoom}
          title="Zoom in"
        >
          +
        </button>
        <button
          className="zoom-reset-btn"
          onClick={handleZoomReset}
          title="Reset zoom to default"
        >
          Reset
        </button>
      </div>
      <div className="zoom-hint">Try zooming with the mouse wheel too!</div>
    </div>
  );
}

export default ZoomControls;
