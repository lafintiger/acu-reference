// Mobile Navigation Component
// Touch-optimized navigation for mobile and tablet devices

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Stethoscope, 
  Activity, 
  List, 
  MapPin, 
  User, 
  Brain,
  Menu,
  X,
  Settings
} from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home, primary: true },
    { name: 'Patient Intake', href: '/intake', icon: FileText, primary: true },
    { name: 'Assessment', href: '/assessment', icon: Stethoscope, primary: true },
    { name: 'Treatment', href: '/treatment', icon: Activity, primary: true },
    { name: 'Monitoring', href: '/monitoring', icon: List, primary: true },
    { name: 'Points', href: '/points', icon: MapPin, primary: false },
    { name: 'Body Map', href: '/body-map', icon: User, primary: false },
    { name: 'AI Assistant', href: '/ai-assistant', icon: Brain, primary: false },
    { name: 'Settings', href: '/settings', icon: Settings, primary: false },
  ];

  const primaryItems = navigationItems.filter(item => item.primary);
  const secondaryItems = navigationItems.filter(item => !item.primary);

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-tcm-accent rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">TCM</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">AcuReference</h2>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Primary Navigation (Clinical Workflow) */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Clinical Workflow
          </h3>
          <div className="space-y-1">
            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = isCurrentPath(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onToggle}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${isCurrent
                      ? 'bg-tcm-accent text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mr-3 ${isCurrent ? 'text-white' : 'text-gray-500'}`} />
                  {item.name}
                  {isCurrent && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Secondary Navigation (Tools & References) */}
        <div className="px-4 pb-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Tools & References
          </h3>
          <div className="space-y-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = isCurrentPath(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onToggle}
                  className={`
                    flex items-center px-4 py-2 text-sm rounded-lg transition-colors
                    ${isCurrent
                      ? 'bg-gray-100 text-tcm-accent'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 mr-3 ${isCurrent ? 'text-tcm-accent' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Info Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-tcm-accent rounded-full flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Dr. Practitioner</p>
              <p className="text-xs text-gray-600">Licensed Acupuncturist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-30">
        <div className="grid grid-cols-5 gap-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isCurrent = isCurrentPath(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex flex-col items-center justify-center py-2 px-1 transition-colors
                  ${isCurrent
                    ? 'text-tcm-accent bg-tcm-light'
                    : 'text-gray-600 hover:text-tcm-accent hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isCurrent ? 'text-tcm-accent' : 'text-gray-500'}`} />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
                {isCurrent && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-tcm-accent rounded-b-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
