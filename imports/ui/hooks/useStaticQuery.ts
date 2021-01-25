import { useState, useEffect, useMemo } from 'react';
import { Grapher } from 'meteor/cultofcoders:grapher';
import { Meteor } from 'meteor/meteor';

interface QueryInfo<T> {
  loading: boolean
  refetch: () => void
  data: T[]
  count: number | undefined
  error: Meteor.Error | null
}

interface FetchConfig {
  loadOnRefetch?: boolean
  fetchTotal?: boolean
}

interface QueryParams<T> {
  query: Grapher.Query<T>
  params?: any
  config?: FetchConfig
}

const withStaticQuery = function <T>({ query, params, config: { loadOnRefetch = true, fetchTotal = false } = {} }: QueryParams<T>): QueryInfo<T> {
  const [fetchError, setfetchError] = useState<Meteor.Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T[]>([]);
  const [count, setCount] = useState<number | undefined>(undefined);

  const depends = Object.values(params);

  const { limit, skip, ...paramsWithoutPagination } = params;

  const newQuery = useMemo(() => { return query.clone(params); }, depends);
  const countQuery = useMemo(() => { return query.clone(paramsWithoutPagination); }, depends);

  const fetch = async (): Promise<void> => {
    let data;
    let count;
    try {
      data = await newQuery.fetchSync();
      if (fetchTotal) {
        count = await countQuery.getCountSync();
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

export default withStaticQuery;
