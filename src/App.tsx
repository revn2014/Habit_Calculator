/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Coffee, Zap, Cigarette, Utensils, Ticket, CreditCard, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import CoffeeCalculator from './components/CoffeeCalculator';
import EnergyDrinkCalculator from './components/EnergyDrinkCalculator';
import FastFoodCalculator from './components/FastFoodCalculator';
import SmokingCalculator from './components/SmokingCalculator';
import LotteryCalculator from './components/LotteryCalculator';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const calculators = [
  {
    title: "Coffee Calculator",
    description: "What if those morning lattes were working for you instead?",
    icon: Coffee,
    path: "/how-much-coffee-costs",
    color: "bg-sage/10",
    iconColor: "text-sage"
  },
  {
    title: "Energy Drink Calculator",
    description: "Curious about the long-term spark of your daily energy boost?",
    icon: Zap,
    path: "/how-much-energy-drinks-cost",
    color: "bg-sage/10",
    iconColor: "text-sage"
  },
  {
    title: "Smoking Calculator",
    description: "Exploring the quiet cost of a pack over the years.",
    icon: Cigarette,
    path: "/how-much-smoking-costs",
    color: "bg-sage/10",
    iconColor: "text-sage"
  },
  {
    title: "Fast Food Calculator",
    description: "A gentle look at the math behind those quick bites.",
    icon: Utensils,
    path: "/how-much-fast-food-costs",
    color: "bg-sage/10",
    iconColor: "text-sage"
  },
  {
    title: "Lottery Calculator",
    description: "Wondering what those weekly tickets add up to?",
    icon: Ticket,
    path: "/how-much-lottery-costs",
    color: "bg-sage/10",
    iconColor: "text-sage"
  },
  {
    title: "Subscription Calculator",
    description: "A simple check-in on those monthly auto-pays.",
    icon: CreditCard,
    path: "/how-much-subscriptions-cost",
    color: "bg-sage/10",
    iconColor: "text-sage"
  }
];

function Navbar() {
  return (
    <nav className="max-w-7xl mx-auto px-6 py-10 flex justify-center items-center">
      <Link to="/" className="group">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink tracking-tight group-hover:text-sage transition-colors text-center">
          Small Habits <span className="text-sage group-hover:text-ink">Calculator</span>
        </h1>
      </Link>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-12 mt-20 border-t border-ink/5 text-center">
      <p className="text-sm opacity-50">
        © {new Date().getFullYear()} Small Habits Calculator. Small habits. Big numbers.
      </p>
      <p className="text-xs opacity-30 mt-2 italic">
        No judgment. Just insight.
      </p>
    </footer>
  );
}

function Home() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-ink/80 mb-4 tracking-tight">
            Small habits. <span className="text-sage italic">Big numbers.</span>
          </h2>
          <p className="text-lg text-ink/60 leading-relaxed max-w-2xl">
            We're often told that small things don't matter. But over time, they tell a story. 
            Explore the long-term impact of your daily choices with curiosity, not pressure.
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc, index) => (
          <motion.div
            key={calc.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              to={calc.path}
              className="group block h-full p-8 bg-white rounded-3xl border border-ink/5 shadow-sm card-hover relative overflow-hidden"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", calc.color)}>
                <calc.icon className={cn("w-6 h-6", calc.iconColor)} />
              </div>
              <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-sage transition-colors">
                {calc.title}
              </h3>
              <p className="text-ink/60 text-sm leading-relaxed mb-6">
                {calc.description}
              </p>
              <div className="flex items-center text-xs font-bold uppercase tracking-widest text-sage opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                Explore <ArrowRight className="ml-2 w-3 h-3" />
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                <calc.icon size={120} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-much-coffee-costs" element={<CoffeeCalculator />} />
          <Route path="/how-much-energy-drinks-cost" element={<EnergyDrinkCalculator />} />
          <Route path="/how-much-fast-food-costs" element={<FastFoodCalculator />} />
          <Route path="/how-much-smoking-costs" element={<SmokingCalculator />} />
          <Route path="/how-much-lottery-costs" element={<LotteryCalculator />} />
          {/* Placeholder routes for future calculators */}
          {calculators.filter(c => !["/how-much-coffee-costs", "/how-much-energy-drinks-cost", "/how-much-fast-food-costs", "/how-much-smoking-costs", "/how-much-lottery-costs"].includes(c.path)).map(calc => (
            <Route 
              key={calc.path} 
              path={calc.path} 
              element={
                <div className="flex-1 flex items-center justify-center p-12 text-center">
                  <div className="max-w-md">
                    <h2 className="text-3xl font-serif font-bold mb-4">{calc.title}</h2>
                    <p className="opacity-60 mb-8">Coming soon in the next iteration. We're crafting a gentle experience for this calculator.</p>
                    <Link to="/" className="text-clay font-bold hover:underline">Back to all calculators</Link>
                  </div>
                </div>
              } 
            />
          ))}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
