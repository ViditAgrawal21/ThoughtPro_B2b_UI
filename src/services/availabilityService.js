// availabilityService.js - Handle all availability-related API calls
// Updated for ThoughtPro B2B API Configuration

const BASE_URL = process.env.REACT_APP_API_URL || 'https://thoughtprob2b.thoughthealer.org/api/v1';
const DEBUG_MODE = process.env.REACT_APP_DEBUG_MODE === 'true';
const OFFLINE_MODE = process.env.REACT_APP_OFFLINE_MODE === 'true';

// Helper function to check if a date is in the past
const isPastDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Helper function to get today's date string
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const availabilityService = {
  /**
   * Create a single availability slot
   * @param {Object} slotData - { psychologistId, time_slot (ISO date), availability_status }
   */
  createSlot: async (slotData) => {
    const endpoint = `${BASE_URL}/availability`;
    console.log('🚀 createSlot called with:', slotData);
    console.log('🔗 Endpoint:', endpoint);
    console.log('🔑 Token exists:', !!localStorage.getItem('authToken'));
    
    try {
      // Validate: Cannot create slots for past dates
      const slotDate = new Date(slotData.time_slot || slotData.timeSlot || `${slotData.date}T${slotData.startTime}:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (slotDate < today) {
        const error = new Error('Cannot create availability slots for past dates. You can only view past bookings.');
        error.technicalDetails = {
          endpoint,
          method: 'POST',
          validation: 'Date validation failed',
          attemptedDate: slotDate.toISOString(),
          currentDate: today.toISOString()
        };
        throw error;
      }

      // Convert to backend expected format
      const requestData = {
        psychologist_id: slotData.psychologistId || slotData.psychologist_id,
        time_slot: slotData.time_slot || slotData.timeSlot || `${slotData.date}T${slotData.startTime}:00`,
        availability_status: slotData.availability_status || slotData.status || 'Available'
      };

      console.log('📤 Sending request to:', endpoint);
      console.log('📦 Request payload:', JSON.stringify(requestData, null, 2));
      console.log('📦 Psychologist ID type:', typeof requestData.psychologist_id);
      console.log('📦 Time slot format:', requestData.time_slot);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(requestData)
      });

      console.log('📥 Response status:', response.status, response.statusText);

      let result;
      try {
        result = await response.json();
        console.log('📥 Response data:', JSON.stringify(result, null, 2));
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        console.log('📥 Raw response text:', await response.text());
        throw new Error('Server returned invalid JSON response');
      }

      if (!response.ok) {
        console.error('❌ API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          result: result,
          requestSent: requestData
        });
        
        const error = new Error(result.message || result.error || result.detail || 'Failed to create availability slot');
        error.technicalDetails = {
          endpoint,
          method: 'POST',
          statusCode: response.status,
          statusText: response.statusText,
          requestPayload: requestData,
          responseData: result,
          timestamp: new Date().toISOString()
        };
        throw error;
      }

      console.log('✅ Slot created successfully!');
      return result;
    } catch (error) {
      console.error('Error creating availability slot:', error);
      // Add technical details if not already present
      if (!error.technicalDetails) {
        error.technicalDetails = {
          endpoint,
          method: 'POST',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
      throw error;
    }
  },

  /**
   * Create bulk availability slots for multiple days
   * @param {Object} bulkData - { psychologistIds, startDate, endDate, startTime, endTime }
   */
  createBulkSlots: async (bulkData) => {
    const endpoint = `${BASE_URL}/availability/populate-n-days`;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(bulkData)
      });

      const result = await response.json();

      if (!response.ok) {
        const error = new Error(result.message || result.error || 'Failed to create bulk availability slots');
        error.technicalDetails = {
          endpoint,
          method: 'POST',
          statusCode: response.status,
          statusText: response.statusText,
          requestPayload: bulkData,
          responseData: result,
          timestamp: new Date().toISOString()
        };
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error creating bulk availability slots:', error);
      if (!error.technicalDetails) {
        error.technicalDetails = {
          endpoint,
          method: 'POST',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
      throw error;
    }
  },

  /**
   * Get availability slots for a specific psychologist
   * @param {string} psychologistId - Psychologist ID
   */
  getAvailabilityByPsychologist: async (psychologistId) => {
    const endpoint = `${BASE_URL}/availability/${psychologistId}`;
    try {
      console.log('Fetching availability from:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const result = await response.json();
      console.log('Availability API response:', result);

      if (!response.ok) {
        const error = new Error(result.message || result.error || 'Failed to fetch availability slots');
        error.technicalDetails = {
          endpoint,
          method: 'GET',
          statusCode: response.status,
          statusText: response.statusText,
          psychologistId,
          responseData: result,
          timestamp: new Date().toISOString()
        };
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error fetching availability slots:', error);
      if (!error.technicalDetails) {
        error.technicalDetails = {
          endpoint,
          method: 'GET',
          psychologistId,
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
      throw error;
    }
  },

  /**
   * Update availability slot status
   * @param {string} slotId - Slot ID
   * @param {Object} updateData - { availability_status, notes }
   */
  updateSlotStatus: async (slotId, updateData) => {
    const endpoint = `${BASE_URL}/availability/${slotId}`;
    try {
      // Convert to backend expected format
      const requestData = {
        availability_status: updateData.availability_status || updateData.status || 'Available',
        notes: updateData.notes
      };

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        const error = new Error(result.message || result.error || 'Failed to update availability slot');
        error.technicalDetails = {
          endpoint,
          method: 'PATCH',
          statusCode: response.status,
          statusText: response.statusText,
          slotId,
          requestPayload: requestData,
          responseData: result,
          timestamp: new Date().toISOString()
        };
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error updating availability slot:', error);
      if (!error.technicalDetails) {
        error.technicalDetails = {
          endpoint,
          method: 'PATCH',
          slotId,
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
      throw error;
    }
  },

  /**
   * Delete availability slot
   * @param {string} slotId - Slot ID
   */
  deleteSlot: async (slotId) => {
    const endpoint = `${BASE_URL}/availability/${slotId}`;
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        const error = new Error(result.message || result.error || 'Failed to delete availability slot');
        error.technicalDetails = {
          endpoint,
          method: 'DELETE',
          statusCode: response.status,
          statusText: response.statusText,
          slotId,
          responseData: result,
          timestamp: new Date().toISOString()
        };
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error deleting availability slot:', error);
      if (!error.technicalDetails) {
        error.technicalDetails = {
          endpoint,
          method: 'DELETE',
          slotId,
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
      throw error;
    }
  },

  /**
   * Toggle availability for a full day
   * @param {Object} toggleData - { psychologistId, date, status }
   */
  toggleDayAvailability: async (toggleData) => {
    const endpoint = `${BASE_URL}/availability/toggle-day`;
    try {
      // Validate: Cannot toggle past dates
      const toggleDate = new Date(toggleData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (toggleDate < today) {
        const error = new Error('Cannot modify availability for past dates. You can only view past bookings.');
        error.technicalDetails = {
          endpoint,
          method: 'PATCH',
          validation: 'Date validation failed',
          attemptedDate: toggleDate.toISOString(),
          currentDate: today.toISOString()
        };
        throw error;
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(toggleData)
      });

      const result = await response.json();

      if (!response.ok) {
        const error = new Error(result.message || result.error || 'Failed to toggle day availability');
        error.technicalDetails = {
          endpoint,
          method: 'PATCH',
          statusCode: response.status,
          statusText: response.statusText,
          requestPayload: toggleData,
          responseData: result,
          timestamp: new Date().toISOString()
        };
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Error toggling day availability:', error);
      if (!error.technicalDetails) {
        error.technicalDetails = {
          endpoint,
          method: 'PATCH',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
      throw error;
    }
  },

  /**
   * Count available slots in a date range
   * @param {string} psychologistId - Psychologist ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   */
  countAvailableSlots: async (psychologistId, startDate, endDate) => {
    try {
      const response = await fetch(
        `${BASE_URL}/availability/${psychologistId}?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (!response.ok) {
        return 0;
      }

      const data = await response.json();
      return Array.isArray(data) ? data.length : data.count || 0;
    } catch (error) {
      console.error('Error counting available slots:', error);
      return 0;
    }
  },

  /**
   * Get all holidays
   */
  getAllHolidays: async () => {
    try {
      const response = await fetch(`${BASE_URL}/holidays`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch holidays');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching holidays:', error);
      throw error;
    }
  },

  /**
   * Add a holiday
   * @param {Object} holidayData - { date, description }
   */
  addHoliday: async (holidayData) => {
    try {
      // Convert to backend expected format
      const requestData = {
        date: holidayData.date,
        description: holidayData.description || holidayData.name
      };

      const response = await fetch(`${BASE_URL}/holidays`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add holiday');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding holiday:', error);
      throw error;
    }
  },

  /**
   * Delete a holiday
   * @param {string} holidayId - Holiday ID
   */
  deleteHoliday: async (holidayId) => {
    try {
      const response = await fetch(`${BASE_URL}/holidays/${holidayId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete holiday');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting holiday:', error);
      throw error;
    }
  },

  /**
   * Check if a date is in the past (before today)
   * @param {string|Date} date - Date to check
   * @returns {boolean} - True if date is in the past
   */
  isPastDate: (date) => {
    const checkDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  },

  /**
   * Check if a date can be edited (today or future)
   * @param {string|Date} date - Date to check
   * @returns {boolean} - True if date can be edited
   */
  canEditDate: (date) => {
    const checkDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate >= today;
  }
};

export default availabilityService;