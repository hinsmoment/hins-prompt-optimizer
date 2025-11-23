import { useState } from 'react';
import ModelSelector from './components/ModelSelector';
import AspectRatioSelector from './components/AspectRatioSelector';
import MidjourneyControls from './components/MidjourneyControls';
import PromptBuilder from './components/PromptBuilder';
import SettingsModal from './components/SettingsModal';
import { generatePrompt } from './services/gemini';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState('nano-banana');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [midjourneyParams, setMidjourneyParams] = useState({
    ar: '16:9',
    v: '6.0',
    s: '250',
    c: '0'
  });
  const [result, setResult] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [geminiModel, setGeminiModel] = useState(localStorage.getItem('gemini_model') || 'gemini-2.5-flash');
  const [error, setError] = useState('');

  const handleOptimize = async (userPrompt) => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsOptimizing(true);
    setError('');
    setResult('');

    try {
      const optimizedPrompt = await generatePrompt(
        apiKey,
        selectedModel,
        userPrompt,
        selectedModel === 'midjourney' ? midjourneyParams : { ar: aspectRatio },
        geminiModel
      );
      setResult(optimizedPrompt);
    } catch (err) {
      console.error(err);
      setError(`Error: ${err.message || 'Failed to generate prompt'}. Please check your API Key.`);
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="app-container">
      <header className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Prompt Optimizer
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Transform simple ideas into masterpiece prompts.
          </p>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem' }}
          title="Settings"
        >
          ⚙️
        </button>
      </header>

      <main className="fade-in" style={{ animationDelay: '0.1s' }}>
        <ModelSelector
          selectedModel={selectedModel}
          onSelect={setSelectedModel}
        />

        {selectedModel === 'midjourney' ? (
          <MidjourneyControls
            params={midjourneyParams}
            onChange={setMidjourneyParams}
          />
        ) : (
          <AspectRatioSelector
            value={aspectRatio}
            onChange={setAspectRatio}
          />
        )}

        <PromptBuilder
          onOptimize={handleOptimize}
          isOptimizing={isOptimizing}
        />

        {error && (
          <div className="glass-panel fade-in" style={{ marginTop: '2rem', padding: '1rem', borderLeft: '4px solid #ef4444', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        {result && (
          <div className="glass-panel fade-in" style={{ marginTop: '2rem', padding: '2rem', position: 'relative' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Optimized Result</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {result}
            </div>
            <button
              onClick={copyToClipboard}
              className="btn-primary"
              style={{ marginTop: '1rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(key, model) => {
          setApiKey(key);
          setGeminiModel(model);
        }}
      />
    </div>
  );
}

export default App;
