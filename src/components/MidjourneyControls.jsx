import React from 'react';

export default function MidjourneyControls({ params, onChange }) {
    const handleChange = (key, value) => {
        onChange({ ...params, [key]: value });
    };

    return (
        <div className="glass-panel fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-primary)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Midjourney Parameters</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Aspect Ratio (--ar)</label>
                    <select value={params.ar} onChange={(e) => handleChange('ar', e.target.value)}>
                        <option value="1:1">1:1 (Square)</option>
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                        <option value="4:3">4:3 (Photo)</option>
                        <option value="3:4">3:4 (Portrait Photo)</option>
                        <option value="21:9">21:9 (Cinematic)</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Version (--v)</label>
                    <select value={params.v} onChange={(e) => handleChange('v', e.target.value)}>
                        <option value="6.0">6.0 (Latest)</option>
                        <option value="5.2">5.2</option>
                        <option value="5.1">5.1</option>
                        <option value="niji 6">Niji 6 (Anime)</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Stylize (--s) {params.s}</label>
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={params.s}
                        onChange={(e) => handleChange('s', e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Chaos (--c) {params.c}</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={params.c}
                        onChange={(e) => handleChange('c', e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>

            </div>
        </div>
    );
}
