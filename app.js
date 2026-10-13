// TeachMath - Gamified Math Learning App
// State Management
const state = {
    username: '',
    points: 0,
    level: 1,
    streak: 0,
    dailyProgress: 0,
    totalSolved: 0,
    weeklyGoal: 10,
    weeklyProgress: 0,
    currentDifficulty: 'mittel',
    achievements: [],
    currentTopic: null,
    currentExercise: null,
    exerciseSet: [],
    currentIndex: 0,
    topicStats: {
        geometry: 0,
        wordProblems: 0,
        conversions: 0
    },
    triedTopics: new Set()
};

// Achievements Definition
const achievements = [
    { id: 'first_task', name: 'Erste Schritte', desc: 'Erste Aufgabe gelöst', icon: '🎯', unlocked: false },
    { id: 'daily_done', name: 'Tagessieger', desc: '5 Aufgaben an einem Tag', icon: '🌟', unlocked: false },
    { id: 'weekly_goal', name: 'Ziel erreicht', desc: 'Wöchentliches Lernziel geschafft', icon: '🏁', unlocked: false },
    { id: 'boss_champion', name: 'Boss-Champion', desc: 'Boss-Kampf erfolgreich gemeistert', icon: '👑', unlocked: false },
    { id: 'streak_3', name: 'Durchhaltevermögen', desc: '3 Tage am Stück', icon: '🔥', unlocked: false },
    { id: 'level_3', name: 'Fortgeschritten', desc: 'Level 3 erreicht', icon: '🚀', unlocked: false },
    { id: 'level_5', name: 'Experte', desc: 'Level 5 erreicht', icon: '🤓', unlocked: false },
    { id: 'perfect_5', name: 'Perfekt!', desc: '5 richtige hintereinander', icon: '💯', unlocked: false },
    { id: 'geometry_master', name: 'Geometrie-Profi', desc: '10 Geometrie-Aufgaben', icon: '🔺', unlocked: false },
    { id: 'word_wizard', name: 'Textaufgaben-Held', desc: '10 Sachaufgaben', icon: '📖', unlocked: false },
    { id: 'conversion_king', name: 'Umrechnungs-König', desc: '10 Umrechnungen', icon: '📍', unlocked: false },
    { id: 'math_master', name: 'Mathe-Meister', desc: '100 Aufgaben gelöst', icon: '👑', unlocked: false },
    { id: 'speed_demon', name: 'Blitzrechner', desc: '20 Aufgaben in einer Session', icon: '⚡', unlocked: false },
    { id: 'all_topics', name: 'Allrounder', desc: 'Alle Themen ausprobiert', icon: '🎓', unlocked: false }
];

const difficultyPools = {
    leicht: ['addition', 'subtraction', 'wordProblem', 'lengthConversion', 'rectanglePerimeter', 'timeConversion'],
    mittel: ['multiplication', 'division', 'orderOfOperations', 'brackets', 'weightConversion', 'rectangleArea', 'complexWordProblem'],
    schwer: ['estimation', 'numberSequence', 'findError', 'placeholder', 'complexWordProblem', 'cuboidVolume', 'rounding']
};

// Exercise Generators - Umfangreiche 5. Klasse Themen
const exerciseGenerators = {
    // Grundrechenarten
    addition: () => {
        const a = Math.floor(Math.random() * 900) + 100;  // 100-999
        const b = Math.floor(Math.random() * 900) + 100;
        return {
            question: `${a} + ${b} = ?`,
            answer: a + b,
            topic: 'Addition',
            type: 'input',
            hint: 'Tipp: Rechne schriftlich!'
        };
    },
    
    subtraction: () => {
        const a = Math.floor(Math.random() * 900) + 100;
        const b = Math.floor(Math.random() * (a - 10)) + 10;
        return {
            question: `${a} - ${b} = ?`,
            answer: a - b,
            topic: 'Subtraktion',
            type: 'input',
            hint: 'Tipp: Schriftlich subtrahieren!'
        };
    },
    
    multiplication: () => {
        const a = Math.floor(Math.random() * 13) + 3;
        const b = Math.floor(Math.random() * 13) + 3;
        const answer = a * b;
        
        const choices = [answer];
        while (choices.length < 4) {
            const wrong = answer + Math.floor(Math.random() * 30) - 15;
            if (wrong > 0 && !choices.includes(wrong)) {
                choices.push(wrong);
            }
        }
        choices.sort(() => Math.random() - 0.5);
        
        return {
            question: `${a} × ${b} = ?`,
            answer: answer,
            choices: choices,
            topic: 'Multiplikation',
            type: 'choice'
        };
    },
    
    division: () => {
        const b = Math.floor(Math.random() * 10) + 2;
        const result = Math.floor(Math.random() * 20) + 5;
        const a = b * result;
        
        return {
            question: `${a} : ${b} = ?`,
            answer: result,
            topic: 'Division',
            type: 'input'
        };
    },
    
    // Rechenregeln: Punkt vor Strich
    orderOfOperations: () => {
        const a = Math.floor(Math.random() * 10) + 2;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 10) + 2;
        
        const operations = [
            { q: `${a} + ${b} × ${c}`, a: a + (b * c), op: '+×' },
            { q: `${a} × ${b} + ${c}`, a: (a * b) + c, op: '×+' },
            { q: `${a + b * c} - ${b} × ${c}`, a: a, op: '-×' }
        ];
        
        const ex = operations[Math.floor(Math.random() * operations.length)];
        
        return {
            question: `${ex.q} = ?`,
            answer: ex.a,
            topic: 'Punkt vor Strich',
            type: 'input',
            hint: 'Denk an: Punkt vor Strich!'
        };
    },
    
    // Klammern
    brackets: () => {
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 10) + 2;
        const c = Math.floor(Math.random() * 10) + 2;
        
        const operations = [
            { q: `(${a} + ${b}) × ${c}`, a: (a + b) * c },
            { q: `(${a} - ${b}) × ${c}`, a: (a - b) * c },
            { q: `${c} × (${a} + ${b})`, a: c * (a + b) }
        ];
        
        const ex = operations[Math.floor(Math.random() * operations.length)];
        
        return {
            question: `${ex.q} = ?`,
            answer: ex.a,
            topic: 'Klammern',
            type: 'input',
            hint: 'Klammer zuerst ausrechnen!'
        };
    },
    
    // Runden
    rounding: () => {
        const num = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
        const roundTo = [10, 100, 1000][Math.floor(Math.random() * 3)];
        
        let answer;
        if (roundTo === 10) {
            answer = Math.round(num / 10) * 10;
        } else if (roundTo === 100) {
            answer = Math.round(num / 100) * 100;
        } else {
            answer = Math.round(num / 1000) * 1000;
        }
        
        const roundText = roundTo === 10 ? 'auf Zehner' : roundTo === 100 ? 'auf Hunderter' : 'auf Tausender';
        
        return {
            question: `Runde ${num} ${roundText}`,
            answer: answer,
            topic: 'Runden',
            type: 'input',
            hint: `Auf ${roundTo} runden`
        };
    },
    
    // Größen: Längen umrechnen
    lengthConversion: () => {
        const conversions = [
            { from: 'm', to: 'cm', factor: 100 },
            { from: 'cm', to: 'mm', factor: 10 },
            { from: 'km', to: 'm', factor: 1000 },
            { from: 'm', to: 'km', factor: 0.001 }
        ];
        
        const conv = conversions[Math.floor(Math.random() * conversions.length)];
        const value = conv.factor >= 1 ? Math.floor(Math.random() * 20) + 1 : Math.floor(Math.random() * 5000) + 1000;
        const answer = value * conv.factor;
        
        return {
            question: `${value} ${conv.from} = ? ${conv.to}`,
            answer: answer,
            topic: 'Längen umrechnen',
            type: 'input',
            hint: `1 ${conv.from} = ${conv.factor} ${conv.to}`
        };
    },
    
    // Größen: Gewicht umrechnen
    weightConversion: () => {
        const conversions = [
            { from: 'kg', to: 'g', factor: 1000 },
            { from: 'g', to: 'mg', factor: 1000 },
            { from: 't', to: 'kg', factor: 1000 }
        ];
        
        const conv = conversions[Math.floor(Math.random() * conversions.length)];
        const value = Math.floor(Math.random() * 50) + 1;
        const answer = value * conv.factor;
        
        return {
            question: `${value} ${conv.from} = ? ${conv.to}`,
            answer: answer,
            topic: 'Gewicht umrechnen',
            type: 'input',
            hint: `1 ${conv.from} = ${conv.factor} ${conv.to}`
        };
    },
    
    // Größen: Zeit umrechnen
    timeConversion: () => {
        const conversions = [
            { from: 'min', to: 's', factor: 60, q: 'Minuten in Sekunden' },
            { from: 'h', to: 'min', factor: 60, q: 'Stunden in Minuten' },
            { from: 'd', to: 'h', factor: 24, q: 'Tage in Stunden' }
        ];
        
        const conv = conversions[Math.floor(Math.random() * conversions.length)];
        const value = Math.floor(Math.random() * 10) + 1;
        const answer = value * conv.factor;
        
        return {
            question: `${value} ${conv.from} = ? ${conv.to}`,
            answer: answer,
            topic: 'Zeit umrechnen',
            type: 'input',
            hint: conv.q
        };
    },
    
    // Geometrie: Umfang Rechteck
    rectanglePerimeter: () => {
        const length = Math.floor(Math.random() * 20) + 5;
        const width = Math.floor(Math.random() * 15) + 3;
        const answer = 2 * (length + width);
        
        return {
            question: `Ein Rechteck ist ${length} cm lang und ${width} cm breit. Wie groß ist der Umfang?`,
            answer: answer,
            topic: 'Umfang Rechteck',
            type: 'input',
            hint: 'Umfang = 2 × (Länge + Breite)',
            unit: 'cm'
        };
    },
    
    // Geometrie: Flächeninhalt Rechteck
    rectangleArea: () => {
        const length = Math.floor(Math.random() * 20) + 5;
        const width = Math.floor(Math.random() * 15) + 3;
        const answer = length * width;
        
        return {
            question: `Ein Rechteck ist ${length} cm lang und ${width} cm breit. Wie groß ist der Flächeninhalt?`,
            answer: answer,
            topic: 'Fläche Rechteck',
            type: 'input',
            hint: 'Fläche = Länge × Breite',
            unit: 'cm²'
        };
    },
    
    // Geometrie: Volumen Quader
    cuboidVolume: () => {
        const length = Math.floor(Math.random() * 10) + 3;
        const width = Math.floor(Math.random() * 10) + 3;
        const height = Math.floor(Math.random() * 10) + 3;
        const answer = length * width * height;
        
        return {
            question: `Ein Quader ist ${length} cm lang, ${width} cm breit und ${height} cm hoch. Wie groß ist das Volumen?`,
            answer: answer,
            topic: 'Volumen Quader',
            type: 'input',
            hint: 'Volumen = Länge × Breite × Höhe',
            unit: 'cm³'
        };
    },

    // Boss-Kampf: kombinierte Aufgaben mit mehreren Rechenschritten
    bossArena: () => {
        const a = Math.floor(Math.random() * 20) + 8;
        const b = Math.floor(Math.random() * 15) + 5;
        const c = Math.floor(Math.random() * 12) + 4;
        const mode = ['double', 'bracket', 'mixed'][Math.floor(Math.random() * 3)];

        if (mode === 'double') {
            const answer = (a * b) + c;
            return {
                question: `Boss-Aufgabe: ${a} × ${b} + ${c} = ?`,
                answer,
                topic: 'Boss: Arena',
                type: 'input',
                hint: 'Punkt vor Strich: zuerst multiplizieren, dann addieren.',
                unit: ''
            };
        }

        if (mode === 'bracket') {
            const answer = (a + b) * c;
            return {
                question: `Boss-Aufgabe: (${a} + ${b}) × ${c} = ?`,
                answer,
                topic: 'Boss: Arena',
                type: 'input',
                hint: 'Klammern zuerst, dann multiplizieren.',
                unit: ''
            };
        }

        const answer = a * (b + c) - 2;
        return {
            question: `Boss-Aufgabe: ${a} × (${b} + ${c}) - 2 = ?`,
            answer,
            topic: 'Boss: Arena',
            type: 'input',
            hint: 'Klammer zuerst, dann multiplizieren und am Ende subtrahieren.',
            unit: ''
        };
    },

    bossGeometry: () => {
        const length = Math.floor(Math.random() * 18) + 6;
        const width = Math.floor(Math.random() * 12) + 4;
        const height = Math.floor(Math.random() * 10) + 3;
        const taskType = ['umfang', 'flaeche', 'volumen'][Math.floor(Math.random() * 3)];

        if (taskType === 'umfang') {
            return {
                question: `Boss-Aufgabe: Ein Rechteck hat die Seiten ${length} cm und ${width} cm. Wie groß ist der Umfang?`,
                answer: 2 * (length + width),
                topic: 'Boss: Geometrie',
                type: 'input',
                hint: 'Umfang = 2 × (Länge + Breite)',
                unit: 'cm'
            };
        }

        if (taskType === 'flaeche') {
            return {
                question: `Boss-Aufgabe: Ein Rechteck hat die Seiten ${length} cm und ${width} cm. Wie groß ist der Flächeninhalt?`,
                answer: length * width,
                topic: 'Boss: Geometrie',
                type: 'input',
                hint: 'Fläche = Länge × Breite',
                unit: 'cm²'
            };
        }

        return {
            question: `Boss-Aufgabe: Ein Quader ist ${length} cm lang, ${width} cm breit und ${height} cm hoch. Wie groß ist sein Volumen?`,
            answer: length * width * height,
            topic: 'Boss: Geometrie',
            type: 'input',
            hint: 'Volumen = Länge × Breite × Höhe',
            unit: 'cm³'
        };
    },

    bossLogic: () => {
        const a = Math.floor(Math.random() * 80) + 20;
        const b = Math.floor(Math.random() * 40) + 10;
        const c = Math.floor(Math.random() * 55) + 15;
        const answer = a + b - c;

        return {
            question: `Boss-Aufgabe: ${a} + ${b} - ${c} = ?`,
            answer,
            topic: 'Boss: Logik',
            type: 'input',
            hint: 'Erst addieren, dann subtrahieren.',
            unit: ''
        };
    },

    bossMultiStep: () => {
        const a = Math.floor(Math.random() * 23) + 7;
        const b = Math.floor(Math.random() * 18) + 4;
        const c = Math.floor(Math.random() * 9) + 2;
        const answer = (a * b) / c;

        return {
            question: `Boss-Aufgabe: (${a} × ${b}) : ${c} = ?`,
            answer,
            topic: 'Boss: Mehrschritt',
            type: 'input',
            hint: 'Rechne zuerst die Multiplikation und teile dann durch die letzte Zahl.',
            unit: ''
        };
    },
    
    // Sachaufgaben: Einfache Textaufgaben
    wordProblem: () => {
        const problems = [
            {
                text: (a, b) => `Lisa kauft ${a} Äpfel für je ${b} Cent. Wie viel zahlt sie insgesamt?`,
                calc: (a, b) => a * b,
                unit: 'Cent'
            },
            {
                text: (a, b) => `Ein Bus fährt mit ${a} Personen los. An der nächsten Haltestelle steigen ${b} Personen aus. Wie viele sind noch im Bus?`,
                calc: (a, b) => a - b,
                unit: 'Personen'
            },
            {
                text: (a, b) => `Max hat ${a} Euro und bekommt von seiner Oma ${b} Euro geschenkt. Wie viel hat er jetzt?`,
                calc: (a, b) => a + b,
                unit: 'Euro'
            },
            {
                // a = Preis pro Stift in Cent, b = Anzahl Stifte -> Gesamtpreis geht immer glatt auf
                text: (a, b) => `Eine Packung mit ${b} Stiften kostet ${a * b} Cent. Wie viel kostet ein Stift?`,
                calc: (a, b) => a,
                unit: 'Cent'
            }
        ];
        
        const prob = problems[Math.floor(Math.random() * problems.length)];
        const a = Math.floor(Math.random() * 50) + 25; // 25-74 (immer größer als b -> kein negatives Ergebnis)
        const b = Math.floor(Math.random() * 20) + 2;  // 2-21
        
        return {
            question: prob.text(a, b),
            answer: prob.calc(a, b),
            topic: 'Sachaufgabe',
            type: 'input',
            hint: 'Lies genau und überlege: Was ist gesucht?',
            unit: prob.unit
        };
    },
    
    // Zahlenstrahl
    numberLine: () => {
        const start = Math.floor(Math.random() * 100);
        const step = [5, 10, 20, 25, 50][Math.floor(Math.random() * 5)];
        const steps = Math.floor(Math.random() * 5) + 2;
        const answer = start + (step * steps);
        
        return {
            question: `Auf dem Zahlenstrahl startest du bei ${start}. Du gehst ${steps} Schritte à ${step} nach rechts. Wo bist du dann?`,
            answer: answer,
            topic: 'Zahlenstrahl',
            type: 'input',
            hint: 'Rechne: Start + (Schritte × Schrittgröße)'
        };
    },
    
    // Überschlagsrechnung
    estimation: () => {
        // Zufällige Zahlen: eine zwei- bis dreistellig, eine drei- bis vierstellig
        const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const a = randRange(12, 989);
        const b = randRange(110, 4900);
        
        // Auf die erste Ziffer runden (z.B. 73 -> 70, 195 -> 200, 2219 -> 2000)
        const roundLeading = (n) => {
            const mag = Math.pow(10, Math.floor(Math.log10(n)));
            return Math.round(n / mag) * mag;
        };
        const roundA = roundLeading(a);
        const roundB = roundLeading(b);
        const estimate = roundA * roundB;
        const exact = a * b;
        
        return {
            question: `Führe eine Überschlagsrechnung durch: ${a} · ${b} ≈ ?`,
            answer: estimate,
            topic: 'Überschlagsrechnung',
            type: 'input',
            // Jeder sinnvolle Überschlag wird akzeptiert: max. 30 % vom genauen Ergebnis entfernt
            accept: (x) => x === estimate || Math.abs(x - exact) <= exact * 0.3,
            hint: `Runde auf glatte Zahlen, z.B. ${roundA} · ${roundB} = ${estimate}. (Genau wären es ${exact})`
        };
    },
    
    // Zahlenfolgen (Operatorketten) - vereinfacht für 5. Klasse
    numberSequence: () => {
        // Starte mit einer durch 2, 3, 4 oder 5 teilbaren Zahl
        const divisors = [2, 3, 4, 5];
        const divisor = divisors[Math.floor(Math.random() * divisors.length)];
        const startBase = Math.floor(Math.random() * 10) + 5; // 5-14
        const start = startBase * divisor; // Damit Division aufgeht
        
        // Einfachere Operationen
        const ops = [
            { op: '+10', val: 10 },
            { op: '+20', val: 20 },
            { op: '-10', val: -10 },
            { op: '-5', val: -5 },
            { op: '·2', val: 2, mult: true },
            { op: '·3', val: 3, mult: true },
            { op: ':2', val: 2, div: true },
            { op: ':3', val: 3, div: true },
            { op: ':5', val: 5, div: true }
        ];
        
        const chain = [];
        let current = start;
        const steps = 2; // Nur 2 Schritte für 5. Klasse
        
        for (let i = 0; i < steps; i++) {
            const op = ops[Math.floor(Math.random() * ops.length)];
            
            // Prüfe bei Division ob es aufgeht
            if (op.div && current % op.val !== 0) {
                // Versuche eine andere Operation
                i--;
                continue;
            }
            
            chain.push(op);
            
            if (op.mult) {
                current = current * op.val;
            } else if (op.div) {
                current = current / op.val;
            } else {
                current = current + op.val;
            }
            
            // Verhindere zu große oder negative Zahlen
            if (current > 500 || current < 0) {
                // Starte neu
                return exerciseGenerators.numberSequence();
            }
        }
        
        const chainText = chain.map(c => c.op).join(' → ');
        
        return {
            question: `Ergänze die Zahlenfolge: ${start} → ${chainText} → ?`,
            answer: current,
            topic: 'Zahlenfolge',
            type: 'input',
            hint: 'Führe die Operationen nacheinander aus'
        };
    },
    
    // Fehler finden (falsch gerechnete Aufgaben)
    findError: () => {
        const problems = [
            { q: '3234 · 24', wrong: 1931, correct: 77616, error: 'Fehler bei der Multiplikation' },
            { q: '2174 · 924', wrong: 7276, correct: 2008776, error: 'Stellenwertfehler' },
            { q: '4172 · 182', wrong: 13636, correct: 759304, error: 'Übertragungsfehler' },
            { q: '2190 · 640', wrong: 13440, correct: 1401600, error: 'Nullen vergessen' }
        ];
        
        const prob = problems[Math.floor(Math.random() * problems.length)];
        
        return {
            question: `Die Rechnung "${prob.q} = ${prob.wrong}" ist falsch. Was ist das richtige Ergebnis?`,
            answer: prob.correct,
            topic: 'Fehler finden',
            type: 'input',
            hint: prob.error
        };
    },
    
    // Platzhalter-Aufgaben
    placeholder: () => {
        const operations = [
            { template: (a, b) => `${a} · □ = ${a * b}`, answer: (a, b) => b, hint: 'Division hilft!' },
            { template: (a, b) => `□ · ${b} = ${a * b}`, answer: (a, b) => a, hint: 'Teile durch die bekannte Zahl' },
            { template: (a, b) => `${a * b} : □ = ${a}`, answer: (a, b) => b, hint: 'Welche Zahl passt?' },
            { template: (a, b) => `17 · □ = ${17 * a}`, answer: (a, b) => a, hint: '17 · ? = Ergebnis' },
            { template: (a, b) => `□ - ${a} = ${b}`, answer: (a, b) => a + b, hint: 'Addition hilft!' },
            { template: (a, b) => `${a + b} - □ = ${b}`, answer: (a, b) => a, hint: 'Subtraktion umkehren' }
        ];
        
        const op = operations[Math.floor(Math.random() * operations.length)];
        const a = Math.floor(Math.random() * 20) + 2;
        const b = Math.floor(Math.random() * 20) + 2;
        
        return {
            question: `Ergänze die fehlende Zahl: ${op.template(a, b)}`,
            answer: op.answer(a, b),
            topic: 'Platzhalter',
            type: 'input',
            hint: op.hint
        };
    },
    
    // Komplexe Sachaufgaben (wie Buchaufgabe)
    complexWordProblem: () => {
        const problems = [
            {
                text: 'Ein Buch hat 240 Seiten. Jede Seite enthält etwa 42 Zeilen und jede Zeile 60 Buchstaben. Wie viele Buchstaben enthält das Buch etwa?',
                calc: () => 240 * 42 * 60,
                unit: 'Buchstaben'
            },
            {
                text: 'Ein Schwimmbad hat 25 Bahnen. Jede Bahn ist 50 m lang. Wie viele Meter schwimmt man, wenn man 8 Bahnen komplett schwimmt?',
                calc: () => 50 * 8,
                unit: 'm'
            },
            {
                text: 'Eine Schule hat 24 Klassen mit je 28 Schülern. Wie viele Schüler besuchen die Schule insgesamt?',
                calc: () => 24 * 28,
                unit: 'Schüler'
            },
            {
                text: 'Ein Parkhaus hat 6 Etagen mit je 45 Parkplätzen pro Etage. Wie viele Autos passen insgesamt ins Parkhaus?',
                calc: () => 6 * 45,
                unit: 'Autos'
            },
            {
                text: 'Ein Kino verkauft an einem Wochenende 15 Vorstellungen mit je 180 Plätzen. Alle Vorstellungen sind ausverkauft. Wie viele Tickets wurden verkauft?',
                calc: () => 15 * 180,
                unit: 'Tickets'
            }
        ];
        
        const prob = problems[Math.floor(Math.random() * problems.length)];
        
        return {
            question: prob.text,
            answer: prob.calc(),
            topic: 'Sachaufgabe (komplex)',
            type: 'input',
            hint: 'Überlege: Welche Zahlen musst du multiplizieren?',
            unit: prob.unit
        };
    }
};

// Initialize App
function init() {
    loadState();
    
    if (state.username) {
        showScreen('dashboard');
        document.getElementById('nav').classList.remove('hidden');
    } else {
        showScreen('welcome-screen');
    }
    
    updateUI();
    attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
    document.getElementById('start-btn').addEventListener('click', startApp);
    document.getElementById('start-challenge').addEventListener('click', () => startTraining('mixed'));
    document.getElementById('check-btn').addEventListener('click', checkAnswer);
    document.getElementById('next-btn').addEventListener('click', nextExercise);
    document.getElementById('quit-btn').addEventListener('click', quitTraining);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('goal-select').addEventListener('change', (e) => {
        state.weeklyGoal = Number(e.target.value);
        if (state.weeklyProgress > state.weeklyGoal) {
            state.weeklyProgress = state.weeklyGoal;
        }
        saveState();
        updateUI();
    });

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.currentDifficulty = btn.dataset.difficulty;
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.toggle('active', b === btn));
            saveState();
            updateUI();
        });
    });
    
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            showScreen(e.target.dataset.view);
        });
    });
    
    // Topic cards
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const topic = e.currentTarget.dataset.topic;
            if (!topic) return; // Abenteuer-Karten haben eigene Links
            if (!e.currentTarget.classList.contains('locked')) {
                startTraining(topic);
            }
        });
    });
    
    // Enter key in answer input
    document.getElementById('answer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !document.getElementById('check-btn').classList.contains('hidden')) {
            checkAnswer();
        }
    });
}

// Start App
function startApp() {
    const username = document.getElementById('username-input').value.trim();
    
    if (!username) {
        alert('Bitte gib deinen Namen ein!');
        return;
    }
    
    state.username = username;
    state.streak = 0;
    updateLastActive();
    saveState();
    
    document.getElementById('nav').classList.remove('hidden');
    showScreen('dashboard');
    updateUI();
    
    showModal('🎉 Willkommen!', `Hallo ${username}! Lass uns zusammen Mathe lernen!`);
}

// Start Training
function startTraining(topic) {
    state.currentTopic = topic;
    state.exerciseSet = generateExerciseSet(topic, 5);
    state.currentIndex = 0;
    state.currentSessionCorrect = 0; // Reset counter
    
    // Track tried topics
    if (!state.triedTopics) {
        state.triedTopics = new Set();
    }
    state.triedTopics.add(topic);
    
    showScreen('training');
    loadExercise();
}

// Generate Exercise Set
function generateExerciseSet(topic, count) {
    const exercises = [];
    const baseDifficulty = difficultyPools[state.currentDifficulty] || difficultyPools.mittel;
    
    const topicMappings = {
        'addition': ['addition', 'subtraction'],
        'multiplication': ['multiplication', 'division'],
        'conversions': ['lengthConversion', 'weightConversion', 'timeConversion'],
        'geometry': ['rectanglePerimeter', 'rectangleArea', 'cuboidVolume'],
        'advanced': ['orderOfOperations', 'brackets', 'rounding', 'numberLine', 'numberSequence', 'findError', 'placeholder'],
        'wordProblems': ['wordProblem', 'complexWordProblem'],
        'challenge': ['estimation', 'numberSequence', 'findError', 'placeholder', 'complexWordProblem'],
        'boss': ['bossArena', 'bossGeometry', 'bossLogic', 'bossMultiStep']
    };
    
    for (let i = 0; i < count; i++) {
        let types;
        
        if (topic === 'mixed') {
            types = [...baseDifficulty];
        } else if (topicMappings[topic]) {
            types = [...topicMappings[topic]];
        } else if (exerciseGenerators[topic]) {
            types = [topic];
        } else {
            types = ['addition', 'subtraction', 'multiplication', 'division'];
        }

        if (state.currentDifficulty === 'leicht') {
            types = types.filter(type => !['estimation', 'numberSequence', 'findError', 'placeholder', 'complexWordProblem', 'cuboidVolume', 'rounding'].includes(type));
        }
        
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        if (!exerciseGenerators[randomType]) {
            continue;
        }
        
        exercises.push(exerciseGenerators[randomType]());
    }
    
    return exercises;
}

// Load Exercise
function loadExercise() {
    const exercise = state.exerciseSet[state.currentIndex];
    state.currentExercise = exercise;
    
    document.getElementById('current-topic').textContent = exercise.topic;
    document.getElementById('task-number').textContent = state.currentIndex + 1;
    document.getElementById('question').textContent = exercise.question;
    
    const progress = ((state.currentIndex + 1) / state.exerciseSet.length) * 100;
    document.getElementById('exercise-progress-bar').style.width = `${progress}%`;
    
    // Setup answer input
    if (exercise.type === 'input') {
        document.getElementById('answer-input-container').classList.remove('hidden');
        document.getElementById('answer-choices').classList.add('hidden');
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();
    } else {
        document.getElementById('answer-input-container').classList.add('hidden');
        document.getElementById('answer-choices').classList.remove('hidden');
        renderChoices(exercise.choices);
    }
    
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('check-btn').classList.remove('hidden');
    document.getElementById('next-btn').classList.add('hidden');
}

// Render Choices
function renderChoices(choices) {
    const container = document.getElementById('answer-choices');
    container.innerHTML = '';
    
    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
        container.appendChild(btn);
    });
}

// Check Answer
function checkAnswer() {
    let userAnswer;
    
    if (state.currentExercise.type === 'input') {
        const raw = document.getElementById('answer-input').value.trim();
        if (raw === '') {
            showFeedback(false, 'Bitte gib eine Antwort ein!');
            return;
        }
        userAnswer = parseFloat(raw.replace(',', '.'));
    } else {
        const selected = document.querySelector('.choice-btn.selected');
        if (!selected) {
            showFeedback(false, 'Bitte wähle eine Antwort!');
            return;
        }
        userAnswer = parseInt(selected.textContent);
    }
    
    const ex = state.currentExercise;
    const correct = typeof ex.accept === 'function'
        ? ex.accept(userAnswer)
        : userAnswer === ex.answer;
    
    if (correct) {
        const points = 20;
        state.points += points;
        state.dailyProgress++;
        state.totalSolved++;
        state.weeklyProgress++;
        
        // Track correct answers in current session
        if (!state.currentSessionCorrect) {
            state.currentSessionCorrect = 0;
        }
        state.currentSessionCorrect++;
        
        // Track topic-specific stats
        const topic = state.currentExercise.topic;
        if (topic.includes('Geometrie') || topic.includes('Umfang') || topic.includes('Fläche') || topic.includes('Volumen')) {
            state.topicStats.geometry++;
        } else if (topic.includes('Sachaufgabe')) {
            state.topicStats.wordProblems++;
        } else if (topic.includes('umrechnen')) {
            state.topicStats.conversions++;
        }
        
        checkLevelUp();
        checkAchievements();
        
        showFeedback(true, `🎉 Richtig! +${points} Punkte`);
    } else {
        showFeedback(false, `❌ Leider falsch. Die richtige Antwort ist ${state.currentExercise.answer}`);
    }
    
    document.getElementById('check-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
    
    saveState();
    updateUI();
}

// Show Feedback
function showFeedback(correct, message) {
    const feedback = document.getElementById('feedback');
    let displayMessage = message;
    
    // Add unit if present
    if (state.currentExercise.unit && correct) {
        displayMessage += ` ${state.currentExercise.unit}`;
    }
    
    // Show hint if wrong and hint exists
    if (!correct && state.currentExercise.hint) {
        displayMessage += `<br><small>${state.currentExercise.hint}</small>`;
    }
    
    feedback.innerHTML = displayMessage;
    feedback.className = 'feedback ' + (correct ? 'correct' : 'incorrect');
    feedback.classList.remove('hidden');
    
    if (correct) {
        playSound('success');
    }
}

// Next Exercise
function nextExercise() {
    state.currentIndex++;
    
    if (state.currentIndex < state.exerciseSet.length) {
        loadExercise();
    } else {
        finishTraining();
    }
}

// Finish Training
function finishTraining() {
    const correctCount = state.currentSessionCorrect || 0;
    const totalPoints = correctCount * 20;
    
    showModal(
        '🎉 Training abgeschlossen!',
        `<p>Du hast <strong>${correctCount}/${state.exerciseSet.length}</strong> Aufgaben richtig gelöst!</p>
        <p>Punkte verdient: <strong>${totalPoints}</strong> ⭐</p>`
    );
    
    // Reset session counter
    state.currentSessionCorrect = 0;
    
    showScreen('dashboard');
}

// Quit Training
function quitTraining() {
    if (confirm('Möchtest du das Training wirklich abbrechen?')) {
        showScreen('dashboard');
    }
}

// Check Level Up
function checkLevelUp() {
    const pointsForNextLevel = state.level * 100;
    
    if (state.points >= pointsForNextLevel) {
        state.level++;
        showModal('🎊 Level Up!', `Du bist jetzt Level ${state.level}!`);
        
        if (state.level === 3) {
            unlockAchievement('level_3');
        }
        if (state.level === 5) {
            unlockAchievement('level_5');
        }
    }
}

// Check Achievements
function checkAchievements() {
    if (state.dailyProgress === 1) {
        unlockAchievement('first_task');
    }
    
    if (state.dailyProgress >= 5) {
        unlockAchievement('daily_done');
    }

    if (state.weeklyProgress >= state.weeklyGoal) {
        unlockAchievement('weekly_goal');
    }

    if (state.currentTopic === 'boss' && state.currentSessionCorrect >= 3) {
        unlockAchievement('boss_champion');
    }
    
    // Topic-specific achievements
    if (state.topicStats.geometry >= 10) {
        unlockAchievement('geometry_master');
    }
    
    if (state.topicStats.wordProblems >= 10) {
        unlockAchievement('word_wizard');
    }
    
    if (state.topicStats.conversions >= 10) {
        unlockAchievement('conversion_king');
    }
    
    // Total solved
    if (state.totalSolved >= 100) {
        unlockAchievement('math_master');
    }
    
    // All topics tried
    if (state.triedTopics.size >= 6) {
        unlockAchievement('all_topics');
    }
    
    // Session achievements
    if (state.currentSessionCorrect >= 20) {
        unlockAchievement('speed_demon');
    }
}

// Unlock Achievement
function unlockAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        state.achievements.push(id);
        
        showModal('🏆 Erfolg freigeschaltet!', `<div style="font-size: 3rem; margin: 20px 0;">${achievement.icon}</div><p><strong>${achievement.name}</strong></p><p>${achievement.desc}</p>`);
        
        saveState();
        renderAchievements();
    }
}

// Render Achievements
function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    container.innerHTML = '';
    
    achievements.forEach(ach => {
        const div = document.createElement('div');
        div.className = 'achievement' + (ach.unlocked ? ' unlocked' : '');
        div.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-name">${ach.name}</div>
            <div class="achievement-desc">${ach.desc}</div>
        `;
        container.appendChild(div);
    });
}

// Show Modal
function showModal(title, body) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('success-modal').classList.remove('hidden');
}

// Close Modal
function closeModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

// Show Screen
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    document.getElementById(screenId).classList.remove('hidden');
    
    if (screenId === 'achievements') {
        renderAchievements();
    }
}

// Update UI
function updateUI() {
    if (state.username) {
        document.getElementById('username-display').textContent = state.username;
    }
    
    document.getElementById('points').textContent = state.points;
    document.getElementById('level').textContent = state.level;
    document.getElementById('streak').textContent = state.streak;

    const goalSelect = document.getElementById('goal-select');
    if (goalSelect) {
        goalSelect.value = String(state.weeklyGoal);
    }

    const goalProgress = Math.min((state.weeklyProgress / state.weeklyGoal) * 100, 100);
    const goalProgressElement = document.getElementById('goal-progress');
    if (goalProgressElement) {
        goalProgressElement.style.width = `${goalProgress}%`;
    }

    const goalProgressText = document.getElementById('goal-progress-text');
    if (goalProgressText) {
        goalProgressText.textContent = `${state.weeklyProgress}/${state.weeklyGoal}`;
    }

    const goalBadge = document.getElementById('goal-badge');
    if (goalBadge) {
        goalBadge.textContent = state.weeklyProgress >= state.weeklyGoal ? 'Ziel erreicht' : 'Im Plan';
    }

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === state.currentDifficulty);
    });
    
    const dailyPercent = (state.dailyProgress / 5) * 100;
    document.getElementById('daily-progress').style.width = `${Math.min(dailyPercent, 100)}%`;
    document.getElementById('daily-done').textContent = state.dailyProgress;
    
    const pointsForNextLevel = state.level * 100;
    const levelProgress = (state.points / pointsForNextLevel) * 100;
    document.getElementById('level-progress').style.width = `${Math.min(levelProgress, 100)}%`;
    document.getElementById('points-to-level').textContent = Math.max(0, pointsForNextLevel - state.points);
}

// Play Sound (optional, can be disabled)
function playSound(type) {
    // Optional: Add sound effects here
    // For now, just a console log
    console.log(`Sound: ${type}`);
}

// Update Last Active
function updateLastActive() {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem('lastActive');
    
    if (lastActive === today) {
        // Same day
    } else if (lastActive) {
        const lastDate = new Date(lastActive);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            state.streak++;
            if (state.streak >= 3) {
                unlockAchievement('streak_3');
            }
        } else {
            state.streak = 1;
        }
    } else {
        state.streak = 1;
    }
    
    localStorage.setItem('lastActive', today);
}

// Save State
function saveState() {
    // Convert Set to Array for JSON
    const saveData = {
        ...state,
        triedTopics: Array.from(state.triedTopics || [])
    };
    
    localStorage.setItem('teachmath_state', JSON.stringify(saveData));
    
    // Sync achievements
    achievements.forEach(ach => {
        if (state.achievements.includes(ach.id)) {
            ach.unlocked = true;
        }
    });
}

// Load State
function loadState() {
    const saved = localStorage.getItem('teachmath_state');
    
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(state, loaded);
        
        // Convert Array back to Set
        if (Array.isArray(loaded.triedTopics)) {
            state.triedTopics = new Set(loaded.triedTopics);
        } else {
            state.triedTopics = new Set();
        }
        
        // Initialize missing properties
        if (!state.topicStats) {
            state.topicStats = { geometry: 0, wordProblems: 0, conversions: 0 };
        }
        if (!state.totalSolved) {
            state.totalSolved = 0;
        }
        if (!state.weeklyGoal) {
            state.weeklyGoal = 10;
        }
        if (!state.weeklyProgress) {
            state.weeklyProgress = 0;
        }
        if (!state.currentDifficulty) {
            state.currentDifficulty = 'mittel';
        }
        
        // Sync achievements
        achievements.forEach(ach => {
            if (state.achievements.includes(ach.id)) {
                ach.unlocked = true;
            }
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);
