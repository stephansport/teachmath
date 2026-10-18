// TeachMath - Gamified Math Learning App
// State Management
const state = {
    username: '',
    points: 0,
    level: 1,
    streak: 0,
    currentStreak: 0,
    bestStreak: 0,
    cleanRunStreak: 0,
    completedAdventures: 0,
    dailyProgress: 0,
    totalSolved: 0,
    weeklyGoal: 10,
    weeklyProgress: 0,
    weeklyProgressWeek: '',
    currentDifficulty: 'mittel',
    bossChampionRuleVersion: 2,
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
    { id: 'boss_champion', name: 'Boss-Champion', desc: 'Boss-Kampf mit 5 von 5 richtigen Antworten gemeistert', icon: '👑', unlocked: false },
    { id: 'streak_3', name: 'Durchhaltevermögen', desc: '3 Tage am Stück', icon: '🔥', unlocked: false },
    { id: 'level_3', name: 'Fortgeschritten', desc: 'Level 3 erreicht', icon: '🚀', unlocked: false },
    { id: 'level_5', name: 'Experte', desc: 'Level 5 erreicht', icon: '🤓', unlocked: false },
    { id: 'perfect_5', name: 'Perfekt!', desc: '5 richtige hintereinander', icon: '💯', unlocked: false },
    { id: 'perfect_10', name: 'Super-Serie', desc: '10 richtige hintereinander', icon: '🏅', unlocked: false },
    { id: 'geometry_master', name: 'Geometrie-Profi', desc: '10 Geometrie-Aufgaben', icon: '🔺', unlocked: false },
    { id: 'word_wizard', name: 'Textaufgaben-Held', desc: '10 Sachaufgaben', icon: '📖', unlocked: false },
    { id: 'conversion_king', name: 'Umrechnungs-König', desc: '10 Umrechnungen', icon: '📍', unlocked: false },
    { id: 'math_master', name: 'Mathe-Meister', desc: '100 Aufgaben gelöst', icon: '👑', unlocked: false },
    { id: 'speed_demon', name: 'Blitzrechner', desc: '20 Aufgaben in einer Session', icon: '⚡', unlocked: false },
    { id: 'speed_legend', name: 'Schnellster Rechner', desc: '30 Aufgaben in einer Session', icon: '🚀', unlocked: false },
    { id: 'all_topics', name: 'Allrounder', desc: 'Alle Themen ausprobiert', icon: '🎓', unlocked: false },
    { id: 'adventure_explorer', name: 'Abenteuer-Entdecker', desc: '3 Abenteuer erfolgreich beendet', icon: '🗺️', unlocked: false },
    { id: 'careful_solver', name: 'Sorgfältiger Löser', desc: 'Ohne Fehler 5 Aufgaben hintereinander richtig', icon: '🧠', unlocked: false }
];

const difficultyPools = {
    leicht: ['addition', 'subtraction', 'wordProblem', 'lengthConversion', 'rectanglePerimeter', 'timeConversion'],
    mittel: ['multiplication', 'division', 'orderOfOperations', 'brackets', 'weightConversion', 'rectangleArea', 'complexWordProblem'],
    schwer: ['estimation', 'numberSequence', 'findError', 'placeholder', 'complexWordProblem', 'cuboidVolume', 'rounding']
};

const topicDifficultyPools = {
    addition: {
        leicht: ['addition', 'subtraction'], mittel: ['addition', 'subtraction'], schwer: ['addition', 'subtraction']
    },
    multiplication: {
        leicht: ['multiplication', 'division'], mittel: ['multiplication', 'division'], schwer: ['multiplication', 'division']
    },
    conversions: {
        leicht: ['lengthConversion', 'timeConversion'],
        mittel: ['lengthConversion', 'weightConversion', 'timeConversion'],
        schwer: ['lengthConversion', 'weightConversion', 'timeConversion']
    },
    geometry: {
        leicht: ['rectanglePerimeter'],
        mittel: ['rectanglePerimeter', 'rectangleArea'],
        schwer: ['rectangleArea', 'cuboidVolume']
    },
    advanced: {
        leicht: ['orderOfOperations', 'rounding', 'numberLine'],
        mittel: ['orderOfOperations', 'brackets', 'rounding', 'numberLine', 'numberSequence'],
        schwer: ['brackets', 'numberSequence', 'findError', 'placeholder', 'estimation']
    },
    wordProblems: {
        leicht: ['wordProblem'],
        mittel: ['wordProblem', 'complexWordProblem'],
        schwer: ['complexWordProblem']
    },
    challenge: {
        leicht: ['numberLine', 'placeholder'],
        mittel: ['estimation', 'numberSequence', 'placeholder', 'complexWordProblem'],
        schwer: ['estimation', 'numberSequence', 'findError', 'placeholder', 'complexWordProblem']
    },
    boss: {
        leicht: ['bossLogic', 'bossGeometry'],
        mittel: ['bossLogic', 'bossGeometry', 'bossArena'],
        schwer: ['bossArena', 'bossGeometry', 'bossLogic', 'bossMultiStep']
    }
};

function randomForDifficulty(min, max) {
    const midpoint = min + Math.ceil((max - min) / 2);
    const range = state.currentDifficulty === 'leicht'
        ? [min, midpoint]
        : state.currentDifficulty === 'schwer'
            ? [midpoint, max]
            : [min, max];
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

// Exercise Generators - Umfangreiche 5. Klasse Themen
const exerciseGenerators = {
    // Grundrechenarten
    addition: () => {
        const a = randomForDifficulty(100, 999);
        const b = randomForDifficulty(100, 999);
        return {
            question: `${a} + ${b} = ?`,
            answer: a + b,
            topic: 'Addition',
            type: 'input',
            hint: 'Tipp: Rechne schriftlich!'
        };
    },
    
    subtraction: () => {
        const a = randomForDifficulty(100, 999);
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
        const a = randomForDifficulty(3, 15);
        const b = randomForDifficulty(3, 15);
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
        const b = randomForDifficulty(2, 11);
        const result = randomForDifficulty(5, 24);
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
        const num = randomForDifficulty(1000, 9999);
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
        const value = conv.factor >= 1
            ? randomForDifficulty(1, 20)
            : randomForDifficulty(1000, 5999);
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
        const value = randomForDifficulty(1, 50);
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
        const value = randomForDifficulty(1, 10);
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
        const length = randomForDifficulty(5, 24);
        const width = randomForDifficulty(3, 17);
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
        const length = randomForDifficulty(5, 24);
        const width = randomForDifficulty(3, 17);
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
        const length = randomForDifficulty(3, 12);
        const width = randomForDifficulty(3, 12);
        const height = randomForDifficulty(3, 12);
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
        const a = randomForDifficulty(8, 27);
        const b = randomForDifficulty(5, 19);
        const c = randomForDifficulty(4, 15);
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
        const length = randomForDifficulty(6, 23);
        const width = randomForDifficulty(4, 15);
        const height = randomForDifficulty(3, 12);
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
        const a = randomForDifficulty(20, 99);
        const b = randomForDifficulty(10, 49);
        const c = randomForDifficulty(15, Math.min(69, a + b));
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
        const a = randomForDifficulty(7, 29);
        const c = randomForDifficulty(2, 10);
        const factor = randomForDifficulty(2, 8);
        const b = c * factor;
        const answer = a * factor;

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
        const a = randomForDifficulty(25, 74);
        const b = randomForDifficulty(2, 21);
        
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

    testRounding: (practice = false) => {
        const tasks = practice ? [
            { value: 263, place: 'auf Zehner', unit: 10 },
            { value: 847, place: 'auf Zehner', unit: 10 },
            { value: 1256, place: 'auf Zehner', unit: 10 },
            { value: 7384, place: 'auf Zehner', unit: 10 },
            { value: 3427, place: 'auf Tausender', unit: 1000 },
            { value: 18650, place: 'auf Tausender', unit: 1000 },
            { value: 74201, place: 'auf Tausender', unit: 1000 },
            { value: 315672, place: 'auf Tausender', unit: 1000 },
            { question: 'Auf welche Zahl wird 62 347 auf Zehner gerundet?', answer: 62350 },
            { question: 'Auf welche Zahl wird 62 347 auf Hunderter gerundet?', answer: 62300 },
            { question: 'Auf welche Zahl wird 62 347 auf Tausender gerundet?', answer: 62000 },
            {
                question: 'Welche Zahlen ergeben auf Zehner gerundet 2000?',
                answer: 0,
                choices: ['1995 bis 2004', '1990 bis 2010', '1995 bis 2005', '1999 bis 2001'],
                correctChoice: '1995 bis 2004'
            },
            { question: 'Wie viele natürliche Zahlen ergeben auf Hunderter gerundet 2000?', answer: 100 }
        ] : [
            { value: 142, place: 'auf Zehner', unit: 10 },
            { value: 705, place: 'auf Zehner', unit: 10 },
            { value: 398, place: 'auf Zehner', unit: 10 },
            { value: 4214, place: 'auf Zehner', unit: 10 },
            { value: 5612, place: 'auf Tausender', unit: 1000 },
            { value: 12455, place: 'auf Tausender', unit: 1000 },
            { value: 60500, place: 'auf Tausender', unit: 1000 },
            { value: 229968, place: 'auf Tausender', unit: 1000 },
            { question: 'Auf welche Zahl wird 45 098 auf Zehner gerundet?', answer: 45100 },
            { question: 'Auf welche Zahl wird 45 098 auf Hunderter gerundet?', answer: 45100 },
            { question: 'Auf welche Zahl wird 45 098 auf Tausender gerundet?', answer: 45000 },
            {
                question: 'Welche Zahlen ergeben auf Zehner gerundet 1000?',
                answer: 0,
                choices: ['995 bis 1004', '990 bis 1010', '995 bis 1005', '999 bis 1001'],
                correctChoice: '995 bis 1004'
            },
            { question: 'Wie viele natürliche Zahlen ergeben auf Hunderter gerundet 1000?', answer: 100 }
        ];
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        return {
            question: task.question || `Runde ${task.value.toLocaleString('de-DE')} ${task.place}.`,
            answer: task.answer ?? Math.round(task.value / task.unit) * task.unit,
            choices: task.choices,
            accept: task.correctChoice ? answer => answer === task.correctChoice : undefined,
            topic: 'Klassenarbeit 1: Runden',
            type: task.choices ? 'choice' : 'input'
        };
    },

    testNumberWords: (practice = false) => {
        const tasks = practice ? [
            { words: 'Vierhundertachtunddreißig Millionen siebenhundertzwanzigtausendsechshundertfünf', answer: 438720605 },
            { words: 'Neun Milliarden zweihundert Millionen dreißigtausendvierzig', answer: 9200030040 }
        ] : [
            { words: 'Neunhundertsiebenundzwanzig Millionen dreihundertfünfundvierzigtausendvierhundertzwölf', answer: 927345412 },
            { words: 'Sechs Milliarden sechs Millionen sechstausendsechshundertsechs', answer: 6006006606 }
        ];
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        return {
            question: task.question || `Schreibe die Zahl in Ziffern: ${task.words}`,
            answer: task.answer,
            topic: 'Klassenarbeit 1: Zahlwörter',
            type: 'input'
        };
    },

    testNumberProperties: (practice = false) => {
        const tasks = practice ? [
            { question: 'Welche Zahl musst du von 20 000 abziehen, um 640 zu erhalten?', answer: 19360 },
            { question: 'Mit welcher Zahl musst du 23 multiplizieren, um 6 900 zu erhalten?', answer: 300 },
            { question: 'Wie viel fehlt von 1 234 bis zu einer Million?', answer: 998766 }
        ] : [
            { question: 'Welche Zahl musst du von 10 000 abziehen, um 325 zu erhalten?', answer: 9675 },
            { question: 'Mit welcher Zahl musst du 17 multiplizieren, um 5100 zu erhalten?', answer: 300 },
            { question: 'Wie viel fehlt von 987 bis zu einer Million?', answer: 999013 }
        ];
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        return {
            ...task,
            topic: 'Klassenarbeit 1: Umkehraufgaben',
            type: 'input'
        };
    },

    testArithmetic: (practice = false) => {
        const tasks = practice ? [
            { question: 'Berechne schriftlich: 36 418 + 27 563', answer: 63981, solution: '36 418 + 27 563 = (36 000 + 27 000) + (418 + 563) = 63 000 + 981 = 63 981.' },
            { question: 'Berechne schriftlich: 820 405 - 7 238', answer: 813167, solution: '820 405 - 7 000 = 813 405; 813 405 - 238 = 813 167.' },
            { question: 'Berechne schriftlich: 6 034 · 520', answer: 3137680, solution: '6 034 · 520 = 6 034 · (500 + 20) = 3 017 000 + 120 680 = 3 137 680.' },
            { question: 'Berechne schriftlich: 53 206 - 38 419', answer: 14787, solution: '53 206 - 38 000 = 15 206; 15 206 - 419 = 14 787.' },
            { question: 'Berechne schriftlich: 84 516 + 13 278', answer: 97794, solution: '84 516 + 13 278 = (84 000 + 13 000) + (516 + 278) = 97 000 + 794 = 97 794.' },
            { question: 'Berechne schriftlich: 31 842 - 8 756', answer: 23086, solution: '31 842 - 8 000 = 23 842; 23 842 - 756 = 23 086.' },
            { question: 'Berechne schriftlich: 638 · 27', answer: 17226, solution: '638 · 27 = 638 · (20 + 7) = 12 760 + 4 466 = 17 226.' },
            { question: 'Berechne schriftlich: 5 880 : 24', answer: 245, solution: '24 · 200 = 4 800; Rest: 1 080. 24 · 40 = 960; Rest: 120. 24 · 5 = 120. Also 5 880 : 24 = 200 + 40 + 5 = 245.' }
        ] : [
            { question: 'S. 35, Aufgabe 4a: Berechne schriftlich: 28 234 + 37 012', answer: 65246, solution: '28 234 + 37 012 = (28 000 + 37 000) + (234 + 12) = 65 000 + 246 = 65 246.' },
            { question: 'S. 35, Aufgabe 4b: Berechne schriftlich: 700 308 - 6 666', answer: 693642, solution: '700 308 - 6 000 = 694 308; - 600 = 693 708; - 60 = 693 648; - 6 = 693 642.' },
            { question: 'S. 35, Aufgabe 4e: Berechne schriftlich: 5 021 · 780', answer: 3916380, solution: '5 021 · 780 = 5 021 · (700 + 80) = 3 514 700 + 401 680 = 3 916 380.' },
            { question: 'S. 35, Aufgabe 4f: Berechne schriftlich: 41 587 - 29 742', answer: 11845, solution: '41 587 - 29 000 = 12 587; 12 587 - 742 = 11 845.' },
            { question: 'S. 37, Runde 1, Aufgabe 4a: Berechne schriftlich: 95 234 + 20 767', answer: 116001, solution: '95 234 + 20 767 = (95 000 + 20 000) + (234 + 767) = 115 000 + 1 001 = 116 001.' },
            { question: 'S. 37, Runde 1, Aufgabe 4b: Berechne schriftlich: 23 575 - 9 091', answer: 14484, solution: '23 575 - 9 000 = 14 575; 14 575 - 91 = 14 484.' },
            { question: 'S. 37, Runde 1, Aufgabe 4c: Berechne schriftlich: 452 · 23', answer: 10396, solution: '452 · 23 = 452 · (20 + 3) = 9 040 + 1 356 = 10 396.' },
            { question: 'S. 37, Runde 1, Aufgabe 4d: Berechne schriftlich: 4 410 : 18', answer: 245, solution: '18 · 200 = 3 600; Rest: 810. 18 · 40 = 720; Rest: 90. 18 · 5 = 90. Also 4 410 : 18 = 200 + 40 + 5 = 245.' }
        ];
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        return {
            ...task,
            topic: 'Klassenarbeit 1: Grundrechenarten',
            type: 'input',
            hint: 'Achte auf die Rechenzeichen und überprüfe dein Ergebnis mit der Umkehraufgabe.'
        };
    },

    testNumberLine: (practice = false) => {
        const tasks = practice ? [
            { values: [32, 7, 19, 24, 11, 16, 27], min: 0, max: 35, step: 1 },
            { values: [635, 760, 665, 700, 745, 720], min: 600, max: 780, step: 5 },
            { values: [20, 35, 55, 85, 95], min: 0, max: 100, step: 5 },
            { values: [2240, 2280, 2300, 2350, 2380, 2420], min: 2200, max: 2450, step: 10 },
            { values: [25, 140, 10, 95, 50, 125, 105, 75], min: 0, max: 150, step: 5 },
            { values: [501, 538, 515, 534, 508, 530, 511], min: 500, max: 540, step: 1 }
        ] : [
            { values: [28, 5, 17, 20, 8, 14, 23], min: 0, max: 30, step: 1 },
            { values: [455, 580, 485, 500, 545, 520], min: 450, max: 600, step: 5 },
            { values: [15, 25, 45, 75, 90], min: 0, max: 100, step: 5 },
            { values: [1250, 1280, 1300, 1350, 1380, 1420], min: 1200, max: 1450, step: 10 },
            { values: [15, 130, 5, 85, 40, 115, 95, 65], min: 0, max: 140, step: 5 },
            { values: [401, 428, 415, 424, 408, 420, 411], min: 400, max: 430, step: 1 }
        ];
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        return {
            question: `Zeichne eine passende Zahlengerade und trage ein: ${task.values.join(', ')}.`,
            answer: task.step,
            topic: 'Klassenarbeit 1: Zahlengerade',
            type: 'numberLineTargets',
            min: task.min,
            max: task.max,
            step: task.step,
            labelEvery: 20,
            targetValues: task.values,
            hint: 'Achte darauf, dass alle Zahlen auf einem Strich liegen.'
        };
    },

    testWordProblem: (practice = false) => {
        const tasks = practice ? [
            {
                question: 'Zwei Erwachsenenräder kosten 9 € pro Tag, drei Kinderräder 6 € pro Tag. Die Fahrräder werden Samstag und Sonntag gemietet. Wie viel kostet die Miete ohne Wochenendangebot?',
                answer: 72
            },
            {
                question: 'Die normale Fahrradmiete am Wochenende kostet 72 €. Das Wochenendangebot kostet 39 €. Wie viel spart die Familie?',
                answer: 33
            },
            {
                question: 'In einem Stadion sind 120 000 Zuschauer. Wie viele Autos werden benötigt, wenn in jedem Auto vier Personen sitzen?',
                answer: 30000
            },
            {
                question: 'Wie viele Busse mit je 60 Plätzen werden für 120 000 Zuschauer benötigt?',
                answer: 2000
            },
            {
                question: 'Wie viele Züge mit je 1 200 Plätzen werden für 120 000 Zuschauer benötigt?',
                answer: 100
            },
            {
                question: 'Zwei Erwachsene und drei Kinder zahlen zusammen 56 €. Eine Kinderkarte kostet halb so viel wie eine Erwachsenenkarte. Wie viel kostet eine Erwachsenenkarte?',
                answer: 16
            }
        ] : [
            {
                question: 'S. 35, Aufgabe 6: Zwei Erwachsenenräder und drei Kinderräder werden für Samstag und Sonntag gemietet. Erwachsene zahlen 8 € pro Tag, Kinder 5 € pro Tag. Wie viel kostet die Fahrradmiete ohne Familienangebot?',
                answer: 62
            },
            {
                question: 'S. 35, Aufgabe 6: Die normale Fahrradmiete am Wochenende kostet 62 €. Das Familienangebot kostet 33 €. Wie viel spart die Familie?',
                answer: 29
            },
            {
                question: 'S. 35, Aufgabe 11a: In einem Stadion sind 100 000 Zuschauer. Wie viele Autos werden benötigt, wenn in jedem Auto vier Personen sitzen?',
                answer: 25000
            },
            {
                question: 'S. 35, Aufgabe 11b: Wie viele Busse mit je 50 Plätzen werden für 100 000 Zuschauer benötigt?',
                answer: 2000
            },
            {
                question: 'S. 35, Aufgabe 11c: Wie viele Züge mit je 1 000 Plätzen werden für 100 000 Zuschauer benötigt?',
                answer: 100
            },
            {
                question: 'S. 37, Runde 2, Aufgabe 6: Zwei Erwachsene und drei Kinder zahlen zusammen 49 €. Eine Kinderkarte kostet halb so viel wie eine Erwachsenenkarte. Wie viel kostet eine Erwachsenenkarte?',
                answer: 14
            }
        ];
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        return {
            ...task,
            topic: 'Klassenarbeit 1: Sachaufgabe',
            type: 'input'
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
        const startBase = randomForDifficulty(5, 14);
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
    syncWeeklyProgress();
    
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
    state.currentSessionCorrect = state.currentSessionCorrect || 0;
    state.cleanRunStreak = 0;
    
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

    if (topic === 'testPrep') {
        return [
            'testRounding',
            'testNumberWords',
            'testNumberProperties',
            'testArithmetic',
            'testNumberLine',
            'testWordProblem'
        ].map(type => exerciseGenerators[type]());
    }

    if (topic === 'testPrepPractice') {
        return [
            'testWordProblem',
            'testArithmetic',
            'testNumberLine',
            'testNumberWords',
            'testRounding',
            'testNumberProperties'
        ].map(type => exerciseGenerators[type](true));
    }
    
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
        } else if (topicDifficultyPools[topic]) {
            types = [...(topicDifficultyPools[topic][state.currentDifficulty] || topicDifficultyPools[topic].mittel)];
        } else if (topicMappings[topic]) {
            types = [...topicMappings[topic]];
        } else if (exerciseGenerators[topic]) {
            types = [topic];
        } else {
            types = ['addition', 'subtraction', 'multiplication', 'division'];
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
    document.getElementById('task-total').textContent = state.exerciseSet.length;
    document.getElementById('question').textContent = exercise.question;
    state.selectedNumberLineValue = null;
    state.selectedNumberLineScale = null;
    state.selectedNumberLineValues = [];
    
    const progress = ((state.currentIndex + 1) / state.exerciseSet.length) * 100;
    document.getElementById('exercise-progress-bar').style.width = `${progress}%`;
    
    // Setup answer input
    const numberLineContainer = document.getElementById('number-line-answer-container');
    const expressionContainer = document.getElementById('expression-answer-container');
    numberLineContainer.classList.add('hidden');
    expressionContainer.classList.add('hidden');
    if (exercise.type === 'numberLine' || exercise.type === 'numberLineTargets') {
        document.getElementById('answer-input-container').classList.add('hidden');
        document.getElementById('answer-choices').classList.add('hidden');
        renderNumberLine(exercise);
        numberLineContainer.classList.remove('hidden');
    } else if (exercise.type === 'input') {
        document.getElementById('answer-input-container').classList.remove('hidden');
        document.getElementById('answer-choices').classList.add('hidden');
        document.getElementById('answer-input').value = '';
        document.getElementById('answer-input').focus();
    } else if (exercise.type === 'expression') {
        document.getElementById('answer-input-container').classList.add('hidden');
        document.getElementById('answer-choices').classList.add('hidden');
        document.getElementById('expression-input').value = '';
        document.getElementById('expression-result-input').value = '';
        expressionContainer.classList.remove('hidden');
        document.getElementById('expression-input').focus();
    } else {
        document.getElementById('answer-input-container').classList.add('hidden');
        document.getElementById('answer-choices').classList.remove('hidden');
        renderChoices(exercise.choices);
    }
    
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('check-btn').classList.remove('hidden');
    document.getElementById('next-btn').classList.add('hidden');
}

function renderNumberLine(exercise) {
    const container = document.getElementById('number-line');
    const instruction = document.getElementById('number-line-instruction');
    container.innerHTML = '';
    instruction.style.marginBottom = '12px';

    if (exercise.type === 'numberLineTargets') {
        state.selectedNumberLineScale = exercise.step;
        instruction.textContent = `Markiere ${exercise.targetValues[0]} auf der Zahlengeraden.`;
        renderNumberLineTicks(exercise, exercise.step);
        return;
    }

    instruction.textContent = 'Wähle den passenden Strich.';
    renderNumberLineTicks(exercise, exercise.step);
}

function renderNumberLineTicks(exercise, step) {
    const container = document.getElementById('number-line');
    container.querySelectorAll('.number-line-scale').forEach(line => line.remove());

    const scale = document.createElement('div');
    scale.className = 'number-line-scale';
    scale.style.display = 'flex';
    scale.style.alignItems = 'stretch';
    scale.style.width = '100%';
    scale.style.minHeight = '48px';
    scale.style.borderBottom = '2px solid #334155';

    for (let value = exercise.min; value <= exercise.max; value += step) {
        const tick = document.createElement('button');
        tick.type = 'button';
        tick.setAttribute('aria-label', String(value));
        tick.title = String(value);
        tick.style.flex = '1 1 0';
        tick.style.minWidth = '0';
        tick.style.padding = '0';
        tick.style.border = '0';
        tick.style.background = 'transparent';
        tick.style.cursor = 'pointer';
        tick.style.display = 'flex';
        tick.style.flexDirection = 'column';
        tick.style.alignItems = 'center';
        tick.style.justifyContent = 'flex-end';

        const mark = document.createElement('span');
        mark.style.height = (value - exercise.min) % exercise.labelEvery === 0 ? '18px' : '9px';
        mark.style.borderLeft = '2px solid #334155';
        tick.appendChild(mark);

        const label = document.createElement('span');
        label.textContent = (value - exercise.min) % exercise.labelEvery === 0 ? value : '';
        label.style.fontSize = '12px';
        label.style.lineHeight = '18px';
        label.style.whiteSpace = 'nowrap';
        tick.appendChild(label);

        tick.addEventListener('click', () => {
            if (exercise.type === 'numberLineTargets') {
                const placedValues = state.selectedNumberLineValues;
                if (placedValues.length >= exercise.targetValues.length) return;
                placedValues.push(value);
                tick.style.background = '#ccfbf1';
                tick.setAttribute('aria-pressed', 'true');
                const nextIndex = placedValues.length;
                document.getElementById('number-line-instruction').textContent = nextIndex < exercise.targetValues.length
                    ? `Markiere ${exercise.targetValues[nextIndex]} auf der Zahlengeraden (${nextIndex + 1}/${exercise.targetValues.length}).`
                    : 'Alle Zahlen sind eingetragen. Prüfe deine Lösung.';
            } else {
                scale.querySelectorAll('button').forEach(button => {
                    button.style.background = 'transparent';
                    button.removeAttribute('aria-pressed');
                });
                tick.style.background = '#ccfbf1';
                tick.setAttribute('aria-pressed', 'true');
                state.selectedNumberLineValue = value;
            }
        });
        scale.appendChild(tick);
    }

    container.appendChild(scale);
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
    syncWeeklyProgress();
    updateUI();
    let userAnswer;
    let userExpression = '';
    
    if (state.currentExercise.type === 'numberLine') {
        if (state.selectedNumberLineValue === null || state.selectedNumberLineValue === undefined) {
            showFeedback(false, 'Bitte markiere zuerst einen Strich auf der Zahlengeraden.');
            return;
        }
        userAnswer = state.selectedNumberLineValue;
    } else if (state.currentExercise.type === 'numberLineTargets') {
        if (state.selectedNumberLineScale === null || state.selectedNumberLineScale === undefined) {
            showFeedback(false, 'Bitte wähle zuerst eine Schrittweite.');
            return;
        }
        if (state.selectedNumberLineValues.length !== state.currentExercise.targetValues.length) {
            showFeedback(false, 'Bitte trage erst alle Zahlen auf der Zahlengeraden ein.');
            return;
        }
        userAnswer = state.selectedNumberLineScale;
    } else if (state.currentExercise.type === 'expression') {
        userExpression = document.getElementById('expression-input').value.trim();
        const raw = document.getElementById('expression-result-input').value.trim();
        if (userExpression === '' || raw === '') {
            showFeedback(false, 'Bitte gib den Rechenausdruck und das Ergebnis ein!');
            return;
        }
        userAnswer = parseFloat(raw.replace(',', '.'));
    } else if (state.currentExercise.type === 'input') {
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
        const answerText = selected.textContent.trim();
        const numericAnswer = Number(answerText);
        userAnswer = Number.isFinite(numericAnswer) ? numericAnswer : answerText;
    }
    
    const ex = state.currentExercise;
    const placedNumberLineValues = [...state.selectedNumberLineValues].sort((a, b) => a - b);
    const targetNumberLineValues = ex.type === 'numberLineTargets'
        ? [...ex.targetValues].sort((a, b) => a - b)
        : [];
    const correct = ex.type === 'numberLineTargets'
        ? userAnswer === ex.answer && placedNumberLineValues.every((value, index) => value === targetNumberLineValues[index])
        : ex.type === 'expression'
            ? userAnswer === ex.answer && [ex.expression, ...(ex.acceptedExpressions || [])].some(expression =>
                normalizeExpression(expression) === normalizeExpression(userExpression))
        : typeof ex.accept === 'function'
            ? ex.accept(userAnswer)
            : userAnswer === ex.answer;
    const solutionFeedback = ex.solution
        ? `<br><small>Rechenweg:<br>${ex.solution.replace(/; /g, '<br>')}</small>`
        : '';
    
    if (correct) {
        const points = 20;
        state.points += points;
        state.dailyProgress++;
        state.totalSolved++;
        state.weeklyProgress++;
        state.currentStreak = (state.currentStreak || 0) + 1;
        state.bestStreak = Math.max(state.bestStreak || 0, state.currentStreak);
        state.cleanRunStreak = (state.cleanRunStreak || 0) + 1;
        
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
        
        showFeedback(true, `🎉 Richtig! +${points} Punkte${solutionFeedback}`);
    } else {
        state.currentStreak = 0;
        state.cleanRunStreak = 0;
        const expectedAnswer = state.currentExercise.type === 'expression'
            ? `${state.currentExercise.expression} = ${state.currentExercise.answer}`
            : state.currentExercise.answer;
        showFeedback(false, `❌ Leider falsch. Die richtige Antwort ist ${expectedAnswer}${solutionFeedback}`);
    }
    
    document.getElementById('check-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
    
    saveState();
    updateUI();
}

function normalizeExpression(expression) {
    return expression
        .replace(/\s+/g, '')
        .replace(/[×·xX]/g, '*')
        .replace(/[÷:]/g, '/');
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
    const bossDefeated = state.currentTopic === 'boss' && correctCount === state.exerciseSet.length;

    if (bossDefeated) {
        unlockAchievement('boss_champion', false);
    }
    
    showModal(
        bossDefeated ? '👑 Boss besiegt!' : '🎉 Training abgeschlossen!',
        `<p>Du hast <strong>${correctCount}/${state.exerciseSet.length}</strong> Aufgaben richtig gelöst!</p>
        <p>Punkte verdient: <strong>${totalPoints}</strong> ⭐</p>${bossDefeated ? '<p>Du hast den Boss-Kampf perfekt gemeistert!</p>' : ''}`
    );
    
    // Keep session counter for the current browser session so achievements like "Blitzrechner" can unlock naturally.
    saveState();
    
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

    if (state.currentSessionCorrect >= 30) {
        unlockAchievement('speed_legend');
    }

    // Consecutive correct answers
    if (state.bestStreak >= 5) {
        unlockAchievement('perfect_5');
    }

    if (state.bestStreak >= 10) {
        unlockAchievement('perfect_10');
    }

    if (state.cleanRunStreak >= 5) {
        unlockAchievement('careful_solver');
    }

    if (state.completedAdventures >= 3) {
        unlockAchievement('adventure_explorer');
    }
}

// Unlock Achievement
function unlockAchievement(id, showNotification = true) {
    const achievement = achievements.find(a => a.id === id);
    
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        state.achievements.push(id);
        
        if (showNotification) {
            showModal('🏆 Erfolg freigeschaltet!', `<div style="font-size: 3rem; margin: 20px 0;">${achievement.icon}</div><p><strong>${achievement.name}</strong></p><p>${achievement.desc}</p>`);
        }
        
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

function recordAdventureWin() {
    const wins = Number(localStorage.getItem('teachmath_adventure_wins') || '0') + 1;
    localStorage.setItem('teachmath_adventure_wins', String(wins));
    state.completedAdventures = wins;
    checkAchievements();
    saveState();
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

function currentIsoWeekKey() {
    const today = new Date();
    const weekDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    const weekday = weekDate.getUTCDay() || 7;
    weekDate.setUTCDate(weekDate.getUTCDate() + 4 - weekday);
    const yearStart = new Date(Date.UTC(weekDate.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((weekDate - yearStart) / 86400000) + 1) / 7);
    return `${weekDate.getUTCFullYear()}-${String(week).padStart(2, '0')}`;
}

function syncWeeklyProgress() {
    const weekKey = currentIsoWeekKey();
    if (state.weeklyProgressWeek !== weekKey) {
        state.weeklyProgress = 0;
        state.weeklyProgressWeek = weekKey;
        if (state.username) {
            saveState();
        }
    }
}

// Save State
function saveState() {
    // Convert Set to Array for JSON
    state.completedAdventures = Number(localStorage.getItem('teachmath_adventure_wins') || state.completedAdventures || '0');

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
        const resetLegacyBossChampion = loaded.bossChampionRuleVersion !== 2;
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
        if (!state.weeklyProgressWeek) {
            state.weeklyProgressWeek = '';
        }
        if (!state.completedAdventures) {
            state.completedAdventures = Number(localStorage.getItem('teachmath_adventure_wins') || '0');
        }
        if (!state.cleanRunStreak) {
            state.cleanRunStreak = 0;
        }

        if (resetLegacyBossChampion) {
            state.achievements = state.achievements.filter(id => id !== 'boss_champion');
            state.bossChampionRuleVersion = 2;
        }
        
        // Sync achievements
        achievements.forEach(ach => {
            if (state.achievements.includes(ach.id)) {
                ach.unlocked = true;
            }
        });

        if (resetLegacyBossChampion) {
            const bossAchievement = achievements.find(ach => ach.id === 'boss_champion');
            if (bossAchievement) {
                bossAchievement.unlocked = false;
            }
            saveState();
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);
