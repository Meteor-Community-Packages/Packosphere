import { useState, useEffect, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Grapher } from 'meteor/cultofcoders:grapher';
import { Meteor } from 'meteor/meteor';

interface QueryInfo<T> {
  loading: boolean
  ready: boolean
  data: T[]
  error: Meteor.Error | null
}

interface QueryParams<T> {
  query: Grapher.Query<T>
  params?: any
}

const withReactiveQuery = function <T>({ query, params = {} }: QueryParams<T>): QueryInfo<T> {
  const [subscriptionError, setSubscriptionError] = useState<Meteor.Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  const subscriptionHandle = useRef<Meteor.SubscriptionHandle | undefined>(undefined);
  const queryRef = useRef<Grapher.Query<T> | undefined>(undefined);

  const depends = Object.values(params);

  const queryInfo: QueryInfo<T> = useTracker(() => {
    let data: QueryInfo<T>['data'] = [];
    useEffect(() => {
      queryRef.current = query.clone(params);
      setSubscriptionError(null);
      setIsLoading(true);
      setIsReady(false);
      subscriptionHandle.current = queryRef.current?.subscribe({
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
      return () => { subscriptionHandle?.current?.stop(); };
    }, depends);

    if (typeof queryRef.current !== 'undefined' && isReady) {
      data = queryRef.current.fetch();
    }
    return {
      loading: isLoading,
      ready: isReady,
      data,
      error: subscriptionError,
    };
  });

  return queryInfo;
};

export default withReactiveQuery;
