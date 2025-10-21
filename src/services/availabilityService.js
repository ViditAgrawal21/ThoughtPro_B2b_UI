import { apiService } from './api';

class AvailabilityService {
  // Availability Management Operations for Psychologists

  // Get availability by psychologist ID (according to API documentation)
  async getAvailabilityByPsychologist(psychologistId) {
    try {
      const response = await apiService.get(`/api/v1/availability/${psychologistId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch psychologist availability');
    }
  }

  // Update availability status (according to API documentation)
  async updateAvailabilityStatus(availabilityId, statusData) {
    try {
      const response = await apiService.patch(`/api/v1/availability/${availabilityId}`, statusData);
      return response;
    } catch (error) {
      throw new Error('Failed to update availability status');
    }
  }

  // Create availability slots for all psychologists (Bulk Operation)
  async populateNDaysAvailability(populateData) {
    try {
      const response = await apiService.post('/api/v1/availability/populate-n-days', populateData);
      return response;
    } catch (error) {
      throw new Error('Failed to populate availability for N days');
    }
  }

  // Toggle availability for a full day
  async toggleDayAvailability(toggleData) {
    try {
      const response = await apiService.patch('/api/v1/availability/toggle-day', toggleData);
      return response;
    } catch (error) {
      throw new Error('Failed to toggle day availability');
    }
  }

  // Get all holidays
  async getAllHolidays() {
    try {
      const response = await apiService.get('/api/v1/holidays');
      return response;
    } catch (error) {
      throw new Error('Failed to fetch holidays');
    }
  }

  // Add a holiday
  async addHoliday(holidayData) {
    try {
      const response = await apiService.post('/api/v1/holidays', holidayData);
      return response;
    } catch (error) {
      throw new Error('Failed to add holiday');
    }
  }

  // Delete a holiday
  async deleteHoliday(holidayId) {
    try {
      const response = await apiService.delete(`/api/v1/holidays/${holidayId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to delete holiday');
    }
  }

  async getAvailability(psychologistId = null, date = null) {
    try {
      const params = new URLSearchParams();
      if (psychologistId) params.append('psychologistId', psychologistId);
      if (date) params.append('date', date);
      
      const response = await apiService.get(`/api/v1/availability?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch availability');
    }
  }

  async createAvailability(availabilityData) {
    try {
      const response = await apiService.post('/api/v1/availability', availabilityData);
      return response;
    } catch (error) {
      throw new Error('Failed to create availability');
    }
  }

  async updateAvailability(availabilityId, availabilityData) {
    try {
      const response = await apiService.patch(`/api/v1/availability/${availabilityId}`, availabilityData);
      return response;
    } catch (error) {
      throw new Error('Failed to update availability');
    }
  }

  async deleteAvailability(availabilityId) {
    try {
      const response = await apiService.delete(`/api/v1/availability/${availabilityId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to delete availability');
    }
  }

  async getMyAvailability(date = null, period = 'week') {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      params.append('period', period);
      
      const response = await apiService.get(`/api/v1/availability/my-availability?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch my availability');
    }
  }

  async setMyAvailability(availabilityData) {
    try {
      const response = await apiService.post('/api/v1/availability/my-availability', availabilityData);
      return response;
    } catch (error) {
      throw new Error('Failed to set my availability');
    }
  }

  async updateMyAvailability(availabilityData) {
    try {
      const response = await apiService.put('/api/v1/availability/my-availability', availabilityData);
      return response;
    } catch (error) {
      throw new Error('Failed to update my availability');
    }
  }

  async deleteMyAvailability(date = null) {
    try {
      const params = date ? `?date=${date}` : '';
      const response = await apiService.delete(`/api/v1/availability/my-availability${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to delete my availability');
    }
  }

  async searchAvailability(searchParams = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key]) {
          params.append(key, searchParams[key]);
        }
      });
      
      const response = await apiService.get(`/api/v1/availability/search?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to search availability');
    }
  }

  // Additional utility methods
  async getAvailableSlots(psychologistId, date, duration = 60) {
    try {
      const params = new URLSearchParams();
      params.append('psychologistId', psychologistId);
      params.append('date', date);
      params.append('duration', duration);
      
      const response = await apiService.get(`/api/v1/availability/slots?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch available slots');
    }
  }

  async bulkCreateAvailability(availabilityList) {
    try {
      const response = await apiService.post('/api/v1/availability/bulk', { availabilities: availabilityList });
      return response;
    } catch (error) {
      throw new Error('Failed to create bulk availability');
    }
  }

  async getRecurringAvailability(psychologistId = null) {
    try {
      const params = psychologistId ? `?psychologistId=${psychologistId}` : '';
      const response = await apiService.get(`/api/v1/availability/recurring${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch recurring availability');
    }
  }

  async setRecurringAvailability(recurringData) {
    try {
      const response = await apiService.post('/api/v1/availability/recurring', recurringData);
      return response;
    } catch (error) {
      throw new Error('Failed to set recurring availability');
    }
  }
}

export const availabilityService = new AvailabilityService();
export default availabilityService;