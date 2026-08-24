import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Coins,
  GraduationCap,
  Users,
  Sparkles,
  Heart,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Calculator,
  Award,
  MessageSquare,
  Send,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { OPPORTUNITIES_DATA } from '../data/wellnessData';

export const EmpowermentView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'finance' | 'scholarships' | 'community'>('finance');

  // Interactive 50/30/20 Budget Calculator State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(2000);
  const [emergencyMonths, setEmergencyMonths] = useState<number>(3);

  const needs50 = monthlyIncome * 0.5;
  const wants30 = monthlyIncome * 0.3;
  const savings20 = monthlyIncome * 0.2;
  const emergencyFundTarget = needs50 * emergencyMonths;

  // Community Testimonials & Sharing
  const [testimonials, setTestimonials] = useState<Array<{ name: string; role: string; quote: string; tag: string }>>([
    {
      name: 'Lucía M.',
      role: 'Software Engineer & Laboratoria Alumna (Lima)',
      quote:
        'Learning how my energy drops during my late luteal phase helped me stop self-criticizing and start scheduling deep technical coding for my follicular peaks.',
      tag: 'Career & Tech',
    },
    {
      name: 'Valeria R.',
      role: 'Graphic Designer & Community Organizer (Arequipa)',
      quote:
        'Understanding Peru’s Ley 27942 gave me the legal vocabulary to advocate for myself and my female teammates in our studio.',
      tag: 'Legal Rights',
    },
    {
      name: 'Camila S.',
      role: 'Biomedical Student & STEM Scholar (Cusco)',
      quote:
        'The 50/30/20 framework helped me save my first 3-month emergency cushion while funding my graduation thesis.',
      tag: 'Financial Independence',
    },
  ]);

  const [newStoryName, setNewStoryName] = useState<string>('');
  const [newStoryRole, setNewStoryRole] = useState<string>('');
  const [newStoryQuote, setNewStoryQuote] = useState<string>('');
  const [isStorySubmitted, setIsStorySubmitted] = useState<boolean>(false);

  const handlePostStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryName.trim() || !newStoryQuote.trim()) return;

    setTestimonials((prev) => [
      {
        name: newStoryName,
        role: newStoryRole.trim() || 'Community Member',
        quote: newStoryQuote,
        tag: 'Empowerment Voice',
      },
      ...prev,
    ]);

    setIsStorySubmitted(true);
    setTimeout(() => {
      setNewStoryName('');
      setNewStoryRole('');
      setNewStoryQuote('');
      setIsStorySubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#FAF5F0] via-white to-[#F7EFE8] rounded-3xl p-6 md:p-8 border border-[#EAE0D3] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#8E3B22] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Economics, Leadership & Community
            </span>
            <h1 className="font-serif-editorial text-2xl md:text-3xl text-[#2B231F] font-normal">
              Sovereignty & Growth
            </h1>
            <p className="text-xs md:text-sm text-[#6B5E54]">
              Financial education tools, leadership grants, and verified mentoring spaces that foster long-term autonomy.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-[#E8DFD3] shrink-0 self-start md:self-auto shadow-xs">
            <GraduationCap className="w-5 h-5 text-[#8E3B22]" />
            <span className="text-xs font-bold text-[#2B231F]">
              4 Opportunity Hubs Active
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#EFE7DC]">
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-[#8E3B22] text-white shadow-xs'
                : 'bg-white text-[#5E5147] border border-[#E5DDD2] hover:bg-[#F7F1E9]'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            Financial Sovereignty & 50/30/20 Calculator
          </button>

          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'scholarships'
                ? 'bg-[#8E3B22] text-white shadow-xs'
                : 'bg-white text-[#5E5147] border border-[#E5DDD2] hover:bg-[#F7F1E9]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Scholarships, Grants & Tech Bootcamps
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'community'
                ? 'bg-[#8E3B22] text-white shadow-xs'
                : 'bg-white text-[#5E5147] border border-[#E5DDD2] hover:bg-[#F7F1E9]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Mentorship & Community Voices
          </button>
        </div>
      </section>

      {/* TAB 1: FINANCIAL SOVEREIGNTY & CALCULATOR */}
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 50/30/20 Budget Interactive Tool */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D7] shadow-xs space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3B22] flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5" />
                Interactive Budget Modeler
              </span>
              <h3 className="font-serif-editorial text-2xl text-[#2B231F]">
                The 50/30/20 Financial Split
              </h3>
              <p className="text-xs text-[#7A6F66]">
                Calculate your baseline living essentials, guilt-free growth funds, and your emergency independence cushion.
              </p>
            </div>

            {/* Income Input Slider */}
            <div className="space-y-2 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE1D5]">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#2B231F]">Monthly Take-Home Income:</label>
                <span className="font-mono font-bold text-sm text-[#8E3B22]">${monthlyIncome.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="50"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full accent-[#8E3B22] cursor-pointer"
              />
            </div>

            {/* Visual 3-Way Split Breakdown */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3.5 rounded-2xl bg-[#F5EFE9] border border-[#E7DCD0] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#8A7669] block">50% Needs</span>
                <p className="font-mono font-bold text-base text-[#2B231F]">${needs50.toLocaleString()}</p>
                <span className="text-[10px] text-[#7A6E64] block">Rent, food, health</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F4EC] border border-[#EAE3D2] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#8A7E64] block">30% Wants</span>
                <p className="font-mono font-bold text-base text-[#2B231F]">${wants30.toLocaleString()}</p>
                <span className="text-[10px] text-[#7A6E64] block">Dining, hobbies</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EBF4F0] border border-[#CCE2D7] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#2D583F] block">20% Future</span>
                <p className="font-mono font-bold text-base text-[#2D583F]">${savings20.toLocaleString()}</p>
                <span className="text-[10px] text-[#3B6B50] block">Emergency fund</span>
              </div>
            </div>

            {/* Emergency Fund Target Simulator */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EBE2D6] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#2B231F]">Emergency Freedom Cushion:</span>
                <span className="font-bold text-[#8E3B22]">{emergencyMonths} months essential costs</span>
              </div>

              <div className="flex items-center gap-2">
                {[3, 6, 9].map((m) => (
                  <button
                    key={m}
                    onClick={() => setEmergencyMonths(m)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      emergencyMonths === m
                        ? 'bg-[#8E3B22] text-white shadow-xs'
                        : 'bg-white border border-[#E5DDD2] text-[#63554B]'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-[#EDE5DB] flex items-center justify-between text-xs">
                <span className="text-[#7A6E64]">Recommended Emergency Cushion Target:</span>
                <span className="font-mono font-bold text-sm text-[#2B231F]">${emergencyFundTarget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right: Principles of Female Economic Autonomy */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D7] shadow-xs space-y-4">
              <h3 className="font-serif-editorial text-xl text-[#2B231F]">
                Principles of Female Financial Sovereignty
              </h3>

              <div className="space-y-3 text-xs text-[#52453C]">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE5DB] space-y-1">
                  <span className="font-bold text-[#8E3B22] block text-[11px]">
                    1. Maintain an Individual Sovereign Account
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#6E6157]">
                    Even in shared partnerships, every woman needs an account and credit history registered solely under her legal name.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE5DB] space-y-1">
                  <span className="font-bold text-[#8E3B22] block text-[11px]">
                    2. The Gender Wage Gap Negotiation Playbook
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#6E6157]">
                    Benchmark market rates using Glassdoor/Levels.fyi. Anchor performance reviews around quantified revenue or operational impact rather than subjective tenure.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EDE5DB] space-y-1">
                  <span className="font-bold text-[#8E3B22] block text-[11px]">
                    3. High-Yield Savings & Compound Interest
                  </span>
                  <p className="text-[11px] leading-relaxed text-[#6E6157]">
                    Move cash away from standard 0.01% checking accounts into regulated high-yield savings accounts (HYSA) or low-fee index funds (S&P 500 / ETFs) to outpace inflation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHOLARSHIPS, GRANTS & BOOTCAMPS */}
      {activeTab === 'scholarships' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPPORTUNITIES_DATA.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF5F0] text-[#8E3B22] border border-[#EFE5DC]">
                      {opp.category}
                    </span>
                    <span className="text-xs font-semibold text-[#8C7E74]">
                      {opp.organization}
                    </span>
                  </div>

                  <h3 className="font-serif-editorial text-xl text-[#2B231F]">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-[#574B41] leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#F2ECE4]">
                  <div className="flex flex-wrap gap-1.5">
                    {opp.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FAF8F5] border border-[#ECE4DA] text-[#695D53]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#8E8074]">
                      Target: {opp.targetAudience.slice(0, 38)}...
                    </span>
                    <a
                      href={`https://${opp.linkText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-xs text-[#8E3B22] hover:underline"
                    >
                      Visit Program <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MENTORSHIP & COMMUNITY VOICES */}
      {activeTab === 'community' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Testimonial Wall */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif-editorial text-xl text-[#2B231F]">
              Community Stories & Testimonials
            </h3>

            <div className="space-y-3">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E1D7] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FAF4EE] text-[#8E3B22] flex items-center justify-center font-bold text-xs border border-[#EFE5DC]">
                        {t.name[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#2B231F]">{t.name}</h4>
                        <p className="text-[10px] text-[#8C7F74]">{t.role}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F6EDE6] text-[#8E3B22]">
                      {t.tag}
                    </span>
                  </div>

                  <p className="text-xs text-[#4C4037] leading-relaxed italic font-serif-editorial text-[14px]">
                    "{t.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Share Your Story Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E1D7] shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3B22] flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Community Space
              </span>
              <h3 className="font-serif-editorial text-xl text-[#2B231F]">
                Share an Inspiring Story
              </h3>
              <p className="text-xs text-[#7A6F66]">
                Inspire other women navigating health, education, or career breakthroughs.
              </p>
            </div>

            {isStorySubmitted ? (
              <div className="p-5 rounded-2xl bg-[#EBF4F0] border border-[#CBE2D6] text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-[#2D583F] mx-auto" />
                <h4 className="font-bold text-[#2D583F] text-xs">
                  Thank you for sharing your story!
                </h4>
                <p className="text-[11px] text-[#3D6E54]">
                  Your voice is live in the community wall.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostStory} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#2B231F] block">Your Name / Alias</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria F."
                    value={newStoryName}
                    onChange={(e) => setNewStoryName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#8E3B22] text-[#2B231F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B231F] block">Role / Location (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. University Student, Lima"
                    value={newStoryRole}
                    onChange={(e) => setNewStoryRole(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#8E3B22] text-[#2B231F]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2B231F] block">Your Experience / Insight</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="What did you learn about your health, rights, or career that empowered you?"
                    value={newStoryQuote}
                    onChange={(e) => setNewStoryQuote(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#8E3B22] text-[#2B231F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#8E3B22] text-white font-bold text-xs hover:bg-[#742E19] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish to Community Wall
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
