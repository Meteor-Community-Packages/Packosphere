import React from 'react';
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

export default ({ cardData: { packageName, meta: { totalAdds, maintainers }, description } }: PackageCardProps): JSX.Element => {
  return (
    <li className="bg-blueGray-700 text-white p-7 border, rounded-md border-gray-300 shadow-lg flex flex-col space-y-5 flex-grow break-normal">
      <h2 className="text-sm font-semibold">{packageName}</h2>
      <p className="text-gray-300 text-sm my-4 flex-grow h-24 break-words">{description}</p>
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
  );
};
