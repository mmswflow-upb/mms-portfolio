import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 3,
  totalItems,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      // Adjust start if we're near the end
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-cosmic-purple/10 border border-cosmic-purple/20 rounded-lg">
      {/* Items info */}
      <div className="text-nebula-mint/60 text-sm">
        Showing {startItem} to {endItem} of {totalItems} items
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint hover:bg-cosmic-purple/30 hover:border-stellar-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cosmic-purple/20 disabled:hover:border-cosmic-purple/30"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                page === currentPage
                  ? "bg-stellar-blue border border-stellar-blue text-deep-space"
                  : "bg-cosmic-purple/20 border border-cosmic-purple/30 text-nebula-mint hover:bg-cosmic-purple/30 hover:border-stellar-blue"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-cosmic-purple/20 border border-cosmic-purple/30 rounded-lg text-nebula-mint hover:bg-cosmic-purple/30 hover:border-stellar-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cosmic-purple/20 disabled:hover:border-cosmic-purple/30"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
