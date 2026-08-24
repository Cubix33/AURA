import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  PhoneCall,
  MapPin,
  FileText,
  AlertTriangle,
  Send,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Scale,
  Compass,
  Building2,
  Navigation,
  Info,
  Radio
} from 'lucide-react';
import {
  LEGAL_RIGHTS_DATA,
  SAFETY_HOTLINES,
  SAFE_ZONES_DATA,
} from '../data/wellnessData';
import { SafeZonePoint, LegalRightTopic } from '../types/wellnessTypes';

export const RightsAndSafetyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'safety_emergency' | 'safe_map' | 'legal_rights' | 'harassment_report'>('safety_emergency');

  // Emergency SOS simulator state
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [selectedSafeType, setSelectedSafeType] = useState<string>('all');
  const [expandedLegalTopic, setExpandedLegalTopic] = useState<string>(LEGAL_RIGHTS_DATA[0].id);

  // Anonymous incident form state
  const [reportLocation, setReportLocation] = useState<string>('');
  const [reportType, setReportType] = useState<string>('street_harassment');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  const handleTriggerSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 8000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportLocation.trim() || !reportDetails.trim()) return;
    setReportSuccess(true);
    setTimeout(() => {
      setReportLocation('');
      setReportDetails('');
      setReportSuccess(false);
    }, 4000);
  };

  const filteredSafePoints =
    selectedSafeType === 'all'
      ? SAFE_ZONES_DATA
      : SAFE_ZONES_DATA.filter((p) => p.type === selectedSafeType);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#FAF5F0] via-white to-[#F6EDE4] rounded-3xl p-6 md:p-8 border border-[#EAE0D3] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#8E3B22] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Sovereignty, Legal Rights & Safety
            </span>
            <h1 className="font-serif-editorial text-2xl md:text-3xl text-[#2B231F] font-normal">
              Protection, Policies & Emergency Help
            </h1>
            <p className="text-xs md:text-sm text-[#6B5E54]">
              Immediate access to emergency hotlines, verified community safe zones, plain-language legal rights, and confidential incident reporting.
            </p>
          </div>

          {/* Quick SOS Trigger Button */}
          <div className="shrink-0 self-start md:self-auto">
            <button
              onClick={handleTriggerSOS}
              className="px-5 py-3 rounded-2xl bg-[#BF3D3D] text-white font-bold text-xs hover:bg-[#A82B2B] active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{sosActive ? 'Emergency Hotlines Triggered' : 'Quick Emergency Action'}</span>
            </button>
          </div>
        </div>

        {/* SOS Alert Banner */}
        <AnimatePresence>
          {sosActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-2xl bg-[#FDF1F1] border border-[#F5C7C7] text-xs text-[#8A2626] flex items-start justify-between gap-3 overflow-hidden"
            >
              <div className="space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#BF3D3D]" />
                  Emergency Hotlines Available (Free & 24/7):
                </p>
                <p className="text-[11px] text-[#782323]">
                  <strong>Línea 100 (MIMP Peru)</strong>: Dial 100 | <strong>PNP Police</strong>: Dial 105 | <strong>SAMU Ambulance</strong>: Dial 106
                </p>
              </div>
              <button
                onClick={() => setSosActive(false)}
                className="text-[11px] font-bold text-[#8A2626] underline cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#EFE7DC]">
          <button
            onClick={() => setActiveTab('safety_emergency')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'safety_emergency'
                ? 'bg-[#8E3B22] text-white shadow-xs'
                : 'bg-white text-[#5E5147] border border-[#E5DDD2] hover:bg-[#F7F1E9]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Emergency Contacts & Línea 100
          </button>

          <button
            onClick={() => setActiveTab('safe_map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'safe_map'
                ? 'bg-[#8E3B22] text-white shadow-xs'
                : 'bg-white text-[#5E5147] border border-[#E5DDD2] hover:bg-[#F7F1E9]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Safe Routes & Points of Refuge
          </button>

          <button
            onClick={() => setActiveTab('legal_rights')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'legal_rights'
                ? 'bg-[#8E3B22] text-white shadow-xs'
                : 'bg-white text-[#5E5147] border border-[#E5DDD2] hover:bg-[#F7F1E9]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Public Policies & Legal Rights
          </button>

          <button
            onClick={() => setActiveTab('harassment_report')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'harassment_report'
                ? 'bg-[#8E3B22] text-white shadow-xs'
                : 'bg-white text-[#5E5147] border border-[#E5DDD2] hover:bg-[#F7F1E9]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Anonymous Harassment Report
          </button>
        </div>
      </section>

      {/* TAB 1: EMERGENCY HOTLINES */}
      {activeTab === 'safety_emergency' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAFETY_HOTLINES.map((hl) => (
              <div
                key={hl.id}
                className="bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF4EE] text-[#8E3B22] border border-[#EFE5DC]">
                      {hl.country} · {hl.type.replace('_', ' ')}
                    </span>
                    {hl.freeAndConfidential && (
                      <span className="text-[10px] font-bold text-[#2D583F] bg-[#EBF4F0] px-2 py-0.5 rounded-full">
                        Free & Confidential 24/7
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-editorial text-xl text-[#2B231F]">
                    {hl.name}
                  </h3>

                  <p className="text-xs text-[#5C4F45] leading-relaxed">
                    {hl.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE4] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#F5E8E0] text-[#8E3B22] flex items-center justify-center font-bold">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8A7D73] block">Direct Dial</span>
                      <span className="font-mono text-base font-bold text-[#2B231F]">{hl.number}</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${hl.number}`}
                    className="px-4 py-2 rounded-xl bg-[#2B231F] text-white text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5"
                  >
                    Call Now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Safety Steps */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#EAE0D3] space-y-3">
            <h3 className="font-serif-editorial text-lg text-[#2B231F] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#8E3B22]" />
              Practical Protocol If You Feel Unsafe
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#52453B]">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFD3] space-y-1">
                <span className="font-bold text-[#8E3B22] block">1. Seek Public Lit Space</span>
                <p className="text-[11px] leading-relaxed">
                  Enter an open store, 24-hour pharmacy, or transit hub immediately.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFD3] space-y-1">
                <span className="font-bold text-[#8E3B22] block">2. Call Línea 100 / 105</span>
                <p className="text-[11px] leading-relaxed">
                  Free call from any phone even without prepaid balance.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFD3] space-y-1">
                <span className="font-bold text-[#8E3B22] block">3. Share Live Location</span>
                <p className="text-[11px] leading-relaxed">
                  Send your live GPS to a trusted contact via messaging apps.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAFE ROUTES & REFUGE POINTS MAP SIMULATOR */}
      {activeTab === 'safe_map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Map Simulator Graphic */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E8E1D7] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-editorial text-xl text-[#2B231F]">
                  Collaborative Safe Points Network
                </h3>
                <p className="text-xs text-[#7A6F66]">
                  Verified 24/7 safe zones, female-staffed precincts, and lit transit corridors.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EBF4F0] text-[#2D583F]">
                4 Verified Nearby
              </span>
            </div>

            {/* Visual Schematic Map Canvas */}
            <div className="w-full h-64 rounded-2xl bg-[#FAF8F5] border border-[#ECE3D8] relative overflow-hidden flex items-center justify-center p-4">
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#8E3B22_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Central User Location */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-[#8E3B22] border-2 border-white shadow-md flex items-center justify-center animate-ping opacity-75" />
                <div className="w-4 h-4 rounded-full bg-[#8E3B22] border-2 border-white shadow-md absolute top-0.5" />
                <span className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#2B231F] text-white shadow-xs">
                  Your Current Area
                </span>
              </div>

              {/* Point Markers scattered */}
              <div className="absolute top-6 left-10 p-2 rounded-xl bg-white border border-[#E8DFD3] shadow-xs text-[10px] font-bold text-[#2B231F] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4B8361]" />
                Comisaría de Mujeres (0.4 km)
              </div>

              <div className="absolute bottom-8 right-8 p-2 rounded-xl bg-white border border-[#E8DFD3] shadow-xs text-[10px] font-bold text-[#2B231F] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4B8361]" />
                Farmacia 24H Punto Seguro (0.2 km)
              </div>

              <div className="absolute top-10 right-12 p-2 rounded-xl bg-white border border-[#E8DFD3] shadow-xs text-[10px] font-bold text-[#2B231F] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#8E3B22]" />
                Centro CEM MIMP (0.9 km)
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-[#8C7D72] mr-1">Filter points:</span>
              {['all', 'police', 'pharmacy_247', 'shelter', 'community_hub'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedSafeType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedSafeType === type
                      ? 'bg-[#2B231F] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#54483E] border border-[#E5DCD0] hover:bg-[#F2ECE2]'
                  }`}
                >
                  {type === 'all' ? 'All Points' : type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Point Directory List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-serif-editorial text-lg text-[#2B231F]">
              Verified Safe Locations
            </h3>

            <div className="space-y-2.5">
              {filteredSafePoints.map((point) => (
                <div
                  key={point.id}
                  className="bg-white rounded-2xl p-4 border border-[#E8E1D7] shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-[#2B231F]">{point.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF4F0] text-[#2D583F] shrink-0">
                      {point.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-[#8C7E74] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#8E3B22]" />
                    {point.address}
                  </p>

                  <p className="text-[#594E45] leading-relaxed text-[11px]">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PUBLIC POLICIES & LEGAL RIGHTS */}
      {activeTab === 'legal_rights' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EDE2D4] text-xs text-[#63564C] flex items-start gap-2.5">
            <Scale className="w-4 h-4 text-[#8E3B22] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Every woman has enforceable legal rights under labor, health, and civil law. These guides translate complex legal statutes into clear, actionable protections.
            </p>
          </div>

          <div className="space-y-3">
            {LEGAL_RIGHTS_DATA.map((topic) => {
              const isExpanded = expandedLegalTopic === topic.id;
              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-3xl border border-[#E8E1D7] shadow-xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedLegalTopic(isExpanded ? '' : topic.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F6ECE6] text-[#8E3B22]">
                          {topic.category.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-[#8A7E73]">
                          {topic.countryScope}
                        </span>
                      </div>
                      <h3 className="font-serif-editorial text-xl text-[#2B231F]">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-[#665A51] line-clamp-1">
                        {topic.summary}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-[#FAF5F0] text-[#8E3B22] shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6 pt-2 border-t border-[#F2ECE4] space-y-4 text-xs"
                      >
                        {topic.lawReference && (
                          <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE4DA] font-mono text-[11px] text-[#695D54]">
                            Legal statute: {topic.lawReference}
                          </div>
                        )}

                        {/* Practical Rights */}
                        <div className="space-y-2">
                          <h4 className="font-bold text-[#2B231F] uppercase tracking-wider text-[11px]">
                            What the law guarantees you:
                          </h4>
                          <div className="space-y-1.5">
                            {topic.practicalRights.map((r, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-xl bg-[#FAF8F5] text-[#42372F] flex items-start gap-2"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#4B8361] shrink-0 mt-0.5" />
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* How to claim */}
                        <div className="space-y-2 pt-2 border-t border-[#F2ECE4]">
                          <h4 className="font-bold text-[#8E3B22] uppercase tracking-wider text-[11px]">
                            How to exercise or file a claim:
                          </h4>
                          <div className="space-y-1.5">
                            {topic.howToClaim.map((c, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-xl bg-[#FDF9F7] border border-[#F4E3DC] text-[#6B3222] flex items-start gap-2"
                              >
                                <Building2 className="w-3.5 h-3.5 text-[#8E3B22] shrink-0 mt-0.5" />
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ANONYMOUS HARASSMENT REPORTING FORM */}
      {activeTab === 'harassment_report' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D7] shadow-xs space-y-5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3B22] flex items-center gap-1">
              <Lock className="w-3 h-3" />
              100% Anonymous & Zero-Knowledge
            </span>
            <h3 className="font-serif-editorial text-2xl text-[#2B231F]">
              Report a Harassment Incident
            </h3>
            <p className="text-xs text-[#7A6F66] leading-relaxed">
              Help make public and workspace corridors safer by logging street harassment, workplace intimidation, or unsafe transit spots without revealing your personal identity.
            </p>
          </div>

          {reportSuccess ? (
            <div className="p-6 rounded-2xl bg-[#EBF4F0] border border-[#CDE5D8] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#2D583F] mx-auto" />
              <h4 className="font-bold text-[#2D583F] text-sm">
                Incident Registered Anonymously
              </h4>
              <p className="text-xs text-[#3E6E53]">
                Your report helps flag unsafe zones in community safety maps. Thank you for contributing to collective protection.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#2B231F] block">
                  Category of Incident
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#8E3B22] text-[#2B231F]"
                >
                  <option value="street_harassment">Street / Transit Harassment (Catcalling, Intimidation)</option>
                  <option value="workplace_harassment">Workplace Harassment (Hostigamiento Laboral)</option>
                  <option value="institutional_discrimination">Healthcare / Institutional Discrimination</option>
                  <option value="unlit_unsafe_route">Unlit / High-Risk Route (Infrastructure)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2B231F] block">
                  Approximate Location / Street / District
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Av. Javier Prado / Bus Stop near Estación Central"
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#8E3B22] text-[#2B231F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2B231F] block">
                  Incident Description (No identifying personal info required)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what occurred, time of day, or specific safety hazards..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E2D8CC] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#8E3B22] text-[#2B231F]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#8A7E73] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#4B8361]" />
                  No IP or identity stored
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#8E3B22] text-white font-bold text-xs hover:bg-[#742E19] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Anonymous Report
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
