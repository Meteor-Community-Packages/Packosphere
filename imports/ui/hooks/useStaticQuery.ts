import { useState, useEffect, useMemo } from 'react';
import { Grapher } from 'meteor/cultofcoders:grapher';
import { Meteor } from 'meteor/meteor';
import { FastRender } from 'meteor/communitypackages:fast-render';

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

const useStaticQuery = function <T>({ query, params = {}, config: { loadOnRefetch = true, fetchTotal = false, fetchOne = false } = {} }: QueryParams<T>): QueryInfo<T> {
  const [fetchError, setfetchError] = useState<Meteor.Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<QueryInfo<T>['data']>(fetchOne ? undefined : []);
  const [count, setCount] = useState<number | undefined>(undefined);
  const depends = Object.values(params);
  const serverData = FastRender.getExtraData('staticQueryData');

  const newQuery = useMemo(() => { return query.clone(params); }, depends);
  const fetch = async (): Promise<void> => {
    let data;
    let count;
    try {
      if (serverData !== null) {
        ({ data, count } = serverData);
      } else {
        if (fetchOne) {
          data = await newQuery.fetchOneSync();
        } else {
          data = await newQuery.fetchSync();
          if (fetchTotal) {
            count = await newQuery.getCountSync();
          }
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

  const fetchServer = (): any => {
    // In Meteor 3.0, sync database operations are not available.
    // Return empty data on server - client will fetch asynchronously.
    const data = fetchOne ? undefined : [];
    const count = undefined;
    const error = null;
    const loading = true;
    // Don't add extra data since we're not pre-fetching
    return { data, count, error, loading };
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

  if (Meteor.isServer) {
    return { ...fetchServer(), refetch };
  } else {
    return {
      loading: serverData === null && isLoading,
      refetch,
      data: serverData?.data ?? data,
      count: serverData?.count ?? count,
      error: fetchError,
    };
  }
};

export default useStaticQuery;
