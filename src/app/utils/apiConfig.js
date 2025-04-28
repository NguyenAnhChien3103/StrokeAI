const API_BASE_URL = "http://localhost:5062/api";

const API_ENDPOINTS = {
  login: `${API_BASE_URL}/User/login`,
  forgotPassword: `${API_BASE_URL}/User/forgot-password`,
  register: `${API_BASE_URL}/User/register`,
  resetPassword: `${API_BASE_URL}/User/reset-password`,
  verifyRegisterOtp: `${API_BASE_URL}/User/verifyotp`,
  verifyUpdateOtp: `${API_BASE_URL}/Otp/verify-and-update`,
  getDevicesID: (userId) => `${API_BASE_URL}/Devices/get-devices/${userId}`,
  getDailyMedicalData: (date, deviceId) => `${API_BASE_URL}/UserMedicalDatas/daily/${date}/${deviceId}`,
  getAverageLast14Days: (deviceId) => `${API_BASE_URL}/UserMedicalDatas/average-last-14-days/${deviceId}`,
  createAdmin: `${API_BASE_URL}/admin/create-admin`,
  changePassword: `${API_BASE_URL}/User/change-password`,
  deleteDevice: (deviceId) => `${API_BASE_URL}/devices/delete-device/${deviceId}`,
  addDevice: `${API_BASE_URL}/devices/add-device`,
  getDevices: (userId) => `${API_BASE_URL}/Devices/get-devices/${userId}`,
  updateBasicInfo: `${API_BASE_URL}/User/update-basic-info`,
  sendOtp: `${API_BASE_URL}/Otp/send-otp`, 
  addClinicalIndicator: `${API_BASE_URL}/Indicators/add-clinical-indicator`,  
  createInvitation: (userId) => `${API_BASE_URL}/Invition/create-invitation?userId=${userId}`,
  getRelationship: (userId) => `${API_BASE_URL}/Invition/get-relationship?userId=${userId}`,
  useInvitation: `${API_BASE_URL}/Invition/use-invitation`,
  deleteRelationship: (id) => `${API_BASE_URL}/Invition/delete-relationship/${id}`,
  getUsers: `${API_BASE_URL}/admin/users`,
  addAdminRole: (userId) => `${API_BASE_URL}/admin/add-admin-role/${userId}`,
  removeAdmin: (userId) => `${API_BASE_URL}/admin/remove-admin/${userId}`, 
  deleteUser: (userId) => `${API_BASE_URL}/admin/delete-user/${userId}`, 
  getUserGps: (inviterId) => `${API_BASE_URL}/User/user-gps?userId=${inviterId}`,
  getPercentIndicatorIsTrue: (userId) => `${API_BASE_URL}/Indicators/get-percent-indicator-is-true?userId=${userId}`,
  getAverageDailyNightLast14Days : (deviceId) => `${API_BASE_URL}/UserMedicalDatas/average-daily-night-last-14-days/${deviceId}`,

  addClinicalIndicator: `${API_BASE_URL}/Indicators/add-clinical-indicator`,
  getUserDetails: `${API_BASE_URL}/Users/details`,
  updateUser: `${API_BASE_URL}/Users/update`,
};

export default API_ENDPOINTS;