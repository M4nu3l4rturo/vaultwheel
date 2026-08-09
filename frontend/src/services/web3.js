export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined'
}

export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    return { error: 'MetaMask not installed. Your NFTs are stored in the VaultWheel custodial wallet.' }
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    return { address: accounts[0] }
  } catch (e) {
    return { error: e.message }
  }
}

export const getPolygonAmoyExplorerUrl = (txHash) => {
  return `https://amoy.polygonscan.com/tx/${txHash}`
}

export const isRealTxHash = (txHash) => {
  // Demo tx hashes start with 0x but are not real
  // Real ones are 66 chars (0x + 64 hex chars)
  return txHash && txHash.length === 66 && !txHash.startsWith('0x000')
}
