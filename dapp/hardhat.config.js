require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      gas: 10000000, // High gas limit to prevent out-of-gas errors
      gasPrice: 200, // Set a reasonable gas price
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
  },
};
