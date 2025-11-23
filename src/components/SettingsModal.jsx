import React, { useState, useEffect } from 'react';

export default function SettingsModal({ isOpen, onClose, onSave }) {
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState('gemini-2.5-flash');

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) setApiKey(storedKey);

        const storedModel = localStorage.getItem('gemini_model');
        if (storedModel) setModel(storedModel);
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        localStorage.setItem('gemini_model', model);
        onSave(apiKey, model);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="glass-panel fade-in" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Settings</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Gemini Model</label>
                    <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }}
                    >
                        <option value="gemini-3-pro-preview">Gemini 3 Pro Preview (Best Quality)</option>
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro (Balanced)</option>
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fastest)</option>
                    </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Gemini API Key</label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }}
                    />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Your key is stored locally in your browser.
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSave}>
                        Save Key
                    </button>
                </div>
            </div>
        </div>
    );
}
