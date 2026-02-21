import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowLeft, TrendingUp, Calendar, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EnergyDrinkCalculator() {
  const [cost, setCost] = useState<string>('3.50');
  const [perDay, setPerDay] = useState<string>('1');
  const [daysPerWeek, setDaysPerWeek] = useState<string>('5');
  const [showResults, setShowResults] = useState(false);

  const stats = useMemo(() => {
    const c = parseFloat(cost) || 0;
    const p = parseFloat(perDay) || 0;
    const d = parseFloat(daysPerWeek) || 0;

    const weekly = c * p * d;
    const monthly = weekly * 4.33;
    const annual = weekly * 52;
    const tenYear = annual * 10;
    
    // FV = P * [((1 + r)^n - 1) / r]
    const r = 0.07;
    const n = 10;
    const invested = annual * ((Math.pow(1 + r, n) - 1) / r);

    return {
      weekly,
      monthly,
      annual,
      tenYear,
      invested
    };
  }, [cost, perDay, daysPerWeek]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const getReflection = () => {
    const annual = stats.annual;
    if (annual < 800) {
      return (
        <>
          <p>That’s the cost of a short weekend trip each year.</p>
          <p>Not dramatic. But not invisible either.</p>
        </>
      );
    } else if (annual < 2500) {
      return (
        <>
          <p>That’s a solid chunk of a vacation fund.</p>
          <p>Or a meaningful boost to an investment account.</p>
          <p className="mt-4 italic opacity-60">Small daily boosts can grow into big long-term totals.</p>
        </>
      );
    } else {
      return (
        <>
          <p>That’s a noticeable financial lever over time.</p>
          <p>Over a decade, it’s a serious number.</p>
          <p className="mt-4 italic opacity-60">Of course — productivity and convenience matter too.</p>
        </>
      );
    }
  };

  const handleCostChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setCost('');
      return;
    }
    setCost(Math.max(0, num).toString());
  };

  const handlePerDayChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setPerDay('');
      return;
    }
    setPerDay(Math.max(0, num).toString());
  };

  const handleDaysPerWeekChange = (val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) {
      setDaysPerWeek('');
      return;
    }
    const clamped = Math.min(7, Math.max(1, num));
    setDaysPerWeek(clamped.toString());
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
              <Zap className="w-8 h-8 text-sage" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
              What does your energy drink habit <span className="text-sage italic">really</span> add up to?
            </h2>
          </div>
          <div className="space-y-1 text-lg text-ink/60">
            <p>This isn’t about cutting back. It’s just about seeing the bigger picture.</p>
            <p className="text-sm opacity-60 italic">Focus and convenience are valuable. So is awareness.</p>
          </div>
        </motion.div>
      </header>

      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-ink/5 shadow-sm mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Cost per can/bottle ($)</label>
            <input 
              type="number" 
              value={cost}
              onChange={(e) => handleCostChange(e.target.value)}
              min="0"
              step="0.50"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="3.50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">How many per day?</label>
            <input 
              type="number" 
              value={perDay}
              onChange={(e) => handlePerDayChange(e.target.value)}
              min="0"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">How many days per week?</label>
            <input 
              type="number" 
              value={daysPerWeek}
              onChange={(e) => handleDaysPerWeekChange(e.target.value)}
              min="1"
              max="7"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="5"
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
                    <Calendar className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Weekly Spend</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink">
                    About <span className="text-sage">{formatCurrency(stats.weekly)}</span> per week
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
                    <span className="text-xs font-bold uppercase tracking-widest">Long-Term (10 Years)</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink">
                    Over 10 years, that’s <span className="text-sage">{formatCurrency(stats.tenYear)}</span>
                  </div>
                </div>

                <div className="p-8 bg-sage/10 rounded-3xl border border-sage/20 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">If Invested at 7%</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink mb-4">
                    It could grow to <span className="text-sage">{formatCurrency(stats.invested)}</span>
                  </div>
                  <p className="text-sm text-ink/60 italic">Energy is instant. Compounding isn’t.</p>
                </div>
              </div>

              <div className="bg-sage/5 border border-sage/10 rounded-[2.5rem] p-10 md:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-serif font-bold mb-6">Food for thought</h3>
                  <div className="text-lg text-ink/70 leading-relaxed space-y-2">
                    {getReflection()}
                  </div>
                  <div className="mt-10 pt-8 border-t border-sage/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-sage mb-2">For context</p>
                    <p className="text-sm text-ink/50 italic">Many daily energy drink users spend between $1,000–$2,000 per year.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-12 pt-12">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-serif font-bold">Curious what small adjustments would look like?</h3>
                  <p className="text-ink/50">You don’t have to change anything. But here’s what the math shifts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Keep the Habit */}
                  <div className="p-8 bg-white rounded-3xl border border-ink/5 shadow-sm flex flex-col h-full">
                    <h4 className="text-xl font-serif font-bold mb-4">Keep the Habit</h4>
                    <p className="text-sm text-ink/60 mb-8 flex-grow">
                      Keep everything the same. Now you know what it costs — and you can plan around it.
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
                  <div className="p-8 bg-white rounded-3xl border border-ink/5 shadow-sm flex flex-col h-full">
                    <h4 className="text-xl font-serif font-bold mb-4">Cut in Half</h4>
                    <p className="text-sm text-ink/60 mb-8 flex-grow">
                      Cutting it in half would bring your yearly spend to <span className="text-ink font-bold">{formatCurrency(stats.annual / 2)}</span>
                    </p>
                    <div className="space-y-3 pt-4 border-t border-ink/5">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">10 Years</span>
                        <span className="font-bold">{formatCurrency(stats.tenYear / 2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">Invested at 7%</span>
                        <span className="font-bold">{formatCurrency(stats.invested / 2)}</span>
                      </div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-sage mt-2">Same routine. Lighter impact.</p>
                    </div>
                  </div>

                  {/* Quit Entirely */}
                  <div className="p-8 bg-white rounded-3xl border border-ink/5 shadow-sm flex flex-col h-full">
                    <h4 className="text-xl font-serif font-bold mb-4">Quit Entirely</h4>
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
                      <p className="text-[10px] uppercase font-bold tracking-widest text-sage mt-2">Energy drinks often fill a real need.</p>
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
