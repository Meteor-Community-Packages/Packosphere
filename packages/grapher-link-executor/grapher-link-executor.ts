import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Grapher } from 'meteor/cultofcoders:grapher';

interface CollectionsCollection {
    [key: string]: Mongo.Collection<any>
}

interface LinksCollection {
    [key: string]: Grapher.Link<any>
}

let done = false;
const collections: CollectionsCollection = {}; //store collections uniquely
const standardLinks: LinksCollection = {}; // standard links stored under properties with names that correspond to collection names
const inverseLinks: LinksCollection = {}; // inverse links stored under properties with names that correspond to collection names

export function addLinks<T>(collection: Mongo.Collection<T>, links: Grapher.Link<any>) {
    if (done) {
        throw new Meteor.Error(
            'addLinks(): Link Execution Finished',
            'Link exectutor has already finished adding links. addLinks cannnot be called after links have been added. Are you calling addLinks from Meteor.startup?'
        );
    }
    const collectionName = collection._name;

    collections[collectionName] = collection;

    Meteor._ensure(standardLinks, collectionName);
    Meteor._ensure(inverseLinks, collectionName);

    Object.keys(links).forEach((key) => {
        let link = links[key];
        const oldLink = standardLinks[collectionName][key] || inverseLinks[collectionName][key];

        if (oldLink) {
            throw new Meteor.Error('Existing Link', `Link for "${key}" already exists on ${collectionName} collection`, JSON.stringify({ oldLink, newLink: link }));
        }

        const linkCollectionName = link?.collection?._name;

        if (linkCollectionName && !collections[linkCollectionName]) {
            collections[linkCollectionName] = link.collection
        }

        if (link.inversedBy) {
            inverseLinks[collectionName][key] = link;
        } else {
            standardLinks[collectionName][key] = link;
        }
    });
};

export const executeLinks = () => {
    if (done) {
        throw new Meteor.Error(
            'executeLinks(): Link Execution Finished',
            'Link execution can only run once.'
        );
    }

    done = true;

    Object.keys(collections).forEach(collectionName => {
        const collection = collections[collectionName];
        const standardLinkNames = Object.keys(standardLinks[collectionName] || {});

        if (standardLinkNames.length) {
            collection.addLinks(standardLinks[collectionName]);
        }
    });
    Object.keys(collections).forEach(collectionName => {
        const collection = collections[collectionName];
        const inverseLinkNames = Object.keys(inverseLinks[collectionName] || {})

        if (inverseLinkNames.length) {
            collection.addLinks(inverseLinks[collectionName]);
        }
    });
};
