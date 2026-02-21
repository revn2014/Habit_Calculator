import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, ArrowLeft, TrendingUp, Calendar, Clock, Sparkles, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Subscription {
  id: string;
  name: string;
  cost: string;
  isAnnual: boolean;
  isActive: boolean;
}

export default function SubscriptionCalculator() {
  const [mode, setMode] = useState<'simple' | 'expanded'>('simple');
  const [totalMonthly, setTotalMonthly] = useState<string>('50');
  const [isTotalAnnual, setIsTotalAnnual] = useState(false);
  const [projectionYears, setProjectionYears] = useState<string>('10');
  
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: '1', name: 'Netflix', cost: '15.49', isAnnual: false, isActive: true },
    { id: '2', name: 'Spotify', cost: '10.99', isAnnual: false, isActive: true },
    { id: '3', name: 'Gym', cost: '60.00', isAnnual: false, isActive: true },
  ]);

  const [showResults, setShowResults] = useState(false);
  const [decisionMode, setDecisionMode] = useState<'keep' | 'half' | 'audit'>('keep');

  const stats = useMemo(() => {
    let monthlyTotal = 0;
    
    if (mode === 'simple') {
      const val = parseFloat(totalMonthly) || 0;
      monthlyTotal = isTotalAnnual ? val / 12 : val;
    } else {
      subscriptions.forEach(sub => {
        if (sub.isActive) {
          const cost = parseFloat(sub.cost) || 0;
          monthlyTotal += sub.isAnnual ? cost / 12 : cost;
        }
      });
    }

    const years = parseFloat(projectionYears) || 10;
    const annual = monthlyTotal * 12;
    const totalProjected = annual * years;
    
    // FV = P * [((1 + r)^n - 1) / r]
    const r = 0.07;
    const n = years;
    const invested = annual * ((Math.pow(1 + r, n) - 1) / r);

    return {
      monthly: monthlyTotal,
      annual,
      totalProjected,
      invested,
      years
    };
  }, [mode, totalMonthly, isTotalAnnual, projectionYears, subscriptions]);

  const addSubscription = () => {
    const newSub: Subscription = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      cost: '',
      isAnnual: false,
      isActive: true
    };
    setSubscriptions([...subscriptions, newSub]);
  };

  const removeSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const formatCurrencyPrecise = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(val);

  const getReflection = () => {
    const annual = stats.annual;
    if (annual < 500) {
      return (
        <>
          <p>“Not bad at all. You’re being intentional.”</p>
          <p className="mt-4 italic opacity-60">Subscriptions are like houseplants. One is lovely. Twelve require maintenance.</p>
        </>
      );
    } else if (annual < 1500) {
      return (
        <>
          <p>“Very common range. Most people don’t even realize this adds up.”</p>
          <p className="mt-4 italic opacity-60">Small monthly payments are designed to be forgotten. Awareness is the first step.</p>
        </>
      );
    } else {
      return (
        <>
          <p>“You’re funding a pretty impressive digital lifestyle. Totally fine — as long as it’s intentional.”</p>
          <p className="mt-4 italic opacity-60">When was the last time you used every one of these?</p>
        </>
      );
    }
  };

  const handlePositiveInput = (val: string, setter: (v: string) => void) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setter('');
      return;
    }
    setter(Math.max(0, num).toString());
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-sage hover:underline mb-12">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all calculators
      </Link>

      <header className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-sage/10 rounded-2xl flex-shrink-0 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-sage" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
              How much are your subscriptions <span className="text-sage italic">really costing you?</span>
            </h2>
          </div>
          <div className="space-y-1 text-lg text-ink/60">
            <p>Streaming, apps, memberships, software — individually they’re small. Together? Let’s find out.</p>
            <p className="text-sm opacity-60 italic">No guilt, no pressure — just a quick peek together.</p>
          </div>
        </motion.div>
      </header>

      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-ink/5 shadow-sm mb-12">
        <div className="flex gap-4 mb-10">
          <button 
            onClick={() => setMode('simple')}
            className={cn("flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border", mode === 'simple' ? "bg-sage text-white border-sage shadow-sm" : "bg-sage/5 text-ink/40 border-transparent hover:bg-sage/10")}
          >
            Simple Mode
          </button>
          <button 
            onClick={() => setMode('expanded')}
            className={cn("flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border", mode === 'expanded' ? "bg-sage text-white border-sage shadow-sm" : "bg-sage/5 text-ink/40 border-transparent hover:bg-sage/10")}
          >
            Expanded Mode
          </button>
        </div>

        {mode === 'simple' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Total Subscription Cost ($)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={totalMonthly}
                  onChange={(e) => handlePositiveInput(e.target.value, setTotalMonthly)}
                  min="0"
                  className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
                  placeholder="50.00"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                  <button 
                    onClick={() => setIsTotalAnnual(false)}
                    className={cn("px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", !isTotalAnnual ? "bg-sage text-white" : "bg-ink/5 text-ink/40")}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setIsTotalAnnual(true)}
                    className={cn("px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", isTotalAnnual ? "bg-sage text-white" : "bg-ink/5 text-ink/40")}
                  >
                    Annual
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Years to project</label>
              <input 
                type="number" 
                value={projectionYears}
                onChange={(e) => handlePositiveInput(e.target.value, setProjectionYears)}
                min="1"
                className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
                placeholder="10"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6 mb-10">
            <div className="hidden md:grid grid-cols-[1fr_120px_140px_40px] gap-4 px-4 text-[10px] font-bold uppercase tracking-widest text-ink/40">
              <div>Subscription Name</div>
              <div>Cost ($)</div>
              <div>Billing</div>
              <div></div>
            </div>
            <AnimatePresence initial={false}>
              {subscriptions.map((sub) => (
                <motion.div 
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_120px_140px_40px] gap-4 items-center bg-sage/5 p-4 rounded-2xl border border-transparent hover:border-sage/10 transition-all"
                >
                  <input 
                    type="text"
                    value={sub.name}
                    onChange={(e) => updateSubscription(sub.id, { name: e.target.value })}
                    placeholder="e.g. Netflix"
                    className="bg-white border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-sage/20 outline-none"
                  />
                  <input 
                    type="number"
                    value={sub.cost}
                    onChange={(e) => handlePositiveInput(e.target.value, (v) => updateSubscription(sub.id, { cost: v }))}
                    placeholder="0.00"
                    min="0"
                    className="bg-white border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-sage/20 outline-none"
                  />
                  <div className="flex gap-1 bg-white p-1 rounded-xl">
                    <button 
                      onClick={() => updateSubscription(sub.id, { isAnnual: false })}
                      className={cn("flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all", !sub.isAnnual ? "bg-sage text-white shadow-sm" : "text-ink/40")}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => updateSubscription(sub.id, { isAnnual: true })}
                      className={cn("flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all", sub.isAnnual ? "bg-sage text-white shadow-sm" : "text-ink/40")}
                    >
                      Annual
                    </button>
                  </div>
                  <button 
                    onClick={() => removeSubscription(sub.id)}
                    className="p-2 text-ink/20 hover:text-red-400 transition-colors flex justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            <button 
              onClick={addSubscription}
              className="w-full py-4 border-2 border-dashed border-sage/20 rounded-2xl text-sage font-bold text-sm hover:bg-sage/5 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add another subscription
            </button>
          </div>
        )}

        <button 
          onClick={() => setShowResults(true)}
          className="w-full bg-sage text-white font-bold py-5 rounded-2xl shadow-md hover:bg-sage/90 transition-all active:scale-[0.98]"
        >
          Show me the total
        </button>
      </section>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="space-y-8 mb-20">
              <div className="p-8 bg-sage/10 rounded-[2.5rem] border border-sage/20 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-sage mb-2 block">Your Subscription Snapshot</span>
                <div className="text-5xl font-serif font-bold text-ink">
                  You spend <span className="text-sage">{formatCurrency(stats.annual)}</span> per year
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-sage/5 rounded-3xl border border-sage/10">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Monthly Total</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink">
                    {formatCurrencyPrecise(stats.monthly)}
                  </div>
                </div>

                <div className="p-8 bg-sage/5 rounded-3xl border border-sage/10">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">{stats.years}-Year Total</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink">
                    {formatCurrency(stats.totalProjected)}
                  </div>
                </div>

                <div className="p-8 bg-sage/10 rounded-3xl border border-sage/20 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">If Invested (7%)</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink">
                    {formatCurrency(stats.invested)}
                  </div>
                </div>
              </div>

              <div className="bg-sage/5 border border-sage/10 rounded-[2.5rem] p-10 md:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-serif font-bold mb-6">Food for thought</h3>
                  <div className="text-lg text-ink/70 leading-relaxed space-y-2">
                    {getReflection()}
                  </div>
                </div>
              </div>

              <div className="space-y-12 pt-12">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-serif font-bold">What would you like to do?</h3>
                  <p className="text-ink/50">Awareness is the win. But here are some options.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Keep Everything */}
                  <button 
                    onClick={() => setDecisionMode('keep')}
                    className={cn("p-8 rounded-3xl border transition-all flex flex-col h-full text-center", decisionMode === 'keep' ? "bg-sage text-white border-sage shadow-lg scale-[1.02]" : "bg-white border-ink/5 shadow-sm hover:border-sage/20")}
                  >
                    <h4 className="text-xl font-serif font-bold mb-4 min-h-[3.5rem] flex items-center justify-center">Keep Everything</h4>
                    <p className={cn("text-sm mb-8 flex-grow", decisionMode === 'keep' ? "text-white/80" : "text-ink/60")}>
                      “Cool. Awareness is the win.”
                    </p>
                    <div className={cn("pt-4 border-t", decisionMode === 'keep' ? "border-white/20" : "border-ink/5")}>
                      <CheckCircle2 className="w-6 h-6 mx-auto" />
                    </div>
                  </button>

                  {/* Cut in Half */}
                  <button 
                    onClick={() => setDecisionMode('half')}
                    className={cn("p-8 rounded-3xl border transition-all flex flex-col h-full text-center", decisionMode === 'half' ? "bg-sage text-white border-sage shadow-lg scale-[1.02]" : "bg-white border-ink/5 shadow-sm hover:border-sage/20")}
                  >
                    <h4 className="text-xl font-serif font-bold mb-4 min-h-[3.5rem] flex items-center justify-center">Cut Some in Half</h4>
                    <p className={cn("text-sm mb-8 flex-grow", decisionMode === 'half' ? "text-white/80" : "text-ink/60")}>
                      “What if you paused or rotated subscriptions?”
                    </p>
                    <div className={cn("pt-4 border-t", decisionMode === 'half' ? "border-white/20" : "border-ink/5")}>
                      <TrendingUp className="w-6 h-6 mx-auto" />
                    </div>
                  </button>

                  {/* Audit & Trim */}
                  <button 
                    onClick={() => setDecisionMode('audit')}
                    className={cn("p-8 rounded-3xl border transition-all flex flex-col h-full text-center", decisionMode === 'audit' ? "bg-sage text-white border-sage shadow-lg scale-[1.02]" : "bg-white border-ink/5 shadow-sm hover:border-sage/20")}
                  >
                    <h4 className="text-xl font-serif font-bold mb-4 min-h-[3.5rem] flex items-center justify-center">Audit & Trim</h4>
                    <p className={cn("text-sm mb-8 flex-grow", decisionMode === 'audit' ? "text-white/80" : "text-ink/60")}>
                      “Let’s see what happens if you cancel a few.”
                    </p>
                    <div className={cn("pt-4 border-t", decisionMode === 'audit' ? "border-white/20" : "border-ink/5")}>
                      <Trash2 className="w-6 h-6 mx-auto" />
                    </div>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {decisionMode === 'half' && (
                    <motion.div 
                      key="half"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-8 bg-sage/5 rounded-[2.5rem] border border-sage/10"
                    >
                      <div className="text-center mb-8">
                        <h4 className="text-2xl font-serif font-bold mb-2">The "Half" Scenario</h4>
                        <p className="text-ink/60 italic text-sm">Rotating subscriptions quarterly or sharing plans can often cut costs in half.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-xs font-bold uppercase tracking-widest text-sage mb-1">New Monthly</div>
                          <div className="text-3xl font-serif font-bold">{formatCurrencyPrecise(stats.monthly / 2)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-bold uppercase tracking-widest text-sage mb-1">New 10-Year</div>
                          <div className="text-3xl font-serif font-bold">{formatCurrency(stats.totalProjected / 2)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-bold uppercase tracking-widest text-sage mb-1">New Invested</div>
                          <div className="text-3xl font-serif font-bold">{formatCurrency(stats.invested / 2)}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {decisionMode === 'audit' && (
                    <motion.div 
                      key="audit"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-8 bg-sage/5 rounded-[2.5rem] border border-sage/10"
                    >
                      <div className="text-center mb-8">
                        <h4 className="text-2xl font-serif font-bold mb-6">Live Audit</h4>
                        <div className="space-y-1">
                          <p className="text-ink/60 italic text-sm">Uncheck subscriptions to see the instant impact on your long-term math.</p>
                          {mode === 'simple' && (
                            <p className="text-ink/40 italic text-sm">Switch to "Expanded Mode" above to audit individual subscriptions.</p>
                          )}
                        </div>
                      </div>
                      
                      {mode === 'simple' ? null : (
                        <div className="space-y-4 max-w-xl mx-auto">
                          {subscriptions.map(sub => (
                            <button 
                              key={sub.id}
                              onClick={() => updateSubscription(sub.id, { isActive: !sub.isActive })}
                              className={cn("w-full flex items-center justify-between p-4 rounded-2xl border transition-all", sub.isActive ? "bg-white border-sage/20 shadow-sm" : "bg-ink/5 border-transparent opacity-50")}
                            >
                              <div className="flex items-center gap-3">
                                {sub.isActive ? <CheckCircle2 className="w-5 h-5 text-sage" /> : <XCircle className="w-5 h-5 text-ink/20" />}
                                <span className="font-medium">{sub.name || 'Unnamed Subscription'}</span>
                              </div>
                              <span className="font-bold">{formatCurrencyPrecise(parseFloat(sub.cost) || 0)}{sub.isAnnual ? '/yr' : '/mo'}</span>
                            </button>
                          ))}
                          <div className="mt-8 pt-8 border-t border-sage/10 grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-sage mb-1">New Annual</div>
                              <div className="text-2xl font-serif font-bold">{formatCurrency(stats.annual)}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-sage mb-1">New Invested</div>
                              <div className="text-2xl font-serif font-bold">{formatCurrency(stats.invested)}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-20 pb-12 text-center space-y-6">
                <div className="max-w-2xl mx-auto space-y-4">
                  <p className="text-xl font-serif italic text-ink/80">
                    Awareness creates options. Options create flexibility.
                  </p>
                  <p className="text-ink/60">Small habits shape big numbers — slowly.</p>
                </div>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-8 py-4 bg-sage text-white font-bold rounded-full shadow-md hover:bg-sage/90 transition-all"
                >
                  Try another habit calculator <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
