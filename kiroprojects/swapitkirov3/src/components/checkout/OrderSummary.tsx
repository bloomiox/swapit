'use client';

import React from 'react';
import { Star, Zap, Clock, Shield, TrendingUp, Eye } from 'lucide-react';
import { BoostType, Currency, getBoostPrice, formatCurrency } from '@/lib/stripe';

interface OrderSummaryProps {
  itemTitle: string;
  boostType: BoostType;
  currency: Currency;
}

const BOOST_DETAILS = {
  premium: {
    name: 'Premium Boost',
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Highlight your item with a premium badge',
    features: [
      'Premium badge on your listing',
      '3x more visibility',
      'Higher search ranking',
      'Email notifications for interest',
    ],
    duration: 7,
  },
  featured: {
    name: 'Featured Boost',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Show your item at the top of search results',
    features: [
      'Top placement in search results',
      'Featured section visibility',
      '5x more views',
      'Priority in category listings',
    ],
    duration: 7,
  },
  urgent: {
    name: 'Urgent Boost',
    icon: Clock,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Mark as urgent with priority placement',
    features: [
      'Urgent badge and priority placement',
      'Top of all search results',
      '7x more visibility',
      'Instant notifications to interested users',
    ],
    duration: 7,
  },
};

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  itemTitle,
  boostType,
  currency,
}) => {
  const boostDetails = BOOST_DETAILS[boostType];
  const Icon = boostDetails.icon;
  const price = getBoostPrice(boostType, currency);
  const formattedPrice = formatCurrency(price, currency);

  return (
    <div className="space-y-6">
      {/* Item Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Item</h3>
            <p className="text-gray-600">{itemTitle}</p>
          </div>

          <div className={`border-2 rounded-lg p-4 ${boostDetails.borderColor} ${boostDetails.bgColor}`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg ${boostDetails.bgColor}`}>
                <Icon className={`w-5 h-5 ${boostDetails.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{boostDetails.name}</h3>
                <p className="text-sm text-gray-600">{boostDetails.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {boostDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${boostDetails.color.replace('text-', 'bg-')}`} />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium text-gray-900">{boostDetails.duration} days</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Price</span>
              <span className="font-medium text-gray-900">{formattedPrice}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formattedPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Boost Your Item?</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Increased Visibility</h4>
              <p className="text-sm text-gray-600">
                Get significantly more views from potential swappers
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Higher Success Rate</h4>
              <p className="text-sm text-gray-600">
                Boosted items are 3x more likely to get swap requests
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Quality Assurance</h4>
              <p className="text-sm text-gray-600">
                Boosted items undergo additional quality checks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">Satisfaction Guarantee</h4>
            <p className="text-sm text-green-700 mt-1">
              If you're not satisfied with the boost performance, contact us within 24 hours for a full refund.
            </p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
        <p className="text-sm text-gray-600 mb-3">
          Our support team is here to help with any questions about boosts or payments.
        </p>
        <a 
          href="/contact" 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Contact Support →
        </a>
      </div>
    </div>
  );
};