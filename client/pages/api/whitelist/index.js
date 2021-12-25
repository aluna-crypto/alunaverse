import whitelistRepo from '../../../helpers/whitelist-repo'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' })
    return
  }

  return new Promise(resolve => {
    whitelistRepo.getSignerPublicAddress()
      .then(address => {
        res.status(200).send(address);
        resolve();
      })
      .catch(error => {
        res.status(500).json(error);
        resolve();
      })
  })
}