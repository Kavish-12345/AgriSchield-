import React, { useState, useEffect } from 'react';
import {
  Shield, Calendar, DollarSign, Wallet,
  ArrowLeft, AlertCircle, CheckCircle,
  ExternalLink, Loader2
} from 'lucide-react';

// Import from your abi.js file
import { 
  LOGIC_CONTRACT_ABI, 
  MOCK_USDC_ABI, 
  CONTRACT_ADDRESSES,
  SOMNIA_CONFIG,
  ASSETS,
  ASSET_NAMES,
  getExplorerUrl
} from '../abi.js';

const Registration = () => {
  // Form state
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [dueDate, setDueDate] = useState('');
  const [premiumAmount, setPremiumAmount] = useState('');
  const [poolBalance, setPoolBalance] = useState('0');
  const [totalShares, setTotalShares] = useState('0');
  const [isOwner, setIsOwner] = useState(false);
  const [fundingAmount, setFundingAmount] = useState('');

  // Web3 state
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [usdcContract, setUsdcContract] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState('0');
  
  // Registration state
  const [isRegistered, setIsRegistered] = useState(false);
  const [userCoop, setUserCoop] = useState(null);
  const [crashStatus, setCrashStatus] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', txHash: '' });

  // Connect to Somnia network
  const switchToSomnia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${SOMNIA_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${SOMNIA_CONFIG.chainId.toString(16)}`,
            chainName: SOMNIA_CONFIG.chainName,
            rpcUrls: [SOMNIA_CONFIG.rpcUrl],
            blockExplorerUrls: [SOMNIA_CONFIG.blockExplorer],
            nativeCurrency: {
              name: 'STT',
              symbol: 'STT',
              decimals: 18
            }
          }],
        });
      }
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      showMessage('error', 'Please install MetaMask');
      return;
    }

    try {
      setLoading(true);
      
      // Switch to Somnia network first
      await switchToSomnia();
      
      const { ethers } = await import('ethers');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Initialize contracts
      const logicContract = new ethers.Contract(CONTRACT_ADDRESSES.logic, LOGIC_CONTRACT_ABI, signer);
      const usdcContract = new ethers.Contract(CONTRACT_ADDRESSES.usdc, MOCK_USDC_ABI, signer);
      
      setWalletAddress(address);
      setIsConnected(true);
      setContract(logicContract);
      setUsdcContract(usdcContract);
      
      showMessage('success', 'Wallet connected successfully!');
      
      // Load user data
      loadUserData(logicContract, usdcContract, address);
      
    } catch (error) {
      console.error('Connection error:', error);
      showMessage('error', 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  // Load pool data
  const loadPoolData = async (logicContract, usdcContract, address) => {
    try {
      const { ethers } = await import('ethers');
      
      // Get TOTAL contract balance (includes both owner funding AND user premiums)
      const contractBalance = await usdcContract.balanceOf(CONTRACT_ADDRESSES.logic);
      setPoolBalance(ethers.formatUnits(contractBalance, 6));
      
      // Get total shares (this represents total premiums paid by users)
      const shares = await logicContract.totalShares();
      setTotalShares(ethers.formatUnits(shares, 6));
      
      // Check if user is owner
      const owner = await logicContract.owner();
      setIsOwner(address.toLowerCase() === owner.toLowerCase());
      
      console.log('Pool Data:');
      console.log('- TOTAL Pool Balance (Owner + Premiums):', ethers.formatUnits(contractBalance, 6), 'USDC');
      console.log('- Total User Premiums:', ethers.formatUnits(shares, 6), 'USDC');
      console.log('- Is Owner:', address.toLowerCase() === owner.toLowerCase());
      
      // Calculate how much was owner-funded vs premium-funded
      const ownerFunding = parseFloat(ethers.formatUnits(contractBalance, 6)) - parseFloat(ethers.formatUnits(shares, 6));
      console.log('- Owner Funding:', Math.max(0, ownerFunding), 'USDC');
      
    } catch (error) {
      console.error('Error loading pool data:', error);
    }
  };

  // Load user data with contract fallback
  const loadUserData = async (logicContract, usdcContract, address) => {
    try {
      const { ethers } = await import('ethers');
      
      // Load USDC balance with fallback
      try {
        const balance = await usdcContract.balanceOf(address);
        setUsdcBalance(ethers.formatUnits(balance, 6));
        console.log('USDC Balance loaded:', ethers.formatUnits(balance, 6));
      } catch (balanceError) {
        console.error('Failed to load USDC balance:', balanceError);
        setUsdcBalance('0');
        showMessage('error', 'USDC contract not responding. The contract may need to be redeployed with proper syntax.');
      }
      
      // Load pool data
      await loadPoolData(logicContract, usdcContract, address);
      
      // Check if user is registered
      try {
        const coopData = await logicContract.cooperatives(address);
        console.log('Cooperative data:', coopData);
        
        if (coopData.isActive) {
          setUserCoop({
            asset: coopData.asset,
            dueDate: new Date(Number(coopData.dueDate) * 1000),
            premiumPaid: ethers.formatUnits(coopData.premiumPaid, 6),
            hasClaimed: coopData.hasClaimed
          });
          setIsRegistered(true);
          
          // Load crash status
          const crash = await logicContract.getCrashStatus(address);
          setCrashStatus({
            crashPercentage: Number(crash.crashPercentage),
            isCrashed: crash.isCrashed,
            canClaim: crash.canClaim
          });
        }
      } catch (coopError) {
        console.error('Failed to load cooperative data:', coopError);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleTestTransaction = async () => {
  if (!contract) {
    alert("Contract not loaded!");
    return;
  }

  try {
    // This will trigger MetaMask
    const tx = await contract.claimPayout();  
    console.log('Transaction submitted:', tx.hash);

    // Wait for confirmation
    await tx.wait();
    console.log('Transaction confirmed!');
  } catch (err) {
    console.error('Error sending transaction:', err);
  }
};


  // Add fund pool function for owner
 const handleFundPool = async () => {
  if (!contract || !usdcContract || !fundingAmount) { // Change to fundingAmount
    showMessage('error', 'Please enter funding amount');
    return;
  }
    
    try {
      setLoading(true);
      showMessage('info', 'Funding pool...');
      
      const { ethers } = await import('ethers');
      const amount = ethers.parseUnits(fundingAmount, 6); // Change to fundingAmount
      
      console.log('Pool Funding Debug:');
      console.log('- Funding Amount:', fundingAmount);
      console.log('- Amount (wei):', amount.toString());
      console.log('- Wallet:', walletAddress);
      console.log('- Is Owner:', isOwner);
      
      // Check USDC balance
      const balance = await usdcContract.balanceOf(walletAddress);
      const balanceFormatted = ethers.formatUnits(balance, 6);
      console.log('- USDC Balance:', balanceFormatted);
      
      if (balance < amount) {
        showMessage('error', `Insufficient USDC balance. You have ${balanceFormatted}, need ${fundingAmount}`);
        setLoading(false);
        return;
      }
      
      // Check allowance
      const currentAllowance = await usdcContract.allowance(walletAddress, CONTRACT_ADDRESSES.logic);
      
      if (currentAllowance < amount) {
        showMessage('info', 'Approving USDC for pool funding...');
        const approveTx = await usdcContract.approve(CONTRACT_ADDRESSES.logic, amount);
        showMessage('info', 'Approval transaction submitted...', approveTx.hash);
        await approveTx.wait();
        showMessage('info', 'USDC approved. Funding pool...');
      }
      
      // Fund pool
      const tx = await contract.fundPool(amount);
      console.log('- Fund Pool TX:', tx.hash);
      showMessage('info', 'Pool funding submitted...', tx.hash);
      
      const receipt = await tx.wait();
      console.log('- Pool funding confirmed:', receipt);
      showMessage('success', `Pool funded with ${fundingAmount} USDC!`, tx.hash);
      
      // Clear form and refresh data
      setFundingAmount('');
      
      setTimeout(() => {
        loadUserData(contract, usdcContract, walletAddress);
      }, 3000);
      
    } catch (error) {
      console.error('Pool funding error:', error);
      
      let errorMessage = 'Pool funding failed';
      if (error.reason) {
        errorMessage = `Pool funding failed: ${error.reason}`;
      } else if (error.message) {
        errorMessage = `Pool funding failed: ${error.message}`;
      }
      
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get USDC from faucet with simplified validation
  const handleFaucet = async () => {
    if (!usdcContract) {
      showMessage('error', 'USDC contract not connected');
      return;
    }
    
    try {
      setLoading(true);
      showMessage('info', 'Checking USDC contract...');
      
      const { ethers } = await import('ethers');
      
      console.log('Faucet Debug:');
      console.log('- USDC Contract:', CONTRACT_ADDRESSES.usdc);
      console.log('- Wallet:', walletAddress);
      console.log('- Current Balance (UI):', usdcBalance);
      
      showMessage('info', 'Checking current balance...');
      
      try {
        const currentBalance = await usdcContract.balanceOf(walletAddress);
        console.log('- Current Balance (raw):', currentBalance.toString());
        
        const balanceFormatted = ethers.formatUnits(currentBalance, 6);
        console.log('- Current Balance (formatted):', balanceFormatted);
        
        const balanceInUSDC = parseFloat(balanceFormatted);
        if (balanceInUSDC >= 1000) {
          showMessage('error', 'You already have enough USDC (1000+ limit in faucet)');
          setLoading(false);
          return;
        }
        
        showMessage('info', 'Requesting USDC from faucet...');
        
      } catch (balanceError) {
        console.error('Balance check failed:', balanceError);
        
        if (balanceError.message?.includes('BAD_DATA')) {
          showMessage('error', `USDC contract not found at ${CONTRACT_ADDRESSES.usdc}. Please verify the contract address is correct and deployed on Somnia testnet.`);
        } else {
          showMessage('error', `Balance check failed: ${balanceError.message}`);
        }
        setLoading(false);
        return;
      }
      
      const tx = await usdcContract.faucet();
      console.log('- Faucet TX Hash:', tx.hash);
      showMessage('info', 'Faucet transaction submitted...', tx.hash);
      
      const receipt = await tx.wait();
      console.log('- Transaction confirmed:', receipt);
      showMessage('success', 'USDC received from faucet!', tx.hash);
      
      setTimeout(() => {
        console.log('Refreshing balance after faucet...');
        loadUserData(contract, usdcContract, walletAddress);
      }, 3000);
      
    } catch (error) {
      console.error('Faucet error:', error);
      
      let errorMessage = 'Faucet failed';
      if (error.message?.includes('BAD_DATA')) {
        errorMessage = 'USDC contract not responding. Please check if the contract is deployed correctly on Somnia testnet.';
      } else if (error.message?.includes('Already have enough')) {
        errorMessage = 'You already have enough USDC (limit: 1000 USDC)';
      } else if (error.reason) {
        errorMessage = `Faucet failed: ${error.reason}`;
      } else if (error.message) {
        errorMessage = `Faucet failed: ${error.message}`;
      }
      
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register asset
  const handleRegister = async () => {
    if (!contract || !dueDate) {
      showMessage('error', 'Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      showMessage('info', 'Registering asset...');
      
      const { ethers } = await import('ethers');
      const dueDateTime = Math.floor(new Date(dueDate).getTime() / 1000);
      const assetEnum = ASSETS[selectedAsset];
      
      const tx = await contract.registry(walletAddress, assetEnum, dueDateTime);
      showMessage('info', 'Registration submitted...', tx.hash);
      
      await tx.wait();
      showMessage('success', 'Asset registered successfully!', tx.hash);
      setIsRegistered(true);
      
      loadUserData(contract, usdcContract, walletAddress);
      
    } catch (error) {
      console.error('Registration error:', error);
      showMessage('error', `Registration failed: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Pay premium with comprehensive debugging
  const handlePayPremium = async () => {
    if (!contract || !usdcContract || !premiumAmount) {
      showMessage('error', 'Please enter premium amount');
      return;
    }
    
    try {
      setLoading(true);
      showMessage('info', 'Processing premium payment...');
      
      const { ethers } = await import('ethers');
      const amount = ethers.parseUnits(premiumAmount, 6);
      
      console.log('Premium Payment Debug:');
      console.log('- Premium Amount:', premiumAmount);
      console.log('- Amount (wei):', amount.toString());
      console.log('- Wallet:', walletAddress);
      console.log('- Logic Contract:', CONTRACT_ADDRESSES.logic);
      console.log('- USDC Contract:', CONTRACT_ADDRESSES.usdc);
      
      const coop = await contract.cooperatives(walletAddress);
      console.log('- User Registered:', coop.isActive);
      
      if (!coop.isActive) {
        showMessage('error', 'You must register first before paying premium');
        setLoading(false);
        return;
      }
      
      const balance = await usdcContract.balanceOf(walletAddress);
      const balanceFormatted = ethers.formatUnits(balance, 6);
      console.log('- USDC Balance:', balanceFormatted);
      
      if (balance < amount) {
        showMessage('error', `Insufficient USDC balance. You have ${balanceFormatted}, need ${premiumAmount}`);
        setLoading(false);
        return;
      }
      
      const currentAllowance = await usdcContract.allowance(walletAddress, CONTRACT_ADDRESSES.logic);
      const allowanceFormatted = ethers.formatUnits(currentAllowance, 6);
      console.log('- Current Allowance:', allowanceFormatted);
      
      if (currentAllowance < amount) {
        showMessage('info', 'Approving USDC spending...');
        console.log('- Approving amount:', ethers.formatUnits(amount, 6));
        
        const approveTx = await usdcContract.approve(CONTRACT_ADDRESSES.logic, amount);
        console.log('- Approval TX:', approveTx.hash);
        showMessage('info', 'Approval transaction submitted...', approveTx.hash);
        
        await approveTx.wait();
        console.log('- Approval confirmed');
        showMessage('info', 'USDC approved. Processing premium payment...');
      }
      
      const newAllowance = await usdcContract.allowance(walletAddress, CONTRACT_ADDRESSES.logic);
      console.log('- New Allowance:', ethers.formatUnits(newAllowance, 6));
      
      if (newAllowance < amount) {
        showMessage('error', 'Allowance still insufficient after approval');
        setLoading(false);
        return;
      }
      
      console.log('- Calling premiumPayment with amount:', amount.toString());
      const tx = await contract.premiumPayment(amount);
      console.log('- Premium Payment TX:', tx.hash);
      showMessage('info', 'Premium payment submitted...', tx.hash);
      
      const receipt = await tx.wait();
      console.log('- Premium payment confirmed:', receipt);
      showMessage('success', `Premium payment of ${premiumAmount} USDC successful!`, tx.hash);
      
      setPremiumAmount('');
      
      setTimeout(() => {
        console.log('Refreshing data after premium payment...');
        loadUserData(contract, usdcContract, walletAddress);
      }, 3000);
      
    } catch (error) {
      console.error('Premium payment error:', error);
      
      let errorMessage = 'Payment failed';
      if (error.message?.includes('execution reverted')) {
        if (error.data) {
          console.log('- Error data:', error.data);
          if (error.data === '0x13be252b') {
            errorMessage = 'Invalid payment amount';
          } else if (error.data === '0x7138356f') {
            errorMessage = 'You must register first before paying premium';
          } else {
            errorMessage = 'Transaction failed - check if you are registered and have sufficient balance';
          }
        } else {
          errorMessage = 'Transaction failed - please check your registration status and balance';
        }
      } else if (error.reason) {
        errorMessage = `Payment failed: ${error.reason}`;
      } else if (error.message) {
        errorMessage = `Payment failed: ${error.message}`;
      }
      
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced claim function
  const handleClaim = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      showMessage('info', 'Validating claim eligibility...');
      
      console.log('Claim Debug:');
      console.log('- Wallet:', walletAddress);
      console.log('- Contract:', CONTRACT_ADDRESSES.logic);
      
      const { ethers } = await import('ethers');
      
      // Get detailed status before claiming
      const crashStatus = await contract.getCrashStatus(walletAddress);
      console.log('- Crash Status:', {
        crashPercentage: Number(crashStatus.crashPercentage),
        isCrashed: crashStatus.isCrashed,
        canClaim: crashStatus.canClaim,
        isActive: crashStatus.isActive
      });
      
      // Check pool balance
      const poolBalance = await usdcContract.balanceOf(CONTRACT_ADDRESSES.logic);
      const poolBalanceFormatted = ethers.formatUnits(poolBalance, 6);
      console.log('- Pool Balance:', poolBalanceFormatted, 'USDC');
      
      // Pre-validation checks
      if (!crashStatus.canClaim) {
        let reason = 'Cannot claim payout';
        if (!crashStatus.isActive) {
          reason = 'Registration not active or expired';
        } else if (!crashStatus.isCrashed) {
          reason = `Price drop (${Number(crashStatus.crashPercentage)}%) below 15% threshold`;
        } else if (Number(crashStatus.crashPercentage) === 0) {
          reason = 'No price crash detected';
        }
        
        showMessage('error', reason);
        setLoading(false);
        return;
      }
      
      if (poolBalance.toString() === '0') {
        showMessage('error', 'Insurance pool is empty. Pool needs to be funded by contract owner.');
        setLoading(false);
        return;
      }
      
      showMessage('info', 'Processing withdrawal...');
      const tx = await contract.withdrawPayout();
      console.log('- Claim TX:', tx.hash);
      showMessage('info', 'Withdrawal submitted...', tx.hash);
      
      const receipt = await tx.wait();
      console.log('- Claim confirmed:', receipt);
      
      showMessage('success', 'Payout claimed successfully!', tx.hash);
      
      setTimeout(() => {
        loadUserData(contract, usdcContract, walletAddress);
      }, 3000);
      
    } catch (error) {
      console.error('Claim error:', error);
      
      let errorMessage = 'Claim failed';
      if (error.message?.includes('DueDateExpired')) {
        errorMessage = 'Coverage has expired';
      } else if (error.message?.includes('AlreadyClaimed')) {
        errorMessage = 'Payout already claimed';
      } else if (error.message?.includes('NotRegistered')) {
        errorMessage = 'Not registered for insurance';
      } else if (error.message?.includes('NoPayoutEligible')) {
        errorMessage = 'No payout eligible - price crash below 15% threshold';
      } else if (error.message?.includes('InvalidPoolState')) {
        errorMessage = 'Insurance pool is empty or invalid';
      } else if (error.reason) {
        errorMessage = `Claim failed: ${error.reason}`;
      } else if (error.message) {
        errorMessage = `Claim failed: ${error.message}`;
      }
      
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const showMessage = (type, text, txHash = '') => {
    setMessage({ type, text, txHash });
    if (type === 'success') {
      setTimeout(() => setMessage({ type: '', text: '', txHash: '' }), 5000);
    }
  };

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 90);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-orange-600/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-blue-500/20">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
                CRYPTOSHIELD
              </h1>
              <p className="text-gray-400 text-sm">Somnia Network</p>
            </div>
          </div>
          
          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-orange-600 rounded-lg font-medium hover:from-blue-500 hover:to-orange-500 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect Wallet'}
            </button>
          ) : (
            <div className="text-right">
              <p className="text-sm text-gray-400">Connected</p>
              <p className="text-sm font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      {message.text && (
        <div className="relative z-10 p-4 mx-6">
          <div className="max-w-6xl mx-auto">
            <div className={`border rounded-lg p-4 flex items-center gap-3 ${
              message.type === 'error' ? 'bg-red-500/10 border-red-500/20' :
              message.type === 'success' ? 'bg-green-500/10 border-green-500/20' :
              'bg-blue-500/10 border-blue-500/20'
            }`}>
              {message.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
               message.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
               <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
              <span className={
                message.type === 'error' ? 'text-red-300' :
                message.type === 'success' ? 'text-green-300' :
                'text-blue-300'
              }>{message.text}</span>
              {message.txHash && (
                <a 
                  href={getExplorerUrl(message.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  View TX <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Title */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-orange-600 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
              Crypto Insurance
            </h2>
            <p className="text-gray-300">Simple 3-step process: Get USDC → Register Asset → Pay Premium</p>
          </div>

          {/* Pool Status Section */}
          {isConnected && (
            <div className="bg-black/60 border border-blue-500/10 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-green-400">Insurance Pool Status</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-400">Total Pool Balance:</p>
                  <p className="text-lg font-bold text-green-400">{parseFloat(poolBalance).toFixed(2)} USDC</p>
                  <p className="text-xs text-gray-500">Owner funding + User premiums</p>
                </div>
                
                <div>
                  <p className="text-gray-400">User Premiums:</p>
                  <p className="text-lg font-bold text-blue-400">{parseFloat(totalShares).toFixed(2)} USDC</p>
                  <p className="text-xs text-gray-500">Collected from users</p>
                </div>
                
                <div>
                  <p className="text-gray-400">Owner Funding:</p>
                  <p className="text-lg font-bold text-purple-400">
                    {Math.max(0, parseFloat(poolBalance) - parseFloat(totalShares)).toFixed(2)} USDC
                  </p>
                  <p className="text-xs text-gray-500">Additional owner capital</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-medium">Pool Health Status:</span>
                  <span className={`font-bold ${parseFloat(poolBalance) > parseFloat(totalShares) * 0.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {parseFloat(poolBalance) > parseFloat(totalShares) * 0.5 ? 'HEALTHY' : 'NEEDS MORE FUNDING'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Pool should have at least 50% of total premiums for safe payouts
                </p>
              </div>
              
              {/* Owner Fund Pool Section */}
              {isOwner && (
                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h4 className="text-lg font-bold text-yellow-400 mb-3">Owner Functions</h4>
                  <p className="text-sm text-gray-300 mb-3">
                    💡 <strong>Good news!</strong> User premiums automatically go into the pool. 
                    You only need to add extra funding if the pool health is low.
                  </p>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      placeholder="Additional funding amount"
                      className="flex-1 bg-black/40 border border-gray-600 rounded px-3 py-2 text-white"
                    />
                    <button
                      onClick={handleFundPool}
                      disabled={loading || !fundingAmount}
                      className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                      Add Extra Funding
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Add extra capital to ensure large payouts can be covered
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            
            {/* Step 1: Get USDC */}
            <div className="bg-black/60 border border-blue-500/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-blue-400">Step 1: Get USDC</h3>
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              
              {isConnected && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400">Current Balance:</p>
                  <p className="text-xl font-bold">{parseFloat(usdcBalance).toFixed(2)} USDC</p>
                </div>
              )}
              
              <button
                onClick={handleFaucet}
                disabled={!isConnected || loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Get Test USDC'}
              </button>
            </div>

            {/* Step 2: Register Asset */}
            <div className="bg-black/60 border border-blue-500/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-orange-400">Step 2: Register</h3>
                <Calendar className="w-6 h-6 text-orange-400" />
              </div>
              
              <div className="space-y-3 mb-4">
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  disabled={isRegistered}
                  className="w-full bg-black/40 border border-gray-600 rounded px-3 py-2 text-white disabled:opacity-50"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                </select>
                
                <input
                  type="date"
                  min={getMinDate()}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isRegistered}
                  className="w-full bg-black/40 border border-gray-600 rounded px-3 py-2 text-white disabled:opacity-50"
                />
              </div>
              
              <button
                onClick={handleRegister}
                disabled={!isConnected || loading || isRegistered || !dueDate}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {isRegistered ? 'Registered ✓' : 'Register Asset'}
              </button>
            </div>

            {/* Step 3: Pay Premium */}
            <div className="bg-black/60 border border-blue-500/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-purple-400">Step 3: Pay Premium</h3>
                <Wallet className="w-6 h-6 text-purple-400" />
              </div>
              
              <div className="mb-4">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={premiumAmount}
                  onChange={(e) => setPremiumAmount(e.target.value)}
                  placeholder="Enter USDC amount"
                  className="w-full bg-black/40 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>
              
              <button
  onClick={handlePayPremium}
  disabled={!isConnected || loading || !premiumAmount || (isOwner && fundingAmount)}
  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
>
  Pay Premium
</button>
            </div>
          </div>

          {/* User Status */}
          {userCoop && (
            <div className="bg-black/60 border border-blue-500/10 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Your Coverage Status</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400">Protected Asset:</p>
                  <p className="text-lg font-bold text-white">{ASSET_NAMES[userCoop.asset]}</p>
                  
                  <p className="text-gray-400 mt-2">Premium Paid:</p>
                  <p className="text-lg font-bold text-green-400">{userCoop.premiumPaid} USDC</p>
                  
                  <p className="text-gray-400 mt-2">Coverage Until:</p>
                  <p className="text-lg font-bold text-white">{userCoop.dueDate.toLocaleDateString()}</p>
                </div>
                
                {crashStatus && (
  <div>
    <p className="text-gray-400">Current Status:</p>
    <p className={`text-lg font-bold ${crashStatus.isCrashed ? 'text-red-400' : 'text-green-400'}`}>
      {crashStatus.isCrashed ? 'CRASH DETECTED' : 'MONITORING'}
    </p>
    
    <p className="text-gray-400 mt-2">Price Change:</p>
    <p className="text-lg font-bold text-white">{crashStatus.crashPercentage}%</p>
    
    {/* Always show button, but disable when can't claim */}
    <button
      onClick={handleClaim}
      disabled={loading || !crashStatus.canClaim || userCoop.hasClaimed}
      className={`mt-4 w-full px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
        crashStatus.canClaim && !userCoop.hasClaimed 
          ? 'bg-green-600 text-white hover:bg-green-700' 
          : 'bg-gray-600 text-gray-300 cursor-not-allowed'
      }`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
      ) : userCoop.hasClaimed ? (
        'Already Claimed'
      ) : crashStatus.canClaim ? (
        'Claim Payout'
      ) : (
        `Cannot Claim Yet`
      )}
    </button>
    
    {/* Help text */}
    <p className="text-xs text-gray-500 mt-2 text-center">
      {userCoop.hasClaimed 
        ? 'Payout has been claimed'
        : crashStatus.canClaim 
          ? 'You can claim your payout now'
          : 'Price must drop 15% or more to claim payout'
      }
    </p>
  </div>
)}

        </div>
      </div>
          )}
     </div>
        </div>
      </div>  
  );
};

export default Registration;