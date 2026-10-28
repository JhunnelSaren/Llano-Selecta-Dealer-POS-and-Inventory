const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchApi(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      let errorMsg = `Server responded with ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch (e) {
        // ignore json parse error
      }
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  get: (endpoint) => fetchApi(endpoint, { method: 'GET' }),
  post: (endpoint, body) => fetchApi(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => fetchApi(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => fetchApi(endpoint, { method: 'DELETE' }),
  logAudit: (userName = 'Staff', role = 'Staff', action = 'INFO', module = 'General', description = '', details = null, severity = 'info') => {
    return fetchApi('/api/audit-logs', {
      method: 'POST',
      body: JSON.stringify({ user_name: userName, role, action, module, description, details, severity })
    }).catch(() => null);
  }
};

export default api;
