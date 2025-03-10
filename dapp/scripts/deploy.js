const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with:", deployer.address);

  const NightCity = await hre.ethers.getContractFactory("NightCity");
  const nightCity = await NightCity.deploy();

  await nightCity.waitForDeployment(); // ✅ Fix: Use waitForDeployment() instead of deployed()
  console.log("NightCity deployed to:", await nightCity.getAddress()); // ✅ Fix: Use getAddress()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
