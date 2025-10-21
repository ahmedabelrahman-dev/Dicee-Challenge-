// Modern Dice Game with ES6+ Features
class DiceGame {
  constructor() {
    this.dice1 = document.getElementById('dice1');
    this.dice2 = document.getElementById('dice2');
    this.gameTitle = document.getElementById('game-title');
    this.rollButton = document.getElementById('rollButton');
    this.resetButton = document.getElementById('resetButton');
    this.score1Element = document.getElementById('score1');
    this.score2Element = document.getElementById('score2');
    this.totalRoundsElement = document.getElementById('totalRounds');
    this.totalDrawsElement = document.getElementById('totalDraws');
    
    this.scores = { player1: 0, player2: 0 };
    this.totalRounds = 0;
    this.totalDraws = 0;
    this.isRolling = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateDisplay();
    this.animateInitialLoad();
  }

  bindEvents() {
    this.rollButton.addEventListener('click', () => this.rollDice());
    this.resetButton.addEventListener('click', () => this.resetGame());
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !this.isRolling) {
        e.preventDefault();
        this.rollDice();
      } else if (e.code === 'KeyR' && e.ctrlKey) {
        e.preventDefault();
        this.resetGame();
      }
    });

    // Touch support for mobile
    this.dice1.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!this.isRolling) this.rollDice();
    });
    
    this.dice2.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!this.isRolling) this.rollDice();
    });
  }

  async rollDice() {
    if (this.isRolling) return;
    
    this.isRolling = true;
    this.rollButton.disabled = true;
    this.rollButton.classList.add('loading');
    
    // Clear previous winner states
    this.clearWinnerStates();
    
    // Animate dice rolling
    await this.animateDiceRoll();
    
    // Generate random numbers
    const number1 = this.generateRandomNumber();
    const number2 = this.generateRandomNumber();
    
    // Update dice images
    this.updateDiceImages(number1, number2);
    
    // Determine winner
    const result = this.determineWinner(number1, number2);
    
    // Update scores and stats
    this.updateScores(result);
    this.updateStats(result);
    
    // Show result with animation
    await this.showResult(result, number1, number2);
    
    // Reset button state
    this.isRolling = false;
    this.rollButton.disabled = false;
    this.rollButton.classList.remove('loading');
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  async animateDiceRoll() {
    const diceImages = [this.dice1, this.dice2];
    
    // Add rolling animation class
    diceImages.forEach(dice => {
      dice.classList.add('rolling');
    });
    
    // Simulate rolling with multiple random images
    const rollDuration = 800;
    const rollInterval = 100;
    const rollCount = rollDuration / rollInterval;
    
    for (let i = 0; i < rollCount; i++) {
      const tempNumber1 = this.generateRandomNumber();
      const tempNumber2 = this.generateRandomNumber();
      
      this.dice1.src = `./images/dice${tempNumber1}.png`;
      this.dice2.src = `./images/dice${tempNumber2}.png`;
      
      await this.sleep(rollInterval);
    }
    
    // Remove rolling animation class
    diceImages.forEach(dice => {
      dice.classList.remove('rolling');
    });
  }

  updateDiceImages(number1, number2) {
    this.dice1.src = `./images/dice${number1}.png`;
    this.dice1.alt = `Dice showing ${number1}`;
    this.dice2.src = `./images/dice${number2}.png`;
    this.dice2.alt = `Dice showing ${number2}`;
  }

  determineWinner(number1, number2) {
    if (number1 > number2) {
      return { winner: 'player1', numbers: { player1: number1, player2: number2 } };
    } else if (number2 > number1) {
      return { winner: 'player2', numbers: { player1: number1, player2: number2 } };
    } else {
      return { winner: 'draw', numbers: { player1: number1, player2: number2 } };
    }
  }

  updateScores(result) {
    if (result.winner === 'player1') {
      this.scores.player1++;
    } else if (result.winner === 'player2') {
      this.scores.player2++;
    }
    
    this.score1Element.textContent = `Score: ${this.scores.player1}`;
    this.score2Element.textContent = `Score: ${this.scores.player2}`;
  }

  updateStats(result) {
    this.totalRounds++;
    if (result.winner === 'draw') {
      this.totalDraws++;
    }
    
    this.totalRoundsElement.textContent = this.totalRounds;
    this.totalDrawsElement.textContent = this.totalDraws;
  }

  async showResult(result, number1, number2) {
    const dice1Element = document.querySelector('[data-player="1"]');
    const dice2Element = document.querySelector('[data-player="2"]');
    
    // Clear previous winner states
    this.clearWinnerStates();
    
    // Update title and add winner styling
    if (result.winner === 'draw') {
      this.gameTitle.textContent = "It's a Draw!";
      this.gameTitle.className = 'draw';
    } else {
      const winnerNumber = result.winner === 'player1' ? 1 : 2;
      this.gameTitle.textContent = `Player ${winnerNumber} Wins!`;
      this.gameTitle.className = 'winner';
      
      // Add winner styling to the winning dice
      const winnerElement = result.winner === 'player1' ? dice1Element : dice2Element;
      winnerElement.classList.add('winner');
    }
    
    // Add result animation
    this.gameTitle.style.animation = 'fadeInDown 0.6s ease-out';
    
    // Show celebration for winner
    if (result.winner !== 'draw') {
      await this.showCelebration(result.winner);
    }
  }

  async showCelebration(winner) {
    const winnerElement = document.querySelector(`[data-player="${winner === 'player1' ? '1' : '2'}"]`);
    
    // Add confetti effect (simple CSS animation)
    winnerElement.style.animation = 'winnerPulse 0.6s ease-in-out';
    
    // Add success sound effect (if available)
    this.playSound('success');
  }

  playSound(type) {
    // Simple sound effect using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'success') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      }
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  }

  clearWinnerStates() {
    const diceElements = document.querySelectorAll('.dice');
    diceElements.forEach(dice => dice.classList.remove('winner'));
    this.gameTitle.className = '';
  }

  resetGame() {
    // Reset all game state
    this.scores = { player1: 0, player2: 0 };
    this.totalRounds = 0;
    this.totalDraws = 0;
    
    // Reset display
    this.updateDisplay();
    this.clearWinnerStates();
    
    // Reset dice to default
    this.dice1.src = './images/dice6.png';
    this.dice1.alt = 'Dice showing 6';
    this.dice2.src = './images/dice6.png';
    this.dice2.alt = 'Dice showing 6';
    
    // Reset title
    this.gameTitle.textContent = 'Dice Battle';
    
    // Add reset animation
    this.gameTitle.style.animation = 'fadeInDown 0.6s ease-out';
    
    // Play reset sound
    this.playSound('reset');
  }

  updateDisplay() {
    this.score1Element.textContent = `Score: ${this.scores.player1}`;
    this.score2Element.textContent = `Score: ${this.scores.player2}`;
    this.totalRoundsElement.textContent = this.totalRounds;
    this.totalDrawsElement.textContent = this.totalDraws;
  }

  animateInitialLoad() {
    // Stagger the animation of dice elements
    const diceElements = document.querySelectorAll('.dice');
    diceElements.forEach((dice, index) => {
      dice.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s both`;
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Utility functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add loading state
  document.body.classList.add('loading');
  
  // Initialize game after a short delay for smooth loading
  setTimeout(() => {
    new DiceGame();
    document.body.classList.remove('loading');
  }, 100);
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
  // Konami code easter egg
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  if (!window.konamiIndex) window.konamiIndex = 0;
  
  if (e.keyCode === konamiCode[window.konamiIndex]) {
    window.konamiIndex++;
    if (window.konamiIndex === konamiCode.length) {
      // Easter egg activated!
      document.body.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)';
      document.body.style.backgroundSize = '400% 400%';
      document.body.style.animation = 'rainbow 2s ease infinite';
      
      // Reset after 5 seconds
      setTimeout(() => {
        document.body.style.background = '';
        document.body.style.animation = '';
      }, 5000);
      
      window.konamiIndex = 0;
    }
  } else {
    window.konamiIndex = 0;
  }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
  @keyframes rainbow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;
document.head.appendChild(style);