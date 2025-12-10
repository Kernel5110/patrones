const app = {
    state: {
        currentScreen: 'hero',
        architect: {
            score: 0,
            currentQuestionIndex: 0,
            isAnswered: false
        },
        memory: {
            moves: 0,
            flippedCards: [],
            matchedPairs: 0,
            isLocked: false
        },
        rush: {
            score: 0,
            lives: 3,
            isActive: false,
            enemies: [],
            spawnRate: 2000,
            lastSpawn: 0,
            gameLoopId: null
        },
        sprint: {
            score: 0,
            timeLeft: 60,
            isActive: false,
            streak: 0,
            timerId: null,
            currentQuestion: null
        }
    },

    init() {
        console.log("PatternMaster Initialized");
        // Keyboard listeners for Rush
        document.addEventListener('keydown', (e) => {
            if (this.state.currentScreen === 'game-rush' && this.state.rush.isActive) {
                const keyMap = { 'q': 'Singleton', 'w': 'Observer', 'e': 'Factory', 'r': 'Strategy' };
                if (keyMap[e.key.toLowerCase()]) {
                    this.handleRushInput(keyMap[e.key.toLowerCase()]);
                }
            }
        });
    },

    startGame(gameType) {
        this.switchScreen(`game-${gameType}`);
        if (gameType === 'architect') this.startArchitectGame();
        else if (gameType === 'memory') this.startMemoryGame();
        else if (gameType === 'rush') this.startRushGame();
        else if (gameType === 'sprint') this.startSprintGame();
    },

    goHome() {
        this.stopAllGames();
        this.switchScreen('hero');
    },

    stopAllGames() {
        // Stop Rush
        this.state.rush.isActive = false;
        cancelAnimationFrame(this.state.rush.gameLoopId);

        // Stop Sprint
        this.state.sprint.isActive = false;
        clearInterval(this.state.sprint.timerId);
    },

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }
        this.state.currentScreen = screenId;
    },

    // --- Architect Game Logic ---
    startArchitectGame() {
        this.state.architect.score = 0;
        this.state.architect.currentQuestionIndex = 0;
        this.state.architect.isAnswered = false;
        this.updateArchitectUI();
        this.loadQuestion();
    },

    loadQuestion() {
        const question = gameData.architect[this.state.architect.currentQuestionIndex];
        if (!question) {
            this.finishArchitectGame();
            return;
        }

        document.getElementById('scenario-title').textContent = question.title;
        document.getElementById('scenario-description').textContent = question.description;

        const optionsContainer = document.getElementById('options-grid');
        optionsContainer.innerHTML = '';

        question.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.text;
            btn.onclick = () => this.handleArchitectAnswer(opt, btn);
            optionsContainer.appendChild(btn);
        });

        const progress = ((this.state.architect.currentQuestionIndex) / gameData.architect.length) * 100;
        document.getElementById('architect-progress').style.width = `${progress}%`;

        this.state.architect.isAnswered = false;
    },

    handleArchitectAnswer(option, btnElement) {
        if (this.state.architect.isAnswered) return;
        this.state.architect.isAnswered = true;

        const question = gameData.architect[this.state.architect.currentQuestionIndex];
        if (option.correct) {
            btnElement.classList.add('correct');
            this.state.architect.score += 100;
            this.showFeedback("¡Correcto!", question.explanation, true);
        } else {
            btnElement.classList.add('wrong');
            const buttons = document.querySelectorAll('.option-btn');
            const correctOpt = question.options.find(o => o.correct);
            buttons.forEach(b => {
                if (b.textContent === correctOpt.text) b.classList.add('correct');
            });
            this.showFeedback("Incorrecto", question.explanation, false);
        }
        this.updateArchitectUI();
    },

    showFeedback(title, message, isCorrect) {
        const modal = document.getElementById('feedback-modal');
        document.getElementById('feedback-title').textContent = title;
        document.getElementById('feedback-title').style.color = isCorrect ? '#00ff88' : '#ff0055';
        document.getElementById('feedback-message').textContent = message;

        const nextBtn = document.getElementById('next-btn');
        nextBtn.onclick = () => {
            modal.classList.remove('visible');
            this.state.architect.currentQuestionIndex++;
            this.loadQuestion();
        };

        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('visible'), 10);
    },

    updateArchitectUI() {
        document.getElementById('architect-score').textContent = this.state.architect.score;
    },

    finishArchitectGame() {
        alert(`¡Juego Terminado! Puntuación final: ${this.state.architect.score}`);
        this.goHome();
    },

    // --- Memory Game Logic ---
    startMemoryGame() {
        this.state.memory.moves = 0;
        this.state.memory.matchedPairs = 0;
        this.state.memory.flippedCards = [];
        this.state.memory.isLocked = false;
        document.getElementById('memory-moves').textContent = 0;

        const board = document.getElementById('memory-board');
        board.innerHTML = '';

        const cards = [...gameData.memory, ...gameData.memory];
        cards.sort(() => Math.random() - 0.5);

        cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card';
            cardEl.dataset.id = card.id;
            cardEl.dataset.index = index;

            cardEl.innerHTML = `
                <div class="front">?</div>
                <div class="back">
                    <div>${card.icon}<br>${card.name}</div>
                </div>
            `;

            cardEl.onclick = () => this.flipCard(cardEl);
            board.appendChild(cardEl);
        });
    },

    flipCard(card) {
        if (this.state.memory.isLocked) return;
        if (card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        this.state.memory.flippedCards.push(card);

        if (this.state.memory.flippedCards.length === 2) {
            this.state.memory.moves++;
            document.getElementById('memory-moves').textContent = this.state.memory.moves;
            this.checkMatch();
        }
    },

    checkMatch() {
        this.state.memory.isLocked = true;
        const [card1, card2] = this.state.memory.flippedCards;

        if (card1.dataset.id === card2.dataset.id) {
            this.state.memory.matchedPairs++;
            this.state.memory.flippedCards = [];
            this.state.memory.isLocked = false;

            if (this.state.memory.matchedPairs === gameData.memory.length) {
                setTimeout(() => {
                    alert(`¡Ganaste! Movimientos: ${this.state.memory.moves}`);
                    this.goHome();
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.state.memory.flippedCards = [];
                this.state.memory.isLocked = false;
            }, 1000);
        }
    },

    // --- Refactor Rush Logic ---
    startRushGame() {
        this.state.rush.score = 0;
        this.state.rush.lives = 3;
        this.state.rush.enemies = [];
        this.state.rush.isActive = true;
        this.state.rush.lastSpawn = 0;

        document.getElementById('rush-play-area').innerHTML = '';
        this.updateRushUI();

        requestAnimationFrame((t) => this.rushLoop(t));
    },

    rushLoop(timestamp) {
        if (!this.state.rush.isActive) return;

        // Spawn enemies
        if (timestamp - this.state.rush.lastSpawn > this.state.rush.spawnRate) {
            this.spawnRushEnemy();
            this.state.rush.lastSpawn = timestamp;
            // Increase difficulty
            if (this.state.rush.spawnRate > 500) this.state.rush.spawnRate -= 50;
        }

        // Move enemies
        const enemies = document.querySelectorAll('.enemy-bug');
        const playAreaHeight = document.getElementById('rush-play-area').offsetHeight;

        enemies.forEach(enemy => {
            let top = parseFloat(enemy.style.top || 0);
            top += 1.5; // Speed
            enemy.style.top = `${top}px`;

            if (top > playAreaHeight - 40) {
                // Crash!
                this.handleRushCrash(enemy);
            }
        });

        this.state.rush.gameLoopId = requestAnimationFrame((t) => this.rushLoop(t));
    },

    spawnRushEnemy() {
        const patterns = ['Singleton', 'Observer', 'Factory', 'Strategy'];
        const problems = {
            'Singleton': ['Global Config', 'DB Connection', 'Logger'],
            'Observer': ['Event Listener', 'News Feed', 'Chat Room'],
            'Factory': ['Cross-Platform UI', 'Payment Gateway', 'Vehicle Creator'],
            'Strategy': ['Sort Algo', 'Compression', 'Route Plan']
        };

        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        const problem = problems[pattern][Math.floor(Math.random() * problems[pattern].length)];

        const enemy = document.createElement('div');
        enemy.className = 'enemy-bug';
        enemy.textContent = problem;
        enemy.dataset.pattern = pattern;
        enemy.style.left = `${Math.random() * 80 + 10}%`;
        enemy.style.top = '0px';

        document.getElementById('rush-play-area').appendChild(enemy);
        this.state.rush.enemies.push(enemy);
    },

    handleRushInput(pattern) {
        const enemies = document.querySelectorAll('.enemy-bug');
        let hit = false;

        // Find lowest enemy matching pattern
        let target = null;
        let maxTop = -1;

        enemies.forEach(enemy => {
            if (enemy.dataset.pattern === pattern) {
                const top = parseFloat(enemy.style.top || 0);
                if (top > maxTop) {
                    maxTop = top;
                    target = enemy;
                }
            }
        });

        if (target) {
            // Destroy enemy
            target.remove();
            this.state.rush.score += 50;
            this.updateRushUI();

            // Visual feedback on button
            const btn = document.querySelector(`.rush-btn[data-pattern="${pattern}"]`);
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 100);
        } else {
            // Penalty?
        }
    },

    handleRushCrash(enemy) {
        enemy.remove();
        this.state.rush.lives--;
        this.updateRushUI();

        if (this.state.rush.lives <= 0) {
            this.state.rush.isActive = false;
            alert(`¡Game Over! Score: ${this.state.rush.score}`);
            this.goHome();
        }
    },

    updateRushUI() {
        document.getElementById('rush-score').textContent = this.state.rush.score;
        document.getElementById('rush-lives').textContent = '❤️'.repeat(this.state.rush.lives);
    },

    // --- Design Sprint Logic ---
    startSprintGame() {
        this.state.sprint.score = 0;
        this.state.sprint.timeLeft = 60;
        this.state.sprint.isActive = true;
        this.state.sprint.streak = 0;

        this.updateSprintUI();
        this.nextSprintQuestion();

        this.state.sprint.timerId = setInterval(() => {
            this.state.sprint.timeLeft--;
            this.updateSprintUI();
            if (this.state.sprint.timeLeft <= 0) {
                this.finishSprintGame();
            }
        }, 1000);
    },

    nextSprintQuestion() {
        // Reuse architect questions but randomized options
        const qIndex = Math.floor(Math.random() * gameData.architect.length);
        const question = gameData.architect[qIndex];
        this.state.sprint.currentQuestion = question;

        document.getElementById('sprint-question').textContent = question.title;

        const container = document.getElementById('sprint-options');
        container.innerHTML = '';

        // Shuffle options
        const options = [...question.options].sort(() => Math.random() - 0.5);

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'sprint-btn';
            btn.textContent = opt.text;
            btn.onclick = () => this.handleSprintAnswer(opt);
            container.appendChild(btn);
        });
    },

    handleSprintAnswer(option) {
        if (!this.state.sprint.isActive) return;

        if (option.correct) {
            this.state.sprint.streak++;
            const bonus = this.state.sprint.streak > 2 ? this.state.sprint.streak * 10 : 0;
            this.state.sprint.score += (100 + bonus);
            this.nextSprintQuestion();
        } else {
            this.state.sprint.streak = 0;
            // Small penalty or delay?
            this.state.sprint.score = Math.max(0, this.state.sprint.score - 50);
            // Shake effect maybe?
        }
        this.updateSprintUI();
    },

    updateSprintUI() {
        document.getElementById('sprint-score').textContent = this.state.sprint.score;
        document.getElementById('sprint-timer').textContent = `${this.state.sprint.timeLeft}s`;

        const streakEl = document.getElementById('sprint-streak');
        if (this.state.sprint.streak > 2) {
            streakEl.classList.remove('hidden');
            document.getElementById('streak-count').textContent = this.state.sprint.streak;
        } else {
            streakEl.classList.add('hidden');
        }
    },

    finishSprintGame() {
        this.state.sprint.isActive = false;
        clearInterval(this.state.sprint.timerId);
        alert(`¡Tiempo Agotado! Score Final: ${this.state.sprint.score}`);
        this.goHome();
    }
};

app.init();
