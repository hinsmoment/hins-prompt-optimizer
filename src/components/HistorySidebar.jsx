import React from 'react';

export default function HistorySidebar({ history, onSelect, onClear }) {
    if (!history || history.length === 0) return null;

    return (
        <div className="glass-panel fade-in" style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            maxHeight: '400px',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>History</h3>
                <button
                    onClick={onClear}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    Clear
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {history.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(item)}
                        style={{
                            padding: '0.75rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--accent-primary)' }}>
                            {item.model}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {typeof item.result === 'string' ? item.result : item.result.prompt}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
