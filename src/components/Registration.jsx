import React, { useState } from 'react';
import { 
  Shield, 
  Calendar,
  DollarSign,
  Wallet,
  ArrowLeft,
  Lock,
  Copy
} from 'lucide-react';

const Registration = () => {
  const [formData, setFormData] = useState({
    dueDate: '',
    paymentAmount: '',
    asset: 'BTC'
  });
  const [walletAddress] = useState('0x742d35Cc6634C0532925a3b8D2a9C7C5c2D6C8E9');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 90);
    return date.toISOString().split('T')[0];
  };

  const handleRegister = () => {
    if (!formData.asset || !formData.dueDate) return;
    setRegistered(true);
    alert(`Asset ${formData.asset} registered successfully!`);
  };

  const handlePremiumPayment = () => {
    if (!formData.paymentAmount) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Premium of ${formData.paymentAmount} USDC paid for ${formData.asset}!`);
    }, 2000);
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      
      {/* Header */}
      <div className="relative z-10 p-6 border-b border-blue-500/20">
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
                  CRYPTOSHIELD
                </h1>
                <p className="text-gray-400 text-sm">BTC & ETH Insurance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Title */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
              Protect Your Assets
            </h2>
            <p className="text-gray-300 text-lg">Choose asset, set coverage and pay your premium</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Registration Card */}
            <div className="bg-black/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-400">
                <Calendar className="w-6 h-6" />
                Registration Details
              </h3>
              
              <div className="space-y-6">
                {/* Asset Dropdown */}
                <div>
                  <label className="block text-gray-300 mb-3 font-medium">
                    Select Asset
                  </label>
                  <select
                    value={formData.asset}
                    onChange={(e) => setFormData(prev => ({...prev, asset: e.target.value}))}
                    className="w-full bg-black/40 border border-blue-500/20 rounded-lg px-4 py-3 text-white text-lg focus:border-blue-500 focus:outline-none transition-all duration-300"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-gray-300 mb-3 font-medium">
                    Delivery (Due) Date
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({...prev, dueDate: e.target.value}))}
                    className="w-full bg-black/40 border border-blue-500/20 rounded-lg px-4 py-3 text-white text-lg focus:border-blue-500 focus:outline-none transition-all duration-300"
                  />
                  <p className="text-gray-500 text-sm mt-2">Minimum 90 days from today</p>
                </div>

                {/* Wallet */}
                <div className="bg-black/40 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Wallet className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300 font-medium">Connected Wallet</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/60 rounded-lg p-3 border border-blue-500/10">
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

                {/* Register Button */}
                <button
                  onClick={handleRegister}
                  className="w-full px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                >
                  Register Asset
                </button>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-black/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-400">
                <DollarSign className="w-6 h-6" />
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
                      className="w-full bg-black/40 border border-blue-500/20 rounded-lg pl-12 pr-4 py-4 text-white text-lg placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="Enter premium amount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Pay Premium Button */}
                <button
                  onClick={handlePremiumPayment}
                  disabled={!registered}
                  className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg
                    ${registered 
                      ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white hover:shadow-cyan-400/40' 
                      : 'bg-slate-700/40 text-slate-400 cursor-not-allowed'}`}
                >
                  {loading ? 'Processing...' : 'Pay Premium'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Registration;
