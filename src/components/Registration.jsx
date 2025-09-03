import React, { useState } from 'react';
import { 
  Shield, 
  Droplets,
  Calendar,
  DollarSign,
  Wallet,
  ArrowLeft,
  Lock,
  TrendingUp,
  Coffee,
  Coins,
  Package,
  Copy
} from 'lucide-react';

const Registration = () => {
  // Get commodity from URL params or default to oil
  const getCommodityFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const commodityType = urlParams.get('commodity') || 'oil';
    
    const commodities = {
      coffee: {
        id: 'coffee',
        name: 'COFFEE',
        description: 'Premium arabica beans',
        price: '$1.85/lb',
        change: '-8.2%',
        volume: '2.4M',
        status: 'CRITICAL',
        icon: Coffee,
        color: 'from-amber-600 to-orange-600',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30'
      },
      gold: {
        id: 'gold',
        name: 'GOLD',
        description: '24K pure gold bullion',
        price: '$1925/oz',
        change: '+0.8%',
        volume: '8.7M',
        status: 'STABLE',
        icon: Coins,
        color: 'from-yellow-500 to-yellow-600',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30'
      },
      oil: {
        id: 'oil',
        name: 'OIL',
        description: 'Crude oil benchmark',
        price: '$73.50/barrel',
        change: '-1.8%',
        volume: '12.2M',
        status: 'STABLE',
        icon: Droplets,
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30'
      },
      sugar: {
        id: 'sugar',
        name: 'SUGAR',
        description: 'Non-GMO refined sugar',
        price: '$0.19/lb',
        change: '-5.2%',
        volume: '6.8M',
        status: 'WARNING',
        icon: Package,
        color: 'from-pink-500 to-rose-500',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/30'
      }
    };
    
    return commodities[commodityType] || commodities.oil;
  };

  const [commodity] = useState(getCommodityFromUrl());
  const [formData, setFormData] = useState({
    dueDate: '',
    paymentAmount: ''
  });
  const [walletAddress] = useState('0x742d35Cc6634C0532925a3b8D2a9C7C5c2D6C8E9');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 90);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = () => {
    if (!formData.dueDate || !formData.paymentAmount) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Registration successful! Your policy is now active.');
    }, 2000);
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goBack = () => {
    console.log('Navigate back to home');
  };

  const Icon = commodity.icon;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-gray-800">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-400">AGRISCHIELD</h1>
                <p className="text-gray-400 text-sm">Commodity Insurance</p>
              </div>
            </div>
          </div>

          {/* Commodity Info in Header */}
          <div className={`flex items-center gap-3 ${commodity.bgColor} ${commodity.borderColor} border rounded-lg px-4 py-2`}>
            <div className={`w-8 h-8 bg-gradient-to-r ${commodity.color} rounded-full flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold">{commodity.name}</div>
              <div className="text-gray-400 text-sm flex items-center gap-2">
                <span>{commodity.price}</span>
                <span className={commodity.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                  {commodity.change}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Title */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${commodity.color} rounded-full flex items-center justify-center`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Protect Your {commodity.name}</h2>
            <p className="text-gray-400 text-lg">Set up insurance coverage and pay your premium</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Left Column - Registration Form */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-green-400" />
                Registration Details
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-3 font-medium">
                    Delivery (Due) Date
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({...prev, dueDate: e.target.value}))}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-4 text-white text-lg focus:border-green-500 focus:outline-none transition-all duration-300"
                  />
                  <p className="text-gray-500 text-sm mt-2">Minimum 90 days from today</p>
                </div>

                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Wallet className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300 font-medium">Connected Wallet</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/50 rounded-lg p-3">
                    <span className="text-gray-400 text-sm font-mono flex-1">{walletAddress}</span>
                    <button
                      onClick={copyWalletAddress}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  {copied && <p className="text-green-400 text-sm mt-2">Address copied!</p>}
                </div>

                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Market Data
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Price:</span>
                      <span className="text-white font-mono">{commodity.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">24h Change:</span>
                      <span className={`font-mono ${commodity.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {commodity.change}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volume:</span>
                      <span className="text-yellow-400 font-mono">{commodity.volume}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-bold ${
                        commodity.status === 'CRITICAL' ? 'text-red-400' :
                        commodity.status === 'WARNING' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {commodity.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Form */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-400" />
                Premium Payment
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-3 font-medium">
                    Premium Amount (USDC)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.paymentAmount}
                      onChange={(e) => setFormData(prev => ({...prev, paymentAmount: e.target.value}))}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-12 pr-4 py-4 text-white text-lg placeholder-gray-400 focus:border-green-500 focus:outline-none transition-all duration-300"
                      placeholder="Enter premium amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Wallet className="w-6 h-6 text-blue-400" />
                    <h4 className="text-blue-400 font-semibold text-lg">Payment Method</h4>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">$</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-lg">USDC</div>
                      <div className="text-gray-400">USD Coin - Stablecoin</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Coverage Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coverage Type:</span>
                      <span className="text-white">Price Protection</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Coverage:</span>
                      <span className="text-white">100% of Premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Premium Yield:</span>
                      <span className="text-green-400">AAVE Interest</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Lock className="w-6 h-6 text-green-400 mt-1" />
                    <div>
                      <h4 className="text-green-400 font-semibold text-lg mb-2">Earn While Protected</h4>
                      <p className="text-gray-300 text-sm">
                        Your premium is deposited into AAVE lending protocol, earning yield while providing insurance coverage for your commodity investment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleSubmit}
              disabled={!formData.dueDate || !formData.paymentAmount || loading}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 mx-auto min-w-[300px]"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield className="w-6 h-6" />
                  Register & Pay Premium
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
    </div>
  );
};

export default Registration;