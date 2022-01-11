const { ethers } = require('ethers')
const whitelist = require('./whitelist.json')
const contractAddresses = require('../contracts/contract-address.json')

const networkNames = {
  1: "mainnet",
  4: "rinkeby",
  1337: "localhost"
}

const domain = {
  name:"AlunaverseMinter",
  version:"1",
  chainId:0,
  verifyingContract:null
};

const types = {
  whitelistMint:[
    {name:"buyer",type:"address"},
    {name:"tokenId",type:"uint256"},
    {name:"limit",type:"uint256"}
  ],
};

const getApprovedAmount = (address) => {
  if (address in whitelist) return whitelist[address];
  if (address.toLowerCase() in whitelist) return whitelist[address.toLowerCase()];
  return 0;
}

const WhitelistRepo = {
  getSignerPublicAddress() {
    return Promise.resolve(signer?.address ?? "SIGNER NOT CONFIGURED");
  },
  
  async getCalldataForAddress(address, tokenId, chainId) {
    const signer = process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY == null ? null : new ethers.Wallet(process.env.NEXT_PUBLIC_SIGNER_PRIVATE_KEY)
    
    if (!ethers.utils.isAddress(address)) {
      throw new Error(`${address} is not a valid Ethereum address.`)
    }
    
    let checksumAddress = ethers.utils.getAddress(address);

    let approvedAmount = getApprovedAmount(checksumAddress);

    if (approvedAmount > 0) {
      let dataForSigning = {
        buyer: checksumAddress,
        tokenId: ethers.BigNumber.from(tokenId),
        limit: approvedAmount
      };
      
      domain.chainId = chainId;

      let networkName = networkNames[chainId];
      let address = contractAddresses[networkName]?.AlunaverseMinter;

      domain.verifyingContract = address;

      return signer
        ._signTypedData(domain, types, dataForSigning)
        .then(signature => ({ success: true, whitelisted: true, signature: signature, limit: dataForSigning.limit }))
        .catch(error => ({success: false, whitelisted: true, error: error}));
    } else {
      return Promise.resolve({ success: true, whitelisted: false, message: `Address ${address} is not on the whitelist`, limit: 0 });
    }
  }
};

module.exports = WhitelistRepo;


