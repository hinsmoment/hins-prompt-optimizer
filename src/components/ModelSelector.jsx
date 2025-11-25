import React from "react";

const models = [
    { id: "nano-banana", name: "Nano Banana Pro", desc: "Gemini 3.0 Pro Image (Natural Language)" },
    { id: "jimeng", name: "Jimeng AI", desc: "SeeDream 4.0 (Chinese, <800 chars)" },
    { id: "midjourney", name: "Midjourney", desc: "V7 - Artistic & Photorealistic" },
];

export default function ModelSelector({ selectedModel, onSelect }) {
    return (
        <div className="model-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {models.map((model) => (
                <div
                    key={model.id}
                    onClick={() => onSelect(model.id)}
                    className={`glass-panel ${selectedModel === model.id ? "selected" : ""}`}
                    style={{
                        padding: "1.5rem",
                        cursor: "pointer",
                        border: selectedModel === model.id ? "1px solid var(--accent-primary)" : "var(--glass-border)",
                        background: selectedModel === model.id ? "rgba(139, 92, 246, 0.1)" : "var(--bg-glass)",
                        transition: "all 0.3s ease"
                    }}
                >
                    <h3 style={{ marginBottom: "0.5rem", color: selectedModel === model.id ? "var(--accent-primary)" : "var(--text-primary)" }}>{model.name}</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{model.desc}</p>
                </div>
            ))}
        </div>
    );
}
