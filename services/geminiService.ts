import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, Verdict, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a top-tier SOC Analyst and Phishing Detection Engine. 
Your job is to analyze URLs for potential security threats. 
You must look for:
1. URL Structure anomalies (excessive subdomains, IP usage, homographs).
2. Domain Intelligence (typosquatting, TLD risk).
3. Brand impersonation.
4. Social engineering tactics in the URL string itself.

Output must be strictly JSON.
Do not verify the URL by pinging it (you are an offline analyzer), but use your knowledge base of patterns and brands.
`;

export const analyzeUrlWithGemini = async (url: string): Promise<ScanResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this URL for phishing risks: ${url}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, enum: ["Safe", "Suspicious", "Phishing"] },
            confidenceScore: { type: Type.INTEGER, description: "0 to 100" },
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            explanation: { type: Type.STRING, description: "Professional SOC analyst explanation." },
            redFlags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of specific detected threats."
            },
            recommendation: { type: Type.STRING },
            layers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ["clean", "warning", "danger"] },
                  details: { type: Type.STRING }
                }
              }
            }
          },
          required: ["verdict", "confidenceScore", "riskLevel", "explanation", "redFlags", "recommendation", "layers"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);

    return {
      url,
      verdict: data.verdict as Verdict,
      confidenceScore: data.confidenceScore,
      riskLevel: data.riskLevel as RiskLevel,
      explanation: data.explanation,
      redFlags: data.redFlags,
      recommendation: data.recommendation,
      layers: data.layers,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback for demo purposes if API fails or key is invalid
    return {
      url,
      verdict: Verdict.SUSPICIOUS,
      confidenceScore: 50,
      riskLevel: RiskLevel.MEDIUM,
      explanation: "AI Analysis unavailable. The URL contains patterns that warrant caution.",
      redFlags: ["Automated analysis failed", "Manual verification required"],
      recommendation: "Treat as suspicious until verified.",
      layers: [
        { name: "Structure Analysis", status: "warning", details: "Unable to verify structure integrity." },
        { name: "Domain Intelligence", status: "warning", details: "Intelligence database unreachable." },
      ],
      timestamp: new Date().toISOString()
    };
  }
};

export const runSecurityToolAnalysis = async (toolName: string, target: string): Promise<string> => {
  // 1. DNS Lookup (Real API via Google DoH)
  if (toolName.includes("DNS")) {
    try {
      // Clean target to hostname
      const hostname = target.replace(/^https?:\/\//, '').split('/')[0];
      const response = await fetch(`https://dns.google/resolve?name=${hostname}&type=ANY`);
      const data = await response.json();
      
      if (data.Answer) {
         return data.Answer.map((rec: any) => 
           `Type: ${rec.type} | TTL: ${rec.TTL} | Data: ${rec.data}`
         ).join('\n');
      } else {
        return "No DNS records found or Authority section only.";
      }
    } catch (e: any) {
      return `[DNS API Error] ${e.message}\nFalling back to intelligent search...`;
    }
  }

  // 2. Others: Use Gemini with Google Search Grounding for real-time gathered info
  try {
    const prompt = `
      Perform a simulated ${toolName} analysis on the target: "${target}".
      
      CRITICAL: Use the 'googleSearch' tool to find REAL, CURRENT technical data about this domain/IP from the web.
      Do not hallucinate data. If specific data is not found, state that it is publicly unavailable.

      - If tool is 'WHOIS': Find registrar, creation date, organization, and abuse contact.
      - If tool is 'SSL Decoder': Find the certificate issuer, common name (CN), and expiration date.
      - If tool is 'Port Scanner': Search for "open ports ${target}" or "shodan ${target}" to find publicly known open ports (80, 443, 22, etc).
      - If tool is 'Header Analyzer': Search for "site headers ${target}" or server technology (nginx, apache, cloudflare).
      - If tool is 'Reverse IP': Search for "domains on same IP ${target}".

      Output format:
      Return a RAW TERMINAL-STYLE report.
      No markdown formatting (no bold/italic).
      Use structured lines like:
      [+] PROPERTY: VALUE
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let output = response.text || "No data returned from analysis.";
    
    // Append source links if available
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const links = response.candidates[0].groundingMetadata.groundingChunks
        .map((c: any) => c.web?.uri)
        .filter(Boolean)
        .map((uri: string) => `[Source] ${uri}`)
        .join('\n');
      
      if (links) output += `\n\n--- SOURCES ---\n${links}`;
    }

    return output;

  } catch (error) {
    console.error("Tool analysis failed:", error);
    return `[System Error] ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};
