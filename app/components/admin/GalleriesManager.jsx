import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Upload, Trash2, Edit2, Save, X, Calendar, FolderPlus, Image as ImageIcon } from 'lucide-react';
import '../../components/AdminLayout.css';

const GalleriesManager = () => {
    const [galleries, setGalleries] = useState([]);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showNewGalleryForm, setShowNewGalleryForm] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // New gallery form state
    const [newGallery, setNewGallery] = useState({
        title: '',
        description: '',
        category: '',
        event_date: '',
        cover_image_url: ''
    });

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('galleries')
                .select('*')
                .order('event_date', { ascending: false });

            if (error) throw error;
            setGalleries(data || []);
        } catch (error) {
            console.error('Error fetching galleries:', error);
            setMessage({ type: 'error', text: 'Failed to load galleries' });
        } finally {
            setLoading(false);
        }
    };

    const fetchGalleryImages = async (galleryId) => {
        try {
            const { data, error } = await supabase
                .from('gallery_images')
                .select('*')
                .eq('gallery_id', galleryId)
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setGalleryImages(data || []);
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        }
    };

    const handleCreateGallery = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const { data, error } = await supabase
                .from('galleries')
                .insert([newGallery])
                .select()
                .single();

            if (error) throw error;

            setGalleries([data, ...galleries]);
            setShowNewGalleryForm(false);
            setNewGallery({
                title: '',
                description: '',
                category: '',
                event_date: '',
                cover_image_url: ''
            });
            setMessage({ type: 'success', text: 'Gallery created successfully!' });
        } catch (error) {
            console.error('Error creating gallery:', error);
            setMessage({ type: 'error', text: 'Failed to create gallery' });
        }
    };

    const handleDeleteGallery = async (id) => {
        if (!window.confirm('Delete this gallery and all its images?')) return;

        try {
            const { error } = await supabase
                .from('galleries')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setGalleries(galleries.filter(g => g.id !== id));
            if (selectedGallery?.id === id) {
                setSelectedGallery(null);
                setGalleryImages([]);
            }
            setMessage({ type: 'success', text: 'Gallery deleted successfully!' });
        } catch (error) {
            console.error('Error deleting gallery:', error);
            setMessage({ type: 'error', text: 'Failed to delete gallery' });
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length || !selectedGallery) return;

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const uploadPromises = files.map(async (file, index) => {
                // Upload to storage
                const fileExt = file.name.split('.').pop();
                const fileName = `galleries/${selectedGallery.id}/${Date.now()}_${index}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('galleries')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('galleries')
                    .getPublicUrl(fileName);

                // Insert into database
                const { data, error: dbError } = await supabase
                    .from('gallery_images')
                    .insert([{
                        gallery_id: selectedGallery.id,
                        image_url: publicUrl,
                        caption: '',
                        sort_order: galleryImages.length + index
                    }])
                    .select()
                    .single();

                if (dbError) throw dbError;
                return data;
            });

            const newImages = await Promise.all(uploadPromises);
            setGalleryImages([...galleryImages, ...newImages]);
            setMessage({ type: 'success', text: `${files.length} image(s) uploaded successfully!` });
        } catch (error) {
            console.error('Error uploading images:', error);
            setMessage({ type: 'error', text: 'Failed to upload images' });
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm('Delete this image?')) return;

        try {
            const { error } = await supabase
                .from('gallery_images')
                .delete()
                .eq('id', imageId);

            if (error) throw error;

            setGalleryImages(galleryImages.filter(img => img.id !== imageId));
            setMessage({ type: 'success', text: 'Image deleted successfully!' });
        } catch (error) {
            console.error('Error deleting image:', error);
            setMessage({ type: 'error', text: 'Failed to delete image' });
        }
    };

    const handleUpdateCaption = async (imageId, caption) => {
        try {
            const { error } = await supabase
                .from('gallery_images')
                .update({ caption })
                .eq('id', imageId);

            if (error) throw error;

            setGalleryImages(galleryImages.map(img =>
                img.id === imageId ? { ...img, caption } : img
            ));
        } catch (error) {
            console.error('Error updating caption:', error);
        }
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `galleries/covers/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('galleries')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('galleries')
                .getPublicUrl(fileName);

            setNewGallery({ ...newGallery, cover_image_url: publicUrl });
        } catch (error) {
            console.error('Error uploading cover:', error);
            setMessage({ type: 'error', text: 'Failed to upload cover image' });
        }
    };

    if (loading) {
        return <div className="admin-content"><div className="admin-loading">Loading...</div></div>;
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <div>
                    <h1>Photo Galleries Manager</h1>
                    <p className="admin-subtitle">Manage photo albums and images</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowNewGalleryForm(!showNewGalleryForm)}
                >
                    <FolderPlus size={18} />
                    {showNewGalleryForm ? 'Cancel' : 'New Gallery'}
                </button>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
                    {message.text}
                </div>
            )}

            {/* New Gallery Form */}
            {showNewGalleryForm && (
                <div className="admin-card" style={{ marginBottom: '2rem' }}>
                    <h3>Create New Gallery</h3>
                    <form onSubmit={handleCreateGallery}>
                        <div className="form-group">
                            <label>Gallery Title *</label>
                            <input
                                type="text"
                                value={newGallery.title}
                                onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                                className="form-input"
                                required
                                placeholder="e.g., Sports Day 2024"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={newGallery.description}
                                onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                                className="form-input"
                                rows="3"
                                placeholder="Brief description of this gallery..."
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={newGallery.category}
                                    onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                                    className="form-input"
                                >
                                    <option value="">Select category...</option>
                                    <option value="Events">Events</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Academics">Academics</option>
                                    <option value="Campus Life">Campus Life</option>
                                    <option value="Ceremonies">Ceremonies</option>
                                    <option value="Clubs">Clubs</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Event Date</label>
                                <input
                                    type="date"
                                    value={newGallery.event_date}
                                    onChange={(e) => setNewGallery({ ...newGallery, event_date: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Cover Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                className="form-input"
                            />
                            {newGallery.cover_image_url && (
                                <img
                                    src={newGallery.cover_image_url}
                                    alt="Cover preview"
                                    style={{ maxWidth: '200px', marginTop: '0.5rem', borderRadius: '8px' }}
                                />
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                <Save size={18} />
                                Create Gallery
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Galleries List */}
            {!selectedGallery ? (
                <div className="admin-card">
                    <h3>All Galleries ({galleries.length})</h3>
                    {galleries.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                            <ImageIcon size={48} style={{ margin: '0 auto 1rem' }} />
                            <p>No galleries yet. Create your first gallery!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                            {galleries.map((gallery) => (
                                <div
                                    key={gallery.id}
                                    style={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => {
                                        setSelectedGallery(gallery);
                                        fetchGalleryImages(gallery.id);
                                    }}
                                >
                                    <div
                                        style={{
                                            height: '180px',
                                            backgroundImage: `url(${gallery.cover_image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80'})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                    <div style={{ padding: '1rem' }}>
                                        <h4 style={{ marginBottom: '0.5rem' }}>{gallery.title}</h4>
                                        {gallery.category && (
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '0.25rem 0.75rem',
                                                background: '#eff6ff',
                                                color: '#1e90ff',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                marginBottom: '0.5rem'
                                            }}>
                                                {gallery.category}
                                            </span>
                                        )}
                                        {gallery.event_date && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                                                <Calendar size={14} />
                                                {new Date(gallery.event_date).toLocaleDateString()}
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteGallery(gallery.id);
                                            }}
                                            style={{
                                                marginTop: '0.75rem',
                                                padding: '0.5rem',
                                                background: '#fee2e2',
                                                color: '#dc2626',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.875rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            <Trash2 size={14} />
                                            Delete Gallery
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Gallery Images View */
                <div>
                    <button
                        className="btn btn-outline"
                        onClick={() => {
                            setSelectedGallery(null);
                            setGalleryImages([]);
                        }}
                        style={{ marginBottom: '1.5rem' }}
                    >
                        ← Back to Galleries
                    </button>

                    <div className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h3>{selectedGallery.title}</h3>
                                <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>
                                    {galleryImages.length} image(s)
                                </p>
                            </div>
                            <div>
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="btn btn-primary"
                                    style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
                                >
                                    <Upload size={18} />
                                    {uploading ? 'Uploading...' : 'Upload Images'}
                                </label>
                            </div>
                        </div>

                        {galleryImages.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                <ImageIcon size={48} style={{ margin: '0 auto 1rem' }} />
                                <p>No images in this gallery yet. Upload some!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                {galleryImages.map((img) => (
                                    <div key={img.id} style={{ position: 'relative' }}>
                                        <img
                                            src={img.image_url}
                                            alt={img.caption}
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <button
                                            onClick={() => handleDeleteImage(img.id)}
                                            style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                background: 'rgba(255, 255, 255, 0.95)',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '32px',
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                color: '#dc2626'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <input
                                            type="text"
                                            value={img.caption || ''}
                                            onChange={(e) => handleUpdateCaption(img.id, e.target.value)}
                                            placeholder="Add caption..."
                                            style={{
                                                width: '100%',
                                                marginTop: '0.5rem',
                                                padding: '0.5rem',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleriesManager;
