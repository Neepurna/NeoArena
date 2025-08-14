# NeoArena Smart Contract Deployment Guide

## Overview
This guide explains how to deploy and configure the NeoArenaQuiz smart contract for autonomous reward distribution.

## Smart Contract Features
- **Autonomous Operation**: No admin needed for reward distribution
- **Fixed Reward**: 0.5 Sepolia ETH per perfect score
- **One-time Claim**: Each wallet address can only claim once
- **On-chain Verification**: Answers are verified against stored correct answers

## Deployment Steps

### 1. Deploy the Contract
```solidity
// File: NeoArenaQuiz.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NeoArenaQuiz {
    uint256 public constant REWARD = 0.5 ether;
    uint8[10] private correctAnswers;
    mapping(address => bool) public hasClaimed;

    constructor() {
        correctAnswers = [2, 1, 1, 1, 1, 1, 1, 2, 1, 2];
    }

    receive() external payable {}

    function submitAnswers(uint8[10] calldata userAnswers) external {
        require(!hasClaimed[msg.sender], "NeoArenaQuiz: reward already claimed");
        for (uint256 i = 0; i < userAnswers.length; i++) {
            require(userAnswers[i] == correctAnswers[i], "NeoArenaQuiz: incorrect answers");
        }
        hasClaimed[msg.sender] = true;
        require(address(this).balance >= REWARD, "NeoArenaQuiz: insufficient contract balance");
        (bool sent, ) = payable(msg.sender).call{value: REWARD}("");
        require(sent, "NeoArenaQuiz: reward transfer failed");
    }
}
```

### 2. Fund the Contract
After deployment, send Sepolia ETH to the contract address to fund rewards:
```bash
# Example: Fund with 10 ETH to support 20 perfect scores
# Send ETH directly to the contract address
```

### 3. Configure Frontend
Update `quiz.js` with the deployed contract address:
```javascript
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'; // Replace this line
```

## Answer Key (for reference)
The smart contract stores these correct answers:
1. What is the capital of France? → **Paris** (index 2)
2. Who wrote "Romeo and Juliet"? → **William Shakespeare** (index 1)
3. Which planet is the Red Planet? → **Mars** (index 1)
4. When did the Titanic sink? → **1912** (index 1)
5. What is the largest mammal? → **Blue Whale** (index 1)
6. Who painted the Mona Lisa? → **Leonardo da Vinci** (index 1)
7. Element with symbol "O"? → **Oxygen** (index 1)
8. Smallest prime number? → **2** (index 2)
9. Amazon Rainforest continent? → **South America** (index 1)
10. Gas plants absorb? → **Carbon dioxide** (index 2)

## Deployment Commands (using Remix or Hardhat)

### Using Remix IDE
1. Go to remix.ethereum.org
2. Create new file: `NeoArenaQuiz.sol`
3. Paste the contract code
4. Compile with Solidity 0.8.20+
5. Deploy to Sepolia testnet
6. Fund the contract with ETH
7. Copy contract address to `quiz.js`

### Using Hardhat
```bash
npx hardhat create basic
# Add contract to contracts/ folder
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

## Testing
1. Deploy contract on Sepolia testnet
2. Fund contract with test ETH
3. Update frontend with contract address
4. Test with perfect score (should receive 0.5 ETH)
5. Test with incorrect answers (should fail)
6. Test duplicate claim attempt (should fail)

## Security Considerations
- Contract is immutable once deployed
- Correct answers are stored on-chain (visible to anyone)
- Each address can only claim once
- Contract must be sufficiently funded before users start playing
- No admin functions - fully autonomous operation

## Gas Optimization
- Fixed array size for answers (exactly 10 questions)
- Minimal storage operations
- Efficient verification loop

## Monitoring
- Check contract balance regularly
- Monitor successful claims
- Track failed transactions for debugging
