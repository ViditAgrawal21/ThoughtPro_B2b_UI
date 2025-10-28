// bookingService.js & adminService.js - Handle booking and admin operations
// Updated for ThoughtPro B2B API Configuration

const BASE_URL = process.env.REACT_APP_API_URL || 'https://thoughtprob2b.thoughthealer.org/api/v1';
const DEBUG_MODE = process.env.REACT_APP_DEBUG_MODE === 'true';
const OFFLINE_MODE = process.env.REACT_APP_OFFLINE_MODE === 'true';

// ========== ADMIN SERVICE ==========
export const adminService = {
  /**
   * Get psychologists overview with booking statistics
   */
  getPsychologistsOverview: async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/psychologists-overview`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch psychologists overview');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching psychologists overview:', error);
      throw error;
    }
  },

  /**
   * Get bookings for a specific psychologist
   * @param {string} psychologistId - Psychologist ID
   */
  getBookingsByPsychologist: async (psychologistId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/psychologist-bookings/${psychologistId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch psychologist bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching psychologist bookings:', error);
      throw error;
    }
  },

  /**
   * Get all bookings across all psychologists
   */
  getAllBookings: async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/all-bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch all bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  },

  /**
   * Reassign booking to a different psychologist
   * @param {string} bookingId - Booking ID
   * @param {string} newPsychologistId - New psychologist ID
   */
  reassignBooking: async (bookingId, newPsychologistId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/bookings/${bookingId}/reassign`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ new_psychologist_id: newPsychologistId })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reassign booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error reassigning booking:', error);
      throw error;
    }
  },

  /**
   * Disable a psychologist (temporarily)
   * @param {string} psychologistId - Psychologist ID
   */
  disablePsychologist: async (psychologistId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/psychologists/${psychologistId}/disable`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to disable psychologist');
      }

      return await response.json();
    } catch (error) {
      console.error('Error disabling psychologist:', error);
      throw error;
    }
  },

  /**
   * Enable a previously disabled psychologist
   * @param {string} psychologistId - Psychologist ID
   */
  enablePsychologist: async (psychologistId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/psychologists/${psychologistId}/enable`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to enable psychologist');
      }

      return await response.json();
    } catch (error) {
      console.error('Error enabling psychologist:', error);
      throw error;
    }
  },

  /**
   * Get availability status for a psychologist
   * @param {string} psychologistId - Psychologist ID
   */
  getPsychologistStatus: async (psychologistId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/psychologists/${psychologistId}/status`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch psychologist status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching psychologist status:', error);
      throw error;
    }
  }
};

// ========== BOOKING SERVICE ==========
export const bookingService = {
  /**
   * Get all bookings (alias for adminService)
   */
  getAllBookings: async () => {
    return adminService.getAllBookings();
  },

  /**
   * Get bookings for a specific psychologist
   */
  getBookingsByPsychologist: async (psychologistId) => {
    return adminService.getBookingsByPsychologist(psychologistId);
  },

  /**
   * Reassign booking
   */
  reassignBooking: async (bookingId, newPsychologistId) => {
    return adminService.reassignBooking(bookingId, newPsychologistId);
  },

  /**
   * Search bookings with filters
   * @param {Object} filters - { psychologistId, clientId, status, startDate, endDate }
   */
  searchBookings: async (filters) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(
        `${BASE_URL}/bookings/search?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to search bookings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching bookings:', error);
      throw error;
    }
  },

  /**
   * Get booking details
   * @param {string} bookingId - Booking ID
   */
  getBookingDetails: async (bookingId) => {
    try {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch booking details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  },

  /**
   * Update booking status
   * @param {string} bookingId - Booking ID
   * @param {string} status - New status (confirmed, cancelled, completed, etc)
   */
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update booking status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  /**
   * Update booking details
   * @param {string} bookingId - Booking ID
   * @param {Object} updateData - Fields to update
   */
  updateBooking: async (bookingId, updateData) => {
    try {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  /**
   * Cancel booking
   * @param {string} bookingId - Booking ID
   * @param {string} reason - Cancellation reason
   */
  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          status: 'cancelled',
          cancellation_reason: reason
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }
};

const services = { adminService, bookingService };
export default services;