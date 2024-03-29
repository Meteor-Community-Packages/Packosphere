import React from 'react';
import Page from '../../components/Page';
import CardGrid from '../../components/CardGrid';
import Pagination from '../../components/Pagination';

import useQuery from '../../hooks/useStaticQuery';
import { ILatestPackagesQueryResult, QPackageSearch } from '../../../../api/LatestPackages';
import useLocationQuery from '../../hooks/useLocationQuery';

const resultsPerPage = 10;

const SearchPage = (): JSX.Element => {
  const [search] = useLocationQuery();
  const { q, published = '10:y', sort, page = '1', deprecated } = search;
  const skip = (parseInt(page as string) - 1) * resultsPerPage;

  const { data, count, loading } = useQuery({ query: QPackageSearch, params: { query: q, published, sort, deprecated, limit: resultsPerPage, skip }, config: { fetchTotal: true } });
  const pkgs = data as ILatestPackagesQueryResult[];
  const dataCount = typeof count !== 'undefined' ? count : pkgs?.length;
  const totalPages = Math.ceil(dataCount / resultsPerPage);
  return (
    <Page>
      <>
        <section className="flex justify-between items-center">
          <h2 className="text-xl text-white">Results for <span className="text-yellow-600 italic">{q}</span></h2>
          <aside className="flex items-center space-x-3">
            <Pagination totalPages={totalPages} loading={loading} />
          </aside>
        </section>
        {totalPages > 0
          ? <section>{typeof data !== 'undefined' && <CardGrid cardData={pkgs} />}</section>
          : <div className="flex flex-col items-center justify-center space-y-10 flex-auto py-10 h-96">
            <h1 className="text-2xl font-bold text-yellow-600 uppercase">No Results</h1>
            <p className="text-xl text-center leading-10">Your query of <span className="font-bold text-2xl text-yellow-600">{q}</span> did not return any results.<br /> Please enter another search phrase and try again.</p>
          </div>

        }
        <section className="flex justify-center items-center lg:hidden">
          <Pagination totalPages={totalPages} loading={loading} />
        </section>
      </>
    </Page>
  );
};

export default SearchPage;
