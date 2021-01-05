declare module 'meteor/copleykj:grapher-link-executor' {
  import { Mongo } from 'meteor/mongo';
  import { Grapher } from 'meteor/cultofcoders:grapher';
  export function addLinks<T> (collection: Mongo.Collection<T>, links: Grapher.Link<any>): void;
  export const executeLinks: () => void;
}
