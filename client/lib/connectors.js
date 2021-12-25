import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

const POLLING_INTERVAL = 12000
const RPC_URLS = {
  1: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
}

export const injected = new InjectedConnector({ supportedChainIds: [1, 4] });

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  supportedChainIds: [1],
  chainId: 1,
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'Alunaverse',
  supportedChainIds: [1]
})