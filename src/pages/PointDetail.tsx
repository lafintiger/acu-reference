import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertTriangle, Clock, FileText } from 'lucide-react';
import LocalAIAssistant from '../components/LocalAIAssistant';
import { simpleDb as db } from '../lib/simpleDatabase';
import { Point, Meridian } from '../types';

const PointDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [point, setPoint] = useState<Point | null>(null);
  const [meridian, setMeridian] = useState<Meridian | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPoint = async () => {
      if (!id) return;
      
      try {
        await db.initialize();
        
        const pointData = await db.getPoint(id);
        if (pointData) {
          setPoint(pointData);
          
          if (pointData.meridianId) {
            const meridians = await db.getMeridians();
            const meridianData = meridians.find(m => m.id === pointData.meridianId);
            setMeridian(meridianData || null);
          }
        }
      } catch (error) {
        console.error('Failed to load point:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPoint();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tcm-accent"></div>
      </div>
    );
  }

  if (!point) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Point Not Found</h1>
          <p className="text-gray-600 mb-6">The requested acupuncture point could not be found.</p>
          <Link to="/points" className="text-tcm-accent hover:text-tcm-secondary">
            ← Back to Points
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link 
        to="/points" 
        className="inline-flex items-center text-tcm-accent hover:text-tcm-secondary mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Points
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {point.id} — {point.nameEn}
            </h1>
            {point.namePinyin && (
              <p className="text-lg text-gray-600 mb-1">{point.namePinyin}</p>
            )}
            {point.nameCharacters && (
              <p className="text-lg text-gray-600">{point.nameCharacters}</p>
            )}
          </div>
          
          <div className="text-right">
            {meridian && (
              <div className="mb-2">
                <span className="text-sm text-gray-500">Meridian</span>
                <p className="font-medium text-tcm-accent">
                  {meridian.name} ({meridian.id})
                </p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Category</span>
              <p className="font-medium capitalize">{point.category}</p>
            </div>
          </div>
        </div>

        {meridian?.description && (
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-600">{meridian.description}</p>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 text-tcm-accent mr-2" />
              Location
            </h2>
            <p className="text-gray-700 leading-relaxed">{point.location}</p>
          </div>

          {/* Acupressure guidance */}
          {point.acupressureDepth && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 text-tcm-accent mr-2" />
                Acupressure Guidance
              </h2>
              <p className="text-gray-700 leading-relaxed">{point.acupressureDepth}</p>
            </div>
          )}

          {/* Notes */}
          {point.notes && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-tcm-accent mr-2" />
                Clinical Notes
              </h2>
              <p className="text-gray-700 leading-relaxed">{point.notes}</p>
            </div>
          )}

          {/* AI Assistant for Point Guidance */}
          <LocalAIAssistant 
            currentCondition={`point_guidance_${point.id}`}
            compact={true}
          />
        </div>

        {/* Right column - Indications & contraindications */}
        <div className="space-y-6">
          {/* Indications */}
          {point.indications.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Indications</h2>
              <div className="space-y-2">
                {point.indications.map((indication) => (
                  <Link
                    key={indication}
                    to={`/indications/${indication}`}
                    className="block p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <span className="text-green-800 font-medium">
                      {indication.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Contraindications */}
          {point.contraindications && point.contraindications.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Contraindications
              </h2>
              <div className="space-y-2">
                {point.contraindications.map((contraindication, index) => (
                  <div
                    key={index}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <span className="text-red-800 font-medium">
                      {contraindication.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Point properties */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Point Properties</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Point Code</span>
                <p className="font-medium">{point.id}</p>
              </div>
              
              {point.meridianId && (
                <div>
                  <span className="text-sm text-gray-500">Meridian</span>
                  <p className="font-medium">{point.meridianId}</p>
                </div>
              )}
              
              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="font-medium capitalize">{point.category}</p>
              </div>

              {meridian?.element && (
                <div>
                  <span className="text-sm text-gray-500">Element</span>
                  <p className="font-medium capitalize">{meridian.element}</p>
                </div>
              )}

              {meridian?.yinYang && (
                <div>
                  <span className="text-sm text-gray-500">Yin/Yang</span>
                  <p className="font-medium capitalize">{meridian.yinYang}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointDetail;
