import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, ArrowLeft, TrendingUp, Calendar, Clock, Sparkles, ChevronDown, ChevronUp, DollarSign, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

type FeeType = 'flat' | 'percent';

export default function FastFoodCalculator() {
  const [foodCost, setFoodCost] = useState<string>('15');
  const [timesPerWeek, setTimesPerWeek] = useState<string>('3');
  
  // Fees Section
  const [showFees, setShowFees] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<string>('0');
  const [taxType, setTaxType] = useState<FeeType>('percent');
  const [taxValue, setTaxValue] = useState<string>('8');
  const [tipType, setTipType] = useState<FeeType>('percent');
  const [tipValue, setTipValue] = useState<string>('15');

  const [showResults, setShowResults] = useState(false);

  const stats = useMemo(() => {
    const f = parseFloat(foodCost) || 0;
    const w = parseFloat(timesPerWeek) || 0;
    const d = parseFloat(deliveryFee) || 0;
    
    let tax = 0;
    const tv = parseFloat(taxValue) || 0;
    if (taxType === 'flat') {
      tax = tv;
    } else {
      tax = f * (tv / 100);
    }

    let tip = 0;
    const tpv = parseFloat(tipValue) || 0;
    if (tipType === 'flat') {
      tip = tpv;
    } else {
      tip = f * (tpv / 100);
    }

    const totalPerOrder = f + d + tax + tip;
    const weekly = totalPerOrder * w;
    const monthly = weekly * 4.33;
    const annual = weekly * 52;
    const tenYear = annual * 10;
    
    // FV = P * [((1 + r)^n - 1) / r]
    const r = 0.07;
    const n = 10;
    const invested = annual * ((Math.pow(1 + r, n) - 1) / r);

    return {
      totalPerOrder,
      weekly,
      monthly,
      annual,
      tenYear,
      invested
    };
  }, [foodCost, timesPerWeek, deliveryFee, taxType, taxValue, tipType, tipValue]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const formatCurrencyPrecise = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(val);

  const getReflection = () => {
    const annual = stats.annual;
    if (annual < 1500) {
      return (
        <>
          <p>That’s a weekend getaway each year.</p>
          <p>Or a steady addition to a savings account.</p>
          <p className="mt-4 italic opacity-60">Not dramatic. But not invisible.</p>
        </>
      );
    } else if (annual < 4000) {
      return (
        <>
          <p>That’s a meaningful financial stream.</p>
          <p>Over a decade, it becomes a noticeable lever.</p>
          <p className="mt-4 italic opacity-60">Fast food often buys time — which matters too.</p>
        </>
      );
    } else {
      return (
        <>
          <p>That’s a large long-term decision.</p>
          <p>Over 10 years, it could fund major goals.</p>
          <p className="mt-4 italic opacity-60">Of course — busy schedules and convenience are real.</p>
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
              <Utensils className="w-8 h-8 text-sage" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
              What does fast food <span className="text-sage italic">really</span> add up to?
            </h2>
          </div>
          <div className="space-y-1 text-lg text-ink/60">
            <p>Convenience has value. This just shows the long-term math.</p>
            <p className="text-sm opacity-60 italic">No judgment. Just perspective.</p>
          </div>
        </motion.div>
      </header>

      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-ink/5 shadow-sm mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Average food cost per order ($)</label>
            <input 
              type="number" 
              value={foodCost}
              onChange={(e) => handlePositiveInput(e.target.value, setFoodCost)}
              min="0"
              step="1"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="15.00"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-ink/40">How many times per week?</label>
            <input 
              type="number" 
              value={timesPerWeek}
              onChange={(e) => handlePositiveInput(e.target.value, setTimesPerWeek)}
              min="0"
              className="w-full bg-sage/5 border-none rounded-2xl p-4 text-xl font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all"
              placeholder="3"
            />
          </div>
        </div>

        <div className="mb-10">
          <button 
            onClick={() => setShowFees(!showFees)}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sage hover:opacity-80 transition-opacity"
          >
            <div className={cn("w-5 h-5 rounded border border-sage flex items-center justify-center transition-colors", showFees ? "bg-sage text-white" : "bg-transparent")}>
              {showFees && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            I want to include delivery fees, tax, or tips
            {showFees ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showFees && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-8 space-y-8">
                  <div className="space-y-2 max-w-sm mx-auto text-center">
                    <label className="text-xs font-bold uppercase tracking-widest text-ink/40 block">Delivery Fee ($)</label>
                    <input 
                      type="number" 
                      value={deliveryFee}
                      onChange={(e) => handlePositiveInput(e.target.value, setDeliveryFee)}
                      min="0"
                      className="w-full bg-sage/5 border-none rounded-xl p-3 text-lg font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all text-center"
                      placeholder="0"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Tax</label>
                      <div className="flex gap-2 mb-2">
                        <button 
                          onClick={() => setTaxType('flat')}
                          className={cn("flex-1 py-1 px-2 rounded-lg text-[10px] uppercase font-bold tracking-tighter transition-colors border", taxType === 'flat' ? "bg-sage text-white border-sage" : "bg-transparent text-ink/40 border-ink/10")}
                        >
                          Flat ($)
                        </button>
                        <button 
                          onClick={() => setTaxType('percent')}
                          className={cn("flex-1 py-1 px-2 rounded-lg text-[10px] uppercase font-bold tracking-tighter transition-colors border", taxType === 'percent' ? "bg-sage text-white border-sage" : "bg-transparent text-ink/40 border-ink/10")}
                        >
                          Percent (%)
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={taxValue}
                          onChange={(e) => handlePositiveInput(e.target.value, setTaxValue)}
                          min="0"
                          className="w-full bg-sage/5 border-none rounded-xl p-3 text-lg font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all pr-10"
                          placeholder="0"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/20">
                          {taxType === 'flat' ? <DollarSign className="w-4 h-4" /> : <Percent className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Tip</label>
                      <div className="flex gap-2 mb-2">
                        <button 
                          onClick={() => setTipType('flat')}
                          className={cn("flex-1 py-1 px-2 rounded-lg text-[10px] uppercase font-bold tracking-tighter transition-colors border", tipType === 'flat' ? "bg-sage text-white border-sage" : "bg-transparent text-ink/40 border-ink/10")}
                        >
                          Flat ($)
                        </button>
                        <button 
                          onClick={() => setTipType('percent')}
                          className={cn("flex-1 py-1 px-2 rounded-lg text-[10px] uppercase font-bold tracking-tighter transition-colors border", tipType === 'percent' ? "bg-sage text-white border-sage" : "bg-transparent text-ink/40 border-ink/10")}
                        >
                          Percent (%)
                        </button>
                      </div>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={tipValue}
                          onChange={(e) => handlePositiveInput(e.target.value, setTipValue)}
                          min="0"
                          className="w-full bg-sage/5 border-none rounded-xl p-3 text-lg font-medium focus:ring-2 focus:ring-sage/20 outline-none transition-all pr-10"
                          placeholder="0"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/20">
                          {tipType === 'flat' ? <DollarSign className="w-4 h-4" /> : <Percent className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-ink/40 italic">Include whatever feels realistic for you.</p>
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
              <div className="p-8 bg-sage/10 rounded-3xl border border-sage/20 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-sage mb-2 block">True Cost Per Order</span>
                <div className="text-5xl font-serif font-bold text-ink">
                  With fees included, each order comes to <span className="text-sage">{formatCurrencyPrecise(stats.totalPerOrder)}</span>
                </div>
              </div>

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
                  <p className="mt-4 text-sm text-ink/60 italic">Small weekly habits grow quietly over time.</p>
                </div>

                <div className="p-8 bg-sage/10 rounded-3xl border border-sage/20 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4 text-sage">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">If Invested at 7%</span>
                  </div>
                  <div className="text-4xl font-serif font-bold text-ink mb-4">
                    It could grow to <span className="text-sage">{formatCurrency(stats.invested)}</span>
                  </div>
                  <p className="text-sm text-ink/60 italic">Convenience today has an opportunity cost tomorrow.</p>
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
                  <h3 className="text-3xl font-serif font-bold">Curious what small adjustments would look like?</h3>
                  <p className="text-ink/50">You don’t have to change anything. But here’s how the math shifts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Keep the Habit */}
                  <div className="p-8 bg-white rounded-3xl border border-ink/5 shadow-sm flex flex-col h-full text-center">
                    <h4 className="text-xl font-serif font-bold mb-4 min-h-[3.5rem] flex items-center justify-center">Keep the Habit</h4>
                    <p className="text-sm text-ink/60 mb-8 flex-grow">
                      Keep everything the same. Now you know the full cost — including fees.
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
                      Cutting it in half would bring your weekly spend to <span className="text-ink font-bold">{formatCurrency(stats.weekly / 2)}</span>
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

                  {/* Replace with Home Cooking */}
                  <div className="p-8 bg-white rounded-3xl border border-ink/5 shadow-sm flex flex-col h-full text-center">
                    <h4 className="text-xl font-serif font-bold mb-4 min-h-[3.5rem] flex items-center justify-center">Replace with <br /> Home Cooking</h4>
                    <p className="text-sm text-ink/60 mb-8 flex-grow">
                      Cooking at home instead would free up <span className="text-ink font-bold">{formatCurrency(stats.annual)}</span> per year.
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
