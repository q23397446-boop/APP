
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const nutritionSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING, description: "辨識出的食物中文名稱" },
    calories: { type: Type.NUMBER, description: "估算的總卡路里 (kcal)" },
    protein: { type: Type.NUMBER, description: "估算的總蛋白質 (克)" },
    fat: { type: Type.NUMBER, description: "估算的總脂肪 (克)" },
    carbs: { type: Type.NUMBER, description: "估算的總碳水化合物 (克)" },
    servingSize: { type: Type.STRING, description: "估算的份量 (例如：'一碗'、'250克')" },
  },
  required: ["foodName", "calories", "protein", "fat", "carbs", "servingSize"],
};

const exerciseSchema = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, description: "運動類型名稱 (中文)" },
    duration: { type: Type.NUMBER, description: "預估運動時長 (分鐘)" },
    caloriesBurned: { type: Type.NUMBER, description: "預估消耗熱量 (kcal)" },
  },
  required: ["type", "duration", "caloriesBurned"],
};

const recommendationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "食物或料理名稱" },
      reason: { type: Type.STRING, description: "為什麼推薦這個（針對營養缺口的解釋）" },
      keyNutrient: { type: Type.STRING, description: "主要的營養強項（如：高蛋白、低碳水）" },
      estimatedCals: { type: Type.NUMBER, description: "預估熱量" },
    },
    required: ["title", "reason", "keyNutrient", "estimatedCals"],
  }
};

export const analyzeFood = async (input: string | { data: string; mimeType: string }): Promise<NutritionData> => {
  const model = "gemini-3-flash-preview";
  const prompt = "你是一位專業的營養師。請分析以下食物描述或圖片，並提供準確的營養成分估算。請保持精確且符合實際。如果有多個品項，請合計數值。請務必使用『中文』回答食物名稱。";

  const contents = typeof input === 'string' 
    ? prompt + "\n食物描述: " + input
    : {
        parts: [
          { text: prompt },
          { inlineData: input }
        ]
      };

  const response = await ai.models.generateContent({
    model,
    contents: typeof contents === 'string' ? contents : [contents],
    config: {
      responseMimeType: "application/json",
      responseSchema: nutritionSchema,
    },
  });

  return JSON.parse(response.text || "{}") as NutritionData;
};

export const analyzeExercise = async (input: string): Promise<{ type: string; duration: number; caloriesBurned: number }> => {
  const model = "gemini-3-flash-preview";
  const prompt = "你是一位健身教練。請分析以下運動描述，並估算運動類型、時間（分鐘）與消耗熱量（kcal）。例如：'慢跑30分鐘'。請回傳 JSON 格式。";

  const response = await ai.models.generateContent({
    model,
    contents: prompt + "\n描述: " + input,
    config: {
      responseMimeType: "application/json",
      responseSchema: exerciseSchema,
    },
  });

  return JSON.parse(response.text || "{}");
};

export const getNutritionRecommendations = async (remaining: { protein: number, carbs: number, fat: number, calories: number }): Promise<any[]> => {
  const model = "gemini-3-flash-preview";
  const prompt = `你是一位專業的個人飲食導師。目前使用者今天的剩餘營養配額為：
  - 蛋白質：${remaining.protein}g
  - 碳水化合物：${remaining.carbs}g
  - 脂肪：${remaining.fat}g
  - 剩餘總熱量：${remaining.calories}kcal
  
  請根據這些缺口，推薦 3-4 種適合的單一食材或簡單料理建議。
  如果某個營養素剩餘很多，請推薦該營養素豐富的食物；如果某個營養素已經快超標，請推薦極低該成分的食物。
  請以繁體中文回答。`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to get recommendations", e);
    return [];
  }
};
