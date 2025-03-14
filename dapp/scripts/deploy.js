// Import the Hardhat Runtime Environment (hre) which provides access to Hardhat's built-in functionality
const hre = require("hardhat");

// Define an asynchronous function to handle the deployment process
async function main() {
  // Retrieve the list of signers (accounts) from the Hardhat environment
  // Here, we extract the first account, which will be used as the deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with:", deployer.address);

  // Retrieve the contract factory for "NightCity", which allows us to deploy a new instance of it
  // A ContractFactory is an abstraction, a blueprint used to deploy new instances of a smart contract.
  const NightCity = await hre.ethers.getContractFactory("NightCity");

  // Deploy a new instance of the "NightCity" contract
  const nightCity = await NightCity.deploy();

  // Wait for the deployment process to be completed
  await nightCity.waitForDeployment();
  console.log("NightCity deployed to:", await nightCity.getAddress());
}

// Execute the main function and handle any potential errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });