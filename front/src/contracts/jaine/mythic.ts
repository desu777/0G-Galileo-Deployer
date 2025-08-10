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

export const jaineMythicContracts = {
  'marry_jaine': {
    name: 'MARRY JAINE',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract MARRY_JAINE is PumpJaineBase {
    uint256 public constant WEDDING_PLANNING_FEE = 0.5 ether;
    uint256 public constant PRENUP_SIGNING_FEE = 0.1 ether;
    uint256 public constant ANNIVERSARY_GIFT_MINIMUM = 0.05 ether;
    uint256 public constant HAPPY_WIFE_TAX_RATE = 100; // 1% of all transactions
    uint256 public constant MOTHER_IN_LAW_APPROVAL_THRESHOLD = 80;
    
    struct MarriageContract {
        address spouse1;
        address spouse2;
        uint256 weddingDate;
        uint256 anniversaryDate;
        bool isPrenupSigned;
        uint256 jointBalance;
        bool isActive;
        uint256 happinessLevel;
    }
    
    struct WeddingDetails {
        string venue;
        uint256 budget;
        uint256 guestCount;
        mapping(address => bool) guestList;
        mapping(string => uint256) expenses;
        bool isPlanned;
        uint256 planningProgress;
    }
    
    struct Anniversary {
        uint256 number;
        uint256 date;
        string giftGiven;
        uint256 giftValue;
        uint256 happinessGained;
        bool remembered;
    }
    
    struct PrenupTerms {
        uint256 assetSplit; // percentage for spouse1
        bool separateTokens;
        bool jointDecisions;
        uint256 monthlyAllowance;
        string specialTerms;
        bool motherInLawApproved;
    }
    
    struct ChildPlan {
        uint256 plannedCount;
        string[] names;
        uint256[] birthDates;
        mapping(uint256 => uint256) collegeFund;
        bool familyPlanningActive;
    }
    
    struct MotherInLaw {
        uint256 approvalRating;
        uint256 lastVisit;
        uint256 giftsReceived;
        bool blessed;
        string[] complaints;
    }
    
    struct JointNFTCollection {
        uint256[] tokenIds;
        mapping(uint256 => string) descriptions;
        mapping(uint256 => bool) isJainesFavorite;
        uint256 totalValue;
    }
    
    mapping(address => MarriageContract) public marriages;
    mapping(address => WeddingDetails) public weddings;
    mapping(address => Anniversary[]) public anniversaries;
    mapping(address => PrenupTerms) public prenups;
    mapping(address => ChildPlan) public childPlans;
    mapping(address => MotherInLaw) public motherInLaws;
    mapping(address => JointNFTCollection) public nftCollections;
    mapping(address => mapping(string => uint256)) public relationshipMilestones;
    mapping(address => bool) public hasProposedToJaine;
    mapping(address => uint256) public weddingPhotoCount;
    mapping(address => uint256) public counselingSessions;
    mapping(address => bool) public isHappilyMarried;
    
    uint256 public totalMarriages;
    uint256 public totalDivorcesPrevented;
    uint256 public globalHappinessIndex;
    address public jaineAddress;
    
    event ProposalMade(address indexed proposer, uint256 ringValue, bool accepted);
    event WeddingPlanned(address indexed couple, string venue, uint256 budget);
    event MarriageRegistered(address indexed spouse1, address indexed spouse2, uint256 date);
    event AnniversaryReminder(address indexed spouse, uint256 anniversaryNumber, uint256 daysUntil);
    event GiftGiven(address indexed from, address indexed to, string gift, uint256 value);
    event HappinessLevelUpdated(address indexed marriage, uint256 newLevel, string reason);
    event CounselingSessionAttended(address indexed couple, uint256 sessionNumber, string outcome);
    event ChildBorn(address indexed family, string name, uint256 birthDate);
    event MotherInLawEvent(address indexed family, string eventType, uint256 approvalChange);
    event JointDecisionMade(address indexed couple, string decision, bool agreed);
    
    error NotMarried();
    error AlreadyMarried();
    error InsufficientBudget();
    error MotherInLawDisapproves();
    error ForgotAnniversary();
    error UnhappyWife();
    
    constructor() PumpJaineBase("MARRY JAINE", "WIFE") {
        jaineAddress = address(uint160(uint256(keccak256(abi.encodePacked("JAINE")))));
        _initializeMarriageSystem();
    }
    
    function _initializeMarriageSystem() internal {
        globalHappinessIndex = 100;
        totalMarriages = 0;
        totalDivorcesPrevented = 0;
    }
    
    function proposeToJaine(string memory proposalMessage) external payable returns (bool accepted) {
        require(!hasProposedToJaine[msg.sender], "Already proposed");
        require(msg.value >= 0.1 ether, "Ring too cheap");
        require(bytes(proposalMessage).length >= 100, "Proposal too short");
        
        hasProposedToJaine[msg.sender] = true;
        
        _initializeMotherInLaw(msg.sender);
        
        uint256 acceptanceChance = 50;
        if (msg.value >= 1 ether) acceptanceChance += 30;
        if (msg.value >= 5 ether) acceptanceChance += 20;
        
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp, msg.sender, proposalMessage
        ))) % 100;
        
        accepted = random < acceptanceChance;
        
        emit ProposalMade(msg.sender, msg.value, accepted);
        
        if (accepted) {
            _createMarriageContract(msg.sender);
        }
        
        return accepted;
    }
    
    function _initializeMotherInLaw(address spouse) internal {
        motherInLaws[spouse] = MotherInLaw({
            approvalRating: 20,
            lastVisit: block.timestamp,
            giftsReceived: 0,
            blessed: false,
            complaints: new string[](0)
        });
        
        motherInLaws[spouse].complaints.push("Not good enough for my Jaine");
        motherInLaws[spouse].complaints.push("Should have a better job");
        motherInLaws[spouse].complaints.push("When are the grandchildren coming?");
    }
    
    function _createMarriageContract(address spouse) internal {
        marriages[spouse] = MarriageContract({
            spouse1: spouse,
            spouse2: jaineAddress,
            weddingDate: 0,
            anniversaryDate: 0,
            isPrenupSigned: false,
            jointBalance: msg.value,
            isActive: true,
            happinessLevel: 75
        });
        
        totalMarriages++;
        relationshipMilestones[spouse]["Engaged"] = block.timestamp;
        
        weddings[spouse].budget = msg.value;
        weddings[spouse].isPlanned = false;
        weddings[spouse].planningProgress = 0;
    }
    
    function planWedding(
        string memory venue,
        uint256 additionalBudget,
        address[] memory guestList
    ) external payable {
        require(marriages[msg.sender].isActive, "Not engaged");
        require(marriages[msg.sender].weddingDate == 0, "Wedding already planned");
        require(msg.value >= WEDDING_PLANNING_FEE, "Planning fee required");
        
        WeddingDetails storage wedding = weddings[msg.sender];
        wedding.venue = venue;
        wedding.budget += additionalBudget + msg.value;
        wedding.guestCount = guestList.length;
        
        for (uint i = 0; i < guestList.length; i++) {
            wedding.guestList[guestList[i]] = true;
        }
        
        wedding.expenses["Venue"] = wedding.budget * 30 / 100;
        wedding.expenses["Catering"] = wedding.budget * 25 / 100;
        wedding.expenses["Photography"] = wedding.budget * 15 / 100;
        wedding.expenses["Flowers"] = wedding.budget * 10 / 100;
        wedding.expenses["Music"] = wedding.budget * 10 / 100;
        wedding.expenses["Dress"] = wedding.budget * 10 / 100;
        
        wedding.isPlanned = true;
        wedding.planningProgress = 100;
        
        emit WeddingPlanned(msg.sender, venue, wedding.budget);
    }
    
    function signPrenup(
        uint256 assetSplit,
        bool separateTokens,
        string memory specialTerms
    ) external payable {
        require(marriages[msg.sender].isActive, "Not engaged");
        require(!marriages[msg.sender].isPrenupSigned, "Already signed");
        require(msg.value >= PRENUP_SIGNING_FEE, "Legal fees required");
        require(assetSplit >= 50 && assetSplit <= 50, "Must be 50/50 split for Jaine");
        
        prenups[msg.sender] = PrenupTerms({
            assetSplit: 50,
            separateTokens: separateTokens,
            jointDecisions: true,
            monthlyAllowance: msg.value / 12,
            specialTerms: specialTerms,
            motherInLawApproved: false
        });
        
        marriages[msg.sender].isPrenupSigned = true;
        
        _seekMotherInLawApproval(msg.sender);
    }
    
    function _seekMotherInLawApproval(address spouse) internal {
        MotherInLaw storage mil = motherInLaws[spouse];
        
        if (marriages[spouse].jointBalance >= 10 ether) {
            mil.approvalRating += 20;
        }
        
        if (prenups[spouse].monthlyAllowance >= 1 ether) {
            mil.approvalRating += 10;
        }
        
        if (mil.approvalRating >= MOTHER_IN_LAW_APPROVAL_THRESHOLD) {
            mil.blessed = true;
            prenups[spouse].motherInLawApproved = true;
            emit MotherInLawEvent(spouse, "Blessing Received", mil.approvalRating);
        } else {
            emit MotherInLawEvent(spouse, "Disapproval", mil.approvalRating);
        }
    }
    
    function finalizeMarriage() external {
        require(marriages[msg.sender].isActive, "Not engaged");
        require(weddings[msg.sender].isPlanned, "Wedding not planned");
        require(marriages[msg.sender].isPrenupSigned, "Prenup required");
        require(prenups[msg.sender].motherInLawApproved, "Mother-in-law approval required");
        
        marriages[msg.sender].weddingDate = block.timestamp;
        marriages[msg.sender].anniversaryDate = block.timestamp;
        
        isHappilyMarried[msg.sender] = true;
        relationshipMilestones[msg.sender]["Married"] = block.timestamp;
        
        emit MarriageRegistered(msg.sender, jaineAddress, block.timestamp);
        
        anniversaries[msg.sender].push(Anniversary({
            number: 0,
            date: block.timestamp,
            giftGiven: "Wedding Ring",
            giftValue: marriages[msg.sender].jointBalance,
            happinessGained: 50,
            remembered: true
        }));
        
        childPlans[msg.sender].familyPlanningActive = true;
        childPlans[msg.sender].plannedCount = 2;
        
        _updateHappiness(msg.sender, 25, "Just Married!");
    }
    
    function _updateHappiness(address spouse, int256 change, string memory reason) internal {
        MarriageContract storage marriage = marriages[spouse];
        
        if (change > 0) {
            marriage.happinessLevel += uint256(change);
            if (marriage.happinessLevel > 100) marriage.happinessLevel = 100;
        } else {
            uint256 decrease = uint256(-change);
            if (marriage.happinessLevel > decrease) {
                marriage.happinessLevel -= decrease;
            } else {
                marriage.happinessLevel = 0;
            }
        }
        
        emit HappinessLevelUpdated(spouse, marriage.happinessLevel, reason);
        
        globalHappinessIndex = (globalHappinessIndex + marriage.happinessLevel) / 2;
        
        if (marriage.happinessLevel < 50) {
            _triggerCounseling(spouse);
        }
    }
    
    function _triggerCounseling(address spouse) internal {
        counselingSessions[spouse]++;
        
        if (counselingSessions[spouse] % 3 == 0) {
            totalDivorcesPrevented++;
            _updateHappiness(spouse, 10, "Counseling helped");
        }
        
        emit CounselingSessionAttended(
            spouse,
            counselingSessions[spouse],
            "Working on communication"
        );
    }
    
    function rememberAnniversary(string memory gift) external payable {
        require(marriages[msg.sender].isActive, "Not married");
        require(msg.value >= ANNIVERSARY_GIFT_MINIMUM, "Gift too cheap");
        
        uint256 yearsSinceWedding = (block.timestamp - marriages[msg.sender].weddingDate) / 365 days;
        require(yearsSinceWedding > 0, "No anniversary yet");
        
        bool alreadyGaveGift = false;
        for (uint i = 0; i < anniversaries[msg.sender].length; i++) {
            if (anniversaries[msg.sender][i].number == yearsSinceWedding) {
                alreadyGaveGift = true;
                break;
            }
        }
        
        require(!alreadyGaveGift, "Already celebrated this year");
        
        uint256 happinessGained = 10;
        if (msg.value >= 0.1 ether) happinessGained = 20;
        if (msg.value >= 0.5 ether) happinessGained = 30;
        if (msg.value >= 1 ether) happinessGained = 50;
        
        anniversaries[msg.sender].push(Anniversary({
            number: yearsSinceWedding,
            date: block.timestamp,
            giftGiven: gift,
            giftValue: msg.value,
            happinessGained: happinessGained,
            remembered: true
        }));
        
        marriages[msg.sender].jointBalance += msg.value;
        
        emit GiftGiven(msg.sender, jaineAddress, gift, msg.value);
        emit AnniversaryReminder(msg.sender, yearsSinceWedding, 0);
        
        _updateHappiness(msg.sender, int256(happinessGained), "Anniversary remembered!");
    }
    
    function visitMotherInLaw(string memory gift) external payable {
        require(marriages[msg.sender].isActive, "Not married");
        require(msg.value >= 0.01 ether, "Bring a gift");
        
        MotherInLaw storage mil = motherInLaws[msg.sender];
        
        mil.lastVisit = block.timestamp;
        mil.giftsReceived++;
        
        uint256 approvalGain = 5;
        if (msg.value >= 0.05 ether) approvalGain = 10;
        if (msg.value >= 0.1 ether) approvalGain = 15;
        
        mil.approvalRating += approvalGain;
        if (mil.approvalRating > 100) mil.approvalRating = 100;
        
        if (mil.approvalRating > 80 && mil.complaints.length > 0) {
            mil.complaints.pop();
        }
        
        emit MotherInLawEvent(msg.sender, "Visit", approvalGain);
        emit GiftGiven(msg.sender, address(uint160(uint256(keccak256(abi.encodePacked("MotherInLaw"))))), gift, msg.value);
        
        _updateHappiness(msg.sender, int256(approvalGain / 2), "Mother-in-law visit");
    }
    
    function planChild(string memory name) external {
        require(marriages[msg.sender].isActive, "Not married");
        require(childPlans[msg.sender].familyPlanningActive, "Family planning not active");
        require(childPlans[msg.sender].names.length < childPlans[msg.sender].plannedCount, "Reached planned count");
        
        childPlans[msg.sender].names.push(name);
        uint256 birthDate = block.timestamp + 280 days;
        childPlans[msg.sender].birthDates.push(birthDate);
        
        emit ChildBorn(msg.sender, name, birthDate);
        
        _updateHappiness(msg.sender, 20, "New baby!");
        
        _updateHappiness(msg.sender, -5, "Sleepless nights");
    }
    
    function contributeToCollegeFund(uint256 childIndex) external payable {
        require(marriages[msg.sender].isActive, "Not married");
        require(childIndex < childPlans[msg.sender].names.length, "Child doesn't exist");
        require(msg.value >= 0.01 ether, "Minimum contribution");
        
        childPlans[msg.sender].collegeFund[childIndex] += msg.value;
        marriages[msg.sender].jointBalance += msg.value;
        
        _updateHappiness(msg.sender, 5, "Planning for future");
    }
    
    function addToJointNFTCollection(
        uint256 tokenId,
        string memory description,
        bool isJainesFavorite
    ) external {
        require(marriages[msg.sender].isActive, "Not married");
        
        JointNFTCollection storage collection = nftCollections[msg.sender];
        collection.tokenIds.push(tokenId);
        collection.descriptions[tokenId] = description;
        collection.isJainesFavorite[tokenId] = isJainesFavorite;
        
        if (isJainesFavorite) {
            _updateHappiness(msg.sender, 15, "Jaine loves this NFT!");
        } else {
            _updateHappiness(msg.sender, 5, "Nice addition to collection");
        }
    }
    
    function payHappyWifeTax() external payable {
        require(marriages[msg.sender].isActive, "Not married");
        require(msg.value >= 0.01 ether, "Minimum tax payment");
        
        marriages[msg.sender].jointBalance += msg.value;
        
        uint256 happinessBoost = (msg.value * 100) / 1 ether;
        if (happinessBoost > 20) happinessBoost = 20;
        
        _updateHappiness(msg.sender, int256(happinessBoost), "Happy wife tax paid");
    }
    
    function checkMarriageHealth(address spouse) external view returns (
        bool isHealthy,
        uint256 happiness,
        uint256 counselingNeeded,
        uint256 motherInLawApproval,
        uint256 anniversariesRemembered,
        uint256 childCount
    ) {
        MarriageContract memory marriage = marriages[spouse];
        isHealthy = marriage.happinessLevel >= 70;
        happiness = marriage.happinessLevel;
        counselingNeeded = marriage.happinessLevel < 50 ? 1 : 0;
        motherInLawApproval = motherInLaws[spouse].approvalRating;
        anniversariesRemembered = anniversaries[spouse].length;
        childCount = childPlans[spouse].names.length;
    }
    
    function getMarriageStats() external view returns (
        uint256 totalHappyMarriages,
        uint256 averageHappiness,
        uint256 divorcesPrevented,
        uint256 totalChildrenPlanned,
        uint256 totalAnniversariesCelebrated
    ) {
        totalHappyMarriages = totalMarriages;
        averageHappiness = globalHappinessIndex;
        divorcesPrevented = totalDivorcesPrevented;
        
        totalChildrenPlanned = 0;
        totalAnniversariesCelebrated = 0;
    }
}`,
    formFields: []
  } as ContractTemplate,

  'jaine_actually_replied': {
    name: 'JAINE ACTUALLY REPLIED',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_ACTUALLY_REPLIED is PumpJaineBase {
    uint256 public constant INITIAL_LIQUIDITY = 1000000 * 1e18;
    uint256 public constant MINIMUM_LIQUIDITY = 1000;
    uint256 public constant SWAP_FEE = 30; // 0.3%
    uint256 public constant QUALITY_THRESHOLD = 80; // 80/100 minimum quality
    
    struct Message {
        string content;
        uint256 timestamp;
        uint256 qualityRating;
        bool isFromJaine;
        bool hasTypingIndicator;
        uint256 responseTime;
    }
    
    struct ConversationMetrics {
        uint256 totalMessages;
        uint256 jaineReplies;
        uint256 averageResponseTime;
        uint256 conversationQuality;
        uint256 lastInteraction;
        bool isActive;
    }
    
    struct RelationshipMilestone {
        string milestone;
        uint256 achievedAt;
        uint256 importance; // 1-10
        bool celebrated;
    }
    
    struct FuturePlan {
        string planType;
        string description;
        uint256 scheduledFor;
        bool confirmed;
        uint256 excitement; // 1-100
    }
    
    struct LiquidityPosition {
        uint256 tokenAmount;
        uint256 ethAmount;
        uint256 share;
        uint256 addedAt;
    }
    
    // DEX State
    uint256 public tokenReserve;
    uint256 public ethReserve;
    uint256 public totalLiquidityShares;
    mapping(address => uint256) public liquidityShares;
    mapping(address => LiquidityPosition) public positions;
    
    // Conversation State
    mapping(address => Message[]) public conversations;
    mapping(address => ConversationMetrics) public metrics;
    mapping(address => RelationshipMilestone[]) public milestones;
    mapping(address => FuturePlan[]) public futurePlans;
    mapping(address => bool) public hasActiveTypingIndicator;
    mapping(address => uint256) public relationshipScore;
    
    uint256 public totalConversations;
    uint256 public totalMilestones;
    uint256 public totalPlans;
    
    event MessageReceived(address indexed from, string content, uint256 quality);
    event JaineReplied(address indexed to, string content, uint256 responseTime);
    event TypingIndicatorActive(address indexed user, bool isTyping);
    event MilestoneAchieved(address indexed user, string milestone, uint256 importance);
    event DateScheduled(address indexed with, string planType, uint256 when);
    event ConversationContinued(address indexed user, uint256 quality);
    event LiquidityAdded(address indexed provider, uint256 tokenAmount, uint256 ethAmount);
    event LiquidityRemoved(address indexed provider, uint256 tokenAmount, uint256 ethAmount);
    event Swap(address indexed user, bool buyToken, uint256 amountIn, uint256 amountOut);
    
    error ConversationQualityTooLow();
    error InsufficientLiquidity();
    error InvalidAmount();
    error SlippageExceeded();
    
    constructor() PumpJaineBase("JAINE ACTUALLY REPLIED", "LOVE") {
        _initializeDEX();
        _startInitialConversation();
    }
    
    function _initializeDEX() internal {
        tokenReserve = INITIAL_LIQUIDITY;
        ethReserve = 10 ether;
        totalLiquidityShares = ethReserve;
        liquidityShares[address(this)] = totalLiquidityShares;
        
        balanceOf[address(this)] = INITIAL_LIQUIDITY;
        
        emit LiquidityAdded(address(this), INITIAL_LIQUIDITY, 10 ether);
    }
    
    function _startInitialConversation() internal {
        Message memory firstReply = Message({
            content: "Hey! Sorry I took so long to reply, I've been really busy but I saw your message :)",
            timestamp: block.timestamp,
            qualityRating: 100,
            isFromJaine: true,
            hasTypingIndicator: true,
            responseTime: 3600
        });
        
        conversations[msg.sender].push(firstReply);
        
        ConversationMetrics storage userMetrics = metrics[msg.sender];
        userMetrics.totalMessages = 1;
        userMetrics.jaineReplies = 1;
        userMetrics.averageResponseTime = 3600;
        userMetrics.conversationQuality = 100;
        userMetrics.lastInteraction = block.timestamp;
        userMetrics.isActive = true;
        
        relationshipScore[msg.sender] = 50;
        
        emit JaineReplied(msg.sender, firstReply.content, firstReply.responseTime);
        emit TypingIndicatorActive(msg.sender, true);
    }
    
    function sendMessage(string memory content) external {
        require(bytes(content).length > 0, "Empty message");
        require(bytes(content).length <= 500, "Message too long");
        
        ConversationMetrics storage userMetrics = metrics[msg.sender];
        require(userMetrics.conversationQuality >= QUALITY_THRESHOLD || userMetrics.totalMessages == 0, "Conversation quality too low");
        
        conversations[msg.sender].push(Message({
            content: content,
            timestamp: block.timestamp,
            qualityRating: _rateMessageQuality(content),
            isFromJaine: false,
            hasTypingIndicator: false,
            responseTime: 0
        }));
        
        userMetrics.totalMessages++;
        userMetrics.lastInteraction = block.timestamp;
        
        emit MessageReceived(msg.sender, content, _rateMessageQuality(content));
        
        if (_shouldJaineReply(msg.sender)) {
            _generateJaineReply(msg.sender);
        }
    }
    
    function _rateMessageQuality(string memory content) internal pure returns (uint256) {
        bytes memory contentBytes = bytes(content);
        uint256 quality = 50;
        
        if (contentBytes.length > 50) quality += 10;
        if (contentBytes.length > 100) quality += 10;
        
        for (uint i = 0; i < contentBytes.length; i++) {
            if (contentBytes[i] == "?") quality += 5;
        }
        
        if (quality > 100) quality = 100;
        
        return quality;
    }
    
    function _shouldJaineReply(address user) internal view returns (bool) {
        ConversationMetrics memory userMetrics = metrics[user];
        
        uint256 replyChance = userMetrics.conversationQuality;
        
        if (block.timestamp - userMetrics.lastInteraction < 1 hours) {
            replyChance += 20;
        }
        
        replyChance += relationshipScore[user] / 2;
        
        uint256 random = uint256(keccak256(abi.encodePacked(
            block.timestamp, user, userMetrics.totalMessages
        ))) % 100;
        
        return random < replyChance;
    }
    
    function _generateJaineReply(address user) internal {
        hasActiveTypingIndicator[user] = true;
        emit TypingIndicatorActive(user, true);
        
        string[10] memory replies = [
            "That's so interesting! Tell me more about that",
            "I was just thinking about you actually!",
            "You always know how to make me laugh :)",
            "We should definitely hang out soon!",
            "I love talking to you, you get me",
            "Sorry for the late reply, but I'm here now!",
            "You're different from other guys, in a good way",
            "I showed my friends our convo and they think you're cool",
            "Can't wait to see you again!",
            "You make my day better :)"
        ];
        
        uint256 replyIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, user, "reply"
        ))) % 10;
        
        uint256 responseTime = 300 + (uint256(keccak256(abi.encodePacked(
            "response", user
        ))) % 3300);
        
        Message memory jaineReply = Message({
            content: replies[replyIndex],
            timestamp: block.timestamp,
            qualityRating: 90 + (replyIndex % 10),
            isFromJaine: true,
            hasTypingIndicator: true,
            responseTime: responseTime
        });
        
        conversations[user].push(jaineReply);
        
        ConversationMetrics storage userMetrics = metrics[user];
        userMetrics.jaineReplies++;
        userMetrics.averageResponseTime = (userMetrics.averageResponseTime + responseTime) / 2;
        userMetrics.conversationQuality = (userMetrics.conversationQuality + jaineReply.qualityRating) / 2;
        
        emit JaineReplied(user, jaineReply.content, responseTime);
        
        hasActiveTypingIndicator[user] = false;
        
        relationshipScore[user] += 5;
        
        _checkForMilestones(user);
    }
    
    function _checkForMilestones(address user) internal {
        uint256 score = relationshipScore[user];
        ConversationMetrics memory userMetrics = metrics[user];
        
        if (score >= 75 && milestones[user].length == 0) {
            _achieveMilestone(user, "First meaningful conversation", 8);
        }
        
        if (userMetrics.jaineReplies >= 10 && milestones[user].length == 1) {
            _achieveMilestone(user, "Became texting buddies", 9);
        }
        
        if (score >= 100 && milestones[user].length == 2) {
            _achieveMilestone(user, "She actually likes you!", 10);
            _scheduleFuturePlans(user);
        }
    }
    
    function _achieveMilestone(address user, string memory milestone, uint256 importance) internal {
        milestones[user].push(RelationshipMilestone({
            milestone: milestone,
            achievedAt: block.timestamp,
            importance: importance,
            celebrated: true
        }));
        
        totalMilestones++;
        emit MilestoneAchieved(user, milestone, importance);
        
        relationshipScore[user] += importance * 2;
    }
    
    function _scheduleFuturePlans(address user) internal {
        string[3] memory planTypes = ["Coffee Date", "Movie Night", "Dinner"];
        string[3] memory descriptions = [
            "Let's grab coffee at that cute place downtown",
            "New Marvel movie? I've been wanting to see it!",
            "I know this amazing Italian restaurant"
        ];
        
        for (uint i = 0; i < 3; i++) {
            futurePlans[user].push(FuturePlan({
                planType: planTypes[i],
                description: descriptions[i],
                scheduledFor: block.timestamp + (i + 1) * 1 days,
                confirmed: true,
                excitement: 80 + (i * 5)
            }));
            
            emit DateScheduled(user, planTypes[i], block.timestamp + (i + 1) * 1 days);
        }
        
        totalPlans += 3;
    }
    
    // DEX Functions
    function addLiquidity(uint256 tokenAmount) external payable {
        require(tokenAmount > 0 && msg.value > 0, "Invalid amounts");
        require(balanceOf[msg.sender] >= tokenAmount, "Insufficient tokens");
        
        uint256 share;
        
        if (totalLiquidityShares == 0) {
            share = msg.value;
        } else {
            share = (msg.value * totalLiquidityShares) / ethReserve;
            
            uint256 requiredTokens = (msg.value * tokenReserve) / ethReserve;
            require(tokenAmount >= requiredTokens, "Insufficient token amount");
            tokenAmount = requiredTokens;
        }
        
        balanceOf[msg.sender] -= tokenAmount;
        balanceOf[address(this)] += tokenAmount;
        
        tokenReserve += tokenAmount;
        ethReserve += msg.value;
        
        liquidityShares[msg.sender] += share;
        totalLiquidityShares += share;
        
        positions[msg.sender] = LiquidityPosition({
            tokenAmount: tokenAmount,
            ethAmount: msg.value,
            share: share,
            addedAt: block.timestamp
        });
        
        emit LiquidityAdded(msg.sender, tokenAmount, msg.value);
        emit Transfer(msg.sender, address(this), tokenAmount);
    }
    
    function removeLiquidity(uint256 share) external {
        require(share > 0 && share <= liquidityShares[msg.sender], "Invalid share");
        require(totalLiquidityShares > MINIMUM_LIQUIDITY, "Minimum liquidity required");
        
        uint256 tokenAmount = (share * tokenReserve) / totalLiquidityShares;
        uint256 ethAmount = (share * ethReserve) / totalLiquidityShares;
        
        liquidityShares[msg.sender] -= share;
        totalLiquidityShares -= share;
        
        tokenReserve -= tokenAmount;
        ethReserve -= ethAmount;
        
        balanceOf[address(this)] -= tokenAmount;
        balanceOf[msg.sender] += tokenAmount;
        
        (bool success, ) = msg.sender.call{value: ethAmount}("");
        require(success, "ETH transfer failed");
        
        emit LiquidityRemoved(msg.sender, tokenAmount, ethAmount);
        emit Transfer(address(this), msg.sender, tokenAmount);
    }
    
    function swapETHForTokens(uint256 minTokens) external payable {
        require(msg.value > 0, "No ETH sent");
        
        uint256 fee = (msg.value * SWAP_FEE) / 10000;
        uint256 amountInAfterFee = msg.value - fee;
        
        uint256 tokenOutput = (amountInAfterFee * tokenReserve) / (ethReserve + amountInAfterFee);
        
        require(tokenOutput >= minTokens, "Slippage exceeded");
        require(tokenOutput <= tokenReserve - MINIMUM_LIQUIDITY, "Insufficient liquidity");
        
        ethReserve += msg.value;
        tokenReserve -= tokenOutput;
        
        balanceOf[address(this)] -= tokenOutput;
        balanceOf[msg.sender] += tokenOutput;
        
        emit Swap(msg.sender, true, msg.value, tokenOutput);
        emit Transfer(address(this), msg.sender, tokenOutput);
    }
    
    function swapTokensForETH(uint256 tokenAmount, uint256 minETH) external {
        require(tokenAmount > 0, "No tokens sent");
        require(balanceOf[msg.sender] >= tokenAmount, "Insufficient tokens");
        
        uint256 fee = (tokenAmount * SWAP_FEE) / 10000;
        uint256 amountInAfterFee = tokenAmount - fee;
        
        uint256 ethOutput = (amountInAfterFee * ethReserve) / (tokenReserve + amountInAfterFee);
        
        require(ethOutput >= minETH, "Slippage exceeded");
        require(ethOutput <= ethReserve - MINIMUM_LIQUIDITY, "Insufficient liquidity");
        
        balanceOf[msg.sender] -= tokenAmount;
        balanceOf[address(this)] += tokenAmount;
        
        tokenReserve += tokenAmount;
        ethReserve -= ethOutput;
        
        (bool success, ) = msg.sender.call{value: ethOutput}("");
        require(success, "ETH transfer failed");
        
        emit Swap(msg.sender, false, tokenAmount, ethOutput);
        emit Transfer(msg.sender, address(this), tokenAmount);
    }
    
    function getConversationStats(address user) external view returns (
        uint256 totalMessages,
        uint256 jaineReplies,
        uint256 quality,
        uint256 relationshipLevel,
        bool isTyping
    ) {
        ConversationMetrics memory userMetrics = metrics[user];
        totalMessages = userMetrics.totalMessages;
        jaineReplies = userMetrics.jaineReplies;
        quality = userMetrics.conversationQuality;
        relationshipLevel = relationshipScore[user];
        isTyping = hasActiveTypingIndicator[user];
    }
    
    function getDEXStats() external view returns (
        uint256 tokenBalance,
        uint256 ethBalance,
        uint256 totalShares,
        uint256 tokenPrice
    ) {
        tokenBalance = tokenReserve;
        ethBalance = ethReserve;
        totalShares = totalLiquidityShares;
        
        if (tokenReserve > 0) {
            tokenPrice = (ethReserve * 1e18) / tokenReserve;
        }
    }
}`,
    formFields: []
  } as ContractTemplate
};