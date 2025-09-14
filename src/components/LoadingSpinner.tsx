import { Activity } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tcm-accent mx-auto"></div>
          <Activity className="h-6 w-6 text-tcm-accent absolute top-3 left-1/2 transform -translate-x-1/2" />
        </div>
        <p className="text-gray-600">{message}</p>
        <p className="text-sm text-gray-500 mt-2">Initializing database...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
