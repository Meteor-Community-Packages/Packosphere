import React from 'react';
import Header from '../../components/Header';
import CardGrid from '../../components/CardGrid';

import useQuery from '../../hooks/useReactiveQuery';
import { QRecentlyPublishedPackages } from '../../../../api/LatestPackages';

const headerLinks = [
  { title: 'About', url: '' },
  { title: 'Packages', url: '' },
  { title: 'Projects', url: '' },
  { title: 'People', url: '' },
  { title: 'Contact', url: '' },
];

const query = QRecentlyPublishedPackages.clone();
export default (): JSX.Element => {
  const { data, ready } = useQuery(query);
  console.log(data);
  return (
    <>
      <Header links={headerLinks} />

      <main className="container flex flex-col space-y-10 mx-auto py-10">
        <h2 className="text-2xl text-blueGray-600 text-center">Recently Published</h2>
        <section>{ready && <CardGrid cardData={data} />}</section>
      </main>
    </>
  );
};
