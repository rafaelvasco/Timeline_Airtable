import React from 'react';

// Displays help popup with documentation for timeline controls and interactions
function HelpComponent({ onClose }) {
  // Closes help popup when clicking outside the modal content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Closes help popup when Escape key is pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const controlSections = [
    {
      title: "Navigation",
      controls: [
        {
          name: "Middle Mouse Drag",
          description: "Click and drag with the middle mouse button (scroll wheel) to pan left and right through the timeline"
        },
        {
          name: "Mouse Wheel",
          description: "Scroll up to zoom in (more detail), scroll down to zoom out (less detail)"
        },
      ]
    },
    {
      title: "Zoom Controls",
      controls: [
        {
          name: "Zoom Buttons",
          description: "Click + to zoom in, − to zoom out, or 'Reset' to return to default zoom level"
        },
        {
          name: "Zoom Range",
          description: "Zoom from 30 pixels/day (overview) to 200 pixels/day (detailed view)"
        },
        {
          name: "Mouse Wheel Zoom",
          description: "Alternative to buttons - scroll wheel for smooth zooming"
        }
      ]
    },
    {
      title: "Timeline Items",
      controls: [
        {
          name: "Left Click",
          description: "Click any timeline item to see detailed information including dates, duration, and description"
        },
        {
          name: "Hover",
          description: "Hover over items to see a quick tooltip with basic information"
        },
        {
          name: "Visual Layout",
          description: "Items are arranged in compact lanes - overlapping tasks share vertical space efficiently"
        }
      ]
    },
    {
      title: "Keyboard Shortcuts",
      controls: [
        {
          name: "Escape",
          description: "Close any open popup (this help popup or item details)"
        }
      ]
    }
  ];

  return (
    <div 
      className="help-backdrop" 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="help-content">
        <div className="help-header">
          <h2 className="help-title">Timeline Controls Help</h2>
          <button 
            className="help-close-btn"
            onClick={onClose}
            aria-label="Close help"
          >
            ×
          </button>
        </div>
        
        <div className="help-body">
          {controlSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="help-section">
              <h3 className="help-section-title">{section.title}</h3>
              <div className="help-controls-list">
                {section.controls.map((control, controlIndex) => (
                  <div key={controlIndex} className="help-control-item">
                    <div className="help-control-name">{control.name}</div>
                    <div className="help-control-description">{control.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="help-footer">
          <button className="help-action-btn" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpComponent;