import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Hand, Circle, Waves, Activity } from 'lucide-react';
import { simpleDb as db } from '../lib/simpleDatabase';
import { Technique, Modality } from '../types';

const Modalities = () => {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.initialize();
        
        const [techniquesData, modalitiesData] = await Promise.all([
          db.getTechniques(),
          // For now, we'll use the seed data directly since we don't have a getModalities method yet
          Promise.resolve([
            { id: 'acupressure' as const, label: 'Acupressure', description: 'Applying pressure to specific points using fingers, thumbs, or tools' },
            { id: 'cupping' as const, label: 'Cupping', description: 'Creating suction on the skin using cups to promote healing' },
            { id: 'gua_sha' as const, label: 'Gua Sha', description: 'Scraping the skin with a smooth-edged tool to promote circulation' },
            { id: 'applied_kinesiology' as const, label: 'Applied Kinesiology', description: 'Muscle testing to assess and treat functional imbalances' }
          ])
        ]);

        setTechniques(techniquesData);
        setModalities(modalitiesData);
      } catch (error) {
        console.error('Failed to load modalities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getModalityIcon = (modalityId: string) => {
    switch (modalityId) {
      case 'acupressure':
        return Hand;
      case 'cupping':
        return Circle;
      case 'gua_sha':
        return Waves;
      case 'applied_kinesiology':
        return Activity;
      default:
        return Stethoscope;
    }
  };

  const groupedTechniques = techniques.reduce((acc, technique) => {
    if (!acc[technique.modalityId]) {
      acc[technique.modalityId] = [];
    }
    acc[technique.modalityId].push(technique);
    return acc;
  }, {} as Record<string, Technique[]>);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complementary Modalities</h1>
        <p className="text-gray-600">Explore different therapeutic approaches and techniques</p>
      </div>

      {/* Modalities overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {modalities.map((modality) => {
          const Icon = getModalityIcon(modality.id);
          const modalityTechniques = groupedTechniques[modality.id] || [];
          
          return (
            <div key={modality.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-tcm-accent bg-opacity-10 rounded-lg mr-3">
                  <Icon className="h-6 w-6 text-tcm-accent" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{modality.label}</h2>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{modality.description}</p>
              
              <div className="space-y-3">
                <div className="text-sm text-tcm-accent">
                  {modalityTechniques.length} techniques available
                </div>
                
                {modality.id === 'acupressure' && (
                  <Link
                    to="/acupressure"
                    className="inline-flex items-center px-3 py-2 border border-tcm-accent text-sm font-medium rounded-md text-tcm-accent bg-white hover:bg-tcm-accent hover:text-white transition-colors"
                  >
                    View Treatment Protocols →
                  </Link>
                )}
                
                {modality.id === 'cupping' && (
                  <Link
                    to="/cupping"
                    className="inline-flex items-center px-3 py-2 border border-tcm-accent text-sm font-medium rounded-md text-tcm-accent bg-white hover:bg-tcm-accent hover:text-white transition-colors"
                  >
                    View Cupping Protocols →
                  </Link>
                )}
                
                {modality.id === 'gua_sha' && (
                  <Link
                    to="/gua-sha"
                    className="inline-flex items-center px-3 py-2 border border-tcm-accent text-sm font-medium rounded-md text-tcm-accent bg-white hover:bg-tcm-accent hover:text-white transition-colors"
                  >
                    View Gua Sha Protocols →
                  </Link>
                )}
                
                {modality.id === 'applied_kinesiology' && (
                  <Link
                    to="/applied-kinesiology"
                    className="inline-flex items-center px-3 py-2 border border-tcm-accent text-sm font-medium rounded-md text-tcm-accent bg-white hover:bg-tcm-accent hover:text-white transition-colors"
                  >
                    View AK Protocols →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Techniques by modality */}
      <div className="space-y-8">
        {modalities.map((modality) => {
          const modalityTechniques = groupedTechniques[modality.id] || [];
          const Icon = getModalityIcon(modality.id);
          
          if (modalityTechniques.length === 0) return null;

          return (
            <div key={modality.id} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Icon className="h-5 w-5 text-tcm-accent mr-2" />
                  {modality.label}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    {modalityTechniques.length} techniques
                  </span>
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {modalityTechniques.map((technique) => (
                    <div
                      key={technique.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-tcm-accent transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {technique.name}
                      </h3>
                      
                      {technique.description && (
                        <p className="text-gray-700 text-sm mb-3">
                          {technique.description}
                        </p>
                      )}

                      {technique.duration && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Duration
                          </span>
                          <p className="text-sm text-gray-700">{technique.duration}</p>
                        </div>
                      )}

                      {technique.equipment && technique.equipment.length > 0 && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Equipment
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {technique.equipment.map((item) => (
                              <span
                                key={item}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {technique.cautions && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <span className="text-xs font-medium text-yellow-800 uppercase tracking-wide">
                            Cautions
                          </span>
                          <p className="text-sm text-yellow-800 mt-1">
                            {technique.cautions}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational note */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Professional Note</h3>
        <p className="text-blue-800 text-sm">
          These modalities require proper training and certification. Always ensure you are qualified 
          and licensed to practice these techniques in your jurisdiction. When in doubt, refer to 
          appropriately trained practitioners.
        </p>
      </div>
    </div>
  );
};

export default Modalities;
