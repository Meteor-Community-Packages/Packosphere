import React from 'react';
import { CloudDownloadOutline } from 'heroicons-react';

export default ({ data: { packageName, meta, description } }: any): JSX.Element => (
  <li className="bg-white p-5 border, border-gray-300 shadow-lg flex flex-col space-y-3 flex-grow">
    <h2 className="text-lg font-semibold text-gray-600">{packageName}</h2>
    <p className="text-gray-500 my-4 flex-grow h-28">{description}</p>
    <div className='flex items-center space-x-1 text-gray-600 text-sm'>
      <CloudDownloadOutline size={22} className="text-purple-400"/><span>{meta.totalAdds > 0 ? meta.totalAdds : '0'}</span>
    </div>
  </li>
);
