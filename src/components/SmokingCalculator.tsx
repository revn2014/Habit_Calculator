import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cigarette, ArrowLeft, TrendingUp, Calendar, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SmokingCalculator() {
  const [costPerPack, setCostPerPack] = useState<string>('12.00');
  const [cigsPerDay, setCigsPerDay] = useState<string>('10');
  const [cigsPerPack, setCigsPerPack] = useState<string>('20');
  const [daysPerWeek, setDaysPerWeek] = useState<string>('7');
  const [showResults, setShowResults] = useState(false);

  const stats = useMemo(() => {
    const cpp = parseFloat(costPerPack) || 0;
    const cpd = parseFloat(cigsPerDay) || 0;
    const cppk = parseFloat(cigsPerPack) || 20;
    const dpw = parseFloat(daysPerWeek) || 0;

    const packsPerDay = cpd / cppk;
    const dailyCost = packsPerDay * cpp;
    const weekly = dailyCost * dpw;
    const monthly = weekly * 4.33;
    const annual = weekly * 52;
    const tenYear = annual * 10;
    
    // FV = P * [((1 + r)^n - 1) / r]
    const r = 0.07;
    const n = 10;
    const invested = annual * ((Math.pow(1 + r, n) - 1) / r);

    return {
      dailyCost,
      weekly,
      monthly,
      annual,
      tenYear,
      invested
    };
  }, [costPerPack, cigsPerDay, cigsPerPack, daysPerWeek]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const formatCurrencyPrecise = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(val);

  const getReflection = () => {
    const annual = stats.annual;
    if (annual < 2000) {
      return (
        <>
          <p>That’s a few meaningful vacations over time.</p>
          <p>Not tiny. Not enormous.</p>
          <p className="mt-4 italic opacity-60">Just something to be aware of.</p>
        </>
      );
    } else if (annual < 5000) {
      return (
        <>
          <p>That’s a noticeable long-term expense.</p>
          <p>Over a decade, it becomes a significant number.</p>
          <p className="mt-4 italic opacity-60">Smoking often connects to stress, routine, or social moments. This is simply the financial side.</p>
        </>
      );
    } else {
      return (
        <>
          <p>That’s a major financial stream over time.</p>
          <p>Over 10 years, it becomes life-changing money.</p>
          <p className="mt-4 italic opacity-60">Habits can be complicated. This page only looks at the dollars.</p>
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

  const handleDaysPerWeekChange = (val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) {
      setDaysPerWeek('');
      return;
    }
    const clamped = Math.min(7, Math.max(0, num));
    setDaysPerWeek(clamped.toString());
  };

  const smokingFacts = [
    "The average smoker in the U.S. spends between $2,000 and $4,000 per year on cigarettes.",
    "Cigarette prices have historically increased faster than the general rate of inflation.",
    "Many long-term smokers find that the financial cost is one of the most surprising metrics when viewed over a decade.",
    "The cost of a pack varies significantly by region, but the long-term compounding effect remains consistent."
  ];

  const randomFact = useMemo(() => smokingFacts[Math.floor(Math.random() * smokingFacts.length)], []);

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
              <Cigarette className="w-8 h-8 text-sage" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
              What does smoking add up to <span className="text-sage italic">over time?</span>
            </h2>
          </div>
          <div className="space-y-1 text-lg text-ink/60">
            <p>This isn’t a lecture. It’s just the financial side of the habit.</p>
            <p className="text-sm opacity-60 italic">No pressure. Just perspective.</p>
          </div>
        </motion.div>
      </header>

      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-ink/5 shadow-sm mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Cost per pack ($)</label>
            <input 
              type="number" 
              value={costPerPack}
              onChange={(e) => handlePositiveInput(e.target.value, setCostPerPack)}
              min="0"
              step="0.50"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="12.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">How many cigarettes per day?</label>
            <input 
              type="number" 
              value={cigsPerDay}
              onChange={(e) => handlePositiveInput(e.target.value, setCigsPerDay)}
              min="0"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Cigarettes per pack</label>
            <input 
              type="number" 
              value={cigsPerPack}
              onChange={(e) => handlePositiveInput(e.target.value, setCigsPerPack)}
              min="1"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="20"
            />
            <p className="text-[10px] text-ink/40 italic px-1">If you're not sure, a pack typically contains 20 cigarettes.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Days per week you smoke</label>
            <input 
              type="number" 
              value={daysPerWeek}
              onChange={(e) => handleDaysPerWeekChange(e.target.value)}
              min="0"
              max="7"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="7"
            />
          </div>
        </div>

        <button 
          onClick={() => setShowResults(true)}
          className="w-full bg-sage text-white font-bold py-5 rounded-2xl shadow-md hover:bg-sage/90 transition-all active:scale-[0.98]"
        >
          See the numbers
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-sage/5 rounded-3xl border border-sage/10">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <Cigarette className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Daily Cost</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink">
                    About <span className="text-sage">{formatCurrencyPrecise(stats.dailyCost)}</span> per day
                  </div>
                </div>

                <div className="p-8 bg-sage/5 rounded-3xl border border-sage/10">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <Calendar className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Weekly Spend</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink">
                    Around <span className="text-sage">{formatCurrency(stats.weekly)}</span> per week
                  </div>
                </div>

                <div className="p-8 bg-sage/5 rounded-3xl border border-sage/10">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Monthly Spend</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink">
                    Roughly <span className="text-sage">{formatCurrency(stats.monthly)}</span> per month
                  </div>
                </div>

                <div className="p-8 bg-sage/5 rounded-3xl border border-sage/10">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">10-Year View</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink">
                    Over 10 years, that’s <span className="text-sage">{formatCurrency(stats.tenYear)}</span>
                  </div>
                  <p className="mt-4 text-sm text-ink/60 italic">Small daily habits scale quickly.</p>
                </div>

                <div className="p-8 bg-sage/10 rounded-3xl border border-sage/20 relative overflow-hidden md:col-span-2">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">If Invested at 7%</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink mb-4">
                    If invested at 7% annually, that could grow to <span className="text-sage">{formatCurrency(stats.invested)}</span>
                  </div>
                  <p className="text-sm text-ink/60 italic">Compounding works quietly in the background.</p>
                </div>
              </div>

              <div className="bg-sage/5 border border-sage/10 rounded-[2.5rem] p-10 md:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-serif font-bold mb-6">Food for thought</h3>
                  <div className="text-lg text-ink/70 leading-relaxed space-y-2">
                    {getReflection()}
                  </div>
                  <div className="mt-10 pt-8 border-t border-ink/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-sage mb-2">For context</p>
                    <p className="text-sm text-ink/50 italic">{randomFact}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-12 pt-12">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-serif font-bold">Curious what small adjustments might look like?</h3>
                  <p className="text-ink/50">Change is personal. Here’s what the math says.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Keep the Habit */}
                  <div className="p-8 bg-white rounded-3xl border border-ink/5 shadow-sm flex flex-col h-full text-center">
                    <h4 className="text-xl font-serif font-bold mb-4 min-h-[3.5rem] flex items-center justify-center">Keep the Habit</h4>
                    <p className="text-sm text-ink/60 mb-8 flex-grow">
                      Keep everything the same. Now you know the numbers.
                    </p>
                    <div className="space-y-3 pt-4 border-t border-ink/5">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">Yearly</span>
                        <span className="font-bold">{formatCurrency(stats.annual)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">10 Years</span>
                        <span className="font-bold">{formatCurrency(stats.tenYear)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cut in Half */}
                  <div className="p-8 bg-white rounded-3xl border border-ink/5 shadow-sm flex flex-col h-full text-center">
                    <h4 className="text-xl font-serif font-bold mb-4 min-h-[3.5rem] flex items-center justify-center">Cut in Half</h4>
                    <p className="text-sm text-ink/60 mb-8 flex-grow">
                      Cutting consumption in half would reduce spending to <span className="text-ink font-bold">{formatCurrency(stats.annual / 2)}</span> per year.
                    </p>
                    <div className="space-y-3 pt-4 border-t border-ink/5">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">10 Years</span>
                        <span className="font-bold">{formatCurrency(stats.tenYear / 2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">Invested (7%)</span>
                        <span className="font-bold">{formatCurrency(stats.invested / 2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quit Entirely */}
                  <div className="p-8 bg-white rounded-3xl border border-ink/5 shadow-sm flex flex-col h-full text-center">
                    <h4 className="text-xl font-serif font-bold mb-4 min-h-[3.5rem] flex items-center justify-center">Quit Entirely</h4>
                    <p className="text-sm text-ink/60 mb-8 flex-grow">
                      Stopping completely would free up <span className="text-ink font-bold">{formatCurrency(stats.annual)}</span> per year.
                    </p>
                    <div className="space-y-3 pt-4 border-t border-ink/5">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">10 Years</span>
                        <span className="font-bold">{formatCurrency(stats.tenYear)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">Invested (7%)</span>
                        <span className="font-bold">{formatCurrency(stats.invested)}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
