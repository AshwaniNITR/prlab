"use client";

import { Pencil } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// --- Helpers ---

const htmlToPlainText = (html: string): string => {
  return html
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<ul[^>]*>/gi, '')
    .replace(/<\/ul>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const plainTextToHtml = (text: string, originalHtml: string): string => {
  const isList = /<ul|<li/i.test(originalHtml);
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (isList) {
    return `<ul>${lines.map(l => `<li>${l}</li>`).join('')}</ul>`;
  }
  return lines.map(l => `<p>${l}</p>`).join('');
};

// --- Spinner ---
const Spinner = () => (
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

// --- EditModal ---
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  isSaving: boolean;
  onSave: (newContent: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, title, content, isSaving, onSave }) => {
  const [tempContent, setTempContent] = useState('');

  useEffect(() => {
    if (isOpen) setTempContent(htmlToPlainText(content));
  }, [isOpen, content]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-blue-800">Edit {title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          <textarea
            className="w-full h-64 p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed resize-none"
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            placeholder="Enter content here. Each new line becomes a separate paragraph or list item."
          />
          <p className="text-xs text-gray-400 mt-2">Each line will be saved as a separate paragraph or list item.</p>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(plainTextToHtml(tempContent, content))}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? <><Spinner /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- BulletListModal ---
interface BulletListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  isSaving: boolean;
  onSave: (newItems: string[]) => void;
}

const BulletListModal: React.FC<BulletListModalProps> = ({ isOpen, onClose, title, items, isSaving, onSave }) => {
  const [tempItems, setTempItems] = useState<string[]>([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    if (isOpen) setTempItems(items);
  }, [isOpen, items]);

  if (!isOpen) return null;

  const addItem = () => {
    if (newItemText.trim()) {
      setTempItems(prev => [...prev, newItemText.trim()]);
      setNewItemText('');
    }
  };

  const updateItem = (index: number, newText: string) => {
    setTempItems(prev => prev.map((item, i) => (i === index ? newText : item)));
  };

  const deleteItem = (index: number) => {
    setTempItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-blue-800">Edit {title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          <div className="space-y-3 mb-6">
            {tempItems.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="text-blue-500 text-lg leading-none">•</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(idx, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                />
                <button
                  onClick={() => deleteItem(idx)}
                  className="text-red-400 hover:text-red-600 p-1 transition-colors"
                  aria-label="Delete item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add new bullet point..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <button onClick={addItem} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Add
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(tempItems.filter(item => item.trim() !== ''))}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? <><Spinner /> Saving...</> : 'Save All'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main About Component ---
const About: React.FC = () => {
  const [docId, setDocId] = useState<number | null>(null);
  const [missionVision, setMissionVision] = useState('');
  const [coreObjectives, setCoreObjectives] = useState('');
  const [capabilities, setCapabilities] = useState('');
  const [contributions, setContributions] = useState<string[]>([]);
  const [researchFields, setResearchFields] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'section' | 'bullet';
    title: string;
  }>({ isOpen: false, type: 'section', title: '' });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://prlab.vercel.app/api/aboutus');
        const json = await res.json();

        console.log('GET /api/aboutus response:', json); // debug

        if (!res.ok) throw new Error(json.message || 'Failed to fetch');

        const data = json.data;

        // data.id is our custom numeric field set in the schema
        const numericId = data.id;
        console.log('Resolved docId:', numericId); // debug

        setDocId(numericId ?? null);
        setMissionVision(data.missionVision ?? '');
        setCoreObjectives(data.coreObjectives ?? '');
        setCapabilities(data.capabilities ?? '');
        setContributions(data.contributions ?? []);
        setResearchFields(data.researchFields ?? []);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Could not load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // PATCH only changed fields using the numeric id
  const patchData = async (fields: Partial<{
    missionVision: string;
    coreObjectives: string;
    capabilities: string;
    contributions: string[];
    researchFields: string[];
  }>) => {
    if (docId === null) {
      console.error('docId is null — cannot PATCH');
      throw new Error('No document id available');
    }

    const url = `https://prlab.vercel.app/api/aboutus/${docId}`;
    console.log('PATCH', url, fields); // debug

    setIsSaving(true);
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      const json = await res.json();
      console.log('PATCH response:', json); // debug

      if (!res.ok) throw new Error(json.error || json.message || 'Failed to save');
    } catch (err) {
      console.error('PATCH error:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSectionSave = async (title: string, newContent: string) => {
    try {
      if (title === 'Mission & Vision') {
        await patchData({ missionVision: newContent });
        setMissionVision(newContent);
      } else if (title === 'Core Objectives') {
        await patchData({ coreObjectives: newContent });
        setCoreObjectives(newContent);
      } else if (title === 'Lab Capabilities') {
        await patchData({ capabilities: newContent });
        setCapabilities(newContent);
      }
      closeModal();
    } catch (err: any) {
      alert(`Failed to save: ${err?.message ?? 'Unknown error'}`);
    }
  };

  const handleBulletSave = async (title: string, newItems: string[]) => {
    try {
      if (title === 'Contributions') {
        await patchData({ contributions: newItems });
        setContributions(newItems);
      } else if (title === 'Research Fields') {
        await patchData({ researchFields: newItems });
        setResearchFields(newItems);
      }
      closeModal();
    } catch (err: any) {
      alert(`Failed to save: ${err?.message ?? 'Unknown error'}`);
    }
  };

  const openSectionModal = (title: string) => setModalConfig({ isOpen: true, type: 'section', title });
  const openBulletModal = (title: string) => setModalConfig({ isOpen: true, type: 'bullet', title });
  const closeModal = () => setModalConfig({ isOpen: false, type: 'section', title: '' });

  const renderHTML = (htmlString: string) => (
    <div dangerouslySetInnerHTML={{ __html: htmlString }} className="text-black space-y-4" />
  );

  if (loading) {
    return (
      <section id="about" className="py-16 bg-gray-50 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-blue-600">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="about" className="py-16 bg-gray-50 flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-800">About Our Research Lab</h2>

        {/* Mission & Vision */}
        <div className="mb-12 relative group">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold mb-6 text-blue-700 border-b-2 border-blue-200 pb-2">Mission & Vision</h3>
            {/* <button onClick={() => openSectionModal('Mission & Vision')} className="text-blue-600  transition-opacity" aria-label="Edit Mission & Vision">
              <Pencil className="w-5 h-5" />
            </button> */}
          </div>
          {renderHTML(missionVision)}
        </div>

        {/* Core Objectives */}
        <div className="mb-12 relative group">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold mb-6 text-blue-700 border-b-2 border-blue-200 pb-2">Core Objectives</h3>
            {/* <button onClick={() => openSectionModal('Core Objectives')} className="text-blue-600  transition-opacity" aria-label="Edit Core Objectives">
              <Pencil className="w-5 h-5" />
            </button> */}
          </div>
          {renderHTML(coreObjectives)}

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {/* Contributions */}
            <div className="bg-white p-6 rounded-lg shadow-md relative group/box">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-blue-600">Contributions</h4>
                {/* <button onClick={() => openBulletModal('Contributions')} className="text-blue-600  transition-opacity" aria-label="Edit Contributions">
                  <Pencil className="w-4 h-4" />
                </button> */}
              </div>
              <ul className="list-disc pl-5 space-y-2 text-black">
                {contributions.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            </div>

            {/* Research Fields */}
            <div className="bg-white p-6 rounded-lg shadow-md relative group/box">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-blue-600">Research Fields</h4>
                {/* <button onClick={() => openBulletModal('Research Fields')} className="text-blue-600  transition-opacity" aria-label="Edit Research Fields">
                  <Pencil className="w-4 h-4" />
                </button> */}
              </div>
              <ul className="space-y-2 text-black">
                {researchFields.map((field, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Lab Capabilities */}
        <div className="relative group">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold mb-6 text-blue-700 border-b-2 border-blue-200 pb-2">Lab Capabilities</h3>
            {/* <button onClick={() => openSectionModal('Lab Capabilities')} className="text-blue-600  transition-opacity" aria-label="Edit Lab Capabilities">
              <Pencil className="w-5 h-5" />
            </button> */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-black">
            {renderHTML(capabilities)}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditModal
        isOpen={modalConfig.isOpen && modalConfig.type === 'section'}
        onClose={closeModal}
        title={modalConfig.title}
        content={
          modalConfig.title === 'Mission & Vision' ? missionVision :
          modalConfig.title === 'Core Objectives' ? coreObjectives :
          capabilities
        }
        isSaving={isSaving}
        onSave={(newContent) => handleSectionSave(modalConfig.title, newContent)}
      />

      <BulletListModal
        isOpen={modalConfig.isOpen && modalConfig.type === 'bullet'}
        onClose={closeModal}
        title={modalConfig.title}
        items={modalConfig.title === 'Contributions' ? contributions : researchFields}
        isSaving={isSaving}
        onSave={(newItems) => handleBulletSave(modalConfig.title, newItems)}
      />
    </section>
  );
};

export default About;