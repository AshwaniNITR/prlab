// components/EditModal.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string[]) => Promise<void>;
  initialContent: string[];
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContent,
}) => {
  const [content, setContent] = useState<string[]>(initialContent);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
    }
  }, [isOpen, initialContent]);

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...content];
    updated[index] = value;
    setContent(updated);
  };

  const addParagraph = () => {
    setContent([...content, ""]);
  };

  const removeParagraph = (index: number) => {
    const updated = content.filter((_, i) => i !== index);
    setContent(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(content.filter(p => p.trim() !== ""));
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">Edit About Content</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {content.map((paragraph, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-800">
                    Paragraph {index + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
                  rows={4}
                  placeholder={`Enter paragraph ${index + 1}`}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addParagraph}
              className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
            >
              + Add Paragraph
            </button>
          </div>

          {/* Footer - Fixed */}
          <div className="flex gap-3 p-6 border-t border-slate-200 flex-shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;