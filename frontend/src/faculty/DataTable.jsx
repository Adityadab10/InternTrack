import React from 'react';
import PropTypes from 'prop-types';

const DataTable = ({ columns, data }) => {
  if (!Array.isArray(data) || !Array.isArray(columns)) {
    throw new Error('DataTable requires both columns and data to be arrays');
  }

  return (
    <div className="bg-[#1f1b3a] rounded-xl border border-[#3a295d] overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#3a295d]">
          <thead className="bg-[#2e1a47]">
            <tr>
              {columns.map((col, i) => (
                <th 
                  key={col.Header || i}
                  className="px-6 py-3 text-left text-xs font-semibold text-purple-200 uppercase tracking-wider"
                >
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[#1f1b3a] divide-y divide-[#3a295d]">
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="hover:bg-[#2e1a47] transition-colors duration-200">
                {columns.map((col, colIndex) => (
                  <td 
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-200"
                  >
                    {col.Cell ? col.Cell({ value: row[col.accessor], row }) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default DataTable;