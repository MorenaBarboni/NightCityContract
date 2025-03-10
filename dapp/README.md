# NightCity DApp

A **decentralized application (DApp)** for managing and trading virtual land in **NightCity**. Built using **Solidity, Hardhat, React, and Ethers.js**, this DApp allows users to:

✅ **Mint new lands** with a district and price.
✅ **Buy lands** from other users.
✅ **Connect Metamask** and interact with smart contracts.
✅ **View available lands** on the marketplace.

## 📌 Prerequisites

Ensure you have the following installed:
- **Node.js** (v16 or later) - [Download here](https://nodejs.org/)
- **Metamask** extension in your browser

## 🚀 Getting Started

### ** 1 Compile the Contract**
```sh
npx hardhat compile
```

### ** 2 Start a Local Blockchain (Hardhat Node)**
```sh
npx hardhat node
```
Keep this terminal open to simulate a blockchain locally.

### **3 Deploy the Smart Contract**
In another terminal, run:
```sh
npx hardhat run scripts/deploy.js --network localhost
```
Copy the deployed **contract address** from the output.

---
## **🌍 Frontend Setup**

### **4 Navigate to the Frontend Folder**
```sh
cd frontend
```

### *5 Install Frontend Dependencies**
```sh
npm install
```

### **6 Add Contract Address in `App.js`**
Replace `YOUR_DEPLOYED_CONTRACT_ADDRESS` with the actual contract address in `frontend/src/App.js`:
```javascript
const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### **7 Start the Frontend Server**

```sh
cd frontend
npm start
```
Your DApp should now be running on **http://localhost:3000** 🚀

---
## **💳 Connecting to Metamask**

1. Open **Metamask** and select **Localhost 8545** as your network.
2. Import a **test account** from Hardhat:
   - Open the terminal where `npx hardhat node` is running.
   - Copy one of the **private keys**.
   - In Metamask, go to **Import Account** and paste the private key.
3. Now click **Connect Wallet** in the UI to link Metamask to the DApp.

---
## **🎮 Using the DApp**

### **🌎 Mint a New Land**
1. Enter a **district name** and **price in ETH**.
2. Click **Mint Land**.
3. Confirm the transaction in Metamask.

### **🏠 Buy Land**
1. Click **Load Lands** to view available lands.
2. If a land is for sale, click **Buy Land**.
3. Confirm the purchase in Metamask.


