import { useEffect, useState } from 'react';
import { fetchApi } from '../services/apiService';

interface UseFetchProps<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void; // Función para volver a realizar el fetch
}

const useFetch = <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    params?: { [key: string]: any },
    body?: any
): UseFetchProps<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchApi(endpoint, method, body, params);
            if (!response) {
                setError('Error: No response from server');
            } else {
                setData(response.data);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint, method, params, body]);

    return { data, loading, error, refetch: fetchData };
};

export default useFetch;