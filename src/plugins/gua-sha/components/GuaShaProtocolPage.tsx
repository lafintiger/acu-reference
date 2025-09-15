import React from 'react';
import { Wind } from 'lucide-react';

const GuaShaProtocolPage: React.FC<{ indication?: string }> = ({ indication }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Wind className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gua Sha Protocols
              {indication && ` for ${indication.replace('_', ' ')}`}
            </h1>
            <p className="text-gray-600 mt-1">
              Scraping therapy protocols (Plugin System)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuaShaProtocolPage;
