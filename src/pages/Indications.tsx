import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { List, Search } from 'lucide-react';
import { simpleDb as db } from '../lib/simpleDatabase';
import { Indication } from '../types';

const Indications = () => {
  const [indications, setIndications] = useState<Indication[]>([]);
  const [filteredIndications, setFilteredIndications] = useState<Indication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIndications = async () => {
      try {
        await db.initialize();
        const data = await db.getIndications();
        setIndications(data);
        setFilteredIndications(data);
      } catch (error) {
        console.error('Failed to load indications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIndications();
  }, []);

  useEffect(() => {
    let filtered = indications;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(indication => 
        indication.label.toLowerCase().includes(query) ||
        indication.synonyms?.some(synonym => synonym.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(indication => indication.category === selectedCategory);
    }

    setFilteredIndications(filtered);
  }, [indications, searchQuery, selectedCategory]);

  const categories = [...new Set(indications.map(i => i.category).filter(Boolean))].sort();

  const groupedIndications = filteredIndications.reduce((acc, indication) => {
    const category = indication.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(indication);
    return acc;
  }, {} as Record<string, Indication[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tcm-accent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Indications & Conditions</h1>
        <p className="text-gray-600">Browse conditions and symptoms treated with TCM</p>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search indications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tcm-accent focus:border-transparent"
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredIndications.length} of {indications.length} indications
        </p>
      </div>

      {/* Indications grouped by category */}
      <div className="space-y-8">
        {Object.entries(groupedIndications).map(([category, categoryIndications]) => (
          <div key={category} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <List className="h-5 w-5 text-tcm-accent mr-2" />
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {categoryIndications.length} conditions
                </span>
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryIndications.map((indication) => (
                  <Link
                    key={indication.id}
                    to={`/indications/${indication.id}`}
                    className="border border-gray-200 rounded-lg p-4 hover:border-tcm-accent hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {indication.label}
                    </h3>
                    
                    {indication.synonyms && indication.synonyms.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Also known as:</p>
                        <div className="flex flex-wrap gap-1">
                          {indication.synonyms.slice(0, 2).map((synonym) => (
                            <span
                              key={synonym}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {synonym}
                            </span>
                          ))}
                          {indication.synonyms.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{indication.synonyms.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-tcm-accent">
                      View treatment points →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIndications.length === 0 && (
        <div className="text-center py-12">
          <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No indications found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or category filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default Indications;
