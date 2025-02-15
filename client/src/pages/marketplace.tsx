import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Copy, ExternalLink, Zap, ShieldAlert } from "lucide-react";
import type { VerifiedContract } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Marketplace() {
  const { toast } = useToast();
  const { data: contracts, isLoading } = useQuery<VerifiedContract[]>({
    queryKey: ["/api/verified-contracts"],
  });

  const handleCopyCode = (source: string) => {
    navigator.clipboard.writeText(source);
    toast({
      title: "Code Copied",
      description: "Contract source code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Development Notice */}
        <Card className="mb-8 border-neon-purple bg-black/60 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-neon-purple mb-4">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-mono text-lg">[DEVELOPMENT_STATUS]</span>
            </div>
            <p className="text-neon-blue/80 font-mono mb-4">
              The DeFi Guard Marketplace is currently under development. This platform will provide
              a curated collection of pre-audited smart contracts verified through our advanced
              security analysis pipeline.
            </p>
          </CardContent>
        </Card>

        {/* How It Works Section */}
        <Card className="mb-8 border-neon-blue bg-black/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neon-blue font-mono">
              <Zap className="h-5 w-5 text-neon-yellow" />
              [HOW_IT_WORKS]
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-black/40 p-4 border border-neon-purple/20">
                <Badge className="bg-neon-purple border-neon-purple/50 font-mono">01</Badge>
                <div>
                  <h4 className="font-mono text-neon-blue mb-2">Cartesi Powered Analysis</h4>
                  <p className="font-mono text-sm text-neon-purple/70">
                    Smart contracts undergo thorough security analysis using the Cartesi Coprocessor,
                    enabling complex computations off-chain while maintaining blockchain security.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-black/40 p-4 border border-neon-purple/20">
                <Badge className="bg-neon-pink border-neon-pink/50 font-mono">02</Badge>
                <div>
                  <h4 className="font-mono text-neon-blue mb-2">EigenLayer Validation</h4>
                  <p className="font-mono text-sm text-neon-purple/70">
                    All audit results are validated by EigenLayer's decentralized network,
                    ensuring trustless verification and consensus on security findings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-black/40 p-4 border border-neon-purple/20">
                <Badge className="bg-neon-blue border-neon-blue/50 font-mono">03</Badge>
                <div>
                  <h4 className="font-mono text-neon-blue mb-2">AI Security Review</h4>
                  <p className="font-mono text-sm text-neon-purple/70">
                    LLaMA 3.3-70B AI model performs deep analysis of contract vulnerabilities
                    and suggests optimizations for gas efficiency.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <Card className="mb-8 border-neon-green bg-black/60 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="animate-pulse">
                <ShieldAlert className="h-12 w-12 text-neon-green animate-glow" />
              </div>
              <h3 className="font-mono text-xl text-neon-green typewriter overflow-hidden whitespace-nowrap border-r-4 border-neon-green w-[0%] animate-typing">
                [INITIALIZING_MARKETPLACE]
              </h3>
              <div className="overflow-hidden">
                <p className="font-mono text-sm text-neon-green/70 animate-slideUp">
                  COMING_SOON: Secure Smart Contract Trading Platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Contract Listing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts?.map((contract) => (
            <Card key={contract.id} className="flex flex-col border-neon-blue/20 bg-black/60 backdrop-blur-xl">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-mono text-neon-blue">
                    {contract.name}
                  </CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1 bg-neon-green/10 text-neon-green">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <p className="text-neon-purple/70 text-sm mb-4 font-mono">
                  {contract.description}
                </p>

                <div className="space-y-4 mt-auto">
                  <Button
                    variant="outline"
                    className="w-full border-neon-blue/20 text-neon-blue hover:bg-neon-blue/10"
                    onClick={() => handleCopyCode(contract.source)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>

                  <Button className="w-full bg-neon-purple hover:bg-neon-pink">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}