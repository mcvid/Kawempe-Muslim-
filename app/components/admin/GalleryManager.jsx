import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);

            // 2. Insert into Database
            const { data: dbData, error: dbError } = await supabase
                .from('gallery')
                .insert([{
                    image_url: publicUrl,
                    title: file.name.split('.')[0] // Default title is filename
                }])
                .select()
                .single();

            if (dbError) throw dbError;

            // 3. Update UI
            setImages([dbData, ...images]);
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Upload failed. Ensure "images" bucket exists and is public.');
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this image?')) return;

        try {
            // 1. Delete from Database
            const { error: dbError } = await supabase
                .from('gallery')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            // 2. Try to delete from Storage (Optional but good practice)
            // Extract filename from URL... (Skipping for now to avoid complex parsing logic errors, DB delete is enough for UI)

            setImages(images.filter(img => img.id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete image.');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header" style={{ marginBottom: '2rem' }}>
                <h1>Gallery Manager</h1>
            </div>

            {/* Upload Section */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem', textAlign: 'center' }}>
                <input
                    type="file"
                    id="gallery-upload"
                    accept="image/*"
                    onChange={handleUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                />
                <label
                    htmlFor="gallery-upload"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', cursor: uploading ? 'not-allowed' : 'pointer' }}
                >
                    {uploading ? 'Uploading...' : <><Upload size={20} style={{ marginRight: '8px' }} /> Upload New Image</>}
                </label>
                <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                    Supports JPG, PNG. Max size 2MB recommended.
                </p>
            </div>


            {/* Image Grid */}
            <div className="gallery-grid">
                <style>{`
                    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
                    @media (max-width: 640px) {
                        .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
                        .admin-header h1 { font-size: 1.5rem; }
                        .admin-page { padding: 1rem; }
                        .btn-primary { width: 100%; justify-content: center; }
                    }
                `}</style>
                {loading ? (
                    <p>Loading...</p>
                ) : images.length === 0 ? (
                    <p style={{ color: '#6b7280', gridColumn: '1/-1', textAlign: 'center' }}>No images yet.</p>
                ) : (
                    images.map((img) => (
                        <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', aspectRatio: '1' }}>
                            <img src={img.image_url} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                                onClick={() => handleDelete(img.id, img.image_url)}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    padding: '6px',
                                    cursor: 'pointer',
                                    color: '#ef4444'
                                }}
                                title="Delete Image"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GalleryManager;
