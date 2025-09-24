// API configuration for connecting to backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // In production, API calls will be relative to the same origin (port 5000)
  : 'https://80540686-2f0d-4a76-aca5-3444fc74eca7-00-23edebdpz039y.riker.replit.dev:8000';

export const apiRequest = async (endpoint, options = {}) => {
  const config = {
    credentials: 'include', // Important for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }
  
  return response.json();
};

export default API_BASE_URL;