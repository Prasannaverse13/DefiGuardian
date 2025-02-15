import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCode, Upload } from "lucide-react";

const formSchema = z.object({
  contractSource: z.string().min(1, "Contract source is required"),
});

type UploadFormProps = {
  onSubmit: (data: { contractSource: string }) => void;
  isLoading: boolean;
};

export default function UploadForm({ onSubmit, isLoading }: UploadFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contractSource: "",
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      form.setValue("contractSource", content);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="bg-black/60 backdrop-blur-xl border border-neon-blue/20">
      <CardHeader className="border-b border-neon-purple/20">
        <CardTitle className="flex items-center gap-2 text-neon-purple font-mono">
          <FileCode className="h-5 w-5" />
          SMART_CONTRACT_UPLOAD
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contractSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neon-blue/80 font-mono">
                    CONTRACT_SOURCE_CODE
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="// Paste your Solidity contract here..."
                      className="h-[300px] font-mono bg-black/40 border-neon-purple/30 text-white placeholder:text-neon-purple/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-neon-pink font-mono" />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                className="border-neon-blue/30 hover:bg-neon-blue/10 hover:border-neon-blue transition-colors duration-300 font-mono"
              >
                <Upload className="w-4 h-4 mr-2" />
                UPLOAD_FILE
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".sol"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-neon-purple hover:bg-neon-pink transition-colors duration-300 font-mono"
              >
                {isLoading ? "ANALYZING..." : "ANALYZE_CONTRACT"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}