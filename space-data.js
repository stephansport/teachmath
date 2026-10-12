// TeachMath – Weltraum-Abenteuer „Rätsel im Weltraum"
// Daten: Gegenstände, Rätsel, Orte und Bilder

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function round10(n) { return Math.round(n / 10) * 10; }

// ---------- Gegenstände ----------
var S_ITEMS = {
    reparaturkit:  { name: "Reparatur-Kit",       icon: "🔧", desc: "Werkzeug für Notfälle. Heilt 1 ❤️.", heal: 1 },
    medkit:        { name: "Medizin-Kit",          icon: "💊", desc: "Heilt 2 ❤️.", heal: 2 },
    kraftfeld:     { name: "Kraftfeld-Generator",  icon: "⚡", desc: "Schützt vor Strahlung und kleinen Asteroiden." },
    kompass:       { name: "Navigations-Kompass",  icon: "🧭", desc: "Zeigt den Weg durch das All – auch im Nebel." },
    karte:         { name: "Sternenkarte",         icon: "🗺️", desc: "Eine Karte mit eingezeichneten Sternen und Wegen." },
    funk:          { name: "Funkgerät",            icon: "📻", desc: "Erlaubt Kommunikation mit anderen Schiffen." },
    o2:            { name: "Sauerstoff-Tank",      icon: "🫧", desc: "Gibt dir 1 ❤️ zurück, wenn du es einatmest.", heal: 1 },
    laser:         { name: "Laserkanone",          icon: "🔫", desc: "Zerstört Hindernisse auf deinem Weg." }
};

// ---------- Mathe-Rätsel (5. Klasse) ----------
// NORMAL
var S_CHALLENGES = {

    sauerstoff: function () {
        // a > b*weg garantiert, Ergebnis immer positiv
        var b = rnd(1, 3), weg = rnd(2, 5), a = b * weg + rnd(5, 20);
        return {
            text: "Dein Schiff hat <b>" + a + " Liter</b> Sauerstoff. Du verbrauchst <b>" + b + " Liter</b> pro Stunde. Die nächste Station ist <b>" + weg + " Stunden</b> entfernt. Wie viel Sauerstoff bleibt übrig?",
            answer: a - b * weg,
            unit: "Liter",
            hint: a + " − (" + b + " × " + weg + ") = " + (a - b * weg)
        };
    },

    gravitation: function () {
        var g = rnd(2, 12), m = rnd(10, 30);
        return {
            text: "Auf einem fremden Planeten ist die Schwerkraft <b>" + g + " m/s²</b>. Deine Ausrüstung wiegt <b>" + m + " kg</b>. Wie viel Newton Gewichtskraft wirkt auf die Ausrüstung?",
            answer: g * m,
            unit: "N",
            hint: g + " × " + m + " = " + (g * m)
        };
    },

    laser: function () {
        // perShot ist Teiler von energy → ganzzahliges Ergebnis
        var perShot = pick([2, 3, 4, 5, 6, 8, 10]);
        var shots = rnd(5, 15);
        var energy = perShot * shots;
        return {
            text: "Deine Laserkanone hat <b>" + energy + " Energie</b>. Jeder Schuss kostet <b>" + perShot + " Einheiten</b>. Wie viele Schüsse kannst du abfeuern?",
            answer: shots,
            unit: "Schüsse",
            hint: energy + " ÷ " + perShot + " = " + shots
        };
    },

    // KNIFFLIG (ca. 1 von 3)
    sternfolge: function () {
        var start = rnd(3, 15), step = rnd(3, 9), pos = rnd(4, 7);
        var sequence = [];
        for (var i = 0; i < pos; i++) sequence.push(start + i * step);
        var answer = start + pos * step;
        return {
            text: "Im Sternenhimmel erkennst du ein Muster: <b>" + sequence.join(" · ") + " · ?</b><br>Was ist die nächste Zahl in dieser Folge?",
            answer: answer,
            unit: "",
            hint: "Die Schrittweite ist +" + step + " — addiere sie zum letzten Glied."
        };
    },

    funke: function () {
        // Teiler garantiert: speed ist Teiler von dist → ganzzahliges Ergebnis
        var speed = pick([50, 100, 150, 200, 250]);
        var t = rnd(2, 8);
        var dist = speed * t;
        return {
            text: "Ein Notruf-Signal fliegt mit <b>" + speed + " km/s</b>. Das Rettungsschiff ist <b>" + dist + " km</b> entfernt. Wie viele Sekunden dauert die Übertragung?",
            answer: t,
            unit: "Sekunden",
            hint: dist + " ÷ " + speed + " = " + t
        };
    },

    kreisumfang: function () {
        // π × d, d einfach, Ergebnis auf ganze Zahl gerundet, accept ±2
        var d = pick([4, 6, 8, 10, 14, 20]);
        var exact = Math.PI * d;
        var approx = Math.round(exact);
        return {
            text: "Dein Kraftfeld hat einen Durchmesser von <b>" + d + " m</b>. Wie groß ist der <b>Umfang</b> des kreisförmigen Schutzfeldes? (π ≈ 3,14)",
            answer: approx,
            unit: "m",
            hint: "Umfang = π × d = 3,14 × " + d + " ≈ " + (3.14 * d).toFixed(1),
            accept: function (x) { return Math.abs(x - exact) < 2; }
        };
    },

    bruchaddition: function () {
        // Gleicher Nenner → einfache Bruchaddition für 5. Klasse
        var n = pick([4, 5, 6, 8, 10]);
        var a = rnd(1, Math.floor(n / 2) - 1);
        var b = rnd(1, n - a - 1);
        // Aufgabe: a/n + b/n = (a+b)/n
        var zaehler = a + b;
        return {
            text: "Zwei Tanks sind <b>" + a + "/" + n + "</b> und <b>" + b + "/" + n + "</b> voll. Wie viel ist zusammen? (Gib nur den Zähler an – Nenner bleibt " + n + "!)",
            answer: zaehler,
            unit: "(Zähler)",
            hint: a + "/" + n + " + " + b + "/" + n + " = " + zaehler + "/" + n
        };
    }
};

// ---------- Orte ----------
// pos = [Spalte, Zeile] auf der Sternenkarte
var S_LOCATIONS = {

    start: {
        name: "Dein Raumschiff", icon: "🚀", pos: [1, 2], scene: "start",
        text: "Du wachst in deiner Koje auf. Das Schiff zittert – ein Asteroid ist knapp verfehlt! Dein Navigationssystem ist kaputt, aber du hast noch Sauerstoff und ein paar Werkzeuge. <b>Du musst einen Weg zurück zur Erde finden!</b>",
        items: [
            { id: "reparaturkit", label: "Werkzeugkasten öffnen", found: "Du findest ein <b>Reparatur-Kit</b>." }
        ],
        exits: [
            { to: "asteroide", label: "Nach links – zur Asteroidengruppe" },
            { to: "mond",      label: "Nach rechts – zum Mond" }
        ]
    },

    asteroide: {
        name: "Die Asteroidengruppe", icon: "☄️", pos: [0, 2], scene: "asteroide",
        text: "Vor dir wirbeln dutzende Asteroiden – manche so groß wie Häuser! Zwischen ihnen steckt das Wrack eines alten Forschungsschiffs. Vielleicht findest du dort etwas Nützliches…",
        items: [
            { id: "laser", label: "Wrack durchsuchen", challenge: "laser", found: "Du hast eine <b>Laserkanone</b> gefunden!" }
        ],
        exits: [
            { to: "start",       label: "Zurück zu deinem Schiff" },
            { to: "funkstation", label: "Weiter zur alten Funkstation" },
            { to: "gasries",     label: "Tief ins All – zum Gasriesen" }
        ]
    },

    funkstation: {
        name: "Die Funkstation", icon: "📡", pos: [0, 1], scene: "funkstation",
        text: "Eine verlassene Station – halb zerfallen, aber der Funkmast steht noch! Vielleicht kannst du hier ein Notsignal senden. Der Energiekern ist defekt.",
        items: [
            {
                id: "funk", label: "Energiekern wechseln",
                requires: ["reparaturkit"],
                locked: "Der Energiekern klemmt – du brauchst <b>Werkzeug</b>, um ihn zu tauschen. <i>Tipp: In deinem Schiff liegt ein Werkzeugkasten!</i>",
                challenge: "funke",
                found: "Das <b>Funkgerät</b> ist repariert! Du kannst jetzt Signale senden."
            }
        ],
        exits: [
            { to: "asteroide", label: "Zurück zur Asteroidengruppe" },
            { to: "planet",    label: "Weiter zum blauen Planeten" }
        ]
    },

    planet: {
        name: "Die Erde (Nähe)", icon: "🌍", pos: [2, 2], scene: "planet",
        text: "Wunderschön! Blauer Ozean, weiße Wolken, grüne Kontinente. Das ist die <b>Erde</b>! Aber dein Sauerstoff reicht kaum für den Endanflug. Du musst den Tank auffüllen.",
        items: [
            { id: "o2", label: "Sauerstoff aufbereiten", challenge: "sauerstoff", found: "Der <b>Sauerstoff-Tank</b> ist voll!" }
        ],
        exits: [
            { to: "start",    label: "Zurück zu deinem Schiff" },
            {
                to: "erdumlauf", label: "In die Erdumlaufbahn eintreten",
                requires: ["o2"],
                locked: "Dein Sauerstoff reicht nicht. <i>Tipp: Fülle zuerst deinen Tank auf!</i>",
                challenge: "kreisumfang"
            }
        ]
    },

    gasries: {
        name: "Der Gasriese", icon: "🪐", pos: [1, 0], scene: "gasries",
        text: "Ein gewaltiger Planet mit bunten Streifen – seine Magnetfelder sind beeindruckend und gefährlich. Aber hinter ihm liegt ein Abkürzungsweg. Kannst du ihn berechnen?",
        items: [
            { id: "kraftfeld", label: "Kraftfeld-Generator aktivieren", challenge: "kreisumfang", found: "Der <b>Kraftfeld-Generator</b> läuft! Er schützt dich vor dem Magnetfeld." }
        ],
        exits: [
            { to: "asteroide",   label: "Zurück zur Asteroidengruppe" },
            { to: "funkstation", label: "Zur Funkstation" }
        ]
    },

    mond: {
        name: "Der Mond", icon: "🌙", pos: [2, 1], scene: "mond",
        text: "Graues Gestein, riesige Krater. Hier ist es still – zu still. In einem Krater liegt ein verlassenes Landemodul. Darin: Vorräte und ein alter Navigations-Computer.",
        items: [
            { id: "medkit",  label: "Modul-Erste-Hilfe-Koffer öffnen", found: "Du findest ein <b>Medizin-Kit</b>! +2 ❤️ wenn du es benutzt." },
            { id: "kompass", label: "Navigations-Computer starten", challenge: "sternfolge", found: "Der <b>Navigations-Kompass</b> ist aktiviert!" }
        ],
        exits: [
            { to: "start", label: "Zurück zu deinem Schiff" },
            {
                to: "erdumlauf", label: "In die Erdumlaufbahn eintreten",
                requires: ["kompass"],
                locked: "Ohne Navigations-Kompass verirrst du dich. <i>Tipp: Starte den Computer auf dem Mond!</i>"
            }
        ]
    },

    erdumlauf: {
        name: "Erdumlaufbahn", icon: "🛰️", pos: [1, 3], scene: "erdumlauf",
        text: "Du umkreist die Erde! Unten glitzern Ozeane, oben funkeln die Sterne. <b>Fast geschafft – du brauchst ein Funksignal, damit die Landekapsel ausgefahren wird!</b>",
        exits: [
            { to: "planet", label: "Zurück Richtung Erde" },
            {
                to: "landung", label: "Landung einleiten",
                requires: ["funk"],
                locked: "Das Funkgerät fehlt – ohne Signal öffnet sich die Landekapsel nicht. <i>Tipp: Reparatur-Kit + Funkstation!</i>",
                challenge: "bruchaddition"
            }
        ]
    },

    landung: {
        name: "Sichere Landung!", icon: "🛬", pos: [2, 3], scene: "landung", goal: true,
        text: "Die Kapsel fährt aus, die Bremsdüsen heulen – dann der Aufprall, sanfter als erwartet. Die Luke öffnet sich. Rettungskräfte stürmen herbei. <b>Du bist gerettet! 🎉 Gut gemacht!</b>"
    }
};

// ---------- SVG-Szenenbilder ----------
var sSvgCount = 0;
function sSvg(sky1, sky2, body) {
    var id = "ssky" + (++sSvgCount);
    return '<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" class="scene-svg">' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + sky1 + '"/><stop offset="1" stop-color="' + sky2 + '"/>' +
        '</linearGradient></defs>' +
        '<rect width="320" height="160" fill="url(#' + id + ')"/>' +
        body + '</svg>';
}

function sStars(count) {
    var stars = '';
    for (var i = 0; i < count; i++) {
        var x = (Math.random() * 320).toFixed(1);
        var y = (Math.random() * 160).toFixed(1);
        var r = (Math.random() * 1.5 + 0.5).toFixed(1);
        var op = (Math.random() * 0.5 + 0.5).toFixed(2);
        stars += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff" opacity="' + op + '"/>';
    }
    return stars;
}

function sRocket(x, y, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
        '<ellipse cx="0" cy="-5" rx="5" ry="14" fill="#e2e8f0"/>' +
        '<ellipse cx="0" cy="-17" rx="3" ry="5" fill="#ef4444"/>' +
        '<rect x="-7" y="-2" width="5" height="8" rx="1" fill="#64748b"/>' +
        '<rect x="2"  y="-2" width="5" height="8" rx="1" fill="#64748b"/>' +
        '<ellipse cx="-2" cy="10" rx="3" ry="5" fill="#f97316" opacity="0.8"/>' +
        '<ellipse cx="2"  cy="10" rx="3" ry="5" fill="#f97316" opacity="0.8"/>' +
        '</g>';
}

function sPlanet(x, y, r, c1, c2) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c1 + '"/>' +
        '<path d="M' + (x - r) + ',' + y + ' Q' + x + ',' + (y - r * 0.3) + ' ' + (x + r) + ',' + y +
        ' Q' + x + ',' + (y + r * 0.3) + ' ' + (x - r) + ',' + y + ' Z" fill="' + c2 + '" opacity="0.45"/>';
}

function sAsteroid(x, y, size, seed) {
    var pts = '', n = 9;
    for (var i = 0; i < n; i++) {
        var a = (i / n) * Math.PI * 2;
        var r = size * (0.65 + ((seed * (i + 1) * 7) % 37) / 100);
        pts += (i === 0 ? 'M' : 'L') + (x + Math.cos(a) * r).toFixed(1) + ',' + (y + Math.sin(a) * r).toFixed(1) + ' ';
    }
    return '<path d="' + pts + 'Z" fill="#78716c" stroke="#57534e" stroke-width="1"/>';
}

var S_SCENES = {
    start: function () {
        return sSvg('#060d1f', '#0f2040', sStars(35) +
            '<rect x="110" y="55" width="100" height="55" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>' +
            '<rect x="118" y="62" width="22" height="32" rx="3" fill="#38bdf8" opacity="0.55"/>' +
            '<rect x="160" y="62" width="22" height="32" rx="3" fill="#38bdf8" opacity="0.55"/>' +
            '<rect x="143" y="68" width="14" height="16" rx="2" fill="#0ea5e9" opacity="0.7"/>' +
            sRocket(205, 42, 1.4) +
            '<text x="160" y="148" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Dein Raumschiff</text>');
    },
    asteroide: function () {
        return sSvg('#060d1f', '#0f172a', sStars(28) +
            sAsteroid(55, 65, 16, 3) + sAsteroid(95, 88, 12, 7) + sAsteroid(140, 55, 20, 11) +
            sAsteroid(185, 78, 14, 5) + sAsteroid(230, 62, 18, 9) + sAsteroid(270, 88, 13, 2) +
            sRocket(35, 38, 1.2) +
            '<text x="160" y="148" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Asteroidenfeld</text>');
    },
    funkstation: function () {
        return sSvg('#060d1f', '#0d1b2a', sStars(22) +
            '<rect x="130" y="85" width="60" height="40" rx="3" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>' +
            '<rect x="155" y="48" width="10" height="37" fill="#334155"/>' +
            '<circle cx="160" cy="44" r="7" fill="#dc2626" opacity="0.9"/>' +
            '<line x1="160" y1="44" x2="190" y2="22" stroke="#475569" stroke-width="2"/>' +
            '<line x1="160" y1="44" x2="130" y2="22" stroke="#475569" stroke-width="2"/>' +
            '<line x1="160" y1="44" x2="205" y2="32" stroke="#475569" stroke-width="1.5"/>' +
            sRocket(75, 65, 1.0) +
            '<text x="160" y="148" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Verlassene Funkstation</text>');
    },
    planet: function () {
        return sSvg('#060d1f', '#0f172a', sStars(38) +
            sPlanet(160, 82, 42, '#2563eb', '#1d4ed8') +
            '<path d="M120,80 Q160,62 200,80 Q160,98 120,80 Z" fill="#16a34a" opacity="0.35"/>' +
            '<ellipse cx="138" cy="74" rx="16" ry="7" fill="#fff" opacity="0.55"/>' +
            '<ellipse cx="175" cy="86" rx="21" ry="9" fill="#fff" opacity="0.45"/>' +
            sRocket(58, 48, 1.3) +
            '<text x="160" y="148" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Die Erde – so nah!</text>');
    },
    gasries: function () {
        return sSvg('#060d1f', '#1a0a00', sStars(18) +
            sPlanet(160, 82, 58, '#c2410c', '#9a3412') +
            '<ellipse cx="160" cy="82" rx="72" ry="14" fill="none" stroke="#fbbf24" stroke-width="4" opacity="0.35"/>' +
            '<path d="M102,82 Q160,54 218,82 Q160,106 102,82 Z" fill="#f97316" opacity="0.25"/>' +
            '<path d="M108,82 Q160,66 212,82 Q160,98 108,82 Z" fill="#fbbf24" opacity="0.2"/>' +
            sRocket(42, 38, 1.2) +
            '<text x="160" y="152" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Der Gasriese</text>');
    },
    mond: function () {
        return sSvg('#060d1f', '#0a0a14', sStars(45) +
            '<circle cx="160" cy="82" r="48" fill="#9ca3af"/>' +
            '<circle cx="138" cy="72" r="10" fill="#6b7280" opacity="0.55"/>' +
            '<circle cx="172" cy="92" r="14" fill="#6b7280" opacity="0.45"/>' +
            '<circle cx="153" cy="102" r="7" fill="#6b7280" opacity="0.6"/>' +
            '<circle cx="183" cy="74" r="6" fill="#6b7280" opacity="0.4"/>' +
            '<rect x="148" y="60" width="24" height="18" rx="2" fill="#374151"/>' +
            '<circle cx="160" cy="57" r="6" fill="#38bdf8" opacity="0.5"/>' +
            sRocket(55, 45, 1.2) +
            '<text x="160" y="150" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Der Mond</text>');
    },
    erdumlauf: function () {
        return sSvg('#060d1f', '#0f172a', sStars(32) +
            sPlanet(160, 108, 62, '#2563eb', '#1d4ed8') +
            '<path d="M98,108 Q160,85 222,108 Q160,128 98,108 Z" fill="#16a34a" opacity="0.28"/>' +
            '<ellipse cx="128" cy="100" rx="20" ry="8" fill="#fff" opacity="0.45"/>' +
            '<ellipse cx="183" cy="112" rx="24" ry="10" fill="#fff" opacity="0.38"/>' +
            '<ellipse cx="160" cy="108" rx="78" ry="22" fill="none" stroke="#475569" stroke-width="1.5" stroke-dasharray="5,4"/>' +
            sRocket(74, 46, 1.4) +
            '<text x="160" y="154" text-anchor="middle" fill="#64748b" font-size="9" font-family="sans-serif">Erdumlaufbahn</text>');
    },
    landung: function () {
        return sSvg('#060d1f', '#0f172a', sStars(22) +
            sPlanet(160, 118, 52, '#2563eb', '#1d4ed8') +
            '<ellipse cx="138" cy="112" rx="16" ry="7" fill="#fff" opacity="0.5"/>' +
            '<ellipse cx="174" cy="122" rx="19" ry="8" fill="#fff" opacity="0.4"/>' +
            '<path d="M118,138 Q160,148 202,138" fill="none" stroke="#22c55e" stroke-width="2.5" opacity="0.7"/>' +
            sRocket(160, 55, 1.7) +
            '<line x1="152" y1="72" x2="142" y2="95" stroke="#f97316" stroke-width="2.5" opacity="0.9"/>' +
            '<line x1="168" y1="72" x2="178" y2="95" stroke="#f97316" stroke-width="2.5" opacity="0.9"/>' +
            '<line x1="160" y1="74" x2="160" y2="98" stroke="#fbbf24" stroke-width="2" opacity="0.85"/>' +
            '<text x="160" y="154" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="bold" font-family="sans-serif">Sicher gelandet! 🎉</text>');
    }
};
