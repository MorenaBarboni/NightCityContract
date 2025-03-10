// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NightCity is ERC721URIStorage, Ownable {
    // **Land Structure**
    struct Land {
        uint256 id;
        address owner;npx
        uint256 price;
        bool forSale;
        address renter;
        uint256 rentExpiration;
        string district;
    }

    struct Proposal {
        uint256 id;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 expirationTime;
        bool executed;
        bool accepted;
    }

    // **Global Variables**
    uint256 public nextTokenId;
    uint256 public nextProposalId;

    mapping(uint256 => Land) public lands;
    mapping(address => uint256) public reputationPoints;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted; // Tracks if a user voted on a proposal

    // **Events**
    event LandMinted(uint256 indexed tokenId, address indexed minter, string district);
    event LandListedForSale(uint256 indexed tokenId, uint256 price);
    event LandRented( uint256 indexed tokenId,address indexed renter, uint256 expiration);
    event ReputationIncreased(address indexed user, uint256 newReputation);
    event ProposalCreated(uint256 indexed proposalId, string description, uint256 expirationTime);
    event ProposalVoted(uint256 indexed proposalId, address indexed voter, bool inFavor);
    event ProposalExecuted(uint256 indexed proposalId, bool accepted);

    constructor() ERC721("Night City Land", "LAND") Ownable(msg.sender) {}

    // **Mint Land with District Assignment**
    function mintLand(string memory _tokenURI, uint256 _price,string memory _district) public {
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        lands[tokenId] = Land( tokenId, msg.sender,_price, false,  address(0), 0, _district );
        nextTokenId++;

        increaseReputation(msg.sender, 10); // Reward for minting land

        emit LandMinted(tokenId, msg.sender, _district);
    }

    // **List Land for Sale**
    function listForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not the landowner");
        lands[tokenId].forSale = true;
        lands[tokenId].price = price;
        emit LandListedForSale(tokenId, price);
    }

    // **Rent Land**
    function rentLand(uint256 tokenId, uint256 duration) public payable {
        require(lands[tokenId].forSale == false, "Land is for sale, not rent");
        require(
            lands[tokenId].renter == address(0) ||
                block.timestamp > lands[tokenId].rentExpiration,
            "Already rented"
        );

        lands[tokenId].renter = msg.sender;
        lands[tokenId].rentExpiration = block.timestamp + duration;

        increaseReputation(msg.sender, 5); // Reward for engaging in the metaverse

        emit LandRented(tokenId, msg.sender, lands[tokenId].rentExpiration);
    }

    // **Increase Reputation**
    function increaseReputation(address user, uint256 points) internal {
        reputationPoints[user] += points;
        emit ReputationIncreased(user, reputationPoints[user]);
    }

    // **Create a New Proposal**
    function createProposal(string memory description, uint256 duration) public {
        proposals[nextProposalId] = Proposal(
        nextProposalId, description, 0, 0, block.timestamp + duration,false, false);

        nextProposalId++;
        emit ProposalCreated(nextProposalId, description, proposals[nextProposalId].expirationTime);
    }

    // **Vote on a Proposal**
    function voteProposal(uint256 proposalId, bool inFavor) public {
        require(balanceOf(msg.sender) > 0, "Only landowners can vote");
        require(!hasVoted[proposalId][msg.sender],"You have already voted on this proposal");
        require(block.timestamp <= proposals[proposalId].expirationTime, "Voting period has ended");

        if (inFavor) {
            proposals[proposalId].yesVotes++;
        } else {
            proposals[proposalId].noVotes++;
        }

        hasVoted[proposalId][msg.sender] = true;
        increaseReputation(msg.sender, 2); // Encourage participation

        emit ProposalVoted(proposalId, msg.sender, inFavor);
    }

// **Execute Proposal (Only After Expiration)**
    function executeProposal(uint256 proposalId) public onlyOwner {
        require(!proposals[proposalId].executed, "Already executed");
        require(block.timestamp > proposals[proposalId].expirationTime, "Voting period has not ended yet");
        require(proposals[proposalId].yesVotes > 0 || proposals[proposalId].noVotes > 0, "No votes on this proposal");

        if (proposals[proposalId].yesVotes > proposals[proposalId].noVotes) {
            proposals[proposalId].accepted = true; // Mark as accepted
        } else {
            proposals[proposalId].accepted = false; // Mark as rejected
        }

        proposals[proposalId].executed = true;
        emit ProposalExecuted(proposalId, proposals[proposalId].accepted);
    }
}
