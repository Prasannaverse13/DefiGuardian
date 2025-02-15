import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Zap } from "lucide-react";
import type { Audit } from "@shared/schema";

type ResultsProps = {
  audit: Audit;
  onValidate: () => void;
  isValidating: boolean;
};

export default function Results({ audit, onValidate, isValidating }: ResultsProps) {
  const vulnerabilities = audit.vulnerabilities as any[] || [];
  const gasOptimizations = audit.gasOptimizations as any[] || [];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-neon-pink border-neon-pink/50';
      case 'medium':
        return 'bg-neon-purple border-neon-purple/50';
      case 'low':
        return 'bg-neon-blue border-neon-blue/50';
      default:
        return 'bg-gray-500 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/60 backdrop-blur-xl border border-neon-blue/20 overflow-hidden">
        <CardHeader className="border-b border-neon-purple/20">
          <CardTitle className="flex items-center gap-2 text-neon-purple font-mono">
            <AlertTriangle className="h-5 w-5 text-neon-pink" />
            [VULNERABILITY_SCAN]
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {vulnerabilities.length === 0 ? (
            <div className="flex items-center gap-2 text-neon-green font-mono">
              <CheckCircle className="h-5 w-5" />
              [SCAN_COMPLETE]: No vulnerabilities detected
            </div>
          ) : (
            <ul className="space-y-4">
              {vulnerabilities.map((vuln, index) => (
                <li key={index} className="group">
                  <div className="flex items-start gap-4 bg-black/40 p-4 border border-neon-purple/20 hover:border-neon-purple/50 transition-colors duration-300">
                    <Badge className={`${getSeverityColor(vuln.severity)} font-mono`}>
                      {vuln.severity.toUpperCase()}
                    </Badge>
                    <div className="space-y-2">
                      <h4 className="font-mono text-neon-blue">{vuln.type}</h4>
                      <p className="font-mono text-sm text-neon-purple/70">
                        Location: <span className="text-neon-pink">{vuln.location}</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black/60 backdrop-blur-xl border border-neon-blue/20">
        <CardHeader className="border-b border-neon-purple/20">
          <CardTitle className="flex items-center gap-2 text-neon-purple font-mono">
            <Zap className="h-5 w-5 text-neon-yellow" />
            [OPTIMIZATION_ANALYSIS]
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-4">
            {gasOptimizations.map((opt, index) => (
              <li key={index} className="group">
                <div className="flex items-start gap-4 bg-black/40 p-4 border border-neon-blue/20 hover:border-neon-blue/50 transition-colors duration-300">
                  <Badge variant="secondary" className="font-mono border-neon-blue/30">
                    {opt.type}
                  </Badge>
                  <p className="font-mono text-sm text-neon-blue/70">{opt.suggestion}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {!audit.eigenlayerValidated && (
        <Button 
          className="w-full bg-neon-purple hover:bg-neon-pink transition-colors duration-300 font-mono"
          onClick={onValidate}
          disabled={isValidating}
        >
          {isValidating ? "[VALIDATING_WITH_EIGENLAYER...]" : "[INITIALIZE_EIGENLAYER_VALIDATION]"}
        </Button>
      )}

      {audit.eigenlayerValidated && (
        <div className="flex items-center justify-center gap-2 text-neon-green font-mono border border-neon-green/20 p-4 bg-black/40">
          <CheckCircle className="h-5 w-5" />
          [VALIDATION_COMPLETE]: Verified by EigenLayer Network
        </div>
      )}
    </div>
  );
}