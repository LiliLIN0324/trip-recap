
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 将文字描述转化为经纬度坐标和标准地名
 */
export async function geocodeLocation(locationName: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `分析以下地点名称，给出最准确的经纬度（lat, lng）和标准的完整地名。地点: "${locationName}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER },
            formattedName: { type: Type.STRING },
          },
          required: ["lat", "lng", "formattedName"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Geocoding failed:", error);
    // 默认回退（北京）
    return { lat: 39.9042, lng: 116.4074, formattedName: locationName };
  }
}

/**
 * 利用 Gemini Vision 智能分析照片内容
 */
export async function analyzeMemoryImage(base64Data: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data.split(',')[1] || base64Data,
            },
          },
          {
            text: `你是一个旅行博主和数字档案馆员。请分析这张照片：
            1. 识别可能的地点（城市、地标）。
            2. 根据光影、天气或细节推测日期。
            3. 选择活动类型：Travel, Food, Sport, Work, Leisure, Social, Nature。
            4. 创作一个优美的中文标题（10字以内）。
            5. 创作一段感性的中文描述（40字以内）。
            请以 JSON 格式返回结果。`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            locationName: { type: Type.STRING },
            date: { type: Type.STRING, description: "格式: YYYY-MM-DD" },
            activityType: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["locationName", "date", "activityType", "title", "description"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Vision analysis failed:", error);
    return null;
  }
}
