# NeoArena MVP

A decentralized gaming platform featuring skill-based quizzes with crypto rewards on Sepolia testnet.

## 🚀 Features

- **Time-Based Quiz**: 60-second countdown with 5-second bonuses for correct answers
- **Smart Contract Integration**: Autonomous reward distribution (0.05 ETH for perfect scores)
- **One-Time Claims**: Each wallet address can only claim rewards once
- **Instant Payouts**: Automatic ETH transfer upon perfect score verification
- **Modern UI**: Neon-themed interface with real-time feedback

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Web3**: Ethers.js v5
- **Smart Contract**: Solidity ^0.8.20

## 📋 Smart Contract

**Address**: `0x40C680b4Ed27655FA5414eBa2103aE2231d126ea`
**Network**: Sepolia Testnet
**Reward**: 0.05 ETH per perfect score

### Contract Features
- Autonomous operation (no admin required)
- On-chain answer verification
- Anti-replay protection
- Gas-optimized design

## 🎮 How to Play

1. **Connect Wallet**: MetaMask on Sepolia testnet
2. **Start Quiz**: 10 general knowledge questions
3. **Race Against Time**: 60 seconds + bonuses for correct answers
4. **Perfect Score**: Get all 10 questions right
5. **Claim Reward**: Automatic 0.05 ETH payout

## 🚀 Quick Start

### Prerequisites
- MetaMask browser extension
- Sepolia testnet ETH for gas fees
- Modern web browser

### Run Locally
```bash
# Clone the repository
git clone https://github.com/Neepurna/NeoArena.git
cd NeoArena

# Start local server
python3 -m http.server 5173
# or
python3 serve.py

# Open in browser
http://localhost:5173/quiz.html
```

## 📁 Project Structure

```
neoarena-mvp/
├── index.html          # Landing page
├── home.html           # Game selection
├── quiz.html           # Quiz interface
├── quiz.js             # Quiz logic + Web3 integration
├── general.js          # Wallet connection utilities
├── style.css           # Neon-themed UI styles
├── serve.py            # Development server
├── DEPLOYMENT_GUIDE.md # Smart contract deployment
└── assets/
    └── background.png  # Hero background
```

## 🔗 Smart Contract Integration

The quiz automatically submits answers to the smart contract when a perfect score is achieved:

```javascript
// Correct answers array for contract verification
const correctAnswers = [2,1,1,1,1,1,1,2,1,2];

// Automatic submission on perfect score
await quizContract.submitAnswers(correctAnswers);
```

## 🧪 Testing

### End-to-End Test
1. Load `quiz.html` in browser
2. Connect MetaMask (Sepolia)
3. Complete quiz with perfect score
4. Confirm MetaMask transaction
5. Receive 0.05 ETH reward

### Smart Contract Testing
Use Remix IDE with contract address and submit:
```
[2,1,1,1,1,1,1,2,1,2]
```

## 🛡️ Security Features

- **One-time claims**: Prevents double-spending
- **Perfect score requirement**: Only 100% accuracy gets rewarded
- **Gas optimization**: Minimal transaction costs
- **Transparent verification**: All logic on-chain

## 🎯 Quiz Questions

1. Capital of France → Paris (index 2)
2. Author of Romeo & Juliet → Shakespeare (index 1)
3. The Red Planet → Mars (index 1)
4. Titanic sinking year → 1912 (index 1)
5. Largest mammal → Blue Whale (index 1)
6. Mona Lisa painter → Leonardo da Vinci (index 1)
7. Chemical symbol "O" → Oxygen (index 1)
8. Smallest prime number → 2 (index 2)
9. Amazon Rainforest continent → South America (index 1)
10. Gas plants absorb → Carbon dioxide (index 2)

## 📊 Game Mechanics

- **Base Time**: 60 seconds
- **Time Bonus**: +5 seconds per correct answer
- **Scoring**: Must achieve 10/10 for reward
- **Progression**: Questions appear sequentially
- **Auto-advance**: Click answer to proceed

## 🔮 Future Features

- [ ] Multiple quiz categories
- [ ] Tournament brackets
- [ ] NFT achievements
- [ ] Leaderboards
- [ ] Social challenges
- [ ] Custom quiz creation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/Neepurna/NeoArena/issues)
- **Contract**: [Sepolia Etherscan](https://sepolia.etherscan.io/address/0x40C680b4Ed27655FA5414eBa2103aE2231d126ea)

## 🎨 Design Philosophy

NeoArena combines the excitement of competitive gaming with the transparency and rewards of blockchain technology. Every interaction is designed to be fast, fair, and rewarding for skilled players.

---

**Built with ❤️ for the decentralized gaming community**
