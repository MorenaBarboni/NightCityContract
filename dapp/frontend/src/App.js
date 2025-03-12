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
  const [showLands, setShowLands] = useState(false);

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
      setShowLands(true);
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
      console.log("Preparing transaction...");
      console.log("📌 Token URI:", tokenUri);
      console.log("📌 Price (wei):", ethers.utils.parseEther(price).toString());
      console.log("📌 District:", district);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer); // ✅ Force signer usage

      // Send transaction
      const tx = await contractWithSigner.mintLand(tokenUri, ethers.utils.parseEther(price), district);
      console.log("⏳ Transaction sent:", tx);

      await tx.wait();
      console.log("✅ Transaction confirmed:", tx.hash);

      fetchLands();
    } catch (error) {
      console.error("❌ Error minting land:", error);
      alert("Minting failed. Check console for details.");
    }
  };


  const buyLand = async (landId, price) => {
    if (!contract) return;
    try {
      const tx = await contract.buyLand(landId, { value: price });
      await tx.wait();
      fetchLands();
    } catch (error) {
      console.error("Error buying land:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>NightCity DApp</h1>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectWallet} className="fetch-button">Connect Wallet</button>
      )}

      <div className="lands-box">
        <h3>Your Lands</h3>
        <div className="land-container">
          {lands.length > 0 ? (
            lands.map((land) => (
              <div key={land.id} className="land-card">
                <p><strong>ID:</strong> {land.id.toString()}</p>
                <p><strong>Owner:</strong> {land.owner}</p>
                <p><strong>District:</strong> {land.district}</p>
                <p><strong>Price:</strong> {ethers.utils.formatEther(land.price.toString())} ETH</p>
              </div>
            ))
          ) : (
            <p className="no-land-placeholder">You do not own any land. Mint one below!</p>
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

    </div>
  );
}

export default App;
