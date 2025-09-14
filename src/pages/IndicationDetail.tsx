import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Stethoscope, Leaf, Utensils, Hand, Circle, Waves, Activity, AlertTriangle, ExternalLink } from 'lucide-react';
import { simpleDb as db } from '../lib/simpleDatabase';
import { Indication, Point, Technique } from '../types';
import { getTechniquesForCondition } from '../data/modalityMappings';
import { getAcupressureProtocol } from '../data/acupressureProtocols';
import { getCuppingProtocol } from '../data/cuppingProtocols';
import { getGuaShaProtocol } from '../data/guaShaProtocols';
import { getAppliedKinesiologyProtocol } from '../data/appliedKinesiologyProtocols';

const IndicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [indication, setIndication] = useState<Indication | null>(null);
  const [relatedPoints, setRelatedPoints] = useState<Point[]>([]);
  const [allTechniques, setAllTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIndicationData = async () => {
      if (!id) return;
      
      try {
        await db.initialize();
        
        const indications = await db.getIndications();
        const indicationData = indications.find(i => i.id === id);
        
        if (indicationData) {
          setIndication(indicationData);
          
          // Find points that treat this indication
          const allPoints = await db.getPoints();
          const related = allPoints.filter(point => 
            point.indications.includes(id)
          );
          setRelatedPoints(related);
          setAllTechniques(techniques);
        }
      } catch (error) {
        console.error('Failed to load indication:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIndicationData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tcm-accent"></div>
      </div>
    );
  }

  if (!indication) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Indication Not Found</h1>
          <p className="text-gray-600 mb-6">The requested indication could not be found.</p>
          <Link to="/indications" className="text-tcm-accent hover:text-tcm-secondary">
            ← Back to Indications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back link */}
      <Link 
        to="/indications" 
        className="inline-flex items-center text-tcm-accent hover:text-tcm-secondary mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Indications
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {indication.label}
            </h1>
            {indication.category && (
              <span className="inline-block bg-tcm-accent bg-opacity-10 text-tcm-accent px-3 py-1 rounded-full text-sm font-medium">
                {indication.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
          </div>
        </div>

        {indication.synonyms && indication.synonyms.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600 mb-2">Also known as:</p>
            <div className="flex flex-wrap gap-2">
              {indication.synonyms.map((synonym) => (
                <span
                  key={synonym}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {synonym}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Treatment options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Acupoints */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 text-tcm-accent mr-2" />
              Recommended Acupoints
              <span className="ml-2 text-sm font-normal text-gray-500">
                {relatedPoints.length} points
              </span>
            </h2>
            
            {relatedPoints.length > 0 ? (
              <div className="space-y-4">
                {relatedPoints.map((point) => (
                  <Link
                    key={point.id}
                    to={`/points/${point.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-tcm-accent hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {point.id} — {point.nameEn}
                      </h3>
                      {point.meridianId && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {point.meridianId}
                        </span>
                      )}
                    </div>
                    
                    {point.namePinyin && (
                      <p className="text-sm text-gray-600 mb-2">{point.namePinyin}</p>
                    )}
                    
                    <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                      {point.location}
                    </p>

                    {point.acupressureDepth && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                        <p className="text-sm text-blue-800">
                          <strong>Acupressure:</strong> {point.acupressureDepth}
                        </p>
                      </div>
                    )}

                    {point.contraindications && point.contraindications.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded p-2">
                        <p className="text-sm text-red-800">
                          <strong>Caution:</strong> {point.contraindications.join(', ')}
                        </p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No specific acupoints found for this condition in the current database.
              </p>
            )}
          </div>
        </div>

        {/* Treatment Modalities Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Available Treatment Modalities</h2>
            <Link
              to={`/indications/${id}/modalities`}
              className="flex items-center px-4 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark text-sm"
            >
              View All Modalities
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </div>
          <p className="text-gray-600 mb-6">
            Multiple therapeutic approaches are available for treating {indication.label.toLowerCase()}. 
            Click "View All Modalities" for detailed information, contraindications, and selection guidance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Acupressure */}
            {getAcupressureProtocol(id) && (
              <div className="border border-gray-200 rounded-lg p-4 hover:border-tcm-accent transition-colors">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <Hand className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Acupressure</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Point-specific pressure therapy with detailed protocols
                </p>
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div>• {getAcupressureProtocol(id)!.primaryPoints.length} primary points</div>
                  <div>• Duration: {getAcupressureProtocol(id)!.totalDuration}</div>
                  <div>• {getAcupressureProtocol(id)!.frequency}</div>
                </div>
                <Link
                  to="/acupressure"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Protocol →
                </Link>
              </div>
            )}

            {/* Cupping */}
            {getCuppingProtocol(id) && (
              <div className="border border-gray-200 rounded-lg p-4 hover:border-tcm-accent transition-colors">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-orange-50 rounded-lg mr-3">
                    <Circle className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Cupping</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Suction therapy for circulation and muscle release
                </p>
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div>• {getCuppingProtocol(id)!.primaryAreas.length} treatment areas</div>
                  <div>• Duration: {getCuppingProtocol(id)!.totalDuration}</div>
                  <div>• {getCuppingProtocol(id)!.frequency}</div>
                </div>
                <Link
                  to="/cupping"
                  className="inline-flex items-center text-sm text-orange-600 hover:text-orange-800 font-medium"
                >
                  View Protocol →
                </Link>
              </div>
            )}

            {/* Gua Sha */}
            {getGuaShaProtocol(id) && (
              <div className="border border-gray-200 rounded-lg p-4 hover:border-tcm-accent transition-colors">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-emerald-50 rounded-lg mr-3">
                    <Waves className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Gua Sha</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Traditional scraping therapy for fascial release
                </p>
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div>• {getGuaShaProtocol(id)!.primaryAreas.length} treatment areas</div>
                  <div>• Duration: {getGuaShaProtocol(id)!.totalDuration}</div>
                  <div>• {getGuaShaProtocol(id)!.frequency}</div>
                </div>
                <Link
                  to="/gua-sha"
                  className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  View Protocol →
                </Link>
              </div>
            )}

            {/* Applied Kinesiology */}
            {getAppliedKinesiologyProtocol(id) && (
              <div className="border border-gray-200 rounded-lg p-4 hover:border-tcm-accent transition-colors">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-purple-50 rounded-lg mr-3">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Applied Kinesiology</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Muscle testing and functional assessment
                </p>
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div>• {getAppliedKinesiologyProtocol(id)!.primaryAssessments.length} muscle assessments</div>
                  <div>• Duration: {getAppliedKinesiologyProtocol(id)!.totalDuration}</div>
                  <div>• {getAppliedKinesiologyProtocol(id)!.frequency}</div>
                </div>
                <Link
                  to="/applied-kinesiology"
                  className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  View Protocol →
                </Link>
              </div>
            )}

            {/* Traditional Acupuncture Points */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-tcm-accent transition-colors">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-tcm-accent bg-opacity-10 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-tcm-accent" />
                </div>
                <h3 className="font-semibold text-gray-900">Acupuncture Points</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Traditional point combinations and locations
              </p>
              <div className="space-y-2 text-xs text-gray-500 mb-4">
                <div>• {relatedPoints.length} recommended points</div>
                <div>• Complete TCM point data</div>
                <div>• Location and indication details</div>
              </div>
              <div className="text-sm text-tcm-accent hover:text-tcm-secondary font-medium">
                Points listed below ↓
              </div>
            </div>
          </div>

          {/* Quick Treatment Comparison */}
          {(getAcupressureProtocol(id) || getCuppingProtocol(id) || getGuaShaProtocol(id) || getAppliedKinesiologyProtocol(id)) && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Treatment Comparison</h3>
                <Link
                  to={`/indications/${id}/comparison`}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Detailed Comparison
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Quick overview - click "Detailed Comparison" for effectiveness ratings, contraindications, and selection guidance.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-900">Modality</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-900">Duration</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-900">Frequency</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-900">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {getAcupressureProtocol(id) && (
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-3 font-medium">Acupressure</td>
                        <td className="py-2 px-3">{getAcupressureProtocol(id)!.totalDuration}</td>
                        <td className="py-2 px-3">{getAcupressureProtocol(id)!.frequency}</td>
                        <td className="py-2 px-3">Self-care, precise point therapy</td>
                      </tr>
                    )}
                    {getCuppingProtocol(id) && (
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-3 font-medium">Cupping</td>
                        <td className="py-2 px-3">{getCuppingProtocol(id)!.totalDuration}</td>
                        <td className="py-2 px-3">{getCuppingProtocol(id)!.frequency}</td>
                        <td className="py-2 px-3">Muscle tension, circulation</td>
                      </tr>
                    )}
                    {getGuaShaProtocol(id) && (
                      <tr className="border-b border-gray-100">
                        <td className="py-2 px-3 font-medium">Gua Sha</td>
                        <td className="py-2 px-3">{getGuaShaProtocol(id)!.totalDuration}</td>
                        <td className="py-2 px-3">{getGuaShaProtocol(id)!.frequency}</td>
                        <td className="py-2 px-3">Fascial release, detox</td>
                      </tr>
                    )}
                    {getAppliedKinesiologyProtocol(id) && (
                      <tr>
                        <td className="py-2 px-3 font-medium">Applied Kinesiology</td>
                        <td className="py-2 px-3">{getAppliedKinesiologyProtocol(id)!.totalDuration}</td>
                        <td className="py-2 px-3">{getAppliedKinesiologyProtocol(id)!.frequency}</td>
                        <td className="py-2 px-3">Root cause assessment</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Treatment Recommendations */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Treatment Selection Guidance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Choose Acupressure For:</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Self-treatment and home care</li>
                  <li>• Precise point stimulation</li>
                  <li>• Gentle, non-invasive approach</li>
                  <li>• Daily maintenance therapy</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Choose Cupping For:</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Muscle tension and stiffness</li>
                  <li>• Circulation improvement</li>
                  <li>• Respiratory conditions</li>
                  <li>• Deep tissue release</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Choose Gua Sha For:</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Fascial restrictions</li>
                  <li>• Wind-cold conditions</li>
                  <li>• Skin and circulation issues</li>
                  <li>• Detoxification support</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Choose Applied Kinesiology For:</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Root cause assessment</li>
                  <li>• Functional muscle testing</li>
                  <li>• Emotional stress patterns</li>
                  <li>• Structural imbalances</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white border border-blue-200 rounded">
              <p className="text-blue-800 text-sm">
                <strong>Multi-Modal Approach:</strong> Many conditions benefit from combining modalities. 
                Start with assessment (AK), then choose primary treatment (acupressure/cupping/gua sha) 
                based on patient needs and practitioner expertise.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Treatment Protocols */}
        <div className="space-y-6">
          {/* Acupressure Protocol */}
          {getAcupressureProtocol(id) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Hand className="h-5 w-5 text-tcm-accent mr-2" />
                Acupressure Treatment Protocol
              </h2>
              
              {(() => {
                const protocol = getAcupressureProtocol(id)!;
                return (
                  <div className="space-y-6">
                    {/* Protocol Overview */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">{protocol.protocolName}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-blue-900">Total Duration:</strong>
                          <p className="text-blue-800">{protocol.totalDuration}</p>
                        </div>
                        <div>
                          <strong className="text-blue-900">Frequency:</strong>
                          <p className="text-blue-800">{protocol.frequency}</p>
                        </div>
                      </div>
                    </div>

                    {/* Primary Points */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Primary Treatment Points</h3>
                      <div className="space-y-3">
                        {protocol.primaryPoints.map((point, index) => (
                          <div key={point.pointId} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {index + 1}. {point.pointId} - {point.pointName}
                              </h4>
                              <div className="flex space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  point.pressure === 'light' ? 'bg-green-100 text-green-800' :
                                  point.pressure === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {point.pressure} pressure
                                </span>
                                {point.bilateralTreatment && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    bilateral
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">{point.location}</p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Technique:</strong> {point.technique}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Duration:</strong> {point.duration}
                            </p>
                            {point.notes && (
                              <p className="text-xs text-gray-600 italic">{point.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Treatment Sequence */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Treatment Sequence</h3>
                      <ol className="space-y-2">
                        {protocol.treatmentSequence.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 bg-tcm-accent text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-sm text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Clinical Notes */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">Clinical Notes</h3>
                      <p className="text-green-800 text-sm">{protocol.clinicalNotes}</p>
                    </div>

                    {/* Contraindications */}
                    {protocol.contraindications && protocol.contraindications.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Contraindications
                        </h3>
                        <ul className="text-red-800 text-sm space-y-1">
                          {protocol.contraindications.map((contraindication, index) => (
                            <li key={index}>• {contraindication}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Follow-up Guidance */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Follow-up & Self-Care</h3>
                      <p className="text-gray-700 text-sm">{protocol.followUpGuidance}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Cupping Protocol */}
          {getCuppingProtocol(id) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Circle className="h-5 w-5 text-tcm-accent mr-2" />
                Cupping Treatment Protocol
              </h2>
              
              {(() => {
                const protocol = getCuppingProtocol(id)!;
                return (
                  <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h3 className="font-semibold text-orange-900 mb-2">{protocol.protocolName}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-orange-900">Duration:</strong>
                          <p className="text-orange-800">{protocol.totalDuration}</p>
                        </div>
                        <div>
                          <strong className="text-orange-900">Frequency:</strong>
                          <p className="text-orange-800">{protocol.frequency}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Primary Treatment Areas</h4>
                      <div className="space-y-2">
                        {protocol.primaryAreas.map((area, index) => (
                          <div key={area.areaName} className="border border-gray-200 rounded p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">{area.areaName}</h5>
                              <div className="flex space-x-1">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  area.cupSize === 'small' ? 'bg-blue-100 text-blue-800' :
                                  area.cupSize === 'medium' ? 'bg-purple-100 text-purple-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {area.cupSize}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  area.suctionLevel === 'light' ? 'bg-green-100 text-green-800' :
                                  area.suctionLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {area.suctionLevel}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">{area.anatomicalLocation}</p>
                            <p className="text-xs text-gray-700 mt-1">
                              <strong>Technique:</strong> {area.technique} • <strong>Duration:</strong> {area.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-900 mb-1">Clinical Notes</h4>
                      <p className="text-gray-700 text-sm">{protocol.clinicalNotes}</p>
                    </div>

                    <Link
                      to="/cupping"
                      className="inline-flex items-center px-4 py-2 border border-tcm-accent text-sm font-medium rounded-md text-tcm-accent bg-white hover:bg-tcm-accent hover:text-white transition-colors"
                    >
                      View Complete Cupping Protocols →
                    </Link>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Gua Sha Protocol */}
          {getGuaShaProtocol(id) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Waves className="h-5 w-5 text-tcm-accent mr-2" />
                Gua Sha Treatment Protocol
              </h2>
              
              {(() => {
                const protocol = getGuaShaProtocol(id)!;
                return (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <h3 className="font-semibold text-emerald-900 mb-2">{protocol.protocolName}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-emerald-900">Duration:</strong>
                          <p className="text-emerald-800">{protocol.totalDuration}</p>
                        </div>
                        <div>
                          <strong className="text-emerald-900">Frequency:</strong>
                          <p className="text-emerald-800">{protocol.frequency}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Primary Treatment Areas</h4>
                      <div className="space-y-2">
                        {protocol.primaryAreas.map((area, index) => (
                          <div key={area.areaName} className="border border-gray-200 rounded p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">{area.areaName}</h5>
                              <div className="flex space-x-1">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  area.pressure === 'light' ? 'bg-green-100 text-green-800' :
                                  area.pressure === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {area.pressure}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  {area.toolType.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">{area.anatomicalLocation}</p>
                            <p className="text-xs text-gray-700 mt-1">
                              <strong>Direction:</strong> {area.scrapingDirection} • <strong>Duration:</strong> {area.duration}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-900 mb-1">Clinical Notes</h4>
                      <p className="text-gray-700 text-sm">{protocol.clinicalNotes}</p>
                    </div>

                    <Link
                      to="/gua-sha"
                      className="inline-flex items-center px-4 py-2 border border-tcm-accent text-sm font-medium rounded-md text-tcm-accent bg-white hover:bg-tcm-accent hover:text-white transition-colors"
                    >
                      View Complete Gua Sha Protocols →
                    </Link>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Applied Kinesiology Protocol */}
          {getAppliedKinesiologyProtocol(id) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 text-tcm-accent mr-2" />
                Applied Kinesiology Assessment Protocol
              </h2>
              
              {(() => {
                const protocol = getAppliedKinesiologyProtocol(id)!;
                return (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <h3 className="font-semibold text-indigo-900 mb-2">{protocol.protocolName}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-indigo-900">Duration:</strong>
                          <p className="text-indigo-800">{protocol.totalDuration}</p>
                        </div>
                        <div>
                          <strong className="text-indigo-900">Frequency:</strong>
                          <p className="text-indigo-800">{protocol.frequency}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Primary Muscle Assessments</h4>
                      <div className="space-y-2">
                        {protocol.primaryAssessments.map((assessment, index) => (
                          <div key={assessment.muscleName} className="border border-gray-200 rounded p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">{assessment.muscleName}</h5>
                              {assessment.associatedMeridian && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                  {assessment.associatedMeridian} meridian
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{assessment.anatomicalLocation}</p>
                            <p className="text-xs text-gray-700 mt-1">
                              <strong>Weakness indicates:</strong> {assessment.weaknessIndicates}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Correction Techniques</h4>
                      <div className="space-y-2">
                        {protocol.corrections.map((correction, index) => (
                          <div key={correction.correctionType} className="border border-gray-200 rounded p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900 text-sm">
                                {correction.correctionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h5>
                              <span className={`px-2 py-1 rounded text-xs ${
                                correction.correctionType === 'neurolymphatic' ? 'bg-blue-100 text-blue-800' :
                                correction.correctionType === 'neurovascular' ? 'bg-purple-100 text-purple-800' :
                                correction.correctionType === 'meridian_tracing' ? 'bg-green-100 text-green-800' :
                                correction.correctionType === 'emotional_stress_release' ? 'bg-pink-100 text-pink-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {correction.duration}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{correction.targetArea}</p>
                            <p className="text-xs text-gray-700 mt-1">{correction.procedure}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-900 mb-1">Clinical Notes</h4>
                      <p className="text-gray-700 text-sm">{protocol.clinicalNotes}</p>
                    </div>

                    <Link
                      to="/applied-kinesiology"
                      className="inline-flex items-center px-4 py-2 border border-tcm-accent text-sm font-medium rounded-md text-tcm-accent bg-white hover:bg-tcm-accent hover:text-white transition-colors"
                    >
                      View Complete AK Protocols →
                    </Link>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Modality-specific treatments */}
          {getTechniquesForCondition(id).length > 0 ? (
            getTechniquesForCondition(id).map((conditionTreatment) => {
              const getModalityIcon = (modalityId: string) => {
                switch (modalityId) {
                  case 'acupressure': return Hand;
                  case 'cupping': return Circle;
                  case 'gua_sha': return Waves;
                  case 'applied_kinesiology': return Activity;
                  default: return Stethoscope;
                }
              };
              
              const Icon = getModalityIcon(conditionTreatment.modalityId);
              const modalityName = conditionTreatment.modalityId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              return (
                <div key={conditionTreatment.modalityId} className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Icon className="h-5 w-5 text-tcm-accent mr-2" />
                    {modalityName}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Specific Instructions</h3>
                      <p className="text-blue-800 text-sm">{conditionTreatment.specificInstructions}</p>
                    </div>
                    
                    {conditionTreatment.modifications && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-medium text-green-900 mb-2">Modifications</h3>
                        <p className="text-green-800 text-sm">{conditionTreatment.modifications}</p>
                      </div>
                    )}
                    
                    {conditionTreatment.contraindications && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-medium text-red-900 mb-2">Contraindications</h3>
                        <ul className="text-red-800 text-sm space-y-1">
                          {conditionTreatment.contraindications.map((contraindication, index) => (
                            <li key={index}>• {contraindication}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Recommended Techniques</h3>
                      <div className="space-y-2">
                        {conditionTreatment.recommendedTechniques.map((techniqueId) => {
                          const technique = allTechniques.find(t => t.id === techniqueId);
                          if (!technique) return null;
                          
                          return (
                            <div key={techniqueId} className="border border-gray-200 rounded-lg p-3">
                              <h4 className="font-medium text-gray-900">{technique.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{technique.description}</p>
                              {technique.duration && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Duration: {technique.duration}
                                </div>
                              )}
                              {technique.equipment && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {technique.equipment.map((item) => (
                                    <span key={item} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Stethoscope className="h-5 w-5 text-tcm-accent mr-2" />
                Modalities
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Acupressure</h3>
                  <p className="text-sm text-gray-600">Apply pressure to recommended points above</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Cupping</h3>
                  <p className="text-sm text-gray-600">May be beneficial for circulation and muscle tension</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Gua Sha</h3>
                  <p className="text-sm text-gray-600">Consider for surface treatments and circulation</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900">Applied Kinesiology</h3>
                  <p className="text-sm text-gray-600">Assess muscle function and structural imbalances</p>
                </div>
              </div>
            </div>
          )}

          {/* Herbs placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Leaf className="h-5 w-5 text-tcm-accent mr-2" />
              Herbal Support
            </h2>
            <div className="text-sm text-gray-600">
              <p>Consult with a qualified herbalist for specific herbal recommendations for this condition.</p>
            </div>
          </div>

          {/* Diet placeholder */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Utensils className="h-5 w-5 text-tcm-accent mr-2" />
              Dietary Guidance
            </h2>
            <div className="text-sm text-gray-600">
              <p>General dietary recommendations based on TCM principles may be helpful. Consult with a TCM practitioner for personalized advice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicationDetail;
