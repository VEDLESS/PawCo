// Mobile API Client
// Note: On Android emulator use http://10.0.2.2:5000/api, on iOS simulator use http://localhost:5000/api, or LAN IP for physical device
export const API_BASE_URL = 'http://localhost:5000/api';
export const SOCKET_BASE_URL = 'http://localhost:5000';

let authToken: string | null = null;
let refreshToken: string | null = null;

export const setMobileTokens = (access: string, refresh: string) => {
  authToken = access;
  refreshToken = refresh;
};

export const clearMobileTokens = () => {
  authToken = null;
  refreshToken = null;
};

export const getAuthToken = () => authToken;

export const mobileApi = {
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || `Status ${res.status}` };
      }
      return json;
    } catch (err: any) {
      return { success: false, error: err.message || 'Mobile network request error' };
    }
  },

  get<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  post<T = any>(endpoint: string, body: any) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  put<T = any>(endpoint: string, body: any) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },

  patch<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'PATCH', ...(body && { body: JSON.stringify(body) }) });
  },

  delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};
