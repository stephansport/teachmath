// TeachMath – Gebirgs-Abenteuer „Verirrt im Zahlengebirge“
// Daten: Gegenstände, Rätsel, Orte und Bilder

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function round10(n) { return Math.round(n / 10) * 10; }

// ---------- Gegenstände ----------
var M_ITEMS = {
    proviant:   { name: "Proviant",        icon: "🥪", desc: "Brot und Käse. Essen gibt dir 1 ❤️ zurück.", heal: 1 },
    erstehilfe: { name: "Erste-Hilfe-Kit", icon: "🩹", desc: "Verband und Pflaster. Gibt dir 2 ❤️ zurück.", heal: 2 },
    seil:       { name: "Seil",            icon: "🪢", desc: "Ein langes, festes Kletterseil." },
    fackel:     { name: "Fackel",          icon: "🔥", desc: "Leuchtet dunkle Orte aus." },
    karte:      { name: "Wanderkarte",     icon: "🗺️", desc: "Eine alte Karte mit eingezeichneten Pfaden." },
    kompass:    { name: "Kompass",         icon: "🧭", desc: "Zeigt immer nach Norden – auch im Nebel." },
    steigeisen: { name: "Steigeisen",      icon: "🥾", desc: "Metallzacken für die Schuhe. Damit rutschst du auf Eis nicht aus." }
};

// ---------- Mathe-Rätsel (5. Klasse) ----------
var M_CHALLENGES = {
    seilKnoten: function () {
        var a = rnd(8, 15), b = rnd(6, 12), c = rnd(5, 10);
        return { text: "Im Gebüsch am Ufer hängen drei alte Seilstücke: <b>" + a + " m</b>, <b>" + b + " m</b> und <b>" + c + " m</b>. Du knotest sie zusammen. Für jeden der <b>2 Knoten</b> geht <b>1 m</b> Seil verloren. Wie lang ist dein Seil am Ende?",
            answer: a + b + c - 2, unit: "m", hint: a + " + " + b + " + " + c + " − 2" };
    },
    kienspan: function () {
        var b = rnd(4, 9), z = rnd(6, 12), weg = rnd(3, 9);
        return { text: "Für eine Fackel sammelst du harzige Kiefernzweige. Du bindest <b>" + b + " Bündel</b> mit je <b>" + z + " Zweigen</b>. Beim Tragen fallen dir <b>" + weg + " Zweige</b> herunter. Wie viele Zweige hast du noch?",
            answer: b * z - weg, unit: "Zweige", hint: b + " × " + z + " − " + weg + "  (Punkt vor Strich!)" };
    },
    vorraete: function () {
        var d = rnd(3, 9), q = rnd(12, 25), n = d * q;
        return { text: "Die Truhe hat ein Zahlenschloss. Auf dem Deckel steht: „Teile meine <b>" + n + " Nüsse</b> gerecht auf <b>" + d + " Wanderer</b> auf. Wie viele bekommt jeder? Das ist der Code!“",
            answer: q, unit: "Nüsse", hint: n + " : " + d };
    },
    hoehenmeter: function () {
        var s = pick([1150, 1280, 1340, 1420]), g = s + rnd(4, 9) * 100 + pick([25, 50, 75]);
        return { text: "Am Gipfelkreuz steht auf einem Schild: <b>Gipfel " + g + " m</b>. Deine Absturzstelle lag auf <b>" + s + " m</b> Höhe. Wie viele Höhenmeter bist du aufgestiegen? Wenn du richtig rechnest, darfst du den Kompass mitnehmen.",
            answer: g - s, unit: "m", hint: g + " − " + s };
    },
    hoehleFlaeche: function () {
        var a = rnd(6, 14), b = rnd(4, 9);
        return { text: "Im Fackelschein siehst du eine rechteckige Kammer, <b>" + a + " m</b> lang und <b>" + b + " m</b> breit. In der Ecke liegt ein alter Rucksack mit einem Zettel: „Nur wer die <b>Fläche</b> dieser Kammer kennt, darf mich öffnen.“ Wie groß ist die Fläche?",
            answer: a * b, unit: "m²", hint: "Fläche = Länge × Breite = " + a + " × " + b };
    },
    schluchtSeil: function () {
        var breite = rnd(9, 18), seil = breite + 6 + rnd(2, 10);
        return { text: "Die Schlucht ist <b>" + breite + " m</b> breit. Dein Seil ist <b>" + seil + " m</b> lang. Auf jeder Seite brauchst du <b>3 m</b> Seil, um es am Baum festzubinden. Wie viele Meter Seil bleiben übrig?",
            answer: seil - breite - 6, unit: "m", hint: seil + " − " + breite + " − 3 − 3" };
    },
    kartenMassstab: function () {
        var cm = rnd(3, 9);
        return { text: "Auf deiner Karte ist der Pfad hinter dem Wasserfall <b>" + cm + " cm</b> lang. Unten auf der Karte steht: <b>1 cm auf der Karte = 500 m</b> in Wirklichkeit. Wie viele Meter musst du laufen?",
            answer: cm * 500, unit: "m", hint: cm + " × 500" };
    },
    gletscherSchaetzung: function () {
        var n = rnd(18, 49), m = rnd(11, 29), est = round10(n) * round10(m), exact = n * m;
        return { text: "Über den Gletscher führt eine Spur aus <b>" + n + " Fahnenstangen</b>, je etwa <b>" + m + " m</b> voneinander entfernt. Wie lang ist der Weg <b>ungefähr</b>? Mach einen Überschlag!",
            answer: est, unit: "m", hint: "Runde auf Zehner: " + round10(n) + " × " + round10(m),
            accept: function (x) { return x === est || Math.abs(x - exact) <= exact * 0.25; } };
    }
};

// ---------- Orte ----------
// pos = [Spalte, Zeile] auf der Übersichtskarte
var M_LOCATIONS = {
    crash: { name: "Die Absturzstelle", icon: "🪂", pos: [1, 2], scene: "crash",
        text: "Du öffnest die Augen. Über dir flattert dein Gleitschirm – er hat sich in einem Busch verfangen. Dein Funkgerät ist kaputt, dein Handy hat keinen Empfang. Um dich herum nur Felsen, Wiesen und Gipfel. <b>Du musst einen Weg zurück in die Zivilisation finden!</b>",
        items: [ { id: "proviant", label: "Rucksack durchsuchen", found: "In deinem Rucksack findest du noch etwas <b>Proviant</b>." } ],
        exits: [ { to: "bach", label: "Dem Rauschen nach Westen folgen" },
                 { to: "waldhang", label: "Hinunter zum Waldhang (Osten)" } ] },

    bach: { name: "Der Gebirgsbach", icon: "💧", pos: [0, 2], scene: "bach",
        text: "Ein eiskalter Bach sprudelt über glatte Steine. Du trinkst ein paar Schlucke – herrlich! Im Gebüsch am Ufer hängen alte Seilreste, vielleicht von Bergsteigern. Bachaufwärts siehst du einen dunklen Höhleneingang, bachabwärts rauscht ein Wasserfall. Im Süden scheint das Gelände steil abzufallen.",
        items: [ { id: "seil", label: "Seilreste zusammenknoten", challenge: "seilKnoten", found: "Du hast jetzt ein langes <b>Seil</b>!" } ],
        exits: [ { to: "crash", label: "Zurück zur Absturzstelle" },
                 { to: "hoehle", label: "Bachaufwärts zur Höhle" },
                 { to: "schlucht", label: "Am Ufer entlang nach Süden" },
                 { to: "wasserfall", label: "Bachabwärts zum Wasserfall" } ] },

    hoehle: { name: "Die Höhle", icon: "🕳️", pos: [0, 1], scene: "hoehle",
        text: "Der Höhleneingang ist groß genug, um aufrecht zu stehen. Hier ist es windstill und trocken. Weiter hinten wird es stockdunkel. Außen am Fels führt ein schmaler, steiler Pfad hinauf in Richtung Gipfel.",
        items: [ { id: "steigeisen", label: "Tiefer in die Höhle gehen", requires: ["fackel"],
                   locked: "Es ist stockdunkel – ohne Licht stolperst du nur. <i>Tipp: Am Waldhang wachsen harzige Kiefern. Daraus kann man eine Fackel bauen.</i>",
                   challenge: "hoehleFlaeche", found: "Im Rucksack liegen <b>Steigeisen</b>! Damit kannst du über Eis laufen." } ],
        exits: [ { to: "bach", label: "Hinunter zum Bach" },
                 { to: "gipfel", label: "Den Felspfad zum Gipfel hinaufklettern" } ] },

    waldhang: { name: "Der Waldhang", icon: "🌲", pos: [2, 2], scene: "wald",
        text: "Zwischen knorrigen Kiefern duftet es nach Harz. An einem Baum entdeckst du eine verblasste rot-weiße Wegmarkierung. Sie zeigt bergauf zu einer Hütte. Weiter unten hörst du Wasser rauschen.",
        items: [ { id: "fackel", label: "Eine Fackel aus Kiefernzweigen bauen", challenge: "kienspan", found: "Du hast eine <b>Fackel</b> gebaut. Mit deinem Feuerzeug kannst du sie jederzeit anzünden!" } ],
        exits: [ { to: "crash", label: "Hinauf zur Absturzstelle" },
                 { to: "almhuette", label: "Der Wegmarkierung zur Hütte folgen" },
                 { to: "wasserfall", label: "Hinunter zum Wasserfall" } ] },

    almhuette: { name: "Die verlassene Almhütte", icon: "🛖", pos: [2, 1], scene: "huette", rest: true,
        text: "Eine alte Holzhütte, seit Jahren verlassen. Drinnen stehen ein Tisch, eine Pritsche zum Schlafen und eine verschlossene Truhe. An der Wand hängt ein Erste-Hilfe-Kasten.",
        items: [ { id: "erstehilfe", label: "Erste-Hilfe-Kasten öffnen", found: "Du nimmst das <b>Erste-Hilfe-Kit</b> mit." },
                 { id: "karte", label: "Die Truhe öffnen", challenge: "vorraete", found: "In der Truhe liegt eine <b>Wanderkarte</b>! Darauf ist ein Pfad hinter dem Wasserfall eingezeichnet, der ins Tal führt." } ],
        exits: [ { to: "waldhang", label: "Zurück zum Waldhang" },
                 { to: "gipfel", label: "Über die Almwiese zum Gipfel" } ] },

    gipfel: { name: "Der Gipfel", icon: "⛰️", pos: [1, 0], scene: "gipfel",
        text: "Was für eine Aussicht! Endlose Bergketten. Im Norden glitzert ein Gletscher, dahinter erkennst du ein winziges Dach mit Antenne. Im Süden, weit unten, siehst du Häuser und einen Kirchturm hinter einem Wasserfall. Am Gipfelkreuz hängt etwas Glänzendes.",
        items: [ { id: "kompass", label: "Das Glänzende am Gipfelkreuz ansehen", challenge: "hoehenmeter", found: "Es ist ein <b>Kompass</b>! Den nimmst du mit." } ],
        exits: [ { to: "hoehle", label: "Den Felspfad hinunter zur Höhle" },
                 { to: "almhuette", label: "Über die Almwiese zur Hütte" },
                 { to: "gletscher", label: "Nach Norden zum Gletscher" } ] },

    gletscher: { name: "Der Gletscher", icon: "🧊", pos: [2, 0], scene: "gletscher",
        text: "Vor dir liegt eine riesige, bläulich schimmernde Eisfläche mit tiefen Spalten. Am anderen Ende steht eine Berghütte mit Antenne auf dem Dach! Rote Fahnenstangen markieren einen Weg übers Eis. Nebel zieht auf.",
        exits: [ { to: "gipfel", label: "Zurück zum Gipfel" },
                 { to: "berghuette", label: "Über den Gletscher zur Berghütte", requires: ["steigeisen", "kompass"],
                   locked: "Das Eis ist spiegelglatt und im Nebel verlierst du sofort die Richtung. Du brauchst <b>Steigeisen</b> und einen <b>Kompass</b>. <i>Tipp: Schau dich in der Höhle und am Gipfel genau um.</i>",
                   challenge: "gletscherSchaetzung" } ] },

    schlucht: { name: "Die Schlucht", icon: "🏞️", pos: [0, 3], scene: "schlucht",
        text: "Der Weg endet an einer tiefen Schlucht. Unten tost ein Wildbach. Auf der anderen Seite siehst du einen breiten Forstweg mit Reifenspuren! An beiden Kanten stehen kräftige Bäume.",
        exits: [ { to: "bach", label: "Zurück zum Bach" },
                 { to: "forstweg", label: "Mit dem Seil über die Schlucht", requires: ["seil"],
                   locked: "Die Schlucht ist viel zu breit zum Springen. Mit einem <b>Seil</b> zwischen den Bäumen könntest du dich hinüberhangeln. <i>Tipp: Am Gebirgsbach hingen Seilreste.</i>",
                   challenge: "schluchtSeil" } ] },

    wasserfall: { name: "Der Wasserfall", icon: "🌈", pos: [1, 3], scene: "wasserfall",
        text: "Das Wasser stürzt zwanzig Meter in die Tiefe, in der Gischt leuchtet ein Regenbogen. Hinter dem Wasservorhang entdeckst du mehrere Felsspalten – aber welche führt weiter?",
        exits: [ { to: "bach", label: "Bachaufwärts zum Gebirgsbach" },
                 { to: "waldhang", label: "Hinauf zum Waldhang" },
                 { to: "bergdorf", label: "Durch die Felsspalte hinter dem Wasserfall", requires: ["karte"],
                   locked: "Hinter dem Wasser ist es glitschig, und es gibt viele Spalten. Ohne zu wissen, welche ins Tal führt, ist das zu gefährlich. <i>Tipp: Vielleicht liegt irgendwo eine Karte – zum Beispiel in einer Hütte?</i>",
                   challenge: "kartenMassstab" } ] },

    bergdorf: { name: "Das Bergdorf", icon: "🏘️", pos: [2, 3], scene: "dorf", goal: true,
        text: "Der Pfad hinter dem Wasserfall führt dich hinab ins Tal. Plötzlich hörst du Kuhglocken – und dann siehst du es: ein kleines Bergdorf mit Kirchturm! Die Wirtin des Gasthofs bringt dir eine heiße Schokolade und ruft deine Familie an. <b>Du bist gerettet!</b>" },

    forstweg: { name: "Der Forstweg", icon: "🚙", pos: [0, 4], scene: "forst", goal: true,
        text: "Mit klopfendem Herzen hangelst du dich am Seil über die Schlucht. Geschafft! Du folgst dem Forstweg – und da kommt ein grüner Geländewagen. Der Förster hält an: „Na, wo kommst du denn her?“ Er nimmt dich mit ins Tal. <b>Du bist gerettet!</b>" },

    berghuette: { name: "Die Berghütte", icon: "📡", pos: [3, 0], scene: "berghuette", goal: true,
        text: "Mit Steigeisen und Kompass überquerst du sicher den Gletscher. In der Berghütte steht ein Funkgerät! Du rufst die Bergwacht. Eine halbe Stunde später landet ein Rettungshubschrauber vor der Hütte. <b>Du bist gerettet!</b>" }
};

// ---------- Bilder (SVG) ----------
var mSvgCount = 0;
function mSvg(sky1, sky2, body) {
    var id = "msky" + (++mSvgCount);
    return '<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" class="scene-svg">' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky1 + '"/><stop offset="1" stop-color="' + sky2 + '"/></linearGradient></defs>' +
        '<rect width="320" height="160" fill="url(#' + id + ')"/>' + body + '</svg>';
}
var M_FAR = '<polygon points="0,100 45,55 80,85 125,25 170,80 210,40 255,90 295,50 320,75 320,160 0,160" fill="#94a3b8" opacity="0.55"/>' +
    '<polygon points="125,25 113,42 121,40 127,47 134,40 140,43" fill="#f8fafc"/>' +
    '<polygon points="210,40 200,53 208,51 214,57 220,51 225,53" fill="#f8fafc"/>';
function mTree(x, y, s) {
    s = s || 1;
    return '<rect x="' + (x - 2 * s) + '" y="' + y + '" width="' + (4 * s) + '" height="' + (6 * s) + '" fill="#78350f"/>' +
        '<polygon points="' + x + ',' + (y - 30 * s) + ' ' + (x - 10 * s) + ',' + y + ' ' + (x + 10 * s) + ',' + y + '" fill="#166534"/>';
}
function mSun(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="12" fill="#fde047"/>'; }
function mHouse(x, y) {
    return '<rect x="' + x + '" y="' + y + '" width="30" height="20" fill="#fef3c7"/>' +
        '<polygon points="' + (x - 4) + ',' + y + ' ' + (x + 15) + ',' + (y - 14) + ' ' + (x + 34) + ',' + y + '" fill="#b91c1c"/>' +
        '<rect x="' + (x + 12) + '" y="' + (y + 8) + '" width="6" height="12" fill="#78350f"/>';
}

var M_SCENES = {
    crash: function () { return mSvg('#7dd3fc', '#e0f2fe', mSun(40, 30) + M_FAR +
        '<rect y="118" width="320" height="42" fill="#84cc16"/>' +
        '<polygon points="20,125 40,110 60,125" fill="#78716c"/><polygon points="270,128 285,115 300,128" fill="#78716c"/>' +
        '<ellipse cx="230" cy="120" rx="22" ry="8" fill="#3f6212"/>' +
        '<path d="M195,72 Q230,38 265,72 Z" fill="#f97316"/><path d="M205,72 Q230,52 255,72" fill="none" stroke="#c2410c" stroke-width="2"/>' +
        '<line x1="198" y1="72" x2="228" y2="114" stroke="#334155"/><line x1="262" y1="72" x2="232" y2="114" stroke="#334155"/>' +
        '<circle cx="120" cy="108" r="5" fill="#fcd34d"/><rect x="116" y="113" width="8" height="11" rx="2" fill="#2563eb"/>'); },
    bach: function () { return mSvg('#93c5fd', '#e0f2fe', M_FAR +
        '<rect y="110" width="320" height="50" fill="#65a30d"/>' +
        '<path d="M0,150 C60,120 100,160 160,130 S260,110 320,125 L320,140 C260,128 210,150 160,145 S60,140 0,160 Z" fill="#38bdf8"/>' +
        '<ellipse cx="90" cy="142" rx="8" ry="4" fill="#a8a29e"/><ellipse cx="200" cy="136" rx="7" ry="3" fill="#a8a29e"/>' +
        mTree(40, 118, 1) + mTree(280, 112, 1.2) +
        '<path d="M245,108 q6,-8 12,0 q6,-8 12,0 q6,-8 12,0" fill="none" stroke="#a16207" stroke-width="2"/>'); },
    hoehle: function () { return mSvg('#94a3b8', '#cbd5e1',
        '<polygon points="0,160 0,40 60,15 150,30 240,10 320,45 320,160" fill="#57534e"/>' +
        '<polygon points="0,160 0,70 80,50 160,60 250,40 320,75 320,160" fill="#78716c"/>' +
        '<path d="M110,160 L110,110 Q160,55 210,110 L210,160 Z" fill="#1c1917"/>' +
        '<circle cx="140" cy="125" r="3" fill="#fbbf24" opacity="0.6"/>' +
        '<path d="M240,160 L260,120 L280,100 L300,70" fill="none" stroke="#d6d3d1" stroke-width="3" stroke-dasharray="6,4"/>'); },
    wald: function () {
        var t = '';
        for (var i = 0; i < 9; i++) t += mTree(20 + i * 36, 120 + (i % 3) * 12, 1 + (i % 2) * 0.4);
        return mSvg('#86efac', '#dcfce7', M_FAR + '<rect y="115" width="320" height="45" fill="#4d7c0f"/>' + t +
            '<rect x="150" y="96" width="7" height="9" fill="#fff"/><rect x="150" y="99" width="7" height="3" fill="#dc2626"/>'); },
    huette: function () { return mSvg('#7dd3fc', '#e0f2fe', M_FAR + '<rect y="115" width="320" height="45" fill="#84cc16"/>' +
        '<rect x="190" y="50" width="8" height="18" fill="#57534e"/>' +
        '<rect x="110" y="80" width="100" height="50" fill="#92400e"/>' +
        '<polygon points="100,82 160,45 220,82" fill="#57534e"/>' +
        '<rect x="150" y="100" width="20" height="30" fill="#451a03"/>' +
        '<rect x="122" y="92" width="16" height="14" fill="#fde68a"/><rect x="182" y="92" width="16" height="14" fill="#fde68a"/>' +
        mTree(60, 125, 1.2) + mTree(270, 125, 1)); },
    gipfel: function () { return mSvg('#38bdf8', '#e0f2fe', mSun(270, 30) +
        '<polygon points="0,160 0,130 70,95 160,30 250,100 320,120 320,160" fill="#78716c"/>' +
        '<polygon points="160,30 135,55 148,52 160,62 172,52 186,56" fill="#f8fafc"/>' +
        '<rect x="158" y="8" width="4" height="26" fill="#451a03"/><rect x="150" y="14" width="20" height="4" fill="#451a03"/>' +
        '<circle cx="168" cy="24" r="3" fill="#fde047"/>' +
        '<polygon points="0,160 0,145 60,135 120,150 200,138 320,150 320,160" fill="#a8a29e"/>'); },
    gletscher: function () { return mSvg('#bae6fd', '#f0f9ff', M_FAR +
        '<polygon points="0,160 0,95 90,85 180,92 260,80 320,90 320,160" fill="#e0f2fe"/>' +
        '<path d="M40,120 l20,8 M120,110 l25,12 M200,125 l18,-6 M250,105 l20,10" stroke="#38bdf8" stroke-width="3"/>' +
        '<line x1="70" y1="140" x2="70" y2="122" stroke="#dc2626" stroke-width="2"/><line x1="140" y1="128" x2="140" y2="110" stroke="#dc2626" stroke-width="2"/><line x1="210" y1="112" x2="210" y2="96" stroke="#dc2626" stroke-width="2"/>' +
        '<rect x="270" y="70" width="26" height="16" fill="#92400e"/><polygon points="266,72 283,60 300,72" fill="#57534e"/><line x1="290" y1="62" x2="290" y2="48" stroke="#334155" stroke-width="2"/>'); },
    schlucht: function () { return mSvg('#7dd3fc', '#e0f2fe', M_FAR +
        '<polygon points="0,160 0,90 130,90 120,160" fill="#78716c"/><polygon points="320,160 320,90 190,90 200,160" fill="#78716c"/>' +
        '<rect x="0" y="86" width="130" height="6" fill="#65a30d"/><rect x="190" y="86" width="130" height="6" fill="#65a30d"/>' +
        '<path d="M120,155 Q160,145 200,155 L200,160 L120,160 Z" fill="#38bdf8"/>' +
        mTree(110, 86, 0.9) + mTree(205, 86, 0.9) +
        '<rect x="225" y="78" width="95" height="8" fill="#a8a29e"/>'); },
    wasserfall: function () { return mSvg('#7dd3fc', '#e0f2fe',
        '<polygon points="0,160 0,30 120,20 130,160" fill="#78716c"/><polygon points="320,160 320,35 190,25 180,160" fill="#78716c"/>' +
        '<rect x="125" y="22" width="62" height="118" fill="#bae6fd"/>' +
        '<path d="M135,22 v118 M150,22 v118 M165,22 v118 M178,22 v118" stroke="#fff" stroke-width="2" opacity="0.7"/>' +
        '<ellipse cx="156" cy="145" rx="70" ry="14" fill="#38bdf8"/>' +
        '<path d="M95,140 A60,60 0 0 1 215,140" fill="none" stroke="#ef4444" stroke-width="3" opacity="0.6"/>' +
        '<path d="M100,140 A55,55 0 0 1 210,140" fill="none" stroke="#facc15" stroke-width="3" opacity="0.6"/>' +
        '<path d="M105,140 A50,50 0 0 1 205,140" fill="none" stroke="#22c55e" stroke-width="3" opacity="0.6"/>' +
        '<path d="M110,140 A45,45 0 0 1 200,140" fill="none" stroke="#3b82f6" stroke-width="3" opacity="0.6"/>'); },
    dorf: function () { return mSvg('#fdba74', '#fef3c7', mSun(260, 40) + M_FAR + '<rect y="115" width="320" height="45" fill="#84cc16"/>' +
        mHouse(50, 105) + mHouse(100, 110) + mHouse(220, 106) + mHouse(265, 112) +
        '<rect x="160" y="70" width="18" height="50" fill="#f5f5f4"/><polygon points="156,72 169,45 182,72" fill="#b91c1c"/><rect x="166" y="80" width="6" height="8" fill="#334155"/>'); },
    forst: function () { return mSvg('#7dd3fc', '#e0f2fe', M_FAR + '<rect y="110" width="320" height="50" fill="#4d7c0f"/>' +
        mTree(30, 120, 1.3) + mTree(70, 115, 1) + mTree(270, 118, 1.3) +
        '<polygon points="130,160 190,160 175,110 155,110" fill="#a8a29e"/>' +
        '<rect x="150" y="122" width="34" height="16" rx="3" fill="#15803d"/><rect x="156" y="114" width="20" height="10" rx="2" fill="#bbf7d0"/>' +
        '<circle cx="158" cy="139" r="4" fill="#1c1917"/><circle cx="178" cy="139" r="4" fill="#1c1917"/>'); },
    berghuette: function () { return mSvg('#38bdf8', '#e0f2fe', M_FAR +
        '<polygon points="0,160 0,110 320,100 320,160" fill="#e0f2fe"/>' +
        '<rect x="70" y="85" width="80" height="45" fill="#92400e"/><polygon points="62,88 110,55 158,88" fill="#57534e"/><rect x="100" y="105" width="18" height="25" fill="#451a03"/>' +
        '<line x1="135" y1="70" x2="135" y2="40" stroke="#334155" stroke-width="2"/><circle cx="135" cy="40" r="3" fill="#ef4444"/>' +
        '<ellipse cx="230" cy="55" rx="24" ry="11" fill="#dc2626"/><rect x="250" y="51" width="34" height="5" fill="#dc2626"/>' +
        '<line x1="200" y1="40" x2="262" y2="40" stroke="#1e293b" stroke-width="3"/><line x1="230" y1="40" x2="230" y2="45" stroke="#1e293b" stroke-width="2"/>' +
        '<ellipse cx="222" cy="53" rx="8" ry="5" fill="#bae6fd"/><line x1="214" y1="70" x2="246" y2="70" stroke="#1e293b" stroke-width="2"/>'); }
};
