import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Navbar } from './components/Navbar';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('yearly');

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small creators just getting started.",
      price: { monthly: 19, yearly: 15 },
      popular: false,
      features: [
        "Up to 5 publications/month",
        "1GB storage space",
        "Basic flipbook templates",
        "Standard support",
        "Flipnexa watermark"
      ],
      limitations: [
        "Advanced analytics",
        "Custom domain",
        "API access"
      ]
    },
    {
      name: "Pro",
      description: "Ideal for growing businesses and professional publishers.",
      price: { monthly: 49, yearly: 39 },
      popular: true,
      features: [
        "Unlimited publications",
        "50GB storage space",
        "Premium customizable templates",
        "No watermarks",
        "Basic analytics",
        "Priority email support",
        "Custom branding"
      ],
      limitations: [
        "API access"
      ]
    },
    {
      name: "Business",
      description: "Advanced tools for large organizations and teams.",
      price: { monthly: 149, yearly: 119 },
      popular: false,
      features: [
        "Unlimited everything",
        "500GB storage space",
        "Advanced deep analytics",
        "Custom domain support",
        "Team collaboration (up to 10)",
        "API access",
        "24/7 dedicated phone support",
        "Lead generation forms"
      ],
      limitations: []
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <Navbar />
      
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-10"
            >
              Start your 14-day free trial. No credit card required. Cancel anytime.
            </motion.p>
            
            {/* Billing Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3"
            >
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
              <button 
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-7 w-14 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none"
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly <span className="text-emerald-600 text-xs font-bold bg-emerald-100 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
              </span>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`relative flex flex-col bg-white rounded-3xl border ${plan.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-900/10 scale-105 z-10' : 'border-gray-200 shadow-lg'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8 border-b border-gray-100 flex-grow-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm h-10">{plan.description}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-gray-500 font-medium">/mo</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {billingCycle === 'yearly' ? `Billed $${plan.price.yearly * 12} yearly` : 'Billed monthly'}
                  </p>
                  
                  <button className={`w-full mt-8 py-3.5 px-4 rounded-xl font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-xl' 
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}>
                    Start 14-day Free Trial
                  </button>
                </div>
                
                <div className="p-8 flex-grow">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">What's included</h4>
                  <ul className="space-y-4">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex gap-3 text-gray-600">
                        <Check size={20} className="text-indigo-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map(limitation => (
                      <li key={limitation} className="flex gap-3 text-gray-400">
                        <X size={20} className="text-gray-300 flex-shrink-0" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ or Trust Section */}
          <div className="mt-24 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by innovative teams worldwide</h2>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale mt-8">
               {/* Placeholders for logos */}
               <div className="text-xl font-black font-serif">Acme Corp</div>
               <div className="text-xl font-bold tracking-widest">GLOBAL</div>
               <div className="text-xl font-semibold italic">Innovate.</div>
               <div className="text-xl font-mono font-bold">TECHSTART</div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Flipnexa</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Flipnexa. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
