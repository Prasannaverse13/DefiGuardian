import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertAuditSchema, insertUserSchema, insertVerifiedContractSchema } from "@shared/schema";
import { OpenAI } from "openai";

export async function registerRoutes(app: Express) {
  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByAddress(userData.address);
      if (existingUser) {
        return res.json(existingUser);
      }
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Audits
  app.post("/api/audits", async (req, res) => {
    try {
      const auditData = insertAuditSchema.parse(req.body);
      const audit = await storage.createAudit(auditData);

      // Mock Cartesi analysis results
      const mockResults = {
        vulnerabilities: [
          { type: "reentrancy", severity: "high", location: "withdraw()" },
          { type: "overflow", severity: "medium", location: "transfer()" }
        ],
        gasOptimizations: [
          { type: "storage", suggestion: "Use memory instead of storage" },
          { type: "loop", suggestion: "Cache array length" }
        ]
      };

      await storage.updateAuditResults(
        audit.id,
        mockResults.vulnerabilities,
        mockResults.gasOptimizations
      );

      const updatedAudit = await storage.getAuditById(audit.id);
      res.json(updatedAudit);
    } catch (error) {
      res.status(400).json({ message: "Invalid audit data" });
    }
  });

  app.get("/api/audits/:id", async (req, res) => {
    const audit = await storage.getAuditById(Number(req.params.id));
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }
    res.json(audit);
  });

  app.get("/api/users/:userId/audits", async (req, res) => {
    const audits = await storage.getUserAudits(Number(req.params.userId));
    res.json(audits);
  });

  app.post("/api/audits/:id/validate", async (req, res) => {
    const auditId = Number(req.params.id);
    await storage.setEigenlayerValidated(auditId);
    const audit = await storage.getAuditById(auditId);
    res.json(audit);
  });

  // Verified Contracts
  app.post("/api/verified-contracts", async (req, res) => {
    try {
      const contractData = insertVerifiedContractSchema.parse(req.body);
      const contract = await storage.createVerifiedContract(contractData);
      res.json(contract);
    } catch (error) {
      res.status(400).json({ message: "Invalid contract data" });
    }
  });

  app.get("/api/verified-contracts", async (req, res) => {
    const contracts = await storage.getVerifiedContracts();
    res.json(contracts);
  });

  app.get("/api/verified-contracts/:id", async (req, res) => {
    const contract = await storage.getVerifiedContractById(Number(req.params.id));
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.json(contract);
  });

  // AI Endpoints
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { contractSource } = req.body;
      if (!contractSource) {
        return res.status(400).json({ message: "Contract source is required" });
      }

      const openai = new OpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1'
      });

      const completion = await openai.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages: [
          {
            role: "system",
            content: `[SYSTEM: INITIALIZING SMART CONTRACT ANALYSIS]
You are an advanced AI security expert. Analyze smart contracts following this format:

[VULNERABILITY_SCAN]
- List critical vulnerabilities with severity levels (HIGH/MEDIUM/LOW)
- Include line numbers for each issue
- Explain potential exploit scenarios

[OPTIMIZATION_ANALYSIS]
- Identify gas optimization opportunities
- Suggest specific code improvements
- Calculate potential gas savings

[SECURITY_SCORE]
- Rate overall security (0-100)
- List key security strengths
- Highlight areas needing immediate attention`
          },
          {
            role: "user",
            content: `[ANALYZING_CONTRACT]\n${contractSource}`
          }
        ],
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1024
      });

      res.json({ analysis: completion.choices[0]?.message?.content });
    } catch (error: any) {
      console.error("[AI_SYSTEM_ERROR]:", error);
      res.status(500).json({ message: `[CRITICAL_FAILURE]: ${error.message}` });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const openai = new OpenAI({
        apiKey: process.env.NVIDIA_API_KEY,
        baseURL: 'https://integrate.api.nvidia.com/v1'
      });

      const completion = await openai.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages: [
          {
            role: "system",
            content: `[SYSTEM: INITIALIZING SECURITY AI ASSISTANT]
You are an advanced AI security expert powered by LLaMA 3.3-70B model.
Respond in a cyberpunk-themed style, like a high-tech security system.

FORMAT RESPONSES AS:
[SECURITY_ANALYSIS]
Your detailed technical answer

[RECOMMENDATIONS]
Specific action items or suggestions

[RISK_LEVEL]
Calculate risk score (0-100) when applicable`
          },
          ...(context || []).map(msg => ({
            role: "user" as const,
            content: msg
          })),
          {
            role: "user",
            content: `[USER_QUERY] ${message}`
          }
        ],
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1024
      });

      res.json({ response: completion.choices[0]?.message?.content });
    } catch (error: any) {
      console.error("[AI_CHAT_ERROR]:", error);
      res.status(500).json({ message: `[SYSTEM_ERROR]: Neural link failure - ${error.message}` });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}