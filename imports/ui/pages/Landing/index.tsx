import React from 'react';
import Header from '../../components/Header';
import CardGrid from '../../components/CardGrid';

import useQuery from '../../hooks/useReactiveQuery';
import { QRecentlyPublishedPackages } from '../../../../api/LatestPackages';
import Page from '../../components/Page';

const query = QRecentlyPublishedPackages.clone();
const LandingPage = (): JSX.Element => {
  const { data, ready } = useQuery({ query });
  return (
    <>
      <Header />
      <Page>
        <>
          <h2 className="text-2xl text-white text-center">Recently Published</h2>
          <section>{ready && <CardGrid cardData={data} />}</section>
        </>
      </Page>
    </>
  );
};

export default LandingPage;
