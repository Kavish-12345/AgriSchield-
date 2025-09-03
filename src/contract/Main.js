import { ethers } from 'ethers';

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_LOGIC_CONTRACT_ADDRESS';

const CONTRACT_ABI = [
  // Events
  "event RegistryDone(address indexed coop, bool active)",
  "event PaymentofPremium(address indexed coop, uint256 amountPaid, bool active, uint8 commodity)",
  "event CrashTracking(address indexed coop, uint8 commodity)",
  "event PayoutTriggered(address user, uint256 usdc, uint256 coveragePercent, uint8 commodity)",
  "event CooperativeExpired(address user, uint8 commodity)",

  // Functions
  "function registry(address _wallet, uint8 _commodity, uint256 _dueDate) external",
  "function premiumPayment(uint256 _amount) external",
  "function withdrawPayout() external",
  "function getCrashPercentage(address _user) public view returns (uint256)",
  "function isPriceCrashed(address _user) public view returns (bool)",
  "function getCoveragePercentage(address _user) public view returns (uint256)",
  "function getCrashStatus(address _user) public view returns (uint256 crashPercentage, bool isCrashed, bool canClaim, bool isActive)",

  // Public State Variables (if needed for direct reading)
  "function paymentToken() external view returns (address)",
  "function aavePool() external view returns (address)",
  "function aUSDC() external view returns (address)",
  "function CRASH_THRESHOLD() external view returns (uint256)",
  "function cooperatives(address) external view returns (address wallet, uint8 commodity, uint256 dueDate, uint256 premiumPaid, bool isActive, bool hasClaimed)",
  "function baseLinePrices(address) external view returns (uint256)",
  "function userShares(address) external view returns (uint256)",
  "function totalShares() external view returns (uint256)"
];

export const getContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return null;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const getReadOnlyContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask");
    return null;
  }
  
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};