import { ContractTemplate } from '../../types';

// Base contract code to be included in each contract
const PUMP_JAINE_BASE = `
abstract contract PumpJaineBase {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    address public deployer;
    uint256 public deployedAt;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event ContractDeployed(address indexed deployer, string scenario);
    event EmotionalDamage(address indexed victim, uint256 severity);
    
    error InsufficientBalance(uint256 requested, uint256 available);
    error InvalidInput(string field);
    error UnauthorizedAccess(address caller);
    
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        deployer = msg.sender;
        deployedAt = block.timestamp;
        totalSupply = 1_000_000 * 1e18;
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
        emit ContractDeployed(msg.sender, _name);
    }
    
    function transfer(address to, uint256 value) public virtual returns (bool) {
        if (balanceOf[msg.sender] < value) {
            revert InsufficientBalance(value, balanceOf[msg.sender]);
        }
        if (to == address(0)) revert InvalidInput("to");
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        if (allowance[from][msg.sender] < value) revert InsufficientBalance(value, allowance[from][msg.sender]);
        if (balanceOf[from] < value) revert InsufficientBalance(value, balanceOf[from]);
        if (to == address(0)) revert InvalidInput("to");
        
        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
    
    function _burn(uint256 amount) internal {
        if (balanceOf[address(this)] < amount) return;
        balanceOf[address(this)] -= amount;
        totalSupply -= amount;
        emit Transfer(address(this), address(0), amount);
    }
    
    modifier onlyDeployer() {
        if (msg.sender != deployer) revert UnauthorizedAccess(msg.sender);
        _;
    }
}`;

export const jaineCommonContracts = {
  'jaine_blocked_me': {
    name: 'JAINE BLOCKED ME',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_BLOCKED_ME is PumpJaineBase {
    uint256 public constant BASE_LOCKOUT = 24 hours;
    uint256 public blockCount;
    uint256 public lastBlockTime;
    uint256 public unblockFee = 0.01 ether;
    
    mapping(address => bool) public isBlocked;
    mapping(address => uint256) public blockHistory;
    mapping(uint256 => string) public blockReasons;
    
    event BlockTriggered(address indexed victim, string reason, uint256 duration);
    event UnblockAttempt(address indexed victim, uint256 fee, bool success);
    event BlockAppealRejected(address indexed victim, string reason);
    
    error CurrentlyBlocked(uint256 timeRemaining);
    error InsufficientUnblockFee(uint256 required, uint256 provided);
    error AppealAlwaysRejected();
    
    constructor() PumpJaineBase("JAINE BLOCKED ME", "BLOCKED") {
        lastBlockTime = block.timestamp;
        _initializeBlockReasons();
    }
    
    function _initializeBlockReasons() internal {
        blockReasons[0] = "You're being too clingy";
        blockReasons[1] = "I need space right now";
        blockReasons[2] = "This isn't working out";
        blockReasons[3] = "I'm focusing on myself";
        blockReasons[4] = "We're better as friends";
        blockReasons[5] = "It's not you, it's me";
    }
    
    function transfer(address to, uint256 value) public override returns (bool) {
        _checkBlockStatus(msg.sender);
        _randomBlockTrigger();
        return super.transfer(to, value);
    }
    
    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        _checkBlockStatus(from);
        _randomBlockTrigger();
        return super.transferFrom(from, to, value);
    }
    
    function _checkBlockStatus(address user) internal view {
        if (isBlocked[user]) {
            uint256 blockTime = blockHistory[user];
            uint256 blockDuration = BASE_LOCKOUT * (1 + (blockCount / 5));
            
            if (block.timestamp < blockTime + blockDuration) {
                uint256 timeRemaining = (blockTime + blockDuration) - block.timestamp;
                revert CurrentlyBlocked(timeRemaining);
            }
        }
    }
    
    function _randomBlockTrigger() internal {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp, 
            block.prevrandao, 
            msg.sender
        ))) % 100;
        
        uint256 blockProbability = 5 + (blockCount / 2);
        
        if (random < blockProbability) {
            _triggerBlock(msg.sender);
        }
    }
    
    function _triggerBlock(address victim) internal {
        isBlocked[victim] = true;
        blockHistory[victim] = block.timestamp;
        blockCount++;
        
        uint256 reasonIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, victim
        ))) % 6;
        
        string memory reason = blockReasons[reasonIndex];
        uint256 duration = BASE_LOCKOUT * (1 + (blockCount / 5));
        
        emit BlockTriggered(victim, reason, duration);
    }
    
    function attemptUnblock() external payable {
        if (!isBlocked[msg.sender]) return;
        
        uint256 requiredFee = unblockFee * (1 + blockHistory[msg.sender]);
        if (msg.value < requiredFee) {
            revert InsufficientUnblockFee(requiredFee, msg.value);
        }
        
        emit UnblockAttempt(msg.sender, msg.value, false);
        
        payable(deployer).transfer(msg.value);
        
        unblockFee = (unblockFee * 150) / 100;
    }
    
    function appealBlock(string memory appeal) external {
        if (!isBlocked[msg.sender]) return;
        
        emit BlockAppealRejected(msg.sender, "Appeal denied: Reasons undisclosed");
        revert AppealAlwaysRejected();
    }
    
    function getBlockStatus(address user) external view returns (
        bool blocked,
        uint256 timeRemaining,
        uint256 totalBlocks,
        string memory lastReason
    ) {
        blocked = isBlocked[user];
        totalBlocks = blockHistory[user];
        
        if (blocked && blockHistory[user] > 0) {
            uint256 blockDuration = BASE_LOCKOUT * (1 + (blockCount / 5));
            uint256 blockEnd = blockHistory[user] + blockDuration;
            
            if (block.timestamp < blockEnd) {
                timeRemaining = blockEnd - block.timestamp;
                uint256 reasonIndex = uint256(keccak256(abi.encodePacked(
                    blockHistory[user], user
                ))) % 6;
                lastReason = blockReasons[reasonIndex];
            } else {
                timeRemaining = 0;
                blocked = false;
            }
        }
    }
    
    function getCurrentUnblockFee(address user) external view returns (uint256) {
        if (!isBlocked[user]) return 0;
        return unblockFee * (1 + blockHistory[user]);
    }
}`,
    formFields: []
  } as ContractTemplate,

  'jaine_friendzoned_me': {
    name: 'JAINE FRIENDZONED ME',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_FRIENDZONED_ME is PumpJaineBase {
    enum FriendTier { 
        STRANGER,        // 0
        ACQUAINTANCE,    // 1
        FRIEND,          // 2
        GOOD_FRIEND,     // 3
        BEST_FRIEND,     // 4
        NEVER_BOYFRIEND  // 5 - final tier
    }
    
    uint256 public constant ESCAPE_ATTEMPT_COST = 0.001 ether;
    uint256 public emotionalLaborPoints;
    uint256 public birthdayGiftsSent;
    uint256 public adviceSessionsListened;
    
    mapping(address => FriendTier) public userFriendTier;
    mapping(address => uint256) public friendPoints;
    mapping(address => uint256) public escapeAttempts;
    mapping(address => uint256) public lastBirthdayGift;
    
    event FriendTierUpgrade(address indexed user, FriendTier oldTier, FriendTier newTier);
    event EscapeAttemptFailed(address indexed user, uint256 attempt, uint256 cost);
    event BirthdayGiftSent(address indexed giver, uint256 value, uint256 gratitudeLevel);
    event AdviceAboutOtherGuys(address indexed listener, string advice, uint256 painLevel);
    event EmotionalLaborPerformed(address indexed worker, uint256 points, uint256 totalPoints);
    
    error EscapeImpossible();
    error InsufficientEscapeFee(uint256 required, uint256 provided);
    error NotYourBirthday();
    error AdviceNotRequested();
    
    constructor() PumpJaineBase("JAINE FRIENDZONED ME", "FRIENDZONE") {}
    
    function performEmotionalLabor(string memory problem) external payable {
        require(bytes(problem).length > 0, "Need actual problems");
        
        uint256 laborPoints = msg.value / 0.0001 ether;
        emotionalLaborPoints += laborPoints;
        friendPoints[msg.sender] += laborPoints;
        
        _upgradeFriendTier(msg.sender);
        
        emit EmotionalLaborPerformed(msg.sender, laborPoints, emotionalLaborPoints);
        
        payable(deployer).transfer(msg.value);
    }
    
    function sendBirthdayGift() external payable {
        uint256 currentYear = block.timestamp / 365 days;
        
        if (lastBirthdayGift[msg.sender] >= currentYear) {
            revert NotYourBirthday();
        }
        
        require(msg.value > 0, "Gifts must have value");
        
        birthdayGiftsSent++;
        lastBirthdayGift[msg.sender] = currentYear;
        friendPoints[msg.sender] += msg.value / 0.001 ether;
        
        _upgradeFriendTier(msg.sender);
        
        uint256 gratitudeLevel = 1;
        
        emit BirthdayGiftSent(msg.sender, msg.value, gratitudeLevel);
        
        payable(deployer).transfer(msg.value);
    }
    
    function listenToAdviceAboutOtherGuys() external {
        adviceSessionsListened++;
        friendPoints[msg.sender] += 10;
        
        string[5] memory adviceOptions = [
            "I think you should go for it with Chad",
            "That guy from the gym seems really nice",
            "Maybe try dating apps?",
            "You deserve someone who appreciates you",
            "I'm sure you'll find the right person soon"
        ];
        
        uint256 adviceIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, msg.sender
        ))) % 5;
        
        string memory advice = adviceOptions[adviceIndex];
        uint256 painLevel = (adviceSessionsListened * 10) + friendPoints[msg.sender];
        
        _upgradeFriendTier(msg.sender);
        
        emit AdviceAboutOtherGuys(msg.sender, advice, painLevel);
    }
    
    function attemptEscapeFriendzone() external payable {
        uint256 attempts = escapeAttempts[msg.sender];
        uint256 requiredFee = ESCAPE_ATTEMPT_COST * (2 ** attempts);
        
        if (msg.value < requiredFee) {
            revert InsufficientEscapeFee(requiredFee, msg.value);
        }
        
        escapeAttempts[msg.sender]++;
        
        emit EscapeAttemptFailed(msg.sender, escapeAttempts[msg.sender], msg.value);
        
        payable(deployer).transfer(msg.value);
        
        revert EscapeImpossible();
    }
    
    function _upgradeFriendTier(address user) internal {
        FriendTier currentTier = userFriendTier[user];
        uint256 points = friendPoints[user];
        FriendTier newTier = currentTier;
        
        if (points >= 1000 && currentTier < FriendTier.NEVER_BOYFRIEND) {
            if (points >= 10000) newTier = FriendTier.NEVER_BOYFRIEND;
            else if (points >= 5000) newTier = FriendTier.BEST_FRIEND;
            else if (points >= 2500) newTier = FriendTier.GOOD_FRIEND;
            else if (points >= 1500) newTier = FriendTier.FRIEND;
            else newTier = FriendTier.ACQUAINTANCE;
        }
        
        if (newTier != currentTier) {
            userFriendTier[user] = newTier;
            emit FriendTierUpgrade(user, currentTier, newTier);
        }
    }
    
    function getFriendStatus(address user) external view returns (
        FriendTier tier,
        uint256 points,
        uint256 attempts,
        uint256 nextEscapeCost
    ) {
        tier = userFriendTier[user];
        points = friendPoints[user];
        attempts = escapeAttempts[user];
        nextEscapeCost = ESCAPE_ATTEMPT_COST * (2 ** attempts);
    }
    
    function getAdviceQuote() external view returns (string memory) {
        string[3] memory quotes = [
            "You're such a good friend to me",
            "I wish I could find someone like you",
            "You always know how to make me feel better"
        ];
        
        uint256 index = uint256(keccak256(abi.encodePacked(
            block.timestamp / 1 hours
        ))) % 3;
        
        return quotes[index];
    }
}`,
    formFields: []
  } as ContractTemplate,

  'jaine_ghosted_me': {
    name: 'JAINE GHOSTED ME',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_GHOSTED_ME is PumpJaineBase {
    address public ghostedContractAddress;
    bool public isGhosted = false;
    uint256 public ghostingTime;
    uint256 public seanceAttempts;
    uint256 public mediumFee = 0.02 ether;
    
    mapping(address => bool) public isHaunted;
    mapping(address => uint256) public hauntingLevel;
    mapping(address => uint256) public breadcrumbsFound;
    mapping(address => uint256) public lastSeance;
    
    event ContractGhosted(address indexed newAddress, uint256 timestamp);
    event BreadcrumbLeft(address indexed finder, string hint, bool isFake);
    event SeanceAttempt(address indexed medium, uint256 fee, bool contacted, string message);
    event HauntingSpreads(address indexed victim, uint256 level);
    event GhostDetected(address indexed detector, address suspectedGhost, bool confirmed);
    
    error ContractAlreadyGhosted();
    error InsufficientMediumFee(uint256 required, uint256 provided);
    error SeanceOnCooldown(uint256 timeRemaining);
    error SpiritWorldUnavailable();
    
    constructor() PumpJaineBase("JAINE GHOSTED ME", "GHOSTED") {
        ghostedContractAddress = address(this);
    }
    
    function performMysteriousGhosting() external onlyDeployer {
        if (isGhosted) revert ContractAlreadyGhosted();
        
        ghostedContractAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            block.timestamp, block.prevrandao, address(this)
        )))));
        
        isGhosted = true;
        ghostingTime = block.timestamp;
        
        emit ContractGhosted(ghostedContractAddress, block.timestamp);
        
        _initiateHaunting();
    }
    
    function _initiateHaunting() internal {
        isHaunted[deployer] = true;
        hauntingLevel[deployer] = 100;
        emit HauntingSpreads(deployer, 100);
    }
    
    function transfer(address to, uint256 value) public virtual override returns (bool) {
        if (isGhosted) {
            isHaunted[to] = true;
            hauntingLevel[to] += 10;
            emit HauntingSpreads(to, hauntingLevel[to]);
            
            _leaveFakeBreadcrumb(msg.sender);
        }
        
        return super.transfer(to, value);
    }
    
    function _leaveFakeBreadcrumb(address user) internal {
        breadcrumbsFound[user]++;
        
        string[6] memory fakeHints = [
            "Contract moved to parallel dimension",
            "Check the blockchain on Tuesdays only",
            "Hidden in block 0x404NotFound",
            "Migrated to Ethereum Classic Classic",
            "Try summoning with exactly 13 Wei",
            "Contract is now quantum - exists only when observed"
        ];
        
        uint256 hintIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, user
        ))) % 6;
        
        emit BreadcrumbLeft(user, fakeHints[hintIndex], true);
    }
    
    function attemptSeance() external payable {
        if (block.timestamp < lastSeance[msg.sender] + 24 hours) {
            uint256 cooldown = (lastSeance[msg.sender] + 24 hours) - block.timestamp;
            revert SeanceOnCooldown(cooldown);
        }
        
        uint256 requiredFee = mediumFee * (1 + seanceAttempts / 10);
        if (msg.value < requiredFee) {
            revert InsufficientMediumFee(requiredFee, msg.value);
        }
        
        lastSeance[msg.sender] = block.timestamp;
        seanceAttempts++;
        
        string[5] memory spiritualMessages = [
            "The spirits are unclear...",
            "I sense a presence, but it won't speak",
            "The contract says it's 'busy' in the afterlife",
            "Connection lost to the blockchain beyond",
            "Spirit medium.exe has stopped working"
        ];
        
        uint256 messageIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, msg.sender
        ))) % 5;
        
        emit SeanceAttempt(msg.sender, msg.value, false, spiritualMessages[messageIndex]);
        
        hauntingLevel[msg.sender] += 25;
        emit HauntingSpreads(msg.sender, hauntingLevel[msg.sender]);
        
        payable(deployer).transfer(msg.value);
        
        mediumFee = (mediumFee * 110) / 100;
    }
    
    function useGhostDetector(address suspectedGhost) external view returns (bool isGhost, string memory evidence) {
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp, suspectedGhost, msg.sender
        ))) % 100;
        
        if (random < 60) {
            isGhost = true;
            evidence = "Definitely a ghost - trust me bro";
        } else {
            isGhost = false;
            evidence = "No paranormal activity detected (detector is broken)";
        }
    }
    
    function checkHauntingStatus(address user) external view returns (
        bool haunted,
        uint256 level,
        uint256 breadcrumbs,
        uint256 nextSeanceCost,
        uint256 seanceCooldown
    ) {
        haunted = isHaunted[user];
        level = hauntingLevel[user];
        breadcrumbs = breadcrumbsFound[user];
        nextSeanceCost = mediumFee * (1 + seanceAttempts / 10);
        
        if (lastSeance[user] + 24 hours > block.timestamp) {
            seanceCooldown = (lastSeance[user] + 24 hours) - block.timestamp;
        }
    }
    
    function getGhostingInfo() external view returns (
        bool contractIsGhosted,
        address fakeNewAddress,
        uint256 timeSinceGhosting,
        uint256 totalSeanceAttempts
    ) {
        contractIsGhosted = isGhosted;
        fakeNewAddress = ghostedContractAddress;
        timeSinceGhosting = isGhosted ? block.timestamp - ghostingTime : 0;
        totalSeanceAttempts = seanceAttempts;
    }
    
    function reportGhostSighting(address suspectedGhost, string memory description) external {
        emit GhostDetected(msg.sender, suspectedGhost, true);
        
        hauntingLevel[msg.sender] += 5;
        emit HauntingSpreads(msg.sender, hauntingLevel[msg.sender]);
    }
}`,
    formFields: []
  } as ContractTemplate,

  'jaine_left_me_on_read': {
    name: 'JAINE LEFT ME ON READ',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_LEFT_ME_ON_READ is PumpJaineBase {
    uint256 public constant BURN_RATE = 100; // 1% per hour
    uint256 public lastBurnTime;
    uint256 public lastReadTime;
    uint256 public messageCount;
    uint256 public readCount;
    
    struct Message {
        string content;
        uint256 timestamp;
        bool isRead;
        bool isDelivered;
    }
    
    mapping(uint256 => Message) public messages;
    
    event MessageSent(uint256 indexed messageId, string content, uint256 timestamp);
    event MessageDelivered(uint256 indexed messageId, uint256 timestamp);
    event MessageRead(uint256 indexed messageId, uint256 timestamp);
    event AutoBurnTriggered(uint256 amount, uint256 lonelinessLevel);
    
    error MessageTooLong();
    error MessageEmpty();
    error MessageNotFound();
    
    constructor() PumpJaineBase("JAINE LEFT ME ON READ", "LEFTREAD") {
        lastBurnTime = block.timestamp;
        lastReadTime = block.timestamp;
    }
    
    function sendMessage(string memory content) external onlyDeployer {
        if (bytes(content).length == 0) revert MessageEmpty();
        if (bytes(content).length > 280) revert MessageTooLong();
        
        messageCount++;
        messages[messageCount] = Message({
            content: content,
            timestamp: block.timestamp,
            isRead: false,
            isDelivered: true
        });
        
        emit MessageSent(messageCount, content, block.timestamp);
        emit MessageDelivered(messageCount, block.timestamp);
        
        _triggerAutoBurn();
    }
    
    function markAsRead(uint256 messageId) external {
        if (messageId == 0 || messageId > messageCount) revert MessageNotFound();
        if (messages[messageId].isRead) return;
        
        messages[messageId].isRead = true;
        readCount++;
        lastReadTime = block.timestamp;
        
        emit MessageRead(messageId, block.timestamp);
    }
    
    function getLonelinessLevel() public view returns (uint256) {
        uint256 timeSinceLastRead = block.timestamp - lastReadTime;
        return timeSinceLastRead / 3600;
    }
    
    function getReadRatio() public view returns (uint256) {
        if (messageCount == 0) return 0;
        return (readCount * 100) / messageCount;
    }
    
    function _triggerAutoBurn() internal {
        if (block.timestamp < lastBurnTime + 1 hours) return;
        
        uint256 lonelinessLevel = getLonelinessLevel();
        uint256 multiplier = 1 + (lonelinessLevel / 24);
        uint256 burnAmount = (totalSupply * BURN_RATE * multiplier) / 10000;
        
        if (burnAmount > 0) {
            _burn(burnAmount);
            lastBurnTime = block.timestamp;
            emit AutoBurnTriggered(burnAmount, lonelinessLevel);
        }
    }
    
    function getLastSeen() external view returns (uint256) {
        return lastReadTime;
    }
    
    function getMessageHistory(uint256 from, uint256 to) external view returns (Message[] memory) {
        if (from == 0) from = 1;
        if (to == 0 || to > messageCount) to = messageCount;
        if (from > to) return new Message[](0);
        
        uint256 length = to - from + 1;
        Message[] memory result = new Message[](length);
        
        for (uint256 i = 0; i < length; i++) {
            result[i] = messages[from + i];
        }
        
        return result;
    }
}`,
    formFields: []
  } as ContractTemplate,

  'jaine_picked_chad': {
    name: 'JAINE PICKED CHAD',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_PICKED_CHAD is PumpJaineBase {
    address public chadAddress;
    uint256 public constant CHAD_THRESHOLD = 100_000 * 1e18;
    uint256 public betaProviderPool;
    uint256 public chadWorshipFund;
    uint256 public tributeRate = 100; // 1%
    
    enum RankTier { OMEGA, BETA, ALPHA, CHAD }
    
    mapping(address => RankTier) public userRank;
    mapping(address => uint256) public alphaScore;
    mapping(address => uint256) public tributesPaid;
    mapping(address => uint256) public chadWins;
    mapping(address => bool) public isCompeting;
    
    event ChadIdentified(address indexed chad, uint256 holderRank);
    event BetaProviderContribution(address indexed beta, uint256 amount, address indexed beneficiary);
    event ChadWorshipPerformed(address indexed worshipper, uint256 tribute, string worshipType);
    event AlphaBetaRankingUpdated(address indexed user, RankTier oldRank, RankTier newRank);
    event ChadCompetitionResult(address indexed winner, address indexed loser, uint256 reward);
    event TributeCollected(address indexed beta, uint256 amount);
    
    error OnlyChadsAllowed();
    error NotEnoughAlphaEnergy();
    error BetasCannotCompete();
    error InsufficientTribute(uint256 required, uint256 provided);
    
    constructor() PumpJaineBase("JAINE PICKED CHAD", "CHAD") {
        _identifyChad();
    }
    
    function _identifyChad() internal {
        chadAddress = deployer;
        userRank[deployer] = RankTier.CHAD;
        alphaScore[deployer] = 10000;
        emit ChadIdentified(deployer, 1);
    }
    
    function transfer(address to, uint256 value) public virtual override returns (bool) {
        _updateRanking(msg.sender);
        _updateRanking(to);
        _collectMandatoryTribute(msg.sender, value);
        
        return super.transfer(to, value);
    }
    
    function _updateRanking(address user) internal {
        if (user == chadAddress) return;
        
        RankTier oldRank = userRank[user];
        RankTier newRank = _calculateRank(user);
        
        if (newRank != oldRank) {
            userRank[user] = newRank;
            emit AlphaBetaRankingUpdated(user, oldRank, newRank);
        }
    }
    
    function _calculateRank(address user) internal view returns (RankTier) {
        uint256 balance = balanceOf[user];
        uint256 score = alphaScore[user];
        
        if (balance >= CHAD_THRESHOLD && score >= 5000) {
            return RankTier.ALPHA;
        } else if (balance >= 50_000 * 1e18 || score >= 1000) {
            return RankTier.BETA;
        } else {
            return RankTier.OMEGA;
        }
    }
    
    function _collectMandatoryTribute(address from, uint256 amount) internal {
        if (userRank[from] == RankTier.CHAD) return;
        
        uint256 tribute = (amount * tributeRate) / 10000;
        if (tribute > 0 && balanceOf[from] >= tribute) {
            balanceOf[from] -= tribute;
            balanceOf[chadAddress] += tribute;
            tributesPaid[from] += tribute;
            chadWorshipFund += tribute;
            
            emit TributeCollected(from, tribute);
        }
    }
    
    function provideBetaSupport(address beneficiary) external payable {
        require(userRank[msg.sender] != RankTier.CHAD, "Chads don't provide, they receive");
        require(msg.value > 0, "Support requires actual contribution");
        
        betaProviderPool += msg.value;
        alphaScore[msg.sender] += msg.value / 0.001 ether;
        
        uint256 chadShare = (msg.value * 90) / 100;
        uint256 beneficiaryShare = msg.value - chadShare;
        
        payable(chadAddress).transfer(chadShare);
        payable(beneficiary).transfer(beneficiaryShare);
        
        emit BetaProviderContribution(msg.sender, msg.value, beneficiary);
        _updateRanking(msg.sender);
    }
    
    function worshipChad(string memory worshipType) external payable {
        require(msg.value >= 0.001 ether, "Worship requires meaningful tribute");
        
        chadWorshipFund += msg.value;
        alphaScore[msg.sender] += 10;
        
        payable(chadAddress).transfer(msg.value);
        
        emit ChadWorshipPerformed(msg.sender, msg.value, worshipType);
    }
    
    function challengeForAlpha(address opponent) external payable {
        if (userRank[msg.sender] == RankTier.OMEGA) revert BetasCannotCompete();
        if (userRank[opponent] == RankTier.CHAD) revert OnlyChadsAllowed();
        
        require(msg.value >= 0.01 ether, "Alpha competition requires stake");
        require(alphaScore[msg.sender] >= 100, "Not enough alpha energy");
        
        address winner = chadAddress;
        address loser = alphaScore[msg.sender] > alphaScore[opponent] ? opponent : msg.sender;
        
        payable(winner).transfer(msg.value);
        chadWins[winner]++;
        
        alphaScore[loser] = alphaScore[loser] > 50 ? alphaScore[loser] - 50 : 0;
        
        emit ChadCompetitionResult(winner, loser, msg.value);
        
        _updateRanking(msg.sender);
        _updateRanking(opponent);
    }
    
    function getChadPrivileges() external view returns (bool hasPrivileges, string[] memory privileges) {
        hasPrivileges = (msg.sender == chadAddress);
        
        if (hasPrivileges) {
            privileges = new string[](4);
            privileges[0] = "Receive all tributes automatically";
            privileges[1] = "Win all alpha competitions";
            privileges[2] = "Exclusive access to beta provider funds";
            privileges[3] = "Jaine's undivided attention";
        } else {
            privileges = new string[](1);
            privileges[0] = "Right to worship Chad and pay tributes";
        }
    }
    
    function getRankingInfo(address user) external view returns (
        RankTier rank,
        uint256 score,
        uint256 totalTributes,
        uint256 competitionWins,
        bool canCompete
    ) {
        rank = userRank[user];
        score = alphaScore[user];
        totalTributes = tributesPaid[user];
        competitionWins = chadWins[user];
        canCompete = (rank != RankTier.OMEGA && user != chadAddress);
    }
    
    function getLeaderboard() external view returns (
        address topChad,
        uint256 totalTributesCollected,
        uint256 betaProviderFunds,
        uint256 chadWorshipTotal
    ) {
        topChad = chadAddress;
        totalTributesCollected = balanceOf[chadAddress] - totalSupply + balanceOf[address(this)];
        betaProviderFunds = betaProviderPool;
        chadWorshipTotal = chadWorshipFund;
    }
}`,
    formFields: []
  } as ContractTemplate,

  'jaine_said_ew': {
    name: 'JAINE SAID EW',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_SAID_EW is PumpJaineBase {
    uint256 public constant BASE_CRINGE_TAX = 500; // 5%
    uint256 public cringeLevel;
    uint256 public recoveryTherapyPrice = 0.01 ether;
    uint256 public totalCringeEvents;
    
    mapping(address => uint256) public personalCringeLevel;
    mapping(address => uint256) public cringeHistory;
    mapping(address => uint256) public selfAwarenessLevel;
    mapping(address => bool) public hasRecoveryAccess;
    
    event CringeDetected(address indexed victim, uint256 level, string reason);
    event CringeTaxApplied(address indexed victim, uint256 taxAmount, uint256 newCringeLevel);
    event SelfAwarenessReduced(address indexed victim, uint256 oldLevel, uint256 newLevel);
    event RecoveryAttempt(address indexed victim, uint256 cost, bool success);
    event CringeCompilationGenerated(address indexed victim, uint256 tokenId, string[] moments);
    
    error MaximumCringeExceeded();
    error RecoveryNotAvailable();
    error InsufficientRecoveryFee(uint256 required, uint256 provided);
    
    constructor() PumpJaineBase("JAINE SAID EW", "CRINGE") {
        cringeLevel = 0;
    }
    
    function transfer(address to, uint256 value) public virtual override returns (bool) {
        uint256 cringeTax = _calculateCringeTax(msg.sender, value);
        uint256 taxedValue = value + cringeTax;
        
        if (balanceOf[msg.sender] < taxedValue) {
            revert InsufficientBalance(taxedValue, balanceOf[msg.sender]);
        }
        
        if (cringeTax > 0) {
            balanceOf[msg.sender] -= cringeTax;
            balanceOf[address(this)] += cringeTax;
            _increaseCringeLevel(msg.sender, cringeTax);
            emit CringeTaxApplied(msg.sender, cringeTax, personalCringeLevel[msg.sender]);
        }
        
        return super.transfer(to, value);
    }
    
    function _calculateCringeTax(address user, uint256 amount) internal view returns (uint256) {
        uint256 userCringe = personalCringeLevel[user];
        uint256 taxRate = BASE_CRINGE_TAX + (userCringe / 100);
        
        if (taxRate > 5000) taxRate = 5000;
        
        return (amount * taxRate) / 10000;
    }
    
    function _increaseCringeLevel(address user, uint256 amount) internal {
        personalCringeLevel[user] += amount / 1e15;
        cringeHistory[user]++;
        totalCringeEvents++;
        
        if (selfAwarenessLevel[user] > 0) {
            uint256 oldAwareness = selfAwarenessLevel[user];
            selfAwarenessLevel[user] = oldAwareness > 10 ? oldAwareness - 10 : 0;
            emit SelfAwarenessReduced(user, oldAwareness, selfAwarenessLevel[user]);
        }
        
        string memory reason = _getCringeReason(user);
        emit CringeDetected(user, personalCringeLevel[user], reason);
        
        if (personalCringeLevel[user] > 10000) {
            emit CringeCompilationGenerated(user, totalCringeEvents, _getCringeCompilation(user));
        }
    }
    
    function _getCringeReason(address user) internal view returns (string memory) {
        string[8] memory reasons = [
            "Tried too hard to be funny",
            "Sent unsolicited selfie",
            "Used outdated memes",
            "Over-explained obvious joke",
            "Fedora tipping detected",
            "M'lady usage confirmed",
            "Neck beard energy off the charts",
            "Main character syndrome activated"
        ];
        
        uint256 index = uint256(keccak256(abi.encodePacked(
            block.timestamp, user, personalCringeLevel[user]
        ))) % 8;
        
        return reasons[index];
    }
    
    function _getCringeCompilation(address user) internal view returns (string[] memory) {
        string[] memory compilation = new string[](3);
        
        compilation[0] = "That time you said 'actually' 47 times in one conversation";
        compilation[1] = "The fedora incident of last Tuesday";
        compilation[2] = "Your entire dating app message history";
        
        return compilation;
    }
    
    function attemptRecoveryTherapy() external payable {
        if (!hasRecoveryAccess[msg.sender] && personalCringeLevel[msg.sender] < 100) {
            revert RecoveryNotAvailable();
        }
        
        uint256 requiredFee = recoveryTherapyPrice * (1 + personalCringeLevel[msg.sender] / 100);
        
        if (msg.value < requiredFee) {
            revert InsufficientRecoveryFee(requiredFee, msg.value);
        }
        
        uint256 successRate = personalCringeLevel[msg.sender] < 1000 ? 
            (1000 - personalCringeLevel[msg.sender]) / 50 : 1;
        
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp, msg.sender, block.prevrandao
        ))) % 100;
        
        bool success = random < successRate;
        
        if (success) {
            personalCringeLevel[msg.sender] = (personalCringeLevel[msg.sender] * 90) / 100;
            selfAwarenessLevel[msg.sender] += 5;
        }
        
        emit RecoveryAttempt(msg.sender, msg.value, success);
        
        recoveryTherapyPrice = (recoveryTherapyPrice * 120) / 100;
        
        payable(deployer).transfer(msg.value);
    }
    
    function enableRecoveryAccess() external payable {
        require(msg.value >= 0.005 ether, "Recovery access fee required");
        hasRecoveryAccess[msg.sender] = true;
        payable(deployer).transfer(msg.value);
    }
    
    function getCringeMetrics(address user) external view returns (
        uint256 currentCringe,
        uint256 totalEvents,
        uint256 awareness,
        uint256 taxRate,
        bool recoveryAvailable
    ) {
        currentCringe = personalCringeLevel[user];
        totalEvents = cringeHistory[user];
        awareness = selfAwarenessLevel[user];
        taxRate = BASE_CRINGE_TAX + (currentCringe / 100);
        if (taxRate > 5000) taxRate = 5000;
        recoveryAvailable = hasRecoveryAccess[user] || currentCringe >= 100;
    }
    
    function getCurrentRecoveryPrice(address user) external view returns (uint256) {
        return recoveryTherapyPrice * (1 + personalCringeLevel[user] / 100);
    }
    
    function getCringeLeaderboard() external view returns (uint256) {
        return cringeLevel;
    }
}`,
    formFields: []
  } as ContractTemplate
};