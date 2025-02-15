import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { connectWallet, getConnectedAddress, disconnectWallet, listenToAccountChanges } from "@/lib/web3";
import { useState, useEffect } from "react";
import { 
  Shield, 
  Menu,
  AlertCircle
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [showConnectAlert, setShowConnectAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    getConnectedAddress().then(setAddress);

    // Listen for account changes
    listenToAccountChanges((newAddress) => {
      setAddress(newAddress);
      if (!newAddress) {
        toast({
          title: "Wallet Disconnected",
          description: "Wallet connection lost",
        });
      }
    });
  }, []);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask"
      });
      setShowConnectAlert(false);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to MetaMask",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setAddress(null);
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from MetaMask"
      });
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: "Could not disconnect from MetaMask",
        variant: "destructive"
      });
    }
  };

  const handleNavigation = (path: string) => {
    if (!address && (path === '/audit' || path === '/marketplace')) {
      setShowConnectAlert(true);
      return;
    }
    setLocation(path);
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">DeFi Guard</span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <button 
              onClick={() => handleNavigation('/')}
              className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('/audit')}
              className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              Audit
            </button>
            <button 
              onClick={() => handleNavigation('/marketplace')}
              className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              Marketplace
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {address ? (
              <div className="flex items-center space-x-2">
                <div className="text-sm px-4 py-2 rounded-full bg-primary/10">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={handleConnect}>
                Connect Wallet
              </Button>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-primary">
                    <Shield className="h-5 w-5" />
                    How DeFi Guard Works
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6 text-sm">
                  <div>
                    <h3 className="font-semibold mb-2">1. Smart Contract Analysis</h3>
                    <p className="text-muted-foreground">
                      Upload your smart contract code for comprehensive security analysis powered by 
                      LLaMA 3.3-70B AI model via Cartesi Coprocessor.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">2. Decentralized Validation</h3>
                    <p className="text-muted-foreground">
                      Results are validated by EigenLayer's decentralized network for trustless 
                      verification of security findings.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">3. AI Security Assistant</h3>
                    <p className="text-muted-foreground">
                      Chat with our advanced AI to get detailed explanations and recommendations 
                      about potential security vulnerabilities.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">4. Verified Marketplace</h3>
                    <p className="text-muted-foreground">
                      Browse and use pre-audited smart contracts that have passed our rigorous 
                      security checks and validation process.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AlertDialog open={showConnectAlert} onOpenChange={setShowConnectAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Wallet Connection Required
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please connect your wallet to access advanced features like smart contract auditing 
              and the verified marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConnect}>Connect Wallet</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}