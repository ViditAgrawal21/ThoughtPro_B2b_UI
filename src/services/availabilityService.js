// availabilityService.js - Handle all availability-related API calls
// Updated for ThoughtPro B2B API Configuration

const BASE_URL = process.env.REACT_APP_API_URL || 'https://thoughtprob2b.thoughthealer.org/api/v1';
const DEBUG_MODE = process.env.REACT_APP_DEBUG_MODE === 'true';
const OFFLINE_MODE = process.env.REACT_APP_OFFLINE_MODE === 'true';

export const availabilityService = {
  /**
   * Create a single availability slot
   * @param {Object} slotData - { psychologistId, time_slot (ISO date), availability_status }
   */
  createSlot: async (slotData) => {
    try {
      // Convert to backend expected format
      const requestData = {
        psychologist_id: slotData.psychologistId || slotData.psychologist_id,
        time_slot: slotData.time_slot || slotData.timeSlot || `${slotData.date}T${slotData.startTime}:00`,
        availability_status: slotData.availability_status || slotData.status || 'Available'
      };

      const response = await fetch(`${BASE_URL}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create availability slot');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating availability slot:', error);
      throw error;
    }
  },

  /**
   * Create bulk availability slots for multiple days
   * @param {Object} bulkData - { psychologistIds, startDate, endDate, startTime, endTime }
   */
  createBulkSlots: async (bulkData) => {
    try {
      const response = await fetch(`${BASE_URL}/availability/populate-n-days`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(bulkData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create bulk availability slots');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating bulk availability slots:', error);
      throw error;
    }
  },

  /**
   * Get availability slots for a specific psychologist
   * @param {string} psychologistId - Psychologist ID
   */
  getAvailabilityByPsychologist: async (psychologistId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/availability/${psychologistId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch availability slots');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching availability slots:', error);
      throw error;
    }
  },

  /**
   * Update availability slot status
   * @param {string} slotId - Slot ID
   * @param {Object} updateData - { availability_status, notes }
   */
  updateSlotStatus: async (slotId, updateData) => {
    try {
      // Convert to backend expected format
      const requestData = {
        availability_status: updateData.availability_status || updateData.status || 'Available',
        notes: updateData.notes
      };

      const response = await fetch(
        `${BASE_URL}/availability/${slotId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(requestData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update availability slot');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating availability slot:', error);
      throw error;
    }
  },

  /**
   * Delete availability slot
   * @param {string} slotId - Slot ID
   */
  deleteSlot: async (slotId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/availability/${slotId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete availability slot');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting availability slot:', error);
      throw error;
    }
  },

  /**
   * Toggle availability for a full day
   * @param {Object} toggleData - { psychologistId, date, available }
   */
  toggleDayAvailability: async (toggleData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/availability/toggle-day`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(toggleData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to toggle day availability');
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling day availability:', error);
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
  }
};

export default availabilityService;