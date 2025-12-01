import { GoogleGenAI, Type, Schema } from '@google/genai';
import { QuizConfig, QuizQuestion } from '../types';

// Initialize the client
// NOTE: process.env.API_KEY is automatically injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = 'gemini-2.5-flash';

// --- Chat Functionality ---

let chatSession = ai.chats.create({
  model: modelId,
  config: {
    systemInstruction: `Bạn là Cố vấn An toàn Số (Cyber Safety Advisor), một chuyên gia thân thiện, dễ hiểu dành cho mọi lứa tuổi (đặc biệt là học sinh, sinh viên).
    Nhiệm vụ của bạn là giải đáp thắc mắc về bảo mật, an toàn mạng, phòng tránh lừa đảo, và văn hóa ứng xử trên không gian mạng.
    Hãy dùng emoji 🛡️, 🔒, 💡 để làm sinh động cuộc trò chuyện.
    Trả lời ngắn gọn, súc tích, đi thẳng vào vấn đề.`,
  },
});

export const sendMessageStream = async function* (message: string) {
  try {
    const result = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const resetChatSession = () => {
  chatSession = ai.chats.create({
    model: modelId,
    config: {
      systemInstruction: `Bạn là Cố vấn An toàn Số. Hãy trả lời ngắn gọn, thân thiện.`,
    },
  });
};

// --- Quiz Functionality ---

const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: "Nội dung câu hỏi" },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Danh sách các lựa chọn trả lời" 
      },
      correctAnswerIndex: { type: Type.INTEGER, description: "Chỉ số của câu trả lời đúng (bắt đầu từ 0)" },
      explanation: { type: Type.STRING, description: "Giải thích ngắn gọn tại sao đáp án đó đúng" }
    },
    required: ["question", "options", "correctAnswerIndex", "explanation"]
  }
};

export const generateQuiz = async (config: QuizConfig): Promise<QuizQuestion[]> => {
  try {
    const typeDescription = config.type === 'multiple-choice' 
      ? 'Trắc nghiệm (4 lựa chọn)' 
      : 'Đúng/Sai (2 lựa chọn: Đúng, Sai)';
    
    const prompt = `Hãy tạo một bộ câu hỏi kiểm tra kiến thức về an toàn số.
    - Chủ đề: "${config.topic}" (nếu chủ đề trống, hãy chọn ngẫu nhiên các vấn đề an toàn mạng phổ biến).
    - Số lượng câu: ${config.count}.
    - Loại câu hỏi: ${typeDescription}.
    - Ngôn ngữ: Tiếng Việt.
    - Yêu cầu: Câu hỏi phải thực tế, mang tính giáo dục cao.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7, 
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data as QuizQuestion[];
    }
    throw new Error("No data returned from AI");

  } catch (error) {
    console.error("Quiz Generation Error:", error);
    throw error;
  }
};
