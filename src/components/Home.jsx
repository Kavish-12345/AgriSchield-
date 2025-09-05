import React, { useState, useEffect } from 'react';
import { Shield, TrendingDown, Users, DollarSign, Zap, BarChart3, AlertTriangle, Wallet, CheckCircle, ExternalLink } from 'lucide-react';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [walletState, setWalletState] = useState({
    isConnected: false,
    account: null,
    isConnecting: false,
    error: null,
    chainId: null,
    balance: null
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setWalletState(prev => ({ 
        ...prev, 
        error: 'MetaMask is not installed. Please install MetaMask to continue.' 
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });

      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);

      setWalletState({
        isConnected: true,
        account: accounts[0],
        isConnecting: false,
        error: null,
        chainId: chainId,
        balance: balanceInEth.toFixed(4)
      });

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect wallet'
      }));
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      account: null,
      isConnecting: false,
      error: null,
      chainId: null,
      balance: null
    });
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Navigation handler - now uses window.location for routing
  const handleNavigation = (path) => {
    if (!walletState.isConnected) {
      alert('Please connect your wallet first to access this feature!');
      return;
    }
    
    // Navigate to the route
    window.location.href = path;
  };

  // Check connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({
              method: 'eth_chainId',
            });
            
            const balance = await window.ethereum.request({
              method: 'eth_getBalance',
              params: [accounts[0], 'latest'],
            });
            
            const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
            
            setWalletState({
              isConnected: true,
              account: accounts[0],
              isConnecting: false,
              error: null,
              chainId: chainId,
              balance: balanceInEth.toFixed(4)
            });
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletState(prev => ({ ...prev, account: accounts[0] }));
        }
      };

      const handleChainChanged = (chainId) => {
        setWalletState(prev => ({ ...prev, chainId }));
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cryptoAssets = [
    { 
      name: "Bitcoin",
      symbol: "BTC",
      icon: "₿",
      price: "$43,250",
      change: "-8.2%",
      gradient: "from-orange-500 to-yellow-600"
    },
    { 
      name: "Ethereum",
      symbol: "ETH", 
      icon: "Ξ",
      price: "$2,485",
      change: "-12.1%",
      gradient: "from-blue-500 to-purple-600"
    }
  ];

  // Wallet Connection Button Component
  const WalletButton = () => {
    if (!walletState.isConnected) {
      return (
        <div className="flex items-center gap-3">
          {walletState.error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg px-3 py-1 text-red-300 text-xs max-w-xs">
              {walletState.error}
            </div>
          )}
          <button 
            onClick={connectWallet}
            disabled={walletState.isConnecting}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:to-orange-600 px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            {walletState.isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <div className="bg-green-500/20 border border-green-500 rounded-lg px-3 py-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <div className="text-sm">
            <div className="text-green-300 font-semibold">{formatAddress(walletState.account)}</div>
            <div className="text-green-400 text-xs">{walletState.balance} ETH</div>
          </div>
        </div>
        <button 
          onClick={disconnectWallet}
          className="bg-gray-600 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-lg z-50 border-b border-blue-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
                  CRYPTOSHIELD
                </span>
                <div className="text-xs text-blue-400 opacity-80">CROSS-CRYPTO INSURANCE</div>
              </div>
            </div>
            
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* MetaMask Installation Notice */}
      {!isMetaMaskInstalled() && (
        <div className="fixed top-20 left-0 right-0 bg-orange-500/90 backdrop-blur-sm z-40 p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
            <AlertTriangle className="w-5 h-5 text-white" />
            <span className="text-white font-medium">
              MetaMask not detected. 
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1 hover:text-orange-200 inline-flex items-center gap-1"
              >
                Install MetaMask <ExternalLink className="w-3 h-3" />
              </a> 
              to use this dApp.
            </span>
          </div>
        </div>
      )}



      {/* Hero Section */}
      <section className={`min-h-screen flex items-center justify-center px-4 ${!isMetaMaskInstalled() ? 'pt-32' : 'pt-20'}`}>
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-orange-400 to-blue-400">
              CROSS-CRYPTO
            </span>
            <span className="block text-white">
              INSURANCE POOL
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Protect against{' '}
            <span className="text-blue-400 font-semibold">BTC/ETH crashes</span> with{' '}
            <span className="text-orange-400 font-semibold">decentralized insurance</span> powered by{' '}
            <span className="text-purple-400 font-semibold">Somnia price feeds</span>
          </p>
          

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '$2.4M', label: 'POOL VALUE', icon: DollarSign },
              { value: '1,847', label: 'POLICIES', icon: Users },
              { value: '24hrs', label: 'CLAIMS', icon: Zap },
              { value: '97.8%', label: 'SUCCESS', icon: BarChart3 }
            ].map((stat, index) => (
              <div key={index} className="bg-black/50 backdrop-blur-sm border border-blue-500/10 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
                <stat.icon className="w-6 h-6 text-blue-400 mb-2 mx-auto" />
                <div className="text-xl font-bold text-blue-300">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
          {/* Primary CTA */}
<div className="flex flex-col sm:flex-row gap-14 justify-center items-center mb-16">
  <button
    onClick={() => handleNavigation('/Registration')}
    disabled={!walletState.isConnected}
    className={`relative mt-23 px-12 py-5 rounded-3xl font-extrabold text-xl transition-all duration-300 flex items-center gap-4 cursor-pointer
      ${
        walletState.isConnected
          ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-cyan-400/40 transform hover:-translate-y-1 hover:scale-105'
          : 'bg-slate-700/40 text-slate-400 cursor-not-allowed'
      }`}
  >
    {walletState.isConnected ? (
      <>
        <span className="inline-flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 .896-2 2-2 2 .896 2 2zm0 0c0 1.104.896 2 2 2s2-.896 2-2-.896-2-2-2-2 .896-2 2zM5.5 20.5h13a2.5 2.5 0 002.5-2.5V9.5c0-.828-.672-1.5-1.5-1.5h-2.5l-2-3h-6l-2 3H4.5c-.828 0-1.5.672-1.5 1.5v8.5a2.5 2.5 0 002.5 2.5z"
            />
          </svg>
          Get Insurance Now
        </span>
      </>
    ) : (
      'Connect Wallet First'
    )}
  </button>
</div>


      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
            HOW IT WORKS
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <DollarSign className="w-10 h-10" />,
                title: "Pay USDC Premium",
                description: "Deposit USDC into the community insurance pool"
              },
              {
                icon: <BarChart3 className="w-10 h-10" />,
                title: "Price Monitoring", 
                description: "Somnia's native oracles track BTC/ETH prices in real-time"
              },
              {
                icon: <Zap className="w-10 h-10" />,
                title: "Auto Payouts",
                description: "Smart contracts trigger instant payouts when crashes occur"
              }
            ].map((step, index) => (
              <div key={index} className="text-center bg-black/60 backdrop-blur-sm border border-blue-500/10 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-orange-600/20 rounded-full flex items-center justify-center text-blue-400 mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-300">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;