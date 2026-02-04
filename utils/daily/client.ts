import DailyIframe, { DailyCall } from '@daily-co/daily-js';

export interface DailyMeetingState {
    isJoining: boolean;
    isConnected: boolean;
    error: string | null;
}

/**
 * Daily.co Client Manager
 * Handles the lifecycle of a video call
 */
export class DailyManager {
    private callFrame: DailyCall | null = null;
    private container: HTMLElement | null = null;

    constructor(container?: HTMLElement) {
        if (container) {
            this.container = container;
        }
    }

    /**
     * Initialize the Daily call frame
     */
    async join(url: string, options: {
        userName: string;
        audioSource?: boolean;
        videoSource?: boolean;
    }) {
        try {
            if (this.callFrame) {
                await this.leave();
            }

            // Create the call frame
            this.callFrame = DailyIframe.createCallObject({
                audioSource: options.audioSource ?? true,
                videoSource: options.videoSource ?? true,
            });

            // Join the room
            await this.callFrame.join({
                url,
                userName: options.userName,
            });

            return this.callFrame;
        } catch (error) {
            console.error('Failed to join Daily meeting:', error);
            throw error;
        }
    }

    /**
     * Leave the current meeting
     */
    async leave() {
        if (this.callFrame) {
            await this.callFrame.leave();
            await this.callFrame.destroy();
            this.callFrame = null;
        }
    }

    /**
     * Toggle camera state
     */
    setLocalVideo(enabled: boolean) {
        if (this.callFrame) {
            this.callFrame.setLocalVideo(enabled);
        }
    }

    /**
     * Toggle microphone state
     */
    setLocalAudio(enabled: boolean) {
        if (this.callFrame) {
            this.callFrame.setLocalAudio(enabled);
        }
    }

    /**
     * Start screen sharing
     */
    startScreenShare() {
        if (this.callFrame) {
            this.callFrame.startScreenShare();
        }
    }

    /**
     * Stop screen sharing
     */
    stopScreenShare() {
        if (this.callFrame) {
            this.callFrame.stopScreenShare();
        }
    }

    /**
     * Get the current call object
     */
    getCallFrame() {
        return this.callFrame;
    }
}

// Singleton instance for global use
let dailyManagerInstance: DailyManager | null = null;

export const getDailyManager = (container?: HTMLElement) => {
    if (!dailyManagerInstance) {
        dailyManagerInstance = new DailyManager(container);
    }
    return dailyManagerInstance;
};
