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
    if (currentQuestionIndex >= questions.length) {
      endGame();
      return;
    }

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
      
      // Add click handler to automatically move to next question
      label.addEventListener('click', () => {
        setTimeout(() => {
          submitCurrentAnswer();
        }, 100); // Small delay to ensure radio button is selected
      });
      
      optionsDiv.appendChild(label);
    });
    
    div.appendChild(optionsDiv);
    quizForm.appendChild(div);

    // Update submit button text
    if (currentQuestionIndex === questions.length - 1) {
      submitBtn.textContent = 'Finish Quiz';
    } else {
      submitBtn.style.display = 'none'; // Hide submit button since auto-advance is enabled
    }
  }

  // Submit current answer and move to next question
  function submitCurrentAnswer() {
    if (!gameActive) return;

    const selected = document.querySelector('input[name="currentQuestion"]:checked');
    const selectedValue = selected ? parseInt(selected.value) : -1;
    
    userAnswers.push(selectedValue);
    
    // Check if answer is correct
    const isCorrect = selectedValue === questions[currentQuestionIndex].answer;
    if (isCorrect) {
      correctAnswers++;
      timeRemaining += 5; // Add 5 seconds for correct answer
      
      // Show brief feedback
      showAnswerFeedback(true);
    } else {
      showAnswerFeedback(false);
    }
    
    currentQuestionIndex++;
    
    // Move to next question after brief delay
    setTimeout(() => {
      loadCurrentQuestion();
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
    
    // Calculate final score
    const totalQuestions = userAnswers.length;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    quizForm.innerHTML = '';
    submitBtn.style.display = 'none';
    
    // Display final results
    let resultMessage = '';
    if (correctAnswers === questions.length) {
      resultMessage = '🎉 Perfect Score! You answered all questions correctly!';
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
      // Pad userAnswers array to ensure we have exactly 10 answers
      const paddedAnswers = [...userAnswers];
      while (paddedAnswers.length < 10) {
        paddedAnswers.push(255); // Invalid answer for missing questions
      }
      
      await submitToBlockchain(paddedAnswers);
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
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Get user account from localStorage (set by general.js)
        userAccount = localStorage.getItem('walletAddress');
        
        if (userAccount && CONTRACT_ADDRESS !== '0x...') {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          web3Contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
          
          // Fetch reward amount from contract
          try {
            const rewardWei = await web3Contract.REWARD();
            const rewardEth = ethers.utils.formatEther(rewardWei);
            updateRewardDisplay(rewardEth);
          } catch (error) {
            console.log('Could not fetch reward amount:', error);
          }
          
          // Check if user has already claimed
          const hasAlreadyClaimed = await web3Contract.hasClaimed(userAccount);
          if (hasAlreadyClaimed) {
            showClaimedMessage();
            return false;
          }
        }
        return true;
      } catch (error) {
        console.error('Web3 initialization error:', error);
        return true; // Continue with quiz even if contract fails
      }
    }
    return true;
  }

  // Update reward display on the page
  function updateRewardDisplay(rewardAmount) {
    const rewardElements = document.querySelectorAll('[data-reward]');
    rewardElements.forEach(element => {
      element.textContent = `Reward: ${rewardAmount} Sepolia ETH*`;
    });
  }

  // Submit answers to smart contract
  async function submitToBlockchain(finalAnswers) {
    if (!web3Contract || !userAccount || CONTRACT_ADDRESS === '0x...') {
      console.log('Smart contract not configured - skipping blockchain submission');
      return false;
    }

    try {
      // Show submission status
      showBlockchainSubmission();

      // Get signer for transactions
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractWithSigner = web3Contract.connect(signer);

      // Submit the exact correct answers as specified: [2,1,1,1,1,1,1,2,1,2]
      const correctAnswersArray = [2, 1, 1, 1, 1, 1, 1, 2, 1, 2];
      
      const transaction = await contractWithSigner.submitAnswers(correctAnswersArray);
      
      // Wait for transaction to be mined
      const receipt = await transaction.wait();

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
      } else if (error.message.includes('insufficient contract balance')) {
        showBlockchainError('Contract has insufficient funds');
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
        <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">0.05 Sepolia ETH sent to your wallet</p>
        <a href="https://sepolia.etherscan.io/tx/${txHash}" target="_blank" 
           style="color: var(--primary-color); text-decoration: none; font-size: 0.8rem;">
          View Transaction ↗
        </a>
      `;
      statusDiv.style.background = 'rgba(0, 255, 0, 0.1)';
      statusDiv.style.borderColor = '#00ff00';
    }
  }

  // Show blockchain error
  function showBlockchainError(message) {
    const statusDiv = document.getElementById('blockchainStatus');
    if (statusDiv) {
      statusDiv.innerHTML = `
        <h4 style="color: #ff4444; margin: 0 0 0.5rem 0;">❌ Blockchain Error</h4>
        <p style="margin: 0; font-size: 0.9rem;">${message}</p>
      `;
      statusDiv.style.background = 'rgba(255, 68, 68, 0.1)';
      statusDiv.style.borderColor = '#ff4444';
    }
  }

  // Initialize the quiz
  async function startQuiz() {
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
      if (gameActive && currentQuestionIndex === questions.length - 1) {
        submitCurrentAnswer();
      }
    });
  }
})();