// API configuration for connecting to backend
const getApiBaseUrl = () => {
  // In Docker environment, use backend service name
  if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }
  // In Replit development environment  
  if (process.env.NODE_ENV !== 'production' && window.location.hostname.includes('replit.dev')) {
    return 'https://80540686-2f0d-4a76-aca5-3444fc74eca7-00-23edebdpz039y.riker.replit.dev:8000';
  }
  // In production, API calls will be relative to the same origin
  return '';
};

const API_BASE_URL = getApiBaseUrl();

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