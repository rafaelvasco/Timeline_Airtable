import React from "react";
import moment from "moment";

// Displays detailed information for a timeline item in a modal popup
function ItemDetailPopup({ item, onClose }) {
  if (!item) return null;

  // Converts YYYY-MM-DD string to moment object for consistent date handling
  const createMoment = (dateString) => {
    return moment(dateString, "YYYY-MM-DD");
  };

  // Formats a date string as a full readable date with weekday
  const formatDate = (dateString) => {
    const date = createMoment(dateString);
    return date.format("dddd, MMMM D, YYYY");
  };

  // Calculates and formats the duration between start and end dates
  const getDuration = (start, end) => {
    const startDate = createMoment(start);
    const endDate = createMoment(end);
    const days = endDate.diff(startDate, "days") + 1;
    return days === 1 ? "1 day" : `${days} days`;
  };

  // Closes popup when clicking outside the modal content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Closes popup when Escape key is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="popup-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="popup-content">
        <div className="popup-header">
          <h2 className="popup-title">{item.name}</h2>
          <button
            className="popup-close-btn"
            onClick={onClose}
            aria-label="Close popup"
          >
            ×
          </button>
        </div>

        <div className="popup-body">
          <div className="popup-section">
            <h3>Duration</h3>
            <p>{getDuration(item.start, item.end)}</p>
          </div>

          <div className="popup-section">
            <h3>Start Date</h3>
            <p>{formatDate(item.start)}</p>
          </div>

          <div className="popup-section">
            <h3>End Date</h3>
            <p>{formatDate(item.end)}</p>
          </div>

          <div className="popup-section">
            <h3>Item ID</h3>
            <p>#{item.id}</p>
          </div>
        </div>

        <div className="popup-footer">
          <button className="popup-action-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailPopup;
