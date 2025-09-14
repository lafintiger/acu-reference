import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Copy, Download, FileText } from 'lucide-react';
import { simpleDb as db } from '../lib/simpleDatabase';
import { Protocol } from '../types';

const Protocols = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProtocols = async () => {
      try {
        // Create comprehensive protocols based on our treatment data
        const comprehensiveProtocols: Protocol[] = [
          {
            id: 'headache_comprehensive',
            name: 'Comprehensive Headache Relief Protocol',
            tags: ['headache', 'tension', 'multi-modal', 'common'],
            notes: 'Complete multi-modal approach: AK assessment, acupressure (LI4, GB20, LV3), cupping upper back, integration exercises',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'back_pain_complete',
            name: 'Complete Back Pain Treatment Protocol',
            tags: ['back_pain', 'structural', 'multi-modal'],
            notes: 'Full protocol: AK muscle testing (psoas, glutes), acupressure (BL23, BL40, GV4), cupping bladder meridian, gua sha fascial release',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'digestive_support_full',
            name: 'Digestive Health Support Protocol',
            tags: ['digestion', 'stomach', 'spleen', 'multi-modal'],
            notes: 'Complete digestive support: AK digestive muscle testing, acupressure (ST36, SP6, CV12), gentle abdominal cupping, lifestyle guidance',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'anxiety_emotional_balance',
            name: 'Emotional Balance & Anxiety Protocol',
            tags: ['anxiety', 'stress', 'heart', 'shen', 'emotional'],
            notes: 'Emotional regulation protocol: AK emotional assessment, acupressure (HT7, PC6, CV17), gentle upper back cupping, ESR techniques',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'neck_shoulder_release',
            name: 'Neck & Shoulder Tension Release Protocol',
            tags: ['neck_stiffness', 'shoulder_pain', 'tension', 'workplace'],
            notes: 'Workplace tension relief: AK cervical assessment, acupressure (GB20, BL10, SI3), cupping trapezius, gua sha neck/shoulders',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'respiratory_support',
            name: 'Respiratory Health Support Protocol',
            tags: ['cough', 'asthma', 'respiratory', 'lung'],
            notes: 'Respiratory support: acupressure (LU9, LU5, BL13), upper back cupping, gentle gua sha lung areas, breathing exercises',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'insomnia_sleep_restoration',
            name: 'Sleep Restoration Protocol',
            tags: ['insomnia', 'sleep', 'heart', 'kidney', 'calming'],
            notes: 'Sleep improvement: AK stress assessment, acupressure (HT7, KI1, KI6), gentle calming techniques, bedtime routine',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'hypertension_management',
            name: 'Blood Pressure Management Protocol',
            tags: ['hypertension', 'cardiovascular', 'liver', 'kidney'],
            notes: 'BP regulation: AK cardiovascular assessment, acupressure (LV3, KI1, GV20), gentle gua sha, lifestyle modifications',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'common_cold_treatment',
            name: 'Common Cold Treatment Protocol',
            tags: ['common_cold', 'respiratory', 'wind_cold', 'immune'],
            notes: 'Cold treatment: acupressure wind points, cupping upper back wind gate, gua sha pathogen release, warming care',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'muscle_tension_release',
            name: 'General Muscle Tension Release Protocol',
            tags: ['muscle_tension', 'fascial_release', 'circulation'],
            notes: 'Muscle release: AK muscle assessment, targeted acupressure, cupping tension areas, gua sha fascial lines, movement integration',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'fatigue_energy_restoration',
            name: 'Energy Restoration & Vitality Protocol',
            tags: ['fatigue', 'energy', 'adrenal', 'kidney', 'vitality'],
            notes: 'Energy support: AK energy system assessment, tonification acupressure (ST36, KI3, GV4), gentle cupping, lifestyle optimization',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'facial_paralysis_recovery',
            name: 'Facial Nerve Recovery Protocol',
            tags: ['facial_paralysis', 'neurological', 'recovery'],
            notes: 'Facial recovery: gentle acupressure facial points, very light facial gua sha, circulation support, nerve regeneration focus',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          
          // Additional Integrated Multi-Modal Protocols
          {
            id: 'chronic_pain_comprehensive',
            name: 'Chronic Pain Management - Full Spectrum Protocol',
            tags: ['chronic_pain', 'multi-modal', 'comprehensive', 'maintenance'],
            notes: 'Complete chronic pain approach: AK structural assessment → identify muscle imbalances → acupressure constitutional points (ST36, KI3, LV3) → cupping for circulation → gua sha for fascial release → ESR for pain psychology → integration exercises',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'stress_burnout_recovery',
            name: 'Stress & Burnout Recovery - Integrated Protocol',
            tags: ['stress', 'burnout', 'adrenal', 'emotional', 'recovery'],
            notes: 'Burnout recovery: AK adrenal/energy testing → ESR for stress patterns → acupressure calming points (HT7, KI1, CV17) → gentle cupping heart/lung areas → meridian tracing for energy flow → lifestyle restructuring',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'womens_health_comprehensive',
            name: 'Women\'s Health - Hormonal Balance Protocol',
            tags: ['womens_health', 'hormonal', 'reproductive', 'menstrual'],
            notes: 'Hormonal balance: AK endocrine muscle testing → acupressure reproductive points (SP6, LV3, CV4, CV6) → gentle abdominal cupping → lower back gua sha → emotional support for hormonal stress',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'athletic_performance_recovery',
            name: 'Athletic Performance & Recovery Protocol',
            tags: ['athletic', 'performance', 'recovery', 'sports'],
            notes: 'Athletic optimization: AK performance muscle testing → identify weak links → acupressure for specific sport demands → targeted cupping for muscle groups → gua sha for fascial mobility → integration with training',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'immune_system_support',
            name: 'Immune System Strengthening Protocol',
            tags: ['immune', 'prevention', 'wellness', 'tonification'],
            notes: 'Immune support: AK immune muscle indicators → tonification acupressure (ST36, LU9, KI3, SP6) → lung support cupping → wind gate gua sha → lifestyle immune optimization',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'seasonal_wellness_spring',
            name: 'Spring Wellness - Liver Detox Protocol',
            tags: ['seasonal', 'spring', 'liver', 'detox', 'wood_element'],
            notes: 'Spring liver support: AK liver function testing → liver qi regulation acupressure (LV3, LV14, GB34) → liver area cupping → detox gua sha → emotional clearing for anger/frustration',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'seasonal_wellness_winter',
            name: 'Winter Wellness - Kidney Tonification Protocol',
            tags: ['seasonal', 'winter', 'kidney', 'tonification', 'water_element'],
            notes: 'Winter kidney support: AK kidney function assessment → kidney tonification acupressure (KI3, BL23, GV4, CV4) → warming cupping lower back → kidney meridian gua sha → energy conservation guidance',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'workplace_wellness',
            name: 'Workplace Wellness - Desk Worker Protocol',
            tags: ['workplace', 'ergonomic', 'computer', 'posture', 'prevention'],
            notes: 'Desk worker support: AK postural muscle testing → eye strain acupressure (GB1, BL2, LV3) → neck/shoulder cupping → upper back gua sha → ergonomic assessment → movement breaks',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'elderly_vitality_support',
            name: 'Elderly Vitality & Wellness Protocol',
            tags: ['elderly', 'vitality', 'gentle', 'maintenance', 'longevity'],
            notes: 'Gentle elderly support: AK gentle assessment → tonification acupressure (ST36, KI3, SP6) → very light cupping → gentle gua sha circulation → fall prevention exercises → social wellness',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'pediatric_wellness',
            name: 'Pediatric Wellness - Child-Friendly Protocol',
            tags: ['pediatric', 'children', 'gentle', 'family', 'development'],
            notes: 'Child-friendly approach: gentle AK assessment → light acupressure with parent participation → very gentle cupping (if age appropriate) → playful meridian tracing → family wellness education',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'addiction_recovery_support',
            name: 'Addiction Recovery Support Protocol',
            tags: ['addiction', 'recovery', 'emotional', 'detox', 'support'],
            notes: 'Recovery support: AK emotional/physical assessment → calming acupressure (HT7, KI1, LV3, CV17) → detox cupping → emotional gua sha → extensive ESR for addiction patterns → support group integration',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'post_surgical_recovery',
            name: 'Post-Surgical Recovery Protocol',
            tags: ['post_surgical', 'recovery', 'healing', 'gentle', 'circulation'],
            notes: 'Post-surgery support: gentle AK assessment avoiding surgical area → circulation acupressure (LI4, SP6, ST36) → distant cupping for circulation → gentle gua sha away from surgery site → healing visualization',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'pregnancy_support',
            name: 'Pregnancy Wellness Support Protocol',
            tags: ['pregnancy', 'prenatal', 'gentle', 'wellness', 'safe'],
            notes: 'Pregnancy support: gentle AK assessment → pregnancy-safe acupressure (avoiding contraindicated points) → very light cupping upper back only → gentle gua sha shoulders → emotional support for pregnancy stress',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'migraine_comprehensive',
            name: 'Migraine Management - Prevention & Treatment Protocol',
            tags: ['migraine', 'headache', 'neurological', 'prevention'],
            notes: 'Migraine management: AK cranial assessment → preventive acupressure (LV3, GB20, TH5) → gentle cupping between episodes → very light gua sha → trigger identification → lifestyle modification',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'autoimmune_support',
            name: 'Autoimmune Condition Support Protocol',
            tags: ['autoimmune', 'immune_modulation', 'gentle', 'constitutional'],
            notes: 'Autoimmune support: gentle AK immune assessment → constitutional acupressure (ST36, SP6, KI3) → very light cupping for circulation → gentle detox gua sha → stress management for immune balance',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'cancer_support_adjunct',
            name: 'Cancer Support - Adjunctive Wellness Protocol',
            tags: ['cancer_support', 'adjunctive', 'gentle', 'wellness', 'energy'],
            notes: 'Cancer wellness support: gentle AK energy assessment → supportive acupressure (ST36, PC6, KI3) → very gentle cupping for circulation → light gua sha for lymphatic → emotional support → coordinate with medical team',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        setProtocols(comprehensiveProtocols);
      } catch (error) {
        console.error('Failed to load protocols:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProtocols();
  }, []);

  const handleDeleteProtocol = (protocolId: string) => {
    if (window.confirm('Are you sure you want to delete this protocol?')) {
      setProtocols(protocols.filter(p => p.id !== protocolId));
    }
  };

  const handleDuplicateProtocol = (protocol: Protocol) => {
    const duplicated: Protocol = {
      ...protocol,
      id: `${protocol.id}_copy_${Date.now()}`,
      name: `${protocol.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProtocols([...protocols, duplicated]);
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Treatment Protocols</h1>
            <p className="text-gray-600">Create and manage custom treatment sequences</p>
          </div>
          
          <Link
            to="/protocols/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-tcm-accent hover:bg-tcm-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tcm-accent"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Protocol
          </Link>
        </div>
      </div>

      {/* Protocol Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{protocols.length}</p>
              <p className="text-gray-600">Total Protocols</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Copy className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {protocols.filter(p => p.tags?.includes('common')).length}
              </p>
              <p className="text-gray-600">Common Protocols</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Edit className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {protocols.filter(p => new Date(p.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-gray-600">Recently Updated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Protocols</h2>
        </div>
        
        <div className="p-6">
          {protocols.length > 0 ? (
            <div className="space-y-4">
              {protocols.map((protocol) => (
                <div
                  key={protocol.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-tcm-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {protocol.name}
                      </h3>
                      
                      {protocol.notes && (
                        <p className="text-gray-600 mb-3">{protocol.notes}</p>
                      )}
                      
                      {protocol.tags && protocol.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {protocol.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block bg-tcm-accent bg-opacity-10 text-tcm-accent px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500">
                        <span>Created: {new Date(protocol.createdAt).toLocaleDateString()}</span>
                        {protocol.updatedAt !== protocol.createdAt && (
                          <span className="ml-4">
                            Updated: {new Date(protocol.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/protocols/${protocol.id}`}
                        className="p-2 text-gray-400 hover:text-tcm-accent hover:bg-gray-100 rounded"
                        title="Edit protocol"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleDuplicateProtocol(protocol)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded"
                        title="Duplicate protocol"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => {/* TODO: Export protocol */}}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-gray-100 rounded"
                        title="Export protocol"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteProtocol(protocol.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded"
                        title="Delete protocol"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No protocols yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first treatment protocol to get started.
              </p>
              <Link
                to="/protocols/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-tcm-accent hover:bg-tcm-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tcm-accent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Protocol
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Protocol Builder Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">What you can include:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Acupuncture points with pressure guidance</li>
              <li>• Cupping techniques and locations</li>
              <li>• Gua Sha protocols and directions</li>
              <li>• Applied Kinesiology assessments</li>
              <li>• Herbal recommendations</li>
              <li>• Dietary guidance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Protocol features:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Drag and drop step reordering</li>
              <li>• Timing and duration for each step</li>
              <li>• Personal notes and modifications</li>
              <li>• Export to PDF or print</li>
              <li>• Share with colleagues</li>
              <li>• Template creation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Protocols;
