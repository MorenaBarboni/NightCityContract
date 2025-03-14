// frontend/src/App.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./index.css";

// Smart Contract address and ABI
import NightCityData from "./NightCity.json";
const NightCityABI = NightCityData.abi;
const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

//Main App component
function App() {

  //Application state
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [lands, setLands] = useState([]);
  const [district, setDistrict] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const [price, setPrice] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [listingLandId, setListingLandId] = useState("");
  const [purchaseLandId, setPurchaseLandId] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });
    }
  }, []);

  /**
   * Allows users to connect their MetaMask wallet to the DApp, 
   * enabling interaction with the Ethereum blockchain.
   */
  const connectWallet = async () => {
    // A global object injected by MetaMask. If MetaMask is not installed, window.ethereum will be undefined.
    if (window.ethereum) {
      try {
        // Requests permission from the user to access their Ethereum accounts.
        // MetaMask displays a pop-up, asking the user to approve access.        
        // await ...

        // This method prompts the user to connect their MetaMask account if they haven't already.
        // Returns an array of Ethereum addresses associated with the wallet.
        // The first address in the array (accounts[0]) is usually the default account.
        // const accounts ...

        //Updates the React state with the connected Ethereum address
        // The frontend needs to display the wallet address.
        // setAccount(...).
      } catch (error) {
        console.error("Error connecting to Metamask:", error);
      }
    } else {
      alert("Please install Metamask.");
    }
  };

  /**
   * Initializing the Smart Contract
   * useEffect is a React Hook that runs side effects in functional components.
   * It is used for handling async task and interacting with external systems (like MetaMask and smart contracts).
   * This useEffect runs every time account changes (i.e., when the user connects a wallet).
   */
  useEffect(() => {

    if (window.ethereum && account) {

      //Creates a provider to interact and read from the Ethereum blockchain
      //The provider connects the frontend to the blockchain, allowing smart contract calls.
      // const provider = ...

      //provider.getSigner() retrieves the connected user's Ethereum account.
      // A signer is required to send transactions from the user’s wallet.
      // const signer = ...

      //Creates a connection to the smart contract. Uses: 
      // CONTRACT_ADDRESS → The deployed smart contract's address.
      // NightCityABI → The ABI (Application Binary Interface) that defines the contract's functions.
      // signer → Allows the user to interact with the contract using their wallet.
      // const contractInstance = ...

      //Set the contract state
      // setContract(... );
    }
  }, [account]);

  /**
  * Fetch the Land data from the Smart Contract
  */
  const fetchLands = async () => {
    if (!contract) {
      console.error("Contract not initialized");
      return;
    }
    try {
      //Calls nextTokenId() to get the total number of lands
      // const totalLands = ...

      let landList = [];

      //Loops through each land 
      for (let i = 0; i < totalLands; i++) {

        //Fetch the details of a Land from the lands mapping                                         
        const land = await contract.lands(i);
        //Store land details in a list                          
        landList.push({ id: i, ...land });
      }

      //Store land details in state
      //setLands(...);
    }
    catch (error) {
      console.error("Error fetching lands:", error);
    }
  };

  /**
 * Mint a new Land with the smart contract
 */
  const mintLand = async () => {
    if (!contract || !tokenUri || !district || !price) {
      console.error("❌ Missing input values:", { tokenUri, district, price });
      alert("Please enter valid values for Token URI, District, and Price");
      return;
    }

    try {
      //The provider connects the frontend to Ethereum, allowing smart contract calls.
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Connect the signer to the smart contract
      const signer = provider.getSigner();

      // Returns a new instance of the Contract, but connected to providerOrSigner.
      //By passing in a Signer. this will return a Contract which will act on behalf of that signer.
      //const contractWithSigner = ...

      // A transaction request describes a transaction that is to be sent to the network or otherwise processed.
      // const tx = ...
      console.log("⏳ Transaction sent:", tx);

      //Resolves to the TransactionReceipt once the transaction has been included in the chain.
      await tx.wait();
      console.log("✅ Transaction confirmed:", tx.hash);
      alert(`✅ Land minted successfully!`);

      //Reload lands
      fetchLands();

    } catch (error) {
      console.error("❌ Error minting land:", error);
      alert("Minting failed.");
    }
  };

  /**
   * List an existing Land for sale
   */
  const listForSale = async () => {
    if (!contract || !listingLandId || !listingPrice) {
      alert("Enter a valid Land ID and Price to list for sale");
      return;
    }
    try {
       const priceInWei = ethers.utils.parseEther(listingPrice);
      // Send transaction
      //const tx = ...
      console.log("⏳ Transaction sent:", tx);

      await tx.wait();

      console.log("✅ Land listed for sale successfully!");
      alert("✅ Land listed for sale successfully!");

      fetchLands();
    } catch (error) {
      console.error("❌ Error listing land for sale:", error);
      alert("Failed to list land for sale.");
    }
  };

  /**
   * Buy a Land
   */
  const buyLand = async () => {
    if (!contract || !purchaseLandId) return;

    try {
      // Fetch the details of the Land to be bought
      //const landDetails =  ...
      // Get Land price
      //const landPrice =  ...

      console.log(`Buying land ID ${purchaseLandId} for ${ethers.utils.formatEther(landPrice)} ETH`);

      // Send the correct amount when purchasing
      // const tx =  ...
      console.log("⏳ Transaction sent:", tx);

      await tx.wait();
      fetchLands();

      console.log(`Land ${purchaseLandId} purchased successfully!`);
      alert(`Land ${purchaseLandId} purchased successfully!`);

    } catch (error) {
      console.error("Error buying land:", error);
      alert("Error buying land:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>NightCity DApp</h1>
      {account ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/avatar.png"  // Replace with your image URL
            alt="Avatar"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
          <p>WELCOME : {account}</p>
        </div>
      ) : (
        <button onClick={connectWallet} className="fetch-button">Connect Wallet</button>
      )}

      <div className="lands-box">
        <h3>NightCity Lands</h3>
        <div className="land-container">
          {lands.length > 0 ? (
            lands.map((land) => (
              <div key={land.id} className="land-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p><strong>ID:</strong> {land.id.toString()}</p>
                  <img
                    src="/land.png"
                    alt="Land Icon"
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
                <p><strong>Owner:</strong> {land.owner}</p>
                <p><strong>District:</strong> {land.district}</p>
                <p><strong>For Sale:</strong> {land.forSale ? "Yes" : "No"}</p>
                <p><strong>Price:</strong> {ethers.utils.formatEther(land.price.toString())} ETH</p>
              </div>
            ))
          ) : (
            <p className="no-land-placeholder">There are not Lands. Mint one below!</p>
          )}
        </div>
        <button onClick={fetchLands} className="fetch-button">Refresh</button>
      </div>

      <div className="mint-container">
        <h3>Mint New Land</h3>
        <input type="text" placeholder="TokenURI" value={tokenUri} onChange={(e) => setTokenUri(e.target.value)} />
        <input type="text" placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
        <input type="text" placeholder="Price in ETH" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button onClick={mintLand} className="mint-button">Mint Land</button>
      </div>

      <div className="list-sale-container">
        <h3>List Land for Sale</h3>
        <input
          type="text"
          placeholder="Enter Land ID"
          value={listingLandId}
          onChange={(e) => setListingLandId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Listing Price in ETH"
          value={listingPrice}
          onChange={(e) => setListingPrice(e.target.value)}
        />
        <button onClick={listForSale} className="mint-button">List for Sale</button>
      </div>

      <div className="buy-land-container">
        <h3>Buy a Land</h3>
        <input
          type="text"
          placeholder="Enter Land ID"
          value={purchaseLandId}
          onChange={(e) => setPurchaseLandId(e.target.value)}
        />
        <button onClick={buyLand} className="mint-button">Buy Land</button>
      </div>

    </div>
  );
}

export default App;
