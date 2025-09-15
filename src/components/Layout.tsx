import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  Home, 
  MapPin, 
  List, 
  Activity, 
  Stethoscope, 
  User, 
  Settings,
  Book,
  FileText 
} from 'lucide-react';
import { searchService, SearchResult } from '../lib/searchService';
import { simpleDb as db } from '../lib/simpleDatabase';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchInitialized, setSearchInitialized] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Body Map', href: '/body-map', icon: User },
    { name: 'Points', href: '/points', icon: MapPin },
    { name: 'Indications', href: '/indications', icon: List },
    { name: 'Modalities', href: '/modalities', icon: Stethoscope },
    { name: 'Protocols', href: '/protocols', icon: Activity },
    { name: 'TCM Theory', href: '/theory', icon: Book },
    { name: 'Patient Intake', href: '/intake', icon: FileText },
    { name: 'AI Assistant', href: '/ai-assistant', icon: User },
    { name: 'Plugin System', href: '/modality-system', icon: Activity },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isCurrentPath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Initialize search when component mounts
  useEffect(() => {
    const initializeSearch = async () => {
      try {
        await db.initialize();
        const [points, indications, techniques] = await Promise.all([
          db.getPoints(),
          db.getIndications(),
          db.getTechniques()
        ]);

        await searchService.indexData({
          points,
          indications,
          techniques,
          herbs: [], // Will be added when herbs are implemented
          dietItems: [] // Will be added when diet items are implemented
        });

        setSearchInitialized(true);
      } catch (error) {
        console.error('Failed to initialize search:', error);
      }
    };

    initializeSearch();
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchInitialized || !searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const results = searchService.search(searchQuery);
    setSearchResults(results);
    setShowResults(results.length > 0);
  }, [searchQuery, searchInitialized]);

  const handleSearchResultClick = (result: SearchResult) => {
    setShowResults(false);
    setSearchQuery('');
    
    switch (result.type) {
      case 'point':
        navigate(`/points/${result.id}`);
        break;
      case 'indication':
        navigate(`/indications/${result.id}`);
        break;
      case 'technique':
        navigate(`/modalities`);
        break;
      default:
        break;
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'point': return <MapPin className="h-4 w-4" />;
      case 'indication': return <List className="h-4 w-4" />;
      case 'technique': return <Stethoscope className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <Activity className="h-8 w-8 text-tcm-accent" />
            <span className="ml-2 text-xl font-bold text-tcm-primary">AcuReference</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const current = isCurrentPath(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${current
                      ? 'bg-tcm-accent text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Medical Disclaimer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            For reference only. Not a substitute for professional medical advice.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search points, indications, techniques..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tcm-accent focus:border-transparent"
                />
              </div>

              {/* Search results dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.slice(0, 10).map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1 text-tcm-accent">
                          {getResultIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </h4>
                            <span className="text-xs text-white bg-tcm-accent px-2 py-1 rounded capitalize">
                              {result.type}
                            </span>
                          </div>
                          {result.subtitle && (
                            <p className="text-sm text-gray-700 truncate font-medium">{result.subtitle}</p>
                          )}
                          {result.snippet && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{result.snippet}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {searchResults.length > 10 && (
                    <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
                      +{searchResults.length - 10} more results
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
