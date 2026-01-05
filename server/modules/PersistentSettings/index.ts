import { Mongo } from 'meteor/mongo';

const Settings = new Mongo.Collection<any>('persistent-settings');

export default class PersistentSettings<T extends { [P in keyof T]: string | number | boolean | Date}> {
  constructor (public id: string = 'default') {}

  public async get<K extends keyof T>(key: K): Promise<T[K] | undefined> {
    const record = await Settings.findOneAsync({ _id: this.id }) as T;
    return record?.[key];
  }

  public async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    await Settings.upsertAsync({ _id: this.id }, { $set: { [key]: value } });
  }

  public async delete<K extends keyof T>(key: K): Promise<void> {
    await Settings.upsertAsync({ _id: this.id }, { $unset: { [key]: '' } });
  }
}
