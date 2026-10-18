window.recordAdventureWin = function recordAdventureWin() {
    const key = 'teachmath_adventure_wins';
    const value = Number(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, String(value));
};

// TeachMath Adventure – UI Controller

const ui = {
    playerName: '',

    // --- Initialisierung ---
    init() {
        document.getElementById('btn-start').addEventListener('click', () => this.startGame());
        document.getElementById('btn-action').addEventListener('click', () => this.handleAction());
        document.getElementById('btn-hint').addEventListener('click', () => this.showHint());
        document.getElementById('btn-retry').addEventListener('click', () => this.resetToStart());
        document.getElementById('btn-menu-go').addEventListener('click', () => window.location.href = 'index.html');
        document.getElementById('btn-play-again').addEventListener('click', () => this.resetToStart());
        document.getElementById('btn-menu-win').addEventListener('click', () => window.location.href = 'index.html');

        document.getElementById('challenge-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleAction();
        });

        this.renderHighscores();
    },

    // --- Bildschirm wechseln ---
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    // --- Spiel starten ---
    startGame() {
        const name = document.getElementById('player-name').value.trim();
        if (!name) { alert('Bitte gib deinen Namen ein!'); return; }
        this.playerName = name;

        // State zurücksetzen
        adventure.state = {
            currentScene: 'start',
            sceneStep: 0,
            lives: 3,
            score: 0,
            inventory: [],
            completed: false,
            currentChallenge: null,
            wrongAttempts: 0
        };

        document.getElementById('hud-name').textContent = name;
        this.showScreen('screen-game');
        this.renderScene();
    },

    // --- Szene rendern ---
    renderScene() {
        const st = adventure.state;
        const scene = adventure.getCurrentScene();
        const step = adventure.getCurrentStep();
        if (!scene || !step) { this.nextScene(); return; }

        // HUD
        document.getElementById('hud-lives').textContent = '❤️'.repeat(st.lives) + '🖤'.repeat(3 - st.lives);
        document.getElementById('hud-score').textContent = st.score;
        document.getElementById('hud-scene').textContent = scene.title;

        // Kapitel-Fortschritt
        const order = ['start', 'sea', 'island', 'cave', 'treasure'];
        order.forEach(k => {
            const el = document.getElementById(`cp-${k}`);
            if (!el) return;
            el.classList.remove('active', 'done');
            const idx = order.indexOf(k);
            const cur = order.indexOf(st.currentScene);
            if (idx < cur) el.classList.add('done');
            else if (idx === cur) el.classList.add('active');
        });

        // Story-Text & Emoji
        document.getElementById('scene-title').textContent = scene.title;
        document.getElementById('scene-emoji').textContent = step.image || '📖';

        // Aufgabe oder Text
        const challengeBox = document.getElementById('challenge-box');
        const feedback = document.getElementById('challenge-feedback');
        feedback.className = 'challenge-feedback hidden';
        document.getElementById('hint-box').textContent = '';
        st.wrongAttempts = 0;

        if (step.challenge) {
            const ch = adventure.prepareChallenge(step);
            document.getElementById('story-text').innerHTML = '';
            document.getElementById('challenge-text').innerHTML = ch.text;
            document.getElementById('unit-label').textContent = ch.unit || '';
            document.getElementById('challenge-input').value = '';
            document.getElementById('challenge-input').focus();
            challengeBox.classList.remove('hidden');
            document.getElementById('btn-action').textContent = '✓ Antworten';
            document.getElementById('btn-hint').classList.remove('hidden');
        } else {
            document.getElementById('story-text').innerHTML = step.text;
            challengeBox.classList.add('hidden');
            document.getElementById('btn-action').textContent = 'Weiter →';
            document.getElementById('btn-hint').classList.add('hidden');
        }
    },

    // --- Haupt-Button ---
    handleAction() {
        const step = adventure.getCurrentStep();
        const st = adventure.state;

        if (!step) return;

        if (step.challenge && !st._challengeSolved) {
            // Antwort prüfen
            const input = document.getElementById('challenge-input').value.trim();
            if (!input) return;

            const correct = adventure.checkAnswer(input);
            const feedback = document.getElementById('challenge-feedback');

            if (correct) {
                st.score += 30;
                st.wrongAttempts = 0;
                st._challengeSolved = true;
                document.getElementById('hud-score').textContent = st.score;

                feedback.textContent = '🎉 ' + adventure.state.currentChallenge.successText;
                feedback.className = 'challenge-feedback correct';

                document.getElementById('challenge-input').disabled = true;
                document.getElementById('btn-hint').classList.add('hidden');
                document.getElementById('btn-action').textContent = 'Weiter →';
            } else {
                st.wrongAttempts++;
                st.lives = Math.max(0, st.lives - 1);
                document.getElementById('hud-lives').textContent =
                    '❤️'.repeat(st.lives) + '🖤'.repeat(3 - st.lives);

                if (st.lives <= 0) {
                    this.gameOver();
                    return;
                }

                const ch = adventure.state.currentChallenge;
                const msg = st.wrongAttempts >= 2
                    ? `❌ Leider falsch. Die richtige Antwort wäre ${ch.answer}${ch.unit ? ' ' + ch.unit : ''} gewesen.`
                    : `❌ Leider falsch. Du hast noch ${st.lives} ❤️. Versuch es nochmal!`;
                feedback.innerHTML = msg;
                feedback.className = 'challenge-feedback wrong';

                if (st.wrongAttempts >= 2) {
                    // Nach 2 Fehlern: Antwort zeigen und weiterlassen
                    st._challengeSolved = true;
                    document.getElementById('challenge-input').disabled = true;
                    document.getElementById('btn-hint').classList.add('hidden');
                    document.getElementById('btn-action').textContent = 'Weiter →';
                }
            }
        } else {
            // Nächster Schritt
            st._challengeSolved = false;
            document.getElementById('challenge-input').disabled = false;
            st.sceneStep++;

            const scene = adventure.getCurrentScene();
            if (st.sceneStep >= scene.steps.length) {
                this.nextScene();
            } else {
                this.renderScene();
            }
        }
    },

    // --- Nächste Szene ---
    nextScene() {
        const st = adventure.state;
        const scene = adventure.getCurrentScene();
        if (!scene) return;

        if (scene.nextScene === 'end' || st.currentScene === 'treasure') {
            this.winGame();
            return;
        }

        st.currentScene = scene.nextScene;
        st.sceneStep = 0;
        this.renderScene();
    },

    // --- Tipp ---
    showHint() {
        const ch = adventure.state.currentChallenge;
        if (ch && ch.hint) {
            document.getElementById('hint-box').textContent = '💡 ' + ch.hint;
        }
    },

    // --- Game Over ---
    gameOver() {
        document.getElementById('gameover-score').textContent = adventure.state.score;
        document.getElementById('gameover-text').textContent =
            `Tapfer gekämpft, ${this.playerName}! Beim nächsten Mal schaffst du es!`;
        this.showScreen('screen-gameover');
    },

    // --- Gewonnen ---
    winGame() {
        if (typeof window !== 'undefined' && typeof window.recordAdventureWin === 'function') {
            window.recordAdventureWin();
        }
        const score = adventure.state.score;
        document.getElementById('win-score').textContent = score;
        document.getElementById('win-text').textContent =
            `${this.playerName}, du hast alle Rätsel gelöst und den Schatz gefunden! Du bist ein echter Mathe-Held! 🏴‍☠️`;
        this.saveHighscore(this.playerName, score);
        this.showScreen('screen-win');
    },

    // --- Reset ---
    resetToStart() {
        this.showScreen('screen-start');
        this.renderHighscores();
    },

    // --- Zurück zum Hauptmenü ---
    goToMenu() {
        window.location.href = 'index.html';
    },

    // --- Highscores ---
    saveHighscore(name, score) {
        const hs = JSON.parse(localStorage.getItem('adventure_hs') || '[]');
        hs.push({ name, score, date: new Date().toLocaleDateString('de-DE') });
        hs.sort((a, b) => b.score - a.score);
        localStorage.setItem('adventure_hs', JSON.stringify(hs.slice(0, 5)));
    },

    renderHighscores() {
        const hs = JSON.parse(localStorage.getItem('adventure_hs') || '[]');
        const box = document.getElementById('highscores-box');
        if (!hs.length) { box.innerHTML = ''; return; }

        box.innerHTML = '<h3>🏆 Bestenliste</h3>' +
            hs.map((e, i) =>
                `<div class="hs-entry"><span>${i + 1}. ${e.name}</span><span>${e.score} ⭐</span></div>`
            ).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => ui.init());
