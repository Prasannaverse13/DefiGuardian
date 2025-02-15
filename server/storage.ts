import { 
  users, audits, verifiedContracts,
  type User, type Audit, type VerifiedContract,
  type InsertUser, type InsertAudit, type InsertVerifiedContract 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByAddress(address: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Audits
  createAudit(audit: InsertAudit): Promise<Audit>;
  getAuditById(id: number): Promise<Audit | undefined>;
  getUserAudits(userId: number): Promise<Audit[]>;
  updateAuditResults(id: number, vulnerabilities: any, gasOptimizations: any): Promise<void>;
  setEigenlayerValidated(id: number): Promise<void>;
  
  // Verified Contracts
  createVerifiedContract(contract: InsertVerifiedContract): Promise<VerifiedContract>;
  getVerifiedContracts(): Promise<VerifiedContract[]>;
  getVerifiedContractById(id: number): Promise<VerifiedContract | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private audits: Map<number, Audit>;
  private verifiedContracts: Map<number, VerifiedContract>;
  private currentId: { users: number; audits: number; contracts: number };

  constructor() {
    this.users = new Map();
    this.audits = new Map();
    this.verifiedContracts = new Map();
    this.currentId = { users: 1, audits: 1, contracts: 1 };
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByAddress(address: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.address === address);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Audits
  async createAudit(insertAudit: InsertAudit): Promise<Audit> {
    const id = this.currentId.audits++;
    const audit: Audit = {
      ...insertAudit,
      id,
      vulnerabilities: null,
      gasOptimizations: null,
      eigenlayerValidated: false,
      createdAt: new Date()
    };
    this.audits.set(id, audit);
    return audit;
  }

  async getAuditById(id: number): Promise<Audit | undefined> {
    return this.audits.get(id);
  }

  async getUserAudits(userId: number): Promise<Audit[]> {
    return Array.from(this.audits.values()).filter(audit => audit.userId === userId);
  }

  async updateAuditResults(id: number, vulnerabilities: any, gasOptimizations: any): Promise<void> {
    const audit = await this.getAuditById(id);
    if (audit) {
      audit.vulnerabilities = vulnerabilities;
      audit.gasOptimizations = gasOptimizations;
      this.audits.set(id, audit);
    }
  }

  async setEigenlayerValidated(id: number): Promise<void> {
    const audit = await this.getAuditById(id);
    if (audit) {
      audit.eigenlayerValidated = true;
      this.audits.set(id, audit);
    }
  }

  // Verified Contracts
  async createVerifiedContract(insertContract: InsertVerifiedContract): Promise<VerifiedContract> {
    const id = this.currentId.contracts++;
    const contract: VerifiedContract = {
      ...insertContract,
      id,
      createdAt: new Date()
    };
    this.verifiedContracts.set(id, contract);
    return contract;
  }

  async getVerifiedContracts(): Promise<VerifiedContract[]> {
    return Array.from(this.verifiedContracts.values());
  }

  async getVerifiedContractById(id: number): Promise<VerifiedContract | undefined> {
    return this.verifiedContracts.get(id);
  }
}

export const storage = new MemStorage();
