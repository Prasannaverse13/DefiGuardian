import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileCode, Zap, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Cyberpunk Elements */}
      <div className="relative overflow-hidden">
        {/* Scanline Effect */}
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-neon-purple/10 to-transparent opacity-20 animate-scanline" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 animate-glow">
              DeFi
              <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
                {" "}Guard
              </span>
            </h1>
            <p className="text-xl text-neon-blue/80 max-w-2xl mx-auto mb-8 font-mono">
              [SYSTEM: INITIALIZING SMART CONTRACT SECURITY PROTOCOL]
            </p>
            <Link href="/audit">
              <Button size="lg" className="rounded-none bg-neon-purple hover:bg-neon-pink transition-colors duration-300 text-white font-mono border border-neon-blue/50 shadow-lg shadow-neon-purple/20">
                &gt; START_AUDIT.exe
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section with Cyberpunk Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "AI-POWERED ANALYSIS",
              description: "Neural network vulnerability detection using LLaMA 3.3-70B AI core.",
              color: "neon-pink"
            },
            {
              icon: FileCode,
              title: "OFF-CHAIN COMPUTATION",
              description: "Quantum-speed analysis via Cartesi Coprocessor mainframe.",
              color: "neon-blue"
            },
            {
              icon: Zap,
              title: "TRUSTED RESULTS",
              description: "Decentralized validation through EigenLayer network nodes.",
              color: "neon-green"
            }
          ].map((feature, i) => (
            <Card key={i} className="bg-black/60 backdrop-blur-xl border border-neon-blue/20 hover:border-neon-purple/50 transition-colors duration-300">
              <CardContent className="pt-6">
                <feature.icon className={`h-12 w-12 text-${feature.color} mb-4`} />
                <h3 className="text-xl font-bold mb-2 font-mono text-white">
                  {feature.title}
                </h3>
                <p className="text-neon-blue/70 font-mono">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust Section with Cyberpunk Elements */}
      <div className="relative bg-black/80 py-24 border-t border-neon-purple/20">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white font-mono">
              [SYSTEM_ADVANTAGES]
            </h2>
            <p className="text-neon-blue/70 max-w-2xl mx-auto font-mono">
              Integrated security protocol with quantum-resistant encryption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "AUTOMATED AUDITS",
                description: "Real-time security analysis",
                color: "neon-pink"
              },
              {
                icon: CheckCircle,
                title: "VERIFIED RESULTS",
                description: "EigenLayer validation matrix",
                color: "neon-purple"
              },
              {
                icon: Zap,
                title: "GAS OPTIMIZATION",
                description: "Enhanced contract efficiency",
                color: "neon-blue"
              },
              {
                icon: FileCode,
                title: "BEST PRACTICES",
                description: "Industry-grade security",
                color: "neon-green"
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className={`bg-black p-3 rounded-none border border-${feature.color}/30 group-hover:border-${feature.color} transition-colors duration-300`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                </div>
                <h3 className="font-bold mb-2 mt-4 text-white font-mono">{feature.title}</h3>
                <p className="text-sm text-neon-blue/70 font-mono">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}