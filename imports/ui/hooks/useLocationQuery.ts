import { useHistory, useLocation } from 'react-router-dom';
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
  const history = useHistory();
  const { search } = location;
  const parsed = queryString.parse(search) as UrlQueryObject;

  const setSearchQuery = ({ path, params, overwrite = true }: setSearchQueryParams): void => {
    location.search = overwrite ? queryString.stringify(params) : queryString.stringify({ ...parsed, ...params });
    if (typeof path === 'string') {
      location.pathname = path;
    };

    history.replace(location);
  };
  return [parsed, setSearchQuery];
};

export default useLocationQuery;
