// Dynamic Navigation - Auto-generated from plugins
// This component creates navigation items automatically from registered plugins

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DynamicRouter from '../lib/modality-system/dynamic-router';

interface DynamicNavigationProps {
  className?: string;
}

const DynamicNavigation: React.FC<DynamicNavigationProps> = ({ className = '' }) => {
  const [navigationItems, setNavigationItems] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    const loadNavigation = () => {
      try {
        const items = DynamicRouter.generatePluginNavigation();
        setNavigationItems(items);
      } catch (error) {
        console.error('Failed to load dynamic navigation:', error);
      }
    };

    if (DynamicRouter.isReady()) {
      loadNavigation();
    } else {
      const checkInterval = setInterval(() => {
        if (DynamicRouter.isReady()) {
          loadNavigation();
          clearInterval(checkInterval);
        }
      }, 100);
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }, []);

  const isCurrentPath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className={className}>
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isCurrentPath(item.path)
              ? 'bg-tcm-accent text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="mr-3 text-lg">{item.icon}</span>
          {item.name}
          <span className="ml-auto text-xs opacity-75 capitalize">
            {item.category}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default DynamicNavigation;
