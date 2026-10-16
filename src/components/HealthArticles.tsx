import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  User,
  HeartPulse,
  Sun,
  ShieldAlert,
  ArrowRight,
  X,
  Activity,
} from 'lucide-react';
import { HealthArticle, Language } from '../types';
import { HEALTH_ARTICLES } from '../data/nagpurData';
import { translations } from '../i18n/translations';

interface HealthArticlesProps {
  language: Language;
}

export const HealthArticles: React.FC<HealthArticlesProps> = ({ language }) => {
  const t = translations[language];
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);

  const getIconForCategory = (cat: string) => {
    if (cat.includes('Summer')) return <Sun className="w-4 h-4 text-amber-500" />;
    if (cat.includes('First Aid')) return <HeartPulse className="w-4 h-4 text-rose-500" />;
    return <Activity className="w-4 h-4 text-teal-600" />;
  };

  return (
    <section id="health-tips" className="py-10 sm:py-14 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Nagpur Wellness & First Aid</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.healthTipsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {t.healthTipsSubtitle}
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HEALTH_ARTICLES.map((art) => (
            <div
              key={art.id}
              className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-teal-300 hover:bg-white transition-all shadow-xs flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    {getIconForCategory(art.tag)}
                    {art.tag}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                  {language === 'hi' ? art.titleHi : art.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi' ? art.summaryHi : art.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {art.author}
                </span>
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                >
                  <span>{t.readArticle}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  {selectedArticle.category} • {selectedArticle.tag}
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-1">
                  {language === 'hi' ? selectedArticle.titleHi : selectedArticle.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  By {selectedArticle.author} • {selectedArticle.date}
                </p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {(language === 'hi' ? selectedArticle.contentHi : selectedArticle.content).map(
                (paragraph, idx) => (
                  <p
                    key={idx}
                    className={
                      paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('4.')
                        ? 'p-3 rounded-xl bg-teal-50/70 border border-teal-100 font-medium text-teal-950'
                        : ''
                    }
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
