// Authentication utility functions for JWT token management

const AuthService = {
    // Store JWT token
    setToken: (token: string): void => {
        localStorage.setItem('jwt_token', token);
    },

    // Get JWT token
    getToken: (): string | null => {
        return localStorage.getItem('jwt_token');
    },

    // Remove JWT token
    removeToken: (): void => {
        localStorage.removeItem('jwt_token');
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        const token = AuthService.getToken();
        if (!token) return false;

        try {
            // Basic JWT structure validation
            const payload = JSON.parse(atob(token.split('.')[1])); // atob - ASCII to Binary
            const currentTime = Date.now() / 1000;
            
            return payload.exp > currentTime;
        } catch (error) {
            AuthService.removeToken();
            return false;
        }
    },

    // Get authorization headers for API requests
    getAuthHeaders: (): Record<string, string> => {
        const token = AuthService.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // Make authenticated API request
    authenticatedFetch: async (url: string, options: RequestInit = {}): Promise<Response> => {
        const authHeaders = AuthService.getAuthHeaders();
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
                ...options.headers,
            },
        });

        if (response.status === 401) {
            AuthService.removeToken();
            window.location.href = '/login';
        }

        return response;
    }
};

export default AuthService;
