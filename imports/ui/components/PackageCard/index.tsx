import React from 'react';
import { Link } from 'react-router-dom';
import { CloudDownloadOutline } from 'heroicons-react';
import human from 'human-number';

import { ILatestPackagesQueryResult } from '../../../../client/api';

interface PackageCardProps {
  cardData: ILatestPackagesQueryResult
}

const mapper = (n: number): string => {
  const ns = n.toString();
  if (ns.includes('.')) {
    return n.toFixed(1);
  }
  return ns;
};

const PackageCardComponent = ({ cardData: { packageName, meta: { totalAdds, maintainers }, description } }: PackageCardProps): JSX.Element => {
  let username = 'meteor';
  let packagename;

  if (packageName.includes(':')) {
    ([username, packagename] = packageName.split(':'));
  } else {
    packagename = packageName;
  }

  return (
    <Link to={`/${username}/${packagename}`} className="">
      <li className="flex flex-col h-64 bg-blueGray-700 text-white p-7 border, rounded-md border-gray-300 shadow-lg">
        <h2 className="text-sm font-semibold">
          <span className="inline-block">{username}:</span>
          <span className="inline-block">{packagename}</span>
        </h2>
        <p className="text-gray-300 text-sm my-4 break-words flex-auto">{description}</p>
        <div className='flex items-center space-x-1 justify-between'>
          <div className="from-blueGray-700 to-blueGray-600 bg-gradient-to-t px-3 py-1.5 space-x-1 flex items-center rounded-sm text-xs font-semibold text-white">
            <CloudDownloadOutline size={18} />
            <span>{typeof totalAdds !== 'undefined' && totalAdds > 0 ? human(totalAdds, mapper) : '0'}</span>
          </div>
          <div>
            {maintainers.some(maintainer => maintainer.username === 'communitypackages')
              ? <img
                src="https://avatars.slack-edge.com/2019-11-22/846109315856_16870da10c58e584b545_88.png"
                alt=""
                className="w-6 rounded-full ring-white ring-1"
                title="Commuinty Maintained"
              />
              : null
            }
          </div>
        </div>
      </li>
    </Link>
  );
};

export default PackageCardComponent;
