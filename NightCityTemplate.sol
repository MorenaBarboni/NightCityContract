// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// **Import ERC721**
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NightCity is ERC721URIStorage, Ownable {
    
    // **This struct defines the properties of a Land**
    struct Land {
       
    }

    // **Global Variables will go here ...**


    // **Event Definitions will go here ...**


    // **The contract constructor defines the token name and symbol of the Land NFT**
    constructor() ERC721("Night City Land", "LAND") Ownable(msg.sender) {}

    // **The mintLand function creates a new LAND NFT**
    function mintLand(string memory _tokenURI, uint256 _price) public {
       
    }

    // **The listForSale function lists a LAND NFT for sale**
    function listForSale(uint256 tokenId, uint256 price) public {
       
    }

    // **The rentLand function lists a LAND NFT for rent**
    function rentLand(uint256 tokenId, uint256 duration) public payable {
       
    }
}
