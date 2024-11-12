// Pagination.js
import React from 'react';

const PaginationComponent = ({ currentPage, totalPages, goToPage, isFilterActive, isSearchActive }) => {
  if (isFilterActive || isSearchActive) return null;

  return (
    <div className="flex justify-between items-center mt-4">
      <button
        className={`px-4 py-2 bg-gray-300 rounded-full ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt; Prev
      </button>
      <span className="text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        className={`px-4 py-2 bg-gray-300 rounded-full ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &gt;
      </button>
    </div>
  );
};

export default PaginationComponent;
