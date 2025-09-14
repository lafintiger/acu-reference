import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, List, Stethoscope, Activity, FileText, Hand, Circle, Waves } from 'lucide-react';
import { simpleDb as db } from '../lib/simpleDatabase';
import { Point } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [recentPoints, setRecentPoints] = useState<Point[]>([]);
  const [totalCounts, setTotalCounts] = useState({
    points: 0,
    indications: 0,
    meridians: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.initialize();
        
        const [points, indications, meridians] = await Promise.all([
          db.getPoints(),
          db.getIndications(),
          db.getMeridians()
        ]);

        setRecentPoints(points.slice(0, 6)); // Show first 6 points
        setTotalCounts({
          points: points.length,
          indications: indications.length,
          meridians: meridians.length
        });
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const quickActions = [
    {
      name: 'Browse Points',
      description: 'Explore acupuncture points by meridian',
      href: '/points',
      icon: MapPin,
      color: 'bg-blue-500'
    },
    {
      name: 'View Body Map',
      description: 'Interactive anatomical reference',
      href: '/body-map',
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      name: 'Search Indications',
      description: 'Find points by symptoms/conditions',
      href: '/indications',
      icon: List,
      color: 'bg-purple-500'
    },
    {
      name: 'Build Protocols',
      description: 'Create custom treatment sequences',
      href: '/protocols',
      icon: FileText,
      color: 'bg-tcm-accent'
    },
    {
      name: 'Explore Modalities',
      description: 'Cupping, Gua Sha, Applied Kinesiology',
      href: '/modalities',
      icon: Stethoscope,
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return <LoadingSpinner message="Loading AcuReference..." />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to AcuReference</h1>
        <p className="text-lg text-gray-600">
          Your comprehensive Traditional Chinese Medicine reference tool
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{totalCounts.points}</p>
              <p className="text-gray-600">Acupoints</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <List className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{totalCounts.indications}</p>
              <p className="text-gray-600">Indications</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{totalCounts.meridians}</p>
              <p className="text-gray-600">Meridians</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 group"
              >
                <div className={`inline-flex p-3 rounded-lg ${action.color} text-white mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-tcm-accent">
                  {action.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Treatment Modalities Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Complete Treatment System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/acupressure" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow group">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Hand className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-tcm-accent">Acupressure</h3>
            </div>
            <p className="text-gray-600 text-sm">Complete point protocols with pressure guidance</p>
          </Link>

          <Link to="/cupping" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow group">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-orange-50 rounded-lg mr-3">
                <Circle className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-tcm-accent">Cupping</h3>
            </div>
            <p className="text-gray-600 text-sm">Professional suction therapy protocols</p>
          </Link>

          <Link to="/gua-sha" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow group">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg mr-3">
                <Waves className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-tcm-accent">Gua Sha</h3>
            </div>
            <p className="text-gray-600 text-sm">Traditional scraping therapy techniques</p>
          </Link>

          <Link to="/applied-kinesiology" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow group">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-tcm-accent">Applied Kinesiology</h3>
            </div>
            <p className="text-gray-600 text-sm">Muscle testing and assessment protocols</p>
          </Link>
        </div>
      </div>

      {/* Recent/Featured points */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Featured Points</h2>
          <Link to="/points" className="text-tcm-accent hover:text-tcm-secondary">
            View all →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentPoints.map((point) => (
            <Link
              key={point.id}
              to={`/points/${point.id}`}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">{point.id} — {point.nameEn}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {point.meridianId}
                </span>
              </div>
              
              {point.namePinyin && (
                <p className="text-sm text-gray-600 mb-2">{point.namePinyin}</p>
              )}
              
              <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                {point.location}
              </p>
              
              {point.indications.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {point.indications.slice(0, 3).map((indication) => (
                    <span
                      key={indication}
                      className="text-xs bg-tcm-accent bg-opacity-10 text-tcm-accent px-2 py-1 rounded"
                    >
                      {indication.replace('_', ' ')}
                    </span>
                  ))}
                  {point.indications.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{point.indications.length - 3} more
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
};

export default Home;
