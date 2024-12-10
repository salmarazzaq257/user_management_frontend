import React from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  resultsPerPage: number;
  totalResults: number;
  onPageChange: (page: number) => void;
}

const Table = <T,>({
  data,
  columns,
  currentPage,
  resultsPerPage,
  totalResults,
  onPageChange,
}: TableProps<T>) => {
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div>
      <table aria-label="Data Table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={String(column.key)}>
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
