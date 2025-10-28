/**
 * Date utility functions for handling Excel date conversions and formatting
 */

/**
 * Convert Excel serial date to YYYY-MM-DD format
 * Excel serial dates start from 1/1/1900 (serial number 1)
 * @param {number|string} excelDate - Excel serial date number
 * @returns {string} Date in YYYY-MM-DD format
 */
export const convertExcelDate = (excelDate) => {
  if (!excelDate) return '';
  
  // If it's already a valid date string, return as is
  if (typeof excelDate === 'string' && excelDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return excelDate;
  }
  
  // If it's a string that looks like a date, try to parse it
  if (typeof excelDate === 'string') {
    const dateStr = excelDate.trim();
    
    // Try common date formats
    const formats = [
      /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD or YYYY-M-D
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // MM/DD/YYYY or M/D/YYYY
      /^\d{1,2}-\d{1,2}-\d{4}$/, // MM-DD-YYYY or M-D-YYYY
    ];
    
    for (const format of formats) {
      if (format.test(dateStr)) {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return formatDateToISO(date);
        }
      }
    }
    
    // If it's a numeric string, treat as Excel serial
    const numericDate = parseFloat(dateStr);
    if (!isNaN(numericDate) && numericDate > 0) {
      return convertExcelSerialToDate(numericDate);
    }
    
    return '';
  }
  
  // If it's a number, convert from Excel serial
  if (typeof excelDate === 'number') {
    return convertExcelSerialToDate(excelDate);
  }
  
  return '';
};

/**
 * Convert Excel serial number to date
 * @param {number} serial - Excel serial number
 * @returns {string} Date in YYYY-MM-DD format
 */
export const convertExcelSerialToDate = (serial) => {
  if (!serial || serial < 1) return '';
  
  // Excel date system starts from January 1, 1900
  // But Excel incorrectly treats 1900 as a leap year, so we need to adjust
  const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
  const millisPerDay = 24 * 60 * 60 * 1000;
  
  // For dates after February 28, 1900, subtract 1 day due to Excel's leap year bug
  const adjustedSerial = serial > 59 ? serial - 1 : serial;
  
  const targetDate = new Date(excelEpoch.getTime() + adjustedSerial * millisPerDay);
  
  return formatDateToISO(targetDate);
};

/**
 * Format Date object to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateToISO = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Validate if a date string is in correct format
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if valid date format
 */
export const isValidDateFormat = (dateStr) => {
  if (!dateStr) return true; // Empty dates are allowed
  
  // Check if it matches YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  // Check if it's a valid date
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && dateStr === formatDateToISO(date);
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export const getTodayDate = () => {
  return formatDateToISO(new Date());
};

/**
 * Batch process dates for better performance
 * @param {Array} employees - Array of employee objects
 * @returns {Array} Processed employee array with converted dates
 */
export const batchProcessDates = (employees) => {
  return employees.map(employee => ({
    ...employee,
    startDate: convertExcelDate(employee.startDate || employee.joiningDate),
    joiningDate: convertExcelDate(employee.joiningDate || employee.startDate),
    dob: convertExcelDate(employee.dob)
  }));
};