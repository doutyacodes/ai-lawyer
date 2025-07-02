// Client-side auth + form storage

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];
  console.log("token available",token)
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function getUserFromToken() {
  if (typeof window === 'undefined') return null;

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp <= Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}

export const formStorage = {
  save: (key, data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`legal_assistant_${key}`, JSON.stringify(data));
    }
  },

  load: (key) => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(`legal_assistant_${key}`);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  clear: (key) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`legal_assistant_${key}`);
    }
  },

  clearAll: () => {
    if (typeof window !== 'undefined') {
      Object.keys(localStorage)
        .filter(key => key.startsWith('legal_assistant_'))
        .forEach(key => localStorage.removeItem(key));
    }
  }
};
