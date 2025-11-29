/**
 * Safety Reports Data Model and Storage
 * 
 * Anonymous crowd-sourced safety reporting system.
 * Reports are stored in-memory and persisted to a JSON file.
 * 
 * SECURITY: No user IDs, emails, or IP addresses are stored.
 * Reports are completely anonymous.
 */

const fs = require('fs');
const path = require('path');

// Path to the reports data file
const REPORTS_FILE = path.join(__dirname, 'safetyReports.json');

/**
 * SafetyReport Schema (for documentation and validation)
 * 
 * {
 *   _id: string (auto-generated UUID)
 *   location: {
 *     type: "Point",
 *     coordinates: [longitude, latitude]  // GeoJSON format
 *   },
 *   safetyScore: number (1-5)
 *   tags: string[] (allowed values: predefined list)
 *   comment: string (max 280 chars, optional)
 *   timestamp: Date (ISO string)
 * }
 * 
 * NOTE: Explicitly NO userId, email, or IP address fields
 */

// Allowed tag values (prevent injection and ensure consistency)
const ALLOWED_TAGS = [
  'Harassment',
  'Welcoming',
  'Police Presence',
  'Protest',
  'Crowded',
  'Quiet',
  'Other'
];

/**
 * Initialize reports storage
 * Loads existing reports from file or creates empty array
 */
function loadReports() {
  try {
    if (fs.existsSync(REPORTS_FILE)) {
      const data = fs.readFileSync(REPORTS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading reports:', error);
  }
  return [];
}

/**
 * Save reports to file
 */
function saveReports(reports) {
  try {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving reports:', error);
    return false;
  }
}

/**
 * Generate a unique ID for a report
 */
function generateReportId() {
  return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new safety report
 * 
 * @param {Object} reportData - Report data (validated)
 * @returns {Object} Created report with generated ID and timestamp
 */
function createReport(reportData) {
  const reports = loadReports();
  
  const newReport = {
    _id: generateReportId(),
    location: {
      type: 'Point',
      coordinates: [reportData.longitude, reportData.latitude] // GeoJSON: [long, lat]
    },
    safetyScore: reportData.safetyScore,
    tags: reportData.tags || [],
    comment: reportData.comment || '',
    timestamp: new Date().toISOString()
  };
  
  reports.push(newReport);
  saveReports(reports);
  
  return newReport;
}

/**
 * Get all reports (for future use - e.g., aggregating safety data)
 * 
 * @param {Object} filters - Optional filters (location bounds, date range, etc.)
 * @returns {Array} Array of reports
 */
function getReports(filters = {}) {
  const reports = loadReports();
  
  // Apply filters if provided
  let filteredReports = reports;
  
  if (filters.minDate) {
    filteredReports = filteredReports.filter(r => r.timestamp >= filters.minDate);
  }
  
  if (filters.maxDate) {
    filteredReports = filteredReports.filter(r => r.timestamp <= filters.maxDate);
  }
  
  // Future: Add geospatial filtering (within radius of a point)
  
  return filteredReports;
}

/**
 * Get reports within a geographic bounding box
 * 
 * @param {number} minLat - Minimum latitude
 * @param {number} maxLat - Maximum latitude
 * @param {number} minLon - Minimum longitude
 * @param {number} maxLon - Maximum longitude
 * @returns {Array} Reports within the bounding box
 */
function getReportsInBounds(minLat, maxLat, minLon, maxLon) {
  const reports = loadReports();
  
  return reports.filter(report => {
    const [lon, lat] = report.location.coordinates;
    return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
  });
}

/**
 * Get allowed tags list
 */
function getAllowedTags() {
  return [...ALLOWED_TAGS];
}

module.exports = {
  createReport,
  getReports,
  getReportsInBounds,
  getAllowedTags,
  ALLOWED_TAGS
};

