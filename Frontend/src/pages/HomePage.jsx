import { Link } from "react-router";
import { ArrowRight, Sparkles, MessageSquare, BarChart3, Zap, CheckCircle2, Quote } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../features/auth/hooks/useAuth";

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030712] text-zinc-900 dark:text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden transition-colors duration-300 animate-in fade-in zoom-in-95 duration-700 ease-out">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Sparkles size={18} className="text-white" />
          </div>
          Project LOOP
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <a href="#features" className="hover:text-emerald-600 dark:hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-white transition-colors">How it Works</a>
          <a href="#testimonials" className="hover:text-emerald-600 dark:hover:text-white transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            to={isAuthenticated ? "/dashboard" : "/login"} 
            className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-sm font-bold rounded-full transition-all flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20"
          >
            {isAuthenticated ? "Dashboard" : "Get Started"} <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        
        
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-8 shadow-sm">
          <Zap size={16} className="text-amber-500 dark:text-amber-400" /> V1.0 is now live for Early Access
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Close the Feedback Loop <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
            Powered by AI
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Transform scattered customer feedback into actionable product insights instantly. Stop guessing and start building what your users actually want.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/dashboard" 
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all w-full sm:w-auto text-lg flex items-center justify-center gap-2 group shadow-lg shadow-emerald-600/25"
          >
            Go to Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-semibold rounded-full transition-all w-full sm:w-auto text-lg border border-zinc-200 dark:border-zinc-700 shadow-sm">
            View Live Demo
          </button>
        </div>
      </main>

      {/* Social Proof / Logos */}
      <section className="container mx-auto px-6 py-10 relative z-10 opacity-70 grayscale">
        <p className="text-center text-sm font-semibold text-zinc-500 mb-6 uppercase tracking-wider">Trusted by innovative product teams</p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
          <div className="text-xl font-bold font-serif">Acme Corp</div>
          <div className="text-xl font-bold tracking-tighter">GlobalTech</div>
          <div className="text-xl font-bold italic">Nexus</div>
          <div className="text-xl font-bold tracking-widest">ZENITH</div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="container mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to scale</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">No more spreadsheets. No more reading 1000s of reviews manually. Let our AI do the heavy lifting.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">Auto Categorization</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Our AI automatically tags and sorts incoming feedback into logical buckets like "Bugs", "Feature Requests", and "Pricing".</p>
          </div>
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-teal-300 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">Sentiment Analysis</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Instantly know how your users feel with AI-driven emotion detection. Catch angry users and churn risks before they leave.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">Actionable Reports</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Turn raw feedback data into beautiful charts and clear action items that you can present directly to your stakeholders.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-emerald-50 dark:bg-zinc-900/30 border-y border-emerald-100 dark:border-zinc-800/50 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How LOOP works</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">Three simple steps to go from raw feedback to shipped features.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 text-2xl font-bold text-emerald-600">1</div>
              <h3 className="text-xl font-bold mb-3">Connect Sources</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Import feedback from Twitter, Intercom, App Store, and directly from your app.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 text-2xl font-bold text-emerald-600">2</div>
              <h3 className="text-xl font-bold mb-3">AI Processes Data</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Our LLM engine groups similar feedback, removes noise, and scores severity.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-6 text-2xl font-bold text-emerald-600">3</div>
              <h3 className="text-xl font-bold mb-3">Ship the Right Things</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Your roadmap is now prioritized by actual user needs, backed by data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-6 py-24 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Loved by Product Managers</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-white dark:bg-zinc-900/80 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
            <Quote size={40} className="text-emerald-200 dark:text-emerald-900/50 absolute top-6 right-6" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl">SJ</div>
              <div>
                <h4 className="font-bold">Sarah Jenkins</h4>
                <p className="text-sm text-zinc-500">VP of Product, TechFlow</p>
              </div>
            </div>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 italic">"Project LOOP has completely transformed our triage process. What used to take our product team 10 hours a week now takes 15 minutes. The AI sentiment analysis is terrifyingly accurate."</p>
          </div>
          <div className="p-8 bg-white dark:bg-zinc-900/80 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
            <Quote size={40} className="text-emerald-200 dark:text-emerald-900/50 absolute top-6 right-6" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-xl">MP</div>
              <div>
                <h4 className="font-bold">Mike Peterson</h4>
                <p className="text-sm text-zinc-500">Founder, SaaSSync</p>
              </div>
            </div>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 italic">"We caught a major bug that was causing churn because LOOP flagged a spike in angry sentiment before our engineering team even noticed the error logs. It pays for itself."</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-6 py-20 relative z-10">
        <div className="p-12 md:p-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl text-center text-white shadow-2xl shadow-emerald-600/20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to understand your users?</h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">Join 1,000+ companies using Project LOOP to turn customer feedback into their biggest competitive advantage.</p>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-900 hover:bg-zinc-50 font-bold rounded-full transition-all text-lg shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Start your 14-day free trial <ArrowRight size={20} />
          </Link>
          <p className="mt-6 text-sm text-emerald-200 flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 pt-20 pb-10 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight mb-6 text-zinc-900 dark:text-white">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                Project LOOP
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-xs">
                The AI-powered feedback management platform for modern product teams.
              </p>
              <div className="flex gap-4 text-zinc-400 font-medium text-sm mt-2">
                <a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">GitHub</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-zinc-900 dark:text-white">Product</h4>
              <ul className="space-y-4 text-zinc-500 dark:text-zinc-400">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-zinc-900 dark:text-white">Resources</h4>
              <ul className="space-y-4 text-zinc-500 dark:text-zinc-400">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Guides</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-zinc-900 dark:text-white">Company</h4>
              <ul className="space-y-4 text-zinc-500 dark:text-zinc-400">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
            <p>© 2026 Project LOOP Inc. All rights reserved.</p>
            <div className="flex gap-6">
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
