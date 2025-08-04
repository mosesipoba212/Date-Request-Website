class HangmanGame {
    constructor() {
        this.levels = [
            { word: 'LEGOS', image: 'making legos.png', activity: 'Building Legos' },
            { word: 'PAINTING', image: 'painting together.png', activity: 'Painting Together' },
            { word: 'PHOTOBOOTH', image: 'photo booth.png', activity: 'Photo Booth Fun' }
        ];
        
        this.currentLevel = 0;
        this.currentWord = '';
        this.guessedLetters = [];
        this.wrongLetters = [];
        this.revealedSections = 0;
        this.maxWrongGuesses = 6;
        this.gameStarted = false;
        
        this.setupRulesSection();
    }
    
    setupRulesSection() {
        const startBtn = document.getElementById('start-game-btn');
        startBtn.addEventListener('click', () => {
            document.getElementById('rules-section').style.display = 'none';
            document.getElementById('game-content').style.display = 'block';
            this.gameStarted = true;
            this.initializeGame();
            this.setupEventListeners();
        });
        
        // Setup next level button
        const nextLevelBtn = document.getElementById('next-level-btn');
        nextLevelBtn.addEventListener('click', () => {
            this.proceedToNextLevel();
        });
    }
    
    createConfetti() {
        const confettiCount = 40;
        const colors = ['#ff6b9d', '#ffd700', '#ff69b4', '#00ff7f', '#87ceeb', '#ffa500'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random positioning
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random animation timing
            const delay = Math.random() * 2;
            const duration = 3 + Math.random() * 2; // 3-5 seconds
            
            confetti.style.animationDelay = delay + 's';
            confetti.style.animationDuration = duration + 's';
            
            // Add some horizontal drift
            const drift = (Math.random() - 0.5) * 200; // -100px to +100px
            confetti.style.setProperty('--drift', drift + 'px');
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation completes
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, (delay + duration) * 1000 + 500);
        }
    }
    
    initializeGame() {
        this.loadLevel();
        this.displayWord();
        this.updateDisplay();
    }
    
    loadLevel() {
        if (this.currentLevel < this.levels.length) {
            const level = this.levels[this.currentLevel];
            this.currentWord = level.word;
            this.guessedLetters = [];
            this.wrongLetters = [];
            this.revealedSections = 0;
            
            // Set up image
            const imageElement = document.getElementById('activity-image');
            imageElement.src = level.image;
            imageElement.style.display = 'block';
            
            // Reset overlay
            this.updateImageReveal();
            
            // Update level display
            document.getElementById('current-level').textContent = this.currentLevel + 1;
            
            // Update title for current activity
            document.getElementById('game-instruction').textContent = 
                `Level ${this.currentLevel + 1}: Guess what we're going to do!`;
        }
    }
    
    displayWord() {
        const container = document.getElementById('word-container');
        container.innerHTML = '';
        
        for (let letter of this.currentWord) {
            const letterBox = document.createElement('div');
            letterBox.className = 'letter-box';
            
            if (this.guessedLetters.includes(letter)) {
                letterBox.textContent = letter;
            } else {
                letterBox.textContent = '';
            }
            
            container.appendChild(letterBox);
        }
    }
    
    updateImageReveal() {
        const overlay = document.getElementById('image-overlay');
        const sectionsToReveal = Math.min(this.wrongLetters.length, this.maxWrongGuesses);
        
        if (sectionsToReveal === 0) {
            overlay.style.background = '#333';
            overlay.textContent = '❓';
        } else {
            // Create a grid overlay that reveals parts of the image
            const revealPercentage = (sectionsToReveal / this.maxWrongGuesses) * 100;
            overlay.style.background = `linear-gradient(
                to right,
                transparent ${revealPercentage}%,
                #333 ${revealPercentage}%
            )`;
            
            if (sectionsToReveal >= this.maxWrongGuesses) {
                overlay.style.background = 'transparent';
                overlay.textContent = '';
            } else {
                overlay.textContent = `${sectionsToReveal}/${this.maxWrongGuesses} wrong`;
            }
        }
    }
    
    updateDisplay() {
        this.displayWord();
        this.updateImageReveal();
        
        // Update wrong letters display
        document.getElementById('wrong-letters-display').textContent = 
            this.wrongLetters.join(', ');
    }
    
    setupEventListeners() {
        if (!this.gameStarted) return;
        
        const guessButton = document.getElementById('guess-button');
        const letterInput = document.getElementById('letter-input');
        
        guessButton.addEventListener('click', () => this.makeGuess());
        
        letterInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });
        
        letterInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });
        
        // Auto-focus the input when page loads
        letterInput.focus();
        
        // Re-focus input after each guess
        letterInput.addEventListener('blur', () => {
            setTimeout(() => letterInput.focus(), 100);
        });
    }
    
    makeGuess() {
        const input = document.getElementById('letter-input');
        const letter = input.value.toUpperCase().trim();
        
        if (!letter || letter.length !== 1) {
            alert('Please enter a single letter!');
            input.value = '';
            input.focus();
            return;
        }
        
        if (this.guessedLetters.includes(letter) || this.wrongLetters.includes(letter)) {
            alert('You already guessed that letter!');
            input.value = '';
            input.focus();
            return;
        }
        
        if (this.currentWord.includes(letter)) {
            this.guessedLetters.push(letter);
            this.checkLevelComplete();
        } else {
            this.wrongLetters.push(letter);
            this.checkGameOver();
        }
        
        this.updateDisplay();
        input.value = '';
        input.focus();
    }
    
    checkLevelComplete() {
        const isComplete = this.currentWord.split('').every(letter => 
            this.guessedLetters.includes(letter)
        );
        
        if (isComplete) {
            // Show confetti
            this.createConfetti();
            
            // Hide input section
            document.querySelector('.guess-section').style.display = 'none';
            document.querySelector('.wrong-letters').style.display = 'none';
            
            // Show level complete message
            setTimeout(() => {
                document.getElementById('level-complete').style.display = 'block';
            }, 500);
        }
    }
    
    proceedToNextLevel() {
        // Hide level complete message
        document.getElementById('level-complete').style.display = 'none';
        
        // Show input section again
        document.querySelector('.guess-section').style.display = 'flex';
        document.querySelector('.wrong-letters').style.display = 'block';
        
        this.nextLevel();
    }
    
    checkGameOver() {
        if (this.wrongLetters.length >= this.maxWrongGuesses) {
            // Show the full image when max wrong guesses reached
            const overlay = document.getElementById('image-overlay');
            overlay.style.background = 'transparent';
            overlay.textContent = '';
            
            setTimeout(() => {
                alert(`The word was: ${this.currentWord}\nTry the next level!`);
                this.nextLevel();
            }, 1500);
        }
    }
    
    nextLevel() {
        this.currentLevel++;
        
        if (this.currentLevel >= this.levels.length) {
            this.showCompletion();
        } else {
            this.loadLevel();
            this.updateDisplay();
            
            // Re-focus input for next level
            setTimeout(() => {
                const letterInput = document.getElementById('letter-input');
                if (letterInput) {
                    letterInput.focus();
                }
            }, 100);
        }
    }
    
    showCompletion() {
        // Final confetti celebration!
        this.createConfetti();
        
        // Hide game area
        document.querySelector('.game-area').style.display = 'none';
        document.getElementById('game-title').style.display = 'none';
        document.getElementById('game-instruction').style.display = 'none';
        
        // Show completion message in same page (no new tab)
        setTimeout(() => {
            document.getElementById('completion-message').style.display = 'block';
            document.getElementById('completion-message').classList.add('fade-in');
            
            // Scroll to top to show the completion message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HangmanGame();
});
