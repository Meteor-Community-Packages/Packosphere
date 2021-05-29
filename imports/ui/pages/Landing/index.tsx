import React from 'react';
import { Helmet } from 'react-helmet';
import CardGrid from '../../components/CardGrid';

import useQuery from '../../hooks/useStaticQuery';
import { ILatestPackagesQueryResult, QRecentlyPublishedPackages } from '../../../../api/LatestPackages';
import Page from '../../components/Page';

const query = QRecentlyPublishedPackages.clone();
const LandingPage = (): JSX.Element => {
  const { data } = useQuery({ query });
  const pkgs = data as ILatestPackagesQueryResult[];
  return (
    <Page>
      <Helmet>
        <title>Packosphere - Meteor Package Repository Viewer</title>
        <meta name="description" content="The MeteorJS package explorer, by the community, for the community."/>
      </Helmet>
      <h2 className="text-2xl text-white text-center">Recently Published</h2>
      <section>{<CardGrid cardData={pkgs} />}</section>
    </Page>
  );
};

export default LandingPage;
