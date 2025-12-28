
import React, { useState, useRef, useMemo } from 'react';
import { analyzeFood } from '../services/geminiService';
import { MealLog } from '../types';

interface FoodLoggerProps {
  onAddMeal: (meal: MealLog) => void;
  history: MealLog[];
}

const FoodLogger: React.FC<FoodLoggerProps> = ({ onAddMeal, history }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCameraConsent, setShowCameraConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract unique food items from history for suggestions
  const uniqueHistoryItems = useMemo(() => {
    const itemsMap = new Map<string, MealLog>();
    // Sort by timestamp to get the most recent version of a food item
    [...history].sort((a, b) => b.timestamp - a.timestamp).forEach(item => {
      const key = item.foodName.toLowerCase().trim();
      if (!itemsMap.has(key)) {
        itemsMap.set(key, item);
      }
    });
    return Array.from(itemsMap.values());
  }, [history]);

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!inputText.trim()) return [];
    const search = inputText.toLowerCase().trim();
    return uniqueHistoryItems
      .filter(item => item.foodName.toLowerCase().includes(search))
      .slice(0, 5);
  }, [inputText, uniqueHistoryItems]);

  const handleQuickAdd = (item: MealLog) => {
    const newMeal: MealLog = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      // We don't reuse the old image URL for today's log for clarity
      imageUrl: undefined 
    };
    onAddMeal(newMeal);
    setInputText('');
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const nutrition = await analyzeFood(inputText);
      const newMeal: MealLog = {
        ...nutrition,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      onAddMeal(newMeal);
      setInputText('');
    } catch (err) {
      setError("分析失敗，請描述得更詳細一點。");
    } finally {
      setLoading(false);
    }
  };

  const handleConsentConfirm = () => {
    setShowCameraConsent(false);
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const imageUrl = reader.result as string;
        
        try {
          const nutrition = await analyzeFood({
            data: base64String,
            mimeType: file.type
          });
          
          const newMeal: MealLog = {
            ...nutrition,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            imageUrl: imageUrl
          };
          onAddMeal(newMeal);
        } catch (err) {
          setError("無法辨識圖片中的食物內容。");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("處理圖片時發生錯誤。");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <i className="fas fa-utensils text-emerald-500"></i>
        記錄飲食
      </h2>

      <div className="space-y-4 relative">
        <form onSubmit={handleTextSubmit} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="搜尋歷史紀錄或輸入新餐點..."
            disabled={loading}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-12 text-slate-700"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-700 disabled:opacity-30 p-2"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          </button>
        </form>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && !loading && (
          <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-slate-50 bg-slate-50/50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                <i className="fas fa-clock-rotate-left mr-1"></i> 歷史紀錄建議
              </span>
            </div>
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => handleQuickAdd(item)}
                className="w-full text-left px-4 py-3 hover:bg-emerald-50 flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
              >
                <div>
                  <div className="font-bold text-slate-700 text-sm">{item.foodName}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{item.servingSize} • {item.calories} kcal</div>
                </div>
                <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-plus-circle"></i>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="h-px bg-slate-100 flex-1"></div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">或</span>
          <div className="h-px bg-slate-100 flex-1"></div>
        </div>

        <button
          type="button"
          onClick={() => setShowCameraConsent(true)}
          disabled={loading}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-emerald-200 transition-all text-slate-500 hover:text-emerald-600"
        >
          <i className="fas fa-camera text-2xl"></i>
          <span className="text-sm font-medium">拍照或上傳食物照片</span>
        </button>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 text-emerald-600 py-2">
            <i className="fas fa-spinner fa-spin"></i>
            <span className="text-sm font-medium animate-pulse">Gemini 正在分析您的食物...</span>
          </div>
        )}
      </div>

      {/* Quick History Bar (Last 3 unique items) */}
      {!loading && inputText === '' && uniqueHistoryItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">最近常吃</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {uniqueHistoryItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => handleQuickAdd(item)}
                className="bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-slate-100 hover:border-emerald-100 flex items-center gap-2"
              >
                <i className="fas fa-plus text-[10px] opacity-40"></i>
                {item.foodName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Camera Consent Modal */}
      {showCameraConsent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-2 text-2xl">
                <i className="fas fa-camera"></i>
              </div>
              <h3 className="text-xl font-black text-slate-800">開啟相機功能</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                AI 卡路里大師需要存取您的相機或相簿，以便拍攝食物照片並利用 Gemini AI 進行精確的營養分析。
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={handleConsentConfirm}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
                >
                  確認並開啟
                </button>
                <button
                  onClick={() => setShowCameraConsent(false)}
                  className="w-full py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-[0.98]"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodLogger;
