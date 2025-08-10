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

export const jaineLegendaryContracts = {
  'jaine_called_security': {
    name: 'JAINE CALLED SECURITY',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_CALLED_SECURITY is PumpJaineBase {
    uint256 public constant SECURITY_RESPONSE_TIME = 30 seconds;
    uint256 public constant BACKGROUND_CHECK_FEE = 0.01 ether;
    uint256 public constant MINIMUM_VOTES_TO_BAN = 3;
    uint256 public constant BOUNCER_NFT_PRICE = 0.05 ether;
    
    struct SecurityIncident {
        uint256 incidentId;
        uint256 timestamp;
        string reason;
        uint256 threatLevel; // 1-10
        bool resolved;
        uint256 votesAgainst;
    }
    
    struct BouncerNFT {
        uint256 tokenId;
        string name;
        uint256 strength;
        uint256 intimidationFactor;
        bool onDuty;
    }
    
    struct BackgroundCheck {
        bool completed;
        uint256 criminalScore; // 0-100, higher is worse
        uint256 creepinessLevel; // 0-100
        uint256 threatAssessment; // 0-100
        string verdict;
        uint256 checkTime;
    }
    
    struct PublicSafetyAlert {
        bool active;
        string alertType;
        uint256 alertLevel;
        uint256 issuedAt;
        string description;
    }
    
    struct BanVote {
        address voter;
        uint256 timestamp;
        string reason;
    }
    
    mapping(address => SecurityIncident[]) public incidentReports;
    mapping(address => mapping(address => bool)) public hasVotedToBan;
    mapping(address => uint256) public totalVotesAgainst;
    mapping(address => bool) public permanentlyBanned;
    mapping(address => BackgroundCheck) public backgroundChecks;
    mapping(address => PublicSafetyAlert) public activeAlerts;
    mapping(uint256 => BouncerNFT) public bouncerNFTs;
    mapping(address => uint256[]) public ownedBouncers;
    mapping(address => bool) public isSecurityGuard;
    mapping(uint256 => BanVote[]) public banVotes;
    mapping(address => bool) public hasCalledSecurity;
    
    uint256 public totalIncidents;
    uint256 public totalBouncersDeployed;
    uint256 public bouncerTokenCounter;
    uint256 public totalBackgroundChecks;
    address[] public securityGuards;
    
    event SecurityCalled(address indexed caller, address indexed threat, string reason);
    event SecurityArrived(uint256 responseTime, uint256 bouncersDeployed);
    event VoteCastAgainstUser(address indexed voter, address indexed target, string reason);
    event PermanentBanEnacted(address indexed banned, uint256 totalVotes);
    event BackgroundCheckCompleted(address indexed subject, uint256 criminalScore);
    event PublicSafetyAlertIssued(address indexed about, string alertType, uint256 level);
    event BouncerNFTMinted(uint256 tokenId, address owner, string name);
    event SecurityIncidentLogged(address indexed suspect, uint256 incidentId, uint256 threatLevel);
    event CrowdSourcedBan(address indexed target, uint256 votes);
    
    error AlreadyBanned();
    error SecurityAlreadyCalled();
    error InsufficientSecurityClearance();
    error BackgroundCheckFailed();
    error AllGuardsAgainstYou();
    
    constructor() PumpJaineBase("JAINE CALLED SECURITY", "BANNED") {
        _initializeSecurity();
        _callSecurityOnDeployer(msg.sender);
    }
    
    function _initializeSecurity() internal {
        for (uint i = 0; i < 5; i++) {
            address guard = address(uint160(uint256(keccak256(abi.encodePacked("GUARD", i)))));
            securityGuards.push(guard);
            isSecurityGuard[guard] = true;
        }
    }
    
    function _callSecurityOnDeployer(address threat) internal {
        hasCalledSecurity[threat] = true;
        totalIncidents++;
        
        SecurityIncident memory incident = SecurityIncident({
            incidentId: totalIncidents,
            timestamp: block.timestamp,
            reason: "Suspicious individual detected - immediate response required",
            threatLevel: 10,
            resolved: false,
            votesAgainst: securityGuards.length
        });
        
        incidentReports[threat].push(incident);
        
        emit SecurityCalled(address(this), threat, incident.reason);
        emit SecurityIncidentLogged(threat, totalIncidents, 10);
        
        _deployBouncers(threat);
        _issuePublicAlert(threat);
        
        for (uint i = 0; i < securityGuards.length; i++) {
            _castVoteAgainst(securityGuards[i], threat, "Automatic security protocol");
        }
    }
    
    function _deployBouncers(address threat) internal {
        uint256 bouncersNeeded = 3 + (incidentReports[threat].length * 2);
        totalBouncersDeployed += bouncersNeeded;
        
        emit SecurityArrived(SECURITY_RESPONSE_TIME, bouncersNeeded);
        
        for (uint i = 0; i < 3; i++) {
            _mintBouncerNFT(address(this));
        }
    }
    
    function _mintBouncerNFT(address owner) internal returns (uint256) {
        bouncerTokenCounter++;
        
        string[5] memory names = ["Big Tony", "The Wall", "Crusher", "No-Neck Nick", "Door Destroyer"];
        uint256 nameIndex = bouncerTokenCounter % 5;
        
        bouncerNFTs[bouncerTokenCounter] = BouncerNFT({
            tokenId: bouncerTokenCounter,
            name: names[nameIndex],
            strength: 80 + (uint256(keccak256(abi.encodePacked(bouncerTokenCounter))) % 20),
            intimidationFactor: 90 + (uint256(keccak256(abi.encodePacked(bouncerTokenCounter, "intimidation"))) % 10),
            onDuty: true
        });
        
        ownedBouncers[owner].push(bouncerTokenCounter);
        
        emit BouncerNFTMinted(bouncerTokenCounter, owner, names[nameIndex]);
        
        return bouncerTokenCounter;
    }
    
    function _issuePublicAlert(address threat) internal {
        activeAlerts[threat] = PublicSafetyAlert({
            active: true,
            alertType: "DANGER - CREEP DETECTED",
            alertLevel: 10,
            issuedAt: block.timestamp,
            description: "Maintain maximum distance. Do not engage. Call authorities if sighted."
        });
        
        emit PublicSafetyAlertIssued(threat, "DANGER - CREEP DETECTED", 10);
    }
    
    function voteToBlock(address target, string memory reason) external {
        require(!hasVotedToBan[msg.sender][target], "Already voted");
        require(target != msg.sender, "Can't vote for yourself");
        
        hasVotedToBan[msg.sender][target] = true;
        totalVotesAgainst[target]++;
        
        banVotes[totalVotesAgainst[target]].push(BanVote({
            voter: msg.sender,
            timestamp: block.timestamp,
            reason: reason
        }));
        
        emit VoteCastAgainstUser(msg.sender, target, reason);
        
        _castVoteAgainst(msg.sender, target, reason);
    }
    
    function _castVoteAgainst(address voter, address target, string memory reason) internal {
        if (totalVotesAgainst[target] >= MINIMUM_VOTES_TO_BAN && !permanentlyBanned[target]) {
            permanentlyBanned[target] = true;
            emit PermanentBanEnacted(target, totalVotesAgainst[target]);
            emit CrowdSourcedBan(target, totalVotesAgainst[target]);
        }
    }
    
    function transfer(address to, uint256 value) public override returns (bool) {
        if (permanentlyBanned[msg.sender]) {
            revert AlreadyBanned();
        }
        
        if (totalVotesAgainst[msg.sender] > 0) {
            revert AllGuardsAgainstYou();
        }
        
        return super.transfer(to, value);
    }
    
    function requestBackgroundCheck() external payable {
        require(msg.value >= BACKGROUND_CHECK_FEE, "Insufficient fee");
        require(!permanentlyBanned[msg.sender], "Already banned");
        
        totalBackgroundChecks++;
        
        uint256 criminalScore = 60 + (uint256(keccak256(abi.encodePacked(msg.sender, "criminal"))) % 40);
        uint256 creepiness = 70 + (uint256(keccak256(abi.encodePacked(msg.sender, "creepy"))) % 30);
        uint256 threat = 50 + (uint256(keccak256(abi.encodePacked(msg.sender, "threat"))) % 50);
        
        string memory verdict;
        if (threat > 90) {
            verdict = "EXTREME THREAT - IMMEDIATE BAN RECOMMENDED";
        } else if (creepiness > 85) {
            verdict = "CERTIFIED CREEP - MAINTAIN DISTANCE";
        } else if (criminalScore > 75) {
            verdict = "SUSPICIOUS BACKGROUND - MONITOR CLOSELY";
        } else {
            verdict = "STILL CONCERNING - PROCEED WITH CAUTION";
        }
        
        backgroundChecks[msg.sender] = BackgroundCheck({
            completed: true,
            criminalScore: criminalScore,
            creepinessLevel: creepiness,
            threatAssessment: threat,
            verdict: verdict,
            checkTime: block.timestamp
        });
        
        emit BackgroundCheckCompleted(msg.sender, criminalScore);
        
        if (threat > 80) {
            totalIncidents++;
            incidentReports[msg.sender].push(SecurityIncident({
                incidentId: totalIncidents,
                timestamp: block.timestamp,
                reason: "Failed background check",
                threatLevel: threat / 10,
                resolved: false,
                votesAgainst: 0
            }));
            
            emit SecurityIncidentLogged(msg.sender, totalIncidents, threat / 10);
        }
    }
    
    function purchaseBouncerNFT(string memory customName) external payable {
        require(msg.value >= BOUNCER_NFT_PRICE, "Insufficient payment");
        require(!permanentlyBanned[msg.sender], "Banned users can't buy NFTs");
        
        uint256 tokenId = _mintBouncerNFT(msg.sender);
        
        if (bytes(customName).length > 0) {
            bouncerNFTs[tokenId].name = customName;
        }
    }
    
    function reportSuspiciousActivity(address suspect, string memory details) external {
        require(suspect != msg.sender, "Can't report yourself");
        
        totalIncidents++;
        
        uint256 threatLevel = 5 + (uint256(keccak256(abi.encodePacked(
            block.timestamp, suspect, details
        ))) % 5);
        
        incidentReports[suspect].push(SecurityIncident({
            incidentId: totalIncidents,
            timestamp: block.timestamp,
            reason: details,
            threatLevel: threatLevel,
            resolved: false,
            votesAgainst: 0
        }));
        
        emit SecurityIncidentLogged(suspect, totalIncidents, threatLevel);
        
        if (incidentReports[suspect].length > 2) {
            totalVotesAgainst[suspect]++;
            _castVoteAgainst(msg.sender, suspect, "Multiple suspicious incidents");
        }
    }
    
    function checkSecurityStatus(address user) external view returns (
        bool isBanned,
        uint256 votesAgainst,
        uint256 incidents,
        bool hasAlert,
        uint256 threatLevel
    ) {
        isBanned = permanentlyBanned[user];
        votesAgainst = totalVotesAgainst[user];
        incidents = incidentReports[user].length;
        hasAlert = activeAlerts[user].active;
        
        if (incidents > 0) {
            uint256 totalThreat = 0;
            SecurityIncident[] memory userIncidents = incidentReports[user];
            for (uint i = 0; i < userIncidents.length; i++) {
                totalThreat += userIncidents[i].threatLevel;
            }
            threatLevel = totalThreat / incidents;
        }
    }
    
    function getBouncerStats(uint256 tokenId) external view returns (
        string memory name,
        uint256 strength,
        uint256 intimidation,
        bool onDuty,
        address owner
    ) {
        BouncerNFT memory bouncer = bouncerNFTs[tokenId];
        name = bouncer.name;
        strength = bouncer.strength;
        intimidation = bouncer.intimidationFactor;
        onDuty = bouncer.onDuty;
        
        for (uint i = 0; i < bouncerTokenCounter; i++) {
            uint256[] memory owned = ownedBouncers[address(uint160(i))];
            for (uint j = 0; j < owned.length; j++) {
                if (owned[j] == tokenId) {
                    owner = address(uint160(i));
                    break;
                }
            }
        }
    }
    
    function attemptToEnterVenue() external {
        require(!permanentlyBanned[msg.sender], "You're on the permanent ban list");
        require(totalVotesAgainst[msg.sender] < MINIMUM_VOTES_TO_BAN, "Too many people want you gone");
        
        BackgroundCheck memory check = backgroundChecks[msg.sender];
        if (check.threatAssessment > 70) {
            revert BackgroundCheckFailed();
        }
        
        revert AllGuardsAgainstYou();
    }
    
    function getIncidentHistory(address user) external view returns (
        uint256 totalUserIncidents,
        uint256 averageThreatLevel,
        bool currentlyBanned,
        string memory mostRecentIncident
    ) {
        SecurityIncident[] memory incidents = incidentReports[user];
        totalUserIncidents = incidents.length;
        currentlyBanned = permanentlyBanned[user];
        
        if (totalUserIncidents > 0) {
            uint256 totalThreat = 0;
            for (uint i = 0; i < incidents.length; i++) {
                totalThreat += incidents[i].threatLevel;
            }
            averageThreatLevel = totalThreat / totalUserIncidents;
            mostRecentIncident = incidents[incidents.length - 1].reason;
        }
    }
}`,
    formFields: []
  } as ContractTemplate,

  'jaine_restraining_order': {
    name: 'JAINE RESTRAINING ORDER',
    solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

` + PUMP_JAINE_BASE + `

contract JAINE_RESTRAINING_ORDER is PumpJaineBase {
    uint256 public constant MINIMUM_DISTANCE = 500; // meters
    uint256 public constant COURT_FEE = 0.1 ether;
    uint256 public constant VIOLATION_PENALTY = 0.05 ether;
    uint256 public constant LAWYER_CONSULTATION_FEE = 0.02 ether;
    
    struct RestrainingOrder {
        uint256 orderNumber;
        uint256 issuedAt;
        uint256 expiresAt;
        uint256 minimumDistance;
        string reason;
        bool isPermanent;
        uint256 violationCount;
    }
    
    struct CourtProceeding {
        uint256 caseNumber;
        string charge;
        uint256 scheduledDate;
        bool guilty;
        uint256 fine;
        string verdict;
    }
    
    struct LawyerConsultation {
        address lawyer;
        uint256 timestamp;
        string advice;
        bool caseAccepted;
        string rejectionReason;
    }
    
    struct WitnessTestimony {
        address witness;
        string testimony;
        uint256 timestamp;
        bool againstDeployer;
    }
    
    mapping(address => RestrainingOrder) public activeOrders;
    mapping(address => bool) public permanentlyBlacklisted;
    mapping(address => uint256) public violationHistory;
    mapping(address => CourtProceeding[]) public courtHistory;
    mapping(uint256 => LawyerConsultation) public lawyerConsultations;
    mapping(uint256 => WitnessTestimony[]) public witnessTestimonies;
    mapping(address => uint256) public totalFinesPaid;
    mapping(address => bool) public hasTriedToAppeal;
    
    uint256 public totalOrdersIssued;
    uint256 public totalViolations;
    uint256 public consultationCounter;
    uint256 public caseCounter;
    
    event RestrainingOrderIssued(address indexed against, uint256 orderNumber, string reason);
    event OrderViolationDetected(address indexed violator, uint256 violationNumber, uint256 penalty);
    event CourtCaseScheduled(address indexed defendant, uint256 caseNumber, string charge);
    event LawyerConsulted(address indexed client, uint256 consultationId, bool accepted);
    event WitnessTestified(uint256 caseNumber, address witness, bool againstDefendant);
    event LegalDocumentGenerated(address indexed recipient, string documentType, uint256 id);
    event AppealRejected(address indexed appellant, string reason);
    event PermanentBanIssued(address indexed banned, string finalVerdict);
    
    error RestrainingOrderActive();
    error PermanentlyBanned();
    error InsufficientCourtFees();
    error LawyerRefusedCase();
    error AllWitnessesAgainstYou();
    
    constructor() PumpJaineBase("JAINE RESTRAINING ORDER", "BANNED") {
        _issueInitialOrder(msg.sender);
    }
    
    function _issueInitialOrder(address target) internal {
        totalOrdersIssued++;
        
        activeOrders[target] = RestrainingOrder({
            orderNumber: totalOrdersIssued,
            issuedAt: block.timestamp,
            expiresAt: block.timestamp + 365 days,
            minimumDistance: MINIMUM_DISTANCE,
            reason: "Excessive simping detected",
            isPermanent: false,
            violationCount: 0
        });
        
        emit RestrainingOrderIssued(target, totalOrdersIssued, "Excessive simping detected");
        emit LegalDocumentGenerated(target, "Restraining Order", totalOrdersIssued);
        
        _automaticBlacklist(target);
    }
    
    function _automaticBlacklist(address target) internal {
        permanentlyBlacklisted[target] = true;
        emit PermanentBanIssued(target, "Automatic blacklist after first interaction");
    }
    
    function transfer(address to, uint256 value) public override returns (bool) {
        _checkForViolation(msg.sender);
        return super.transfer(to, value);
    }
    
    function _checkForViolation(address user) internal {
        if (permanentlyBlacklisted[user]) {
            revert PermanentlyBanned();
        }
        
        RestrainingOrder storage order = activeOrders[user];
        if (order.orderNumber > 0 && (order.isPermanent || block.timestamp < order.expiresAt)) {
            _recordViolation(user);
            revert RestrainingOrderActive();
        }
    }
    
    function _recordViolation(address violator) internal {
        totalViolations++;
        violationHistory[violator]++;
        activeOrders[violator].violationCount++;
        
        uint256 penalty = VIOLATION_PENALTY * activeOrders[violator].violationCount;
        
        emit OrderViolationDetected(violator, totalViolations, penalty);
        
        if (activeOrders[violator].violationCount >= 3) {
            activeOrders[violator].isPermanent = true;
            emit PermanentBanIssued(violator, "Multiple restraining order violations");
        }
        
        _scheduleCourtCase(violator, "Restraining order violation");
    }
    
    function _scheduleCourtCase(address defendant, string memory charge) internal {
        caseCounter++;
        
        CourtProceeding memory newCase = CourtProceeding({
            caseNumber: caseCounter,
            charge: charge,
            scheduledDate: block.timestamp + 7 days,
            guilty: true,
            fine: COURT_FEE * 2,
            verdict: "Guilty by default - no defense possible"
        });
        
        courtHistory[defendant].push(newCase);
        
        emit CourtCaseScheduled(defendant, caseCounter, charge);
    }
    
    function consultLawyer(string memory caseDetails) external payable returns (uint256 consultationId) {
        require(msg.value >= LAWYER_CONSULTATION_FEE, "Insufficient consultation fee");
        require(!permanentlyBlacklisted[msg.sender], "No lawyer will take your case");
        
        consultationCounter++;
        consultationId = consultationCounter;
        
        string[6] memory rejectionReasons = [
            "This case is unwinnable",
            "I have a conflict of interest (I also think you're creepy)",
            "My reputation can't handle this",
            "Even I have standards",
            "I suddenly remembered I'm busy forever",
            "I'd rather defend actual criminals"
        ];
        
        uint256 reasonIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, msg.sender, consultationId
        ))) % 6;
        
        lawyerConsultations[consultationId] = LawyerConsultation({
            lawyer: address(uint160(uint256(keccak256(abi.encodePacked("Lawyer", consultationId))))),
            timestamp: block.timestamp,
            advice: "Plead guilty and hope for mercy",
            caseAccepted: false,
            rejectionReason: rejectionReasons[reasonIndex]
        });
        
        emit LawyerConsulted(msg.sender, consultationId, false);
        
        totalFinesPaid[msg.sender] += msg.value;
    }
    
    function submitWitnessTestimony(uint256 caseNumber, string memory testimony) external {
        require(caseNumber > 0 && caseNumber <= caseCounter, "Invalid case number");
        
        witnessTestimonies[caseNumber].push(WitnessTestimony({
            witness: msg.sender,
            testimony: testimony,
            timestamp: block.timestamp,
            againstDeployer: true
        }));
        
        emit WitnessTestified(caseNumber, msg.sender, true);
    }
    
    function payCourtFees(uint256 caseNumber) external payable {
        require(msg.value >= COURT_FEE, "Insufficient court fees");
        require(caseNumber > 0 && caseNumber <= caseCounter, "Invalid case number");
        
        totalFinesPaid[msg.sender] += msg.value;
        
        emit LegalDocumentGenerated(msg.sender, "Court Fee Receipt", caseNumber);
    }
    
    function attemptAppeal(string memory appealReason) external payable {
        require(msg.value >= COURT_FEE * 3, "Appeals are expensive");
        require(!hasTriedToAppeal[msg.sender], "Only one appeal allowed");
        
        hasTriedToAppeal[msg.sender] = true;
        totalFinesPaid[msg.sender] += msg.value;
        
        string[5] memory rejectionReasons = [
            "Lack of merit",
            "Appellant is clearly guilty",
            "Judge fell asleep reading this",
            "This appeal insults the court's intelligence",
            "Request denied with prejudice"
        ];
        
        uint256 reasonIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp, msg.sender, appealReason
        ))) % 5;
        
        emit AppealRejected(msg.sender, rejectionReasons[reasonIndex]);
        
        if (activeOrders[msg.sender].orderNumber > 0) {
            activeOrders[msg.sender].minimumDistance *= 2;
            activeOrders[msg.sender].isPermanent = true;
        }
    }
    
    function checkLegalStatus(address user) external view returns (
        bool hasOrder,
        bool isPermanentlyBanned,
        uint256 violations,
        uint256 totalFines,
        uint256 courtCases
    ) {
        hasOrder = activeOrders[user].orderNumber > 0;
        isPermanentlyBanned = permanentlyBlacklisted[user];
        violations = violationHistory[user];
        totalFines = totalFinesPaid[user];
        courtCases = courtHistory[user].length;
    }
    
    function getRestrainingOrderDetails(address user) external view returns (
        uint256 orderNumber,
        uint256 distance,
        string memory reason,
        bool permanent,
        uint256 violations,
        uint256 daysRemaining
    ) {
        RestrainingOrder memory order = activeOrders[user];
        orderNumber = order.orderNumber;
        distance = order.minimumDistance;
        reason = order.reason;
        permanent = order.isPermanent;
        violations = order.violationCount;
        
        if (!permanent && block.timestamp < order.expiresAt) {
            daysRemaining = (order.expiresAt - block.timestamp) / 1 days;
        } else {
            daysRemaining = permanent ? type(uint256).max : 0;
        }
    }
    
    function getCourtHistory(address defendant) external view returns (
        uint256 totalCases,
        uint256 totalGuiltyVerdicts,
        uint256 totalFinesOwed
    ) {
        CourtProceeding[] memory cases = courtHistory[defendant];
        totalCases = cases.length;
        
        for (uint i = 0; i < cases.length; i++) {
            if (cases[i].guilty) {
                totalGuiltyVerdicts++;
                totalFinesOwed += cases[i].fine;
            }
        }
    }
    
    function generateLegalDocument(string memory documentType) external {
        require(!permanentlyBlacklisted[msg.sender], "No legal services available");
        
        uint256 docId = uint256(keccak256(abi.encodePacked(
            msg.sender, documentType, block.timestamp
        )));
        
        emit LegalDocumentGenerated(msg.sender, documentType, docId);
        
        if (violationHistory[msg.sender] > 0) {
            _recordViolation(msg.sender);
        }
    }
    
    function witnessProtectionProgram() external {
        bool hasTestified = false;
        
        for (uint i = 1; i <= caseCounter; i++) {
            WitnessTestimony[] memory testimonies = witnessTestimonies[i];
            for (uint j = 0; j < testimonies.length; j++) {
                if (testimonies[j].witness == msg.sender) {
                    hasTestified = true;
                    break;
                }
            }
        }
        
        require(hasTestified, "Must be a witness");
        
        permanentlyBlacklisted[msg.sender] = false;
    }
}`,
    formFields: []
  } as ContractTemplate
};