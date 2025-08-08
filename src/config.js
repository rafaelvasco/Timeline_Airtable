// Timeline configuration settings
export const TIMELINE_CONFIG = {
  // Zoom settings
  ZOOM_MIN: 30, // Minimum pixels per day
  ZOOM_MAX: 200, // Maximum pixels per day
  ZOOM_DEFAULT: 200, // Default zoom level
  ZOOM_FACTOR: 1.2, // Zoom increment/decrement factor
  ZOOM_DEBOUNCE_DELAY: 20, // Mouse wheel zoom debounce delay in milliseconds
  WHEEL_SNAP_THRESHOLD: 30, // Wheel delta accumulation threshold for zoom snapping

  // Date range settings
  DATE_WINDOW_MONTHS: 2, // Default window size in months for date range picker

  // Timeline layout settings
  LANE_HEIGHT: 90, // Height of each timeline lane in pixels
  ITEM_HEIGHT: 60, // Height of timeline items in pixels
  MIN_ITEM_WIDTH: 20, // Minimum width for timeline items

  // Visual settings
  PIXELS_PER_DAY_DEFAULT: 200, // Default pixels per day (same as ZOOM_DEFAULT)
};

export default TIMELINE_CONFIG;
