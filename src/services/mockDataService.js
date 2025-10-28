// Mock Data Service for Company Dashboard

class MockDataService {
  // Generate mock dashboard data
  getMockDashboardData() {
    return {
      productivity: {
        daily: {
          value: '4',
          period: 'Daily',
          trend: 'down',
          trendValue: '-2%'
        },
        weekly: {
          value: '9.2',
          period: 'Weekly',
          trend: 'down',
          trendValue: '-3%'
        },
        today: {
          value: '8.8',
          period: 'Today',
          trend: 'down',
          trendValue: '-1%'
        },
        yesterday: {
          value: '4.7',
          period: 'Yesterday',
          trend: 'down',
          trendValue: '-2%'
        },
        thisWeek: {
          value: '3.5',
          period: 'This Week',
          trend: 'down',
          trendValue: '-4%'
        }
      },
      phoneUsageWeekdays: {
        daily: {
          value: '3.45',
          period: 'Daily',
          trend: 'down',
          trendValue: '-3%'
        },
        weekly: {
          value: '5.26',
          period: 'Weekly',
          trend: 'down',
          trendValue: '-5%'
        },
        today: {
          value: '2.79',
          period: 'Today',
          trend: 'down',
          trendValue: '-8%'
        },
        yesterday: {
          value: '4.77',
          period: 'Yesterday',
          trend: 'down',
          trendValue: '-2%'
        },
        thisWeek: {
          value: '4.60',
          period: 'This Week',
          trend: 'down',
          trendValue: '-6%'
        }
      },
      phoneUsageWork: {
        daily: {
          value: '2.45',
          period: 'Daily',
          trend: 'down',
          trendValue: '-4%'
        },
        weekly: {
          value: '2.94',
          period: 'Weekly',
          trend: 'down',
          trendValue: '-3%'
        },
        today: {
          value: '1.64',
          period: 'Today',
          trend: 'down',
          trendValue: '-7%'
        },
        yesterday: {
          value: '1.42',
          period: 'Yesterday',
          trend: 'down',
          trendValue: '-5%'
        },
        thisWeek: {
          value: '1.61',
          period: 'This Week',
          trend: 'down',
          trendValue: '-6%'
        }
      }
    };
  }

  // Simulate API call with delay
  async fetchMockData(delay = 500) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getMockDashboardData());
      }, delay);
    });
  }
}

export const mockDataService = new MockDataService();
export default mockDataService;
