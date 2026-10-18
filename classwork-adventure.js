const rooms = [
    {
        icon: '🧮',
        title: 'Der Rundungssaal',
        story: 'Die erste Tür wird von einer Zahlentafel bewacht. Runde die Zahl richtig, damit das Schloss klickt.',
        createTask() {
            const value = 73846;
            const unit = 100;
            return {
                question: `Runde ${value.toLocaleString('de-DE')} auf Hunderter.`,
                answer: Math.round(value / unit) * unit,
                hint: 'Betrachte die Zehnerstelle. Ab 5 wird aufgerundet.'
            };
        }
    },
    {
        icon: '🔤',
        title: 'Die Halle der Zahlwörter',
        story: 'Auf dem Tor steht eine Zahl ausgeschrieben. Trage sie als Ziffern ein, um den Durchgang zu öffnen.',
        createTask() {
            return {
                question: 'Schreibe diese Zahl in Ziffern: Vierhundertachtunddreißig Millionen siebenhundertzwanzigtausendsechshundertfünf.',
                answer: 438720605,
                hint: 'Teile das Zahlwort in Millionen, Tausender und den Rest.'
            };
        }
    },
    {
        icon: '🔐',
        title: 'Die Kammer der Umkehraufgaben',
        story: 'Ein Zahlenrätsel versperrt den Korridor. Nutze die Umkehroperation, um den fehlenden Wert zu finden.',
        createTask() {
            return {
                question: 'Welche Zahl musst du von 20 000 abziehen, um 640 zu erhalten?',
                answer: 19360,
                hint: 'Wenn x von 20 000 abgezogen 640 ergibt, rechne 20 000 - 640.'
            };
        }
    },
    {
        icon: '✏️',
        title: 'Der Saal der schriftlichen Rechnung',
        story: 'Die Zahnräder der Zugbrücke bewegen sich erst, wenn du die Rechnung sorgfältig schriftlich löst.',
        createTask() {
            const tasks = [
                {
                    question: 'Berechne schriftlich: 36 418 + 27 563',
                    answer: 63981,
                    solution: '36 418 + 27 563 = (36 000 + 27 000) + (418 + 563) = 63 000 + 981 = 63 981.'
                },
                {
                    question: 'Berechne schriftlich: 820 405 - 7 238',
                    answer: 813167,
                    solution: '820 405 - 7 000 = 813 405; - 200 = 813 205; - 30 = 813 175; - 8 = 813 167.'
                },
                {
                    question: 'Berechne schriftlich: 6 034 · 520',
                    answer: 3137680,
                    solution: '6 034 · 520 = 6 034 · (500 + 20) = 3 017 000 + 120 680 = 3 137 680.'
                },
                {
                    question: 'Berechne schriftlich: 5 880 : 24',
                    answer: 245,
                    solution: '24 · 200 = 4 800; Rest: 1 080. 24 · 40 = 960; Rest: 120. 24 · 5 = 120. Also 5 880 : 24 = 200 + 40 + 5 = 245.'
                }
            ];
            const task = tasks[Math.floor(Math.random() * tasks.length)];
            return {
                ...task,
                hint: 'Rechne Stelle für Stelle und achte auf Überträge, Teilprodukte oder den Rest.'
            };
        }
    },
    {
        icon: '📏',
        title: 'Die Zahlengeraden-Brücke',
        story: 'Die Brücke besteht aus Zahlenstrichen. Markiere alle geforderten Zahlen, damit sie vollständig erscheint.',
        createTask() {
            const choices = [
                { values: [32, 7, 19, 24, 11, 16, 27], min: 0, max: 35, step: 1 },
                { values: [635, 760, 665, 700, 745, 720], min: 600, max: 780, step: 5 },
                { values: [25, 140, 10, 95, 50, 125, 105, 75], min: 0, max: 150, step: 5 },
                { values: [501, 538, 515, 534, 508, 530, 511], min: 500, max: 540, step: 1 }
            ];
            const task = choices[Math.floor(Math.random() * choices.length)];
            return {
                type: 'numberLine',
                question: `Trage diese Zahlen auf der Zahlengeraden ein: ${task.values.join(', ')}.`,
                answer: [...task.values].sort((a, b) => a - b),
                targets: task.values,
                min: task.min,
                max: task.max,
                step: task.step,
                hint: `Die Striche stehen jeweils für ${task.step}. Du kannst die Markierungen in beliebiger Reihenfolge setzen.`
            };
        }
    },
    {
        icon: '🚌',
        title: 'Das Tor der Sachaufgaben',
        story: 'Der letzte Wächter stellt dir eine Sachaufgabe. Löse sie, um den Schatzraum zu erreichen.',
        createTask() {
            return {
                question: 'In einem Stadion sind 120 000 Zuschauer. Wie viele Busse mit je 60 Plätzen werden benötigt, wenn alle Plätze besetzt sind?',
                answer: 2000,
                hint: 'Teile die Gesamtzahl der Zuschauer durch die Plätze pro Bus.'
            };
        }
    }
];

let currentRoom = 0;
let currentTask = null;
let selectedMarks = [];
let solved = false;

const byId = id => document.getElementById(id);

function startAdventure() {
    currentRoom = 0;
    solved = false;
    byId('start-screen').classList.add('hidden');
    byId('win-screen').classList.add('hidden');
    byId('game-screen').classList.remove('hidden');
    renderRoom();
}

function renderProgress() {
    const list = byId('checkpoint-list');
    list.innerHTML = '';
    rooms.forEach((room, index) => {
        const checkpoint = document.createElement('span');
        checkpoint.className = `checkpoint${index === currentRoom ? ' active' : ''}${index < currentRoom ? ' done' : ''}`;
        checkpoint.textContent = index < currentRoom ? '✓' : room.icon;
        checkpoint.setAttribute('aria-label', `${room.title}${index < currentRoom ? ', erledigt' : ''}`);
        list.appendChild(checkpoint);
    });
}

function renderRoom() {
    const room = rooms[currentRoom];
    currentTask = room.createTask();
    selectedMarks = [];
    solved = false;

    byId('room-counter').textContent = `Raum ${currentRoom + 1} von ${rooms.length}`;
    byId('key-count').textContent = currentRoom;
    byId('room-icon').textContent = room.icon;
    byId('room-title').textContent = room.title;
    byId('room-story').textContent = room.story;
    byId('question-text').textContent = currentTask.question;
    byId('hint-box').textContent = '';
    byId('feedback').className = 'challenge-feedback hidden';
    byId('action-button').textContent = 'Prüfen';
    byId('action-button').disabled = false;
    byId('hint-button').classList.remove('hidden');
    byId('numeric-answer').classList.toggle('hidden', currentTask.type === 'numberLine');
    byId('number-line-answer').classList.toggle('hidden', currentTask.type !== 'numberLine');
    byId('answer-input').value = '';
    renderProgress();

    if (currentTask.type === 'numberLine') {
        renderNumberLine();
    }
}

function renderNumberLine() {
    const line = byId('number-line');
    line.innerHTML = '';
    byId('number-line-instruction').textContent = `Markierungen: 0/${currentTask.targets.length}`;

    for (let value = currentTask.min; value <= currentTask.max; value += currentTask.step) {
        const tick = document.createElement('button');
        tick.type = 'button';
        tick.setAttribute('aria-label', String(value));
        tick.setAttribute('aria-pressed', 'false');

        const mark = document.createElement('span');
        mark.className = 'number-line-tick';
        tick.appendChild(mark);

        const label = document.createElement('span');
        label.className = 'number-line-label';
        const labelEvery = currentTask.step === 1 ? 5 : currentTask.step * 5;
        label.textContent = (value - currentTask.min) % labelEvery === 0 ? value : '';
        tick.appendChild(label);

        tick.addEventListener('click', () => {
            if (solved) return;
            const existingIndex = selectedMarks.indexOf(value);
            if (existingIndex >= 0) {
                selectedMarks.splice(existingIndex, 1);
                tick.setAttribute('aria-pressed', 'false');
            } else if (selectedMarks.length < currentTask.targets.length) {
                selectedMarks.push(value);
                tick.setAttribute('aria-pressed', 'true');
            }
            byId('number-line-instruction').textContent =
                `Markierungen: ${selectedMarks.length}/${currentTask.targets.length}`;
        });
        line.appendChild(tick);
    }
}

function showHint() {
    byId('hint-box').textContent = `💡 ${currentTask.hint}`;
}

function checkAnswer() {
    if (solved) {
        advanceRoom();
        return;
    }

    let correct;
    let answer;
    if (currentTask.type === 'numberLine') {
        const placed = [...selectedMarks].sort((a, b) => a - b);
        correct = placed.length === currentTask.answer.length &&
            placed.every((value, index) => value === currentTask.answer[index]);
        answer = currentTask.answer.join(', ');
    } else {
        const raw = byId('answer-input').value.trim();
        if (!raw) {
            byId('feedback').textContent = 'Bitte gib erst eine Antwort ein.';
            byId('feedback').className = 'challenge-feedback wrong';
            return;
        }
        const value = Number(raw.replace(/[\s.]/g, ''));
        correct = Number.isFinite(value) && value === currentTask.answer;
        answer = currentTask.answer.toLocaleString('de-DE');
    }

    const feedback = byId('feedback');
    if (correct) {
        solved = true;
        feedback.textContent = currentTask.solution
            ? `Richtig! Rechenweg: ${currentTask.solution}`
            : 'Richtig! Das Schloss öffnet sich.';
        feedback.className = 'challenge-feedback correct';
        byId('action-button').textContent = currentRoom === rooms.length - 1 ? 'Schatz öffnen' : 'Weiter zum nächsten Raum';
        byId('hint-button').classList.add('hidden');
        if (currentTask.type !== 'numberLine') byId('answer-input').disabled = true;
    } else {
        feedback.textContent = currentTask.type === 'numberLine'
            ? 'Noch nicht ganz. Überprüfe die Markierungen und versuche es erneut.'
            : `Das stimmt noch nicht. Die richtige Antwort ist ${answer}.${currentTask.solution ? ` Rechenweg: ${currentTask.solution}` : ''}`;
        feedback.className = 'challenge-feedback wrong';
        if (currentTask.type === 'numberLine') {
            selectedMarks = [];
            byId('number-line').querySelectorAll('button').forEach(tick => tick.setAttribute('aria-pressed', 'false'));
            byId('number-line-instruction').textContent = `Markierungen: 0/${currentTask.targets.length}`;
        }
    }
}

function advanceRoom() {
    if (!solved) return;
    currentRoom++;
    byId('answer-input').disabled = false;
    if (currentRoom >= rooms.length) {
        byId('game-screen').classList.add('hidden');
        byId('win-screen').classList.remove('hidden');
        return;
    }
    renderRoom();
}

byId('start-button').addEventListener('click', startAdventure);
byId('restart-button').addEventListener('click', startAdventure);
byId('hint-button').addEventListener('click', showHint);
byId('action-button').addEventListener('click', checkAnswer);
byId('answer-input').addEventListener('keydown', event => {
    if (event.key === 'Enter') checkAnswer();
});
