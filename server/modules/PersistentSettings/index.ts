import { Mongo } from 'meteor/mongo';

const Settings = new Mongo.Collection('persistent-settings');

export default class PersistentSettings<T extends { [P in keyof T]: string | number | boolean | Date}> {
  constructor(public id: string = 'default') {}

  public get<K extends keyof T>(key: K): T[K] {
    const record = Settings.findOne({ _id: this.id }) as T;
    return record[key];
  }

  public set<K extends keyof T>(key: K, value: T[K]) {
    Settings.upsert({ _id: this.id }, { $set: { [key]: value } });
  }

  public delete<K extends keyof T>(key: K) {
    Settings.upsert({ _id: this.id }, { $unset: { [key]: '' } });
  }
}
