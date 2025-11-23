import React, { useState } from 'react';

export default function PromptBuilder({ onOptimize, isOptimizing }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onOptimize(input);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                    Describe your idea
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., A futuristic city with flying cars at sunset..."
                    rows={4}
                    style={{ marginBottom: '1.5rem', resize: 'vertical', minHeight: '100px' }}
                />
                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                    disabled={!input.trim() || isOptimizing}
                >
                    {isOptimizing ? (
                        <>
                            <span className="spinner"></span> Optimizing...
                        </>
                    ) : (
                        '✨ Magic Optimize'
                    )}
                </button>
            </form>
            <style>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
