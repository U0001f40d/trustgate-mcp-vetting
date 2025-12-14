import { GoogleGenAI } from "@google/genai";
import { SecurityReport, TechnicalDeepDiveData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMCPServer = async (name: string, url: string): Promise<SecurityReport> => {
  // Using Gemini 3 Pro for complex reasoning and analysis
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
    If found (or if you can infer functionality from a generic name like "postgres-mcp"):
    1. **Trust Score Calculation (Strict Rubric)**: Start with 100. Deduct points based on the following rules:
       - **CRITICAL Vulnerabilities (-30 pts)**: RCE, Arbitrary File Write, SQL Injection possibilities.
       - **HIGH Vulnerabilities (-15 pts)**: Unrestricted File Read, Missing Auth, Sensitive Data Exposure.
       - **MEDIUM Vulnerabilities (-5 pts)**: Missing best practices, minor config issues.
       - **Compliance Gaps (-10 pts)**: No GDPR/HIPAA considerations if applicable.
       - **Maintenance (-10 pts)**: Abandoned repo or no documentation.
       
       *Map the final score to Risk Level:*
       - Score > 80: High Trust (Low Risk)
       - Score 60-79: Medium Trust (Medium Risk)
       - Score 40-59: Low Trust (High Risk)
       - Score < 40: Untrusted (Critical Risk)

    2. **Vulnerabilities**: Identify potential CVEs (use real IDs if applicable to dependencies found, or realistic placeholders like CVE-2024-XXXX for hypothetical flaws).
    3. **Compliance**: Check against GDPR (data handling), SOX (logging), HIPAA (PHI), ISO 27001 (access control).
    4. **Financial**: Estimate costs for Implementation (setup, dev hours), Maintenance (hosting, patching), and ROI (efficiency gains).

    **PHASE 3: OUTPUT**
    Return a **SINGLE JSON OBJECT**. Do not use markdown blocks.
    Structure:

    {
      "scanStatus": "SUCCESS" | "NOT_FOUND" | "PARTIAL",
      "suggestedAlternatives": ["string", "string"] (Only if NOT_FOUND, e.g. "postgres-mcp", "filesystem-server"),
      "riskScore": number (0-100, this is the Trust Score, 100 is best),
      "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" (Inverse of score: High Score = LOW Risk),
      "summary": "Detailed executive summary...",
      "authAssessment": {
        "score": number (0-100),
        "details": "Assessment...",
        "strengths": ["string"],
        "weaknesses": ["string"]
      },
      "vulnerabilities": [
        { "cveId": "string", "severity": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL", "description": "string", "remediation": "string" }
      ],
      "compliance": [
        { "name": "GDPR"|"SOX"|"HIPAA"|"ISO 27001", "status": "COMPLIANT"|"NON_COMPLIANT"|"PARTIAL"|"NOT_APPLICABLE", "details": "string" }
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
        temperature: 0, // Force determinism
        seed: 1337,     // Consistent seed
      },
    });

    // Extract text
    const text = response.text || "";
    
    // Parse JSON (handle potential markdown code blocks)
    let jsonString = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    const data = JSON.parse(jsonString);

    // If NOT_FOUND, we might return minimal data structure to satisfy types, but App.tsx will check scanStatus
    if (data.scanStatus === 'NOT_FOUND') {
        return {
            targetName: name,
            targetUrl: url,
            scanDate: new Date().toISOString(),
            scanStatus: 'NOT_FOUND',
            suggestedAlternatives: data.suggestedAlternatives || ['filesystem', 'postgres', 'github', 'slack'],
            // Fill required fields with dummies as they won't be shown
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

    // Extract sources from grounding metadata
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk) => chunk.web?.uri)
      .filter((uri): uri is string => !!uri) || [];

    // Deduplicate sources
    const uniqueSources = [...new Set(sources)];

    return {
      targetName: name,
      targetUrl: url,
      scanDate: new Date().toISOString(),
      ...data,
      sources: uniqueSources
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    // Throw a specific error object if possible, or just string
    throw new Error("API_ERROR");
  }
};

export const generateDeepDiveReport = async (name: string, url: string, summary: string): Promise<TechnicalDeepDiveData> => {
  const model = "gemini-3-pro-preview";
  const prompt = `
    You are a Senior Security Engineer specializing in Model Context Protocol (MCP) servers. 
    Generate a **Technical Deep-Dive Report** for the following MCP server:
    
    Target Name: ${name}
    Target URL: ${url}
    Context: ${summary}

    **CORE OBJECTIVE: SOURCE CODE SIMULATION & TOOL ANALYSIS**
    Simulate a static analysis of the server's source code. You must identify specific tools and analyze them with extreme technical depth.
    
    **COVERAGE & LIMITATIONS**:
    - If you cannot access the exact source code, perform a "SIMULATED" analysis based on standard implementations of this tool type.
    - Clearly mark this in the output fields.
    - List what could not be verified (e.g., "Exact line numbers unavailable", "Proprietary auth logic unknown").

    **ANALYSIS STANDARDS (Example: Filesystem Server):**
    If analyzing a filesystem server, you would output:
    - **read_file**: HIGH RISK. Parameter: \`path\`. Risk: Arbitrary file read (/etc/passwd). Control: Sandbox to /cwd.
    - **write_file**: CRITICAL RISK. Parameter: \`path, content\`. Risk: RCE via overwriting configs. Control: Read-only mode.
    - **list_directory**: MEDIUM RISK. Parameter: \`path\`. Risk: Reconnaissance. Control: Hide dotfiles.
    - **delete_file**: CRITICAL RISK. Parameter: \`path\`. Risk: Destructive data loss. Control: Confirmation + Backup.

    **INSTRUCTIONS FOR TARGET (${name}):**
    1. **Identify Tools**: Infer likely tools based on the server type (e.g., for a Postgres server: query_read, query_write, list_tables).
    2. **Deep Analysis per Tool**:
       - **Signature**: Exact function signature (e.g., \`tool_name(param: type)\`).
       - **Data Scope**: What exact resources are touched? (Files, URLs, Tables).
       - **Validation**: Does it look like it validates input? (Assume 'No' if unknown for safety).
       - **Blast Radius**: Worst-case scenario of abuse (e.g. "Full database dump", "RCE").
       - **Mitigation**: Specific code-level fixes (e.g. "Use parameterized queries", "Chroot environment").

    Generate a SINGLE JSON OBJECT matching the following structure exactly. Do not use markdown code blocks.
    
    Structure:
    {
      "analysisCoverage": "FULL" | "PARTIAL" | "SIMULATED",
      "limitations": ["string (e.g. Source code private, simulated based on public docs)"],
      "tools": [
        {
          "name": "string (Tool Name, e.g. read_file)",
          "signature": "string (e.g. read_file(path: string))",
          "description": "string (Concise security summary)",
          "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
          "dataScope": "string (e.g. Host Filesystem - Read/Write)",
          "permissions": ["string (e.g. fs.read)"],
          "details": {
            "technicalDescription": "string (Detailed technical breakdown including BLAST RADIUS assessment)",
            "inputValidation": "string (Assessment of likely validation logic)",
            "outputFormat": "string",
            "systemResources": ["string"],
            "attackVectors": ["string (e.g. Path Traversal)", "string (e.g. RCE)"],
            "securityControls": ["string (e.g. Restrict path to ./workspace)", "string (e.g. Input sanitization)"],
            "codeExample": "string (Secure implementation snippet in TypeScript)"
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
          "status": "SECURE" | "VULNERABLE" | "OUTDATED",
          "riskDescription": "string",
          "transitiveRisks": ["string"],
          "recommendation": "string"
        }
      ],
      "integration": {
        "accessControlPolicy": "string (YAML/JSON example)",
        "networkSegmentation": "string",
        "monitoringSetup": "string",
        "secureConfig": "string (JSON/YAML example)"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0, // Force determinism
        seed: 1337,     // Consistent seed
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
    console.error("Deep dive generation failed:", error);
    throw new Error("Failed to generate deep dive report.");
  }
};