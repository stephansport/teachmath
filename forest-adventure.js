window.recordAdventureWin = function recordAdventureWin() {
    const key = 'teachmath_adventure_wins';
    const value = Number(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, String(value));
};

const forestAdventure = {
    state: {
        currentScene: 'start',
        sceneStep: 0,
        lives: 3,
        score: 0,
        completed: false,
        currentChallenge: null,
        wrongAttempts: 0,
        _challengeSolved: false,
        chosenRoute: null,
        routeHistory: []
    },

    scenes: {
        start: {
            title: '🏡 Das Wiesental am Morgen',
            steps: [
                {
                    text: `Im Wiesental ist die Luft noch kühl und riecht nach Gras und Apfelblüte. Vor der kleinen Hütte steht der Tisch mit einer Schüssel Haferbrei, als plötzlich die kleine Glocke am Bach still bleibt. Kein Wasser klirrt, kein Holz rührt sich. Nur der Wind ist zu hören.<br><br>„Hm“, murmelt der Talbewohner. „Das ist kein gutes Zeichen.“`,
                    image: '🌿'
                },
                {
                    text: '',
                    challenge: () => {
                        const ringe = 4;
                        const cm = 8;
                        return {
                            text: `Du untersuchst die Glocke. Es hängen <strong>${ringe}</strong> Holzringe daran, und jeder Ring ist <strong>${cm}</strong> cm lang. Wie lang ist die ganze Kette zusammen?`,
                            answer: ringe * cm,
                            hint: `${ringe} × ${cm} = ?`,
                            unit: 'cm',
                            successText: `„Genau“, sagst du. Die Glocke selbst ist nicht kaputt. Irgendjemand hat den Bachlauf verlegt.`
                        };
                    },
                    image: '🔔'
                }
            ],
            nextScene: 'brook'
        },

        brook: {
            title: '💧 Der stille Bach',
            steps: [
                {
                    text: `Am Ufer liegt frischer Lehm. Eine abgerissene Schnur baumelt über dem Wasser, und auf dem feuchten Boden stehen seltsame Spuren. Sie enden nicht am alten Weg, sondern bei einer schmalen Seitenrinne, die mitten im Gras verborgen liegt.`,
                    image: '💧'
                },
                {
                    text: '',
                    challenge: () => {
                        const wasser = 48;
                        const tage = 6;
                        return {
                            text: `Im alten Stauwehr stehen <strong>${wasser}</strong> Liter Wasser. In <strong>${tage}</strong> Tagen wird durch den Seitenkanal genau gleich viel davon abgeleitet. Wie viele Liter fließen pro Tag ab?`,
                            answer: wasser / tage,
                            hint: `${wasser} ÷ ${tage} = ?`,
                            unit: 'Liter',
                            successText: `Die Ziffern passen. Der Seitenkanal nimmt viel zu viel Wasser auf. Jemand hat die Regelung künstlich gelockert.`
                        };
                    },
                    image: '🌊'
                }
            ],
            nextScene: 'fork'
        },

        fork: {
            title: '🧭 Drei Wege im Tal',
            steps: [
                {
                    text: `Du schaust dich um. Drei Spuren ziehen sich durch das Tal: eine zu einem Wasserwerk, eine zum Buchenpfad und eine in die Felsenkuhle. Die nassen Spuren sind länger, aber die Zweige am Rand sind noch frisch. Ein kluger Blick reicht: Der Weg mit den vielen nassen Wurzeln führt ins verborgene Wasserwerk.`,
                    image: '🧭'
                },
                {
                    text: '',
                    challenge: () => {
                        return {
                            text: `Welchen Weg nimmst du? <strong>1</strong> = Wasserwerk, <strong>2</strong> = Buchenpfad, <strong>3</strong> = Felsenkuhle`,
                            answer: 1,
                            hint: 'Die nassen Wurzeln und die lehmigen Spuren deuten auf den Wasserweg hin.',
                            unit: 'Wahl',
                            successText: `Du folgst dem nassen Pfad. Das Wasserwerk liegt nicht weit entfernt.`
                        };
                    },
                    image: '🧭'
                }
            ],
            nextScene: () => {
                const chosen = this.state.chosenRoute || 'water';
                return chosen;
            }
        },

        water: {
            title: '⚙️ Das Wasserwerk',
            steps: [
                {
                    text: `Im Wasserwerk und am alten Verteiler sitzt eine kleine Holzplatte schief. Sie sollte den Zufluss begrenzen, aber jemand hat sie gegen einen zu kurzen Stempel ausgetauscht. Ohne den richtigen Teil läuft das Wasser zu schnell in den Seitenkanal.`,
                    image: '⚙️'
                },
                {
                    text: '',
                    challenge: () => {
                        const liter = 12;
                        const minuten = 5;
                        return {
                            text: `Die Pumpe läuft <strong>${liter}</strong> Liter pro Minute. Wie viel Wasser wird in <strong>${minuten}</strong> Minuten befördert?`,
                            answer: liter * minuten,
                            hint: `${liter} × ${minuten} = ?`,
                            unit: 'Liter',
                            successText: `Du setzt das richtige Teil ein. Das Wasser verteilt sich wieder sauber und die Glocke beginnt leise zu stimmen.`
                        };
                    },
                    image: '🛠️'
                }
            ],
            nextScene: 'home'
        },

        forest: {
            title: '🌲 Der Buchenpfad',
            steps: [
                {
                    text: `Der Buchenpfad führt in einen stillen Hain. Dort entdeckt du kleine, vorsichtig ausgerichtete Steine und eine Reihe von Markierungen an den Bäumen. Sicher, jemand wollte das Wasser vor den Nachbarn verbergen, aber die Spur ist zugeordnet und nicht böse.`,
                    image: '🌲'
                },
                {
                    text: '',
                    challenge: () => {
                        const baum = 18;
                        const stufen = 3;
                        return {
                            text: `Auf dem Pfad stehen <strong>${baum}</strong> Bäume. Jeder Baum zeigt <strong>${stufen}</strong> Markierungen. Wie viele Markierungen sind insgesamt sichtbar?`,
                            answer: baum * stufen,
                            hint: `${baum} × ${stufen} = ?`,
                            unit: 'Markierungen',
                            successText: `Die Markierungen zeigen, dass der Pfad nicht zufällig, sondern absichtlich verändert wurde. Du erkennst die wahre Ursache: ein Notunterstand, der ungeschützt wäre.`
                        };
                    },
                    image: '🪵'
                }
            ],
            nextScene: 'home'
        },

        cave: {
            title: '🪨 Die Felsenkuhle',
            steps: [
                {
                    text: `Diese Stelle ist verborgen zwischen Felsen und dichtem Dornengestrüpp. Dort findet sich eine alte Kuhle mit einem schmalen Zugang, wo eine kleine Gruppe von Waldtieren ihren Unterschlupf schützt. Ihr Wasser ist knapp, doch sie wollten niemandem schaden.`,
                    image: '🪨'
                },
                {
                    text: '',
                    challenge: () => {
                        const trog = 16;
                        const kaesten = 4;
                        return {
                            text: `Im Unterschlupf stehen <strong>${trog}</strong> Wassertröge und in jedem Kasten liegen <strong>${kaesten}</strong> kleine Steine. Wie viele Steine sind zusammen gezählt?`,
                            answer: trog * kaesten,
                            hint: `${trog} × ${kaesten} = ?`,
                            unit: 'Steine',
                            successText: `Du verstehst nun: Der Unterschlupf war nur vorübergehend geschützt worden, und die Lösung muss beide Seiten berücksichtigen.`
                        };
                    },
                    image: '🏕️'
                }
            ],
            nextScene: 'home'
        },

        home: {
            title: '🏡 Wieder im Tal',
            steps: [
                {
                    text: `Du kehrst zum Bach zurück. Die Glocke schwingt wieder, das Wasser gleitet gleichmäßig und die Bäume am Ufer bewegen sich wie gewohnt. Barl wartet bereits. „Es war nicht Bosheit, sondern Sorge“, sagt er. „Du hast die Ursache gefunden und eine Lösung für alle geschaffen.“<br><br>Das Tal ist wieder ruhig. Die Wolken teilen sich über dem Bach, und der erste Morgenwind trägt die Glocke sanft durch das Wiesental.`,
                    image: '☀️'
                },
                {
                    text: '',
                    challenge: () => {
                        const sicher = 24;
                        const spare = 8;
                        return {
                            text: `Die Glocke singt wieder. Wenn der Bach <strong>${sicher}</strong> Liter Wasser hält und du <strong>${spare}</strong> Liter für die verborgene Zuflucht aufrechterhält, wie viel Wasser bleibt insgesamt für das Tal?`,
                            answer: sicher - spare,
                            hint: `${sicher} - ${spare} = ?`,
                            unit: 'Liter',
                            successText: `Perfekt. Das Tal hat genug Wasser, und der Unterschlupf bleibt gesichert. Das Abenteuer endet mit einem guten Frieden.`
                        };
                    },
                    image: '🏆'
                }
            ],
            nextScene: 'end'
        }
    },

    getCurrentScene() {
        return this.scenes[this.state.currentScene] || null;
    },

    getCurrentStep() {
        const scene = this.getCurrentScene();
        if (!scene) return null;
        return scene.steps[this.state.sceneStep] || null;
    },

    prepareChallenge(step) {
        if (!step || !step.challenge) return null;
        const challenge = step.challenge();
        this.state.currentChallenge = challenge;
        return challenge;
    },

    checkAnswer(input) {
        const raw = String(input).trim().replace(',', '.');
        const value = Number(raw);
        const ch = this.state.currentChallenge;
        if (!ch) return false;
        return Math.abs(value - Number(ch.answer)) < 0.0001;
    },

    nextScene() {
        const scene = this.getCurrentScene();
        if (!scene) return;

        if (this.state.currentScene === 'fork') {
            const route = this.state.chosenRoute || 'water';
            this.state.currentScene = route;
            this.state.sceneStep = 0;
            forestUi.renderScene();
            return;
        }

        if (this.state.currentScene === 'home' || scene.nextScene === 'end') {
            forestUi.winGame();
            return;
        }

        const target = typeof scene.nextScene === 'function' ? scene.nextScene() : scene.nextScene;
        if (target) {
            this.state.currentScene = target;
        }
        this.state.sceneStep = 0;
        forestUi.renderScene();
    }
};

const forestUi = {
    playerName: '',

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
    },

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },

    startGame() {
        const name = document.getElementById('player-name').value.trim();
        if (!name) {
            alert('Bitte gib deinen Namen ein!');
            return;
        }
        this.playerName = name;
        forestAdventure.state = {
            currentScene: 'start',
            sceneStep: 0,
            lives: 3,
            score: 0,
            completed: false,
            currentChallenge: null,
            wrongAttempts: 0,
            _challengeSolved: false,
            chosenRoute: null,
            routeHistory: []
        };

        document.getElementById('hud-name').textContent = name;
        this.showScreen('screen-game');
        this.renderScene();
    },

    resetToStart() {
        this.showScreen('screen-start');
        document.getElementById('player-name').value = '';
        document.getElementById('challenge-input').value = '';
    },

    renderScene() {
        const st = forestAdventure.state;
        const scene = forestAdventure.getCurrentScene();
        const step = forestAdventure.getCurrentStep();
        if (!scene || !step) {
            forestAdventure.nextScene();
            return;
        }

        document.getElementById('hud-lives').textContent = '❤️'.repeat(st.lives) + '🖤'.repeat(3 - st.lives);
        document.getElementById('hud-score').textContent = st.score;
        document.getElementById('hud-scene').textContent = scene.title;

        const order = ['start', 'brook', 'fork', 'water', 'forest', 'cave', 'home'];
        order.forEach(k => {
            const el = document.getElementById(`cp-${k}`);
            if (!el) return;
            el.classList.remove('active', 'done');
            const idx = order.indexOf(k);
            const cur = order.indexOf(st.currentScene);
            if (idx < cur) el.classList.add('done');
            else if (idx === cur) el.classList.add('active');
        });

        document.getElementById('scene-title').textContent = scene.title;
        document.getElementById('scene-emoji').textContent = step.image || '📖';

        const challengeBox = document.getElementById('challenge-box');
        const feedback = document.getElementById('challenge-feedback');
        feedback.className = 'challenge-feedback hidden';
        document.getElementById('hint-box').textContent = '';
        st.wrongAttempts = 0;

        if (step.challenge) {
            const ch = forestAdventure.prepareChallenge(step);
            document.getElementById('story-text').innerHTML = '';
            document.getElementById('challenge-text').innerHTML = ch.text;
            document.getElementById('unit-label').textContent = ch.unit || '';
            document.getElementById('challenge-input').value = '';
            document.getElementById('challenge-input').disabled = false;
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

    handleAction() {
        const step = forestAdventure.getCurrentStep();
        const st = forestAdventure.state;
        if (!step) return;

        if (step.challenge && !st._challengeSolved) {
            const input = document.getElementById('challenge-input').value.trim();
            if (!input) return;

            const correct = forestAdventure.checkAnswer(input);
            const feedback = document.getElementById('challenge-feedback');

            if (correct) {
                if (st.currentScene === 'fork') {
                    const choice = Number(input);
                    st.chosenRoute = choice === 1 ? 'water' : choice === 2 ? 'forest' : 'cave';
                    st.routeHistory.push(st.chosenRoute);
                }

                st.score += 30;
                st.wrongAttempts = 0;
                st._challengeSolved = true;
                document.getElementById('hud-score').textContent = st.score;

                feedback.textContent = '🎉 ' + st.currentChallenge.successText;
                feedback.className = 'challenge-feedback correct';
                document.getElementById('challenge-input').disabled = true;
                document.getElementById('btn-hint').classList.add('hidden');
                document.getElementById('btn-action').textContent = 'Weiter →';
            } else {
                st.wrongAttempts++;
                st.lives = Math.max(0, st.lives - 1);
                document.getElementById('hud-lives').textContent = '❤️'.repeat(st.lives) + '🖤'.repeat(3 - st.lives);

                if (st.lives <= 0) {
                    this.gameOver();
                    return;
                }

                const ch = st.currentChallenge;
                const msg = st.wrongAttempts >= 2
                    ? `❌ Leider falsch. Die richtige Antwort wäre ${ch.answer}${ch.unit ? ' ' + ch.unit : ''}.`
                    : `❌ Leider falsch. Du hast noch ${st.lives} ❤️. Versuch es erneut!`;
                feedback.innerHTML = msg;
                feedback.className = 'challenge-feedback wrong';

                if (st.wrongAttempts >= 2) {
                    st._challengeSolved = true;
                    document.getElementById('challenge-input').disabled = true;
                    document.getElementById('btn-hint').classList.add('hidden');
                    document.getElementById('btn-action').textContent = 'Weiter →';
                }
            }
        } else {
            st._challengeSolved = false;
            document.getElementById('challenge-input').disabled = false;
            st.sceneStep++;

            const scene = forestAdventure.getCurrentScene();
            if (st.sceneStep >= scene.steps.length) {
                forestAdventure.nextScene();
            } else {
                this.renderScene();
            }
        }
    },

    showHint() {
        const ch = forestAdventure.state.currentChallenge;
        if (ch && ch.hint) {
            document.getElementById('hint-box').textContent = '💡 ' + ch.hint;
        }
    },

    gameOver() {
        document.getElementById('gameover-score').textContent = forestAdventure.state.score;
        document.getElementById('gameover-text').textContent = `Tapfer gekämpft, ${this.playerName}! Beim nächsten Mal gelingt es dir wieder.`;
        this.showScreen('screen-gameover');
    },

    winGame() {
        if (typeof window !== 'undefined' && typeof window.recordAdventureWin === 'function') {
            window.recordAdventureWin();
        }
        document.getElementById('win-score').textContent = forestAdventure.state.score;
        document.getElementById('win-text').textContent = `${this.playerName}, du hast das Tal gerettet und die Bachglocke wieder zum Klingen gebracht.`;
        this.showScreen('screen-win');
    }
};

document.addEventListener('DOMContentLoaded', () => forestUi.init());
