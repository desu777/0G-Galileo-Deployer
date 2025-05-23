// Smart Contract Templates for Browser Compilation
// Based on OpenZeppelin Contracts v5.3.0

export const CONTRACTS = {
  // COMMON CONTRACTS
  greeter: {
    name: 'Greeter',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Greeter
 * @dev Simple contract that stores and retrieves a greeting message
 */
contract Greeter {
    string private _greeting;
    address public owner;
    
    event GreetingChanged(string oldGreeting, string newGreeting, address indexed changer);
    
    error OnlyOwner();
    error EmptyGreeting();
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }
    
    constructor(string memory initialGreeting) {
        if (bytes(initialGreeting).length == 0) revert EmptyGreeting();
        _greeting = initialGreeting;
        owner = msg.sender;
        emit GreetingChanged("", initialGreeting, msg.sender);
    }
    
    function greet() public view returns (string memory) {
        return _greeting;
    }
    
    function setGreeting(string memory newGreeting) public onlyOwner {
        if (bytes(newGreeting).length == 0) revert EmptyGreeting();
        string memory oldGreeting = _greeting;
        _greeting = newGreeting;
        emit GreetingChanged(oldGreeting, newGreeting, msg.sender);
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        owner = newOwner;
    }
}`,
    formFields: [
      { name: 'initialGreeting', type: 'string', label: 'Initial Greeting', placeholder: 'Hello, World!', required: true }
    ]
  },

  counter: {
    name: 'Counter',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Counter
 * @dev Simple counter contract with increment/decrement functionality
 */
contract Counter {
    uint256 private _count;
    address public owner;
    
    event CountChanged(uint256 oldCount, uint256 newCount, address indexed changer);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    error OnlyOwner();
    error CounterUnderflow();
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }
    
    constructor(uint256 initialCount) {
        _count = initialCount;
        owner = msg.sender;
        emit CountChanged(0, initialCount, msg.sender);
    }
    
    function count() public view returns (uint256) {
        return _count;
    }
    
    function increment() public {
        uint256 oldCount = _count;
        _count++;
        emit CountChanged(oldCount, _count, msg.sender);
    }
    
    function decrement() public {
        if (_count == 0) revert CounterUnderflow();
        uint256 oldCount = _count;
        _count--;
        emit CountChanged(oldCount, _count, msg.sender);
    }
    
    function reset() public onlyOwner {
        uint256 oldCount = _count;
        _count = 0;
        emit CountChanged(oldCount, 0, msg.sender);
    }
    
    function setCount(uint256 newCount) public onlyOwner {
        uint256 oldCount = _count;
        _count = newCount;
        emit CountChanged(oldCount, newCount, msg.sender);
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}`,
    formFields: [
      { name: 'initialCount', type: 'number', label: 'Initial Count', placeholder: '0', required: true, defaultValue: '0' }
    ]
  },

  // RARE CONTRACTS
  nft721: {
    name: 'ERC-721 NFT',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleNFT
 * @dev ERC721 NFT with URI storage and minting functionality
 */
contract SimpleNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public mintPrice;
    uint256 public maxSupply;
    
    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintPriceChanged(uint256 oldPrice, uint256 newPrice);
    
    error MaxSupplyExceeded();
    error InsufficientPayment();
    error WithdrawalFailed();
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _mintPrice,
        uint256 _maxSupply
    ) ERC721(name, symbol) Ownable(msg.sender) {
        mintPrice = _mintPrice;
        maxSupply = _maxSupply;
        _nextTokenId = 1;
    }
    
    function mint(address to, string memory uri) public payable {
        if (_nextTokenId > maxSupply) revert MaxSupplyExceeded();
        if (msg.value < mintPrice) revert InsufficientPayment();
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit NFTMinted(to, tokenId, uri);
        
        // Refund excess payment
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }
    }
    
    function setMintPrice(uint256 newPrice) public onlyOwner {
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit MintPriceChanged(oldPrice, newPrice);
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert WithdrawalFailed();
    }
    
    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }
    
    // Override required by Solidity
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}`,
    formFields: [
      { name: 'name', type: 'string', label: 'NFT Name', placeholder: 'My NFT Collection', required: true },
      { name: 'symbol', type: 'string', label: 'NFT Symbol', placeholder: 'MNC', required: true },
      { name: 'mintPrice', type: 'string', label: 'Mint Price (wei)', placeholder: '1000000000000000000', required: true },
      { name: 'maxSupply', type: 'number', label: 'Max Supply', placeholder: '10000', required: true }
    ]
  },

  lottery: {
    name: 'Lottery',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleLottery
 * @dev Basic lottery contract with entry fees and random winner selection
 */
contract SimpleLottery {
    address public owner;
    uint256 public ticketPrice;
    uint256 public lotteryEndTime;
    address[] public players;
    address public lastWinner;
    uint256 public lastWinAmount;
    uint256 public lotteryId;
    
    enum LotteryState { Open, Closed, Completed }
    LotteryState public state;
    
    event PlayerEntered(address indexed player, uint256 lotteryId);
    event WinnerSelected(address indexed winner, uint256 amount, uint256 lotteryId);
    event LotteryStarted(uint256 lotteryId, uint256 ticketPrice, uint256 endTime);
    
    error OnlyOwner();
    error LotteryNotOpen();
    error LotteryNotEnded();
    error InsufficientPayment();
    error NoPlayers();
    error TransferFailed();
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }
    
    constructor(uint256 _ticketPrice, uint256 _duration) {
        owner = msg.sender;
        ticketPrice = _ticketPrice;
        lotteryEndTime = block.timestamp + _duration;
        state = LotteryState.Open;
        lotteryId = 1;
        
        emit LotteryStarted(lotteryId, ticketPrice, lotteryEndTime);
    }
    
    function enter() public payable {
        if (state != LotteryState.Open) revert LotteryNotOpen();
        if (block.timestamp >= lotteryEndTime) revert LotteryNotOpen();
        if (msg.value < ticketPrice) revert InsufficientPayment();
        
        players.push(msg.sender);
        emit PlayerEntered(msg.sender, lotteryId);
        
        // Refund excess payment
        if (msg.value > ticketPrice) {
            payable(msg.sender).transfer(msg.value - ticketPrice);
        }
    }
    
    function drawWinner() public onlyOwner {
        if (block.timestamp < lotteryEndTime) revert LotteryNotEnded();
        if (players.length == 0) revert NoPlayers();
        
        state = LotteryState.Closed;
        
        // Simple pseudo-random winner selection (not cryptographically secure)
        uint256 winnerIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            players
        ))) % players.length;
        
        address winner = players[winnerIndex];
        uint256 prize = address(this).balance * 90 / 100; // 90% to winner, 10% to owner
        uint256 ownerFee = address(this).balance - prize;
        
        lastWinner = winner;
        lastWinAmount = prize;
        state = LotteryState.Completed;
        
        // Transfer prize to winner
        (bool successWinner, ) = payable(winner).call{value: prize}("");
        if (!successWinner) revert TransferFailed();
        
        // Transfer fee to owner
        (bool successOwner, ) = payable(owner).call{value: ownerFee}("");
        if (!successOwner) revert TransferFailed();
        
        emit WinnerSelected(winner, prize, lotteryId);
    }
    
    function startNewLottery(uint256 _ticketPrice, uint256 _duration) public onlyOwner {
        require(state == LotteryState.Completed, "Previous lottery not completed");
        
        // Reset lottery
        delete players;
        lotteryId++;
        ticketPrice = _ticketPrice;
        lotteryEndTime = block.timestamp + _duration;
        state = LotteryState.Open;
        
        emit LotteryStarted(lotteryId, ticketPrice, lotteryEndTime);
    }
    
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
    
    function getPlayerCount() public view returns (uint256) {
        return players.length;
    }
    
    function getPrizePool() public view returns (uint256) {
        return address(this).balance;
    }
    
    function getRemainingTime() public view returns (uint256) {
        if (block.timestamp >= lotteryEndTime) return 0;
        return lotteryEndTime - block.timestamp;
    }
}`,
    formFields: [
      { name: 'ticketPrice', type: 'string', label: 'Ticket Price (wei)', placeholder: '100000000000000000', required: true },
      { name: 'duration', type: 'number', label: 'Duration (seconds)', placeholder: '3600', required: true }
    ]
  },

  // EPIC CONTRACTS
  multisig: {
    name: 'MultiSig Wallet',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleMultiSig
 * @dev Basic multi-signature wallet contract
 */
contract SimpleMultiSig {
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirmations;
    }
    
    mapping(address => bool) public isOwner;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    
    address[] public owners;
    uint256 public required;
    Transaction[] public transactions;
    
    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event RequirementChanged(uint256 required);
    event Submission(uint256 indexed transactionId);
    event Confirmation(address indexed sender, uint256 indexed transactionId);
    event Revocation(address indexed sender, uint256 indexed transactionId);
    event Execution(uint256 indexed transactionId);
    event ExecutionFailure(uint256 indexed transactionId);
    event Deposit(address indexed sender, uint256 value);
    
    error OnlyOwner();
    error OwnerExists();
    error OwnerDoesNotExist();
    error TransactionExists();
    error TransactionDoesNotExist();
    error TransactionAlreadyExecuted();
    error TransactionNotConfirmed();
    error TransactionAlreadyConfirmed();
    error InvalidRequirement();
    
    modifier onlyOwner() {
        if (!isOwner[msg.sender]) revert OnlyOwner();
        _;
    }
    
    modifier ownerExists(address owner) {
        if (!isOwner[owner]) revert OwnerDoesNotExist();
        _;
    }
    
    modifier transactionExists(uint256 transactionId) {
        if (transactionId >= transactions.length) revert TransactionDoesNotExist();
        _;
    }
    
    modifier notExecuted(uint256 transactionId) {
        if (transactions[transactionId].executed) revert TransactionAlreadyExecuted();
        _;
    }
    
    modifier notConfirmed(uint256 transactionId) {
        if (confirmations[transactionId][msg.sender]) revert TransactionAlreadyConfirmed();
        _;
    }
    
    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0 && _required > 0 && _required <= _owners.length, "Invalid parameters");
        
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0) && !isOwner[owner], "Invalid owner");
            
            isOwner[owner] = true;
            owners.push(owner);
            emit OwnerAdded(owner);
        }
        
        required = _required;
        emit RequirementChanged(_required);
    }
    
    receive() external payable {
        if (msg.value > 0) {
            emit Deposit(msg.sender, msg.value);
        }
    }
    
    function submitTransaction(address to, uint256 value, bytes memory data) public onlyOwner returns (uint256) {
        uint256 transactionId = transactions.length;
        transactions.push(Transaction({
            to: to,
            value: value,
            data: data,
            executed: false,
            confirmations: 0
        }));
        
        emit Submission(transactionId);
        confirmTransaction(transactionId);
        return transactionId;
    }
    
    function confirmTransaction(uint256 transactionId) 
        public 
        onlyOwner 
        transactionExists(transactionId) 
        notConfirmed(transactionId) 
    {
        confirmations[transactionId][msg.sender] = true;
        transactions[transactionId].confirmations++;
        emit Confirmation(msg.sender, transactionId);
        
        executeTransaction(transactionId);
    }
    
    function revokeConfirmation(uint256 transactionId) 
        public 
        onlyOwner 
        transactionExists(transactionId) 
        notExecuted(transactionId) 
    {
        require(confirmations[transactionId][msg.sender], "Transaction not confirmed");
        
        confirmations[transactionId][msg.sender] = false;
        transactions[transactionId].confirmations--;
        emit Revocation(msg.sender, transactionId);
    }
    
    function executeTransaction(uint256 transactionId) 
        public 
        onlyOwner 
        transactionExists(transactionId) 
        notExecuted(transactionId) 
    {
        Transaction storage txn = transactions[transactionId];
        
        if (txn.confirmations >= required) {
            txn.executed = true;
            (bool success, ) = txn.to.call{value: txn.value}(txn.data);
            
            if (success) {
                emit Execution(transactionId);
            } else {
                emit ExecutionFailure(transactionId);
                txn.executed = false;
            }
        }
    }
    
    function getOwners() public view returns (address[] memory) {
        return owners;
    }
    
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
    
    function getTransaction(uint256 transactionId) 
        public 
        view 
        returns (address to, uint256 value, bytes memory data, bool executed, uint256 confirmationCount) 
    {
        Transaction storage txn = transactions[transactionId];
        return (txn.to, txn.value, txn.data, txn.executed, txn.confirmations);
    }
    
    function getConfirmationCount(uint256 transactionId) public view returns (uint256) {
        return transactions[transactionId].confirmations;
    }
    
    function isConfirmed(uint256 transactionId) public view returns (bool) {
        return transactions[transactionId].confirmations >= required;
    }
}`,
    formFields: [
      { name: 'owners', type: 'textarea', label: 'Owner Addresses (one per line)', placeholder: '0x742d35Cc6129C6532C89396D0EC99E8A0C98C8C7\n0x8ba1f109551bD432803012645Hac136c5C3d56a', required: true },
      { name: 'required', type: 'number', label: 'Required Confirmations', placeholder: '2', required: true }
    ]
  },

  staking: {
    name: 'Staking Pool',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleStaking
 * @dev Basic staking pool contract with rewards
 */
contract SimpleStaking {
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 rewardDebt;
    }
    
    mapping(address => Stake) public stakes;
    mapping(address => uint256) public pendingRewards;
    
    uint256 public totalStaked;
    uint256 public rewardRate; // rewards per second per wei staked
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    uint256 public minimumStake;
    uint256 public lockupPeriod;
    
    address public owner;
    bool public paused;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardRateChanged(uint256 oldRate, uint256 newRate);
    event Paused();
    event Unpaused();
    
    error OnlyOwner();
    error ContractPaused();
    error InsufficientStake();
    error LockupPeriodNotMet();
    error InsufficientBalance();
    error TransferFailed();
    error NoStake();
    error InvalidAmount();
    
    modifier onlyOwner() {
        if (msg.sender != owner) revert OnlyOwner();
        _;
    }
    
    modifier notPaused() {
        if (paused) revert ContractPaused();
        _;
    }
    
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        
        if (account != address(0)) {
            pendingRewards[account] = earned(account);
            stakes[account].rewardDebt = rewardPerTokenStored;
        }
        _;
    }
    
    constructor(
        uint256 _rewardRate,
        uint256 _minimumStake,
        uint256 _lockupPeriod
    ) {
        owner = msg.sender;
        rewardRate = _rewardRate;
        minimumStake = _minimumStake;
        lockupPeriod = _lockupPeriod;
        lastUpdateTime = block.timestamp;
    }
    
    function stake() public payable notPaused updateReward(msg.sender) {
        if (msg.value < minimumStake) revert InsufficientStake();
        
        stakes[msg.sender].amount += msg.value;
        stakes[msg.sender].timestamp = block.timestamp;
        totalStaked += msg.value;
        
        emit Staked(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) public notPaused updateReward(msg.sender) {
        Stake storage userStake = stakes[msg.sender];
        
        if (userStake.amount == 0) revert NoStake();
        if (amount == 0 || amount > userStake.amount) revert InvalidAmount();
        if (block.timestamp < userStake.timestamp + lockupPeriod) revert LockupPeriodNotMet();
        
        userStake.amount -= amount;
        totalStaked -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function claimReward() public notPaused updateReward(msg.sender) {
        uint256 reward = pendingRewards[msg.sender];
        if (reward > 0) {
            pendingRewards[msg.sender] = 0;
            
            // For simplicity, rewards come from contract balance
            // In production, you'd have a separate reward token or funding mechanism
            if (address(this).balance < reward) {
                reward = address(this).balance;
            }
            
            if (reward > 0) {
                (bool success, ) = payable(msg.sender).call{value: reward}("");
                if (!success) revert TransferFailed();
                
                emit RewardClaimed(msg.sender, reward);
            }
        }
    }
    
    function exit() external {
        withdraw(stakes[msg.sender].amount);
        claimReward();
    }
    
    // View functions
    function rewardPerToken() public view returns (uint256) {
        if (totalStaked == 0) {
            return rewardPerTokenStored;
        }
        
        return rewardPerTokenStored + 
            (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / totalStaked);
    }
    
    function earned(address account) public view returns (uint256) {
        return ((stakes[account].amount * 
            (rewardPerToken() - stakes[account].rewardDebt)) / 1e18) + 
            pendingRewards[account];
    }
    
    function getStakeInfo(address account) public view returns (
        uint256 amount,
        uint256 timestamp,
        uint256 pendingReward,
        bool canWithdraw
    ) {
        Stake memory userStake = stakes[account];
        return (
            userStake.amount,
            userStake.timestamp,
            earned(account),
            block.timestamp >= userStake.timestamp + lockupPeriod
        );
    }
    
    // Admin functions
    function setRewardRate(uint256 newRate) external onlyOwner updateReward(address(0)) {
        uint256 oldRate = rewardRate;
        rewardRate = newRate;
        emit RewardRateChanged(oldRate, newRate);
    }
    
    function pause() external onlyOwner {
        paused = true;
        emit Paused();
    }
    
    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused();
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner).call{value: balance}("");
        if (!success) revert TransferFailed();
    }
    
    // Allow contract to receive ETH for rewards
    receive() external payable {}
}`,
    formFields: [
      { name: 'rewardRate', type: 'string', label: 'Reward Rate (wei per second per wei staked)', placeholder: '1000000', required: true },
      { name: 'minimumStake', type: 'string', label: 'Minimum Stake (wei)', placeholder: '1000000000000000000', required: true },
      { name: 'lockupPeriod', type: 'number', label: 'Lockup Period (seconds)', placeholder: '86400', required: true }
    ]
  },

  // LEGENDARY CONTRACT
  erc20: {
    name: 'ERC-20 Token',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleToken
 * @dev ERC20 token with minting, burning, and permit functionality
 */
contract SimpleToken is ERC20, ERC20Permit, Ownable {
    uint256 public maxSupply;
    uint256 public mintPrice;
    bool public mintingEnabled;
    
    event MintingEnabled();
    event MintingDisabled();
    event MintPriceChanged(uint256 oldPrice, uint256 newPrice);
    event MaxSupplyChanged(uint256 oldSupply, uint256 newSupply);
    event TokensBurned(address indexed from, uint256 amount);
    
    error MintingDisabled();
    error MaxSupplyExceeded();
    error InsufficientPayment();
    error InvalidAmount();
    error TransferFailed();
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _initialSupply,
        uint256 _maxSupply,
        uint256 _mintPrice
    ) ERC20(name, symbol) ERC20Permit(name) Ownable(msg.sender) {
        require(_maxSupply >= _initialSupply, "Max supply must be >= initial supply");
        
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        mintingEnabled = true;
        
        if (_initialSupply > 0) {
            _mint(msg.sender, _initialSupply);
        }
    }
    
    function mint(address to, uint256 amount) public payable {
        if (!mintingEnabled) revert MintingDisabled();
        if (amount == 0) revert InvalidAmount();
        if (totalSupply() + amount > maxSupply) revert MaxSupplyExceeded();
        
        uint256 cost = (amount * mintPrice) / 10**decimals();
        if (msg.value < cost) revert InsufficientPayment();
        
        _mint(to, amount);
        
        // Refund excess payment
        if (msg.value > cost) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - cost}("");
            if (!success) revert TransferFailed();
        }
    }
    
    function burn(uint256 amount) public {
        if (amount == 0) revert InvalidAmount();
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    function burnFrom(address account, uint256 amount) public {
        if (amount == 0) revert InvalidAmount();
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }
    
    // Owner functions
    function enableMinting() external onlyOwner {
        mintingEnabled = true;
        emit MintingEnabled();
    }
    
    function disableMinting() external onlyOwner {
        mintingEnabled = false;
        emit MintingDisabled();
    }
    
    function setMintPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit MintPriceChanged(oldPrice, newPrice);
    }
    
    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply >= totalSupply(), "New max supply too low");
        uint256 oldMaxSupply = maxSupply;
        maxSupply = newMaxSupply;
        emit MaxSupplyChanged(oldMaxSupply, newMaxSupply);
    }
    
    function ownerMint(address to, uint256 amount) external onlyOwner {
        if (amount == 0) revert InvalidAmount();
        if (totalSupply() + amount > maxSupply) revert MaxSupplyExceeded();
        _mint(to, amount);
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert TransferFailed();
    }
    
    // View functions
    function getMintCost(uint256 amount) external view returns (uint256) {
        return (amount * mintPrice) / 10**decimals();
    }
    
    function getRemainingMintableSupply() external view returns (uint256) {
        return maxSupply - totalSupply();
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}`,
    formFields: [
      { name: 'name', type: 'string', label: 'Token Name', placeholder: 'My Token', required: true },
      { name: 'symbol', type: 'string', label: 'Token Symbol', placeholder: 'MTK', required: true },
      { name: 'initialSupply', type: 'string', label: 'Initial Supply (with decimals)', placeholder: '1000000000000000000000000', required: true },
      { name: 'maxSupply', type: 'string', label: 'Max Supply (with decimals)', placeholder: '10000000000000000000000000', required: true },
      { name: 'mintPrice', type: 'string', label: 'Mint Price (wei per token)', placeholder: '1000000000000000', required: true }
    ]
  }
};

// Utility function to get contract by ID
export function getContractById(id: string) {
  return CONTRACTS[id as keyof typeof CONTRACTS];
}

// Get all contract IDs
export function getContractIds() {
  return Object.keys(CONTRACTS);
}

// Validate contract exists
export function isValidContractId(id: string): boolean {
  return id in CONTRACTS;
} 