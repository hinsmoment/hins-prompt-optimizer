import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ResultDisplay({ result, onTranslate, targetLanguage = 'Chinese' }) {
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

    const markdownStyles = {
        container: {
            background: 'rgba(0,0,0,0.3)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            lineHeight: '1.6',
            height: '100%',
            minHeight: '150px',
            textAlign: 'left',
            overflow: 'auto'
        }
    };

    return (
        <div className="glass-panel fade-in" style={{ marginTop: '2rem', padding: '2rem', position: 'relative' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Optimized Result</h3>

            <div style={{ display: 'grid', gridTemplateColumns: translationText ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
                <div>
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Prompt ({targetLanguage === 'English' ? 'Chinese' : 'English'})
                    </div>
                    <div style={{
                        ...markdownStyles.container,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {promptText}
                    </div>
                </div>

                {translationText ? (
                    <div>
                        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Translation / Analysis ({targetLanguage})
                        </div>
                        <div style={markdownStyles.container} className="markdown-content">
                            <ReactMarkdown
                                components={{
                                    h1: ({node, ...props}) => <h1 style={{fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)'}} {...props} />,
                                    h2: ({node, ...props}) => <h2 style={{fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--accent-primary)'}} {...props} />,
                                    h3: ({node, ...props}) => <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-primary)'}} {...props} />,
                                    p: ({node, ...props}) => <p style={{marginBottom: '0.75rem'}} {...props} />,
                                    ul: ({node, ...props}) => <ul style={{marginBottom: '0.75rem', paddingLeft: '1.5rem'}} {...props} />,
                                    ol: ({node, ...props}) => <ol style={{marginBottom: '0.75rem', paddingLeft: '1.5rem'}} {...props} />,
                                    li: ({node, ...props}) => <li style={{marginBottom: '0.25rem'}} {...props} />,
                                    code: ({node, inline, ...props}) => 
                                        inline 
                                            ? <code style={{background: 'rgba(139, 92, 246, 0.2)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontSize: '0.9em'}} {...props} />
                                            : <code style={{display: 'block', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', overflow: 'auto', marginBottom: '0.75rem'}} {...props} />,
                                    pre: ({node, ...props}) => <pre style={{marginBottom: '0.75rem'}} {...props} />,
                                    blockquote: ({node, ...props}) => <blockquote style={{borderLeft: '3px solid var(--accent-primary)', paddingLeft: '1rem', marginBottom: '0.75rem', color: 'var(--text-secondary)'}} {...props} />,
                                    strong: ({node, ...props}) => <strong style={{color: 'var(--accent-primary)'}} {...props} />,
                                    a: ({node, ...props}) => <a style={{color: 'var(--accent-primary)', textDecoration: 'underline'}} {...props} />
                                }}
                            >
                                {translationText}
                            </ReactMarkdown>
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
                                    <span className="spinner"></span>
                                    Translating...
                                </>
                            ) : (
                                <>
                                    Translate to {targetLanguage}
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
                    background: copied ? '#10b981' : undefined,
                    transition: 'all 0.3s ease'
                }}
            >
                {copied ? 'Copied!' : 'Copy Prompt to Clipboard'}
            </button>
        </div>
    );
}
