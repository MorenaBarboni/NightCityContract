// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NightCity is ERC721URIStorage, Ownable {

    // **This struct defines the properties of a Land**
    struct Land {
        uint256 id;
        address owner;
        uint256 price;
        bool forSale;
        address renter;
        uint256 rentExpiration;
    }

    // **Global Variables**
    uint256 public nextTokenId;
    mapping(uint256 => Land) public lands;

    // **Event Definitions**
    event LandMinted(uint256 indexed tokenId, address indexed owner);
    event LandListedForSale(uint256 indexed tokenId, uint256 price);
    event LandRented(uint256 indexed tokenId, address indexed renter, uint256 expiration);

    // **Pass token name and symbol to ERC721 constructor**
    constructor() ERC721("Night City Land", "LAND") Ownable(msg.sender) {}

    // **The mintLand function creates a new LAND NFT**
    function mintLand(string memory _tokenURI, uint256 _price) public {
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        lands[tokenId] = Land(tokenId, msg.sender, _price, false, address(0), 0);
        nextTokenId++;
        emit LandMinted(tokenId, msg.sender);
    }

    // **The listForSale function lists a LAND NFT for sale**
    function listForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not landowner");
        lands[tokenId].forSale = true;
        lands[tokenId].price = price;
        emit LandListedForSale(tokenId, price);
    }

    // **The rentLand function lists a LAND NFT for rent**
    function rentLand(uint256 tokenId, uint256 duration) public payable {
        require(lands[tokenId].forSale == false, "Land is for sale, not rent");
        require(lands[tokenId].renter == address(0) || block.timestamp > lands[tokenId].rentExpiration, "Already rented");
        lands[tokenId].renter = msg.sender;
        lands[tokenId].rentExpiration = block.timestamp + duration;
        emit LandRented(tokenId, msg.sender, lands[tokenId].rentExpiration);
    }
}
