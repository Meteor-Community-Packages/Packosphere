import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { ArrowNarrowRight, ArrowNarrowLeft, Refresh } from 'heroicons-react';
import Header from '../../components/Header';
import Page from '../../components/Page';
import CardGrid from '../../components/CardGrid';

import useQuery from '../../hooks/useStaticQuery';
import { QPackageSearch } from '../../../../api/LatestPackages';
import useLocationQuery from '../../hooks/useLocationQuery';

const resultsPerPage = 10;

interface PaginationProps {
  totalPages: number
}

interface LinkOrNotProps {
  link: boolean
  to: string
  children: any
  [key: string]: any
}

const LinkOrNot = ({ link, to, children, ...props }: LinkOrNotProps): JSX.Element => {
  return link
    ? <Link to={to} {...props} >{children}</Link>
    : <span className='text-blueGray-600' {...props}>{children}</span>;
};

const Pagination = ({ totalPages = 1 }: PaginationProps): JSX.Element => {
  const [search] = useLocationQuery();
  const { page = '1' } = search;
  const pageNumber = parseInt(page as string);

  const nextPageNumber = pageNumber + 1;
  const prevPageNumber = pageNumber - 1;
  const nextSearchString = queryString.stringify({ ...search, page: nextPageNumber.toString() });
  const prevSearchString = queryString.stringify({ ...search, page: prevPageNumber.toString() });

  return (
    <span className="flex items-center">
      <LinkOrNot link={pageNumber !== 1} to={`/search?${prevSearchString}`} title="Previous">
        <ArrowNarrowLeft size={20} />
      </LinkOrNot>
      <span className="w-40 text-center">page {pageNumber} of {totalPages}</span>
      <LinkOrNot link={pageNumber !== totalPages} to={`/search?${nextSearchString}`} title="Next">
        <ArrowNarrowRight size={20} />
      </LinkOrNot>
    </span>
  );
};

export default (): JSX.Element => {
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
  const showLoader = loading ? '' : 'hidden';
  return (
    <>
      <Header />
      <Page>
        <>
          <section className="flex justify-between items-center">
            <h2 className="text-xl text-white">Results for <span className="text-yellow-600 italic">{q}</span></h2>
            <aside className="flex items-center space-x-3">
              <span className={`animate-spin rounded-full text-blueGray-400 ${showLoader}`}>
                <Refresh size={22} className="h-6 w-6" style={{ transform: 'scaleX(-1)' }}/>
              </span>
              <Pagination totalPages={totalPages} />
            </aside>
          </section>
          <section>{typeof data !== 'undefined' && <CardGrid cardData={data} />}</section>
          <section className="flex justify-center items-center lg:hidden">
            <Pagination totalPages={totalPages}/>
          </section>
        </>
      </Page>
    </>
  );
};
