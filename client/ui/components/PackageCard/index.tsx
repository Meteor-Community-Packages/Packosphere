import React from 'react';
import { CloudDownloadOutline } from 'heroicons-react';
import { LatestPackage } from 'meteor/peerlibrary:meteor-packages';

export type CardData = Pick<LatestPackage, "packageName" | "description">

type PackageCardProps = {
  data: CardData
}
export default ({ data }: PackageCardProps) => (
  <li className="bg-white p-5 border, border-gray-300 shadow-lg flex flex-col space-y-3 flex-grow">
    <h2 className="text-lg font-semibold text-gray-600">{data.packageName}</h2>
    <p className="text-gray-500 my-4 flex-grow">{data.description}</p>
    <div className='flex items-center space-x-1 text-gray-600 text-sm'>
      <CloudDownloadOutline size={22} className="text-purple-400"/><span>3670</span>
    </div>
  </li>
);
