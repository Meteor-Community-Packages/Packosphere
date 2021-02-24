import { useState, useEffect, useMemo } from 'react';
import { Grapher } from 'meteor/cultofcoders:grapher';
import { Meteor } from 'meteor/meteor';

interface QueryInfo<T> {
  loading: boolean
  refetch: () => void
  data?: T | T[]
  count: number | undefined
  error: Meteor.Error | null
}

interface QueryConfig {
  loadOnRefetch?: boolean
  fetchTotal?: boolean
  fetchOne?: boolean
}

interface QueryParams<T> {
  query: Grapher.Query<T>
  params?: any
  config?: QueryConfig
}

const useStaticQuery = function <T>({ query, params, config: { loadOnRefetch = true, fetchTotal = false, fetchOne = false } = {} }: QueryParams<T>): QueryInfo<T> {
  const [fetchError, setfetchError] = useState<Meteor.Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<QueryInfo<T>['data']>(fetchOne ? undefined : []);
  const [count, setCount] = useState<number | undefined>(undefined);

  const depends = Object.values(params);

  const newQuery = useMemo(() => { return query.clone(params); }, depends);

  const fetch = async (): Promise<void> => {
    let data;
    let count;
    try {
      if (fetchOne) {
        data = await newQuery.fetchOneSync();
      } else {
        data = await newQuery.fetchSync();
        if (fetchTotal) {
          count = await newQuery.getCountSync();
        }
      }
      setData(data);
      setCount(count);
      setfetchError(null);
    } catch (error) {
      setData([]);
      setfetchError(error);
      setCount(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = (): void => {
    if (loadOnRefetch) {
      setIsLoading(true);
    }
    void fetch();
  };

  useEffect(() => {
    setfetchError(null);
    setIsLoading(true);
    void fetch();
  }, depends);

  return {
    loading: isLoading,
    refetch,
    data,
    count,
    error: fetchError,
  };
};

export default useStaticQuery;
