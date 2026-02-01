import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { Save, ArrowLeft, Upload } from 'lucide-react';

const NewsEditor = () => {
    const params = useParams();
    const id = params?.id;
    const router = useRouter();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image_url: '',
        category: '',
        author_name: '',
        author_image: '',
        published_at: new Date().toISOString().split('T')[0],
        is_published: false
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) {
            fetchNewsItem();
        }
    }, [id]);

    const fetchNewsItem = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Format date for input
            const formattedData = {
                ...data,
                published_at: data.published_at ? new Date(data.published_at).toISOString().split('T')[0] : ''
            };

            setFormData(formattedData);
        } catch (err) {
            console.error('Error fetching news:', err);
            setError('Could not load news item.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };

            // Auto-generate slug from title if slug is empty or user is typing title
            if (name === 'title' && !isEditing) {
                newData.slug = value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
            }

            return newData;
        });
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images') // Ensure this bucket exists in Supabase!
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Make sure the "images" bucket exists and is public.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const filteredData = {
                title: formData.title,
                slug: formData.slug,
                excerpt: formData.excerpt,
                content: formData.content,
                image_url: formData.image_url,
                category: formData.category,
                author_name: formData.author_name,
                author_image: formData.author_image,
                published_at: formData.published_at,
                is_published: formData.is_published
            };

            if (isEditing) {
                const { error } = await supabase
                    .from('news')
                    .update(filteredData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('news')
                    .insert([filteredData]);
                if (error) throw error;
            }

            router.push('/admin/news');
        } catch (err) {
            console.error('Error saving news:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing && !formData.title) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div className="admin-page admin-fade-in">
            <div className="admin-header">
                <div>
                    <button
                        onClick={() => router.push('/admin/news')}
                        className="btn btn-icon"
                        style={{ marginBottom: '1rem', color: '#64748b' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1>{isEditing ? 'Edit News' : 'Create News'}</h1>
                </div>
            </div>

            <div className="admin-form-container">
                {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            style={{ backgroundColor: '#f9fafb' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category (e.g. Sports, Academics)</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Sports"
                        />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Author Name</label>
                            <input
                                type="text"
                                name="author_name"
                                value={formData.author_name}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div className="form-group">
                            <label>Author Image URL</label>
                            <input
                                type="text"
                                name="author_image"
                                value={formData.author_image}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Excerpt (Short Summary)</label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows={10}
                        />
                    </div>

                    <div className="form-group">
                        <label>Featured Image</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                style={{ flex: '1', minWidth: '200px' }}
                            />
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    disabled={uploading}
                                />
                                <button type="button" className="btn btn-outline" disabled={uploading}>
                                    {uploading ? 'Uploading...' : <><Upload size={16} /> Upload</>}
                                </button>
                            </div>
                        </div>
                        {formData.image_url && (
                            <div style={{ marginTop: '1rem', width: '200px', height: '120px', overflow: 'hidden', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                                <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Publish Date</label>
                            <input
                                type="date"
                                name="published_at"
                                value={formData.published_at}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '1.8rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontWeight: '500' }}>
                                <input
                                    type="checkbox"
                                    name="is_published"
                                    checked={formData.is_published}
                                    onChange={handleChange}
                                    style={{ width: '1.25rem', height: '1.25rem', padding: 0 }}
                                />
                                <span>Publish Immediately</span>
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/news')}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Save News</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewsEditor;
