import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, ArrowLeft, TrendingUp, Calendar, Clock, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LotteryCalculator() {
  const [costPerTicket, setCostPerTicket] = useState<string>('2.00');
  const [ticketsPerWeek, setTicketsPerWeek] = useState<string>('5');
  const [playEveryWeek, setPlayEveryWeek] = useState<boolean>(true);
  const [weeksPerYear, setWeeksPerYear] = useState<string>('52');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scratchCardCost, setScratchCardCost] = useState<string>('0');
  const [scratchCardsPerWeek, setScratchCardsPerWeek] = useState<string>('0');
  
  const [showResults, setShowResults] = useState(false);

  const stats = useMemo(() => {
    const cpt = parseFloat(costPerTicket) || 0;
    const tpw = parseFloat(ticketsPerWeek) || 0;
    const wpy = playEveryWeek ? 52 : (parseFloat(weeksPerYear) || 0);
    
    const scc = parseFloat(scratchCardCost) || 0;
    const scpw = parseFloat(scratchCardsPerWeek) || 0;

    const weeklyBase = cpt * tpw;
    const weeklyScratch = scc * scpw;
    const weeklyTotal = weeklyBase + weeklyScratch;
    
    const annual = weeklyTotal * wpy;
    const monthly = annual / 12;
    const tenYear = annual * 10;
    
    // FV = P * [((1 + r)^n - 1) / r]
    const r = 0.07;
    const n = 10;
    const invested = annual * ((Math.pow(1 + r, n) - 1) / r);

    return {
      weekly: weeklyTotal,
      monthly,
      annual,
      tenYear,
      invested
    };
  }, [costPerTicket, ticketsPerWeek, playEveryWeek, weeksPerYear, scratchCardCost, scratchCardsPerWeek]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const getReflection = () => {
    const annual = stats.annual;
    if (annual < 500) {
      return (
        <>
          <p>That’s the cost of a short weekend getaway each year.</p>
          <p>Not enormous — but steady.</p>
          <p className="mt-4 italic opacity-60">For many people, the value isn’t just the payout. It’s the possibility.</p>
        </>
      );
    } else if (annual < 2000) {
      return (
        <>
          <p>That’s a noticeable long-term expense.</p>
          <p>Over time, it becomes a meaningful number.</p>
          <p className="mt-4 italic opacity-60">The dream costs less than most forms of entertainment — but repetition is what builds the total.</p>
        </>
      );
    } else {
      return (
        <>
          <p>That’s a significant financial stream over time.</p>
          <p>Over a decade, it becomes life-shaping money.</p>
          <p className="mt-4 italic opacity-60">The lottery sells possibility. This page just shows the arithmetic.</p>
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

  const lotteryFacts = [
    "Lottery ticket sales in the United States exceeded $100 billion in recent years.",
    "The odds of winning a major Powerball or Mega Millions jackpot are typically around 1 in 292 million or 1 in 302 million.",
    "Historically, lottery spending is often viewed as a form of low-cost entertainment with a high-upside dream.",
    "Many players find that tracking their total spending over a decade provides a new perspective on the 'cost of hope'."
  ];

  const randomFact = useMemo(() => lotteryFacts[Math.floor(Math.random() * lotteryFacts.length)], []);

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
              <Ticket className="w-8 h-8 text-sage" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
              What does playing the lottery <span className="text-sage italic">add up to?</span>
            </h2>
          </div>
          <div className="space-y-1 text-lg text-ink/60">
            <p>The dream is exciting. This just shows the long-term math.</p>
            <p className="text-sm opacity-60 italic">No judgment. Just perspective.</p>
          </div>
        </motion.div>
      </header>

      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-ink/5 shadow-sm mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Cost per ticket ($)</label>
            <input 
              type="number" 
              value={costPerTicket}
              onChange={(e) => handlePositiveInput(e.target.value, setCostPerTicket)}
              min="0"
              step="1"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="2.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">How many tickets per week?</label>
            <input 
              type="number" 
              value={ticketsPerWeek}
              onChange={(e) => handlePositiveInput(e.target.value, setTicketsPerWeek)}
              min="0"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="5"
            />
          </div>
          
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40 block">Do you play every week?</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setPlayEveryWeek(true)}
                className={cn("flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border", playEveryWeek ? "bg-sage text-white border-sage shadow-sm" : "bg-sage/5 text-ink/40 border-transparent hover:bg-sage/10")}
              >
                Yes (52 weeks)
              </button>
              <button 
                onClick={() => setPlayEveryWeek(false)}
                className={cn("flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all border", !playEveryWeek ? "bg-sage text-white border-sage shadow-sm" : "bg-sage/5 text-ink/40 border-transparent hover:bg-sage/10")}
              >
                No (Custom)
              </button>
            </div>
          </div>

          {!playEveryWeek && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Weeks per year</label>
              <input 
                type="number" 
                value={weeksPerYear}
                onChange={(e) => handlePositiveInput(e.target.value, setWeeksPerYear)}
                min="1"
                max="52"
                className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
                placeholder="26"
              />
            </motion.div>
          )}
        </div>

        <div className="mb-10">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sage hover:opacity-80 transition-opacity"
          >
            <div className={cn("w-5 h-5 rounded border border-sage flex items-center justify-center transition-colors", showAdvanced ? "bg-sage text-white" : "bg-transparent")}>
              {showAdvanced && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            Include scratch cards or other lottery games
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Cost per scratch card ($)</label>
                    <input 
                      type="number" 
                      value={scratchCardCost}
                      onChange={(e) => handlePositiveInput(e.target.value, setScratchCardCost)}
                      min="0"
                      className="w-full bg-sage/5 border-none rounded-xl p-3 text-lg font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ink/40">How many per week?</label>
                    <input 
                      type="number" 
                      value={scratchCardsPerWeek}
                      onChange={(e) => handlePositiveInput(e.target.value, setScratchCardsPerWeek)}
                      min="0"
                      className="w-full bg-sage/5 border-none rounded-xl p-3 text-lg font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                    <span className="text-xs font-bold uppercase tracking-widest">10-Year View</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink">
                    Over 10 years, that’s <span className="text-sage">{formatCurrency(stats.tenYear)}</span>
                  </div>
                  <p className="mt-4 text-sm text-ink/60 italic">Small chances repeated many times add up.</p>
                </div>

                <div className="p-8 bg-sage/10 rounded-3xl border border-sage/20 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">If Invested at 7%</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink mb-4">
                    It could grow to <span className="text-sage">{formatCurrency(stats.invested)}</span>
                  </div>
                  <p className="text-sm text-ink/60 italic">Hope compounds too — just differently.</p>
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
                    <p className="text-sm text-ink/50 italic">{randomFact}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-12 pt-12">
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-serif font-bold">Curious how small changes affect the math?</h3>
                  <p className="text-ink/50">You don’t have to stop playing. But here’s how it shifts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Keep Playing */}
                  <div className="p-8 bg-white rounded-3xl border border-ink/5 shadow-sm flex flex-col h-full text-center">
                    <h4 className="text-xl font-serif font-bold mb-4 min-h-[3.5rem] flex items-center justify-center">Keep Playing</h4>
                    <p className="text-sm text-ink/60 mb-8 flex-grow">
                      Keep everything the same. Now you know the long-term cost of the dream.
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
                      Cutting your tickets in half would bring your weekly spend to <span className="text-ink font-bold">{formatCurrency(stats.weekly / 2)}</span>
                    </p>
                    <div className="space-y-3 pt-4 border-t border-ink/5">
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">Yearly</span>
                        <span className="font-bold">{formatCurrency(stats.annual / 2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-50">10 Years</span>
                        <span className="font-bold">{formatCurrency(stats.tenYear / 2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stop Playing */}
                  <div className="p-8 bg-white rounded-3xl border border-ink/5 shadow-sm flex flex-col h-full text-center">
                    <h4 className="text-xl font-serif font-bold mb-4 min-h-[3.5rem] flex items-center justify-center">Stop Playing</h4>
                    <p className="text-sm text-ink/60 mb-8 flex-grow">
                      Stopping entirely would free up <span className="text-ink font-bold">{formatCurrency(stats.annual)}</span> per year.
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
