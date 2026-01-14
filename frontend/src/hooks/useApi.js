import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://lumina-backend-h0fi.onrender.com/api';

export function useApi() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const get = useCallback((endpoint) => request(endpoint), [request]);

  const post = useCallback((endpoint, body) => request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  }), [request]);

  const put = useCallback((endpoint, body) => request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  }), [request]);

  const del = useCallback((endpoint) => request(endpoint, {
    method: 'DELETE'
  }), [request]);

  return { get, post, put, del, loading, error };
}

export function useScrollAnimation() {
  const observeElements = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.slide-left, .slide-right, .slide-up, .animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return { observeElements };
}
