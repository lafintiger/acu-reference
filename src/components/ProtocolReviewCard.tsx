// Protocol Review Card - Detailed review interface for extracted protocols
// Allows practitioners to review and approve/reject workshop protocols

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Edit, AlertTriangle } from 'lucide-react';

interface ProtocolReviewCardProps {
  protocol: any;
  index: number;
  onApprovalChange: (approved: boolean) => void;
}

const ProtocolReviewCard: React.FC<ProtocolReviewCardProps> = ({ 
  protocol, 
  index, 
  onApprovalChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApproved, setIsApproved] = useState(protocol.approved ?? true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProtocol, setEditedProtocol] = useState(protocol);

  const handleApprovalToggle = (approved: boolean) => {
    setIsApproved(approved);
    onApprovalChange(approved);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className={`border rounded-lg transition-all ${
      isApproved ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
    }`}>
      {/* Protocol Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {/* Approval Controls */}
            <div className="flex flex-col space-y-1 mt-1">
              <button
                onClick={() => handleApprovalToggle(true)}
                className={`p-1 rounded ${
                  isApproved ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                }`}
                title="Approve for import"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleApprovalToggle(false)}
                className={`p-1 rounded ${
                  !isApproved ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                }`}
                title="Reject import"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>

            {/* Protocol Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">{protocol.name}</h4>
                <span className={`px-2 py-1 text-xs rounded border ${getConfidenceColor(protocol.confidence)}`}>
                  {protocol.confidence}% confidence
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                <strong>For:</strong> {protocol.indication?.replace('_', ' ')}
              </p>
              
              <div className="mt-2 flex flex-wrap gap-4 text-sm">
                <div>
                  <strong>Points:</strong> {protocol.points?.length || 0}
                  {protocol.points?.length > 0 && (
                    <span className="ml-1 text-gray-600">
                      ({protocol.points.slice(0, 3).join(', ')}{protocol.points.length > 3 ? '...' : ''})
                    </span>
                  )}
                </div>
                <div><strong>Duration:</strong> {protocol.duration}</div>
                <div><strong>Frequency:</strong> {protocol.frequency}</div>
              </div>
            </div>

            {/* Expand/Collapse */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            <Edit className="h-3 w-3 mr-1" />
            {isEditing ? 'Save Changes' : 'Edit Protocol'}
          </button>
          
          {protocol.contraindications?.length > 0 && (
            <div className="flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {protocol.contraindications.length} contraindications
            </div>
          )}
          
          <div className={`px-2 py-1 text-xs rounded ${
            isApproved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {isApproved ? '✓ Approved' : '○ Pending Review'}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="space-y-4">
            {/* Complete Point List */}
            {protocol.points && protocol.points.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Complete Point List ({protocol.points.length} points):
                </h5>
                <div className="bg-gray-50 rounded p-3">
                  <div className="flex flex-wrap gap-1">
                    {protocol.points.map((point: string) => (
                      <span key={point} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono">
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Technique Details */}
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Technique Description:</h5>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-700">{protocol.technique}</p>
              </div>
            </div>

            {/* Clinical Notes */}
            {protocol.clinicalNotes && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Clinical Notes:</h5>
                <div className="bg-blue-50 rounded p-3">
                  <p className="text-sm text-blue-800">{protocol.clinicalNotes}</p>
                </div>
              </div>
            )}

            {/* Contraindications */}
            {protocol.contraindications && protocol.contraindications.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Contraindications:</h5>
                <div className="bg-red-50 rounded p-3">
                  <ul className="text-sm text-red-800 space-y-1">
                    {protocol.contraindications.map((contra: string, contraIndex: number) => (
                      <li key={contraIndex}>• {contra.replace('_', ' ')}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {isEditing && (
              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-medium text-gray-900 mb-3">Edit Protocol Details:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Protocol Name:</label>
                    <input
                      type="text"
                      value={editedProtocol.name}
                      onChange={(e) => setEditedProtocol({...editedProtocol, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration:</label>
                    <input
                      type="text"
                      value={editedProtocol.duration}
                      onChange={(e) => setEditedProtocol({...editedProtocol, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes:</label>
                    <textarea
                      value={editedProtocol.clinicalNotes}
                      onChange={(e) => setEditedProtocol({...editedProtocol, clinicalNotes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => {
                      // Apply edits
                      Object.assign(protocol, editedProtocol);
                      setIsEditing(false);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditedProtocol(protocol);
                      setIsEditing(false);
                    }}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Import Decision */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <strong>Import Decision:</strong>
                  <span className={`ml-2 ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
                    {isApproved ? 'Approved for import' : 'Rejected - will not import'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprovalToggle(true)}
                    className={`px-3 py-1 text-sm rounded ${
                      isApproved 
                        ? 'bg-green-600 text-white' 
                        : 'border border-green-600 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleApprovalToggle(false)}
                    className={`px-3 py-1 text-sm rounded ${
                      !isApproved 
                        ? 'bg-red-600 text-white' 
                        : 'border border-red-600 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
</div>
)}
