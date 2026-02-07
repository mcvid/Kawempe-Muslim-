// User preferences storage utility for e-learning platform
// Handles localStorage and database sync for user profiles and settings

export interface UserProfile {
    username: string;
    avatarUrl?: string | null;
    avatarType: 'upload' | 'initials' | 'preset';
    avatarColor?: string; // For initials-based avatars
}

export interface VideoSettings {
    brightness: number; // -100 to +100
    contrast: number; // 0 to 200
    saturation: number; // 0 to 200
    backgroundBlur: boolean;
    blurIntensity: 'low' | 'medium' | 'high';
    virtualBackground?: string; // URL to background image
}

export interface AudioSettings {
    noiseSuppress: boolean;
    echoCancellation: boolean;
}

export interface UserPreferences {
    profile: UserProfile;
    video: VideoSettings;
    audio: AudioSettings;
}

const STORAGE_KEY = 'kawempe_elearning_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
    profile: {
        username: '',
        avatarType: 'initials',
        avatarColor: '#1a73e8'
    },
    video: {
        brightness: 0,
        contrast: 100,
        saturation: 100,
        backgroundBlur: false,
        blurIntensity: 'medium'
    },
    audio: {
        noiseSuppress: false,
        echoCancellation: true
    }
};

/**
 * Load user preferences from localStorage
 */
export function loadPreferences(): UserPreferences {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge with defaults to handle missing fields
            return {
                ...DEFAULT_PREFERENCES,
                ...parsed,
                profile: { ...DEFAULT_PREFERENCES.profile, ...parsed.profile },
                video: { ...DEFAULT_PREFERENCES.video, ...parsed.video },
                audio: { ...DEFAULT_PREFERENCES.audio, ...parsed.audio }
            };
        }
    } catch (error) {
        console.error('Failed to load preferences:', error);
    }
    return DEFAULT_PREFERENCES;
}

/**
 * Save user preferences to localStorage
 */
export function savePreferences(preferences: Partial<UserPreferences>): void {
    try {
        const current = loadPreferences();
        const updated = {
            profile: { ...current.profile, ...(preferences.profile || {}) },
            video: { ...current.video, ...(preferences.video || {}) },
            audio: { ...current.audio, ...(preferences.audio || {}) }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error('Failed to save preferences:', error);
    }
}

/**
 * Save user profile (convenience method)
 */
export function saveProfile(profile: Partial<UserProfile>): void {
    const current = loadPreferences();
    savePreferences({ profile: { ...current.profile, ...profile } });
}

/**
 * Get user profile
 */
export function getProfile(): UserProfile {
    return loadPreferences().profile;
}

/**
 * Save video settings
 */
export function saveVideoSettings(settings: Partial<VideoSettings>): void {
    const current = loadPreferences();
    savePreferences({ video: { ...current.video, ...settings } });
}

/**
 * Get video settings
 */
export function getVideoSettings(): VideoSettings {
    return loadPreferences().video;
}

/**
 * Save audio settings
 */
export function saveAudioSettings(settings: Partial<AudioSettings>): void {
    const current = loadPreferences();
    savePreferences({ audio: { ...current.audio, ...settings } });
}

/**
 * Get audio settings
 */
export function getAudioSettings(): AudioSettings {
    return loadPreferences().audio;
}

/**
 * Clear all preferences (useful for logout)
 */
export function clearPreferences(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear preferences:', error);
    }
}

/**
 * Generate avatar URL from initials
 */
export function generateInitialsAvatar(username: string, color: string = '#1a73e8'): string {
    if (!username) return '';
    
    // This returns a data URL for a simple colored circle with initials
    // In a real app, you might use a service like ui-avatars.com or generate a Canvas image
    const initials = username.charAt(0).toUpperCase();
    
    // Using ui-avatars.com service (free, no API key required)
    const encodedColor = encodeURIComponent(color.replace('#', ''));
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=${encodedColor}&color=fff&size=128&bold=true`;
}
