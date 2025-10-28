// holidayService.js - Fetch holidays from external sources and backend

const BASE_URL = process.env.REACT_APP_API_URL || 'https://thoughtprob2b.thoughthealer.org/api/v1';

// Indian public holidays for 2025 (source: timeanddate.com/holidays/india/2025)
const INDIAN_HOLIDAYS_2025 = [
  { date: '2025-01-14', description: 'Makar Sankranti / Pongal', type: 'Festival' },
  { date: '2025-01-26', description: 'Republic Day', type: 'National' },
  { date: '2025-02-26', description: 'Maha Shivaratri', type: 'Festival' },
  { date: '2025-03-14', description: 'Holi', type: 'Festival' },
  { date: '2025-03-30', description: 'Eid ul-Fitr', type: 'Festival' },
  { date: '2025-03-31', description: 'Ram Navami', type: 'Festival' },
  { date: '2025-04-04', description: 'Mahavir Jayanti', type: 'Festival' },
  { date: '2025-04-10', description: 'Rama Navami', type: 'Festival' },
  { date: '2025-04-13', description: 'Vaisakhi', type: 'Festival' },
  { date: '2025-04-14', description: 'Ambedkar Jayanti', type: 'National' },
  { date: '2025-04-18', description: 'Good Friday', type: 'Festival' },
  { date: '2025-05-01', description: 'May Day', type: 'National' },
  { date: '2025-05-12', description: 'Buddha Purnima', type: 'Festival' },
  { date: '2025-06-06', description: 'Eid ul-Adha', type: 'Festival' },
  { date: '2025-07-06', description: 'Muharram', type: 'Festival' },
  { date: '2025-08-15', description: 'Independence Day', type: 'National' },
  { date: '2025-08-16', description: 'Parsi New Year', type: 'Festival' },
  { date: '2025-08-27', description: 'Janmashtami', type: 'Festival' },
  { date: '2025-09-05', description: 'Milad un-Nabi', type: 'Festival' },
  { date: '2025-10-02', description: 'Gandhi Jayanti / Mahatma Gandhi Birthday', type: 'National' },
  { date: '2025-10-02', description: 'Dussehra', type: 'Festival' },
  { date: '2025-10-20', description: 'Diwali / Deepavali', type: 'Festival' },
  { date: '2025-10-21', description: 'Govardhan Puja', type: 'Festival' },
  { date: '2025-11-05', description: 'Guru Nanak Jayanti', type: 'Festival' },
  { date: '2025-12-25', description: 'Christmas', type: 'Festival' }
];

// Indian public holidays for 2026 (source: timeanddate.com/holidays/india/2026)
const INDIAN_HOLIDAYS_2026 = [
  { date: '2026-01-14', description: 'Makar Sankranti / Pongal', type: 'Festival' },
  { date: '2026-01-26', description: 'Republic Day', type: 'National' },
  { date: '2026-02-16', description: 'Maha Shivaratri', type: 'Festival' },
  { date: '2026-03-04', description: 'Holi', type: 'Festival' },
  { date: '2026-03-20', description: 'Eid ul-Fitr', type: 'Festival' },
  { date: '2026-03-28', description: 'Ram Navami', type: 'Festival' },
  { date: '2026-04-03', description: 'Good Friday', type: 'Festival' },
  { date: '2026-04-06', description: 'Mahavir Jayanti', type: 'Festival' },
  { date: '2026-04-13', description: 'Vaisakhi', type: 'Festival' },
  { date: '2026-04-14', description: 'Ambedkar Jayanti', type: 'National' },
  { date: '2026-05-01', description: 'May Day', type: 'National' },
  { date: '2026-05-01', description: 'Buddha Purnima', type: 'Festival' },
  { date: '2026-05-27', description: 'Eid ul-Adha', type: 'Festival' },
  { date: '2026-06-25', description: 'Muharram', type: 'Festival' },
  { date: '2026-08-15', description: 'Independence Day', type: 'National' },
  { date: '2026-08-15', description: 'Janmashtami', type: 'Festival' },
  { date: '2026-08-25', description: 'Milad un-Nabi', type: 'Festival' },
  { date: '2026-09-21', description: 'Dussehra', type: 'Festival' },
  { date: '2026-10-02', description: 'Gandhi Jayanti / Mahatma Gandhi Birthday', type: 'National' },
  { date: '2026-10-09', description: 'Diwali / Deepavali', type: 'Festival' },
  { date: '2026-10-10', description: 'Govardhan Puja', type: 'Festival' },
  { date: '2026-11-24', description: 'Guru Nanak Jayanti', type: 'Festival' },
  { date: '2026-12-25', description: 'Christmas', type: 'Festival' }
];

// Indian public holidays for 2024 (for backward compatibility)
const INDIAN_HOLIDAYS_2024 = [
  { date: '2024-01-14', description: 'Makar Sankranti / Pongal', type: 'Festival' },
  { date: '2024-01-26', description: 'Republic Day', type: 'National' },
  { date: '2024-03-08', description: 'Maha Shivaratri', type: 'Festival' },
  { date: '2024-03-25', description: 'Holi', type: 'Festival' },
  { date: '2024-03-29', description: 'Good Friday', type: 'Festival' },
  { date: '2024-04-11', description: 'Eid ul-Fitr', type: 'Festival' },
  { date: '2024-04-17', description: 'Ram Navami', type: 'Festival' },
  { date: '2024-04-21', description: 'Mahavir Jayanti', type: 'Festival' },
  { date: '2024-05-01', description: 'May Day', type: 'National' },
  { date: '2024-05-23', description: 'Buddha Purnima', type: 'Festival' },
  { date: '2024-06-17', description: 'Eid ul-Adha', type: 'Festival' },
  { date: '2024-07-17', description: 'Muharram', type: 'Festival' },
  { date: '2024-08-15', description: 'Independence Day', type: 'National' },
  { date: '2024-08-26', description: 'Janmashtami', type: 'Festival' },
  { date: '2024-09-16', description: 'Milad un-Nabi', type: 'Festival' },
  { date: '2024-10-02', description: 'Gandhi Jayanti', type: 'National' },
  { date: '2024-10-12', description: 'Dussehra', type: 'Festival' },
  { date: '2024-10-31', description: 'Diwali / Deepavali', type: 'Festival' },
  { date: '2024-11-01', description: 'Govardhan Puja', type: 'Festival' },
  { date: '2024-11-15', description: 'Guru Nanak Jayanti', type: 'Festival' },
  { date: '2024-12-25', description: 'Christmas', type: 'Festival' }
];

export const holidayService = {
  /**
   * Get holidays for the current year (from local data)
   */
  getHolidaysForYear: (year = new Date().getFullYear()) => {
    if (year === 2026) {
      return INDIAN_HOLIDAYS_2026;
    } else if (year === 2025) {
      return INDIAN_HOLIDAYS_2025;
    } else if (year === 2024) {
      return INDIAN_HOLIDAYS_2024;
    }
    // For other years, return empty array or fetch from API
    return [];
  },

  /**
   * Get all holidays from backend
   */
  getBackendHolidays: async () => {
    try {
      const response = await fetch(`${BASE_URL}/holidays`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch holidays from backend');
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error fetching backend holidays:', error);
      return [];
    }
  },

  /**
   * Get combined holidays (backend + local)
   */
  getAllHolidays: async (year = new Date().getFullYear()) => {
    try {
      // Get holidays from backend
      const backendHolidays = await holidayService.getBackendHolidays();
      
      // Get local holidays for the year
      const localHolidays = holidayService.getHolidaysForYear(year);
      
      // Combine and remove duplicates based on date
      const holidayMap = new Map();
      
      // Add backend holidays first (they take priority)
      backendHolidays.forEach(holiday => {
        const date = holiday.date.split('T')[0];
        holidayMap.set(date, holiday);
      });
      
      // Add local holidays if not already present
      localHolidays.forEach(holiday => {
        if (!holidayMap.has(holiday.date)) {
          holidayMap.set(holiday.date, holiday);
        }
      });
      
      return Array.from(holidayMap.values());
    } catch (error) {
      console.error('Error getting all holidays:', error);
      // Fallback to local holidays
      return holidayService.getHolidaysForYear(year);
    }
  },

  /**
   * Sync local holidays to backend (admin function)
   */
  syncHolidaysToBackend: async (year = new Date().getFullYear()) => {
    try {
      const localHolidays = holidayService.getHolidaysForYear(year);
      const backendHolidays = await holidayService.getBackendHolidays();
      
      // Find holidays that don't exist in backend
      const backendDates = new Set(backendHolidays.map(h => h.date.split('T')[0]));
      const holidaysToAdd = localHolidays.filter(h => !backendDates.has(h.date));
      
      // Add missing holidays to backend
      const results = [];
      for (const holiday of holidaysToAdd) {
        try {
          const response = await fetch(`${BASE_URL}/holidays`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
              date: holiday.date,
              description: holiday.description
            })
          });
          
          if (response.ok) {
            results.push({ success: true, holiday });
          }
        } catch (err) {
          console.error(`Failed to sync holiday ${holiday.description}:`, err);
          results.push({ success: false, holiday, error: err.message });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error syncing holidays:', error);
      throw error;
    }
  }
};

export default holidayService;
