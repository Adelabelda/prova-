/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Calendar, Heart, Clock, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

export default function App() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [age, setAge] = useState<AgeResult | null>(null);
  const [nextBirthday, setNextBirthday] = useState<number | null>(null);

  useEffect(() => {
    if (!birthDate) {
      setAge(null);
      setNextBirthday(null);
      return;
    }

    const calculateAge = () => {
      const birth = new Date(birthDate);
      const now = new Date();

      if (isNaN(birth.getTime())) return;

      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();

      if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      setAge({ years, months, days });

      // Calculate next birthday
      const nextBdayYear = now.getMonth() > birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())
        ? now.getFullYear() + 1
        : now.getFullYear();
      
      const nextBdayDate = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
      const diffTime = nextBdayDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNextBirthday(diffDays === 366 || diffDays === 365 ? 0 : diffDays);
    };

    calculateAge();
    const timer = setInterval(calculateAge, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [birthDate]);

  const reset = () => {
    setBirthDate('');
    setAge(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 selection:bg-indigo-100">
      <div className="w-full max-w-xl">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-display font-bold tracking-tight text-zinc-900 mb-3">
              Calculadora d'Edat
            </h1>
            <p className="text-zinc-500 font-sans">
              Descobreix exactament quants dies has viscut fins avui.
            </p>
          </motion.div>
        </header>

        <motion.div
          layout
          className="bg-white p-8 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="birthdate" className="block text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                Data de naixement
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  id="birthdate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none text-zinc-800 font-display text-lg"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {age ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-8 py-4"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <StatBox label="Anys" value={age.years} />
                    <StatBox label="Mesos" value={age.months} />
                    <StatBox label="Dies" value={age.days} />
                  </div>

                  <div className="p-6 bg-indigo-50 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                        Propera aniversari
                      </p>
                      <p className="text-indigo-900 font-display font-semibold text-lg">
                        {nextBirthday === 0 ? "Avui és el teu dia! 🎉" : `Falten ${nextBirthday} dies`}
                      </p>
                    </div>
                    <button
                      onClick={reset}
                      className="ml-auto p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      title="Reiniciar"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="inline-flex items-center gap-2 text-zinc-400 text-sm font-medium italic">
                      Creat amb <Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> per a tu
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-50 text-zinc-300 mb-4">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                  <p className="text-zinc-400 font-medium italic underline underline-offset-4 decoration-zinc-200">
                    Siusplau, introdueix la teva data per començar
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <footer className="mt-12 text-center pb-8 border-t border-zinc-100 pt-8">
          <p className="text-zinc-400 text-sm font-sans uppercase tracking-[0.2em] font-medium">
            &copy; {new Date().getFullYear()} CALCULADORA D'EDAT
          </p>
        </footer>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border-2 border-zinc-50 p-6 rounded-3xl text-center shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-display font-bold text-zinc-900 mb-1 group-hover:text-indigo-600 transition-colors"
      >
        {value}
      </motion.p>
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
        {label}
      </p>
    </div>
  );
}

