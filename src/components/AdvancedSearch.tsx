import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Zap, Target, Compass } from 'lucide-react';
import { simpleDb as db } from '../lib/simpleDatabase';
import { searchService } from '../lib/searchService';
import { Point, Meridian } from '../types';

interface AdvancedSearchProps {
  onResultsChange: (results: Point[]) => void;
  onClose?: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onResultsChange, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [meridians, setMeridians] = useState<Meridian[]>([]);
  const [allPoints, setAllPoints] = useState<Point[]>([]);
  
  // Filter states
  const [selectedMeridian, setSelectedMeridian] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [selectedPointType, setSelectedPointType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [hasContraindications, setHasContraindications] = useState('');
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.initialize();
        const [meridiansData, pointsData] = await Promise.all([
          db.getMeridians(),
          db.getPoints()
        ]);
        setMeridians(meridiansData);
        setAllPoints(pointsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  // Apply advanced filters
  useEffect(() => {
    let filteredPoints = [...allPoints];

    // Text search
    if (searchQuery.trim()) {
      const searchResults = searchService.search(searchQuery, { type: 'point' });
      const searchPointIds = searchResults.map(r => r.id);
      filteredPoints = filteredPoints.filter(point => searchPointIds.includes(point.id));
    }

    // Meridian filter
    if (selectedMeridian) {
      filteredPoints = filteredPoints.filter(point => point.meridianId === selectedMeridian);
    }

    // Element filter
    if (selectedElement) {
      const elementMeridians = meridians
        .filter(m => m.element === selectedElement)
        .map(m => m.id);
      filteredPoints = filteredPoints.filter(point => 
        point.meridianId && elementMeridians.includes(point.meridianId)
      );
    }

    // Point type filter (based on common TCM classifications)
    if (selectedPointType) {
      filteredPoints = filteredPoints.filter(point => {
        const pointName = point.nameEn.toLowerCase();
        const notes = point.notes?.toLowerCase() || '';
        
        switch (selectedPointType) {
          case 'yuan_source':
            return notes.includes('yuan') || notes.includes('source');
          case 'he_sea':
            return notes.includes('he-sea') || notes.includes('sea point');
          case 'luo_connecting':
            return notes.includes('luo') || notes.includes('connecting');
          case 'xi_cleft':
            return notes.includes('xi-cleft') || notes.includes('cleft');
          case 'shu_stream':
            return notes.includes('shu-stream') || notes.includes('stream');
          case 'jing_well':
            return notes.includes('jing-well') || notes.includes('well');
          case 'ying_spring':
            return notes.includes('ying-spring') || notes.includes('spring');
          case 'jing_river':
            return notes.includes('jing-river') || notes.includes('river');
          case 'master_point':
            return notes.includes('master point') || notes.includes('master');
          case 'mu_point':
            return notes.includes('mu point') || notes.includes('front-mu');
          case 'shu_point':
            return notes.includes('shu point') || notes.includes('back-shu');
          case 'window_heaven':
            return notes.includes('window of heaven');
          case 'meeting_point':
            return notes.includes('meeting point');
          default:
            return true;
        }
      });
    }

    // Category filter
    if (selectedCategory) {
      filteredPoints = filteredPoints.filter(point => point.category === selectedCategory);
    }

    // Contraindications filter
    if (hasContraindications === 'yes') {
      filteredPoints = filteredPoints.filter(point => 
        point.contraindications && point.contraindications.length > 0
      );
    } else if (hasContraindications === 'no') {
      filteredPoints = filteredPoints.filter(point => 
        !point.contraindications || point.contraindications.length === 0
      );
    }

    onResultsChange(filteredPoints);
  }, [
    searchQuery, selectedMeridian, selectedElement, selectedPointType, 
    selectedCategory, hasContraindications, allPoints, meridians, onResultsChange
  ]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedMeridian('');
    setSelectedElement('');
    setSelectedPointType('');
    setSelectedCategory('');
    setHasContraindications('');
    setMinDuration('');
    setMaxDuration('');
  };

  const pointTypes = [
    { id: '', label: 'All Point Types' },
    { id: 'yuan_source', label: 'Yuan-Source Points' },
    { id: 'he_sea', label: 'He-Sea Points' },
    { id: 'luo_connecting', label: 'Luo-Connecting Points' },
    { id: 'xi_cleft', label: 'Xi-Cleft Points' },
    { id: 'shu_stream', label: 'Shu-Stream Points' },
    { id: 'jing_well', label: 'Jing-Well Points' },
    { id: 'ying_spring', label: 'Ying-Spring Points' },
    { id: 'jing_river', label: 'Jing-River Points' },
    { id: 'master_point', label: 'Master Points' },
    { id: 'mu_point', label: 'Front-Mu Points' },
    { id: 'shu_point', label: 'Back-Shu Points' },
    { id: 'window_heaven', label: 'Window of Heaven Points' },
    { id: 'meeting_point', label: 'Meeting Points' }
  ];

  const elements = [
    { id: '', label: 'All Elements' },
    { id: 'wood', label: 'Wood Element' },
    { id: 'fire', label: 'Fire Element' },
    { id: 'earth', label: 'Earth Element' },
    { id: 'metal', label: 'Metal Element' },
    { id: 'water', label: 'Water Element' }
  ];

  const categories = [
    { id: '', label: 'All Categories' },
    { id: 'standard', label: 'Standard Points' },
    { id: 'extra', label: 'Extra Points' },
    { id: 'extraordinary', label: 'Extraordinary Vessel Points' },
    { id: 'auricular', label: 'Auricular Points' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-tcm-accent mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Advanced Search & Filters</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Text Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Points
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by point name, location, or indication..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tcm-accent focus:border-transparent"
            />
          </div>
        </div>

        {/* TCM Theory Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Compass className="inline h-4 w-4 mr-1" />
              Five Element
            </label>
            <select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
            >
              {elements.map((element) => (
                <option key={element.id} value={element.id}>
                  {element.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meridian
            </label>
            <select
              value={selectedMeridian}
              onChange={(e) => setSelectedMeridian(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
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

        {/* Point Classification Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="inline h-4 w-4 mr-1" />
              Point Classification
            </label>
            <select
              value={selectedPointType}
              onChange={(e) => setSelectedPointType(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
            >
              {pointTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Point Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clinical Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraindications
            </label>
            <select
              value={hasContraindications}
              onChange={(e) => setHasContraindications(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
            >
              <option value="">All Points</option>
              <option value="no">Safe Points Only (No Contraindications)</option>
              <option value="yes">Points with Contraindications</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Filters
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPointType('master_point')}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedPointType === 'master_point'
                    ? 'bg-tcm-accent text-white border-tcm-accent'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-tcm-accent'
                }`}
              >
                Master Points
              </button>
              <button
                onClick={() => setHasContraindications('yes')}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  hasContraindications === 'yes'
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-500'
                }`}
              >
                Caution Points
              </button>
              <button
                onClick={() => setSelectedElement('fire')}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedElement === 'fire'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                }`}
              >
                Fire Element
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedMeridian || selectedElement || selectedPointType || selectedCategory || hasContraindications) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Active Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear All
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {selectedMeridian && (
                <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Meridian: {meridians.find(m => m.id === selectedMeridian)?.name}
                  <button onClick={() => setSelectedMeridian('')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {selectedElement && (
                <span className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                  Element: {selectedElement}
                  <button onClick={() => setSelectedElement('')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {selectedPointType && (
                <span className="inline-flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                  Type: {pointTypes.find(pt => pt.id === selectedPointType)?.label}
                  <button onClick={() => setSelectedPointType('')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {hasContraindications && (
                <span className="inline-flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                  {hasContraindications === 'yes' ? 'Has Contraindications' : 'Safe Points Only'}
                  <button onClick={() => setHasContraindications('')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Preset Searches */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
            <Zap className="h-4 w-4 mr-1" />
            Quick Preset Searches
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => {
                clearAllFilters();
                setSelectedPointType('yuan_source');
              }}
              className="p-2 text-xs bg-white border border-blue-300 rounded hover:bg-blue-50 text-left"
            >
              <strong>Constitutional</strong><br />
              Yuan-Source Points
            </button>
            
            <button
              onClick={() => {
                clearAllFilters();
                setSelectedPointType('he_sea');
              }}
              className="p-2 text-xs bg-white border border-blue-300 rounded hover:bg-blue-50 text-left"
            >
              <strong>Acute Conditions</strong><br />
              He-Sea Points
            </button>
            
            <button
              onClick={() => {
                clearAllFilters();
                setSelectedPointType('master_point');
              }}
              className="p-2 text-xs bg-white border border-blue-300 rounded hover:bg-blue-50 text-left"
            >
              <strong>Key Treatments</strong><br />
              Master Points
            </button>
            
            <button
              onClick={() => {
                clearAllFilters();
                setHasContraindications('yes');
              }}
              className="p-2 text-xs bg-white border border-red-300 rounded hover:bg-red-50 text-left"
            >
              <strong>Safety Check</strong><br />
              Caution Points
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
