// TeachMath – Dschungel-Abenteuer „Verirrt im Zahlendschungel“
// Daten: Gegenstände, Rätsel, Orte und Bilder

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function round10(n) { return Math.round(n / 10) * 10; }

// ---------- Gegenstände ----------
var J_ITEMS = {
    riegel:     { name: "Müsliriegel",     icon: "🍫", desc: "Ein Energieriegel. Essen gibt dir 1 ❤️ zurück.", heal: 1 },
    erstehilfe: { name: "Erste-Hilfe-Kit", icon: "🩹", desc: "Verband und Pflaster. Gibt dir 2 ❤️ zurück.", heal: 2 },
    seil:       { name: "Lianenseil",      icon: "🪢", desc: "Aus Lianen geknotet. Fest und lang." },
    fackel:     { name: "Fackel",          icon: "🔥", desc: "Leuchtet dunkle Tempelgänge aus." },
    karte:      { name: "Expeditionskarte", icon: "🗺️", desc: "Eine feuchte Karte mit eingezeichneten Pfaden." },
    kompass:    { name: "Kompass",         icon: "🧭", desc: "Zeigt immer nach Norden – auch unter Blätterdach." },
    stiefel:    { name: "Gummistiefel",    icon: "🥾", desc: "Damit versinkst du im Sumpf nicht." }
};

// ---------- Mathe-Rätsel (5. Klasse) ----------
var J_CHALLENGES = {
    lianeSeil: function () {
        var a = rnd(8, 15), b = rnd(6, 12), c = rnd(5, 10);
        return { text: "Am Flussufer hängen drei Lianen: <b>" + a + " m</b>, <b>" + b + " m</b> und <b>" + c + " m</b>. Du knotest sie zusammen. Für jeden der <b>2 Knoten</b> geht <b>1 m</b> verloren. Wie lang ist dein Seil am Ende?",
            answer: a + b + c - 2, unit: "m", hint: a + " + " + b + " + " + c + " − 2" };
    },
    harzFackel: function () {
        var b = rnd(4, 9), z = rnd(6, 12), weg = rnd(3, 9);
        return { text: "Für eine Fackel sammelst du Harzzweige. Du bindest <b>" + b + " Bündel</b> mit je <b>" + z + " Zweigen</b>. Beim Tragen fallen dir <b>" + weg + " Zweige</b> herunter. Wie viele Zweige hast du noch?",
            answer: b * z - weg, unit: "Zweige", hint: b + " × " + z + " − " + weg + "  (Punkt vor Strich!)" };
    },
    vorratsteilung: function () {
        var d = rnd(3, 9), q = rnd(12, 25), n = d * q;
        return { text: "Die Truhe hat ein Zahlenschloss. Auf dem Deckel steht: „Teile meine <b>" + n + " Kokosnüsse</b> gerecht auf <b>" + d + " Forscher</b> auf. Wie viele bekommt jeder? Das ist der Code!“",
            answer: q, unit: "Nüsse", hint: n + " : " + d };
    },
    stufenZaehlen: function () {
        var s = pick([1150, 1280, 1340, 1420]), g = s + rnd(4, 9) * 100 + pick([25, 50, 75]);
        return { text: "An der Tempelspitze steht: <b>" + g + " Stufen</b> bis zur Spitze. Du bist bei Stufe <b>" + s + "</b> gestartet. Wie viele Stufen bist du aufgestiegen? Wenn du richtig rechnest, darfst du den Kompass mitnehmen.",
            answer: g - s, unit: "Stufen", hint: g + " − " + s };
    },
    tempelFlaeche: function () {
        var a = rnd(6, 14), b = rnd(4, 9);
        return { text: "Im Fackelschein siehst du eine rechteckige Kammer, <b>" + a + " m</b> lang und <b>" + b + " m</b> breit. In der Ecke liegt ein Rucksack mit einem Zettel: „Nur wer die <b>Fläche</b> dieser Kammer kennt, darf mich öffnen.“ Wie groß ist die Fläche?",
            answer: a * b, unit: "m²", hint: "Fläche = Länge × Breite = " + a + " × " + b };
    },
    schluchtSeil: function () {
        var breite = rnd(9, 18), seil = breite + 6 + rnd(2, 10);
        return { text: "Die Schlucht ist <b>" + breite + " m</b> breit. Dein Seil ist <b>" + seil + " m</b> lang. Auf jeder Seite brauchst du <b>3 m</b> Seil, um es am Baum festzubinden. Wie viele Meter Seil bleiben übrig?",
            answer: seil - breite - 6, unit: "m", hint: seil + " − " + breite + " − 3 − 3" };
    },
    kartenMassstab: function () {
        var cm = rnd(3, 9);
        return { text: "Auf deiner Karte ist der Pfad hinter dem Wasserfall <b>" + cm + " cm</b> lang. Unten steht: <b>1 cm auf der Karte = 500 m</b> in Wirklichkeit. Wie viele Meter musst du laufen?",
            answer: cm * 500, unit: "m", hint: cm + " × 500" };
    },
    sumpfSchaetzung: function () {
        var n = rnd(18, 49), m = rnd(11, 29), est = round10(n) * round10(m), exact = n * m;
        return { text: "Über den Sumpf führen <b>" + n + " Holzstege</b>, je etwa <b>" + m + " m</b> voneinander entfernt. Wie lang ist der Weg <b>ungefähr</b>? Mach einen Überschlag!",
            answer: est, unit: "m", hint: "Runde auf Zehner: " + round10(n) + " × " + round10(m),
            accept: function (x) { return x === est || Math.abs(x - exact) <= exact * 0.25; } };
    }
};

// ---------- Orte ----------
var J_LOCATIONS = {
    lager: { name: "Das Basislager", icon: "⛺", pos: [1, 2], scene: "lager",
        text: "Du öffnest die Augen. Das Zelt deiner Klasse ist leer – alle sind weitergegangen, du hast verschlafen! Dein Handy hat keinen Empfang. Um dich herum nur Dschungel, Vogelrufe und ein ferner Wasserfall. <b>Du musst einen Weg zurück zur Gruppe finden!</b>",
        items: [ { id: "riegel", label: "Rucksack durchsuchen", found: "Im Rucksack findest du noch einen <b>Müsliriegel</b>." } ],
        exits: [ { to: "fluss", label: "Dem Rauschen nach Westen folgen" },
                 { to: "lichtung", label: "Den Pfad nach Osten nehmen" } ] },

    fluss: { name: "Der Dschungelfluss", icon: "💧", pos: [0, 2], scene: "fluss",
        text: "Ein breiter Fluss schimmert grünbraun. Du trinkst aus der Filterflasche – kühl und gut. In den Bäumen hängen dicke Lianen. Flussaufwärts dämmert ein Tempeleingang, flussabwärts rauscht ein Wasserfall. Im Süden fällt das Gelände steil ab.",
        items: [ { id: "seil", label: "Lianen zusammenknoten", challenge: "lianeSeil", found: "Du hast jetzt ein langes <b>Lianenseil</b>!" } ],
        exits: [ { to: "lager", label: "Zurück zum Basislager" },
                 { to: "tempel", label: "Flussaufwärts zum Tempel" },
                 { to: "schlucht", label: "Am Ufer entlang nach Süden" },
                 { to: "wasserfall", label: "Flussabwärts zum Wasserfall" } ] },

    tempel: { name: "Der Tempel", icon: "🛕", pos: [0, 1], scene: "tempel",
        text: "Steinstufen führen in einen dunklen Tempel. Hier ist es kühl und still. Weiter hinten wird es stockdunkel. Außen führt ein schmaler Pfad hinauf zur Tempelspitze.",
        items: [ { id: "stiefel", label: "Tiefer in den Tempel gehen", requires: ["fackel"],
                   locked: "Es ist stockdunkel – ohne Licht stolperst du nur. <i>Tipp: Auf der Lichtung wachsen harzige Zweige. Daraus kann man eine Fackel bauen.</i>",
                   challenge: "tempelFlaeche", found: "Im alten Rucksack liegen <b>Gummistiefel</b>! Damit kannst du durch den Sumpf waten." } ],
        exits: [ { to: "fluss", label: "Hinunter zum Fluss" },
                 { to: "ruine", label: "Die Stufen zur Tempelspitze hinauf" } ] },

    lichtung: { name: "Die Lichtung", icon: "🌳", pos: [2, 2], scene: "lichtung",
        text: "Zwischen Mammutbäumen fällt Sonnenlicht auf den Boden. An einem Stamm hängt eine verblasste gelbe Wegmarkierung. Sie zeigt zu einer Forschungshütte. Weiter unten hörst du Wasser rauschen.",
        items: [ { id: "fackel", label: "Eine Fackel aus Harzzweigen bauen", challenge: "harzFackel", found: "Du hast eine <b>Fackel</b> gebaut. Mit deinem Feuerzeug kannst du sie jederzeit anzünden!" } ],
        exits: [ { to: "lager", label: "Zurück zum Basislager" },
                 { to: "huette", label: "Der Wegmarkierung zur Hütte folgen" },
                 { to: "wasserfall", label: "Hinunter zum Wasserfall" } ] },

    huette: { name: "Die Forschungshütte", icon: "🛖", pos: [2, 1], scene: "huette", rest: true,
        text: "Eine alte Holzhütte der Expedition. Drinnen stehen ein Tisch, eine Hängematte und eine verschlossene Truhe. An der Wand hängt ein Erste-Hilfe-Kasten.",
        items: [ { id: "erstehilfe", label: "Erste-Hilfe-Kasten öffnen", found: "Du nimmst das <b>Erste-Hilfe-Kit</b> mit." },
                 { id: "karte", label: "Die Truhe öffnen", challenge: "vorratsteilung", found: "In der Truhe liegt eine <b>Expeditionskarte</b>! Darauf ist ein Pfad hinter dem Wasserfall eingezeichnet, der zum Dorf führt." } ],
        exits: [ { to: "lichtung", label: "Zurück zur Lichtung" },
                 { to: "ruine", label: "Über den Pfad zur Tempelspitze" } ] },

    ruine: { name: "Die Tempelspitze", icon: "🗿", pos: [1, 0], scene: "ruine",
        text: "Was für eine Aussicht über das Blättermeer! Im Norden dampft ein Sumpf, dahinter erkennst du eine Antenne. Im Süden, weit unten, siehst du Dächer hinter einem Wasserfall. An der steinernen Figur hängt etwas Glänzendes.",
        items: [ { id: "kompass", label: "Das Glänzende an der Figur ansehen", challenge: "stufenZaehlen", found: "Es ist ein <b>Kompass</b>! Den nimmst du mit." } ],
        exits: [ { to: "tempel", label: "Die Stufen hinunter in den Tempel" },
                 { to: "huette", label: "Zurück zur Forschungshütte" },
                 { to: "sumpf", label: "Nach Norden zum Sumpf" } ] },

    sumpf: { name: "Der Nebelsumpf", icon: "🌫️", pos: [2, 0], scene: "sumpf",
        text: "Vor dir liegt ein dampfender Sumpf mit Treibholz. Am anderen Ende steht eine Station mit Antenne! Holzstege markieren einen Weg. Nebel zieht auf.",
        exits: [ { to: "ruine", label: "Zurück zur Tempelspitze" },
                 { to: "station", label: "Über den Sumpf zur Station", requires: ["stiefel", "kompass"],
                   locked: "Ohne Stiefel versinkst du, und im Nebel verlierst du die Richtung. Du brauchst <b>Gummistiefel</b> und einen <b>Kompass</b>. <i>Tipp: Schau dich im Tempel und auf der Tempelspitze um.</i>",
                   challenge: "sumpfSchaetzung" } ] },

    schlucht: { name: "Die Schlucht", icon: "🏞️", pos: [0, 3], scene: "schlucht",
        text: "Der Weg endet an einer tiefen Schlucht. Unten tost ein Bach. Auf der anderen Seite siehst du einen Forstweg mit Reifenspuren! An beiden Kanten stehen kräftige Bäume.",
        exits: [ { to: "fluss", label: "Zurück zum Fluss" },
                 { to: "rangerpfad", label: "Mit dem Seil über die Schlucht", requires: ["seil"],
                   locked: "Die Schlucht ist viel zu breit zum Springen. Mit einem <b>Seil</b> zwischen den Bäumen könntest du dich hinüberhangeln. <i>Tipp: Am Fluss hingen Lianen.</i>",
                   challenge: "schluchtSeil" } ] },

    wasserfall: { name: "Der Wasserfall", icon: "🌈", pos: [1, 3], scene: "wasserfall",
        text: "Das Wasser stürzt in ein Becken, in der Gischt leuchtet ein Regenbogen. Hinter dem Wasservorhang entdeckst du mehrere Felsspalten – aber welche führt weiter?",
        exits: [ { to: "fluss", label: "Flussaufwärts zum Dschungelfluss" },
                 { to: "lichtung", label: "Hinauf zur Lichtung" },
                 { to: "dorf", label: "Durch die Spalte hinter dem Wasserfall", requires: ["karte"],
                   locked: "Hinter dem Wasser ist es glitschig, und es gibt viele Spalten. Ohne zu wissen, welche zum Dorf führt, ist das zu gefährlich. <i>Tipp: Vielleicht liegt irgendwo eine Karte – zum Beispiel in einer Hütte?</i>",
                   challenge: "kartenMassstab" } ] },

    dorf: { name: "Das Dschungeldorf", icon: "🏘️", pos: [2, 3], scene: "dorf", goal: true,
        text: "Der Pfad hinter dem Wasserfall führt dich hinab. Plötzlich hörst du Hühner und Stimmen – ein kleines Dorf! Die Lehrerin deiner Klasse sitzt schon auf der Veranda. <b>Du bist gerettet!</b>" },

    rangerpfad: { name: "Der Rangerpfad", icon: "🚙", pos: [0, 4], scene: "ranger", goal: true,
        text: "Mit klopfendem Herzen hangelst du dich am Seil über die Schlucht. Geschafft! Du folgst dem Forstweg – und da kommt ein gelber Geländewagen. Der Ranger hält an: „Na, wo kommst du denn her?“ Er fährt dich zur Gruppe. <b>Du bist gerettet!</b>" },

    station: { name: "Die Forschungsstation", icon: "📡", pos: [3, 0], scene: "station", goal: true,
        text: "Mit Stiefeln und Kompass überquerst du sicher den Sumpf. In der Station steht ein Funkgerät! Du rufst die Expedition. Eine halbe Stunde später landet ein Hubschrauber auf der Lichtung. <b>Du bist gerettet!</b>" }
};

// ---------- Bilder (SVG) ----------
var jSvgCount = 0;
function jSvg(sky1, sky2, body) {
    var id = "jsky" + (++jSvgCount);
    return '<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" class="scene-svg">' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky1 + '"/><stop offset="1" stop-color="' + sky2 + '"/></linearGradient></defs>' +
        '<rect width="320" height="160" fill="url(#' + id + ')"/>' + body + '</svg>';
}
function jTree(x, y, s) {
    s = s || 1;
    return '<rect x="' + (x - 3 * s) + '" y="' + y + '" width="' + (6 * s) + '" height="' + (18 * s) + '" fill="#78350f"/>' +
        '<ellipse cx="' + x + '" cy="' + (y - 8 * s) + '" rx="' + (16 * s) + '" ry="' + (14 * s) + '" fill="#15803d"/>' +
        '<ellipse cx="' + (x - 8 * s) + '" cy="' + (y - 2 * s) + '" rx="' + (10 * s) + '" ry="' + (8 * s) + '" fill="#166534"/>';
}
function jSun(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="12" fill="#fde047"/>'; }
function jHouse(x, y) {
    return '<rect x="' + x + '" y="' + y + '" width="30" height="20" fill="#fef3c7"/>' +
        '<polygon points="' + (x - 4) + ',' + y + ' ' + (x + 15) + ',' + (y - 14) + ' ' + (x + 34) + ',' + y + '" fill="#b45309"/>' +
        '<rect x="' + (x + 12) + '" y="' + (y + 8) + '" width="6" height="12" fill="#78350f"/>';
}
var J_CANOPY = '<ellipse cx="40" cy="18" rx="50" ry="22" fill="#166534" opacity="0.85"/>' +
    '<ellipse cx="160" cy="10" rx="70" ry="24" fill="#15803d" opacity="0.9"/>' +
    '<ellipse cx="280" cy="16" rx="55" ry="20" fill="#166534" opacity="0.85"/>';

var J_SCENES = {
    lager: function () { return jSvg('#7dd3fc', '#fef9c3', jSun(40, 28) + J_CANOPY +
        '<rect y="118" width="320" height="42" fill="#4d7c0f"/>' +
        jTree(30, 110, 1.1) + jTree(290, 108, 1.2) +
        '<polygon points="140,118 200,118 170,70" fill="#fef3c7" stroke="#a16207" stroke-width="2"/>' +
        '<line x1="170" y1="70" x2="170" y2="118" stroke="#78350f" stroke-width="3"/>' +
        '<circle cx="230" cy="112" r="5" fill="#fcd34d"/><rect x="226" y="117" width="8" height="11" rx="2" fill="#2563eb"/>'); },
    fluss: function () { return jSvg('#67e8f9', '#ecfccb', J_CANOPY +
        '<rect y="110" width="320" height="50" fill="#3f6212"/>' +
        '<path d="M0,150 C60,120 100,160 160,130 S260,110 320,125 L320,160 0,160 Z" fill="#0e7490"/>' +
        '<ellipse cx="90" cy="142" rx="8" ry="4" fill="#a8a29e"/>' +
        jTree(40, 118, 1) + jTree(280, 112, 1.2) +
        '<path d="M245,108 q6,-8 12,0 q6,-8 12,0 q6,-8 12,0" fill="none" stroke="#65a30d" stroke-width="2"/>'); },
    tempel: function () { return jSvg('#fcd34d', '#fde68a',
        '<rect y="120" width="320" height="40" fill="#4d7c0f"/>' +
        '<polygon points="80,120 160,35 240,120" fill="#a16207"/>' +
        '<polygon points="100,120 160,50 220,120" fill="#92400e"/>' +
        '<rect x="148" y="85" width="24" height="35" fill="#1c1917"/>' +
        '<rect x="90" y="100" width="20" height="20" fill="#78350f"/><rect x="210" y="100" width="20" height="20" fill="#78350f"/>' +
        jTree(30, 125, 0.9) + jTree(290, 125, 0.9)); },
    lichtung: function () {
        var t = '';
        for (var i = 0; i < 7; i++) t += jTree(24 + i * 44, 118 + (i % 2) * 8, 0.9 + (i % 2) * 0.2);
        return jSvg('#86efac', '#fef9c3', J_CANOPY + '<rect y="125" width="320" height="35" fill="#4d7c0f"/>' + t +
            '<rect x="150" y="108" width="7" height="9" fill="#fff"/><rect x="150" y="111" width="7" height="3" fill="#eab308"/>'); },
    huette: function () { return jSvg('#7dd3fc', '#ecfccb', J_CANOPY + '<rect y="115" width="320" height="45" fill="#65a30d"/>' +
        '<rect x="110" y="80" width="100" height="50" fill="#92400e"/>' +
        '<polygon points="100,82 160,45 220,82" fill="#78350f"/>' +
        '<rect x="150" y="100" width="20" height="30" fill="#451a03"/>' +
        '<rect x="122" y="92" width="16" height="14" fill="#fde68a"/><rect x="182" y="92" width="16" height="14" fill="#fde68a"/>' +
        jTree(50, 125, 1.1) + jTree(270, 125, 1)); },
    ruine: function () { return jSvg('#38bdf8', '#fef9c3', jSun(270, 30) + J_CANOPY +
        '<polygon points="60,160 160,40 260,160" fill="#a16207"/>' +
        '<rect x="148" y="20" width="24" height="40" fill="#92400e"/>' +
        '<circle cx="160" cy="18" r="8" fill="#fde047"/>' +
        '<rect y="140" width="320" height="20" fill="#166534"/>'); },
    sumpf: function () { return jSvg('#a3e635', '#d9f99d',
        '<rect y="90" width="320" height="70" fill="#365314"/>' +
        '<ellipse cx="80" cy="120" rx="50" ry="14" fill="#3f6212" opacity="0.7"/>' +
        '<ellipse cx="180" cy="130" rx="60" ry="16" fill="#4d7c0f" opacity="0.6"/>' +
        '<rect x="40" y="118" width="40" height="6" fill="#78350f"/><rect x="120" y="124" width="50" height="6" fill="#78350f"/>' +
        '<rect x="200" y="116" width="45" height="6" fill="#78350f"/>' +
        '<rect x="255" y="70" width="40" height="28" fill="#57534e"/><line x1="275" y1="70" x2="275" y2="48" stroke="#334155" stroke-width="3"/>' +
        '<circle cx="275" cy="46" r="4" fill="#ef4444"/>'); },
    schlucht: function () { return jSvg('#7dd3fc', '#ecfccb',
        '<polygon points="0,160 0,90 130,90 120,160" fill="#365314"/><polygon points="320,160 320,90 190,90 200,160" fill="#365314"/>' +
        '<rect x="0" y="86" width="130" height="6" fill="#65a30d"/><rect x="190" y="86" width="130" height="6" fill="#65a30d"/>' +
        '<path d="M120,155 Q160,145 200,155 L200,160 L120,160 Z" fill="#0e7490"/>' +
        jTree(110, 86, 0.7) + jTree(210, 86, 0.7) +
        '<rect x="225" y="78" width="95" height="8" fill="#a16207"/>'); },
    wasserfall: function () { return jSvg('#67e8f9', '#ecfccb',
        '<polygon points="0,160 0,30 120,20 130,160" fill="#365314"/><polygon points="320,160 320,35 190,25 180,160" fill="#365314"/>' +
        '<rect x="125" y="22" width="62" height="118" fill="#a5f3fc"/>' +
        '<path d="M135,22 v118 M150,22 v118 M165,22 v118 M178,22 v118" stroke="#fff" stroke-width="2" opacity="0.7"/>' +
        '<ellipse cx="156" cy="145" rx="70" ry="14" fill="#22d3ee"/>' +
        '<path d="M95,140 A60,60 0 0 1 215,140" fill="none" stroke="#ef4444" stroke-width="3" opacity="0.6"/>' +
        '<path d="M100,140 A55,55 0 0 1 210,140" fill="none" stroke="#facc15" stroke-width="3" opacity="0.6"/>' +
        '<path d="M105,140 A50,50 0 0 1 205,140" fill="none" stroke="#22c55e" stroke-width="3" opacity="0.6"/>'); },
    dorf: function () { return jSvg('#fdba74', '#fef3c7', jSun(260, 40) + J_CANOPY + '<rect y="115" width="320" height="45" fill="#65a30d"/>' +
        jHouse(50, 105) + jHouse(100, 110) + jHouse(220, 106) + jHouse(265, 112) +
        jTree(160, 125, 1)); },
    ranger: function () { return jSvg('#7dd3fc', '#ecfccb', J_CANOPY + '<rect y="110" width="320" height="50" fill="#4d7c0f"/>' +
        jTree(30, 120, 1.1) + jTree(70, 115, 0.9) + jTree(270, 118, 1.1) +
        '<polygon points="130,160 190,160 175,110 155,110" fill="#a16207"/>' +
        '<rect x="150" y="122" width="34" height="16" rx="3" fill="#eab308"/><rect x="156" y="114" width="20" height="10" rx="2" fill="#fef08a"/>' +
        '<circle cx="158" cy="139" r="4" fill="#1c1917"/><circle cx="178" cy="139" r="4" fill="#1c1917"/>'); },
    station: function () { return jSvg('#38bdf8', '#ecfccb', J_CANOPY +
        '<rect y="120" width="320" height="40" fill="#4d7c0f"/>' +
        '<rect x="70" y="85" width="80" height="45" fill="#57534e"/><polygon points="62,88 110,55 158,88" fill="#334155"/><rect x="100" y="105" width="18" height="25" fill="#1c1917"/>' +
        '<line x1="135" y1="70" x2="135" y2="40" stroke="#334155" stroke-width="2"/><circle cx="135" cy="40" r="3" fill="#ef4444"/>' +
        '<ellipse cx="230" cy="55" rx="24" ry="11" fill="#22c55e"/><rect x="250" y="51" width="34" height="5" fill="#22c55e"/>' +
        '<line x1="200" y1="40" x2="262" y2="40" stroke="#1e293b" stroke-width="3"/>'); }
};
