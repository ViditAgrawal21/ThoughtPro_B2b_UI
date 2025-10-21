import { apiService } from './api';

class PasswordService {
  // Login with temporary password (first time login check)
  async loginWithTemporaryPassword(email, temporaryPassword) {
    try {
      const response = await apiService.post('/auth/supabase/login-temp', {
        email,
        temporaryPassword
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to login with temporary password');
    }
  }

  // Update temporary password to permanent password
  async updateTemporaryPassword(email, temporaryPassword, newPassword) {
    try {
      const response = await apiService.put('/auth/supabase/update-temp-password', {
        email,
        temporaryPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update password');
    }
  }

  // Check if user needs password setup (demo/fallback method)
  async checkPasswordSetupRequired(email, userType = 'company') {
    try {
      // Try to login with temp password to check if it exists
      const response = await this.loginWithTemporaryPassword(email, 'temp');
      return { requiresSetup: response.requiresPasswordChange || false };
    } catch (error) {
      // If error, assume normal login flow
      return { requiresSetup: false };
    }
  }

  // Set password for first time login (combined method)
  async setFirstTimePassword(email, temporaryPassword, newPassword) {
    try {
      return await this.updateTemporaryPassword(email, temporaryPassword, newPassword);
    } catch (error) {
      throw new Error('Failed to set new password');
    }
  }

  // Send password reset link to personal email
  async sendPasswordResetToPersonalEmail(email, personalEmail) {
    try {
      const response = await apiService.post('/companies/forgot-password/personal-email', {
        email,
        personalEmail
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send password reset link');
    }
  }
}

const passwordService = new PasswordService();
export default passwordService;