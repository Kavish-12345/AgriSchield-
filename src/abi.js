// abi.js - Complete configuration for Somnia Network integration

// Logic Contract ABI - Complete interface
export const LOGIC_CONTRACT_ABI = [
  // View functions
  "function cooperatives(address) external view returns (address wallet, uint8 asset, uint256 dueDate, uint256 premiumPaid, bool isActive, bool hasClaimed)",
  "function getCrashStatus(address _user) external view returns (uint256 crashPercentage, bool isCrashed, bool canClaim, bool isActive)",
  "function getCrashPercentage(address _user) external view returns (uint256)",
  "function isPriceCrashed(address _user) external view returns (bool)",
  "function getCoveragePercentage(address _user) external view returns (uint256)",
  "function userShares(address) external view returns (uint256)",
  "function totalShares() external view returns (uint256)",
  "function owner() external view returns (address)",
  "function paymentToken() external view returns (address)",
  "function baseLinePrices(address) external view returns (uint256)",
  "function allCooperatives(uint256) external view returns (address)",
  "function CRASH_THRESHOLD() external view returns (uint256)",
  
  // Write functions
  "function registry(address _wallet, uint8 _asset, uint256 _dueDate) external",
  "function premiumPayment(uint256 _amount) external",
  "function withdrawPayout() external",
  "function fundPool(uint256 _amount) external",
  
  // Events
  "event RegistryDone(address indexed coop, bool active)",
  "event PaymentofPremium(address indexed coop, uint256 amountPaid, bool active, uint8 asset)",
  "event CrashTracking(address indexed coop, uint8 asset)",
  "event PoolFunded(address indexed funder, uint256 amount)",
  "event PayoutTriggered(address user, uint256 usdc, uint256 coveragePercent, uint8 asset)",
  "event CooperativeExpired(address user, uint8 asset)"
];

// Mock USDC ABI - Complete ERC20 + faucet functionality
export const MOCK_USDC_ABI = [
  // Standard ERC20 view functions
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external pure returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  
  // ERC20 write functions
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  
  // Owner functions
  "function mint(address to, uint256 amount) external",
  "function owner() external view returns (address)",
  
  // Faucet function for testing
  "function faucet() external",
  
  // Custom view function
  "function balanceOfFormatted(address account) external view returns (string)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)"
];

// Contract addresses - Your deployed contracts
export const CONTRACT_ADDRESSES = {
  logic: "0x01554ef8c24889714143cc12df95d7370c462ad8",  // Your Logic contract
  usdc: "0x95d59ecb48d56fc7befa62a19482d052193560a4"   // Your MockUSDC contract
};

// Chainlink Price Feed Addresses on Somnia (you'll need to update these with actual addresses)
export const PRICE_FEEDS = {
  BTC: "0x8CeE6c58b8CbD8afdEaF14e6fCA0876765e161fE",
  ETH: "0xd9132c1d762D432672493F640a63B758891B449e"  // ETH/USD price feed address on Somnia
};

// Chainlink Price Feed ABI
export const PRICE_FEED_ABI = [
  "function latestRoundData() external view returns (uint80 roundId, int256 price, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() external view returns (uint8)"
];

// Somnia Network Configuration - Updated with correct details
export const SOMNIA_CONFIG = {
  chainId: 50312,                                    // Somnia testnet chain ID
  chainName: "Somnia Testnet",                       // Network display name
  rpcUrl: "https://testnet.somnia.network/",         // RPC endpoint
  blockExplorer: "https://testnet-explorer.somnia.network/"  // Block explorer
};

// Asset enumeration - matches your contract
export const ASSETS = {
  BTC: 0,  // Bitcoin
  ETH: 1   // Ethereum
};

// Asset display names
export const ASSET_NAMES = {
  0: 'Bitcoin (BTC)',
  1: 'Ethereum (ETH)',
  BTC: 'Bitcoin (BTC)',
  ETH: 'Ethereum (ETH)'
};

// Contract constants
export const CONTRACT_CONSTANTS = {
  CRASH_THRESHOLD: 15,           // 15% crash threshold
  MIN_DUE_DATE_DAYS: 90,         // Minimum 90 days for due date
  USDC_DECIMALS: 6,              // USDC uses 6 decimals
  FAUCET_LIMIT: 1000,            // 1000 USDC faucet limit
  COVERAGE_RATES: {
    TIER_1: 65,                  // 65% payout for 15-49% crash
    TIER_2: 40                   // 40% payout for 50%+ crash
  }
};

// Helper functions
export const getExplorerUrl = (txHash) => {
  return `${SOMNIA_CONFIG.blockExplorer}tx/${txHash}`;
};

export const getAddressUrl = (address) => {
  return `${SOMNIA_CONFIG.blockExplorer}address/${address}`;
};

// Format utilities
export const formatUSDC = (amount) => {
  return parseFloat(amount).toFixed(2);
};

export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

export const formatPercentage = (value) => {
  return `${value}%`;
};

// Validation helpers
export const isValidDueDate = (dateString) => {
  const selectedDate = new Date(dateString);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + CONTRACT_CONSTANTS.MIN_DUE_DATE_DAYS);
  return selectedDate >= minDate;
};

export const getMinDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + CONTRACT_CONSTANTS.MIN_DUE_DATE_DAYS);
  return date.toISOString().split('T')[0];
};

// Error message mappings for common contract errors
export const ERROR_MESSAGES = {
  '0x13be252b': 'Invalid amount - please check your input',
  '0x7138356f': 'Not registered - please register first',
  '0x1f2a2005': 'Already registered - you can only register once',
  '0xe6c4247b': 'Invalid address provided',
  '0x15279c05': 'Invalid due date - must be at least 90 days from now',
  '0x08c379a0': 'Generic error - check transaction details',
  'Already have enough': 'Faucet limit reached (1000 USDC maximum)',
  'execution reverted': 'Transaction failed - check requirements'
};

// Network switching helper
export const switchToSomniaNetwork = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    // Try to switch to Somnia network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${SOMNIA_CONFIG.chainId.toString(16)}` }],
    });
  } catch (switchError) {
    // If network doesn't exist, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${SOMNIA_CONFIG.chainId.toString(16)}`,
          chainName: SOMNIA_CONFIG.chainName,
          rpcUrls: [SOMNIA_CONFIG.rpcUrl],
          blockExplorerUrls: [SOMNIA_CONFIG.blockExplorer],
          nativeCurrency: {
            name: 'STT',      // Somnia Test Token
            symbol: 'STT',
            decimals: 18
          }
        }],
      });
    } else {
      throw switchError;
    }
  }
};

// Export default configuration
export default {
  LOGIC_CONTRACT_ABI,
  MOCK_USDC_ABI,
  CONTRACT_ADDRESSES,
  SOMNIA_CONFIG,
  ASSETS,
  ASSET_NAMES,
  CONTRACT_CONSTANTS,
  getExplorerUrl,
  getAddressUrl,
  formatUSDC,
  formatDate,
  formatPercentage,
  isValidDueDate,
  getMinDueDate,
  ERROR_MESSAGES,
  switchToSomniaNetwork
};