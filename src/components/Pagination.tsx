import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const getPageNumbers = () => {
    const range = 2; // Show 2 pages before and after current page
    const pages: (number | string)[] = [];
    
    // Always add page 1
    pages.push(1);
    
    // Add ellipsis after page 1 if needed
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - range); i <= Math.min(totalPages - 1, currentPage + range); i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Always add last page if it's not page 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`min-w-[40px] h-10 rounded-md font-medium transition-colors ${
              currentPage === page 
                ? 'bg-primary text-white' 
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="text-muted-foreground">
            {page}
          </span>
        )
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;