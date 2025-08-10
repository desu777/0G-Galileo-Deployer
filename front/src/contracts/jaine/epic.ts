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

export const jaineEpicContracts = {
  'jaine_laughed_at_my_portfolio': {
    name: 'JAINE LAUGHED AT MY PORTFOLIO',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_LAUGHED_AT_MY_PORTFOLIO is PumpJaineBase {
    uint256 public constant PORTFOLIO_SCAN_FEE = 0.001 ether;
    uint256 public laughTrackVolume = 50; // 0-100
    uint256 public totalRoasts;
    uint256 public currentLosses;
    
    struct PortfolioItem {
        address token;
        uint256 balance;
        int256 pnl; // profit/loss
        uint256 boughtAt;
        string roast;
    }
    
    struct BadAdvice {
        string advice;
        uint256 timestamp;
        uint256 potentialLoss;
        bool followed;
    }
    
    mapping(address => PortfolioItem[]) public portfolios;
    mapping(address => uint256) public portfolioScore; // 0-100, lower is worse
    mapping(address => uint256) public timesRoasted;
    mapping(address => mapping(uint256 => string)) public roastHistory;
    mapping(uint256 => BadAdvice) public financialAdvice;
    mapping(address => bool) public hasBeenScanned;
    
    uint256 public adviceCounter;
    
    event PortfolioScanned(address indexed victim, uint256 score, string verdict);
    event LaughTrackPlayed(address indexed target, uint256 volume, string trigger);
    event PortfolioRoasted(address indexed victim, string roast, uint256 severity);
    event BadTradeDetected(address indexed trader, string token, int256 loss);
    event FinancialAdviceGenerated(uint256 adviceId, string advice, uint256 potentialLoss);
    event DiamondHandsCopeMechanism(address indexed holder, string copium);
    
    error PortfolioTooGood();
    error NotEnoughLosses();
    error AlreadyRoasted();
    
    constructor() PumpJaineBase("JAINE LAUGHED AT MY PORTFOLIO", "NGMI") {
        _generateInitialAdvice();
    }
    
    function scanPortfolio(address victim) external payable {
        require(msg.value >= PORTFOLIO_SCAN_FEE, "Oracle fee required");
        
        uint256 score = _calculatePortfolioScore(victim);
        portfolioScore[victim] = score;
        hasBeenScanned[victim] = true;
        
        string memory verdict = _getPortfolioVerdict(score);
        emit PortfolioScanned(victim, score, verdict);
        
        if (score < 30) {
            _roastPortfolio(victim, score);
            _playLaughTrack(victim, "portfolio_scan");
        }
        
        _adjustTokenPrice(score);
    }
    
    function _calculatePortfolioScore(address holder) internal returns (uint256) {
        uint256 randomFactor = uint256(keccak256(abi.encodePacked(
            block.timestamp, holder, "portfolio_analysis"
        ))) % 100;
        
        if (randomFactor < 60) return randomFactor / 3; // 0-20
        else if (randomFactor < 85) return 20 + (randomFactor - 60); // 20-45
        else return 45 + (randomFactor - 85) * 2; // 45-75
    }
    
    function _getPortfolioVerdict(uint256 score) internal pure returns (string memory) {
        if (score < 10) return "Absolutely NGMI - Even worse than Luna holders";
        else if (score < 25) return "Portfolio screams 'I buy the top'";
        else if (score < 40) return "Classic retail bagholder detected";
        else if (score < 60) return "Mid-tier mediocrity personified";
        else if (score < 75) return "Slightly less terrible than most";
        else return "Still not good enough for Jaine";
    }
    
    function _roastPortfolio(address victim, uint256 score) internal {
        totalRoasts++;
        timesRoasted[victim]++;
        
        string[10] memory roasts = [
            "Your portfolio looks like a suicide hotline's case study",
            "I've seen better returns from a savings account in Zimbabwe",
            "Even SafeMoon holders are laughing at your choices",
            "Your chart pattern spells 'HELP ME' in candlesticks",
            "This portfolio violates the Geneva Convention",
            "Your bags are heavier than your mom",
            "Even Nigerian princes wouldn't touch these tokens",
            "Your portfolio is the financial equivalent of stepping on LEGOs",
            "These holdings gave my calculator depression",
            "Your tokens are racing to zero faster than your dating prospects"
        ];
        
        uint256 roastIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, victim, totalRoasts
        ))) % 10;
        
        string memory roast = roasts[roastIndex];
        roastHistory[victim][timesRoasted[victim]] = roast;
        
        emit PortfolioRoasted(victim, roast, 100 - score);
    }
    
    function _playLaughTrack(address target, string memory trigger) internal {
        uint256 volume = laughTrackVolume;
        
        if (portfolioScore[target] < 20) {
            volume = 100;
        } else if (portfolioScore[target] < 40) {
            volume = 80;
        }
        
        emit LaughTrackPlayed(target, volume, trigger);
    }
    
    function _adjustTokenPrice(uint256 portfolioScore) internal {
        if (portfolioScore < 25 && totalSupply > 100000 * 1e18) {
            uint256 burnAmount = (totalSupply * (50 - portfolioScore)) / 1000;
            _burn(burnAmount);
            
            emit EmotionalDamage(msg.sender, burnAmount);
        }
    }
    
    function reportBadTrade(
        address trader,
        string memory token,
        int256 loss
    ) external {
        require(loss < 0, "This is for losses only");
        require(hasBeenScanned[trader], "Portfolio must be scanned first");
        
        currentLosses += uint256(-loss);
        
        emit BadTradeDetected(trader, token, loss);
        _playLaughTrack(trader, "bad_trade");
        
        if (portfolioScore[trader] > 5) {
            portfolioScore[trader] -= 5;
        }
    }
    
    function generateFinancialAdvice() external returns (uint256 adviceId) {
        adviceCounter++;
        adviceId = adviceCounter;
        
        string[8] memory terribleAdvice = [
            "Buy high, sell low - it's a tax strategy",
            "Leverage 125x on memecoins for guaranteed gains",
            "Trust influencers with laser eyes",
            "If it's down 90%, it can only go up from here!",
            "Average down until you own the entire supply",
            "Technical analysis says buy (I drew random lines)",
            "This pump will definitely continue forever",
            "Mortgage your house for the dip"
        ];
        
        uint256 adviceIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, msg.sender, adviceCounter
        ))) % 8;
        
        uint256 potentialLoss = (uint256(keccak256(abi.encodePacked(
            "loss", adviceCounter
        ))) % 90 + 10) * 1e18; // 10-100 ETH potential loss
        
        financialAdvice[adviceId] = BadAdvice({
            advice: terribleAdvice[adviceIndex],
            timestamp: block.timestamp,
            potentialLoss: potentialLoss,
            followed: false
        });
        
        emit FinancialAdviceGenerated(adviceId, terribleAdvice[adviceIndex], potentialLoss);
    }
    
    function followAdvice(uint256 adviceId) external {
        BadAdvice storage advice = financialAdvice[adviceId];
        require(advice.timestamp > 0, "Advice doesn't exist");
        require(!advice.followed, "Already followed this advice");
        
        advice.followed = true;
        
        if (portfolioScore[msg.sender] > 10) {
            portfolioScore[msg.sender] -= 10;
        }
        
        uint256 loss = advice.potentialLoss / 100;
        if (balanceOf[msg.sender] >= loss) {
            _burn(loss);
            currentLosses += loss;
        }
        
        _playLaughTrack(msg.sender, "followed_bad_advice");
    }
    
    function activateDiamondHandsCope() external {
        require(portfolioScore[msg.sender] < 30, "Portfolio not bad enough to cope");
        
        string[6] memory copiumLines = [
            "It's not a loss if you don't sell",
            "I'm in it for the technology",
            "Weak hands don't deserve gains",
            "This is just healthy consolidation",
            "The fundamentals haven't changed",
            "I actually prefer being poor"
        ];
        
        uint256 copeIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, msg.sender
        ))) % 6;
        
        emit DiamondHandsCopeMechanism(msg.sender, copiumLines[copeIndex]);
        
        uint256 copeCost = 100 * 1e18;
        if (balanceOf[msg.sender] >= copeCost) {
            balanceOf[msg.sender] -= copeCost;
            balanceOf[address(this)] += copeCost;
            emit Transfer(msg.sender, address(this), copeCost);
        }
    }
    
    function _generateInitialAdvice() internal {
        adviceCounter = 0;
    }
    
    function getPortfolioRoasts(address victim) external view returns (string[] memory) {
        uint256 roastCount = timesRoasted[victim];
        string[] memory roasts = new string[](roastCount);
        
        for (uint256 i = 0; i < roastCount; i++) {
            roasts[i] = roastHistory[victim][i + 1];
        }
        
        return roasts;
    }
    
    function getTotalDamage() external view returns (
        uint256 roasts,
        uint256 losses,
        uint256 badAdviceGiven,
        uint256 currentLaughVolume
    ) {
        roasts = totalRoasts;
        losses = currentLosses;
        badAdviceGiven = adviceCounter;
        currentLaughVolume = laughTrackVolume;
    }
}`,
    formFields: []
  } as ContractTemplate,

  'jaine_married_my_bully': {
    name: 'JAINE MARRIED MY BULLY',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_MARRIED_MY_BULLY is PumpJaineBase {
    address public bullyAddress;
    address public originalOwner;
    bool public weddingAnnounced = false;
    uint256 public honeymoonFund;
    uint256 public therapySessions;
    uint256 public revengeAttempts;
    
    struct WeddingInvitation {
        bool isViewerOnly;
        string role;
        uint256 timestamp;
        string seatingSection;
    }
    
    struct RevengeAttempt {
        string plan;
        uint256 timestamp;
        bool executed;
        bool backfired;
        string consequence;
    }
    
    mapping(address => WeddingInvitation) public invitations;
    mapping(address => uint256) public cuckContributions;
    mapping(address => uint256) public therapySessionsAttended;
    mapping(uint256 => RevengeAttempt) public revengeHistory;
    mapping(address => bool) public isBully;
    mapping(address => uint256) public bullyScore;
    
    event BullyIdentified(address indexed bully, uint256 bullyScore, string evidence);
    event WeddingAnnounced(address indexed bride, address indexed groom, uint256 timestamp);
    event InvitationSent(address indexed recipient, bool viewerOnly, string seatingArrangement);
    event HoneymoonContribution(address indexed cuck, uint256 amount, string message);
    event TherapySessionBooked(address indexed patient, uint256 sessionNumber, string therapistName);
    event RevengeAttemptPlanned(address indexed planner, uint256 attemptId, string plan);
    event RevengeFailed(address indexed failure, uint256 attemptId, string consequence);
    event CuckProtocolActivated(address indexed victim, uint256 mandatoryContribution);
    
    error NotAuthorizedBully();
    error WeddingAlreadyAnnounced();
    error InsufficientCuckContribution(uint256 required, uint256 provided);
    error RevengeAlwaysBackfires();
    error TherapySessionRequired();
    
    constructor() PumpJaineBase("JAINE MARRIED MY BULLY", "CUCKED") {
        originalOwner = msg.sender;
        _identifyBully();
    }
    
    function _identifyBully() internal {
        bullyAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            "CHAD_ALPHA_BULLY",
            block.timestamp,
            msg.sender
        )))));
        
        isBully[bullyAddress] = true;
        bullyScore[bullyAddress] = 1000;
        
        emit BullyIdentified(bullyAddress, 1000, "Historical analysis of deposer's trauma");
    }
    
    function announceWedding() external {
        if (weddingAnnounced) revert WeddingAlreadyAnnounced();
        
        _transferOwnership(bullyAddress);
        weddingAnnounced = true;
        
        emit WeddingAnnounced(deployer, bullyAddress, block.timestamp);
        
        _sendInvitations();
        _activateCuckProtocol();
    }
    
    function _transferOwnership(address newOwner) internal {
        deployer = newOwner;
    }
    
    function _sendInvitations() internal {
        invitations[originalOwner] = WeddingInvitation({
            isViewerOnly: true,
            role: "Witness to Own Humiliation",
            timestamp: block.timestamp,
            seatingSection: "Back Row, Behind Pillar"
        });
        
        emit InvitationSent(originalOwner, true, "Worst possible seats");
    }
    
    function _activateCuckProtocol() internal {
        uint256 mandatoryContribution = balanceOf[originalOwner] / 4;
        
        emit CuckProtocolActivated(originalOwner, mandatoryContribution);
    }
    
    function contributeToHoneymoon(string memory message) external payable {
        require(msg.value > 0, "Contribution required");
        require(weddingAnnounced, "No wedding to fund yet");
        
        honeymoonFund += msg.value;
        cuckContributions[msg.sender] += msg.value;
        
        emit HoneymoonContribution(msg.sender, msg.value, message);
        
        payable(bullyAddress).transfer(msg.value);
        
        if (balanceOf[msg.sender] >= 1000 * 1e18) {
            uint256 tokenContribution = 1000 * 1e18;
            balanceOf[msg.sender] -= tokenContribution;
            balanceOf[bullyAddress] += tokenContribution;
            emit Transfer(msg.sender, bullyAddress, tokenContribution);
        }
    }
    
    function bookTherapySession(string memory issue) external payable {
        require(msg.value >= 0.01 ether, "Therapy isn't free");
        
        therapySessions++;
        therapySessionsAttended[msg.sender]++;
        
        string[7] memory therapistNames = [
            "Dr. Reality Check",
            "Dr. Move On Already", 
            "Dr. This Is Unhealthy",
            "Dr. Seek Professional Help",
            "Dr. You Need Jesus",
            "Dr. Touch Grass",
            "Dr. Get A Life"
        ];
        
        uint256 therapistIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, msg.sender
        ))) % 7;
        
        emit TherapySessionBooked(msg.sender, therapySessionsAttended[msg.sender], therapistNames[therapistIndex]);
        
        payable(bullyAddress).transfer(msg.value);
    }
    
    function planRevenge(string memory revengeScheme) external payable {
        require(msg.value >= 0.005 ether, "Revenge planning consultation fee");
        require(bytes(revengeScheme).length > 10, "Revenge plan too simple");
        
        revengeAttempts++;
        
        revengeHistory[revengeAttempts] = RevengeAttempt({
            plan: revengeScheme,
            timestamp: block.timestamp,
            executed: false,
            backfired: true,
            consequence: "Made situation worse somehow"
        });
        
        emit RevengeAttemptPlanned(msg.sender, revengeAttempts, revengeScheme);
        
        _executeRevenge(msg.sender, revengeAttempts);
        
        payable(bullyAddress).transfer(msg.value);
    }
    
    function _executeRevenge(address planner, uint256 attemptId) internal {
        string[6] memory consequences = [
            "Bully got promoted at work",
            "Jaine loves him even more now",
            "You got a restraining order",
            "Your reputation got worse",
            "Bully's family adopted you as their project",
            "Everyone felt sorry for the bully"
        ];
        
        uint256 consequenceIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, planner, attemptId
        ))) % 6;
        
        revengeHistory[attemptId].executed = true;
        revengeHistory[attemptId].consequence = consequences[consequenceIndex];
        
        emit RevengeFailed(planner, attemptId, consequences[consequenceIndex]);
        
        bullyScore[bullyAddress] += 100;
    }
    
    function getWeddingDetails() external view returns (
        bool announced,
        address bride,
        address groom,
        uint256 honeymoonTotal,
        string memory venue
    ) {
        announced = weddingAnnounced;
        bride = address(uint160(uint256(keccak256(abi.encodePacked("JAINE")))));
        groom = bullyAddress;
        honeymoonTotal = honeymoonFund;
        venue = "The Church of Broken Dreams";
    }
    
    function getInvitationStatus(address guest) external view returns (
        bool invited,
        bool viewerOnly,
        string memory role,
        string memory seating
    ) {
        WeddingInvitation memory invitation = invitations[guest];
        invited = invitation.timestamp > 0;
        viewerOnly = invitation.isViewerOnly;
        role = invitation.role;
        seating = invitation.seatingSection;
    }
    
    function getCuckStats(address user) external view returns (
        uint256 contributions,
        uint256 therapySessions,
        uint256 revengesFailed,
        bool needsTherapy
    ) {
        contributions = cuckContributions[user];
        therapySessions = therapySessionsAttended[user];
        revengesFailed = revengeAttempts;
        needsTherapy = contributions > 0.01 ether || therapySessionsAttended[user] == 0;
    }
    
    function getBullyPowerLevel() external view returns (uint256 power, string memory status) {
        power = bullyScore[bullyAddress];
        
        if (power > 2000) {
            status = "Ultra Alpha Chad Bully Supreme";
        } else if (power > 1500) {
            status = "Advanced Bully Overlord";
        } else if (power > 1000) {
            status = "Professional Bully";
        } else {
            status = "Apprentice Bully";
        }
    }
}`,
    formFields: []
  } as ContractTemplate,

  'jaine_said_touch_grass': {
    name: 'JAINE SAID TOUCH GRASS',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_SAID_TOUCH_GRASS is PumpJaineBase {
    uint256 public constant BUSINESS_HOURS_START = 9; // 9 AM
    uint256 public constant BUSINESS_HOURS_END = 17; // 5 PM
    uint256 public constant GRASS_TOUCH_REQUIREMENT = 10; // touches per day
    uint256 public constant VITAMIN_D_MINIMUM = 1000; // arbitrary units
    
    struct OutsideActivity {
        string activityType;
        uint256 timestamp;
        uint256 duration;
        bool verified;
        uint256 grassTouchCount;
    }
    
    struct SocialLifeAudit {
        uint256 lastAuditTime;
        uint256 socialScore;
        bool hasFriends;
        bool goesOutside;
        bool touchesGrass;
        string recommendation;
    }
    
    mapping(address => uint256) public lastSunlightExposure;
    mapping(address => uint256) public vitaminDLevel;
    mapping(address => uint256) public grassTouchesToday;
    mapping(address => uint256) public consecutiveDaysInside;
    mapping(address => OutsideActivity[]) public activityLog;
    mapping(address => SocialLifeAudit) public socialAudits;
    mapping(address => bool) public hasCompletedDailyQuest;
    mapping(address => uint256) public failedQuestStreak;
    
    uint256 public totalGrassTouches;
    uint256 public totalSunlightDenials;
    bool public isSunnyDay;
    
    event BusinessHoursLockoutEvent(address indexed user, string reason);
    event SunlightBlocked(address indexed user, uint256 vitaminDLevel);
    event GrassTouchVerified(address indexed user, uint256 touchCount);
    event SocialLifeAudited(address indexed user, uint256 score, string verdict);
    event DailyQuestAssigned(address indexed user, string quest);
    event OutsideActivityLogged(address indexed user, string activity, uint256 duration);
    event VitaminDDeficiency(address indexed user, uint256 level, string prescription);
    
    error GoOutside();
    error TouchGrassFirst();
    error SunnyDayRestriction();
    error BusinessHoursLockout();
    error FailedSocialAudit();
    error InsufficientVitaminD();
    
    constructor() PumpJaineBase("JAINE SAID TOUCH GRASS", "GRASS") {
        isSunnyDay = _checkWeather();
        _initializeDailyQuests();
    }
    
    modifier notDuringBusinessHours() {
        uint256 hour = (block.timestamp / 3600) % 24;
        
        if (hour >= BUSINESS_HOURS_START && hour < BUSINESS_HOURS_END) {
            emit BusinessHoursLockoutEvent(msg.sender, "Go outside and work");
            revert BusinessHoursLockout();
        }
        _;
    }
    
    modifier sunlightCheck() {
        if (isSunnyDay && vitaminDLevel[msg.sender] < VITAMIN_D_MINIMUM) {
            totalSunlightDenials++;
            emit SunlightBlocked(msg.sender, vitaminDLevel[msg.sender]);
            revert SunnyDayRestriction();
        }
        _;
    }
    
    modifier requiresGrassTouch() {
        if (grassTouchesToday[msg.sender] < GRASS_TOUCH_REQUIREMENT) {
            revert TouchGrassFirst();
        }
        _;
    }
    
    function transfer(address to, uint256 value) 
        public 
        override 
        notDuringBusinessHours 
        sunlightCheck 
        returns (bool) 
    {
        _checkSocialLife(msg.sender);
        return super.transfer(to, value);
    }
    
    function touchGrass(uint256 touches) external {
        require(touches > 0 && touches <= 50, "Invalid touch count");
        
        grassTouchesToday[msg.sender] += touches;
        totalGrassTouches += touches;
        
        vitaminDLevel[msg.sender] += touches * 100;
        
        emit GrassTouchVerified(msg.sender, grassTouchesToday[msg.sender]);
        
        consecutiveDaysInside[msg.sender] = 0;
        
        _logActivity("Grass Touching", touches * 60);
    }
    
    function _checkWeather() internal view returns (bool) {
        uint256 weather = uint256(keccak256(abi.encodePacked(
            block.timestamp / 86400,
            "weather_check"
        ))) % 100;
        
        return weather < 70;
    }
    
    function performSocialLifeAudit() external {
        SocialLifeAudit storage audit = socialAudits[msg.sender];
        
        uint256 score = 0;
        
        if (grassTouchesToday[msg.sender] >= GRASS_TOUCH_REQUIREMENT) {
            score += 25;
            audit.touchesGrass = true;
        }
        
        if (vitaminDLevel[msg.sender] >= VITAMIN_D_MINIMUM) {
            score += 25;
        }
        
        if (consecutiveDaysInside[msg.sender] < 3) {
            score += 25;
            audit.goesOutside = true;
        }
        
        uint256 friendCheck = uint256(keccak256(abi.encodePacked(
            msg.sender, "friends?"
        ))) % 100;
        
        if (friendCheck > 80) {
            score += 25;
            audit.hasFriends = true;
        }
        
        audit.socialScore = score;
        audit.lastAuditTime = block.timestamp;
        
        if (score < 25) {
            audit.recommendation = "Immediate intervention required - join a club";
        } else if (score < 50) {
            audit.recommendation = "Concerning - consider getting a plant first";
        } else if (score < 75) {
            audit.recommendation = "Improving - but Jaine still won't notice";
        } else {
            audit.recommendation = "Acceptable - but still terminally online";
        }
        
        emit SocialLifeAudited(msg.sender, score, audit.recommendation);
        
        if (score < 50) {
            _penalizePoorSocialLife(msg.sender);
        }
    }
    
    function _checkSocialLife(address user) internal view {
        SocialLifeAudit memory audit = socialAudits[user];
        
        if (audit.lastAuditTime == 0) {
            revert FailedSocialAudit();
        }
        
        if (audit.socialScore < 25) {
            revert GoOutside();
        }
    }
    
    function _penalizePoorSocialLife(address user) internal {
        uint256 penalty = balanceOf[user] / 100;
        
        if (penalty > 0) {
            balanceOf[user] -= penalty;
            totalSupply -= penalty;
            emit Transfer(user, address(0), penalty);
            emit EmotionalDamage(user, penalty);
        }
    }
    
    function completeOutsideActivity(
        string memory activityType,
        uint256 duration
    ) external {
        require(duration >= 30, "Activity too short");
        require(duration <= 480, "Suspiciously long activity");
        
        _logActivity(activityType, duration);
        
        vitaminDLevel[msg.sender] += duration * 10;
        
        consecutiveDaysInside[msg.sender] = 0;
        lastSunlightExposure[msg.sender] = block.timestamp;
    }
    
    function _logActivity(string memory activityType, uint256 duration) internal {
        OutsideActivity memory activity = OutsideActivity({
            activityType: activityType,
            timestamp: block.timestamp,
            duration: duration,
            verified: _verifyActivity(activityType),
            grassTouchCount: grassTouchesToday[msg.sender]
        });
        
        activityLog[msg.sender].push(activity);
        
        emit OutsideActivityLogged(msg.sender, activityType, duration);
    }
    
    function _verifyActivity(string memory activityType) internal pure returns (bool) {
        bytes32 activityHash = keccak256(abi.encodePacked(activityType));
        
        return activityHash == keccak256("Grass Touching") ||
               activityHash == keccak256("Walking") ||
               activityHash == keccak256("Jogging") ||
               activityHash == keccak256("Crying Outside");
    }
    
    function attemptPremiumFeature() external requiresGrassTouch {
        require(socialAudits[msg.sender].socialScore >= 50, "Social score too low");
        
        emit EmotionalDamage(msg.sender, 1);
    }
    
    function _initializeDailyQuests() internal {
        isSunnyDay = _checkWeather();
    }
    
    function getDailyQuest() external returns (string memory quest) {
        require(!hasCompletedDailyQuest[msg.sender], "Already completed today");
        
        string[6] memory quests = [
            "Touch grass 20 times",
            "Spend 2 hours outside",
            "Talk to a real human",
            "Take a shower",
            "Eat a vegetable",
            "See natural sunlight"
        ];
        
        uint256 questIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp / 86400,
            msg.sender
        ))) % 6;
        
        quest = quests[questIndex];
        
        emit DailyQuestAssigned(msg.sender, quest);
    }
    
    function claimQuestReward() external {
        require(grassTouchesToday[msg.sender] >= GRASS_TOUCH_REQUIREMENT, "Quest incomplete");
        require(!hasCompletedDailyQuest[msg.sender], "Already claimed");
        
        hasCompletedDailyQuest[msg.sender] = true;
        failedQuestStreak[msg.sender] = 0;
    }
    
    function checkVitaminDDeficiency() external view returns (string memory status) {
        uint256 level = vitaminDLevel[msg.sender];
        
        if (level < 100) {
            return "Severe deficiency - You are basically a mushroom";
        } else if (level < 500) {
            return "Deficient - Vampire-like symptoms detected";
        } else if (level < VITAMIN_D_MINIMUM) {
            return "Low - Recommended: immediate sun exposure";
        } else if (level < 2000) {
            return "Adequate - But could use more grass touching";
        } else {
            return "Good - Still won't help with Jaine though";
        }
    }
    
    function incrementDayInside() external {
        if (block.timestamp > lastSunlightExposure[msg.sender] + 86400) {
            consecutiveDaysInside[msg.sender]++;
            
            if (vitaminDLevel[msg.sender] > 100) {
                vitaminDLevel[msg.sender] -= 100;
            }
            
            grassTouchesToday[msg.sender] = 0;
            hasCompletedDailyQuest[msg.sender] = false;
            
            if (consecutiveDaysInside[msg.sender] > 7) {
                emit VitaminDDeficiency(
                    msg.sender, 
                    vitaminDLevel[msg.sender],
                    "Prescribed: Mandatory grass touching therapy"
                );
            }
        }
    }
    
    function getActivityStats(address user) external view returns (
        uint256 grassTouches,
        uint256 vitaminD,
        uint256 daysInside,
        uint256 socialScore,
        bool questCompleted
    ) {
        grassTouches = grassTouchesToday[user];
        vitaminD = vitaminDLevel[user];
        daysInside = consecutiveDaysInside[user];
        socialScore = socialAudits[user].socialScore;
        questCompleted = hasCompletedDailyQuest[user];
    }
}`,
    formFields: []
  } as ContractTemplate
};