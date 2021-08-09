import React from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { ArrowNarrowRight, ArrowNarrowLeft, Refresh } from 'heroicons-react';
import useLocationQuery from '../../hooks/useLocationQuery';

interface PaginationProps {
  totalPages: number
  loading: boolean
  message?: string
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

const Pagination = ({ totalPages = 0, loading = false, message = 'No Results...' }: PaginationProps): JSX.Element => {
  const [search] = useLocationQuery();
  const { page = '1' } = search;
  const pageNumber = parseInt(page as string);

  const nextPageNumber = pageNumber + 1;
  const prevPageNumber = pageNumber - 1;
  const nextSearchString = queryString.stringify({ ...search, page: nextPageNumber.toString() });
  const prevSearchString = queryString.stringify({ ...search, page: prevPageNumber.toString() });
  const showLoader = loading ? '' : 'hidden';

  return (
    <>
      <span className={`animate-spin rounded-full text-blueGray-400 ${showLoader}`}>
        <Refresh size={22} className="h-6 w-6" style={{ transform: 'scaleX(-1)' }}/>
      </span>
      <span className="flex items-center">
        <LinkOrNot link={pageNumber > 1} to={`/search?${prevSearchString}`} title="Previous">
          <ArrowNarrowLeft size={20} />
        </LinkOrNot>
        <span className="w-40 text-center">
          {totalPages > 0 ? `page ${pageNumber} of ${totalPages}` : message }
        </span>
        <LinkOrNot link={pageNumber !== totalPages && totalPages > 1} to={`/search?${nextSearchString}`} title="Next">
          <ArrowNarrowRight size={20} />
        </LinkOrNot>
      </span>
    </>
  );
};

export default Pagination;
