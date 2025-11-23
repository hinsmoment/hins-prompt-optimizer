import { useState, useEffect } from 'react';
import ModelSelector from './components/ModelSelector';
import AspectRatioSelector from './components/AspectRatioSelector';
import MidjourneyControls from './components/MidjourneyControls';
import PromptBuilder from './components/PromptBuilder';
import SettingsModal from './components/SettingsModal';
import ResultDisplay from './components/ResultDisplay';
import HistorySidebar from './components/HistorySidebar';
import { generatePrompt, translateText } from './services/gemini';
import { generatePromptOpenAI } from './services/openai';
import { MODEL_NANO, MODEL_JIMENG, MODEL_MIDJOURNEY } from './constants';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState(MODEL_NANO);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [midjourneyParams, setMidjourneyParams] = useState({
    ar: '16:9',
    v: '6.0',
    s: '250',
    c: '0'
  });
  const [result, setResult] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [geminiModel, setGeminiModel] = useState(() => localStorage.getItem('gemini_model') || 'gemini-2.0-flash-exp');

  // New state for OpenAI Compatible
  const [apiProvider, setApiProvider] = useState(() => localStorage.getItem('api_provider') || 'gemini');
  const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem('openai_base_url') || 'https://api.openai.com/v1');
  const [openAiKey, setOpenAiKey] = useState(() => localStorage.getItem('openai_key') || '');
  const [openAiModel, setOpenAiModel] = useState(() => localStorage.getItem('openai_model') || 'gpt-3.5-turbo');

  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('prompt_history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem('prompt_history', JSON.stringify(newHistory));
  };

  const handleOptimize = async (userPrompt) => {
    if (apiProvider === 'gemini' && !apiKey) {
      setError("Please set your Gemini API Key in settings.");
      setIsSettingsOpen(true);
      return;
    }
    if (apiProvider === 'openai' && !openAiKey) {
      setError("Please set your OpenAI API Key in settings.");
      setIsSettingsOpen(true);
      return;
    }

    setIsOptimizing(true);
    setError('');
    setResult(null);

    try {
      let optimizedPrompt;
      const modelParams = selectedModel === MODEL_MIDJOURNEY ? midjourneyParams : { ar: aspectRatio };

      if (apiProvider === 'gemini') {
        optimizedPrompt = await generatePrompt(
          apiKey,
          selectedModel,
          userPrompt,
          modelParams,
          geminiModel
        );
      } else { // OpenAI Compatible Service
        let effectiveBaseUrl = baseUrl;
        // Simple heuristic: if localhost and target is modelscope, use proxy
        // Note: The proxy path in vite.config.js is /api/proxy -> https://api-inference.modelscope.cn
        // So we need to replace the base part.
        // This is a bit hacky for a static app, but works for local dev.
        // For production, user needs a real proxy or CORS support.
        if (baseUrl.includes('modelscope.cn') && window.location.hostname === 'localhost') {
          effectiveBaseUrl = '/api/proxy' + baseUrl.replace('https://api-inference.modelscope.cn', '');
        }

        optimizedPrompt = await generatePromptOpenAI(
          openAiKey,
          effectiveBaseUrl,
          openAiModel,
          selectedModel,
          userPrompt,
          modelParams
        );
      }

      const resultObj = {
        prompt: optimizedPrompt,
        translation: null
      };

      setResult(resultObj);

      // Add to history
      const newHistoryItem = {
        model: selectedModel,
        userPrompt,
        result: resultObj,
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10); // Keep last 10
      saveHistory(updatedHistory);

    } catch (err) {
      console.error(err);
      setError(`Error: ${err.message || 'Failed to generate prompt'}. Please check your API Key and Base URL.`);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleTranslate = async () => {
    if (!result || !result.prompt || !apiKey) return; // Translation currently only uses Gemini API

    try {
      const translation = await translateText(apiKey, result.prompt, geminiModel);

      const updatedResult = { ...result, translation };
      setResult(updatedResult);

      // Update history
      const updatedHistory = history.map(item => {
        if (item.result.prompt === result.prompt) {
          return { ...item, result: updatedResult };
        }
        return item;
      });
      saveHistory(updatedHistory);

    } catch (err) {
      console.error("Translation failed", err);
      setError("Translation failed. Please try again. (Translation uses Gemini API)");
    }
  };

  const handleHistorySelect = (item) => {
    setSelectedModel(item.model);
    // Handle legacy history format (string) vs new format (object)
    if (typeof item.result === 'string') {
      setResult({ prompt: item.result, translation: null });
    } else {
      setResult(item.result);
    }
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  return (
    <div className="app-container" style={{ display: 'flex', gap: '2rem', maxWidth: '1400px' }}>
      {/* Sidebar for History */}
      <div style={{ width: '250px', flexShrink: 0, display: history.length > 0 ? 'block' : 'none' }}>
        <HistorySidebar
          history={history}
          onSelect={handleHistorySelect}
          onClear={handleClearHistory}
        />
      </div>

      <div style={{ flex: 1 }}>
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

          {selectedModel === MODEL_MIDJOURNEY ? (
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
            <ResultDisplay
              result={result}
              onTranslate={handleTranslate}
            />
          )}
        </main>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        geminiModel={geminiModel}
        initialProvider={apiProvider}
        initialBaseUrl={baseUrl}
        initialOpenAiKey={openAiKey}
        initialOpenAiModel={openAiModel}
        onSave={(settings) => {
          setApiKey(settings.apiKey);
          setGeminiModel(settings.geminiModel);
          setApiProvider(settings.provider);
          setBaseUrl(settings.baseUrl);
          setOpenAiKey(settings.openAiKey);
          setOpenAiModel(settings.openAiModel);

          localStorage.setItem('gemini_api_key', settings.apiKey);
          localStorage.setItem('gemini_model', settings.geminiModel);
          localStorage.setItem('api_provider', settings.provider);
          localStorage.setItem('openai_base_url', settings.baseUrl);
          localStorage.setItem('openai_key', settings.openAiKey);
          localStorage.setItem('openai_model', settings.openAiModel);
        }}
      />
    </div>
  );
}

export default App;
