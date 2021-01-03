import { Grapher } from 'meteor/cultofcoders:grapher'
import { Mongo } from 'meteor/mongo'
import { DocumentNode } from 'graphql'
import SimplSchema from 'simpl-schema'

type LocalUnarray<T> = T extends Array<infer U> ? U : T

declare module 'meteor/mongo' {

  // Type definitions for non-npm package Meteor package matb33:collection-hooks 0.8
  // Project: https://github.com/matb33/meteor-collection-hooks
  // Definitions by: Trygve Wastvedt <https://github.com/twastvedt>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

  /// <reference path="meteor-mongo.d.ts" />
  module Mongo {

    // herteby:denormalize
    interface CacheOptions<K, T> {
      type: 'one' | 'many' | 'inverse' | 'many-inverse'
      collection: Mongo.Collection<K>
      fields: string[] | Record<string, 0 | 1>
      referenceField: keyof K | string
      cacheField: keyof T
      bypassSchema?: boolean
    }

    // herteby:denormalize
    interface CacheFieldOptions<K, T> {
      fields: string[] | Record<string, 0 | 1>
      cacheField: keyof T
      transform: (doc: T) => K
      bypassSchema?: boolean
    }

    // meteor/mongo
    interface Projection {
      sort?: SortSpecifier
      skip?: number
      limit?: number
      fields?: FieldSpecifier
      reactive?: boolean
      // eslint-disable-next-line @typescript-eslint/ban-types
      transform?: Function | null
    }

    // meteor/mongo
    // eslint-disable-next-line
    export interface Collection<T> {
      // simpl-schema
      schema: SimplSchema

      // simpl-schema
      attachSchema(schema: SimplSchema): void

      // simpl-schema
      attachJSONSchema(schema: unknown): void

      helpers(methods: Record<string, unknown>): void

      _name: string

      // herteby:denormalize
      cache<P>(options: CacheOptions<P, T>): void

      // herteby:denormalize
      cacheField<P>(options: CacheFieldOptions<P, T>): void

      // matb33:collection-hooks
      before: {
        find(
          hook: (
            userId: string,
            selector: Mongo.Selector<T>,
            options: CollectionHooks.ModifierOptions,
          ) => void,
        ): void
        findOne(
          hook: (
            userId: string,
            selector: Mongo.Selector<T>,
            options: CollectionHooks.ModifierOptions,
          ) => void,
        ): void
        insert(hook: (userId: string, doc: T) => void): void
        remove(hook: (userId: string, doc: T) => void): void
        update(
          hook: (
            userId: string,
            doc: T,
            fieldNames: string[],
            modifier: Mongo.Modifier<T>,
            options: CollectionHooks.ModifierOptions,
          ) => void,
        ): void
        upsert(
          hook: (
            userId: string,
            doc: T,
            selector: Mongo.Selector<T>,
            modifier: Mongo.Modifier<T>,
            options: CollectionHooks.ModifierOptions,
          ) => void,
        ): void
      }

      // matb33:collection-hooks
      after: {
        find(
          hook: (
            userId: string,
            selector: Mongo.Selector<T>,
            options: CollectionHooks.ModifierOptions,
            cursor: Mongo.Cursor<T>,
          ) => void,
        ): void
        findOne(
          hook: (
            userId: string,
            selector: Mongo.Selector<T>,
            options: CollectionHooks.ModifierOptions,
            doc: T,
          ) => void,
        ): void
        insert(hook: (userId: string, doc: T) => void): void
        remove(hook: (userId: string, doc: T) => void): void
        update(
          hook: (
            userId: string,
            doc: T,
            fieldNames: string[],
            modifier: Mongo.Modifier<T>,
            options: CollectionHooks.ModifierOptions,
          ) => void,
          options?: CollectionHooks.HookOptionValue,
        ): void
        upsert(
          hook: (
            userId: string,
            doc: T,
            selector: Mongo.Selector<T>,
            modifier: Mongo.Modifier<T>,
            options: CollectionHooks.ModifierOptions,
          ) => void,
        ): void
      }

      // matb33:collection-hooks
      direct: {
        find(
          selector?:
            | Mongo.Selector<T>
            | Mongo.ObjectID
            | string,
          options?: {
            sort?: Mongo.SortSpecifier
            skip?: number
            limit?: number
            fields?: Mongo.FieldSpecifier
            reactive?: boolean
            transform?(doc: any): void
          },
        ): Mongo.Cursor<T>
        findOne(
          selector?:
            | Mongo.Selector<T>
            | Mongo.ObjectID
            | string,
          options?: {
            sort?: Mongo.SortSpecifier
            skip?: number
            fields?: Mongo.FieldSpecifier
            reactive?: boolean
            transform?(doc: any): void
          },
        ): T
        insert(doc: T, callback?: () => void): string
        remove(
          selector:
            | Mongo.Selector<T>
            | Mongo.ObjectID
            | string,
          callback?: () => void,
        ): number
        update(
          selector:
            | Mongo.Selector<T>
            | Mongo.ObjectID
            | string,
          modifier: Mongo.Modifier<T>,
          options?: {
            multi?: boolean
            upsert?: boolean
          },
          callback?: () => void,
        ): number
        upsert(
          selector:
            | Mongo.Selector<T>
            | Mongo.ObjectID
            | string,
          modifier: Mongo.Modifier<T>,
          options?: {
            multi?: boolean
          },
          callback?: () => void,
        ): { numberAffected?: number; insertedId?: string }
      }

      // matb33:collection-hooks
      hookOptions: CollectionHooks.GlobalHookOptions

      // cult-of-coders:grapher
      astToQuery(
        ast: DocumentNode,
        query: Grapher.GraphQLQuery<T extends object ? T : {}>
      ): Mongo.Cursor<T>
      createQuery<T>(
        body: Grapher.Body<T> | {},
        options?: {}
      ): Grapher.Query<T>
      expose: Grapher.Exposure
      addLinks(links: Grapher.Link): void
      addReducers(): void
    }
  }
}

declare namespace CollectionHooks {
  interface ModifierOptions {
    multi?: boolean
    upsert?: boolean
  }

  interface HookOptionValue {
    fetchPrevious?: boolean
  }

  interface LocalHookOptions {
    all?: HookOptionValue
    find?: HookOptionValue
    findOne?: HookOptionValue
    insert?: HookOptionValue
    remove?: HookOptionValue
    update?: HookOptionValue
    upsert?: HookOptionValue
  }

  interface GlobalHookOptions {
    before?: LocalHookOptions
    after?: LocalHookOptions
    all?: LocalHookOptions
  }
}
