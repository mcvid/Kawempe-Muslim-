import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Video, Image as ImageIcon, Upload, X } from 'lucide-react';
import '../../components/AdminLayout.css';

const VideoManager = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ video: 0, thumbnail: 0 });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [useUrlInput, setUseUrlInput] = useState(true); // Toggle between URL and file upload

    useEffect(() => {
        fetchVideoSettings();
    }, []);

    const fetchVideoSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('promo_video_url, promo_video_thumbnail')
                .eq('key', 'homepage_video')
                .maybeSingle();

            if (error) throw error;

            if (data) {
                setVideoUrl(data.promo_video_url || '');
                setThumbnailUrl(data.promo_video_thumbnail || '');
            }
        } catch (error) {
            console.error('Error fetching video settings:', error);
            setMessage({ type: 'error', text: 'Failed to load video settings' });
        } finally {
            setLoading(false);
        }
    };

    const uploadFile = async (file, bucket, folder) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return publicUrl;
    };

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!validVideoTypes.includes(file.type)) {
            setMessage({ type: 'error', text: 'Please upload a valid video file (MP4, WebM, or OGG)' });
            return;
        }

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Video file must be less than 100MB' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const url = await uploadFile(file, 'videos', 'promo');
            setVideoUrl(url);
            setMessage({ type: 'success', text: 'Video uploaded successfully!' });
        } catch (error) {
            console.error('Error uploading video:', error);
            setMessage({ type: 'error', text: 'Failed to upload video: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            setMessage({ type: 'error', text: 'Please upload a valid image file (JPG, PNG, or WebP)' });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image file must be less than 5MB' });
            return;
        }

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const url = await uploadFile(file, 'galleries', 'thumbnails');
            setThumbnailUrl(url);
            setMessage({ type: 'success', text: 'Thumbnail uploaded successfully!' });
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            setMessage({ type: 'error', text: 'Failed to upload thumbnail: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    key: 'homepage_video',
                    promo_video_url: videoUrl,
                    promo_video_thumbnail: thumbnailUrl,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'key'
                });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Video settings saved successfully!' });
        } catch (error) {
            console.error('Error saving video settings:', error);
            setMessage({ type: 'error', text: 'Failed to save video settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <div>
                    <h1>Homepage Video Manager</h1>
                    <p className="admin-subtitle">Manage the promotional video on the homepage</p>
                </div>
            </div>

            <div className="admin-card">
                <form onSubmit={handleSave}>
                    <div className="form-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Video Settings</h3>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => setUseUrlInput(true)}
                                    className={`btn ${useUrlInput ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                >
                                    URL Input
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUseUrlInput(false)}
                                    className={`btn ${!useUrlInput ? 'btn-primary' : 'btn-outline'}`}
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                >
                                    File Upload
                                </button>
                            </div>
                        </div>

                        {useUrlInput ? (
                            <>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                                    Enter a YouTube or Vimeo URL for the homepage promotional video.
                                </p>

                                <div className="form-group">
                                    <label>
                                        <Video size={18} />
                                        Video URL (YouTube or Vimeo)
                                    </label>
                                    <input
                                        type="url"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className="form-input"
                                        required
                                    />
                                    <small style={{ color: '#64748b', display: 'block', marginTop: '0.5rem' }}>
                                        Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <ImageIcon size={18} />
                                        Thumbnail Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={thumbnailUrl}
                                        onChange={(e) => setThumbnailUrl(e.target.value)}
                                        placeholder="https://example.com/thumbnail.jpg"
                                        className="form-input"
                                        required
                                    />
                                    <small style={{ color: '#64748b', display: 'block', marginTop: '0.5rem' }}>
                                        This image will be shown before the video plays.
                                    </small>
                                </div>
                            </>
                        ) : (
                            <>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                                    Upload video and thumbnail files from your computer.
                                </p>

                                <div className="form-group">
                                    <label>
                                        <Video size={18} />
                                        Upload Video File
                                    </label>
                                    <div style={{
                                        border: '2px dashed #e2e8f0',
                                        borderRadius: '8px',
                                        padding: '2rem',
                                        textAlign: 'center',
                                        backgroundColor: '#f8fafc'
                                    }}>
                                        <input
                                            type="file"
                                            accept="video/mp4,video/webm,video/ogg"
                                            onChange={handleVideoUpload}
                                            disabled={uploading}
                                            style={{ display: 'none' }}
                                            id="video-upload"
                                        />
                                        <label htmlFor="video-upload" style={{ cursor: 'pointer' }}>
                                            <Upload size={32} style={{ margin: '0 auto 1rem', color: '#64748b' }} />
                                            <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                                                {uploading ? 'Uploading...' : 'Click to upload video'}
                                            </p>
                                            <small style={{ color: '#94a3b8' }}>
                                                MP4, WebM, or OGG (max 100MB)
                                            </small>
                                        </label>
                                    </div>
                                    {videoUrl && !videoUrl.includes('youtube') && !videoUrl.includes('vimeo') && (
                                        <p style={{ color: '#22c55e', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                            ✓ Video uploaded: {videoUrl.split('/').pop()}
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>
                                        <ImageIcon size={18} />
                                        Upload Thumbnail Image
                                    </label>
                                    <div style={{
                                        border: '2px dashed #e2e8f0',
                                        borderRadius: '8px',
                                        padding: '2rem',
                                        textAlign: 'center',
                                        backgroundColor: '#f8fafc'
                                    }}>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleThumbnailUpload}
                                            disabled={uploading}
                                            style={{ display: 'none' }}
                                            id="thumbnail-upload"
                                        />
                                        <label htmlFor="thumbnail-upload" style={{ cursor: 'pointer' }}>
                                            <Upload size={32} style={{ margin: '0 auto 1rem', color: '#64748b' }} />
                                            <p style={{ color: '#64748b', marginBottom: '0.5rem' }}>
                                                {uploading ? 'Uploading...' : 'Click to upload thumbnail'}
                                            </p>
                                            <small style={{ color: '#94a3b8' }}>
                                                JPG, PNG, or WebP (max 5MB)
                                            </small>
                                        </label>
                                    </div>
                                    {thumbnailUrl && (
                                        <p style={{ color: '#22c55e', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                            ✓ Thumbnail uploaded
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {thumbnailUrl && (
                            <div className="preview-section" style={{ marginTop: '1.5rem' }}>
                                <h4 style={{ marginBottom: '1rem' }}>Thumbnail Preview</h4>
                                <img
                                    src={thumbnailUrl}
                                    alt="Video thumbnail preview"
                                    style={{
                                        maxWidth: '400px',
                                        width: '100%',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type}`} style={{ marginTop: '1rem' }}>
                            {message.text}
                        </div>
                    )}

                    <div className="form-actions" style={{ marginTop: '2rem' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving || uploading}
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Video Settings'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="admin-card" style={{ marginTop: '2rem' }}>
                <h3>Instructions</h3>
                <div style={{ color: '#64748b', lineHeight: '1.8' }}>
                    <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Option 1: URL Input</h4>
                    <ol style={{ paddingLeft: '1.5rem' }}>
                        <li>Go to YouTube or Vimeo and find your school's promotional video</li>
                        <li>Copy the video URL from the browser address bar</li>
                        <li>Paste it in the "Video URL" field</li>
                        <li>Add a thumbnail image URL</li>
                        <li>Click "Save Video Settings"</li>
                    </ol>

                    <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Option 2: File Upload</h4>
                    <ol style={{ paddingLeft: '1.5rem' }}>
                        <li>Click "File Upload" toggle button</li>
                        <li>Click the video upload area and select your video file (MP4, WebM, or OGG)</li>
                        <li>Wait for upload to complete</li>
                        <li>Click the thumbnail upload area and select an image</li>
                        <li>Click "Save Video Settings"</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default VideoManager;

