# TrustGate: Enterprise Security Vetting for MCP

## Automating security audits for the Model Context Protocol ecosystem using Gemini.

![Thumbnail](https://placehold.co/800x400/0f172a/3b82f6?text=TrustGate)

### Project Description
TrustGate is an AI-powered security auditor designed to accelerate the safe adoption of the Model Context Protocol (MCP) in enterprise environments. As organizations rush to connect LLMs to their internal data, vetting third-party MCP servers for vulnerabilities, compliance risks, and hidden costs has become a critical bottleneck.

TrustGate solves this by automating the audit process. Users input an MCP server name or repository URL, and the application leverages **Gemini 3 Pro Preview** to perform a comprehensive analysis. The system executes a multi-stage workflow:
1.  **Reconnaissance**: Utilizes Google Search grounding to verify the tool's public footprint, documentation, and known dependencies.
2.  **Risk Analysis**: Calculates a 0-100 "Trust Score," identifies potential vulnerabilities (CVEs), and evaluates compliance with major standards like GDPR, HIPAA, and ISO 27001.
3.  **Technical Simulation**: Generates a simulated deep-dive report that analyzes specific tool signatures, data scopes, and potential attack vectors (e.g., `fs.write_file` risks).

The result is an interactive dashboard offering both an Executive View for stakeholders and a Technical View for security engineers, turning weeks of manual vetting into a 30-second automated scan.

### Video Demo
https://youtu.be/yDYxTpIMER0

### Public AI Studio App Link
https://ai.studio/apps/drive/1p11XwmNK9Xh-bhjTyJi2i5PdOh-dTlZc?fullscreenApplet=true

### How I Built It
I built TrustGate using **Google AI Studio** to prototype and refine the prompts, specifically targeting the `gemini-3-pro-preview` model for its superior reasoning and context handling capabilities. 

The application is a **React** web app styled with **Tailwind CSS** for a professional "SecOps" aesthetic. The core intelligence relies on the Google GenAI SDK. 

Key technical implementation details:
*   **Structured Output**: I used specific JSON schemas in the system instructions to ensure Gemini returns data that can be directly visualized in charts and metric cards.
*   **Tool Use (Grounding)**: The `googleSearch` tool is enabled to allow the model to fetch real-time information about existing MCP servers from GitHub and NPM, ensuring the reports are grounded in reality rather than hallucinated.
*   **Reasoning Simulation**: For the "Technical Deep Dive," I prompted the model to simulate a static code analysis, inferring likely tool definitions and security controls based on the server's description and documentation.
*   **Determinism**: To ensure reliable enterprise reports, the model is configured with a temperature of 0 and a fixed seed, providing consistent scoring across multiple scans of the same resource.

### The Impact
The Model Context Protocol is setting the standard for how AI agents interact with systems. However, a single malicious or poorly configured server can compromise an entire organization's data. TrustGate empowers developers and security teams to evaluate these tools instantly. By providing transparent risk scoring and actionable remediation advice, TrustGate fosters a safer open-source ecosystem and removes the "security paralysis" preventing enterprises from adopting powerful new MCP tools.