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

const withReactiveQuery = function <T>(query: Grapher.Query<T>): QueryInfo<T> {
  const [subscriptionError, setSubscriptionError] = useState<Meteor.Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);

  const subscriptionHandle = useRef<Meteor.SubscriptionHandle | null>(null);

  const queryInfo: QueryInfo<T> = useTracker(() => {
    let data: QueryInfo<T>['data'] = [];

    useEffect(() => {
      subscriptionHandle.current = query.subscribe({
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
    }, []);

    if (isReady) {
      data = query.fetch();
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
