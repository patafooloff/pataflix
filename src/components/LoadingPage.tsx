import React from 'react';
import { Film } from 'lucide-react';

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Film className="w-16 h-16 text-primary animate-pulse" />
      <h2 className="mt-4 text-xl font-semibold">Loading...</h2>
    </div>
  );
};

export default LoadingPage;