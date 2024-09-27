// components/Pagination.js
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center mt-8">
    {currentPage > 1 && (
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full mr-2"
      >
        <ChevronLeftIcon className="h-6 w-6 text-white" />
      </button>
    )}
    <span className="text-lg font-bold mx-2">
      Page {currentPage} of {totalPages}
    </span>
    {currentPage < totalPages && (
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full ml-2"
      >
        <ChevronRightIcon className="h-6 w-6 text-white" />
      </button>
    )}
  </div>
);

export default Pagination;
