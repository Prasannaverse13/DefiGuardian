import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

export async function disconnectWallet(): Promise<void> {
  if (!window.ethereum) return;

  try {
    // Clear any stored connection state
    localStorage.removeItem('walletConnected');
    // Clear any MetaMask cached permissions
    await window.ethereum.request({
      method: "wallet_revokePermissions",
      params: [{ eth_accounts: {} }]
    });
  } catch (error) {
    console.error("Error disconnecting wallet:", error);
    throw error;
  }
}

export async function getConnectedAddress(): Promise<string | null> {
  if (!window.ethereum) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    });
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting connected address:", error);
    return null;
  }
}

export function listenToAccountChanges(callback: (address: string | null) => void) {
  if (!window.ethereum) return;

  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    callback(accounts[0] || null);
  });
}

export async function verifyContract(address: string): Promise<boolean> {
  if (!window.ethereum) return false;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch (error) {
    console.error("Error verifying contract:", error);
    return false;
  }
}