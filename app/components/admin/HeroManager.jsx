import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Video } from 'lucide-react';
import Image from 'next/image';

const HeroManager = () => {
    const PAGES = [
        { label: 'Home Page', path: '/' },
        { label: 'Admissions', path: '/admissions' },
        { label: 'Academics', path: '/academics' },
        { label: 'About School', path: '/about' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'Vacancies', path: '/vacancies' },
        { label: 'Gallery', path: '/gallery' },
        { label: 'News/Blog', path: '/news' },
    ];

    const SMART_SUGGESTIONS = {
        '/': [
            { title: 'BUGISU HIGH SCHOOL', subtitle: 'Experience Excellence in Education' },
            { title: 'JOIN OUR COMMUNITY', subtitle: 'Nurturing the Leaders of Tomorrow' },
            { title: 'FUTURE LEADERS', subtitle: 'Shaping Minds, Changing Lives' },
            { title: 'STAY CONNECTED', subtitle: 'Building a Legacy of Knowledge' },
            { title: 'EXCELLENCE ALWAYS', subtitle: 'Your Gateway to a Brighter Future' },
            { title: 'INSPIRING MINDS', subtitle: 'Fostering Innovation and Creativity' },
            { title: 'VIBRANT COMMUNITY', subtitle: 'Where Every Student Succeeds' },
            { title: 'DISCOVER POTENTIAL', subtitle: 'Empowering Excellence Since 1990' },
            { title: 'WE ARE BUGISU', subtitle: 'A Place of Tradition and Progress' },
            { title: 'START YOUR JOURNEY', subtitle: 'The First Step to Greatness' }
        ],
        '/admissions': [
            { title: 'ADMISSIONS 2026', subtitle: 'Start Your Journey with Us Today' },
            { title: 'JOIN THE PRIDE', subtitle: 'Become Part of our Excellence' },
            { title: 'ENROLL NOW', subtitle: 'Secure Your Future with Quality Education' },
            { title: 'APPLY TODAY', subtitle: 'Your Path to Success Starts Here' },
            { title: 'WELCOME STUDENTS', subtitle: 'Join Mbale\'s Leading High School' },
            { title: 'FUTURE SCHOLARS', subtitle: 'Admissions Now Open for Next Term' },
            { title: 'CHOOSE EXCELLENCE', subtitle: 'Why Bugisu is the Right Choice' },
            { title: 'JOIN OUR LEGACY', subtitle: 'Nurturing Talent and Character' },
            { title: 'ADMISSIONS OPEN', subtitle: 'Step Into a World of Opportunities' },
            { title: 'READY TO LEARN?', subtitle: 'Join Our Dynamic Learning Environment' }
        ],
        '/academics': [
            { title: 'ACADEMIC EXCELLENCE', subtitle: 'A Tradition of High Standards & Innovation' },
            { title: 'HOLISTIC LEARNING', subtitle: 'Beyond the Classroom Boundaries' },
            { title: 'SMART CURRICULUM', subtitle: 'Empowering Students for Global Success' },
            { title: 'LEARN TO LEAD', subtitle: 'Developing Critical Thinking Skills' },
            { title: 'STEM FOCUS', subtitle: 'Inspiring Future Scientists and Engineers' },
            { title: 'ARTS & HUMANITIES', subtitle: 'Fostering Creativity and Expression' },
            { title: 'BEYOND THE BOOKS', subtitle: 'Practical Skills for Real-World Success' },
            { title: 'EXPERT TEACHERS', subtitle: 'Expert Guidance for Every Student' },
            { title: 'ACADEMIC GROWTH', subtitle: 'Scholarly Pursuits and Achievement' },
            { title: 'INNOVATION HUB', subtitle: 'Cutting-Edge Education for Modern Minds' }
        ],
        '/about': [
            { title: 'OUR STORY & VISION', subtitle: 'Building a Legacy of Knowledge Since 1990' },
            { title: 'PRINCIPAL\'S MESSAGE', subtitle: 'Leading with Integrity and Passion' },
            { title: 'OUR CORE VALUES', subtitle: 'Excellence, Integrity, and Service' },
            { title: 'HERITAGE & TRADITION', subtitle: 'A Glimpse into Our Rich History' },
            { title: 'OUR MISSION', subtitle: 'Nurturing Holistic and Responsible Citizens' },
            { title: 'SCHOOL GOVERNANCE', subtitle: 'Strategic Leadership and Vision' },
            { title: 'OUR ETHOS', subtitle: 'Inspiring a Lifetime of Learning' },
            { title: 'OUR IMPACT', subtitle: 'Alumni Success Stories that Inspire' },
            { title: 'PROUD HISTORY', subtitle: 'Decades of Educational Excellence' },
            { title: 'THE BUGISU WAY', subtitle: 'Character Building and Discipline' }
        ],
        '/contact': [
            { title: 'GET IN TOUCH', subtitle: 'We are Here to Help with Your Inquiries' },
            { title: 'VISIT OUR CAMPUS', subtitle: 'Experience our Vibrant Community Firsthand' },
            { title: 'REACH OUT', subtitle: 'Your Future Starts with a Conversation' },
            { title: 'CONTACT US', subtitle: 'Dedicated Support for Parents and Students' },
            { title: 'FIND US', subtitle: 'Visit our Campus in the Heart of Mbale' },
            { title: 'ADMISSIONS OFFICE', subtitle: 'Get Detailed Enrollment Information' },
            { title: 'GENERAL ENQUIRIES', subtitle: 'We\'re Just a Message Away' },
            { title: 'SCHOOL HOTLINE', subtitle: 'Immediate Assistance for Parents' },
            { title: 'VISITORS WELCOME', subtitle: 'Discover Bugisu High School Today' },
            { title: 'CONNECT WITH US', subtitle: 'Stay Updated on Enrollment and Events' }
        ],
        '/vacancies': [
            { title: 'CAREERS AT BUGISU', subtitle: 'Join a Team of Dedicated Educators' },
            { title: 'SHAPE THE FUTURE', subtitle: 'Professional Growth and Impact' },
            { title: 'TEACH WITH US', subtitle: 'Inspiring the Next Generation' },
            { title: 'STAFF VACANCIES', subtitle: 'Opportunities for Excellence' },
            { title: 'JOIN OUR TEAM', subtitle: 'Building a Brighter Future Together' },
            { title: 'EDUCATIONAL LEADERS', subtitle: 'Seeking Passionate Teachers' },
            { title: 'CAREER GROWTH', subtitle: 'Professional Development at Bugisu' },
            { title: 'WORK WITH PURPOSE', subtitle: 'Making a Difference in Students\' Lives' },
            { title: 'JOIN OUR FACULTY', subtitle: 'A Community of Lifelong Learners' },
            { title: 'VACANCIES 2026', subtitle: 'New Opportunities for the Academic Year' }
        ],
        '/gallery': [
            { title: 'SCHOOL MEMORIES', subtitle: 'Capturing Moments of Joy and Learning' },
            { title: 'CAMPUS LIFE', subtitle: 'A Glimpse into our Dynamic Environment' },
            { title: 'EVENTS IN PICTURES', subtitle: 'Celebrating our Achievements and Growth' },
            { title: 'SPORTS HIGHLIGHTS', subtitle: 'Excellence on and off the Field' },
            { title: 'CREATIVE ARTS', subtitle: 'Showcasing Student Talent and Expression' },
            { title: 'CAMPUS BEAUTY', subtitle: 'Our State-of-the-Art Facilities' },
            { title: 'STUDENT ACTIVITIES', subtitle: 'Engagement Beyond the Classroom' },
            { title: 'CELEBRATIONS', subtitle: 'Marking Milestones and Successes' },
            { title: 'GALLERY OVERVIEW', subtitle: 'Experience the Spirit of Bugisu' },
            { title: 'RECENT MOMENTS', subtitle: 'Life at Bugisu High School in Pictures' }
        ],
        '/news': [
            { title: 'LATEST UPDATES', subtitle: 'Stay Informed about School Life' },
            { title: 'ANNOUNCEMENTS', subtitle: 'Important Information for our Community' },
            { title: 'BLOG & STORIES', subtitle: 'Voices from Bugisu High School' },
            { title: 'TERM HIGHLIGHTS', subtitle: 'Reviewing our Recent Successes' },
            { title: 'STUDENT NEWS', subtitle: 'Celebrating Individual Achievements' },
            { title: 'STAFF UPDATES', subtitle: 'Professional News from our Faculty' },
            { title: 'UPCOMING EVENTS', subtitle: 'Don\'t Miss Out on What\'s Coming' },
            { title: 'COMMUNITY NEWS', subtitle: 'Strengthening our Local Ties' },
            { title: 'PRESS RELEASES', subtitle: 'Official Statements and News' },
            { title: 'READ MORE', subtitle: 'Dive Deeper into our Latest Stories' }
        ]
    };

    const ASSET_LIBRARY = [
        { id: 'acad', name: 'Academic', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800' },
        { id: 'campus', name: 'Campus', url: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800' },
        { id: 'comm', name: 'Community', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800' },
        { id: 'contact', name: 'Support', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800' },
        { id: 'staff', name: 'Faculty', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800' },
        { id: 'labs', name: 'Science', url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800' },
        { id: 'assembly', name: 'Gathering', url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800' },
        { id: 'graduation', name: 'Success', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800' },
        { id: 'library', name: 'Library', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800' },
        { id: 'sports', name: 'Athletics', url: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=800' }
    ];

    const VIDEO_LIBRARY = [
        { id: 'hallway', name: 'School Corridor', url: 'https://player.vimeo.com/external/370331493.sd.mp4?s=33285730c4513f1737f5978a3c467a48d8868a6d&profile_id=139&oauth2_token_id=57447761' },
        { id: 'library', name: 'Library Study', url: 'https://player.vimeo.com/external/462100680.sd.mp4?s=983bc5a16beacaf7ca226d97a5b3dec8f764a51e&profile_id=139&oauth2_token_id=57447761' },
        { id: 'classroom', name: 'Classroom', url: 'https://player.vimeo.com/external/403851505.sd.mp4?s=6a3b6807f67756f7e4c7e6c9b3d1b8e4e9a0f9b6&profile_id=139&oauth2_token_id=57447761' },
        { id: 'social', name: 'Social Interaction', url: 'https://player.vimeo.com/external/370331461.sd.mp4?s=d0092c2a07c42735767f4a25c3f9a764724e8a8b&profile_id=139&oauth2_token_id=57447761' }
    ];

    const [slides, setSlides] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [selectedPage, setSelectedPage] = useState('/');
    const [newSlide, setNewSlide] = useState({ title: '', subtitle: '', sort_order: 0 });
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [selectedAssetUrl, setSelectedAssetUrl] = useState('');
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAssets, setShowAssets] = useState(false);
    const [showVideos, setShowVideos] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            await fetchSlides();
        };
        fetchAll();
    }, [selectedPage]);

    const fetchSlides = async () => {
        const { data } = await supabase
            .from('hero_slides')
            .select('*')
            .eq('page_path', selectedPage)
            .order('sort_order', { ascending: true });
        if (data) setSlides(data);
    };

    const applySuggestion = (suggestion) => {
        setNewSlide({ ...newSlide, title: suggestion.title, subtitle: suggestion.subtitle });
        // Don't close the section automatically, let the user see what they applied
    };

    const handleUpload = async () => {
        if (!imageFile && !selectedAssetUrl) {
            alert('Please select a professional asset or upload your own image!');
            return;
        }

        setUploading(true);
        try {
            let imageUrl = selectedAssetUrl;
            let videoUrl = selectedVideoUrl;

            // 1. Upload Image (Only if a new file is provided, otherwise use selectedAssetUrl)
            if (imageFile) {
                const imgExt = imageFile.name.split('.').pop();
                const imgName = `${Math.random()}.${imgExt}`;
                const imgPath = `hero-slides/${imgName}`;
                const { error: imgError } = await supabase.storage.from('images').upload(imgPath, imageFile);
                if (imgError) throw imgError;
                imageUrl = supabase.storage.from('images').getPublicUrl(imgPath).data.publicUrl;
            }

            // 2. Upload Video (Optional - local file overrides preset)
            if (videoFile) {
                const vidExt = videoFile.name.split('.').pop();
                const vidName = `${Math.random()}.${vidExt}`;
                const vidPath = `hero-videos/${vidName}`;
                const { error: vidError } = await supabase.storage.from('images').upload(vidPath, videoFile);
                if (vidError) throw vidError;
                videoUrl = supabase.storage.from('images').getPublicUrl(vidPath).data.publicUrl;
            }

            // 3. Save to DB
            const { error: dbError } = await supabase.from('hero_slides').insert([
                {
                    image_url: imageUrl,
                    video_url: videoUrl,
                    title: newSlide.title || 'Welcome',
                    subtitle: newSlide.subtitle || 'Experience Excellence',
                    page_path: selectedPage,
                    sort_order: parseInt(newSlide.sort_order) || 0
                }
            ]);
            if (dbError) throw dbError;

            fetchSlides();
            setNewSlide({ title: '', subtitle: '', sort_order: 0 });
            setImageFile(null);
            setVideoFile(null);
            setSelectedAssetUrl('');
            setSelectedVideoUrl('');
            alert('Slide added successfully to ' + selectedPage);
        } catch (error) {
            console.error('Error uploading slide:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (slide) => {
        if (!window.confirm('Delete this slide?')) return;
        try {
            const getPath = (url) => url.split('/storage/v1/object/public/images/')[1];
            const filesToDelete = [];
            if (slide.image_url) {
                const path = getPath(slide.image_url);
                if (path) filesToDelete.push(path);
            }
            if (slide.video_url) {
                const path = getPath(slide.video_url);
                if (path) filesToDelete.push(path);
            }

            if (filesToDelete.length > 0) {
                await supabase.storage.from('images').remove(filesToDelete);
            }

            const { error } = await supabase.from('hero_slides').delete().eq('id', slide.id);
            if (error) throw error;

            setSlides(slides.filter(s => s.id !== slide.id));
            alert('Slide deleted!');
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Delete failed. Check console.');
        }
    };

    return (
        <div className="admin-page hero-manager-root">
            <style>{`
                .hero-manager-root h1 { font-size: 1.5rem; }
                .hero-upload-card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 2rem; }
                .hero-form-grid { display: grid; gap: 1rem; grid-template-columns: 2fr 2fr 1fr; }
                .hero-header { display: flex; justify-content: space-between; alignItems: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
                .hero-upload-options { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
                
                @media (max-width: 768px) {
                    .hero-form-grid { grid-template-columns: 1fr; }
                    .hero-upload-options { grid-template-columns: 1fr; }
                    .hero-manager-root h1 { font-size: 1.25rem; }
                    .hero-upload-card { padding: 1rem; }
                    .hero-header { flex-direction: column; align-items: flex-start; }
                }

                .toggle-btn {
                    background: #f3f4f6;
                    border: 1px solid #e5e7eb;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                    color: #4b5563;
                }
                .toggle-btn:hover { background: #e5e7eb; }
                .toggle-btn.active { background: #eff6ff; border-color: #2563eb; color: #2563eb; }
            `}</style>
            <div className="hero-header">
                <div>
                    <h1>Universal Hero Manager</h1>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Manage background images and videos for all pages.</p>
                </div>

                <div style={{ background: '#f3f4f6', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', width: 'fit-content' }}>
                    <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Page:</label>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #d1d5db', minWidth: '150px', fontSize: '0.85rem' }}
                    >
                        {PAGES.map(p => <option key={p.path} value={p.path}>{p.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Upload Box */}
            <div className="hero-upload-card">
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Add New Slide to <span style={{ color: '#2563eb' }}>{selectedPage}</span></h3>
                <div className="hero-form-grid">
                    <input
                        type="text"
                        placeholder="Small Green Title"
                        value={newSlide.title}
                        onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    <input
                        type="text"
                        placeholder="Big White Subtitle"
                        value={newSlide.subtitle}
                        onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    <input
                        type="number"
                        placeholder="Sort Order"
                        value={newSlide.sort_order}
                        onChange={(e) => setNewSlide({ ...newSlide, sort_order: e.target.value })}
                        style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                </div>

                {/* Smart Suggestions */}
                <div style={{ marginTop: '1.5rem' }}>
                    <button className={`toggle-btn ${showSuggestions ? 'active' : ''}`} onClick={() => setShowSuggestions(!showSuggestions)}>
                        {showSuggestions ? 'Hide' : 'Show'} Smart Suggestions 🪄
                    </button>

                    {showSuggestions && (
                        <div style={{ marginTop: '0.5rem', background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>✨ Suggestions for {selectedPage}:</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {SMART_SUGGESTIONS[selectedPage]?.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => applySuggestion(s)}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: '50px',
                                            border: '1px solid #e5e7eb',
                                            background: 'white',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = 'inherit'; }}
                                    >
                                        <span style={{ fontWeight: 'bold' }}>{s.title}:</span> {s.subtitle}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Asset Gallery suggestions */}
                <div style={{ marginTop: '1rem' }}>
                    <button className={`toggle-btn ${showAssets ? 'active' : ''}`} onClick={() => setShowAssets(!showAssets)}>
                        {showAssets ? 'Hide' : 'Show'} School Asset Library 🖼️
                    </button>

                    {showAssets && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <div style={{
                                display: 'flex',
                                overflowX: 'auto',
                                gap: '1rem',
                                padding: '0.5rem 0.25rem',
                                scrollbarWidth: 'thin'
                            }}>
                                {ASSET_LIBRARY.map((asset) => (
                                    <div
                                        key={asset.id}
                                        onClick={() => {
                                            setSelectedAssetUrl(asset.url);
                                            setImageFile(null);
                                        }}
                                        style={{
                                            flex: '0 0 120px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            border: selectedAssetUrl === asset.url ? '3px solid #2563eb' : '2px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <img src={asset.url} alt={asset.name} style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'rgba(0,0,0,0.6)',
                                            color: 'white',
                                            fontSize: '0.65rem',
                                            textAlign: 'center',
                                            padding: '2px 0'
                                        }}>
                                            {asset.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Gallery suggestions */}
                <div style={{ marginTop: '1rem' }}>
                    <button className={`toggle-btn ${showVideos ? 'active' : ''}`} onClick={() => setShowVideos(!showVideos)}>
                        {showVideos ? 'Hide' : 'Show'} Pro Video Backgrounds 🎞️
                    </button>

                    {showVideos && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <div style={{
                                display: 'flex',
                                overflowX: 'auto',
                                gap: '1rem',
                                padding: '0.5rem 0.25rem',
                                scrollbarWidth: 'thin'
                            }}>
                                {VIDEO_LIBRARY.map((vid) => (
                                    <div
                                        key={vid.id}
                                        onClick={() => {
                                            setSelectedVideoUrl(vid.url);
                                            setVideoFile(null);
                                        }}
                                        style={{
                                            flex: '0 0 140px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            border: selectedVideoUrl === vid.url ? '3px solid #2563eb' : '2px solid transparent',
                                            background: '#000'
                                        }}
                                    >
                                        <video
                                            src={vid.url}
                                            muted
                                            loop
                                            playsInline
                                            onMouseOver={(e) => e.target.play()}
                                            onMouseOut={(e) => e.target.pause()}
                                            style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block', opacity: 0.8 }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'rgba(37, 99, 235, 0.8)',
                                            color: 'white',
                                            fontSize: '0.65rem',
                                            textAlign: 'center',
                                            padding: '2px 0'
                                        }}>
                                            {vid.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="hero-upload-options">
                    <div style={{
                        border: imageFile ? '2px solid #059669' : '2px dashed #e5e7eb',
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        background: imageFile ? '#ecfdf5' : 'transparent'
                    }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold', color: imageFile ? '#059669' : 'inherit' }}>
                            {imageFile ? '✓ My Custom Image' : '1. Or Upload New Image'}
                        </p>
                        <input
                            type="file"
                            onChange={(e) => {
                                setImageFile(e.target.files[0]);
                                setSelectedAssetUrl(''); // Clear preset if local file is chosen
                            }}
                            accept="image/*"
                            id="img-upload"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="img-upload" style={{ cursor: 'pointer', color: '#6b7280', fontSize: '0.85rem' }}>
                            {imageFile ? `Selected: ${imageFile.name}` : 'Select Local File...'}
                        </label>
                    </div>

                    <div style={{
                        border: videoFile ? '2px solid #2563eb' : '2px dashed #e5e7eb',
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        background: videoFile ? '#eff6ff' : 'transparent'
                    }}>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold', color: videoFile ? '#2563eb' : 'inherit' }}>
                            {videoFile ? '✓ My Custom Video' : '2. Or Upload New Video'}
                        </p>
                        <input
                            type="file"
                            onChange={(e) => {
                                setVideoFile(e.target.files[0]);
                                setSelectedVideoUrl(''); // Clear preset if local file is chosen
                            }}
                            accept="video/*"
                            id="vid-upload"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="vid-upload" style={{ cursor: 'pointer', color: '#6b7280', fontSize: '0.85rem' }}>
                            {videoFile ? `Selected: ${videoFile.name}` : 'Select Video Background...'}
                        </label>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleUpload}
                        disabled={uploading || (!imageFile && !selectedAssetUrl)}
                        style={{ padding: '0.75rem 2rem' }}
                    >
                        {uploading ? 'Processing...' : 'Publish to ' + selectedPage}
                    </button>
                    {(imageFile || selectedAssetUrl || videoFile || selectedVideoUrl) && (
                        <button
                            onClick={() => {
                                setImageFile(null);
                                setSelectedAssetUrl('');
                                setVideoFile(null);
                                setSelectedVideoUrl('');
                            }}
                            style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            Reset Selection
                        </button>
                    )}
                </div>
            </div>

            {/* Slides List */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Active Slides for {selectedPage} ({slides.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {slides.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#6b7280', background: '#f9fafb', borderRadius: '8px' }}>No hero content for this page yet.</p>}
                {slides.map(slide => (
                    <div key={slide.id} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative' }}>
                        <img src={slide.image_url} alt="Slide" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />

                        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px' }}>
                            <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                                Ord: {slide.sort_order}
                            </div>
                            {slide.video_url && (
                                <div style={{ background: '#2563eb', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Video size={12} /> VIDEO
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '1rem' }}>
                            <p style={{ color: 'green', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{slide.title}</p>
                            <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{slide.subtitle}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(slide)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        >
                            <Trash2 size={16} color="red" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeroManager;
