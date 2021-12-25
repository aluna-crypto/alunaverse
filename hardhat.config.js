require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require('hardhat-docgen');

module.exports = {
  solidity: {
    version: "0.8.8",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: process.env.RINKEBY_API_URI,
      accounts: [process.env.RINKEBY_ACCOUNT_PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.MAINNET_API_URI,
      accounts: [process.env.MAINNET_ACCOUNT_PRIVATE_KEY],
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0, // first account
    },
  },
  docgen: {
    path: './client/public/docgen',
    clear: true,
    runOnCompile: true,
  }
};
 