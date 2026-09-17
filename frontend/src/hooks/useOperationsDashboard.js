/**
 * @file useOperationsDashboard.js
 * @description Custom React hook for managing OperationsDashboard state and operations.
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchOperationsDashboard } from '../api/dashboardApi';

export function useOperationsDashboard(targetDate = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchOperationsDashboard(targetDate);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load operations dashboard');
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}