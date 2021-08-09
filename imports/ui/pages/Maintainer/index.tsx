import React from 'react';
import { Helmet } from 'react-helmet';

import Page from '../../components/Page';
import useQuery from '../../hooks/useStaticQuery';
import { QPackagesByMaintainer, IPackagesQueryResult } from '../../../../api';
import { useParams } from 'react-router-dom';
import CardGrid from '../../components/CardGrid';

interface IMaintainerRouteParams {
  username: string
}

const MaintainerPage = (): JSX.Element => {
  const { username } = useParams<IMaintainerRouteParams>();
  const { data } = useQuery({ query: QPackagesByMaintainer, params: { maintainer: username } });
  const pkgs = data as IPackagesQueryResult[];
  const latestPkgs = pkgs.map((p) => {
    const { currentVersion, ...meta } = p;
    return { ...currentVersion, meta, versions: [] };
  });

  return (
    <Page>
      <Helmet>
        <title>Packages Maintained by {username} - Packosphere</title>
        <meta name="description" content={`All of Meteor packages that are currently maintained by ${username}`} />
      </Helmet>
      <h2 className="text-2xl text-center">Packages Maintained By<br /><span className="text-yellow-600 text-4xl">{username}</span></h2>
      <section>{typeof data !== 'undefined' && <CardGrid cardData={latestPkgs} />}</section>
    </Page>
  );
};
export default MaintainerPage;
