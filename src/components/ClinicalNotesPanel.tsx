// Clinical Notes Panel - Add and view personal notes
// Appears on point and protocol pages for practitioner customization

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Star, Clock, Save, X } from 'lucide-react';
import { ClinicalNote, PointCustomization } from '../types/clinical-notes';
import { clinicalNotesDb } from '../lib/clinical-notes/notes-database';

interface ClinicalNotesPanelProps {
  type: 'point' | 'indication' | 'protocol';
  referenceId: string;
  referenceName: string;
  compact?: boolean;
}

const ClinicalNotesPanel: React.FC<ClinicalNotesPanelProps> = ({ 
  type, 
  referenceId, 
  referenceName,
  compact = false 
}) => {
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<ClinicalNote | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'observation' as const,
    priority: 'medium' as const,
    tags: [] as string[],
    isPrivate: true
  });
  const [pointCustomization, setPointCustomization] = useState<PointCustomization | null>(null);

  useEffect(() => {
    loadNotes();
    if (type === 'point') {
      loadPointCustomization();
    }
  }, [referenceId]);

  const loadNotes = () => {
    const referenceNotes = clinicalNotesDb.getNotesByReference(referenceId);
    setNotes(referenceNotes);
  };

  const loadPointCustomization = () => {
    if (type === 'point') {
      const customization = clinicalNotesDb.getPointCustomization(referenceId);
      setPointCustomization(customization);
    }
  };

  const handleSaveNote = () => {
    const note: ClinicalNote = {
      id: editingNote?.id || `note_${Date.now()}`,
      type,
      referenceId,
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags,
      category: newNote.category,
      priority: newNote.priority,
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPrivate: newNote.isPrivate
    };

    clinicalNotesDb.saveNote(note);
    loadNotes();
    resetForm();
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Delete this clinical note?')) {
      clinicalNotesDb.deleteNote(noteId);
      loadNotes();
    }
  };

  const handleEditNote = (note: ClinicalNote) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority,
      tags: note.tags,
      isPrivate: note.isPrivate
    });
    setIsAddingNote(true);
  };

  const resetForm = () => {
    setIsAddingNote(false);
    setEditingNote(null);
    setNewNote({
      title: '',
      content: '',
      category: 'observation',
      priority: 'medium',
      tags: [],
      isPrivate: true
    });
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !newNote.tags.includes(tag)) {
      setNewNote(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setNewNote(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'observation': return 'bg-blue-100 text-blue-800';
      case 'modification': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'research': return 'bg-purple-100 text-purple-800';
      case 'personal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (compact) {
    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900 text-sm">Clinical Notes</h4>
          <button
            onClick={() => setIsAddingNote(true)}
            className="text-tcm-accent hover:text-tcm-accent-dark"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {notes.length > 0 ? (
          <div className="space-y-2">
            {notes.slice(0, 2).map(note => (
              <div key={note.id} className="text-xs text-gray-700 bg-white rounded p-2">
                <div className="font-medium">{note.title}</div>
                <div className="truncate">{note.content}</div>
              </div>
            ))}
            {notes.length > 2 && (
              <div className="text-xs text-gray-500">+{notes.length - 2} more notes</div>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-500">No notes yet</div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Clinical Notes - {referenceName}
        </h2>
        <button
          onClick={() => setIsAddingNote(true)}
          className="flex items-center px-3 py-2 bg-tcm-accent text-white rounded-lg hover:bg-tcm-accent-dark text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </button>
      </div>

      {/* Point Customization (if applicable) */}
      {type === 'point' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3">Point Customization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-blue-800 font-medium mb-1">Your Name for This Point:</label>
              <input
                type="text"
                value={pointCustomization?.personalName || ''}
                onChange={(e) => {
                  const updated = { 
                    ...pointCustomization, 
                    pointId: referenceId,
                    personalName: e.target.value 
                  } as PointCustomization;
                  setPointCustomization(updated);
                  clinicalNotesDb.savePointCustomization(updated);
                }}
                placeholder="Optional personal name"
                className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-blue-800 font-medium mb-1">Effectiveness (1-10):</label>
              <input
                type="number"
                min="1"
                max="10"
                value={pointCustomization?.effectivenessRating || ''}
                onChange={(e) => {
                  const updated = { 
                    ...pointCustomization, 
                    pointId: referenceId,
                    effectivenessRating: parseInt(e.target.value) 
                  } as PointCustomization;
                  setPointCustomization(updated);
                  clinicalNotesDb.savePointCustomization(updated);
                }}
                className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Note Form */}
      {isAddingNote && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              {editingNote ? 'Edit Note' : 'Add Clinical Note'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief title for your note"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Your clinical observation, modification, or reminder..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
                >
                  <option value="observation">Observation</option>
                  <option value="modification">Modification</option>
                  <option value="reminder">Reminder</option>
                  <option value="research">Research</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newNote.priority}
                  onChange={(e) => setNewNote(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tcm-accent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={newNote.isPrivate}
                    onChange={(e) => setNewNote(prev => ({ ...prev, isPrivate: e.target.checked }))}
                    className="mr-2"
                  />
                  Private note
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={resetForm}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={!newNote.title.trim() || !newNote.content.trim()}
                className="flex items-center px-3 py-2 bg-tcm-accent text-white rounded-md hover:bg-tcm-accent-dark disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-1" />
                {editingNote ? 'Update' : 'Save'} Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="font-medium text-gray-900 mr-2">{note.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(note.category)}`}>
                      {note.category}
                    </span>
                    <span className={`ml-2 text-xs ${getPriorityColor(note.priority)}`}>
                      {note.priority} priority
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{note.content}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    {note.tags.length > 0 && (
                      <>
                        <Tag className="h-3 w-3 ml-3 mr-1" />
                        <span>{note.tags.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Edit className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p>No clinical notes yet for this {type}</p>
            <button
              onClick={() => setIsAddingNote(true)}
              className="mt-2 text-tcm-accent hover:text-tcm-accent-dark text-sm"
            >
              Add your first note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalNotesPanel;
