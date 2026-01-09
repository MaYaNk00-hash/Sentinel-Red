import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ShieldAlert, Zap, Network, FileText, ArrowRight } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BackgroundCanvas from '@/components/BackgroundCanvas'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-sans selection:bg-primary/30 text-foreground">
      <BackgroundCanvas />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 container mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)] rotate-3 backdrop-blur-sm">
            <ShieldAlert className="h-6 w-6 text-primary" />
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tight">Sentinel Red</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="hover:bg-primary/5 hover:text-primary font-medium text-muted-foreground transition-colors"
          >
            Log in
          </Button>
          <Button
            onClick={() => navigate('/register')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(239,68,68,0.3)] font-bold rounded-full px-6 transition-all hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold backdrop-blur-md mb-8 shadow-sm"
            >
              <Zap className="w-4 h-4 fill-primary" />
              <span>AI-Powered Security Automation</span>
            </motion.div>

            <h1 className="font-heading text-5xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
              Security that <br />
              <span className="text-primary relative inline-block drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                thinks like
              </span>
              <br />
              an intruder.
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed font-normal">
              Don't wait for a breach to find your weak spots. Our agents relentlessly test your defenses, uncovering logic flaws before they can be exploited.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-[0_0_30px_rgba(239,68,68,0.4)] font-bold rounded-2xl text-lg transition-transform hover:-translate-y-1 w-full sm:w-auto"
                onClick={() => navigate('/register')}
              >
                Start Scanning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 border-2 border-primary/20 hover:bg-white/5 hover:border-primary/40 text-foreground rounded-2xl text-lg backdrop-blur-sm transition-all w-full sm:w-auto"
                onClick={() => navigate('/dashboard/report/demo')}
              >
                View Demo
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm font-semibold text-muted-foreground/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                24/7 Active Monitoring
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Forensic-Grade Reports
              </div>
            </div>
          </motion.div>

          {/* Staggered Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:h-[600px] hidden lg:block"
          >
            {/* Floating Cards Composition */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 z-20"
            >
              <Card className="w-64 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)] bg-black/80 backdrop-blur-xl">
                <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground">System Secure</CardTitle>
                    <CardDescription className="text-xs text-green-500 font-medium">99.9% Coverage</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 left-10 z-20"
            >
              <Card className="w-72 border border-primary/20 shadow-[0_0_30px_rgba(239,68,68,0.1)] bg-black/80 backdrop-blur-xl">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Vulnerabilities</span>
                    <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">-12%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[70%]" />
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Center Abstract Shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-[2rem] border border-primary/10 shadow-[0_0_50px_rgba(239,68,68,0.1)] backdrop-blur-sm flex items-center justify-center">
              <Network className="w-32 h-32 text-primary/40 animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Features Staggered Grid */}
        <div className="mt-32 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Everything needed for <span className="text-primary">modern defense</span></h2>
            <p className="text-muted-foreground text-lg">Comprehensive tools designed to outsmart sophisticated threats.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="md:mt-0">
              <Card className="h-full border border-primary/10 hover:border-primary/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden group">
                <CardHeader className="p-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <Zap className="w-7 h-7" />
                  </div>
                  <CardTitle className="font-heading text-xl font-bold mb-2">Automated Scanning</CardTitle>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    Deploy AI agents that autonomously navigate and exploit your applications to find deep logic flaws.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="md:mt-12">
              <Card className="h-full border border-blue-500/10 hover:border-blue-500/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden group">
                <CardHeader className="p-8">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <Network className="w-7 h-7" />
                  </div>
                  <CardTitle className="font-heading text-xl font-bold mb-2">Attack Graphing</CardTitle>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    Visualize complex attack chains. Understand exactly how a minor leak can lead to a critical breach.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="md:mt-24">
              <Card className="h-full border border-purple-500/10 hover:border-purple-500/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden group">
                <CardHeader className="p-8">
                  <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                    <FileText className="w-7 h-7" />
                  </div>
                  <CardTitle className="font-heading text-xl font-bold mb-2">Detailed Forensics</CardTitle>
                  <CardDescription className="text-base text-muted-foreground leading-relaxed">
                    Get actionable reports with reproduction steps, severity scoring, and code-level remediation advice.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
