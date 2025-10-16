'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Star, Zap, Clock, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { BoostType } from '@/lib/stripe';

const BOOST_ICONS = {
  premium: Star,
  featured: Zap,
  urgent: Clock,
};

const BOOST_COLORS = {
  premium: 'text-blue-600',
  featured: 'text-purple-600',
  urgent: 'text-red-600',
};

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [confetti, setConfetti] = useState(true);
  
  const itemId = searchParams.get('itemId');
  const boostType = searchParams.get('boostType') as BoostType;
  
  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const BoostIcon = boostType ? BOOST_ICONS[boostType] : Star;
  const boostColor = boostType ? BOOST_COLORS[boostType] : 'text-blue-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-70" />
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Main Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your boost is now active and your item is getting more visibility!
          </p>

          {/* Boost Details */}
          {boostType && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-full">
                  <BoostIcon className={`w-8 h-8 ${boostColor}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {boostType.charAt(0).toUpperCase() + boostType.slice(1)} Boost Active
                  </h2>
                  <p className="text-gray-600">7 days of enhanced visibility</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">3-7x</div>
                  <div className="text-sm text-gray-600">More Views</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">7</div>
                  <div className="text-sm text-gray-600">Days Active</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Monitoring</div>
                </div>
              </div>
            </div>
          )}

          {/* What Happens Next */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-2xl mx-auto text-left">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              What Happens Next?
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Boost Activation</h4>
                  <p className="text-gray-600 text-sm">
                    Your item is now featured prominently in search results and category listings.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-green-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Increased Visibility</h4>
                  <p className="text-gray-600 text-sm">
                    More users will see your item, leading to more views and swap requests.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-purple-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Notifications</h4>
                  <p className="text-gray-600 text-sm">
                    You'll receive email notifications about new interest in your item.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {itemId && (
              <Link href={`/item/${itemId}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  View Your Item
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Questions about your boost? We're here to help!
            </p>
            <Link 
              href="/contact" 
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}