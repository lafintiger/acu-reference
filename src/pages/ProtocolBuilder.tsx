import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  GripVertical, 
  X, 
  Save, 
  Download, 
  MapPin, 
  Stethoscope, 
  Leaf, 
  Utensils, 
  FileText 
} from 'lucide-react';
import { simpleDb as db } from '../lib/simpleDatabase';
import { Point, Technique, ProtocolStep } from '../types';

interface ProtocolStepWithData extends ProtocolStep {
  data?: Point | Technique | any;
}

const ProtocolBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [protocolName, setProtocolName] = useState('');
  const [protocolTags, setProtocolTags] = useState<string[]>([]);
  const [protocolNotes, setProtocolNotes] = useState('');
  const [steps, setSteps] = useState<ProtocolStepWithData[]>([]);
  const [newTag, setNewTag] = useState('');

  // Available data for adding to protocol
  const [availablePoints, setAvailablePoints] = useState<Point[]>([]);
  const [availableTechniques, setAvailableTechniques] = useState<Technique[]>([]);
  const [showAddStep, setShowAddStep] = useState(false);
  const [selectedStepType, setSelectedStepType] = useState<'point' | 'technique' | 'herb' | 'diet' | 'note'>('point');

  useEffect(() => {
    const loadData = async () => {
      try {
        await db.initialize();
        const [points, techniques] = await Promise.all([
          db.getPoints(),
          db.getTechniques()
        ]);
        setAvailablePoints(points);
        setAvailableTechniques(techniques);

        // If editing, load existing protocol
        if (isEditing) {
          // TODO: Load existing protocol data
          setProtocolName('Sample Protocol');
          setProtocolTags(['headache', 'common']);
          setProtocolNotes('This is a sample protocol for demonstration');
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, [isEditing, id]);

  const addStep = (type: string, refId?: string, name?: string) => {
    const newStep: ProtocolStepWithData = {
      id: Date.now(),
      protocolId: id || 'new',
      stepIndex: steps.length,
      stepType: type as any,
      refId: refId,
      details: '',
      durationSeconds: type === 'point' ? 120 : undefined // Default 2 minutes for points
    };

    // Add reference data for display
    if (type === 'point' && refId) {
      newStep.data = availablePoints.find(p => p.id === refId);
    } else if (type === 'technique' && refId) {
      newStep.data = availableTechniques.find(t => t.id === refId);
    }

    setSteps([...steps, newStep]);
    setShowAddStep(false);
  };

  const removeStep = (stepId: number) => {
    setSteps(steps.filter(step => step.id !== stepId));
  };

  const updateStepDetails = (stepId: number, details: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, details } : step
    ));
  };

  const updateStepDuration = (stepId: number, durationSeconds: number) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, durationSeconds } : step
    ));
  };

  const addTag = () => {
    if (newTag.trim() && !protocolTags.includes(newTag.trim())) {
      setProtocolTags([...protocolTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProtocolTags(protocolTags.filter(tag => tag !== tagToRemove));
  };

  const saveProtocol = () => {
    // TODO: Implement protocol saving
    console.log('Saving protocol:', {
      name: protocolName,
      tags: protocolTags,
      notes: protocolNotes,
      steps: steps
    });
    alert('Protocol saved! (Demo mode - not actually saved yet)');
  };

  const exportProtocol = () => {
    // TODO: Implement protocol export
    const protocolData = {
      name: protocolName,
      tags: protocolTags,
      notes: protocolNotes,
      steps: steps,
      exported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(protocolData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${protocolName.replace(/\s+/g, '_').toLowerCase()}_protocol.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case 'point': return <MapPin className="h-4 w-4" />;
      case 'technique': return <Stethoscope className="h-4 w-4" />;
      case 'herb': return <Leaf className="h-4 w-4" />;
      case 'diet': return <Utensils className="h-4 w-4" />;
      case 'note': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${minutes} min`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link 
        to="/protocols" 
        className="inline-flex items-center text-tcm-accent hover:text-tcm-secondary mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Protocols
      </Link>

      {/* Protocol Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="protocol-name" className="block text-sm font-medium text-gray-700 mb-1">
              Protocol Name
            </label>
            <input
              id="protocol-name"
              type="text"
              value={protocolName}
              onChange={(e) => setProtocolName(e.target.value)}
              placeholder="Enter protocol name..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
            />
          </div>

          <div>
            <label htmlFor="protocol-tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {protocolTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center bg-tcm-accent bg-opacity-10 text-tcm-accent px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-tcm-accent hover:text-tcm-secondary"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tag..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent text-sm"
              />
              <button
                onClick={addTag}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="protocol-notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="protocol-notes"
              value={protocolNotes}
              onChange={(e) => setProtocolNotes(e.target.value)}
              rows={3}
              placeholder="Protocol description and notes..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
            />
          </div>
        </div>
      </div>

      {/* Protocol Steps */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Treatment Steps</h2>
          <button
            onClick={() => setShowAddStep(true)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-tcm-accent hover:bg-tcm-secondary"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Step
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                <span className="text-sm font-medium text-gray-500 min-w-[2rem]">
                  {index + 1}.
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-tcm-accent">
                    {getStepIcon(step.stepType)}
                  </div>
                  <span className="font-medium text-gray-900 capitalize">
                    {step.stepType}
                  </span>
                  {step.data && (
                    <span className="text-sm text-gray-600">
                      - {step.stepType === 'point' ? (step.data as Point).nameEn : (step.data as any).name}
                    </span>
                  )}
                  {step.durationSeconds && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {formatDuration(step.durationSeconds)}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <textarea
                    value={step.details || ''}
                    onChange={(e) => updateStepDetails(step.id, e.target.value)}
                    placeholder="Add notes for this step..."
                    rows={2}
                    className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
                  />
                  
                  {step.stepType === 'point' && (
                    <div className="flex items-center space-x-2">
                      <label className="text-xs text-gray-600">Duration:</label>
                      <input
                        type="number"
                        value={step.durationSeconds ? Math.floor(step.durationSeconds / 60) : 2}
                        onChange={(e) => updateStepDuration(step.id, parseInt(e.target.value) * 60)}
                        min="1"
                        max="10"
                        className="w-16 text-xs rounded border-gray-300"
                      />
                      <span className="text-xs text-gray-600">minutes</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeStep(step.id)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {steps.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No steps added yet. Click "Add Step" to begin building your protocol.</p>
            </div>
          )}
        </div>

        {/* Add Step Modal */}
        {showAddStep && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Protocol Step</h3>
                <button
                  onClick={() => setShowAddStep(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Step Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'point', label: 'Acupoint', icon: MapPin },
                      { id: 'technique', label: 'Technique', icon: Stethoscope },
                      { id: 'herb', label: 'Herb', icon: Leaf },
                      { id: 'diet', label: 'Diet', icon: Utensils },
                      { id: 'note', label: 'Note', icon: FileText }
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedStepType(type.id as any)}
                          className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                            selectedStepType === type.id
                              ? 'border-tcm-accent bg-tcm-accent bg-opacity-10 text-tcm-accent'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <Icon className="h-4 w-4 mx-auto mb-1" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedStepType === 'point' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Point
                    </label>
                    <select
                      onChange={(e) => {
                        const point = availablePoints.find(p => p.id === e.target.value);
                        if (point) {
                          addStep('point', point.id, point.nameEn);
                        }
                      }}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
                    >
                      <option value="">Choose a point...</option>
                      {availablePoints.map((point) => (
                        <option key={point.id} value={point.id}>
                          {point.id} - {point.nameEn} ({point.meridianId})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedStepType === 'technique' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Technique
                    </label>
                    <select
                      onChange={(e) => {
                        const technique = availableTechniques.find(t => t.id === e.target.value);
                        if (technique) {
                          addStep('technique', technique.id, technique.name);
                        }
                      }}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-tcm-accent focus:ring-tcm-accent"
                    >
                      <option value="">Choose a technique...</option>
                      {availableTechniques.map((technique) => (
                        <option key={technique.id} value={technique.id}>
                          {technique.name} ({technique.modalityId})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(selectedStepType === 'herb' || selectedStepType === 'diet' || selectedStepType === 'note') && (
                  <div className="space-y-3">
                    <button
                      onClick={() => addStep(selectedStepType)}
                      className="w-full px-4 py-2 bg-tcm-accent text-white rounded-md hover:bg-tcm-secondary"
                    >
                      Add {selectedStepType.charAt(0).toUpperCase() + selectedStepType.slice(1)} Step
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {steps.length} steps • Total time: {formatDuration(steps.reduce((total, step) => total + (step.durationSeconds || 0), 0))}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={exportProtocol}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          
          <button
            onClick={saveProtocol}
            disabled={!protocolName.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-tcm-accent hover:bg-tcm-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tcm-accent disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtocolBuilder;
