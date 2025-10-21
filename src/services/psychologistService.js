import { apiService } from './api';
import { mockDataService } from './mockDataService';

class PsychologistService {
  // Psychologist Management Operations
  
  async getAllPsychologists(page = 1, limit = 10, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await apiService.get(`/psychologists?${params}`);
      return response;
    } catch (error) {
      console.warn('Psychologists API unavailable, using mock data:', error.message);
      // Return mock data when API is not available
      return mockDataService.getPsychologists();
    }
  }

  async getPsychologistById(psychologistId) {
    try {
      const response = await apiService.get(`/psychologists/${psychologistId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch psychologist details');
    }
  }

  async createPsychologist(psychologistData) {
    try {
      const response = await apiService.post('/psychologists', psychologistData);
      return response;
    } catch (error) {
      throw new Error('Failed to create psychologist');
    }
  }

  async updatePsychologist(psychologistId, psychologistData) {
    try {
      const response = await apiService.put(`/psychologists/${psychologistId}`, psychologistData);
      return response;
    } catch (error) {
      throw new Error('Failed to update psychologist');
    }
  }

  async deletePsychologist(psychologistId) {
    try {
      const response = await apiService.delete(`/psychologists/${psychologistId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to delete psychologist');
    }
  }

  async getPsychologistAvailability(psychologistId, date = null) {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      
      const response = await apiService.get(`/psychologists/${psychologistId}/availability?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch psychologist availability');
    }
  }

  async updatePsychologistAvailability(psychologistId, availabilityData) {
    try {
      const response = await apiService.put(`/psychologists/${psychologistId}/availability`, availabilityData);
      return response;
    } catch (error) {
      throw new Error('Failed to update psychologist availability');
    }
  }

  async getPsychologistBookings(psychologistId, status = 'all', date = null) {
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.append('status', status);
      if (date) params.append('date', date);
      
      const response = await apiService.get(`/psychologists/${psychologistId}/bookings?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch psychologist bookings');
    }
  }

  async getPsychologistSchedule(psychologistId, startDate, endDate) {
    try {
      const params = new URLSearchParams();
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      
      const response = await apiService.get(`/psychologists/${psychologistId}/schedule?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch psychologist schedule');
    }
  }

  async getPsychologistStats(psychologistId, period = 'month') {
    try {
      const response = await apiService.get(`/psychologists/${psychologistId}/stats?period=${period}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch psychologist statistics');
    }
  }

  async addPsychologistHoliday(psychologistId, holidayData) {
    try {
      const response = await apiService.post(`/psychologists/${psychologistId}/holidays`, holidayData);
      return response;
    } catch (error) {
      throw new Error('Failed to add psychologist holiday');
    }
  }

  async removePsychologistHoliday(psychologistId, holidayId) {
    try {
      const response = await apiService.delete(`/psychologists/${psychologistId}/holidays/${holidayId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to remove psychologist holiday');
    }
  }

  async getPsychologistsBySpecialization(specialization) {
    try {
      const response = await apiService.get(`/psychologists/specialization/${specialization}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch psychologists by specialization');
    }
  }

  async searchPsychologists(query, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await apiService.get(`/psychologists/search?${params}`);
      return response;
    } catch (error) {
      throw new Error('Failed to search psychologists');
    }
  }
}

export const psychologistService = new PsychologistService();
export default psychologistService;