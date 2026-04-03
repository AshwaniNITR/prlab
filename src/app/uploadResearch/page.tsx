'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

type ResearchFormData = {
    title: string;
    description: string;
    image: File | null;
};

export default function AddResearchPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Array of forms with image previews
    const [forms, setForms] = useState<{
        data: ResearchFormData;
        imagePreview: string | null;
    }[]>([{
        data: {
            title: '',
            image: null,
            description: '',
        },
        imagePreview: null,
    }]);

    const handleImageChange = (index: number, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const updatedForms = [...forms];
            updatedForms[index] = {
                ...updatedForms[index],
                data: { ...updatedForms[index].data, image: file },
                imagePreview: reader.result as string,
            };
            setForms(updatedForms);
        };
        reader.readAsDataURL(file);
    };

    const addNewForm = () => {
        setForms([
            ...forms,
            {
                data: {
                    title: '',
                    image: null,
                    description: '',
                },
                imagePreview: null,
            },
        ]);
    };

    const removeForm = (index: number) => {
        if (forms.length === 1) {
            // Don't remove the last form
            alert('At least one research item is required');
            return;
        }
        const updatedForms = [...forms];
        updatedForms.splice(index, 1);
        setForms(updatedForms);
    };

    const updateFormData = (index: number, field: keyof ResearchFormData, value: string) => {
        const updatedForms = [...forms];
        updatedForms[index] = {
            ...updatedForms[index],
            data: { ...updatedForms[index].data, [field]: value },
        };
        setForms(updatedForms);
    };

    const validateForms = () => {
        for (let i = 0; i < forms.length; i++) {
            const form = forms[i].data;
            if (!form.title || !form.image || !form.description) {
                return `Please fill in all required fields for research item ${i + 1}`;
            }
        }
        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Validation
            const validationError = validateForms();
            if (validationError) {
                setError(validationError);
                setIsLoading(false);
                return;
            }

            // Create FormData with all research items
            const formData = new FormData();

            // Add each research item's data
            forms.forEach((form, index) => {
                const data = form.data;
                formData.append(`members[${index}][title]`, data.title);
                if (data.image) {
                    formData.append(`members[${index}][image]`, data.image);
                }
                formData.append(`members[${index}][description]`, data.description);
            });

            // Submit to API
            const response = await fetch('/api/research', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Failed to add research items');
            }

            setSuccess(true);

            // Reset form
            setForms([{
                data: {
                    title: '',
                    image: null,
                    description: '',
                },
                imagePreview: null,
            }]);

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/research');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen transition-colors duration-300 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Add Research Items
                            </h1>
                            <p className="text-gray-600">
                                Fill in the details to add new research projects or publications
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={addNewForm}
                            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                            <Plus size={20} />
                            Add Another Research
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            Research items added successfully! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {forms.map((form, index) => (
                            <div key={index} className="space-y-6 mb-8 p-6 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Research Item {index + 1}
                                    </h3>
                                    {forms.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeForm(index)}
                                            className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                                        >
                                            <Trash2 size={18} />
                                            Remove
                                        </button>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.title}
                                        onChange={(e) => updateFormData(index, 'title', e.target.value)}
                                        className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Research Title (e.g., Deep Learning for Pattern Recognition)"
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image / Thumbnail *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageChange(index, file);
                                        }}
                                        className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                    {form.imagePreview && (
                                        <div className="mt-4">
                                            <img
                                                src={form.imagePreview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description / Abstract *
                                    </label>
                                    <textarea
                                        value={form.data.description}
                                        onChange={(e) => updateFormData(index, 'description', e.target.value)}
                                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Provide a detailed description of the research, methodology, findings, or publication abstract..."
                                        rows={5}
                                        required
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Submit and Cancel Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? 'Adding...' : `Add ${forms.length} Research Item${forms.length > 1 ? 's' : ''}`}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/research')}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}