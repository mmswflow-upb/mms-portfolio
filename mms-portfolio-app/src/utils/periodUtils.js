/**
 * Utility functions for calculating and formatting time periods
 */

/**
 * Calculate the period between two dates and return a human-readable string
 * @param {string|Date} startDate - Start date (can be year string like "2020" or full date)
 * @param {string|Date} endDate - End date (can be year string like "2021" or "Present")
 * @returns {string} Formatted period string (e.g., "1 year", "6 months", "1.5 years")
 */
export const calculatePeriod = (startDate, endDate) => {
  if (!startDate) return "";
  
  // Handle year-only strings (e.g., "2020")
  const start = typeof startDate === 'string' && startDate.length === 4 
    ? new Date(parseInt(startDate), 0, 1) 
    : new Date(startDate);
  
  if (!endDate || endDate === 'Present') {
    // Calculate from start to now
    const now = new Date();
    return formatPeriod(start, now);
  }
  
  const end = typeof endDate === 'string' && endDate.length === 4 
    ? new Date(parseInt(endDate), 11, 31) 
    : new Date(endDate);
  
  return formatPeriod(start, end);
};

/**
 * Format the period between two dates into a human-readable string
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {string} Formatted period string
 */
const formatPeriod = (startDate, endDate) => {
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30.44);
  const diffYears = Math.floor(diffMonths / 12);
  
  if (diffYears > 0) {
    const remainingMonths = diffMonths % 12;
    if (remainingMonths === 0) {
      return diffYears === 1 ? "1 year" : `${diffYears} years`;
    } else if (remainingMonths === 6) {
      return `${diffYears}.5 years`;
    } else {
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  } else if (diffMonths > 0) {
    return diffMonths === 1 ? "1 month" : `${diffMonths} months`;
  } else {
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  }
};

/**
 * Get a short period display (e.g., "1.5 years" instead of "1 year 6 months")
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} Short formatted period string
 */
export const calculateShortPeriod = (startDate, endDate) => {
  if (!startDate) return "";
  
  const start = typeof startDate === 'string' && startDate.length === 4 
    ? new Date(parseInt(startDate), 0, 1) 
    : new Date(startDate);
  
  if (!endDate || endDate === 'Present') {
    const now = new Date();
    return formatShortPeriod(start, now);
  }
  
  const end = typeof endDate === 'string' && endDate.length === 4 
    ? new Date(parseInt(endDate), 11, 31) 
    : new Date(endDate);
  
  return formatShortPeriod(start, end);
};

/**
 * Format period in a shorter format
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {string} Short formatted period string
 */
const formatShortPeriod = (startDate, endDate) => {
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30.44);
  const diffYears = Math.floor(diffMonths / 12);
  
  if (diffYears > 0) {
    const remainingMonths = diffMonths % 12;
    if (remainingMonths === 0) {
      return diffYears === 1 ? "1 year" : `${diffYears} years`;
    } else if (remainingMonths === 6) {
      return `${diffYears}.5 years`;
    } else {
      // Round to nearest 0.5 years for cleaner display
      const totalYears = diffYears + (remainingMonths / 12);
      const roundedYears = Math.round(totalYears * 2) / 2;
      return roundedYears === 1 ? "1 year" : `${roundedYears} years`;
    }
  } else if (diffMonths > 0) {
    return diffMonths === 1 ? "1 month" : `${diffMonths} months`;
  } else {
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  }
};
