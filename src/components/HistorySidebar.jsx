import React from 'react';

export default function HistorySidebar({ history, onSelect, onClear, onDelete, onExport }) {
    if (!history || history.length === 0) return null;

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleDelete = (e, index) => {
        e.stopPropagation();
        if (onDelete) onDelete(index);
    };

    return (
        <div className="glass-panel fade-in" style={{
            padding: '1.5rem',
            marginBottom: '2rem',
            maxHeight: '500px',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>History</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {onExport && (
                        <button
                            onClick={onExport}
                            title="Export History"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                padding: '0.25rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                            Export
                        </button>
                    )}
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
                        Clear All
                    </button>
                </div>
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
                            transition: 'background 0.2s ease',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
                                {item.model}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                    {formatTime(item.timestamp)}
                                </span>
                                {onDelete && (
                                    <button
                                        onClick={(e) => handleDelete(e, index)}
                                        title="Delete"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            padding: '0.1rem 0.3rem',
                                            borderRadius: '4px',
                                            lineHeight: 1,
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#ef4444';
                                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        x
                                    </button>
                                )}
                            </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', opacity: 0.7 }}>
                            {item.userPrompt ? item.userPrompt.substring(0, 30) + (item.userPrompt.length > 30 ? '...' : '') : ''}
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
