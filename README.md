# DeFi Guard: Web3 Smart Contract Security Auditor

A cutting-edge smart contract security auditing platform powered by Cartesi Coprocessor and EigenLayer, utilizing LLaMA 3.3-70B AI for advanced vulnerability detection.

## Project Overview

DeFi Guard is a comprehensive security auditing platform that combines advanced AI capabilities with decentralized computation to provide thorough smart contract analysis. The platform leverages three key technologies:

1. **LLaMA 3.3-70B AI Model** for deep contract analysis
2. **Cartesi Coprocessor** for off-chain computation
3. **EigenLayer** for decentralized validation

## Technical Implementation

### AI Integration
The AI functionality is implemented in two key locations:

1. **Backend Integration** (`client/src/lib/ai.ts`):
```typescript
// Smart contract vulnerability analysis
export async function analyzeVulnerabilities(contractCode: string) {
  try {
    const response = await apiRequest("POST", "/api/ai/analyze", {
      contractSource: contractCode
    });
    return response.analysis;
  } catch (error) {
    console.error("[AI_SYSTEM_ERROR]:", error);
    return `[CRITICAL_FAILURE]: Analysis systems offline`;
  }
}

// Interactive AI chat functionality
export async function chatWithAI(message: string, context: string[]) {
  try {
    const response = await apiRequest("POST", "/api/ai/chat", {
      message,
      context
    });
    return response.response;
  } catch (error) {
    console.error("[AI_CHAT_ERROR]:", error);
    return `[SYSTEM_ERROR]: Neural link failure`;
  }
}
```

### Cartesi Coprocessor Integration
Located in `cartesi/smart-contract-analyzer/index.js`, our Cartesi implementation enables:
```javascript
// Main entrypoint for contract analysis
async function main() {
    const input = await new Promise((resolve) => {
        let data = '';
        process.stdin.on('data', chunk => data += chunk);
        process.stdin.on('end', () => resolve(data));
    });

    try {
        const { contractSource } = JSON.parse(input);
        const analysis = analyzeContract(contractSource);
        
        // Send analysis result as a notice
        console.log(JSON.stringify({
            type: "notice",
            payload: analysis
        }));
    } catch (error) {
        console.error(JSON.stringify({
            type: "report",
            payload: `Error analyzing contract: ${error.message}`
        }));
    }
}
```

### Smart Contract Integration
The smart contract interface (`contracts/AuditContract.sol`):
```solidity
contract AuditContract is CoprocessorAdapter {
    event AuditRequested(address indexed requester, string contractSource);
    event AuditCompleted(address indexed requester, bytes result);

    constructor(address _taskIssuerAddress, bytes32 _machineHash)
        CoprocessorAdapter(_taskIssuerAddress, _machineHash)
    {}

    function requestAudit(string calldata contractSource) external {
        emit AuditRequested(msg.sender, contractSource);
        bytes memory input = abi.encode(contractSource);
        callCoprocessor(input);
    }

    function handleNotice(bytes calldata _notice) internal override {
        emit AuditCompleted(msg.sender, _notice);
    }
}
```

## Features

### 🛡️ AI-Powered Security Analysis
- Smart contract vulnerability detection using LLaMA 3.3-70B
- Gas optimization suggestions
- Security scoring system

### 🔄 Decentralized Validation
- EigenLayer-based validation network
- Cartesi Coprocessor for off-chain computation
- Cross-chain compatibility

### 🤖 Interactive AI Security Assistant
- Context-aware security recommendations
- Natural language interaction
- Real-time vulnerability detection

### 🌐 Web3 Integration
- Wallet-based authentication
- Secure smart contract interaction
- Decentralized verification system

## Project Setup

### Prerequisites
1. **Install Cartesi Coprocessor CLI**:
```bash
curl -L https://github.com/Mugen-Builders/co-processor-cli/releases/download/v1.4.6/cartesi-coprocessor-[your-platform].tar.gz
tar -xzf cartesi-coprocessor-[your-platform].tar.gz
sudo mv cartesi-coprocessor /usr/local/bin/
```

2. **Install Required Tools**:
```bash
# Install Docker Desktop with RISC-V support
docker run --privileged --rm tonistiigi/binfmt --install all

# Install Cartesi CLI
npm i -g @cartesi/cli

# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Environment Setup
Create a `.env` file with:
```env
NVIDIA_API_KEY=your_api_key
CARTESI_NODE_URL=your_cartesi_node
EIGENLAYER_CONTRACT=your_contract_address
```

### Running the Project
1. Start the Cartesi Coprocessor devnet:
```bash
cartesi-coprocessor start-devnet
```

2. Build and publish the Cartesi machine:
```bash
cd cartesi/smart-contract-analyzer
cartesi-coprocessor publish --network devnet
```

3. Deploy the smart contract:
```bash
cartesi-coprocessor deploy --contract-name AuditContract --network devnet
```

4. Start the application:
```bash
npm run dev
```

## Project Structure
```
project/
├── cartesi/
│   └── smart-contract-analyzer/     # Cartesi Machine implementation
├── contracts/
│   └── AuditContract.sol           # Smart contract with Cartesi integration
├── client/
│   └── src/
│       ├── lib/
│       │   ├── ai.ts               # AI integration
│       │   └── web3.ts             # Web3 utilities
│       └── components/
│           └── layout/             # UI components
└── server/
    └── routes.ts                   # Backend API routes
```

## Security Considerations
- All contract analyses are executed in isolated Cartesi machines
- Results are validated through EigenLayer's decentralized network
- Sensitive operations require wallet signatures
- Real-time vulnerability detection and prevention

## License
This project is licensed under the MIT License.
