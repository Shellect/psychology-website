import { useState, useCallback } from 'react';

export const useAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = '/api/v1';

  const createAppointment = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Отправляю данные на:', `${API_URL}/appointments`, formData);
      
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Статус ответа:', response.status);

      const data = await response.json();
      console.log('Ответ сервера:', data);

      if (!response.ok) {
        throw new Error(data.message || `Ошибка ${response.status}: ${response.statusText}`);
      }

      setSuccess(true);
      return data;
    } catch (err) {
      console.error('Полная ошибка отправки:', err);
      setError(err.message || 'Ошибка соединения с сервером');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { createAppointment, loading, error, success, reset };
};