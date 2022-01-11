import { ethers } from 'ethers'

export default function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider, 'any')
  library.pollingInterval = 12000
  return library
}
