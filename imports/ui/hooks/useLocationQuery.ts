import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';

interface UrlQueryObject<T = string> {
  [key: string]: T | T[] | undefined
}

interface setSearchQueryParams {
  path?: string
  params: UrlQueryObject
  overwrite?: boolean
}

const useLocationQuery = (): [UrlQueryObject, (options: setSearchQueryParams) => void] => {
  const location = useLocation();
  const navigate = useNavigate();
  const { search } = location;
  const parsed = queryString.parse(search) as UrlQueryObject;

  const setSearchQuery = ({ path, params, overwrite = true }: setSearchQueryParams): void => {
    const newSearch = overwrite ? queryString.stringify(params) : queryString.stringify({ ...parsed, ...params });
    const newPath = typeof path === 'string' ? path : location.pathname;

    navigate({ pathname: newPath, search: newSearch }, { replace: true });
  };
  return [parsed, setSearchQuery];
};

export default useLocationQuery;
