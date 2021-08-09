import React, { useEffect } from 'react';

export interface SearchParameters {
  sort: string
  published: string
  deprecated: string
}

interface SearchFiltersProps {
  onApply: (data: SearchParameters, numAppliedFilters: number) => void
  onCancel: (e: React.MouseEvent) => void
  initialValues: SearchParameters
}

const sortOptions = [
  { value: 'none', label: 'No Sort' },
  { value: 'newest', label: 'Newest' },
  // { value: 'downloaded', label: 'Most Downloaded' },
];

const publishedOptions = [
  { value: '10:y', label: 'All' },
  { value: '5:y', label: '5 Years' },
  { value: '3:y', label: '3 Years' },
  { value: '2:y', label: '2 Years' },
  { value: '1:y', label: '1 Year' },
  { value: '6:m', label: '6 Months' },
  { value: '3:m', label: '3 Months' },
  { value: '1:m', label: '1 Month' },
];

interface DefaultValues extends SearchParameters {
  [key: string]: string
}

const defaults: DefaultValues = {
  published: '10:y',
  sort: 'none',
  deprecated: 'false',
};

export default ({ onApply, onCancel, initialValues }: SearchFiltersProps): JSX.Element => {
  if (Object.keys(initialValues).length === 0) {
    initialValues = { ...defaults };
  }

  const [filterState, setFilterState] = React.useState<SearchParameters>(initialValues);
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    const name = target.name;
    setFilterState({ ...filterState, [name]: value });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    const value = (target.checked).toString();
    const name = target.name;
    setFilterState({ ...filterState, [name]: value });
  };

  const handleClearFilters = (event: React.MouseEvent): void => {
    setFilterState({ ...defaults });
  };

  const calculateNumAppliedFilters = (): number => {
    const num = Object.entries(filterState).filter(([key, value]) => value !== defaults[key]).length;
    return num;
  };

  const numAppliedFilters = React.useRef(calculateNumAppliedFilters());

  useEffect(() => {
    numAppliedFilters.current = calculateNumAppliedFilters();
  }, [filterState]);

  useEffect(() => {
    onApply(filterState, numAppliedFilters.current);
  }, []);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-200 pb-3">Search Filters</h1>
        <hr className="border-b-1 border-blueGray-400" />
      </div>
      <div className="flex justify-between items-end h-11">
        <label>Sort By</label>
        <select value={filterState.sort} name="sort" onChange={handleSelectChange} className="w-1/2 bg-blueGray-800 rounded-md focus:outline:none focus:ring-0 focus:border-coolGray-500">
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between items-end h-11">
        <label>Published Within</label>
        <select value={filterState.published} name="published" onChange={handleSelectChange} className="w-1/2 bg-blueGray-800 rounded-md focus:outline:none focus:ring-0 focus:border-coolGray-500">
          {publishedOptions.map(option => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-between items-end h-11">
        <label>Include Deprecated</label>
        <div className="w-1/2"><input className="w-6 h-6 focus:outline-none focus:shadow-none focus:ring-0 focus:ring-offset-0 checked:border-coolGray-500 p-3 bg-blueGray-800 text-blueGray-800 rounded-md" type="checkbox" name="deprecated" onChange={handleCheckboxChange} checked={filterState.deprecated === 'true'} /></div>
      </div>
      <div className="flex justify-center items-end h-11">
        <button onClick={handleClearFilters} className="active:text-blueGray-800">Clear Filters</button>
      </div>
      <div className="flex space-x-4 pt-6">
        <button onClick={() => onApply(filterState, numAppliedFilters.current)} className="flex-grow px-4 py-2 bg-yellow-600 font-bold rounded-md">Apply</button>
        <button onClick={onCancel} className="flex-grow px-4 py-2 bg-yellow-600 font-bold rounded-md">Cancel</button>
      </div>
    </>
  );
};
