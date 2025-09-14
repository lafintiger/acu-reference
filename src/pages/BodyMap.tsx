import { useState } from 'react';
import { User, RotateCcw, ZoomIn, ZoomOut, Grid, Tag, Route, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ImageUploadBodyMap from '../components/ImageUploadBodyMap';
import { getPointsForView } from '../data/pointCoordinates';

const BodyMap = () => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<'front' | 'back'>('front');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [showLabels, setShowLabels] = useState(true);
  const [showAllPoints, setShowAllPoints] = useState(true);
  const [selectedMeridian, setSelectedMeridian] = useState<string>('');
  const [specificPointId, setSpecificPointId] = useState<string>('');
  const [zoom, setZoom] = useState(100);

  const views = [
    { id: 'front' as const, label: 'Anterior' },
    { id: 'back' as const, label: 'Posterior' },
  ];

  const genders = [
    { id: 'male' as const, label: 'Male' },
    { id: 'female' as const, label: 'Female' },
  ];

  const allViewPoints = getPointsForView(selectedView);
  
  // Filter points based on current settings
  const getFilteredPoints = () => {
    let points = allViewPoints;
    
    // If not showing all points, return empty array
    if (!showAllPoints) {
      // If specific point ID is entered, show only that point
      if (specificPointId) {
        points = points.filter(point => 
          point.id.toLowerCase().includes(specificPointId.toLowerCase())
        );
      } else {
        points = []; // No points if not showing all and no specific point
      }
    }
    
    // Filter by meridian if selected
    if (selectedMeridian) {
      points = points.filter(point => {
        const pointMeridian = point.id.match(/^[A-Z]+/)?.[0];
        return pointMeridian === selectedMeridian;
      });
    }
    
    return points;
  };

  const currentViewPoints = getFilteredPoints();

  const handlePointClick = (pointId: string) => {
    navigate(`/points/${pointId}`);
  };

  const meridianOptions = [
    { id: '', label: 'All Meridians' },
    { id: 'LU', label: 'Lung (LU)' },
    { id: 'LI', label: 'Large Intestine (LI)' },
    { id: 'ST', label: 'Stomach (ST)' },
    { id: 'SP', label: 'Spleen (SP)' },
    { id: 'HT', label: 'Heart (HT)' },
    { id: 'SI', label: 'Small Intestine (SI)' },
    { id: 'BL', label: 'Bladder (BL)' },
    { id: 'KI', label: 'Kidney (KI)' },
    { id: 'PC', label: 'Pericardium (PC)' },
    { id: 'TH', label: 'Triple Heater (TH)' },
    { id: 'GB', label: 'Gall Bladder (GB)' },
    { id: 'LV', label: 'Liver (LV)' },
    { id: 'DU', label: 'Governing Vessel (DU)' },
    { id: 'REN', label: 'Conception Vessel (REN)' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Body Map</h1>
        <p className="text-gray-600">Professional anatomical reference with acupuncture points</p>
      </div>

      {/* Main Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="space-y-4">
          {/* Gender and View Selection */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Gender selector */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Gender:</span>
              <div className="flex space-x-4">
                {genders.map((gender) => (
                  <label key={gender.id} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={gender.id}
                      checked={selectedGender === gender.id}
                      onChange={(e) => setSelectedGender(e.target.value as 'male' | 'female')}
                      className="h-4 w-4 text-tcm-accent focus:ring-tcm-accent border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{gender.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* View selector */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex space-x-4">
                {views.map((view) => (
                  <label key={view.id} className="flex items-center">
                    <input
                      type="radio"
                      name="view"
                      value={view.id}
                      checked={selectedView === view.id}
                      onChange={(e) => setSelectedView(e.target.value as 'front' | 'back')}
                      className="h-4 w-4 text-tcm-accent focus:ring-tcm-accent border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{view.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Zoom controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-[3rem] text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Toggle controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  id="show-labels"
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="h-4 w-4 text-tcm-accent focus:ring-tcm-accent border-gray-300 rounded"
                />
                <label htmlFor="show-labels" className="ml-2 text-sm text-gray-700 flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Labels
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="show-all-points"
                  type="checkbox"
                  checked={showAllPoints}
                  onChange={(e) => {
                    setShowAllPoints(e.target.checked);
                    if (!e.target.checked) {
                      setSpecificPointId('');
                      setSelectedMeridian('');
                    }
                  }}
                  className="h-4 w-4 text-tcm-accent focus:ring-tcm-accent border-gray-300 rounded"
                />
                <label htmlFor="show-all-points" className="ml-2 text-sm text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Show Points
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Point filtering controls */}
      {showAllPoints && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Meridian selector */}
              <div className="flex items-center space-x-2">
                <Route className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedMeridian}
                  onChange={(e) => setSelectedMeridian(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
                >
                  {meridianOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specific point search */}
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter point ID (e.g., LI4)"
                  value={specificPointId}
                  onChange={(e) => setSpecificPointId(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent text-sm"
                  style={{ width: '150px' }}
                />
              </div>

              {/* Clear filters */}
              {(selectedMeridian || specificPointId) && (
                <button
                  onClick={() => {
                    setSelectedMeridian('');
                    setSpecificPointId('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Quick meridian buttons */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Quick Meridian Selection:</p>
              <div className="flex flex-wrap gap-2">
                {['LI', 'LU', 'ST', 'SP', 'HT', 'SI', 'BL', 'KI', 'PC', 'TH', 'GB', 'LV', 'DU', 'REN'].map((meridian) => (
                  <button
                    key={meridian}
                    onClick={() => {
                      setSelectedMeridian(meridian);
                      setSpecificPointId('');
                    }}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      selectedMeridian === meridian
                        ? 'bg-tcm-accent text-white border-tcm-accent'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-tcm-accent hover:text-tcm-accent'
                    }`}
                  >
                    {meridian}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Body map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <div 
              className="relative mx-auto overflow-auto rounded-lg"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                maxHeight: '85vh'
              }}
            >
              <ImageUploadBodyMap
                view={selectedView}
                gender={selectedGender}
                points={currentViewPoints}
                showLabels={showLabels}
                onPointClick={handlePointClick}
                width={600}
                height={800}
              />
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                {showAllPoints 
                  ? `Click on red points to view details • ${currentViewPoints.length} points visible`
                  : 'Points hidden - use controls above to show specific points or meridians'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Point list for current view */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Points - {genders.find(g => g.id === selectedGender)?.label} {views.find(v => v.id === selectedView)?.label}
            </h2>
            
            {currentViewPoints.length > 0 ? (
              <div className="space-y-3">
                {currentViewPoints.map((point) => (
                  <div
                    key={point.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-tcm-accent cursor-pointer transition-colors"
                    onClick={() => handlePointClick(point.id)}
                  >
                    <div className="font-medium text-gray-900">{point.id}</div>
                    <div className="text-sm text-tcm-accent mb-1">{point.name}</div>
                    {point.anatomicalLandmark && (
                      <div className="text-xs text-gray-500">
                        📍 {point.anatomicalLandmark}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">
                {showAllPoints 
                  ? 'No points mapped for this view yet.'
                  : 'Points hidden. Use controls above to show points.'
                }
              </p>
            )}
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Acupuncture Points</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Hovered Point</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional notes */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Professional Usage</h3>
          <p className="text-blue-800 text-sm mb-2">
            High-resolution anatomical images provide accurate reference for point location.
          </p>
          <ul className="text-blue-800 text-xs space-y-1">
            <li>• Use gender-appropriate anatomical models</li>
            <li>• Switch between anterior and posterior views</li>
            <li>• Hide points for clean anatomical study</li>
            <li>• Filter by meridian for focused learning</li>
          </ul>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Clinical Reference</h3>
          <p className="text-green-800 text-sm mb-2">
            Always confirm point locations with traditional methods:
          </p>
          <ul className="text-green-800 text-xs space-y-1">
            <li>• Patient's individual proportions</li>
            <li>• Anatomical landmark palpation</li>
            <li>• Traditional cun measurements</li>
            <li>• Patient feedback during treatment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BodyMap;