import { useState, useEffect, useRef, useMemo } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Grapher } from 'meteor/cultofcoders:grapher';
import { Meteor } from 'meteor/meteor';

interface QueryInfo<T> {
  loading: boolean
  ready: boolean
  data: T[]
  error: Meteor.Error | null
}

const withReactiveQuery = function <T>(query: Grapher.Query<T>, params: any = {}): QueryInfo<T> {
  const [subscriptionError, setSubscriptionError] = useState<Meteor.Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  const subscriptionHandle = useRef<Meteor.SubscriptionHandle | null>(null);

  const depends = Object.values(params);

  const queryInfo: QueryInfo<T> = useTracker(() => {
    const newQuery = useMemo(() => { return query.clone(params); }, depends);
    let data: QueryInfo<T>['data'] = [];

    useEffect(() => {
      setSubscriptionError(null);
      setIsLoading(true);
      setIsReady(false);
      subscriptionHandle.current = newQuery.subscribe({
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
    }, depends);

    if (isReady) {
      data = newQuery.fetch();
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
