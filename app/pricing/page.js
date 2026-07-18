'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Zap,
  Shield,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Star,
  CheckCircle2,
} from 'lucide-react';

const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Essential productivity tools for individuals',
    monthlyPrice: 0,
    annualPrice: 0,
    popular: false,
    badge: 'Free Forever',
    features: [
      'Up to 50 active tasks',
      'Basic finance logging',
      'Simple text notes',
      'Standard search & filter',
      '10 AI commands / day',
    ],
    buttonText: 'Current Plan',
    buttonVariant: 'secondary',
  },
  {
    id: 'pro',
    name: 'Celite Pro',
    tagline: 'Unlimited AI capabilities and advanced automation',
    monthlyPrice: 499,
    annualPrice: 399,
    popular: true,
    badge: 'Most Popular',
    features: [
      'Unlimited tasks & routines',
      'Full finance analytics & budgets',
      'Rich notes, checklists & ideas',
      'Unlimited Gemini AI commands',
      'Natural language smart parsing',
      'Priority offline synchronization',
      'Export data to CSV / JSON',
    ],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'primary',
  },
  {
    id: 'team',
    name: 'Enterprise / Team',
    tagline: 'Tailored for teams requiring shared workflows & AI',
    monthlyPrice: 1499,
    annualPrice: 1199,
    popular: false,
    badge: 'For Organizations',
    features: [
      'Everything in Pro plan',
      'Up to 10 team member seats',
      'Shared task lists & financial spaces',
      'Custom AI prompts & workflows',
      'Dedicated priority support 24/7',
      'Custom export & API access',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
  },
];

const FAQS = [
  {
    question: 'Can I change my plan later?',
    answer: 'Yes! You can upgrade or downgrade your subscription plan at any time from your account settings.',
  },
  {
    question: 'Is there a free trial for Celite Pro?',
    answer: 'All new users get a 14-day free trial of Celite Pro with no credit card required.',
  },
  {
    question: 'How does the Gemini AI integration work?',
    answer: 'Celite Manager uses Google Gemini models to parse natural language inputs for adding tasks, logging expenses, and organizing notes automatically.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, UPI, PayPal, and Apple Pay/Google Pay.',
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [showModal, setShowModal] = useState(false);

  function handleSelectPlan(tier) {
    setSelectedPlan(tier);
    setShowModal(true);
  }

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index);
  }

  return (
    <div className="min-h-screen bg-[#0d0f17] text-white selection:bg-pink-500 selection:text-white pb-16">
      {/* Top Header Navigation */}
      <nav className="sticky top-0 z-30 backdrop-blur-xl bg-[#0d0f17]/80 border-b border-white/10 px-4 py-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-pink-500 bg-clip-text text-transparent">
              Celite Manager
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-medium border border-pink-500/30">
              Pricing
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-pink-500/10 to-purple-500/10 border border-white/10 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="animate-spin text-pink-400" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight mb-4">
            Unlock the Full Power of{' '}
            <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-pink-500 bg-clip-text text-transparent">
              AI-Driven Productivity
            </span>
          </h1>
          <p className="text-text-secondary text-base sm:text-lg">
            Choose the plan that fits your workflow. Automate tasks, track finances, and capture ideas effortlessly.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-white/5 border border-white/10">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                !isAnnual ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-md' : 'text-text-secondary hover:text-white'
              }`}
            >
              Monthly Billed
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isAnnual ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-md' : 'text-text-secondary hover:text-white'
              }`}
            >
              <span>Annual Billed</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {PRICING_TIERS.map((tier) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:translate-y-[-4px] ${
                  tier.popular
                    ? 'bg-gradient-to-b from-surface-panel via-surface-panel to-pink-950/20 border-2 border-pink-500/60 shadow-xl shadow-pink-500/10'
                    : 'bg-surface-panel border border-white/10 hover:border-white/20'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white text-xs font-bold shadow-md flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-xl font-bold text-white">{tier.name}</h3>
                    {!tier.popular && tier.badge && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-text-secondary border border-white/10 font-medium">
                        {tier.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mb-6 min-h-[36px]">{tier.tagline}</p>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="font-heading text-4xl font-extrabold text-white">
                      ₹{price}
                    </span>
                    <span className="text-xs text-text-secondary font-normal">
                      {price === 0 ? '' : isAnnual ? '/month (billed yearly)' : '/month'}
                    </span>
                  </div>

                  <hr className="border-white/10 mb-6" />

                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                      Features Included:
                    </p>
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary">
                        <CheckCircle2 size={16} className={`flex-shrink-0 mt-0.5 ${tier.popular ? 'text-pink-400' : 'text-blue-400'}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPlan(tier)}
                  className={`w-full py-3 rounded-xl font-heading text-sm font-semibold transition-all shadow-md cursor-pointer ${
                    tier.buttonVariant === 'primary'
                      ? 'bg-gradient-to-r from-blue-500 via-pink-500 to-pink-600 text-white hover:opacity-90 shadow-pink-500/25'
                      : tier.buttonVariant === 'secondary'
                      ? 'bg-white/10 text-white hover:bg-white/15'
                      : 'bg-transparent border border-white/20 text-white hover:bg-white/5'
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights Banner */}
        <div className="rounded-2xl p-8 bg-gradient-to-r from-blue-900/20 via-pink-900/20 to-purple-900/20 border border-white/10 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                <Zap size={22} />
              </div>
              <h4 className="font-heading font-semibold text-white mb-1">Instant AI Execution</h4>
              <p className="text-xs text-text-secondary">
                Type naturally to schedule tasks, budget money, or generate organized notes instantly.
              </p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-3 border border-pink-500/30">
                <Shield size={22} />
              </div>
              <h4 className="font-heading font-semibold text-white mb-1">Privacy & Security</h4>
              <p className="text-xs text-text-secondary">
                Your data is synced securely with Supabase and stays encrypted on your device.
              </p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-3 border border-purple-500/30">
                <Sparkles size={22} />
              </div>
              <h4 className="font-heading font-semibold text-white mb-1">Smart Analytics</h4>
              <p className="text-xs text-text-secondary">
                Gain insights into your completed routines and finance monthly savings metrics.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-heading font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-surface-panel border border-white/10 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left font-heading text-sm font-semibold text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-text-secondary border-t border-white/5 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Subscription Modal / Confirmation */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#141724] border border-white/15 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-pink-500/30">
              <Sparkles size={26} />
            </div>

            <h3 className="font-heading text-xl font-bold text-white mb-2">
              Select {selectedPlan.name}?
            </h3>
            <p className="text-xs text-text-secondary mb-6">
              You selected the <span className="text-pink-400 font-semibold">{selectedPlan.name}</span> plan ({isAnnual ? 'Billed Annually' : 'Billed Monthly'}). This is a mock subscription checkout.
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-text-secondary">Plan:</span>
                <span className="font-semibold text-white">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Billing Cycle:</span>
                <span className="font-semibold text-white">{isAnnual ? 'Annual (-20%)' : 'Monthly'}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-sm">
                <span>Total Due:</span>
                <span className="text-pink-400">
                  ₹{isAnnual ? selectedPlan.annualPrice * 12 : selectedPlan.monthlyPrice}
                  <span className="text-xs text-text-secondary font-normal"> / year</span>
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/15 bg-transparent text-xs font-semibold text-white hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Successfully subscribed to ${selectedPlan.name}! (Mock confirmation)`);
                  setShowModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 text-xs font-semibold text-white hover:opacity-90 shadow-md shadow-pink-500/20 cursor-pointer"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
