import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import Page from '../../components/Page';
import CardGrid from '../../components/CardGrid';
import Pagination from '../../components/Pagination';

import useQuery from '../../hooks/useStaticQuery';
import { QPackageSearch } from '../../../../api/LatestPackages';
import useLocationQuery from '../../hooks/useLocationQuery';

const resultsPerPage = 10;

const SearchPage = (): JSX.Element => {
  const history = useHistory();
  useEffect(() => {
    // XXX - Figure out how to type this nightmare.
    const unlisten = history.listen(({ action, location }: any) => {
      setTimeout(() => {
        if (action !== 'POP') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      });
    });

    return () => { unlisten(); };
  }, []);
  const [search] = useLocationQuery();
  const { q, page = '1' } = search;
  const skip = (parseInt(page as string) - 1) * resultsPerPage;

  const { data, count, loading } = useQuery({ query: QPackageSearch, params: { query: q, limit: resultsPerPage, skip }, config: { fetchTotal: true } });
  const dataCount = typeof count !== 'undefined' ? count : data.length;
  const totalPages = Math.ceil(dataCount / resultsPerPage);
  return (
    <>
      <Header />
      <Page>
        <>
          <section className="flex justify-between items-center">
            <h2 className="text-xl text-white">Results for <span className="text-yellow-600 italic">{q}</span></h2>
            <aside className="flex items-center space-x-3">
              <Pagination totalPages={totalPages} loading={loading} />
            </aside>
          </section>
          <section>{typeof data !== 'undefined' && <CardGrid cardData={data} />}</section>
          <section className="flex justify-center items-center lg:hidden">
            <Pagination totalPages={totalPages} loading={loading}/>
          </section>
        </>
      </Page>
    </>
  );
};

export default SearchPage;
