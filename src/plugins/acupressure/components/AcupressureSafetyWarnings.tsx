import React from 'react';
import { ModalityContraindications } from '../../../lib/modality-system/types';
import { AlertTriangle, Shield, Baby, Heart } from 'lucide-react';

interface AcupressureSafetyWarningsProps {
  contraindications: ModalityContraindications;
}

const AcupressureSafetyWarnings: React.FC<AcupressureSafetyWarningsProps> = ({ 
  contraindications 
}) => {
  return (
    <div className="space-y-4">
      {/* Absolute Contraindications */}
      {contraindications.absolute.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Absolute Contraindications</h3>
              <p className="text-red-700 text-sm mb-2">Do not use acupressure if patient has:</p>
              <ul className="space-y-1">
                {contraindications.absolute.map(contra => (
                  <li key={contra} className="text-red-700 text-sm">
                    • {contra.replace('_', ' ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Relative Contraindications */}
      {contraindications.relative.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Use with Caution</h3>
              <p className="text-yellow-700 text-sm mb-2">Extra care needed for:</p>
              <ul className="space-y-1">
                {contraindications.relative.map(contra => (
                  <li key={contra} className="text-yellow-700 text-sm">
                    • {contra.replace('_', ' ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Pregnancy Guidelines */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
        <div className="flex items-start">
          <Baby className="h-5 w-5 text-pink-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-pink-800 mb-2">Pregnancy Guidelines</h3>
            <p className="text-pink-700 text-sm">
              {contraindications.pregnancy === 'safe' && 
                'Generally safe during pregnancy with gentle pressure.'}
              {contraindications.pregnancy === 'caution' && 
                'Use with caution during pregnancy. Avoid certain points (LI4, SP6, BL60, BL67). Consult healthcare provider.'}
              {contraindications.pregnancy === 'avoid' && 
                'Avoid acupressure during pregnancy due to risk of inducing labor.'}
            </p>
          </div>
        </div>
      </div>

      {/* Age Considerations */}
      {contraindications.ageRestrictions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Heart className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Age Considerations</h3>
              <div className="text-blue-700 text-sm space-y-1">
                {contraindications.ageRestrictions.minAge && (
                  <p>• Minimum age: {contraindications.ageRestrictions.minAge} years</p>
                )}
                {contraindications.ageRestrictions.maxAge && (
                  <p>• Special care for ages over {contraindications.ageRestrictions.maxAge}</p>
                )}
                {contraindications.ageRestrictions.specialConsiderations && (
                  <p>• {contraindications.ageRestrictions.specialConsiderations}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medication Interactions */}
      {contraindications.medications && contraindications.medications.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Medication Considerations</h3>
              <p className="text-orange-700 text-sm mb-2">Use caution with:</p>
              <ul className="space-y-1">
                {contraindications.medications.map(med => (
                  <li key={med} className="text-orange-700 text-sm">
                    • {med.replace('_', ' ')}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcupressureSafetyWarnings;
