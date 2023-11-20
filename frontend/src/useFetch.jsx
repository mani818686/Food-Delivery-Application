import { useState, useEffect } from 'react';

const UseFetch = (url, method = 'GET', body = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let token = localStorage.getItem("authToken");
        const options = {
          method,
          headers: {
            'Content-Type': 'application/json',
            "auth-token": token,
          },
          body: body ? JSON.stringify(body) : null,
        };

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, method, body]);

  return { data, error, loading };
};

export default UseFetch;
