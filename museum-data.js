// TeachMath – Museums-Abenteuer „Nachts im Museum – Das verschwundene Morgen"
// Daten: Gegenstände, Rätsel, Orte und Bilder

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

// ---------- Gegenstände ----------
var MU_ITEMS = {
    kekse:       { name: "Pixels Notfall-Kekse", icon: "🍪", desc: "Knusprig! Gibt dir 1 ❤️ zurück.", heal: 1 },
    kakao:       { name: "Thermoskanne Kakao",   icon: "☕", desc: "Warm und süß. Gibt dir 2 ❤️ zurück.", heal: 2 },
    fossil:      { name: "Glücks-Fossil",        icon: "🐚", desc: "Ein Geschenk vom Dinosaurier. Zählt als Museumsstempel!", stamp: true },
    ausweis:     { name: "Astronauten-Ausweis",  icon: "🪪", desc: "Freigabe für den Kontrollraum. Zählt als Museumsstempel!", stamp: true },
    schluessel:  { name: "Archivschlüssel",      icon: "🗝️", desc: "Ein verschnörkelter Messingschlüssel vom Uhrmacher. Zählt als Museumsstempel!", stamp: true },
    skarabaeus:  { name: "Goldener Skarabäus",   icon: "🪲", desc: "Ein Dankeschön der Mumie Ramsi. Zählt als Museumsstempel!", stamp: true },
    sternkarte:  { name: "Planetariums-Sternkarte", icon: "🌌", desc: "Zeigt die Wartungsgänge hinter der Kuppel. Zählt als Museumsstempel!", stamp: true },
    kristall:    { name: "Leuchtkristall",       icon: "💎", desc: "Ein Kristall, der im Dunkeln hell schimmert – fast so gut wie eine Lampe." },
    brezel:      { name: "Brezel",               icon: "🥨", desc: "Frisch aus dem Museumscafé. Gibt dir 1 ❤️ zurück.", heal: 1 },
    lampe:       { name: "Grubenlampe",          icon: "🔦", desc: "Leuchtet auch im dunkelsten Treppenhaus." },
    zeitrad:     { name: "Das Zeitrad",          icon: "⚙️", desc: "Ein goldenes Zahnrad. Es tickt ganz leise – ohne es bleibt die Nacht für immer." }
};

// ---------- Mathe-Rätsel (5. Klasse) ----------
// Jede Aufgabe hat genau EINE richtige ganze Zahl als Lösung.
var MU_CHALLENGES = {

    // ===== Route 1: Dinosaurierhalle → Galerie → Dachtreppe (Gewichte, Längen, Umfang)
    knochen: function () {
        var w = rnd(6, 14), kg = rnd(3, 8), s = rnd(40, 90);
        return {
            text: "Das Dinosaurierskelett klappert mit den Zähnen: „Ich lasse dich nur vorbei, wenn du weißt, wie schwer mein Schwanz ist! Er hat <b>" + w + " Wirbel</b> zu je <b>" + kg + " kg</b>, dazu kommt die Schwanzspitze mit <b>" + s + " kg</b>.\"",
            answer: w * kg + s, unit: "kg",
            hint: w + " × " + kg + " + " + s + "  (Punkt vor Strich!)"
        };
    },
    dinolaenge: function () {
        var k = rnd(1, 2), h = rnd(3, 6), r = rnd(4, 7), sw = rnd(8, 12), cm = pick([20, 40, 50, 60, 80]);
        var total = (k + h + r + sw) * 100 + cm;
        return {
            text: "Der Dino möchte sein Namensschild korrigieren: Schädel <b>" + k + " m</b>, Hals <b>" + h + " m</b>, Rumpf <b>" + r + " m</b>, Schwanz <b>" + sw + " m " + cm + " cm</b>. Wie lang ist er insgesamt <b>in Zentimetern</b>?",
            answer: total, unit: "cm",
            hint: "Erst alle Meter addieren: " + (k + h + r + sw) + " m " + cm + " cm. 1 m = 100 cm."
        };
    },
    gegengewicht: function () {
        var n = rnd(3, 5), je = pick([15, 20, 25, 30]), vase = rnd(11, 29), statue = rnd(30, 50);
        return {
            text: "Die Ausstellungsbrücke ist eine riesige Waage. Sie richtet sich erst aus, wenn beide Seiten gleich schwer sind.<br>Links stehen <b>" + n + " Kisten</b> zu je <b>" + je + " kg</b> und eine Vase mit <b>" + vase + " kg</b>. Rechts steht eine Ritterrüstung mit <b>" + statue + " kg</b>.<br>Wie viel Kilogramm Gegengewicht fehlen rechts?",
            answer: n * je + vase - statue, unit: "kg",
            hint: "Links: " + n + " × " + je + " + " + vase + " = " + (n * je + vase) + " kg. Dann minus " + statue + "."
        };
    },
    luke: function () {
        var a = pick([60, 70, 80, 90, 120]), b = pick([40, 45, 50, 55]);
        return {
            text: "Oben an der Dachtreppe ist eine rechteckige Luke. Pixel will eine Lichterkette einmal ringsherum kleben, damit du sie im Dunkeln findest. Die Luke ist <b>" + a + " cm</b> lang und <b>" + b + " cm</b> breit. Wie lang muss die Lichterkette sein (Umfang)?",
            answer: 2 * (a + b), unit: "cm",
            hint: "Umfang Rechteck = 2 × (Länge + Breite)"
        };
    },

    // ===== Route 2: Raumfahrt → Kontrollraum → Lastenaufzug (Grundrechenarten, Zeit, Rechenregeln)
    systemcheck: function () {
        var a = rnd(10, 40), b = rnd(3, 9), c = rnd(3, 9), d = rnd(2, 6);
        return {
            text: "Kommandantin Stern verschränkt die Arme: „Systemcheck, Kadett! Ohne korrekte Rechenregeln kein Zutritt.\"<br>Berechne: <b>" + a + " + " + b + " × " + c + " − " + (d * 2) + " : 2</b>",
            answer: a + b * c - d, unit: "",
            hint: "Punkt vor Strich: zuerst " + b + " × " + c + " und " + (d * 2) + " : 2 rechnen."
        };
    },
    countdown: function () {
        var m = rnd(3, 9), s = rnd(5, 55);
        return {
            text: "Im Kontrollraum blinkt der Bildschirm: „Startsequenz für den Lastenaufzug: <b>" + m + " Minuten " + s + " Sekunden</b>.\" Das Steuerpult will die Zeit nur <b>in Sekunden</b>.",
            answer: m * 60 + s, unit: "Sekunden",
            hint: "1 Minute = 60 Sekunden → " + m + " × 60 + " + s
        };
    },
    energie: function () {
        var proSt = pick([12, 15, 18, 25]), st = rnd(3, 5), rest = rnd(8, 30), akku = proSt * st + rest;
        return {
            text: "Der Lastenaufzug braucht pro Stockwerk <b>" + proSt + " Energieeinheiten</b>. Bis zum Dachatelier sind es <b>" + st + " Stockwerke</b>. Der Akku hat <b>" + akku + " Einheiten</b>. Wie viele Einheiten bleiben nach der Fahrt im Akku?",
            answer: rest, unit: "Einheiten",
            hint: akku + " − " + proSt + " × " + st
        };
    },

    // ===== Route 3: Werkstatt → Archiv → Diensttreppe (Teilbarkeit, Größenumrechnung, fehlende Werte)
    teilbar: function () {
        var good = 12 * rnd(4, 12), opts = [good];
        while (opts.length < 4) {
            var x = rnd(40, 150);
            if (x % 12 !== 0 && opts.indexOf(x) === -1) opts.push(x);
        }
        shuffle(opts);
        return {
            text: "Der Uhrmacher kratzt sich am Blechkopf: „Ich brauche ein Zahnrad, dessen Zähnezahl durch <b>3</b> UND durch <b>4</b> teilbar ist. Nur eines passt!\"<br>Zur Auswahl: <b>" + opts.join(" · ") + "</b><br>Welche Zahl ist es?",
            answer: good, unit: "Zähne",
            hint: "Durch 3 und 4 teilbar heißt: durch 12 teilbar. Teste jede Zahl."
        };
    },
    feder: function () {
        var kg = rnd(2, 5), g = pick([125, 250, 375, 500, 750]);
        return {
            text: "Im Archiv hängt eine alte Grubenlampe an einer Federwaage. Auf dem Schild steht: „Nur wer mein Gewicht in <b>Gramm</b> kennt, darf mich mitnehmen.\" Die Waage zeigt <b>" + kg + " kg " + g + " g</b>.",
            answer: kg * 1000 + g, unit: "g",
            hint: "1 kg = 1000 g → " + kg + " × 1000 + " + g
        };
    },
    archivcode: function () {
        var x = rnd(4, 12), f = rnd(3, 9), add = rnd(5, 30), res = x * f + add;
        return {
            text: "Die Tür zur Diensttreppe hat ein Zahlenschloss. Auf einer Karteikarte steht:<br><b>□ × " + f + " + " + add + " = " + res + "</b><br>Welche Zahl gehört in das Kästchen?",
            answer: x, unit: "",
            hint: "Rückwärts rechnen: (" + res + " − " + add + ") : " + f
        };
    },

    // ===== Erweiterung: Café, Ägypten-Saal, Planetarium, Mineralienkabinett
    wechselgeld: function () {
        var bp = pick([80, 90, 110, 120]), n = rnd(2, 3), kp = pick([130, 150, 170, 190]);
        var total = n * bp + kp, pay = total < 500 ? 500 : 1000;
        var eur = function (c) { return Math.floor(c / 100) + "," + ("0" + (c % 100)).slice(-2) + " €"; };
        return {
            text: "Der Kaffeeautomat im Museumscafé ist aufgewacht und will verkaufen! Du nimmst <b>" + n + " Brezeln</b> zu je <b>" + eur(bp) + "</b> und einen Kakao für <b>" + eur(kp) + "</b>. Du zahlst mit einem <b>" + (pay / 100) + "-€-Schein</b> aus der Fundkiste.<br>Wie viel Wechselgeld bekommst du <b>in Cent</b>?",
            answer: pay - total, unit: "Cent",
            hint: "Alles in Cent: " + n + " × " + bp + " + " + kp + " = " + total + " Cent. Dann " + pay + " − " + total + "."
        };
    },
    hieroglyphen: function () {
        var hu = rnd(1, 4), te = rnd(1, 6), on = rnd(1, 7);
        var rep = function (c, k) { var t = ""; for (var i = 0; i < k; i++) t += c; return t; };
        return {
            text: "An der Wand hinter dem Sarkophag ist eine Geheimtür mit ägyptischen Zahlzeichen: <b>🌀 = 100</b>, <b>∩ = 10</b>, <b>| = 1</b>.<br>Auf dem Schloss steht: <b style='font-size:1.3em;letter-spacing:2px'>" + rep("🌀", hu) + " " + rep("∩", te) + " " + rep("|", on) + "</b><br>Welche Zahl öffnet die Tür?",
            answer: hu * 100 + te * 10 + on, unit: "",
            hint: "Zähle die Zeichen: " + hu + " × 100 + " + te + " × 10 + " + on + " × 1"
        };
    },
    pyramide: function () {
        var n = rnd(3, 5), sum = 0, parts = [];
        for (var k = 1; k <= n; k++) { sum += k * k; parts.push(k + "×" + k); }
        return {
            text: "Mumie Ramsi wickelt aufgeregt an ihren Binden: „Mein Pyramidenmodell ist umgefallen! Die Spitze ist <b>1 Stein</b>, darunter liegt eine Schicht aus <b>2 × 2</b> Steinen, darunter <b>3 × 3</b> und so weiter. Meine Pyramide hat <b>" + n + " Schichten</b>. Wie viele Steine brauche ich insgesamt?“",
            answer: sum, unit: "Steine",
            hint: parts.join(" + ") + " — erst jede Schicht ausrechnen, dann addieren."
        };
    },
    massstab: function () {
        var pl = pick([["den Mond", 3400], ["den Mars", 6800], ["die Erde", 12800], ["den Merkur", 4900], ["den Pluto", 2400]]);
        return {
            text: "Im Planetarium baut der Projektor ein Modell der Himmelskörper. Der Maßstab ist: <b>1 cm im Modell = 100 km in echt</b>. Wie groß wird " + pl[0] + " im Modell, wenn der echte Durchmesser <b>" + pl[1].toLocaleString("de-DE") + " km</b> beträgt?",
            answer: pl[1] / 100, unit: "cm",
            hint: pl[1] + " : 100"
        };
    },
    kristallkanten: function () {
        var a = rnd(3, 9), b = rnd(2, 8), c = rnd(2, 6);
        return {
            text: "Der Leuchtkristall liegt in einer quaderförmigen Vitrine. Die Statue der Geologin Frau Quarz sagt: „Die Vitrine öffnet sich, wenn du mir sagst, wie viel Zentimeter Goldleiste an <b>allen Kanten</b> zusammen kleben.“ Die Vitrine ist <b>" + a + " cm</b> lang, <b>" + b + " cm</b> breit und <b>" + c + " cm</b> hoch.",
            answer: 4 * (a + b + c), unit: "cm",
            hint: "Ein Quader hat 12 Kanten: je 4 gleich lange. 4 × (" + a + " + " + b + " + " + c + ")"
        };
    },

    // ===== Dachatelier & Finale (knifflig)
    zahnraeder: function () {
        var small = pick([8, 10, 12, 15]), k = rnd(3, 6), big = small * k, turns = rnd(2, 4);
        return {
            text: "Das Zeitrad steckt in einer Ausstellungsvitrine mit Kurbelmechanik. Das Zeitrad hat <b>" + big + " Zähne</b>, das kleine Kurbelrad <b>" + small + " Zähne</b>. Die Vitrine öffnet sich, wenn sich das Zeitrad genau <b>" + turns + "-mal</b> gedreht hat.<br>Wie oft musst du das kleine Rad drehen?",
            answer: k * turns, unit: "Umdrehungen",
            hint: "Eine Zeitrad-Umdrehung = " + big + " : " + small + " = " + k + " kleine Umdrehungen. Mal " + turns + "."
        };
    },
    uhrzeit: function () {
        var h = pick([22, 23]), m = pick([10, 15, 20, 25, 35, 40, 45, 50]);
        var mins = (24 - h) * 60 - m + 6 * 60;
        return {
            text: "Das Zeitrad sitzt! Jetzt muss die große Uhr wissen, wie lange sie stillstand. Sie blieb um <b>" + h + ":" + m + " Uhr</b> stehen. Der Morgen soll pünktlich um <b>6:00 Uhr</b> beginnen.<br>Wie viele <b>Minuten</b> liegen dazwischen?",
            answer: mins, unit: "Minuten",
            hint: "Bis Mitternacht: " + ((24 - h) * 60 - m) + " min. Dann noch 6 Stunden = 360 min."
        };
    }
};

// ---------- Orte ----------
// pos = [Spalte, Zeile] auf dem Museumsplan (4 × 4)
var MU_LOCATIONS = {

    halle: {
        name: "Eingangshalle", icon: "🕰️", pos: [1, 3], scene: "halle",
        text: "Die Schulführung ist längst vorbei – und du hast beim Kartenkauf-Automaten getrödelt. Die Türen sind zu! Plötzlich bleibt die <b>große Uhr</b> mit einem lauten <i>KLONK</i> stehen. Ein kleiner Roboter rollt heran: „Hallo! Ich bin <b>Pixel</b>. Der Automatikbetrieb hat das <b>Zeitrad</b> der Uhr für ein Ausstellungsstück gehalten und ins <b>Dachatelier</b> gebracht. Ohne das Rad wird es nie Morgen!\"",
        pixel: "Drei Wege führen nach oben: durch die Dinosaurierhalle, die Raumfahrtausstellung oder die Werkstatt. Und sammle unterwegs Museumsstempel 🏅 – jede Figur, der du hilfst, gibt dir einen!",
        items: [
            { id: "kekse", label: "Pixel nach Proviant fragen", found: "Pixel öffnet eine Klappe im Bauch: <b>Notfall-Kekse</b>! „Für Notfälle. Und das IST einer.\"" }
        ],
        exits: [
            { to: "dino",      label: "🦖 Links in die Dinosaurierhalle" },
            { to: "raumfahrt", label: "🚀 Geradeaus zur Raumfahrtausstellung" },
            { to: "werkstatt", label: "🔧 Rechts in die historische Werkstatt" },
            { to: "cafe",      label: "☕ Ins Museumscafé (da duftet es…)" },
            { to: "aegypten",  label: "🏺 In den Ägyptischen Saal" },
            {
                to: "morgen", label: "⚙️ Das Zeitrad in die große Uhr einsetzen",
                requires: ["zeitrad"], hideLocked: true, challenge: "uhrzeit"
            }
        ]
    },

    dino: {
        name: "Dinosaurierhalle", icon: "🦖", pos: [0, 2], scene: "dino",
        text: "Ein gewaltiges Skelett eines <b>Tyrannosaurus</b> versperrt den Durchgang zur Galerie. Es dreht den Kopf zu dir und gähnt: „Endlich Besuch! Weißt du, wie langweilig es ist, 66 Millionen Jahre lang still zu stehen?\"",
        pixel: "Der Dino ist harmlos – er will nur, dass jemand seine Knochen wertschätzt.",
        items: [
            { id: "fossil", label: "Dem Dino beim Namensschild helfen", challenge: "dinolaenge", found: "„Endlich stimmt mein Schild!\" Der Dino schenkt dir ein <b>Glücks-Fossil</b>." }
        ],
        exits: [
            { to: "halle",     label: "Zurück zur Eingangshalle" },
            { to: "galerie",   label: "Am Dino vorbei zur Galerie", challenge: "knochen" },
            { to: "werkstatt", label: "Durch den Seitengang zur Werkstatt" }
        ]
    },

    galerie: {
        name: "Galerie", icon: "🖼️", pos: [0, 1], scene: "galerie",
        text: "Gemälde flüstern miteinander, eine Ritterrüstung salutiert. Der direkte Weg nach oben führt über eine <b>bewegliche Ausstellungsbrücke</b> – doch sie hängt schief und blockiert die Treppe.",
        pixel: "Zwei Möglichkeiten: Du balancierst die Brücke aus – oder wir nehmen den Lastenaufzug in der Raumfahrtausstellung.",
        exits: [
            { to: "dino",       label: "Zurück zur Dinosaurierhalle" },
            { to: "dachtreppe", label: "⚖️ Ausstellungsbrücke aktivieren (Gegengewicht berechnen)", challenge: "gegengewicht" },
            { to: "raumfahrt",  label: "🛗 Umweg: Zum Lastenaufzug in der Raumfahrtausstellung" },
            { to: "mineralien", label: "💎 Durch den Glitzergang zum Mineralienkabinett" }
        ]
    },

    dachtreppe: {
        name: "Dachtreppe", icon: "🪜", pos: [0, 0], scene: "dachtreppe",
        text: "Die Brücke schwenkt mit einem Quietschen herum. Eine schmale Wendeltreppe führt hinauf unter das Dach. Ganz oben: eine Luke, durch die schwaches Mondlicht fällt.",
        pixel: "Die Luke ist schwer zu finden. Mit einer Lichterkette ginge es besser!",
        exits: [
            { to: "galerie", label: "Zurück zur Galerie" },
            { to: "atelier", label: "Durch die Luke ins Dachatelier", challenge: "luke", route: "dino" }
        ]
    },

    raumfahrt: {
        name: "Raumfahrtausstellung", icon: "🚀", pos: [1, 2], scene: "raumfahrt",
        text: "Raketenmodelle schweben an Seilen, ein Mondrover dreht Runden. Vor der Tür zum Kontrollraum steht <b>Kommandantin Stern</b>, eine Astronautenfigur mit sehr strengem Blick: „Niemand betritt den Kontrollraum ohne gültigen Ausweis!\"",
        pixel: "Sie ist streng, aber fair. Bestehe ihren Systemcheck!",
        items: [
            { id: "ausweis", label: "Systemcheck bei Kommandantin Stern machen", challenge: "systemcheck", found: "„Bestanden, Kadett!\" Sie überreicht dir einen <b>Astronauten-Ausweis</b>." }
        ],
        exits: [
            { to: "halle",       label: "Zurück zur Eingangshalle" },
            { to: "galerie",     label: "Durch den Verbindungsgang zur Galerie" },
            { to: "planetarium", label: "🌌 Unter der Kuppel ins Planetarium" },
            {
                to: "kontrollraum", label: "In den Kontrollraum",
                requires: ["ausweis"],
                locked: "„Ausweis, bitte!\" Kommandantin Stern lässt dich nicht durch. <i>Tipp: Mach zuerst den Systemcheck!</i>"
            }
        ]
    },

    kontrollraum: {
        name: "Kontrollraum", icon: "🖥️", pos: [1, 1], scene: "kontrollraum",
        text: "Hunderte Lämpchen blinken. Auf einem großen Bildschirm: <b>LASTENAUFZUG – OFFLINE</b>. Eine Computerstimme sagt: „Startsequenz erforderlich.\"",
        pixel: "Erst die Startzeit eingeben, dann prüfen, ob die Energie reicht!",
        exits: [
            { to: "raumfahrt", label: "Zurück zur Raumfahrtausstellung" },
            { to: "aufzug",    label: "Startsequenz eingeben", challenge: "countdown" }
        ]
    },

    aufzug: {
        name: "Lastenaufzug", icon: "🛗", pos: [1, 0], scene: "aufzug",
        text: "Die Gittertür rattert auf. Der Lastenaufzug ist groß genug für ein Mammut – laut Schild war tatsächlich mal eins drin. Die Energieanzeige flackert.",
        pixel: "Bevor wir losfahren: Reicht der Akku wirklich bis ganz oben?",
        exits: [
            { to: "kontrollraum", label: "Zurück zum Kontrollraum" },
            { to: "atelier",      label: "⚡ Energie prüfen und hochfahren", challenge: "energie", route: "raumfahrt" }
        ]
    },

    werkstatt: {
        name: "Historische Werkstatt", icon: "🔧", pos: [2, 2], scene: "werkstatt",
        text: "Es riecht nach Öl und altem Holz. Zwischen Drehbänken werkelt ein <b>mechanischer Uhrmacher</b> mit Monokel. „Ah, Besuch! Oder bin ich das? Nein, ich bin ja hier... Meine Zahnradmaschine ist kaputt – hilfst du mir? Dann bekommst du meinen Archivschlüssel.\"",
        pixel: "Der Uhrmacher ist ein bisschen zerstreut. Aber er kennt jeden Winkel des Archivs.",
        items: [
            { id: "schluessel", label: "Die Zahnradmaschine reparieren", challenge: "teilbar", found: "Die Maschine schnurrt wieder! Der Uhrmacher sucht in fünf Taschen und gibt dir den <b>Archivschlüssel</b>." },
            { id: "kakao",      label: "Die Thermoskanne auf der Werkbank nehmen", found: "„Nimm ruhig, ich trinke ja nur Öl.\" Du hast eine <b>Thermoskanne Kakao</b>." }
        ],
        exits: [
            { to: "halle",  label: "Zurück zur Eingangshalle" },
            { to: "dino",   label: "Durch den Seitengang zur Dinosaurierhalle" },
            { to: "aegypten", label: "Durch die Lagertür in den Ägyptischen Saal" },
            {
                to: "archiv", label: "Die Archivtür aufschließen",
                requires: ["schluessel"],
                locked: "Die Archivtür ist verschlossen. <i>Tipp: Der Uhrmacher hat einen Schlüssel – hilf ihm zuerst!</i>"
            }
        ]
    },

    archiv: {
        name: "Archiv", icon: "🗄️", pos: [2, 1], scene: "archiv",
        text: "Endlose Regale voller Karteikästen. Hinten ist die Tür zur <b>Diensttreppe</b> – mit einem Zahlenschloss gesichert. Dahinter ist es stockfinster.",
        pixel: "Ohne Licht stolperst du auf der Diensttreppe. An der Wand hängt eine Grubenlampe!",
        items: [
            { id: "lampe", label: "Die Grubenlampe von der Federwaage nehmen", challenge: "feder", found: "Klick – die <b>Grubenlampe</b> leuchtet hell!" }
        ],
        exits: [
            { to: "werkstatt", label: "Zurück zur Werkstatt" },
            { to: "mineralien", label: "💎 Hinüber ins Mineralienkabinett" },
            {
                to: "diensttreppe", label: "Das Zahlenschloss der Diensttreppe öffnen",
                requiresAny: ["lampe", "kristall"], challenge: "archivcode",
                locked: "Hinter der Tür ist es pechschwarz. <i>Tipp: Du brauchst Licht – die Grubenlampe hier oder einen Leuchtkristall!</i>"
            }
        ]
    },

    diensttreppe: {
        name: "Diensttreppe", icon: "🔦", pos: [2, 0], scene: "diensttreppe",
        text: "Im Lichtkegel deiner Lampe siehst du eine steile, enge Treppe. Spinnweben, ein vergessener Besen, ein Schild: „Nur für Personal\". Oben schimmert ein Lichtstreifen unter einer Tür.",
        pixel: "Psst – wir sind gleich da!",
        exits: [
            { to: "archiv",  label: "Zurück ins Archiv" },
            { to: "atelier", label: "Hinauf ins Dachatelier", route: "werkstatt" }
        ]
    },

    cafe: {
        name: "Museumscafé", icon: "☕", pos: [0, 3], scene: "cafe",
        text: "Stühle tanzen Polonaise um die Tische, und der alte Kaffeeautomat summt fröhlich vor sich hin. „Bestellung, bitte! Aber nur mit passendem Wechselgeld – ich bin ein sehr <b>genauer</b> Automat!“",
        pixel: "Eine Stärkung kann nicht schaden. Wer weiß, wie lang die Nacht noch wird!",
        items: [
            { id: "brezel", label: "Am Automaten bestellen", challenge: "wechselgeld", found: "Klonk! Eine warme <b>Brezel</b> fällt aus dem Schacht." }
        ],
        exits: [
            { to: "halle", label: "Zurück zur Eingangshalle" },
            { to: "dino",  label: "Durch die Hintertür zur Dinosaurierhalle" }
        ]
    },

    aegypten: {
        name: "Ägyptischer Saal", icon: "🏺", pos: [2, 3], scene: "aegypten",
        text: "Goldene Masken glänzen im Halbdunkel. Aus einem Sarkophag winkt eine kleine <b>Mumie</b>: „Hallo! Ich bin <b>Ramsi</b>, 3000 Jahre jung. Keine Angst – ich bin nur ein bisschen eingewickelt.“ Hinter dem Sarkophag erkennst du eine <b>Geheimtür</b> mit seltsamen Zeichen.",
        pixel: "Die Geheimtür führt angeblich direkt ins Archiv – ganz ohne Schlüssel!",
        items: [
            { id: "skarabaeus", label: "Ramsi beim Pyramidenmodell helfen", challenge: "pyramide", found: "„Wunderbar!“ Ramsi schenkt dir einen <b>Goldenen Skarabäus</b>." }
        ],
        exits: [
            { to: "halle",     label: "Zurück zur Eingangshalle" },
            { to: "werkstatt", label: "Durch die Lagertür zur Werkstatt" },
            { to: "archiv",    label: "🔐 Die Geheimtür ins Archiv öffnen", challenge: "hieroglyphen" }
        ]
    },

    planetarium: {
        name: "Planetarium", icon: "🌌", pos: [3, 2], scene: "planetarium",
        text: "Über dir dreht sich ein funkelnder Sternenhimmel. Der Projektor in der Mitte brummt wie eine zufriedene Katze. An der Wand: eine <b>Wartungstür</b> mit der Aufschrift „Kontrollraum – nur mit Sternkarte“.",
        pixel: "Mit der Sternkarte kommen wir auch ohne Kommandantin Stern in den Kontrollraum!",
        items: [
            { id: "sternkarte", label: "Den Projektor neu einstellen", challenge: "massstab", found: "Der Projektor surrt zufrieden und druckt dir eine <b>Planetariums-Sternkarte</b> aus." }
        ],
        exits: [
            { to: "raumfahrt", label: "Zurück zur Raumfahrtausstellung" },
            {
                to: "kontrollraum", label: "Durch die Wartungstür zum Kontrollraum",
                requires: ["sternkarte"],
                locked: "Die Wartungstür bleibt zu. <i>Tipp: Stell zuerst den Projektor ein!</i>"
            }
        ]
    },

    mineralien: {
        name: "Mineralienkabinett", icon: "💎", pos: [3, 1], scene: "mineralien",
        text: "Hunderte Kristalle glitzern in allen Farben. Eine steinerne Statue mit Hammer und Lupe räuspert sich: „Ich bin <b>Frau Quarz</b>, Geologin. Mein schönster Kristall leuchtet sogar im Dunkeln!“",
        pixel: "Ein Leuchtkristall wäre eine prima Taschenlampe für die Diensttreppe!",
        items: [
            { id: "kristall", label: "Die Kristallvitrine öffnen", challenge: "kristallkanten", found: "Die Vitrine klickt auf. Du hältst einen <b>Leuchtkristall</b> – er strahlt in sanftem Blau!" }
        ],
        exits: [
            { to: "galerie", label: "Durch den Glitzergang zur Galerie" },
            { to: "archiv",  label: "Hinüber ins Archiv" }
        ]
    },

    atelier: {
        name: "Dachatelier", icon: "🎨", pos: [3, 0], scene: "atelier",
        text: "Unter dem Glasdach funkeln die Sterne. Zwischen Staffeleien und Skulpturen steht eine Vitrine mit dem Schild <b>„Exponat Nr. 1: Goldenes Zahnrad, unbekannte Herkunft\"</b>. Das ist das <b>Zeitrad</b>!",
        pixel: "Die Vitrine hat eine Kurbel. Rechne genau – das ist die kniffligste Aufgabe heute Nacht!",
        items: [
            { id: "zeitrad", label: "Die Vitrine mit der Kurbel öffnen", challenge: "zahnraeder", found: "Die Glashaube hebt sich. Du hältst das <b>Zeitrad</b> in den Händen – es tickt leise!" }
        ],
        exits: [
            { to: "dachtreppe",   label: "Hinunter zur Dachtreppe" },
            { to: "aufzug",       label: "Zum Lastenaufzug" },
            { to: "diensttreppe", label: "Hinunter zur Diensttreppe" },
            {
                to: "halle", label: "🏃 Mit dem Zeitrad über die große Rutsche zur Eingangshalle",
                requires: ["zeitrad"], hideLocked: true
            }
        ]
    },

    morgen: {
        name: "Der Morgen ist da!", icon: "🌅", pos: [3, 3], scene: "morgen", goal: true,
        text: "Die große Uhr schlägt sechsmal. Alle Ausstellungsstücke erstarren lächelnd an ihren Plätzen. Die Eingangstür springt auf, Sonnenlicht flutet die Halle. Pixel piept glücklich: „Das war die beste Nacht meines Roboterlebens!\" <b>Du hast den Morgen gerettet! 🎉</b>"
    }
};

var MU_ROUTES = {
    dino:      "🦖 Dino-Route (Brücke & Dachtreppe)",
    raumfahrt: "🚀 Raumfahrt-Route (Lastenaufzug)",
    werkstatt: "🔧 Werkstatt-Route (Archiv & Diensttreppe)"
};
