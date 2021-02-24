declare module 'meteor/cultofcoders:grapher' {
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';

  module Grapher {
    type TypesEnum = 'one' | 'many';

    type onReadyCallback = () => void;
    type onStopCallback = (err: Meteor.Error | undefined) => void;
    interface subscriptionCallbacks {
      onReady: onReadyCallback
      onStop: onStopCallback
    }

    interface Query<T> {
      clone: (params?: object) => Query<T>
      subscribe: (cb: onReadyCallback | subscriptionCallbacks) => Meteor.SubscriptionHandle
      subscribeCount: () => Meteor.SubscriptionHandle
      unsubscribeCount: () => void
      setParams: () => any
      resolve: () => any
      expose: (exposure: Exposure) => void
      fetch: (callback?: (error: Meteor.Error, data: T[]) => void) => T[]
      fetchOne: (callback?: (error: Meteor.Error, data: T) => void) => T
      fetchSync: () => Promise<T[]>
      fetchOneSync: () => Promise<T>
      getCount: (callback?: (error: Meteor.Error, count: number) => void) => number
      getCountSync: () => Promise<number>
    } // WIP

    interface ILink<TSchema> {
      collection: Mongo.Collection<TSchema>
      inversedBy?: string
      denormalize?: iDenormalize
    }

    interface ILink<TSchema> {
      collection: Mongo.Collection<TSchema>
      type?: TypesEnum
      metadata?: true
      field?: string
      foreignIdentityField?: string
      index?: boolean
      denormalize?: iDenormalize
    }

    interface Link<TSchema = {}> {
      [field: string]: ILink<TSchema>
    }

    interface QueryOptions<T = any> {
      $filter?: Mongo.FieldExpression<T>
    }
    type RecursiveBody<T> = { [K in keyof T]: T[K] extends object ? RecursiveBody<T[K]> : BodyEnum };
    type Body<T> = {
      [field: string]: DependencyGraph | QueryOptions<T>
    } & Partial<RecursiveBody<T>>;
    type createQuery<T = {}> = (
      name: string,
      body: Body<T> | {},
      options?: {}
    ) => any;

    type QueryBody<T = {}> = Body<T>;

    type BodyEnum = 0 | 1;

    type GrapherBody<TSchema = {}> = TSchema extends object
      ? SelectionSet<GraphQLQuery<TSchema>>
      : SelectionSet<BodyEnum>;

    interface TEmbodyArgs<TArgs, TSchema = {}> {
      body: GrapherBody<TSchema>
      getArgs: () => TArgs
    }

    interface DependencyGraph {
      [field: string]: GrapherBody | DependencyGraph
    }

    type TFirewall<TFilters, TOptions> = (
      filters: TFilters,
      options: TOptions,
      userId: string
    ) => void;

    interface SelectionSet<BodyType> {
      [field: string]: BodyType
    }
    interface iDenormalize {
      field: string
      body: {
        [field: string]: number
      }
    }

    interface GraphQLQuery<TSchema extends object = {}, TQueryArguments = {}> {
      embody?: (transform: TEmbodyArgs<TQueryArguments>) => void
      $filter?: Mongo.Selector<TSchema>
      $options?: Mongo.Options<TSchema>
      // Integer
      maxDepth?: number
      // Integer
      maxLimit?: number
      deny?: string[]
      intersect?: GrapherBody<TSchema>
    }

    interface Exposure<TBody = {}, TFilters = {}, TOptions = {}> {
      firewall?: TFirewall<TFilters, TOptions> | Array<TFirewall<TFilters, TOptions>>
      publication?: boolean // Boolean
      method?: boolean // Boolean
      blocking?: boolean // Boolean
      maxLimit?: number // Number
      maxDepth?: number // Number
      restrictedFields?: string[] // [String]
      restrictLinks?: string[] | ((...args: any[]) => any) // [String] or Function,
    }

    interface ASTToQueryOptions {
      maxLimit: number
      maxDepth: number
    }
  }

  export function createQuery <T> (
    body: Grapher.Body<T> | {},
    options?: {}
  ): Grapher.Query<T>;

  export function createQuery <T> (
    name: string,
    body: Grapher.Body<T> | {},
    options?: {}
  ): Grapher.Query<T>;

  export function setAstToQueryDefaults (
    options: Grapher.ASTToQueryOptions
  ): void;

  export const db: Readonly<{
    [key: string]: Mongo.CollectionStatic
  }>;

  export class MemoryResultCacher {
    constructor ({ ttl }: { ttl: number })

    public fetch<TResult = {}>(
      cacheId: string,
      options: {
        query: any
        countCursor: any
      }
    ): TResult

    public storeData<T = {}>(cacheId: string, data: T): void
  }
}
