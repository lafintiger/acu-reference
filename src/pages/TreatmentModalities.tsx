import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Target, AlertTriangle, ExternalLink } from 'lucide-react';
import { simpleDb } from '../lib/simpleDatabase';

const TreatmentModalities = () => {
  const { indication } = useParams();
  const navigate = useNavigate();
  
  const indicationData = indication ? simpleDb.getIndicationById(indication) : null;
  
  if (!indicationData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Indication not found.</p>
        <button
          onClick={() => navigate('/indications')}
          className="mt-4 px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark"
        >
          Back to Indications
        </button>
      </div>
    );
  }

  const modalities = [
    {
      id: 'acupressure',
      name: 'Acupressure',
      icon: '👆',
      description: 'Gentle finger pressure applied to specific acupuncture points to stimulate healing and balance energy flow.',
      benefits: [
        'Non-invasive and safe for all ages',
        'Can be self-administered',
        'Immediate pain relief',
        'Stress reduction and relaxation',
        'Improves circulation'
      ],
      bestFor: [
        'Chronic pain management',
        'Stress and anxiety',
        'Headaches and migraines',
        'Digestive issues',
        'Sleep disorders'
      ],
      duration: '15-30 minutes',
      frequency: '2-3 times per week',
      equipment: 'None required - hands only',
      skillLevel: 'Beginner friendly',
      contraindications: [
        'Open wounds or infections',
        'Severe osteoporosis',
        'Blood clotting disorders'
      ],
      link: '/acupressure'
    },
    {
      id: 'cupping',
      name: 'Cupping Therapy',
      icon: '🥤',
      description: 'Suction therapy using cups to improve circulation, reduce muscle tension, and promote healing.',
      benefits: [
        'Deep muscle relaxation',
        'Improved blood circulation',
        'Toxin elimination',
        'Pain reduction',
        'Stress relief'
      ],
      bestFor: [
        'Muscle tension and knots',
        'Back and shoulder pain',
        'Respiratory conditions',
        'Cellulite reduction',
        'Athletic recovery'
      ],
      duration: '20-30 minutes',
      frequency: '1-2 times per week',
      equipment: 'Glass or silicone cups, pump',
      skillLevel: 'Intermediate',
      contraindications: [
        'Pregnancy',
        'Skin conditions',
        'Blood thinning medications',
        'Recent surgery'
      ],
      link: '/cupping'
    },
    {
      id: 'gua_sha',
      name: 'Gua Sha',
      icon: '🪨',
      description: 'Scraping technique using smooth tools to improve circulation and release muscle tension.',
      benefits: [
        'Muscle tension release',
        'Lymphatic drainage',
        'Improved circulation',
        'Inflammation reduction',
        'Facial rejuvenation'
      ],
      bestFor: [
        'Neck and shoulder tension',
        'Chronic pain',
        'Lymphatic congestion',
        'Facial treatments',
        'Post-workout recovery'
      ],
      duration: '15-25 minutes',
      frequency: '2-3 times per week',
      equipment: 'Gua sha tool (jade, horn, steel)',
      skillLevel: 'Intermediate',
      contraindications: [
        'Blood thinning medications',
        'Skin infections',
        'Recent injuries',
        'Severe cardiovascular disease'
      ],
      link: '/gua-sha'
    },
    {
      id: 'applied_kinesiology',
      name: 'Applied Kinesiology',
      icon: '💪',
      description: 'Muscle testing technique to assess body function and identify imbalances for targeted treatment.',
      benefits: [
        'Identifies root causes',
        'Personalized treatment',
        'Whole-body assessment',
        'Non-invasive testing',
        'Immediate feedback'
      ],
      bestFor: [
        'Functional disorders',
        'Nutritional imbalances',
        'Structural problems',
        'Stress-related issues',
        'Chronic fatigue'
      ],
      duration: '30-45 minutes',
      frequency: 'As needed for assessment',
      equipment: 'None required',
      skillLevel: 'Advanced',
      contraindications: [
        'Acute injuries',
        'Severe neurological conditions',
        'Inability to perform muscle tests'
      ],
      link: '/applied-kinesiology'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/indications/${indication}`)}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Treatment Modalities for {indicationData.nameEn}
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive overview of available therapeutic approaches
            </p>
          </div>
        </div>
      </div>

      {/* Modalities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {modalities.map((modality) => (
          <div key={modality.id} className="bg-white rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{modality.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{modality.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    modality.skillLevel === 'Beginner friendly' ? 'bg-green-100 text-green-800' :
                    modality.skillLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {modality.skillLevel}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(modality.link)}
                className="flex items-center px-3 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark text-sm"
              >
                View Protocols
                <ExternalLink className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4">{modality.description}</p>

            {/* Treatment Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Duration</span>
                </div>
                <p className="text-gray-700 text-sm">{modality.duration}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Users className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Frequency</span>
                </div>
                <p className="text-gray-700 text-sm">{modality.frequency}</p>
              </div>
            </div>

            {/* Equipment */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Equipment Needed</h4>
              <p className="text-gray-700 text-sm bg-blue-50 rounded-lg p-2">{modality.equipment}</p>
            </div>

            {/* Benefits */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Key Benefits</h4>
              <ul className="space-y-1">
                {modality.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className="text-green-600 mr-2">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Best For */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Best For</h4>
              <div className="flex flex-wrap gap-1">
                {modality.bestFor.slice(0, 3).map((condition, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-tcm-light text-tcm-accent rounded-full text-xs"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            {/* Contraindications */}
            {modality.contraindications.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Contraindications</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      {modality.contraindications.map((contra, index) => (
                        <li key={index}>• {contra}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Integration Notes */}
      <div className="bg-tcm-light border border-tcm-accent rounded-lg p-6">
        <h2 className="text-xl font-semibold text-tcm-accent mb-3">
          <Target className="h-5 w-5 inline mr-2" />
          Integration Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="font-medium mb-2">Complementary Combinations</h3>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Acupressure + Gua Sha:</strong> Enhanced circulation and pain relief</li>
              <li>• <strong>Cupping + Applied Kinesiology:</strong> Assessment-guided muscle therapy</li>
              <li>• <strong>All modalities:</strong> Comprehensive holistic treatment</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Treatment Sequencing</h3>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Assessment first:</strong> Applied Kinesiology for diagnosis</li>
              <li>• <strong>Primary treatment:</strong> Choose based on condition severity</li>
              <li>• <strong>Maintenance:</strong> Acupressure for ongoing self-care</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentModalities;
