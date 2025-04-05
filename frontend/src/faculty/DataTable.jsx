import React from 'react';
import PropTypes from 'prop-types';

const DataTable = ({ columns, data, pagination, searchable }) => {
  if (!Array.isArray(data) || !Array.isArray(columns)) {
    throw new Error('DataTable requires both columns and data to be arrays');
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th 
                key={col.Header || i}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td 
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {col.Cell ? col.Cell({ value: row[col.accessor], row }) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  pagination: PropTypes.bool,
  searchable: PropTypes.bool
};

export default DataTable;