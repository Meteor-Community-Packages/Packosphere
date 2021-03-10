import React from 'react';
import CardGrid from '../../components/CardGrid';

import useQuery from '../../hooks/useReactiveQuery';
import { ILatestPackagesQueryResult, QRecentlyPublishedPackages } from '../../../../api/LatestPackages';
import Page from '../../components/Page';

const query = QRecentlyPublishedPackages.clone();
const LandingPage = (): JSX.Element => {
  const { data, ready } = useQuery({ query });
  const pkgs = data as ILatestPackagesQueryResult[];
  return (
    <Page>
      <>
        <h2 className="text-2xl text-white text-center">Recently Published</h2>
        <section>{ready && <CardGrid cardData={pkgs} />}</section>
      </>
    </Page>
  );
};

export default LandingPage;
