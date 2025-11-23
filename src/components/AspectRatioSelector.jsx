import React from 'react';

export default function AspectRatioSelector({ value, onChange }) {
    const ratios = [
        { id: '1:1', label: '1:1 (Square)' },
        { id: '16:9', label: '16:9 (Landscape)' },
        { id: '9:16', label: '9:16 (Portrait)' },
        { id: '4:3', label: '4:3 (Photo)' },
        { id: '3:4', label: '3:4 (Portrait Photo)' },
        { id: '21:9', label: '21:9 (Cinematic)' }
    ];

    return (
        <div className="glass-panel fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
                Aspect Ratio
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                {ratios.map((ratio) => (
                    <button
                        key={ratio.id}
                        onClick={() => onChange(ratio.id)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: value === ratio.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            background: value === ratio.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(0,0,0,0.2)',
                            color: value === ratio.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {ratio.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
