import { useState, useEffect, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Grapher } from 'meteor/cultofcoders:grapher';
import { Meteor } from 'meteor/meteor';

interface QueryInfo<T> {
  loading: boolean
  ready: boolean
  data?: T | T[]
  count: number | null
  error: Meteor.Error | null
}

interface QueryConfig {
  fetchTotal?: boolean
  fetchOne?: boolean
}

interface QueryParams<T> {
  query: Grapher.Query<T>
  params?: any
  config?: QueryConfig
}

const useReactiveQuery = function <T>({ query, params = {}, config: { fetchTotal = false, fetchOne = false } = {} }: QueryParams<T>): QueryInfo<T> {
  const [subscriptionError, setSubscriptionError] = useState<Meteor.Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  const querySubscriptionHandle = useRef<Meteor.SubscriptionHandle | undefined>(undefined);
  const queryCountSubscriptionHandle = useRef<Meteor.SubscriptionHandle | undefined>(undefined);
  const queryRef = useRef<Grapher.Query<T> | undefined>(undefined);

  const depends = Object.values(params);

  const queryInfo: QueryInfo<T> = useTracker(() => {
    let data: QueryInfo<T>['data'] = [];
    let count: QueryInfo<T>['count'] = null;

    useEffect(() => {
      queryRef.current = query.clone(params);
      setSubscriptionError(null);
      setIsLoading(true);
      setIsReady(false);

      querySubscriptionHandle.current = queryRef.current?.subscribe({
        onStop (err) {
          if (typeof err !== 'undefined') {
            setSubscriptionError(err);
          }
          setIsLoading(false);
        },
        onReady () {
          setSubscriptionError(null);
          setIsLoading(false);
          setIsReady(true);
        },
      });

      if (fetchTotal && !fetchOne) {
        queryCountSubscriptionHandle.current = queryRef.current.subscribeCount();
      }

      return () => {
        querySubscriptionHandle?.current?.stop();
        typeof queryCountSubscriptionHandle !== 'undefined' ?? query.unsubscribeCount();
      };
    }, depends);

    if (typeof queryRef.current !== 'undefined' && isReady) {
      if (fetchOne) {
        data = queryRef.current.fetchOne();
      } else {
        data = queryRef.current.fetch();
      }

      if (fetchTotal) {
        count = queryRef.current.getCount();
      }
    }
    return {
      loading: isLoading,
      ready: isReady,
      data,
      count,
      error: subscriptionError,
    };
  });

  return queryInfo;
};

export default useReactiveQuery;
