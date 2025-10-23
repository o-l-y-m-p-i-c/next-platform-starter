'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';
import { getBackendURL } from '../helpers/urlHelper';

interface UseFetchOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | null | FormData | object;
}

const useFetch = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async <T>(
    url: string,
    params?: UseFetchOptions,
  ): Promise<{
    data?: T;
    status?: number;
    error?: Error;
  }> => {
    setIsLoading(true);
    const clonedParams = { ...params };
    const headers = new Headers(clonedParams.headers);
    delete clonedParams.headers;

    if (auth?.user?.token.token) {
      headers.append('Authorization', auth?.user?.token.token);
    }

    let { body } = clonedParams;
    delete clonedParams.body;

    if (body) {
      if (body instanceof FormData) {
        headers.delete('Content-Type'); // fetch will take care of it
      } else if (typeof body === 'object') {
        headers.set('Content-Type', 'application/json');
        body = JSON.stringify(body);
      }
    }
    if (body) {
      clonedParams.body = body as BodyInit;
    }

    let realUrl = url;

    if (!(url.startsWith('http://') || url.startsWith('https://'))) {
      realUrl = new URL(url, getBackendURL()).href;
    }

    let data, error, status;

    await fetch(realUrl, {
      headers,
      ...clonedParams,
    } as RequestInit)
      .then((res) => {
        status = res.status;
        return res;
      })
      .then((res) => {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return res.json();
        } else {
          return null;
        }
      })
      .then((res) => {
        if (status! >= 400) {
          // we have status from a prevoius step and responce not avaialble anymore ans it parsed
          error = new Error(res.message);
        }
        data = res;
      })
      .catch((err: Error) => {
        error = err;
      })
      .finally(() => {
        setIsLoading(false);
      });
    return { data, status, error };
  };

  return {
    isLoading,
    fetchData,
  };
};

export { useFetch };
