import React, { useState } from 'react';

export default function ResultDisplay({ result, onTranslate }) {
    const [copied, setCopied] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    // Handle both legacy string format and new object format
    const promptText = typeof result === 'string' ? result : result.prompt;
    const translationText = typeof result === 'object' ? result.translation : null;

    const handleCopy = () => {
        navigator.clipboard.writeText(promptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTranslateClick = async () => {
        setIsTranslating(true);
        await onTranslate();
        setIsTranslating(false);
    };

    return (
        <div className="glass-panel fade-in" style={{ marginTop: '2rem', padding: '2rem', position: 'relative' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Optimized Result</h3>

            <div style={{ display: 'grid', gridTemplateColumns: translationText ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
                <div>
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Prompt (English)
                    </div>
                    <div style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'monospace',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                        height: '100%',
                        minHeight: '150px'
                    }}>
                        {promptText}
                    </div>
                </div>

                {translationText ? (
                    <div>
                        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Translation / Analysis (Chinese)
                        </div>
                        <div style={{
                            background: 'rgba(0,0,0,0.3)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            fontFamily: 'sans-serif',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            height: '100%',
                            color: '#e2e8f0'
                        }}>
                            {translationText}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button
                            onClick={handleTranslateClick}
                            disabled={isTranslating}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '1rem 2rem',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isTranslating ? (
                                <>
                                    <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                                    Translating...
                                </>
                            ) : (
                                <>
                                    🌐 Translate to Chinese
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={handleCopy}
                className="btn-primary"
                style={{
                    marginTop: '1.5rem',
                    fontSize: '0.9rem',
                    padding: '0.5rem 1rem',
                    background: copied ? '#10b981' : undefined, // Green when copied
                    transition: 'all 0.3s ease'
                }}
            >
                {copied ? '✓ Copied!' : 'Copy Prompt to Clipboard'}
            </button>
        </div>
    );
}
