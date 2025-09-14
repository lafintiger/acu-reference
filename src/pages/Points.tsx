import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Filter, Search } from 'lucide-react';
import { simpleDb as db } from '../lib/simpleDatabase';
import { Point, Meridian } from '../types';
import AdvancedSearch from '../components/AdvancedSearch';

const Points = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<Point[]>([]);
  const [meridians, setMeridians] = useState<Meridian[]>([]);
  const [selectedMeridian, setSelectedMeridian] = useState<string>('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.initialize();
        
        const [allPoints, allMeridians] = await Promise.all([
          db.getPoints(selectedMeridian || undefined),
          db.getMeridians()
        ]);

        setPoints(allPoints);
        setFilteredPoints(allPoints);
        setMeridians(allMeridians);
      } catch (error) {
        console.error('Failed to load points:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedMeridian]);

  // Apply meridian filter to advanced search results
  const displayPoints = selectedMeridian 
    ? filteredPoints.filter(point => point.meridianId === selectedMeridian)
    : filteredPoints;

  const groupedPoints = displayPoints.reduce((acc, point) => {
    const meridianId = point.meridianId || 'extra';
    if (!acc[meridianId]) {
      acc[meridianId] = [];
    }
    acc[meridianId].push(point);
    return acc;
  }, {} as Record<string, Point[]>);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Acupuncture Points</h1>
        <p className="text-gray-600">Browse points by meridian and explore their therapeutic applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <label htmlFor="meridian-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Meridian
              </label>
              <select
                id="meridian-filter"
                value={selectedMeridian}
                onChange={(e) => setSelectedMeridian(e.target.value)}
                className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
              >
                <option value="">All Meridians</option>
                {meridians.map((meridian) => (
                  <option key={meridian.id} value={meridian.id}>
                    {meridian.name} ({meridian.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
              showAdvancedSearch
                ? 'border-tcm-accent bg-tcm-accent text-white'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </button>
        </div>

        {/* Advanced Search Panel */}
        {showAdvancedSearch && (
          <AdvancedSearch
            onResultsChange={setFilteredPoints}
            onClose={() => setShowAdvancedSearch(false)}
          />
        )}
      </div>

      {/* Points grouped by meridian */}
      <div className="space-y-8">
        {Object.entries(groupedPoints).map(([meridianId, meridianPoints]) => {
          const meridian = meridians.find(m => m.id === meridianId);
          const meridianName = meridian ? meridian.name : 'Extra Points';
          
          return (
            <div key={meridianId} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 text-tcm-accent mr-2" />
                  {meridianName} ({meridianId})
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    {meridianPoints.length} points
                  </span>
                </h2>
                {meridian?.description && (
                  <p className="text-gray-600 text-sm mt-1">{meridian.description}</p>
                )}
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {meridianPoints.map((point) => (
                    <Link
                      key={point.id}
                      to={`/points/${point.id}`}
                      className="border border-gray-200 rounded-lg p-4 hover:border-tcm-accent hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{point.id}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {point.category}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-tcm-accent mb-1">{point.nameEn}</h4>
                      
                      {point.namePinyin && (
                        <p className="text-sm text-gray-600 mb-2">{point.namePinyin}</p>
                      )}
                      
                      <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                        {point.location}
                      </p>
                      
                      {point.indications.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {point.indications.slice(0, 2).map((indication) => (
                            <span
                              key={indication}
                              className="text-xs bg-tcm-accent bg-opacity-10 text-tcm-accent px-2 py-1 rounded"
                            >
                              {indication.replace('_', ' ')}
                            </span>
                          ))}
                          {point.indications.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{point.indications.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Points;
