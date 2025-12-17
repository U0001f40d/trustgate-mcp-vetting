
import { GoogleGenAI } from "@google/genai";
import { SecurityReport, TechnicalDeepDiveData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMCPServer = async (name: string, url: string): Promise<SecurityReport> => {
  const model = "gemini-3-pro-preview";

  const prompt = `
    You are TrustGate, an elite enterprise security auditor. 
    Your mission is to perform a deep-dive security analysis of the following MCP (Model Context Protocol) server.
    
    Target Name: ${name}
    Target URL: ${url}

    **PHASE 1: RECONNAISSANCE (USE GOOGLE SEARCH)**
    Use the Google Search tool to find information about this MCP server. 
    - Look for it on NPM, GitHub, or official documentation.
    - Analyze its README, package.json dependencies, and exposed endpoints if visible.
    - Look for known vulnerabilities associated with its dependencies or similar implementations.
    - **CRITICAL**: If you definitively cannot find any information about an MCP server with this name or URL (it doesn't exist or is a private internal tool with no public footprint), set "scanStatus" to "NOT_FOUND".

    **PHASE 2: COMPREHENSIVE ANALYSIS**
    If found:
    1. **Trust Score Calculation**: Start at 100. Deduct for vulnerabilities, compliance gaps, and maintenance issues.
    2. **Vulnerabilities**: Identify potential CVEs (use real IDs if applicable to dependencies found).
    3. **Compliance**: Check against GDPR, SOX, HIPAA, ISO 27001.
    4. **Financial**: Estimate costs for Implementation, Maintenance, and ROI.

    **PHASE 3: OUTPUT**
    Return a **SINGLE JSON OBJECT**. Do not use markdown blocks.
    Structure:
    {
      "scanStatus": "SUCCESS" | "NOT_FOUND" | "PARTIAL",
      "suggestedAlternatives": ["string"],
      "riskScore": number,
      "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "summary": "string",
      "authAssessment": {
        "score": number,
        "details": "string",
        "strengths": ["string"],
        "weaknesses": ["string"]
      },
      "vulnerabilities": [
        { "cveId": "string", "severity": "string", "description": "string", "remediation": "string" }
      ],
      "compliance": [
        { "name": "string", "status": "string", "details": "string" }
      ],
      "costAnalysis": {
        "implementation": number,
        "annualMaintenance": number,
        "training": number,
        "infrastructure": number
      },
      "roiProjection": {
        "year1": number,
        "year2": number,
        "year3": number,
        "breakEvenMonth": number
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0,
        seed: 1337,
      },
    });

    const text = response.text || "";
    let jsonString = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    const data = JSON.parse(jsonString);

    if (data.scanStatus === 'NOT_FOUND') {
        return {
            targetName: name,
            targetUrl: url,
            scanDate: new Date().toISOString(),
            scanStatus: 'NOT_FOUND',
            suggestedAlternatives: data.suggestedAlternatives || ['filesystem', 'postgres', 'github', 'slack'],
            riskScore: 0,
            riskLevel: 'LOW',
            summary: 'Server not found',
            authAssessment: { score: 0, details: '', strengths: [], weaknesses: [] },
            vulnerabilities: [],
            compliance: [],
            costAnalysis: { implementation: 0, annualMaintenance: 0, training: 0, infrastructure: 0 },
            roiProjection: { year1: 0, year2: 0, year3: 0, breakEvenMonth: 0 }
        };
    }

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk) => chunk.web?.uri)
      .filter((uri): uri is string => !!uri) || [];

    return {
      targetName: name,
      targetUrl: url,
      scanDate: new Date().toISOString(),
      ...data,
      sources: [...new Set(sources)]
    };
  } catch (error) {
    throw new Error("API_ERROR");
  }
};

export const generateDeepDiveReport = async (name: string, url: string, summary: string): Promise<TechnicalDeepDiveData> => {
  const model = "gemini-3-pro-preview";
  const prompt = `
    You are a Lead Security Architect performing an EXHAUSTIVE technical audit of this MCP server:
    
    Target: ${name}
    Executive Context: ${summary}

    **CORE REQUIREMENT: COMPREHENSIVE TOOL INVENTORY**
    You MUST identify and analyze EVERY single tool, function, and sub-utility exposed by this server. 
    For an enterprise-grade MCP server, provide a list of 10-15 distinct technical capabilities. 
    If the server is specialized, break down its operations into granular steps (e.g., Read, Write, List, Stat, Search).

    **For each tool, provide:**
    - Detailed Technical Blast Radius analysis.
    - Specific attack vectors (e.g., Injection, SSRF, Path Traversal).
    - Code-level security controls and a secure TypeScript implementation example.

    **Structure the report as follows:**
    1. **Technical Summary**: A high-level architectural risk assessment (200 words).
    2. **Architecture Overview**: Describe the internal flow of data from LLM to System Resource.
    3. **Inventory**: The complete list of 10-15 tools with deep technical specs.
    4. **Code Security**: Audit of Input Validation, Auth, Error Handling, Logging, Rate Limiting, Sanitization.
    5. **Dependency Graph**: Direct and transitive dependencies with security status.
    6. **Integration Guide**: Specific policies for Access Control and Secure Configuration.

    Return a SINGLE JSON OBJECT matching the structure below. No markdown blocks.

    {
      "technicalSummary": "string",
      "architectureOverview": "string",
      "analysisCoverage": "FULL",
      "limitations": ["string"],
      "tools": [
        {
          "name": "string",
          "signature": "string",
          "description": "string",
          "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
          "dataScope": "string",
          "permissions": ["string"],
          "details": {
            "technicalDescription": "string",
            "inputValidation": "string",
            "outputFormat": "string",
            "systemResources": ["string"],
            "attackVectors": ["string"],
            "securityControls": ["string"],
            "codeExample": "string"
          }
        }
      ],
      "codeSecurity": {
        "inputValidation": "string",
        "authentication": "string",
        "errorHandling": "string",
        "loggingAudit": "string",
        "rateLimiting": "string",
        "dataSanitization": "string"
      },
      "dependencies": [
        {
          "name": "string",
          "version": "string",
          "status": "SECURE" | "VULNERABLE",
          "riskDescription": "string",
          "transitiveRisks": ["string"],
          "recommendation": "string"
        }
      ],
      "integration": {
        "accessControlPolicy": "string",
        "networkSegmentation": "string",
        "monitoringSetup": "string",
        "secureConfig": "string"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
        seed: 42,
      }
    });

    const text = response.text || "{}";
    let jsonString = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        jsonString = jsonMatch[0];
    }
    
    return JSON.parse(jsonString) as TechnicalDeepDiveData;
  } catch (error) {
    throw new Error("Failed to generate deep dive report.");
  }
};
