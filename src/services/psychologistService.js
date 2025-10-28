/**
 * Psychologist Service - Handles all psychologist-related API calls
 * Integrated with ThoughtPro B2B Backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://thoughtprob2b.thoughthealer.org/api/v1';

export const psychologistService = {
  // Store psychologist ID in localStorage for reference
  storePsychologistId: (id) => {
    localStorage.setItem('currentPsychologistId', id);
  },

  getPsychologistId: () => {
    return localStorage.getItem('currentPsychologistId');
  },

  // ==================== PSYCHOLOGIST CRUD OPERATIONS ====================

  /**
   * Get all psychologists
   * GET /psychologists
   */
  getAllPsychologists: async (page = 1, limit = 100) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychologists?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch psychologists: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching psychologists:', error);
      throw error;
    }
  },

  /**
   * Get psychologist by ID
   * GET /psychologists/{id}
   */
  getPsychologistById: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychologists/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch psychologist: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching psychologist:', error);
      throw error;
    }
  },

  /**
   * Search psychologists by name
   * GET /psychologists/search?query=...
   */
  searchPsychologists: async (query) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychologists/search?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search psychologists: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching psychologists:', error);
      throw error;
    }
  },

  /**
   * Create a new psychologist
   * POST /psychologists
   */
  createPsychologist: async (psychologistData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychologists`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(psychologistData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create psychologist: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, id: data.id, data };
    } catch (error) {
      console.error('Error creating psychologist:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update psychologist profile
   * PUT /psychologists/{id}
   */
  updatePsychologist: async (id, psychologistData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychologists/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(psychologistData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update psychologist: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error updating psychologist:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete psychologist
   * DELETE /psychologists/{id}
   */
  deletePsychologist: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/psychologists/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete psychologist: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting psychologist:', error);
      throw error;
    }
  },

  // ==================== PSYCHOLOGIST SETTINGS ====================

  /**
   * Update psychologist booking limits
   * PUT /admin/psychologists/{psychologistId}/booking-limits
   */
  updatePsychologistSettings: async (id, settingsData) => {
    try {
      console.log('Updating psychologist booking limits:', { id, settingsData });
      
      // Convert to backend expected format
      const requestData = {
        weekly_booking_limit: settingsData.weeklySessionsAllowed || settingsData.weekly_booking_limit,
        monthly_booking_limit: settingsData.monthlySessionsAllowed || settingsData.monthly_booking_limit
      };

      const response = await fetch(
        `${API_BASE_URL}/admin/psychologists/${id}/booking-limits`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to update booking limits: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('Backend error response:', errorData);
        } catch (e) {
          console.error('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Booking limits updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating booking limits:', error);
      throw error;
    }
  },

  /**
   * Get psychologist booking limits and usage
   * GET /admin/psychologists/{psychologistId}/booking-limits
   */
  getPsychologistBookingLimits: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/psychologists/${id}/booking-limits`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch booking limits: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching booking limits:', error);
      throw error;
    }
  },

  // ==================== ADMIN OPERATIONS ====================

  /**
   * Get all psychologists with booking statistics
   * GET /admin/psychologists-overview
   */
  getPsychologistsOverview: async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/psychologists-overview`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch overview: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching overview:', error);
      throw error;
    }
  },

  /**
   * Temporarily disable a psychologist
   * POST /admin/psychologists/{id}/disable
   */
  disablePsychologist: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/psychologists/${id}/disable`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to disable psychologist: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error disabling psychologist:', error);
      throw error;
    }
  },

  /**
   * Enable a previously disabled psychologist
   * POST /admin/psychologists/{id}/enable
   */
  enablePsychologist: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/psychologists/${id}/enable`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to enable psychologist: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error enabling psychologist:', error);
      throw error;
    }
  },

  /**
   * Get psychologist availability status
   * GET /admin/psychologists/{id}/status
   */
  getPsychologistStatus: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/psychologists/${id}/status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch status: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching status:', error);
      throw error;
    }
  },

  /**
   * Delete a psychologist (admin only)
   * DELETE /admin/psychologists/{id}
   */
  deletePsychologistAdmin: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/psychologists/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete psychologist: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error deleting psychologist:', error);
      throw error;
    }
  },

  /**
   * Set booking limits for a psychologist
   * PUT /admin/psychologists/{id}/booking-limits
   */
  setBookingLimits: async (id, limits) => {
    try {
      // Convert camelCase to snake_case for backend
      // Adding psychologist_id to request body as backend might need it
      const requestData = {
        psychologist_id: id, // Add psychologist ID to body
        weekly_booking_limit: limits.weeklyLimit || limits.weekly_booking_limit,
        monthly_booking_limit: limits.monthlyLimit || limits.monthly_booking_limit
      };

      console.log('Setting booking limits:');
      console.log('  - Psychologist ID:', id);
      console.log('  - Request Data:', JSON.stringify(requestData, null, 2));
      console.log('  - Full URL:', `${API_BASE_URL}/admin/psychologists/${id}/booking-limits`);
      console.log('  - Request Body:', JSON.stringify(requestData));

      const response = await fetch(
        `${API_BASE_URL}/admin/psychologists/${id}/booking-limits`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        let errorMessage = `Failed to set booking limits: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('Backend error:', errorData);
        } catch (e) {
          console.error('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Booking limits set successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error setting booking limits:', error);
      throw error;
    }
  },

  /**
   * Get psychologist booking limits and usage
   * GET /admin/psychologists/{id}/booking-limits
   */
  getBookingLimits: async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/psychologists/${id}/booking-limits`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch booking limits: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Convert snake_case response to camelCase for frontend
      if (data.success && data.data) {
        return {
          success: true,
          psychologist: data.data.psychologist,
          limits: {
            weeklyLimit: data.data.limits?.weekly_booking_limit,
            monthlyLimit: data.data.limits?.monthly_booking_limit,
          },
          usage: {
            weekly: data.data.current_usage?.weekly_bookings || 0,
            monthly: data.data.current_usage?.monthly_bookings || 0,
            weeklyRemaining: data.data.current_usage?.weekly_remaining,
            monthlyRemaining: data.data.current_usage?.monthly_remaining,
          }
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching booking limits:', error);
      throw error;
    }
  },
};

export default psychologistService;