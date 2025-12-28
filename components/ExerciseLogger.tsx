
import React, { useState } from 'react';
import { analyzeExercise } from '../services/geminiService';
import { ExerciseLog } from '../types';

interface ExerciseLoggerProps {
  onAddExercise: (exercise: ExerciseLog) => void;
}

const ExerciseLogger: React.FC<ExerciseLoggerProps> = ({ onAddExercise }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await analyzeExercise(inputText);
      const newExercise: ExerciseLog = {
        ...data,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      onAddExercise(newExercise);
      setInputText('');
    } catch (err) {
      setError("無法辨識運動內容，請試著寫得更具體（如：跑步30分鐘）。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <i className="fas fa-person-running text-blue-500"></i>
        記錄運動
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="例如：慢跑 40 分鐘、游泳 1 小時"
            disabled={loading}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12 text-slate-700"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:opacity-30 p-2"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-plus-circle"></i>}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        {loading && (
          <p className="text-center text-xs text-blue-500 animate-pulse font-medium">正在估算運動消耗...</p>
        )}
      </form>
    </div>
  );
};

export default ExerciseLogger;
