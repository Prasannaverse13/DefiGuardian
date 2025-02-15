import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import UploadForm from "@/components/audit/upload-form";
import Results from "@/components/audit/results";
import AIChat from "@/components/audit/ai-chat";
import { analyzeVulnerabilities } from "@/lib/ai";
import { getConnectedAddress } from "@/lib/web3";
import type { Audit } from "@shared/schema";

export default function AuditPage() {
  const [currentAuditId, setCurrentAuditId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: audit } = useQuery<Audit>({
    queryKey: [`/api/audits/${currentAuditId}`],
    enabled: currentAuditId !== null,
  });

  const submitAuditMutation = useMutation({
    mutationFn: async (contractSource: string) => {
      const address = await getConnectedAddress();
      if (!address) {
        throw new Error("Please connect your wallet first");
      }

      // First ensure user exists
      await apiRequest("POST", "/api/users", { address });

      // Get AI analysis
      const aiAnalysis = await analyzeVulnerabilities(contractSource);
      console.log("AI Analysis:", aiAnalysis);

      // Submit for audit
      const res = await apiRequest("POST", "/api/audits", {
        contractSource,
        fileName: "uploaded-contract.sol",
        status: "completed",
        userId: 1 // For demo, we'll use ID 1
      });

      return res.json();
    },
    onSuccess: (data) => {
      setCurrentAuditId(data.id);
      toast({
        title: "Audit Submitted",
        description: "Your contract is being analyzed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateWithEigenLayerMutation = useMutation({
    mutationFn: async (auditId: number) => {
      const res = await apiRequest("POST", `/api/audits/${auditId}/validate`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/audits/${currentAuditId}`] });
      toast({
        title: "Validation Complete",
        description: "Contract validated by EigenLayer network",
      });
    },
  });

  const handleSubmit = async (data: { contractSource: string }) => {
    submitAuditMutation.mutate(data.contractSource);
  };

  const handleValidate = () => {
    if (currentAuditId) {
      validateWithEigenLayerMutation.mutate(currentAuditId);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Smart Contract Audit</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <UploadForm 
              onSubmit={handleSubmit}
              isLoading={submitAuditMutation.isPending}
            />

            {audit && (
              <Results 
                audit={audit}
                onValidate={handleValidate}
                isValidating={validateWithEigenLayerMutation.isPending}
              />
            )}
          </div>

          <div className="lg:pl-8">
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
}
