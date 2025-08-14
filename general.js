/*
 * General utility functions for NeoArena. Handles wallet connection and
 * session management. Storing the wallet address in localStorage is a
 * lightweight way to remember whether the user has authenticated across
 * pages. If no wallet is present, we redirect back to the landing page.
 */

async function connectWallet() {
  // Check if MetaMask or any Ethereum provider is available
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed. Please install it to connect.');
    return;
  }
  try {
    // Request accounts from the provider. This will prompt the user for
    // permission if they haven't already connected the site.
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];
    // Persist the address so subsequent pages can check for a logged in user
    localStorage.setItem('walletAddress', address);

    // Optionally ensure the user is on Sepolia. The chain ID for Sepolia is 0xaa36a7.
    const currentChain = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentChain !== '0xaa36a7') {
      try {
        // Attempt to switch to Sepolia if available in the wallet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (switchError) {
        // If Sepolia isn't added to MetaMask, request the user to add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'Sepolia Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          });
        } catch (addError) {
          console.error('Unable to add Sepolia network', addError);
        }
      }
    }

    // Redirect to the home page after successful connection
    window.location.href = 'home.html';
  } catch (error) {
    console.error('Error connecting wallet', error);
  }
}

function checkWallet() {
  // If there is no stored address, send the user back to the landing page.
  const address = localStorage.getItem('walletAddress');
  if (!address) {
    window.location.href = 'index.html';
  }
}