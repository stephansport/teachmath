(function () {
    const geometryBasics = [
        {
            title: 'Umfang',
            icon: '📏',
            formula: 'U = 2 × (l + b)',
            level: '5. Klasse',
            explanation: 'Der Umfang ist die Länge des gesamten Randes einer Figur. Beim Rechteck misst du also einmal um die ganze Form herum.',
            example: 'Ein Rechteck ist 8 cm lang und 3 cm breit. Dann ist der Umfang: 2 × (8 + 3) = 2 × 11 = 22 cm.',
            tip: 'Merke: Umfang = alles rundherum messen.'
        },
        {
            title: 'Fläche',
            icon: '🟩',
            formula: 'A = l × b',
            level: '5. Klasse',
            explanation: 'Die Fläche beschreibt, wie groß die Oberfläche innen ist. Bei einem Rechteck rechnest du Länge mal Breite.',
            example: 'Ein Rechteck ist 6 m lang und 4 m breit. Die Fläche ist 6 × 4 = 24 m².',
            tip: 'Merke: Fläche = alles innen.'
        },
        {
            title: 'Volumen',
            icon: '📦',
            formula: 'V = l × b × h',
            level: '5. Klasse',
            explanation: 'Das Volumen zeigt an, wie viel Platz ein Körper im Raum einnimmt. Ein Quader hat Länge, Breite und Höhe.',
            example: 'Ein Quader ist 5 cm lang, 3 cm breit und 2 cm hoch. Das Volumen ist 5 × 3 × 2 = 30 cm³.',
            tip: 'Merke: Volumen = Raum im Körper.'
        },
        {
            title: 'Kreis',
            icon: '⚪',
            formula: 'U = 2 × π × r  und  A = π × r²',
            level: '5. Klasse',
            explanation: 'Ein Kreis hat keinen geraden Rand. Für den Umfang brauchst du den Radius r, also den Abstand vom Mittelpunkt bis zum Rand.',
            example: 'Ein Kreis hat einen Radius von 3 cm. Der Umfang ist ungefähr 2 × 3,14 × 3 = 18,84 cm. Die Fläche ist 3,14 × 3² = 28,26 cm².',
            tip: 'Merke: π ist ungefähr 3,14.'
        },
        {
            title: 'Quader',
            icon: '🧱',
            formula: 'V = l × b × h',
            level: '5. Klasse',
            explanation: 'Ein Quader ist ein Körper mit sechs rechteckigen Flächen. Das Volumen berechnet man mit Länge × Breite × Höhe.',
            example: 'Ein Quader ist 10 cm lang, 4 cm breit und 3 cm hoch. Das Volumen ist 10 × 4 × 3 = 120 cm³.',
            tip: 'Merke: Quader = Körper mit drei Maßen.'
        }
    ];

    const bossModeEntries = [
        {
            title: 'Kugel',
            icon: '🔵',
            formula: 'V = 4/3 × π × r³  und  O = 4 × π × r²',
            level: 'Boss-Modus',
            explanation: 'Eine Kugel ist rund wie eine Kugel in der Natur: Ball, Erde oder Planet. Das Volumen beschreibt den Raum, den die Kugel einnimmt.',
            example: 'Wenn r = 3 cm, dann ist V = 4/3 × 3,14 × 3³ = 113,04 cm³.',
            tip: 'Merke: Bei einer Kugel kommt die dritte Potenz vor, weil drei Größen mitwirken: Radius, Radius, Radius.'
        },
        {
            title: 'Zylinder',
            icon: '🥤',
            formula: 'V = π × r² × h',
            level: 'Boss-Modus',
            explanation: 'Ein Zylinder ist rund wie eine Dose oder ein Glas. Er hat einen Kreis als Boden und eine Höhe h.',
            example: 'Ein Zylinder hat r = 2 cm und h = 5 cm. Dann ist V = 3,14 × 2² × 5 = 62,8 cm³.',
            tip: 'Merke: Zylinder = Kreisfläche mal Höhe.'
        },
        {
            title: 'Kegel',
            icon: '🍦',
            formula: 'V = 1/3 × π × r² × h',
            level: 'Boss-Modus',
            explanation: 'Ein Kegel hat einen runden Boden und läuft spitz zu. Daher ist der Raum im Kegel kleiner als im Zylinder mit gleicher Höhe und Grundfläche.',
            example: 'Ein Kegel hat r = 3 cm und h = 4 cm. Dann ist V = 1/3 × 3,14 × 3² × 4 ≈ 37,68 cm³.',
            tip: 'Merke: Ein Kegel ist nur ein Drittel eines gleich großen Zylinders.'
        },
        {
            title: 'Pyramide',
            icon: '🏛️',
            formula: 'V = 1/3 × G × h',
            level: 'Boss-Modus',
            explanation: 'Bei einer Pyramide ist die Grundfläche G oft ein Rechteck oder ein Dreieck. Du rechnest Grundfläche mal Höhe und teilst dann durch 3.',
            example: 'Eine Pyramide hat eine Grundfläche von 36 cm² und eine Höhe von 9 cm. Dann ist V = 1/3 × 36 × 9 = 108 cm³.',
            tip: 'Merke: Eine Pyramide ist eine „spitze“ Form, deshalb der Faktor 1/3.'
        }
    ];

    function renderGeometryModule(container) {
        const entries = container.dataset.boss === 'true' ? bossModeEntries : geometryBasics;

        container.innerHTML = `
            <div class="geometry-header">
                <div>
                    <h2>📐 Geometrie erklärt</h2>
                    <p>Einfach erklärt – passend für 5. Klasse</p>
                </div>
                <div class="geometry-toggle" aria-label="Geometrie-Modus wählen">
                    <button class="geometry-mode-btn ${container.dataset.boss === 'false' ? 'active' : ''}" data-boss="false" type="button">Grundlagen</button>
                    <button class="geometry-mode-btn ${container.dataset.boss === 'true' ? 'active' : ''}" data-boss="true" type="button">Boss-Modus</button>
                </div>
            </div>

            <div class="geometry-grid">
                ${entries.map(entry => `
                    <article class="geometry-card">
                        <div class="geometry-card-header">
                            <span class="geometry-icon">${entry.icon}</span>
                            <span class="geometry-level">${entry.level}</span>
                        </div>
                        <h3>${entry.title}</h3>
                        <div class="geometry-formula">${entry.formula}</div>
                        <p>${entry.explanation}</p>
                        <div class="geometry-example">
                            <strong>Beispiel:</strong>
                            <span>${entry.example}</span>
                        </div>
                        <div class="geometry-tip">💡 ${entry.tip}</div>
                    </article>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.geometry-mode-btn').forEach(button => {
            button.addEventListener('click', () => {
                const nextMode = button.dataset.boss === 'true';
                container.dataset.boss = String(nextMode);
                renderGeometryModule(container);
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const target = document.getElementById('geometry-module');
        if (target) {
            target.dataset.boss = 'false';
            renderGeometryModule(target);
        }
    });
})();
