// Mock data service for fallback when API is unavailable
export const mockDataService = {
  // Mock dashboard data
  getDashboardData() {
    return {
      success: true,
      data: {
        productivity: {
          daily: { value: '6.2 Hours', trend: 'up', trendValue: '15 Minutes' },
          weekly: { value: '32 Hours', trend: 'up', trendValue: '2.5 Hours' },
          today: { value: '5.8 Hours', trend: 'up', trendValue: '20 Minutes' },
          yesterday: { value: '6.1 Hours', trend: 'down', trendValue: '10 Minutes' },
          thisWeek: { value: '30 Hours', trend: 'up', trendValue: '4 Hours' }
        },
        phoneUsageWeekdays: {
          daily: { value: '2.3 Hours', trend: 'down', trendValue: '25 Minutes' },
          weekly: { value: '12 Hours', trend: 'down', trendValue: '1.2 Hours' },
          today: { value: '1.8 Hours', trend: 'down', trendValue: '30 Minutes' },
          yesterday: { value: '2.5 Hours', trend: 'up', trendValue: '15 Minutes' },
          thisWeek: { value: '11 Hours', trend: 'down', trendValue: '2 Hours' }
        },
        phoneUsageWork: {
          daily: { value: '1.4 Hours', trend: 'down', trendValue: '20 Minutes' },
          weekly: { value: '7.5 Hours', trend: 'up', trendValue: '45 Minutes' },
          today: { value: '1.2 Hours', trend: 'down', trendValue: '18 Minutes' },
          yesterday: { value: '1.6 Hours', trend: 'up', trendValue: '12 Minutes' },
          thisWeek: { value: '6.8 Hours', trend: 'down', trendValue: '1 Hour' }
        }
      }
    };
  },

  // Mock companies data
  getCompanies() {
    return {
      success: true,
      data: {
        companies: [
          {
            id: 1,
            name: 'TechCorp Solutions',
            industry: 'Technology',
            employeeCount: 150,
            subscriptionStatus: 'Active',
            description: 'Leading technology solutions provider specializing in enterprise software.',
            createdAt: '2024-01-15T10:00:00Z',
            logo: null
          },
          {
            id: 2,
            name: 'HealthCare Plus',
            industry: 'Healthcare',
            employeeCount: 200,
            subscriptionStatus: 'Active',
            description: 'Comprehensive healthcare services with focus on employee wellness.',
            createdAt: '2024-02-20T14:30:00Z',
            logo: null
          },
          {
            id: 3,
            name: 'Finance Pro',
            industry: 'Finance',
            employeeCount: 80,
            subscriptionStatus: 'Trial',
            description: 'Financial services and consulting for small to medium businesses.',
            createdAt: '2024-03-10T09:15:00Z',
            logo: null
          }
        ],
        total: 3,
        page: 1,
        limit: 10
      }
    };
  },

  // Mock psychologists data
  getPsychologists() {
    return {
      success: true,
      data: {
        psychologists: [
          {
            id: 1,
            firstName: 'Sarah',
            lastName: 'Johnson',
            title: 'Clinical Psychologist',
            email: 'sarah.johnson@thoughtpro.com',
            phone: '+1-555-0123',
            location: 'Remote',
            specializations: ['CBT', 'Anxiety', 'Depression', 'Workplace Stress'],
            availability: 'available',
            rating: 4.9,
            reviewCount: 156,
            totalSessions: 342,
            thisWeekSessions: 12,
            experience: 8,
            nextAvailable: 'Today 3:00 PM',
            workingHours: '9 AM - 7 PM',
            profileImage: null
          },
          {
            id: 2,
            firstName: 'Michael',
            lastName: 'Chen',
            title: 'Licensed Therapist',
            email: 'michael.chen@thoughtpro.com',
            phone: '+1-555-0124',
            location: 'Hybrid',
            specializations: ['Family Therapy', 'Relationship Counseling', 'Trauma'],
            availability: 'busy',
            rating: 4.8,
            reviewCount: 203,
            totalSessions: 567,
            thisWeekSessions: 15,
            experience: 12,
            nextAvailable: 'Tomorrow 10:00 AM',
            workingHours: '8 AM - 6 PM',
            profileImage: null
          },
          {
            id: 3,
            firstName: 'Emily',
            lastName: 'Rodriguez',
            title: 'Behavioral Therapist',
            email: 'emily.rodriguez@thoughtpro.com',
            phone: '+1-555-0125',
            location: 'In-Person',
            specializations: ['ADHD', 'Autism Spectrum', 'Behavioral Issues'],
            availability: 'available',
            rating: 4.7,
            reviewCount: 89,
            totalSessions: 178,
            thisWeekSessions: 8,
            experience: 5,
            nextAvailable: 'Today 4:30 PM',
            workingHours: '10 AM - 8 PM',
            profileImage: null
          }
        ],
        total: 3,
        page: 1,
        limit: 10
      }
    };
  },

  // Mock bookings data
  getBookings() {
    return {
      success: true,
      data: {
        bookings: [
          {
            id: 1,
            scheduledDateTime: '2024-10-21T14:00:00Z',
            duration: 60,
            status: 'confirmed',
            type: 'Individual',
            mode: 'Video Call',
            employee: {
              firstName: 'John',
              lastName: 'Doe',
              profileImage: null,
              company: { name: 'TechCorp Solutions' }
            },
            psychologist: {
              firstName: 'Sarah',
              lastName: 'Johnson',
              specialization: 'Clinical Psychology'
            }
          },
          {
            id: 2,
            scheduledDateTime: '2024-10-21T15:30:00Z',
            duration: 45,
            status: 'pending',
            type: 'Individual',
            mode: 'Phone Call',
            employee: {
              firstName: 'Jane',
              lastName: 'Smith',
              profileImage: null,
              company: { name: 'HealthCare Plus' }
            },
            psychologist: {
              firstName: 'Michael',
              lastName: 'Chen',
              specialization: 'Family Therapy'
            }
          },
          {
            id: 3,
            scheduledDateTime: '2024-10-22T10:00:00Z',
            duration: 60,
            status: 'completed',
            type: 'Individual',
            mode: 'In-Person',
            employee: {
              firstName: 'Robert',
              lastName: 'Wilson',
              profileImage: null,
              company: { name: 'Finance Pro' }
            },
            psychologist: {
              firstName: 'Emily',
              lastName: 'Rodriguez',
              specialization: 'Behavioral Therapy'
            }
          }
        ],
        total: 3,
        page: 1,
        limit: 10
      }
    };
  },

  // Mock employees data
  getEmployees() {
    return {
      success: true,
      data: {
        employees: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@techcorp.com',
            department: 'Engineering',
            position: 'Senior Developer',
            company: { name: 'TechCorp Solutions' },
            status: 'active',
            joinDate: '2023-03-15',
            profileImage: null
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@healthcare.com',
            department: 'Operations',
            position: 'Operations Manager',
            company: { name: 'HealthCare Plus' },
            status: 'active',
            joinDate: '2023-01-20',
            profileImage: null
          }
        ],
        total: 2,
        page: 1,
        limit: 10
      }
    };
  },

  // Get all employees (array format for easier filtering)
  getAllEmployees() {
    return [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        position: 'Senior Developer',
        company_id: 'company-1',
        company_name: 'Demo Company Ltd',
        status: 'active',
        joinDate: '2023-03-15',
        profileImage: null
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        department: 'Operations',
        position: 'Operations Manager',
        company_id: 'company-1',
        company_name: 'Demo Company Ltd',
        status: 'active',
        joinDate: '2023-01-20',
        profileImage: null
      },
      {
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        name: 'Bob Johnson',
        email: 'bob.johnson@company.com',
        department: 'Marketing',
        position: 'Marketing Specialist',
        company_id: 'company-1',
        company_name: 'Demo Company Ltd',
        status: 'active',
        joinDate: '2023-05-10',
        profileImage: null
      },
      {
        id: 4,
        firstName: 'Alice',
        lastName: 'Brown',
        name: 'Alice Brown',
        email: 'alice.brown@techcorp.com',
        department: 'HR',
        position: 'HR Manager',
        company_id: 'company-2',
        company_name: 'Tech Corp Solutions',
        status: 'active',
        joinDate: '2023-02-28',
        profileImage: null
      }
    ];
  },

  // Get employees filtered by company
  getEmployeesByCompany(companyId) {
    const allEmployees = this.getAllEmployees();
    return allEmployees.filter(emp => emp.company_id === companyId);
  },

  // Get bookings by company
  getBookingsByCompany(companyId) {
    const allBookings = [
      {
        id: 1,
        employee_name: 'John Doe',
        employee_id: 1,
        psychologist_name: 'Dr. Sarah Johnson',
        psychologist_id: 1,
        session_date: '2024-10-25',
        session_time: '10:00 AM',
        status: 'scheduled',
        company_id: 'company-1'
      },
      {
        id: 2,
        employee_name: 'Jane Smith',
        employee_id: 2,
        psychologist_name: 'Dr. Michael Brown',
        psychologist_id: 2,
        session_date: '2024-10-24',
        session_time: '2:00 PM',
        status: 'completed',
        company_id: 'company-1'
      },
      {
        id: 3,
        employee_name: 'Bob Johnson',
        employee_id: 3,
        psychologist_name: 'Dr. Sarah Johnson',
        psychologist_id: 1,
        session_date: '2024-10-26',
        session_time: '11:00 AM',
        status: 'scheduled',
        company_id: 'company-1'
      }
    ];
    
    return allBookings.filter(booking => booking.company_id === companyId);
  },

  // Company Management Methods
  getAllCompanies() {
    return [
      {
        id: 'company-1',
        name: 'Demo Company Ltd',
        email: 'contact@democompany.com',
        phone: '+1-555-0100',
        address: '123 Business St, City, State 12345',
        contactPerson: 'John CEO',
        status: 'active',
        employeeCount: 150,
        subscriptionPlan: 'Premium',
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: '2024-10-20T15:30:00Z'
      },
      {
        id: 'company-2',
        name: 'Tech Corp Solutions',
        email: 'info@techcorp.com',
        phone: '+1-555-0200',
        address: '456 Tech Avenue, Innovation District 54321',
        contactPerson: 'Jane CTO',
        status: 'active',
        employeeCount: 200,
        subscriptionPlan: 'Enterprise',
        createdAt: '2023-02-20T14:00:00Z',
        updatedAt: '2024-10-19T11:20:00Z'
      },
      {
        id: 'company-3',
        name: 'Healthcare Plus',
        email: 'admin@healthcareplus.com',
        phone: '+1-555-0300',
        address: '789 Medical Center Blvd, Health City 67890',
        contactPerson: 'Dr. Smith',
        status: 'active',
        employeeCount: 80,
        subscriptionPlan: 'Standard',
        createdAt: '2023-03-10T09:15:00Z',
        updatedAt: '2024-10-18T16:45:00Z'
      }
    ];
  },

  getCompanyById(companyId) {
    const companies = this.getAllCompanies();
    return companies.find(company => company.id === companyId);
  },

  createCompany(companyData) {
    const newCompany = {
      id: 'company-' + Date.now(),
      ...companyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      employeeCount: 0,
      subscriptionPlan: 'Standard'
    };
    
    // In a real implementation, this would persist the data
    console.log('Mock: Created company', newCompany);
    return newCompany;
  },

  updateCompany(companyId, companyData) {
    const company = this.getCompanyById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    
    const updatedCompany = {
      ...company,
      ...companyData,
      updatedAt: new Date().toISOString()
    };
    
    // In a real implementation, this would persist the data
    console.log('Mock: Updated company', updatedCompany);
    return updatedCompany;
  },

  deleteCompany(companyId) {
    const company = this.getCompanyById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }
    
    // In a real implementation, this would delete the data
    console.log('Mock: Deleted company', companyId);
    return { success: true };
  },

  // Company Users Management
  getCompanyUsers(companyId) {
    return [
      {
        id: 1,
        name: 'Company Admin',
        email: 'admin@company.com',
        role: 'admin',
        company_id: companyId,
        status: 'active',
        createdAt: '2023-01-15T10:00:00Z'
      },
      {
        id: 2,
        name: 'HR Manager',
        email: 'hr@company.com',
        role: 'manager',
        company_id: companyId,
        status: 'active',
        createdAt: '2023-02-20T14:00:00Z'
      }
    ];
  },

  createCompanyUser(companyId, userData) {
    const newUser = {
      id: Date.now(),
      ...userData,
      company_id: companyId,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    console.log('Mock: Created company user', newUser);
    return newUser;
  },

  updateCompanyUser(companyId, userId, userData) {
    const user = {
      id: userId,
      company_id: companyId,
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    console.log('Mock: Updated company user', user);
    return user;
  },

  deleteCompanyUser(companyId, userId) {
    console.log('Mock: Deleted company user', userId, 'from company', companyId);
    return { success: true };
  },

  // Additional Dashboard Methods
  getProductivityMetrics(timeRange = 'week', companyId = null) {
    return {
      success: true,
      data: {
        timeRange,
        companyId,
        productivity: {
          average: 78,
          trend: 'up',
          trendValue: 5.2,
          details: {
            focused: '6.2 hours',
            distracted: '1.8 hours',
            breaks: '0.8 hours'
          }
        }
      }
    };
  },

  getPhoneUsageMetrics(timeRange = 'week', companyId = null) {
    return {
      success: true,
      data: {
        timeRange,
        companyId,
        phoneUsage: {
          average: '2.3 hours',
          trend: 'down',
          trendValue: -12,
          breakdown: {
            calls: '0.5 hours',
            messages: '1.2 hours',
            social: '0.6 hours'
          }
        }
      }
    };
  },

  getApplicationsData(companyId = null) {
    return {
      success: true,
      data: {
        companyId,
        applications: [
          { name: 'VS Code', usage: '4.2h', category: 'Development' },
          { name: 'Slack', usage: '1.8h', category: 'Communication' },
          { name: 'Chrome', usage: '3.5h', category: 'Browser' },
          { name: 'Excel', usage: '2.1h', category: 'Productivity' }
        ]
      }
    };
  },

  getExecutiveOverview(companyId = null) {
    return {
      success: true,
      data: {
        companyId,
        overview: {
          totalEmployees: 150,
          activeEmployees: 142,
          avgProductivity: 78,
          avgWellness: 85,
          totalSessions: 234,
          pendingBookings: 12
        }
      }
    };
  },

  getEmployeeMetrics(companyId = null) {
    return {
      success: true,
      data: {
        companyId,
        metrics: {
          totalEmployees: 150,
          activeToday: 135,
          onLeave: 8,
          avgProductivity: 78,
          topPerformers: [
            { name: 'John Doe', score: 95 },
            { name: 'Jane Smith', score: 92 },
            { name: 'Bob Johnson', score: 89 }
          ]
        }
      }
    };
  },

  getProductivityInsights(employeeId = null, dateRange = 'week') {
    return {
      success: true,
      data: {
        employeeId,
        dateRange,
        insights: {
          focusScore: 82,
          peakHours: '9-11 AM',
          suggestions: ['Take more breaks', 'Reduce meeting time'],
          trends: {
            week: 'improving',
            month: 'stable'
          }
        }
      }
    };
  },

  getCompanyDashboard(companyId) {
    return {
      success: true,
      data: {
        companyId,
        name: 'Demo Company Ltd',
        dashboard: {
          employees: 150,
          productivity: 78,
          wellness: 85,
          sessions: 234,
          recentActivity: [
            'New employee onboarded',
            'Wellness session completed',
            'Productivity goal achieved'
          ]
        }
      }
    };
  },

  getWellnessMetrics(companyId = null, period = 'month') {
    return {
      success: true,
      data: {
        companyId,
        period,
        wellness: {
          avgScore: 85,
          trend: 'up',
          categories: {
            stress: 72,
            satisfaction: 89,
            workLifeBalance: 81
          },
          sessionsCompleted: 234
        }
      }
    };
  },

  getBookingAnalytics(companyId = null, period = 'month') {
    return {
      success: true,
      data: {
        companyId,
        period,
        bookings: {
          total: 89,
          completed: 76,
          pending: 8,
          cancelled: 5,
          growth: 12.5
        }
      }
    };
  },

  getSubscriptionAnalytics(companyId = null, period = 'month') {
    return {
      success: true,
      data: {
        companyId,
        period,
        subscription: {
          plan: 'Premium',
          usage: 78,
          remainingSessions: 156,
          renewal: '2024-12-15'
        }
      }
    };
  },

  getRealtimeStats(companyId = null) {
    return {
      success: true,
      data: {
        companyId,
        timestamp: new Date().toISOString(),
        realtime: {
          activeEmployees: 89,
          ongoingSessions: 3,
          avgProductivity: 78,
          systemHealth: 'good'
        }
      }
    };
  }
};

export default mockDataService;