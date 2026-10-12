// TeachMath - Mathe-Textadventure: "Der Schatz der Zahleninsel"

const adventure = {
    // Spielzustand
    state: {
        currentScene: 'start',
        sceneStep: 0,
        lives: 3,
        score: 0,
        inventory: [],
        completed: false,
        currentChallenge: null,
        wrongAttempts: 0
    },

    // Szenen der Geschichte
    scenes: {
        start: {
            title: '🏙️ Der Hafen von Mathenstadt',
            steps: [
                {
                    text: `Du stehst am Hafen der kleinen Stadt Mathenstadt. Die Sonne geht gerade auf und taucht die Fischerboote in goldenes Licht. Plötzlich siehst du etwas Glitzerndes im Sand. Eine Flasche mit einem Brief darin!<br><br>
                    Du ziehst den Korken heraus und rollst das vergilbte Papier auf. Es ist eine <strong>Schatzkarte</strong>! Oben steht geschrieben:<br><br>
                    <em>"Wer meinen Schatz finden will, muss klug und mutig sein. Löse meine Rätsel — dann gehört der Schatz dir!"</em><br><br>
                    Dein Herz schlägt schneller. Du läufst zum Hafen und mietest ein kleines Segelschiff. Doch der Hafenmeister hält dich auf!`,
                    image: '🍾'
                },
                {
                    text: `<strong>Hafenmeister:</strong> "Halt, junger Abenteurer! Bevor ich dich losschicke, musst du beweisen, dass du Seekarte lesen kannst. Mein Schiff kostet ${null} Goldmünzen pro Tag, und du brauchst ${null} Tage. Wie viel musst du insgesamt bezahlen?"`,
                    challenge: () => {
                        const preis = [12, 15, 18, 20][Math.floor(Math.random() * 4)];
                        const tage = [3, 4, 5, 6][Math.floor(Math.random() * 4)];
                        return {
                            text: `Der Hafenmeister sagt: "Mein Schiff kostet <strong>${preis} Goldmünzen</strong> pro Tag, und du brauchst <strong>${tage} Tage</strong>. Wie viel musst du insgesamt bezahlen?"`,
                            answer: preis * tage,
                            hint: `${preis} × ${tage} = ?`,
                            unit: 'Goldmünzen',
                            successText: `"Ausgezeichnet!" ruft der Hafenmeister und übergibt dir den Schlüssel zum Schiff. "Viel Erfolg, Abenteurer!" Du springst an Bord und setzt die Segel.`
                        };
                    },
                    image: '⚓'
                }
            ],
            nextScene: 'sea'
        },

        sea: {
            title: '⛵ Auf dem Meer',
            steps: [
                {
                    text: `Du segelst seit Stunden über das weite Meer. Die Wellen schaukeln dein Schiff sanft. Plötzlich zieht sich der Himmel zu und ein heftiger Sturm bricht los!<br><br>
                    Die Wellen peitschen über das Deck. Der Kompass dreht sich wild. Du musst schnell handeln! Du greifst zur Schatzkarte und siehst: Die Insel liegt im <strong>Nordosten</strong>, aber du bist vom Kurs abgekommen.`,
                    image: '🌊'
                },
                {
                    text: '',
                    challenge: () => {
                        const kmProStunde = [8, 10, 12, 15][Math.floor(Math.random() * 4)];
                        const stunden = [3, 4, 5, 6][Math.floor(Math.random() * 4)];
                        return {
                            text: `Du schaust auf deine Seekarte. Du fährst mit <strong>${kmProStunde} km/h</strong> und musst noch <strong>${kmProStunde * stunden} km</strong> bis zur Insel. Wie viele Stunden brauchst du noch?`,
                            answer: stunden,
                            hint: `${kmProStunde * stunden} ÷ ${kmProStunde} = ?`,
                            unit: 'Stunden',
                            successText: `"${stunden} Stunden — das stimmt!" Du korrigierst den Kurs und kämpfst gegen den Sturm an. Nach genau ${stunden} Stunden siehst du in der Ferne eine grüne Insel auftauchen!`
                        };
                    },
                    image: '🧭'
                },
                {
                    text: '',
                    challenge: () => {
                        const breite = [30, 40, 50, 60][Math.floor(Math.random() * 4)];
                        const laenge = [80, 100, 120, 150][Math.floor(Math.random() * 4)];
                        return {
                            text: `Während du wartest, schaust du auf die Karte der Insel. Sie ist rechteckig: <strong>${laenge} m lang</strong> und <strong>${breite} m breit</strong>. Du willst wissen, wie groß die Insel ungefähr ist. Wie viel m² hat sie?`,
                            answer: breite * laenge,
                            hint: `Fläche = Länge × Breite = ${laenge} × ${breite}`,
                            unit: 'm²',
                            successText: `Sehr gut gerechnet! Das Schiff legt an. Du springst auf den Strand und blickst auf die unbekannte Insel vor dir.`
                        };
                    },
                    image: '🗺️'
                }
            ],
            nextScene: 'island'
        },

        island: {
            title: '🏝️ Die Zahleninsel',
            steps: [
                {
                    text: `Du betrittst die Insel. Der Sand ist warm unter deinen Füßen, und Palmen wiegen sich im Wind. Ein bunter Papagei landet auf deiner Schulter.<br><br>
                    <strong>Papagei:</strong> "Rätsel! Rätsel! Ohne Rätsel — kein Weiterkommen!"<br><br>
                    Du folgst einem schmalen Pfad in den Dschungel. Nach einer Weile stehst du vor einem alten Steintor. Eine Inschrift liest:`,
                    image: '🦜'
                },
                {
                    text: '',
                    challenge: () => {
                        const a = Math.floor(Math.random() * 8) + 4;
                        const b = Math.floor(Math.random() * 8) + 4;
                        const c = Math.floor(Math.random() * 5) + 2;
                        const answer = (a + b) * c;
                        return {
                            text: `Das Steintor trägt die Inschrift:<br><br><em>"${a} Affen und ${b} Papageien leben auf dieser Insel. Jedes Tier hat ${c} Früchte gesammelt. Wie viele Früchte sind es insgesamt?"</em>`,
                            answer: answer,
                            hint: `(${a} + ${b}) × ${c} = ${a+b} × ${c}`,
                            unit: 'Früchte',
                            successText: `Das Tor öffnet sich mit einem lauten Knarren! Du gehst hindurch und findest dich in einem lichten Waldstück wieder. Der Weg zur Höhle muss nah sein!`
                        };
                    },
                    image: '🚪'
                },
                {
                    text: `Du gehst durch den Wald und findest eine alte Hütte. Drinnen sitzt eine weise alte Frau. Sie schaut dich mit funkelnden Augen an.<br><br>
                    <strong>Weise Frau:</strong> "Ich kenne den Weg zur Schatzhöhle. Aber nur, wer mein Rätsel löst, erfährt ihn!"`,
                    image: '🧙‍♀️'
                },
                {
                    text: '',
                    challenge: () => {
                        const kg = [12, 15, 18, 20, 24][Math.floor(Math.random() * 5)];
                        const umrechnung = kg * 1000;
                        return {
                            text: `Die weise Frau fragt: "Ich habe einen großen Topf mit Schatzsucher-Eintopf. Er wiegt <strong>${kg} kg</strong>. Wie viel Gramm sind das?"`,
                            answer: umrechnung,
                            hint: `1 kg = 1000 g, also ${kg} × 1000 = ?`,
                            unit: 'g',
                            successText: `"Sehr gut!", lacht die alte Frau. Sie flüstert dir den Weg zur Höhle ins Ohr: "Folge dem Bach nach Norden, bis du die drei großen Steine siehst." Du bedankst dich und machst dich auf den Weg.`
                        };
                    },
                    image: '🍲'
                }
            ],
            nextScene: 'cave'
        },

        cave: {
            title: '🗻 Die Schatzhöhle',
            steps: [
                {
                    text: `Du folgst dem Bach und findest die drei großen Steine. Dahinter öffnet sich der Eingang einer dunklen Höhle. Du zündest deine Fackel an und trittst hinein.<br><br>
                    Die Wände glitzern mit Kristallen. Der Gang führt tiefer und tiefer in den Berg. Plötzlich stehst du vor einer massiven Eisentür. Drei Zahlenschlösser blockieren den Weg!`,
                    image: '🕯️'
                },
                {
                    text: '',
                    challenge: () => {
                        const a = Math.floor(Math.random() * 200) + 100;
                        const b = Math.floor(Math.random() * 200) + 100;
                        const c = Math.floor(Math.random() * 100) + 50;
                        const answer = a + b - c;
                        return {
                            text: `<strong>Erstes Schloss:</strong> Auf einem Schild steht:<br><br><em>"${a} + ${b} - ${c} = ?"</em><br><br>Die richtige Zahl öffnet das erste Schloss!`,
                            answer: answer,
                            hint: `Erst ${a} + ${b} = ${a+b}, dann - ${c}`,
                            unit: '',
                            successText: `Klick! Das erste Schloss öffnet sich. Noch zwei!`
                        };
                    },
                    image: '🔒'
                },
                {
                    text: '',
                    challenge: () => {
                        const seite = Math.floor(Math.random() * 8) + 5;
                        const umfang = 4 * seite;
                        return {
                            text: `<strong>Zweites Schloss:</strong> Das Rätsel lautet:<br><br><em>"Ein quadratischer Stein hat eine Seitenlänge von <strong>${seite} cm</strong>. Wie groß ist sein Umfang?"</em>`,
                            answer: umfang,
                            hint: `Umfang Quadrat = 4 × Seite = 4 × ${seite}`,
                            unit: 'cm',
                            successText: `Klick! Zweites Schloss offen. Noch ein letztes Rätsel!`
                        };
                    },
                    image: '🔓'
                },
                {
                    text: '',
                    challenge: () => {
                        // Überschlag: sinnvolle Zahlen für 5. Klasse
                        const a = [19, 21, 29, 31, 38, 42][Math.floor(Math.random() * 6)];
                        const b = [48, 51, 62, 38, 57, 43][Math.floor(Math.random() * 6)];
                        const roundA = Math.round(a / 10) * 10;
                        const roundB = Math.round(b / 10) * 10;
                        const estimate = roundA * roundB;
                        const exact = a * b;
                        return {
                            text: `<strong>Drittes Schloss:</strong> Eine Inschrift warnt:<br><br><em>"Der letzte Wächter verlangt eine Schätzung! ${a} × ${b} — ein grober Überschlag genügt!"</em><br><br>Runde beide Zahlen auf Zehner und multipliziere.`,
                            answer: estimate,
                            hint: `${a} ≈ ${roundA}, ${b} ≈ ${roundB} → ${roundA} × ${roundB}`,
                            unit: '',
                            exact: exact,
                            accept: (x) => x === estimate || Math.abs(x - exact) <= exact * 0.2,
                            successText: `KLICK! Alle drei Schlösser springen auf! Die schwere Eisentür schwingt knarrend auf...`
                        };
                    },
                    image: '🗝️'
                }
            ],
            nextScene: 'treasure'
        },

        treasure: {
            title: '💰 Der Goldschatz!',
            steps: [
                {
                    text: `Du trittst in eine riesige Kammer. Und da — in der Mitte des Raumes — steht eine riesige Holztruhe. Du läufst darauf zu und hebst den Deckel...<br><br>
                    <strong>GOLDMÜNZEN!</strong> Hunderte, nein, tausende glänzende Goldmünzen füllen die Truhe bis zum Rand. Darunter liegt ein letzter Brief:`,
                    image: '📦'
                },
                {
                    text: '',
                    challenge: () => {
                        const reihen = [8, 10, 12][Math.floor(Math.random() * 3)];
                        const spalten = [8, 10, 12][Math.floor(Math.random() * 3)];
                        return {
                            text: `Der Brief liest sich:<br><br><em>"Herzlichen Glückwunsch, tapferer Abenteurer! Der Schatz gehört dir! Die Münzen liegen in ${reihen} Reihen mit je ${spalten} Stapeln. Jeder Stapel enthält 25 Münzen. Wie viele Münzen sind es insgesamt?"</em>`,
                            answer: reihen * spalten * 25,
                            hint: `${reihen} × ${spalten} × 25 = ${reihen * spalten} × 25`,
                            unit: 'Goldmünzen',
                            successText: `🎉🎉🎉 DU HAST DEN SCHATZ GEFUNDEN! 🎉🎉🎉<br><br>Als echter Mathe-Held hast du alle Rätsel gelöst und den Schatz der Zahleninsel entdeckt! Der Piratenkönig hätte seine wahre Freude an dir!`
                        };
                    },
                    image: '💰'
                }
            ],
            nextScene: 'end'
        }
    },

    // Hilfsfunktionen
    getCurrentScene() {
        return this.scenes[this.state.currentScene];
    },

    getCurrentStep() {
        const scene = this.getCurrentScene();
        return scene ? scene.steps[this.state.sceneStep] : null;
    },

    // Nächsten Schritt vorbereiten
    prepareChallenge(step) {
        if (step.challenge) {
            const challenge = step.challenge();
            this.state.currentChallenge = challenge;
            return challenge;
        }
        return null;
    },

    // Antwort prüfen
    checkAnswer(userAnswer) {
        const challenge = this.state.currentChallenge;
        if (!challenge) return false;

        const num = parseFloat(String(userAnswer).replace(',', '.'));
        if (isNaN(num)) return false;

        if (typeof challenge.accept === 'function') {
            return challenge.accept(num);
        }
        return num === challenge.answer;
    }
};
