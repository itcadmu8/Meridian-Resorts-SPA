import { useState, useEffect, useCallback } from 'react';
import { fetchArrivals } from '../api/reservationsApi';

export function useArrivals(filters = {}) {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchArrivals(filters);
      setArrivals(data);
    } catch (err) {
      setError(err.message || 'Failed to load arrivals');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    load();
  }, [load]);

  return { arrivals, loading, error, refetch: load };
}