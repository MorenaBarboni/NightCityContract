// frontend/src/App.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import NightCityData from "./NightCity.json";
import "./index.css";

const NightCityABI = NightCityData.abi;
const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

function App() {
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

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to Metamask:", error);
      }
    } else {
      alert("Please install Metamask.");
    }
  };

  useEffect(() => {
    if (window.ethereum && account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, NightCityABI, signer);
      setContract(contractInstance);
    }
  }, [account]);

  const fetchLands = async () => {
    if (!contract) {
      console.error("❌ Contract not initialized");
      return;
    }
    try {
      const totalLands = await contract.nextTokenId();
      let landList = [];
      for (let i = 0; i < totalLands; i++) {
        const land = await contract.lands(i);
        landList.push({ id: i, ...land });
      }
      setLands(landList);
      //setShowLands(true);
    } catch (error) {
      console.error("❌ Error fetching lands:", error);
    }
  };


  const mintLand = async () => {
    if (!contract || !tokenUri || !district || !price) {
      console.error("❌ Missing input values:", { tokenUri, district, price });
      alert("Please enter valid values for Token URI, District, and Price");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer); // ✅ Force signer usage

      // Send transaction
      const tx = await contractWithSigner.mintLand(tokenUri, ethers.utils.parseEther(price), district);
      console.log("⏳ Transaction sent:", tx);

      await tx.wait();
      console.log("✅ Transaction confirmed:", tx.hash);
      alert(`✅ Land minted successfully!`);
      fetchLands();
    } catch (error) {
      console.error("❌ Error minting land:", error);
      alert("Minting failed.");
    }
  };

  const listForSale = async () => {
    if (!contract || !listingLandId || !listingPrice) {
      alert("Enter a valid Land ID and Price to list for sale");
      return;
    }
    try {
      const priceInWei = ethers.utils.parseEther(listingPrice);
      const tx = await contract.listForSale(listingLandId, priceInWei);
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

  const buyLand = async () => {
    if (!contract || !purchaseLandId) return;

    try {
      // Fetch the price from the contract
      const landDetails = await contract.lands(purchaseLandId);
      const landPrice = landDetails.price.toString(); // Price is in Wei

      console.log(`Buying land ID ${purchaseLandId} for ${ethers.utils.formatEther(landPrice)} ETH`);

      // Send the correct amount when purchasing
      const tx = await contract.buyLand(purchaseLandId, {
        value: landPrice,  // Dynamically set based on the contract
        gasLimit: 10000000  // Adjust if needed
      });
      console.log("⏳ Transaction sent:", tx);

      await tx.wait();
      fetchLands();

      console.log(`✅ Land ${purchaseLandId} purchased successfully!`);
      alert(`✅ Land ${purchaseLandId} purchased successfully!`);

    } catch (error) {
      console.error("❌ Error buying land:", error);
      alert("❌ Error buying land:", error);
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
