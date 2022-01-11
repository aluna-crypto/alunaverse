import whitelistRepo from '../../../helpers/whitelist-repo'

export default async function handler(req, res) {
  const { address, tokenId, chainId } = req.query
  
  return new Promise(resolve => {
    whitelistRepo.getCalldataForAddress(address, tokenId, chainId)
      .then(data => {
        res.status(200).json(data);
        resolve();
      })
      .catch(error => {
        res.status(400).json(error);
        resolve();
      });
  })
}