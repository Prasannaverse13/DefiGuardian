import { apiRequest } from "./queryClient";

const apiKey = import.meta.env.VITE_NVIDIA_API_KEY;


export async function analyzeVulnerabilities(contractCode: string): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/analyze", {
      contractSource: contractCode
    });
    const data = await response.json();
    return data.analysis || '[ANALYSIS_ERROR]: No response generated';
  } catch (error: any) {
    console.error("[AI_SYSTEM_ERROR]:", error);
    return `[CRITICAL_FAILURE]: Analysis systems offline - ${error.message}`;
  }
}

export async function chatWithAI(message: string, context: string[]): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/chat", {
      message,
      context
    });
    const data = await response.json();
    return data.response || '[SYSTEM_ERROR]: No response generated';
  } catch (error: any) {
    console.error("[AI_CHAT_ERROR]:", error);
    return `[SYSTEM_ERROR]: Neural link failure - ${error.message}`;
  }
}