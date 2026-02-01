"use client";

import React, { useRef, useState, useEffect } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/markers-plugin/index.css';

interface Hotspot {
    id: string;
    yaw: number;
    pitch: number;
    title: string;
    target_stop_id?: string;
    description?: string;
}

interface VirtualTourViewerProps {
    imageUrl: string;
    initialYaw?: number;
    initialPitch?: number;
    hotspots?: Hotspot[];
    onHotspotClick?: (hotspot: Hotspot) => void;
    onReady?: (instance: any) => void;
}

const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
    imageUrl,
    initialYaw = 0,
    initialPitch = 0,
    hotspots = [],
    onHotspotClick,
    onReady
}) => {
    const psvRef = useRef<any>(null);
    const [viewerInstance, setViewerInstance] = useState<any>(null);

    const handleReady = (instance: any) => {
        psvRef.current = instance;
        setViewerInstance(instance);

        const markersPlugin = instance.getPlugin(MarkersPlugin);
        if (markersPlugin) {
            markersPlugin.addEventListener('select-marker', ({ marker }: any) => {
                if (onHotspotClick && marker.data) {
                    onHotspotClick(marker.data);
                }
            });
        }

        if (onReady) onReady(instance);
    };

    // Update markers when hotspots change
    useEffect(() => {
        if (viewerInstance && hotspots) {
            const markersPlugin = viewerInstance.getPlugin(MarkersPlugin);
            if (markersPlugin) {
                markersPlugin.clearMarkers();
                hotspots.forEach(h => {
                    markersPlugin.addMarker({
                        id: h.id,
                        position: { yaw: h.yaw, pitch: h.pitch },
                        image: 'https://photo-sphere-viewer.js.org/assets/pin-red.png',
                        size: { width: 32, height: 32 },
                        tooltip: h.title,
                        anchor: 'bottom center',
                        data: h // Pass full hotspot object
                    });
                });
            }
        }
    }, [viewerInstance, hotspots]);

    if (!imageUrl) return (
        <div className="w-full h-full bg-black flex items-center justify-center">
            <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Initializing Lens...</p>
        </div>
    );

    return (
        <div className="w-full h-full relative">
            <ReactPhotoSphereViewer
                src={imageUrl}
                height={'100%'}
                width={"100%"}
                defaultYaw={initialYaw}
                defaultPitch={initialPitch}
                onReady={handleReady}
                plugins={[
                    [MarkersPlugin, {}]
                ]}
                navbar={[
                    'zoom',
                    'move',
                    'caption',
                    'fullscreen'
                ]}
            />
        </div>
    );
};

export default VirtualTourViewer;
