/*
 * Quiz logic for the Quiz Royale page. This script handles rendering the
 * questions one by one with a timer, capturing user selections, evaluating results, and displaying
 * feedback. Features a 60-second timer with 5-second bonus for correct answers.
 */

(function() {
  // Array of 10 general knowledge questions with options and correct answer index.
  const questions = [
    {
      question: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      answer: 2,
    },
    {
      question: 'Who wrote the play "Romeo and Juliet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
      answer: 1,
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      answer: 1,
    },
    {
      question: 'In what year did the Titanic sink?',
      options: ['1905', '1912', '1918', '1920'],
      answer: 1,
    },
    {
      question: 'What is the largest mammal?',
      options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
      answer: 1,
    },
    {
      question: 'Who painted the Mona Lisa?',
      options: ['Pablo Picasso', 'Leonardo da Vinci', 'Vincent van Gogh', 'Claude Monet'],
      answer: 1,
    },
    {
      question: 'Which element has the chemical symbol "O"?',
      options: ['Gold', 'Oxygen', 'Osmium', 'Oganesson'],
      answer: 1,
    },
    {
      question: 'What is the smallest prime number?',
      options: ['0', '1', '2', '3'],
      answer: 2,
    },
    {
      question: 'In which continent is the Amazon Rainforest located?',
      options: ['Africa', 'South America', 'Asia', 'Australia'],
      answer: 1,
    },
    {
      question: 'What gas do plants absorb from the atmosphere?',
      options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
      answer: 2,
    },
  ];

  // Game state variables
  let currentQuestionIndex = 0;
  let timeRemaining = 60; // 60 seconds base time
  let timerInterval;
  let correctAnswers = 0;
  let userAnswers = [];
  let gameActive = false;

  const startBtn = document.getElementById('startQuizBtn');
  const quizContainer = document.getElementById('quizContainer');
  const quizForm = document.getElementById('quizForm');
  const submitBtn = document.getElementById('submitBtn');
  const resultsDiv = document.getElementById('results');

  // Create timer display element
  function createTimerDisplay() {
    const timerDiv = document.createElement('div');
    timerDiv.id = 'timerDisplay';
    timerDiv.style.cssText = `
      font-size: 2rem;
      font-family: 'Orbitron', sans-serif;
      color: var(--primary-color);
      text-align: center;
      margin-bottom: 1rem;
      text-shadow: 0 0 10px var(--primary-color);
    `;
    return timerDiv;
  }

  // Create question counter display
  function createQuestionCounter() {
    const counterDiv = document.createElement('div');
    counterDiv.id = 'questionCounter';
    counterDiv.style.cssText = `
      font-size: 1.2rem;
      font-family: 'Orbitron', sans-serif;
      color: var(--secondary-color);
      text-align: center;
      margin-bottom: 1rem;
    `;
    return counterDiv;
  }

  // Update timer display
  function updateTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
      timerDisplay.textContent = `Time: ${timeRemaining}s`;
      
      // Change color based on time remaining
      if (timeRemaining <= 10) {
        timerDisplay.style.color = '#ff4444';
        timerDisplay.style.textShadow = '0 0 10px #ff4444';
      } else if (timeRemaining <= 30) {
        timerDisplay.style.color = '#ffaa00';
        timerDisplay.style.textShadow = '0 0 10px #ffaa00';
      }
    }
  }

  // Update question counter
  function updateQuestionCounter() {
    const counterDisplay = document.getElementById('questionCounter');
    if (counterDisplay) {
      counterDisplay.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length} | Correct: ${correctAnswers}`;
    }
  }

  // Start the timer
  function startTimer() {
    timerInterval = setInterval(() => {
      timeRemaining--;
      updateTimer();
      updateDebugPanel();
      
      if (timeRemaining <= 0) {
        endGame();
      }
    }, 1000);
  }

  // Stop the timer
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // Render a single question
  function loadCurrentQuestion() {
    console.log(`🔍 loadCurrentQuestion called - Index ${currentQuestionIndex}/${questions.length}`);
    
    if (currentQuestionIndex >= questions.length) {
      console.log('✅ All questions completed, ending game');
      endGame();
      return;
    }

    console.log(`📋 Loading question ${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].question}`);

    const question = questions[currentQuestionIndex];
    quizForm.innerHTML = '';

    // Add timer display
    if (!document.getElementById('timerDisplay')) {
      quizForm.appendChild(createTimerDisplay());
    }

    // Add question counter
    if (!document.getElementById('questionCounter')) {
      quizForm.appendChild(createQuestionCounter());
    }

    updateTimer();
    updateQuestionCounter();

    // Create question card
    const div = document.createElement('div');
    div.className = 'question-card';

    const h4 = document.createElement('h4');
    h4.textContent = question.question;
    div.appendChild(h4);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    
    question.options.forEach((opt, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'currentQuestion';
      input.value = index;
      const span = document.createElement('span');
      span.textContent = opt;
      label.appendChild(input);
      label.appendChild(span);
      
      // Click handler removed to prevent double submission
      
      optionsDiv.appendChild(label);
    });
    
    div.appendChild(optionsDiv);
    quizForm.appendChild(div);

    // Update submit button text and show it
    if (currentQuestionIndex === questions.length - 1) {
      submitBtn.textContent = 'Finish Quiz';
    } else {
      submitBtn.textContent = 'Next Question';
    }
    submitBtn.style.display = 'inline-block'; // Always show submit button
  }

  // Submit current answer and move to next question
  function submitCurrentAnswer() {
    console.log(`🔍 submitCurrentAnswer called - Question ${currentQuestionIndex + 1}, gameActive: ${gameActive}`);
    
    if (!gameActive) {
      console.log('❌ Game not active, returning');
      return;
    }
    
    // Prevent multiple submissions for the same question
    if (document.getElementById('submitBtn').disabled) {
      console.log('❌ Submit button disabled, returning');
      return;
    }
    
    console.log('✅ Processing answer submission...');
    document.getElementById('submitBtn').disabled = true;

    const selected = document.querySelector('input[name="currentQuestion"]:checked');
    if (!selected) {
      alert('Please select an answer before proceeding.');
      document.getElementById('submitBtn').disabled = false;
      return;
    }
    
    let selectedValue = parseInt(selected.value);
    
    // Test mode: automatically select correct answer
    if (testMode) {
      selectedValue = questions[currentQuestionIndex].answer;
      console.log(`🧪 Test mode: Auto-selecting correct answer ${selectedValue}`);
    }
    
    console.log(`Question ${currentQuestionIndex + 1}: User selected ${selectedValue}, correct answer is ${questions[currentQuestionIndex].answer}`);
    
    userAnswers.push(selectedValue);
    
    // Check if answer is correct
    const isCorrect = selectedValue === questions[currentQuestionIndex].answer;
    if (isCorrect) {
      correctAnswers++;
      timeRemaining += 5; // Add 5 seconds for correct answer
      console.log('Correct answer! Time bonus added.');
      
      // Show brief feedback
      showAnswerFeedback(true);
    } else {
      console.log('Incorrect answer.');
      showAnswerFeedback(false);
    }
    
    currentQuestionIndex++;
    updateDebugPanel();
    
    // Move to next question after brief delay
    setTimeout(() => {
      loadCurrentQuestion();
      // Re-enable submit button for next question
      if (document.getElementById('submitBtn')) {
        document.getElementById('submitBtn').disabled = false;
      }
    }, 1000);
  }

  // Show brief answer feedback
  function showAnswerFeedback(isCorrect) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 1rem 2rem;
      border-radius: 10px;
      font-size: 1.2rem;
      font-weight: bold;
      z-index: 1000;
      text-align: center;
    `;
    
    if (isCorrect) {
      feedbackDiv.textContent = '✓ Correct! +5 seconds';
      feedbackDiv.style.backgroundColor = 'rgba(0, 225, 255, 0.9)';
      feedbackDiv.style.color = '#0a0e23';
    } else {
      feedbackDiv.textContent = '✗ Incorrect';
      feedbackDiv.style.backgroundColor = 'rgba(255, 68, 68, 0.9)';
      feedbackDiv.style.color = '#ffffff';
    }
    
    document.body.appendChild(feedbackDiv);
    
    setTimeout(() => {
      document.body.removeChild(feedbackDiv);
    }, 800);
  }

  // End the game
  // End the game
  async function endGame() {
    stopTimer();
    gameActive = false;
    
    console.log('Game ended!');
    console.log('Total user answers:', userAnswers.length);
    console.log('User answers:', userAnswers);
    console.log('Correct answers count:', correctAnswers);
    console.log('Questions length:', questions.length);
    
    // Calculate final score
    const totalQuestions = userAnswers.length;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    quizForm.innerHTML = '';
    submitBtn.style.display = 'none';
    
    // Display final results
    let resultMessage = '';
    if (correctAnswers === questions.length) {
      resultMessage = '🎉 Perfect Score! You answered all questions correctly!';
      console.log('Perfect score achieved! Will attempt blockchain submission...');
    } else if (percentage >= 80) {
      resultMessage = `🏆 Excellent! You scored ${correctAnswers}/${totalQuestions} (${percentage}%) - Great job!`;
    } else if (percentage >= 60) {
      resultMessage = `👍 Good work! You scored ${correctAnswers}/${totalQuestions} (${percentage}%)`;
    } else {
      resultMessage = `📚 Keep studying! You scored ${correctAnswers}/${totalQuestions} (${percentage}%). Better luck next time!`;
    }
    
    resultsDiv.innerHTML = `
      <div style="text-align: center;">
        <h3 style="color: var(--primary-color); font-family: 'Orbitron', sans-serif;">Quiz Complete!</h3>
        <p style="font-size: 1.2rem; margin: 1rem 0;">${resultMessage}</p>
        <p style="color: var(--secondary-color);">Time bonus earned: ${Math.max(0, (correctAnswers * 5))} seconds</p>
        <button class="button" onclick="location.reload()" style="margin-top: 1rem;">Play Again</button>
      </div>
    `;

    // If perfect score, attempt blockchain submission
    if (correctAnswers === questions.length) {
      console.log('Perfect score detected, preparing blockchain submission...');
      
      // Ensure we have exactly 10 answers
      if (userAnswers.length !== 10) {
        console.error('Error: Expected 10 answers but got', userAnswers.length);
        showBlockchainError(`Error: Expected 10 answers but got ${userAnswers.length}`);
        return;
      }
      
      console.log('Submitting answers to blockchain:', userAnswers);
      await submitToBlockchain(userAnswers);
    } else {
      console.log('Score not perfect, no blockchain submission needed');
    }
  }

  // Smart contract integration
  const CONTRACT_ADDRESS = '0x40C680b4Ed27655FA5414eBa2103aE2231d126ea'; // Your deployed contract address
  const CONTRACT_ABI = [
    "function submitAnswers(uint8[10] userAnswers) external",
    "function REWARD() view returns (uint256)",
    "function hasClaimed(address) view returns (bool)"
  ];

  let web3Contract = null;
  let userAccount = null;

  // Initialize Web3 connection
  async function initWeb3() {
    console.log('Initializing Web3...');
    console.log('Ethers available:', typeof ethers !== 'undefined');
    console.log('Ethereum provider available:', typeof window.ethereum !== 'undefined');
    
    if (typeof ethers === 'undefined') {
      console.error('Ethers.js not loaded! Check if CDN is working.');
      showBlockchainError('Ethers.js library not loaded. Please refresh the page.');
      return true; // Continue with quiz anyway
    }
    
    if (typeof window.ethereum !== 'undefined') {
      console.log('Ethereum provider detected');
      try {
        // Get user account from localStorage (set by general.js)
        userAccount = localStorage.getItem('walletAddress');
        console.log('User account from localStorage:', userAccount);
        
        if (userAccount && CONTRACT_ADDRESS !== '0x...') {
          console.log('Setting up contract with address:', CONTRACT_ADDRESS);
          
          try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log('Provider created:', provider);
            
            web3Contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            console.log('Contract instance created:', web3Contract);
            
            // Test contract connection by calling a read-only function
            const rewardWei = await web3Contract.REWARD();
            const rewardEth = ethers.utils.formatEther(rewardWei);
            console.log('Contract reward amount:', rewardEth, 'ETH');
            updateRewardDisplay(rewardEth);
            
            // Check if user has already claimed
            const hasAlreadyClaimed = await web3Contract.hasClaimed(userAccount);
            console.log('User has already claimed:', hasAlreadyClaimed);
            if (hasAlreadyClaimed) {
              showClaimedMessage();
              return false;
            }
            
            console.log('Web3 initialization successful!');
          } catch (contractError) {
            console.error('Contract setup error:', contractError);
            showBlockchainError('Failed to connect to smart contract: ' + contractError.message);
            // Continue with quiz even if contract fails
          }
        } else {
          console.log('No user account or invalid contract address');
          if (!userAccount) {
            console.log('No wallet connected - user needs to connect wallet first');
            showBlockchainError('Please connect your wallet to claim rewards');
          }
          if (CONTRACT_ADDRESS === '0x...') {
            console.log('Contract address not set');
            showBlockchainError('Smart contract not configured');
          }
        }
        return true;
      } catch (error) {
        console.error('Web3 initialization error:', error);
        showBlockchainError('Web3 initialization failed: ' + error.message);
        return true; // Continue with quiz even if contract fails
      }
    } else {
      console.log('No Ethereum provider found - MetaMask not installed');
      showBlockchainError('MetaMask not detected. Install MetaMask to claim rewards.');
      return true;
    }
  }

  // Update reward display on the page
  function updateRewardDisplay(rewardAmount) {
    // Override with 0.005 ETH for better user experience
    const displayReward = '0.005';
    const rewardElements = document.querySelectorAll('[data-reward]');
    rewardElements.forEach(element => {
      element.textContent = `Reward: ${displayReward} Sepolia ETH*`;
    });
    console.log(`Reward display updated to ${displayReward} ETH (contract has ${rewardAmount} ETH)`);
  }

  // Submit answers to smart contract
  async function submitToBlockchain(finalAnswers) {
    console.log('submitToBlockchain called with:', finalAnswers);
    console.log('web3Contract:', web3Contract);
    console.log('userAccount:', userAccount);
    console.log('CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
    
    if (!web3Contract || !userAccount || CONTRACT_ADDRESS === '0x...') {
      console.log('Smart contract not configured - skipping blockchain submission');
      showBlockchainError('Wallet not connected or contract not configured');
      return false;
    }

    try {
      // Show submission status
      showBlockchainSubmission();

      // Get signer for transactions
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractWithSigner = web3Contract.connect(signer);

      // Use the actual user answers (already validated to be perfect score)
      console.log('Submitting user answers to blockchain:', finalAnswers);
      
      const transaction = await contractWithSigner.submitAnswers(finalAnswers);
      console.log('Transaction sent:', transaction.hash);
      
      // Wait for transaction to be mined
      const receipt = await transaction.wait();
      console.log('Transaction receipt:', receipt);

      if (receipt.status === 1) {
        showRewardClaimed(transaction.hash);
        return true;
      } else {
        showBlockchainError('Transaction failed');
        return false;
      }
    } catch (error) {
      console.error('Blockchain submission error:', error);
      if (error.message.includes('incorrect answers')) {
        showBlockchainError('Incorrect answers - no reward claimed');
      } else if (error.message.includes('already claimed')) {
        showBlockchainError('Reward already claimed by this address');
      } else if (error.message.includes('insufficient contract balance') || error.message.includes('Insufficient contract balance')) {
        showBlockchainError('🏦 Contract temporarily out of funds. Please try again later or contact support.');
      } else if (error.code === 4001) {
        showBlockchainError('Transaction rejected by user');
      } else {
        showBlockchainError('Transaction failed: ' + (error.reason || error.message));
      }
      return false;
    }
  }

  // Show that user already claimed
  function showClaimedMessage() {
    resultsDiv.innerHTML = `
      <div style="text-align: center;">
        <h3 style="color: var(--secondary-color); font-family: 'Orbitron', sans-serif;">Already Claimed</h3>
        <p style="font-size: 1.2rem; margin: 1rem 0;">You have already claimed your reward for this quiz!</p>
        <p style="color: var(--primary-color);">Each wallet address can only claim once.</p>
      </div>
    `;
  }

  // Show blockchain submission in progress
  function showBlockchainSubmission() {
    const submissionDiv = document.createElement('div');
    submissionDiv.id = 'blockchainStatus';
    submissionDiv.style.cssText = `
      text-align: center;
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(0, 225, 255, 0.1);
      border: 1px solid var(--primary-color);
      border-radius: 10px;
    `;
    submissionDiv.innerHTML = `
      <h4 style="color: var(--primary-color); margin: 0 0 0.5rem 0;">Submitting to Blockchain...</h4>
      <p style="margin: 0; font-size: 0.9rem;">Please confirm the transaction in your wallet</p>
    `;
    resultsDiv.appendChild(submissionDiv);
  }

  // Show successful reward claim
  function showRewardClaimed(txHash) {
    const statusDiv = document.getElementById('blockchainStatus');
    if (statusDiv) {
      statusDiv.innerHTML = `
        <h4 style="color: #00ff00; margin: 0 0 0.5rem 0;">🎉 Reward Claimed!</h4>
        <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">0.005 Sepolia ETH sent to your wallet</p>
        <a href="https://sepolia.etherscan.io/tx/${txHash}" target="_blank" 
           style="color: var(--primary-color); text-decoration: none; font-size: 0.8rem;">
          View Transaction ↗
        </a>
      `;
      statusDiv.style.background = 'rgba(0, 255, 0, 0.1)';
      statusDiv.style.borderColor = '#00ff00';
    }
  }

  // Show blockchain error in the results area
  function showBlockchainError(message) {
    console.error('Blockchain error:', message);
    
    // If there's already a blockchain status div, update it
    let statusDiv = document.getElementById('blockchainStatus');
    if (!statusDiv) {
      // Create status div if it doesn't exist
      statusDiv = document.createElement('div');
      statusDiv.id = 'blockchainStatus';
      statusDiv.style.cssText = `
        text-align: center;
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(255, 68, 68, 0.1);
        border: 1px solid #ff4444;
        border-radius: 10px;
      `;
      
      // Add to results area or create a status area
      const resultsDiv = document.getElementById('results');
      if (resultsDiv) {
        resultsDiv.appendChild(statusDiv);
      } else {
        // Add after quiz form if results div doesn't exist
        const quizForm = document.getElementById('quizForm');
        if (quizForm && quizForm.parentNode) {
          quizForm.parentNode.appendChild(statusDiv);
        }
      }
    }
    
    statusDiv.innerHTML = `
      <h4 style="color: #ff4444; margin: 0 0 0.5rem 0;">⚠️ Blockchain Issue</h4>
      <p style="margin: 0; font-size: 0.9rem;">${message}</p>
    `;
    statusDiv.style.background = 'rgba(255, 68, 68, 0.1)';
    statusDiv.style.borderColor = '#ff4444';
  }

  // Add debug panel for troubleshooting
  function createDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debugPanel';
    debugPanel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: #00ff00;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 10px;
      max-width: 300px;
      z-index: 10000;
      border: 1px solid #00ff00;
    `;
    debugPanel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 5px;">Debug Info</div>
      <div id="debugContent">Initializing...</div>
    `;
    document.body.appendChild(debugPanel);
  }

  // Update debug panel with current state
  function updateDebugPanel() {
    const debugContent = document.getElementById('debugContent');
    if (debugContent) {
      const ethersStatus = typeof ethers !== 'undefined' ? 'Loaded' : 'Missing';
      const metamaskStatus = typeof window.ethereum !== 'undefined' ? 'Available' : 'Missing';
      
      debugContent.innerHTML = `
        Questions: ${currentQuestionIndex}/${questions.length}<br>
        Correct: ${correctAnswers}<br>
        Time: ${timeRemaining}s<br>
        Answers: [${userAnswers.join(',')}]<br>
        Wallet: ${userAccount ? userAccount.slice(0,6)+'...' : 'None'}<br>
        Contract: ${web3Contract ? 'Connected' : 'None'}<br>
        Ethers: ${ethersStatus}<br>
        MetaMask: ${metamaskStatus}<br>
        Game Active: ${gameActive}
      `;
    }
  }

  // Test mode for easy perfect score testing
  let testMode = false;
  
  // Add test mode toggle (press 'T' key during quiz)
  document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 't' && gameActive) {
      testMode = !testMode;
      console.log('Test mode:', testMode ? 'ON' : 'OFF');
      if (testMode) {
        console.log('🧪 Test mode enabled! Auto-correct answers activated.');
        showTestModeIndicator();
      } else {
        hideTestModeIndicator();
      }
    }
  });

  function showTestModeIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'testModeIndicator';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(255, 165, 0, 0.9);
      color: black;
      padding: 5px 10px;
      border-radius: 5px;
      font-family: 'Orbitron', sans-serif;
      font-size: 12px;
      z-index: 10001;
      border: 2px solid #ffa500;
    `;
    indicator.textContent = '🧪 TEST MODE';
    document.body.appendChild(indicator);
  }

  function hideTestModeIndicator() {
    const indicator = document.getElementById('testModeIndicator');
    if (indicator) {
      document.body.removeChild(indicator);
    }
  }

  // Initialize the quiz
  async function startQuiz() {
    console.log('Starting quiz...');
    
    // Create debug panel
    createDebugPanel();
    
    // Wait a bit for ethers to load if needed
    if (typeof ethers === 'undefined') {
      console.log('Waiting for ethers.js to load...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Initialize Web3 and check if user has already claimed
    const canProceed = await initWeb3();
    if (!canProceed) {
      return; // User has already claimed, don't start quiz
    }

    currentQuestionIndex = 0;
    timeRemaining = 60;
    correctAnswers = 0;
    userAnswers = [];
    gameActive = true;
    
    console.log('Quiz state initialized');
    updateDebugPanel();
    
    document.getElementById('tournamentSection').style.display = 'none';
    document.getElementById('createTournamentSection').style.display = 'none';
    quizContainer.style.display = 'block';
    
    loadCurrentQuestion();
    startTimer();
  }

  // Event listeners
  if (startBtn) {
    startBtn.addEventListener('click', startQuiz);
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (gameActive) {
        submitCurrentAnswer();
      }
    });
  }

  // Create debug panel on load
  window.addEventListener('load', () => {
    createDebugPanel();
    updateDebugPanel();
  });

  // Update debug panel on every tick
  setInterval(() => {
    if (gameActive) {
      updateDebugPanel();
    }
  }, 1000);
})();