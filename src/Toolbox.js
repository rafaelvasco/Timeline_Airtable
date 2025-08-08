import React from 'react';
import ZoomControls from './ZoomControls.js';

// Container component for timeline controls including zoom controls and help button
function Toolbox({ 
  pixelsPerDay, 
  onZoomChange, 
  minZoom, 
  maxZoom,
  onHelpOpen
}) {
  return (
    <div className="toolbox">
      <div className="toolbox-right">
        <ZoomControls 
          pixelsPerDay={pixelsPerDay}
          onZoomChange={onZoomChange}
          minZoom={minZoom}
          maxZoom={maxZoom}
        />
        <button 
          className="help-btn"
          onClick={onHelpOpen}
          title="Show controls help"
        >
          ?
        </button>
      </div>
    </div>
  );
}

export default Toolbox;