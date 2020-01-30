declare module 'meteor/copleykj:grapher-link-executor' {
    import { Mongo } from 'meteor/mongo'
    export function addLinks<T>(collection: Mongo.Collection<T>, links: object): void;
    export const executeLinks: () => void;
}

declare module 'meteor/mongo' {
    module Mongo {
        interface Collection<T> {
            _name: string;
            attachSchema(schema: object): void;
            addLinks(links: object): void;
            createQuery(nameOrOptions: object | string, options?: object): GrapherQuery<T>;
        }
        interface GrapherQuery<T> {
            clone(): GrapherQuery<T>;
            fetch(): T[];
            fetchOne(): T;
            expose(options: object): void;
        }
    }
}

declare module 'meteor/peerlibrary:meteor-packages'

declare module 'meteor/cultofcoders:grapher-react'
