// TeachMath – Museums-Abenteuer: SVG-Szenenbilder
var muSvgCount = 0;
function muSvg(c1, c2, body, label, labelColor) {
    var id = "mug" + (++muSvgCount);
    return '<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" class="scene-svg">' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>' +
        '<rect width="320" height="160" fill="url(#' + id + ')"/>' + body +
        (label ? '<text x="160" y="152" text-anchor="middle" fill="' + (labelColor || "#94a3b8") + '" font-size="10" font-family="sans-serif">' + label + '</text>' : '') +
        '</svg>';
}
function muFloor(c) { return '<rect x="0" y="125" width="320" height="35" fill="' + (c || "#1c1917") + '"/>'; }
function muPixel(x, y, s) {
    s = s || 1;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
        '<line x1="0" y1="-22" x2="0" y2="-28" stroke="#a3e635" stroke-width="1.5"/><circle cx="0" cy="-29" r="2.2" fill="#facc15"/>' +
        '<rect x="-9" y="-22" width="18" height="14" rx="4" fill="#94a3b8"/>' +
        '<circle cx="-4" cy="-15" r="2.2" fill="#22d3ee"/><circle cx="4" cy="-15" r="2.2" fill="#22d3ee"/>' +
        '<rect x="-7" y="-7" width="14" height="10" rx="2" fill="#64748b"/>' +
        '<circle cx="-5" cy="5" r="3" fill="#334155"/><circle cx="5" cy="5" r="3" fill="#334155"/></g>';
}
function muClock(x, y, r, stopped) {
    var hand = stopped ? '<line x1="' + x + '" y1="' + y + '" x2="' + (x + r * 0.5) + '" y2="' + (y - r * 0.2) + '" stroke="#1c1917" stroke-width="2.5"/>' +
        '<line x1="' + x + '" y1="' + y + '" x2="' + (x - r * 0.15) + '" y2="' + (y - r * 0.75) + '" stroke="#1c1917" stroke-width="1.8"/>'
        : '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + r * 0.55) + '" stroke="#1c1917" stroke-width="2.5"/>' +
        '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y - r * 0.8) + '" stroke="#1c1917" stroke-width="1.8"/>';
    var ticks = '';
    for (var i = 0; i < 12; i++) {
        var a = i * Math.PI / 6;
        ticks += '<circle cx="' + (x + Math.sin(a) * r * 0.82).toFixed(1) + '" cy="' + (y - Math.cos(a) * r * 0.82).toFixed(1) + '" r="1.3" fill="#1c1917"/>';
    }
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 4) + '" fill="#92400e"/><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fef3c7"/>' + ticks + hand +
        '<circle cx="' + x + '" cy="' + y + '" r="2.5" fill="#b45309"/>';
}
function muGear(x, y, r, color) {
    var p = '', n = 10;
    for (var i = 0; i < n * 2; i++) {
        var a = i * Math.PI / n, rr = i % 2 === 0 ? r : r * 0.78;
        p += (i === 0 ? 'M' : 'L') + (x + Math.cos(a) * rr).toFixed(1) + ',' + (y + Math.sin(a) * rr).toFixed(1) + ' ';
    }
    return '<path d="' + p + 'Z" fill="' + (color || "#facc15") + '"/><circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.3) + '" fill="#1c1917"/>';
}
function muMoonWindow(x, y) {
    return '<rect x="' + x + '" y="' + y + '" width="40" height="50" rx="20" fill="#1e3a8a" stroke="#57534e" stroke-width="3"/>' +
        '<circle cx="' + (x + 26) + '" cy="' + (y + 16) + '" r="6" fill="#fef9c3"/>' +
        '<circle cx="' + (x + 10) + '" cy="' + (y + 30) + '" r="1" fill="#fff"/><circle cx="' + (x + 18) + '" cy="' + (y + 10) + '" r="1" fill="#fff"/>';
}

var MU_SCENES = {
    halle: function () {
        return muSvg('#1c1427', '#2a1f14',
            muFloor('#292524') +
            '<rect x="20" y="30" width="18" height="95" fill="#44403c"/><rect x="282" y="30" width="18" height="95" fill="#44403c"/>' +
            muMoonWindow(60, 35) + muMoonWindow(220, 35) +
            '<rect x="140" y="40" width="40" height="85" rx="4" fill="#78350f"/>' + muClock(160, 62, 16, true) +
            '<rect x="150" y="88" width="20" height="30" fill="#451a03"/>' +
            muPixel(110, 120, 1.1), "Eingangshalle – die große Uhr steht still");
    },
    dino: function () {
        return muSvg('#14181c', '#1f1a14',
            muFloor('#292524') +
            '<path d="M70,95 Q110,55 170,70 Q215,80 280,105" fill="none" stroke="#e7e5e4" stroke-width="5"/>' +
            '<path d="M60,75 L95,62 L102,80 L72,90 Z" fill="#e7e5e4"/><circle cx="85" cy="72" r="3" fill="#1c1917"/>' +
            '<path d="M72,90 L80,96 L88,88 L96,94" fill="none" stroke="#e7e5e4" stroke-width="2"/>' +
            [120, 135, 150, 165, 180, 195].map(function (x) { return '<path d="M' + x + ',68 Q' + (x + 3) + ',90 ' + x + ',100" fill="none" stroke="#d6d3d1" stroke-width="2.5"/>'; }).join('') +
            '<line x1="150" y1="98" x2="140" y2="125" stroke="#e7e5e4" stroke-width="5"/><line x1="185" y1="98" x2="195" y2="125" stroke="#e7e5e4" stroke-width="5"/>' +
            '<rect x="120" y="125" width="90" height="6" fill="#57534e"/>' +
            muPixel(255, 120), "Dinosaurierhalle");
    },
    galerie: function () {
        var frames = [[40, 35, '#be123c'], [100, 30, '#0369a1'], [200, 32, '#15803d']].map(function (f) {
            return '<rect x="' + f[0] + '" y="' + f[1] + '" width="44" height="34" fill="#b45309"/><rect x="' + (f[0] + 4) + '" y="' + (f[1] + 4) + '" width="36" height="26" fill="' + f[2] + '"/>' +
                '<circle cx="' + (f[0] + 16) + '" cy="' + (f[1] + 15) + '" r="2" fill="#fff"/><circle cx="' + (f[0] + 26) + '" cy="' + (f[1] + 15) + '" r="2" fill="#fff"/>';
        }).join('');
        return muSvg('#1a1422', '#221a14',
            muFloor('#292524') + frames +
            '<line x1="150" y1="95" x2="290" y2="75" stroke="#a8a29e" stroke-width="6"/>' +
            '<polygon points="220,85 212,125 228,125" fill="#57534e"/>' +
            '<rect x="150" y="98" width="22" height="18" fill="#92400e"/><rect x="270" y="58" width="18" height="18" fill="#71717a"/>' +
            muPixel(70, 120), "Galerie – die Ausstellungsbrücke hängt schief");
    },
    dachtreppe: function () {
        var steps = '';
        for (var i = 0; i < 8; i++) steps += '<rect x="' + (110 + i * 12) + '" y="' + (120 - i * 12) + '" width="40" height="5" fill="#78716c"/>';
        return muSvg('#0f172a', '#1c1917',
            muFloor('#1c1917') + steps +
            '<rect x="200" y="15" width="60" height="22" fill="#1e3a8a" stroke="#facc15" stroke-width="2" stroke-dasharray="3,3"/>' +
            '<circle cx="245" cy="25" r="5" fill="#fef9c3"/>' + muPixel(80, 120), "Dachtreppe");
    },
    raumfahrt: function () {
        return muSvg('#0b1026', '#1c1917',
            muFloor('#27272a') +
            '<line x1="90" y1="0" x2="90" y2="30" stroke="#52525b"/><g transform="translate(90,55)"><ellipse cx="0" cy="0" rx="8" ry="24" fill="#e5e7eb"/><path d="M-8,10 L-15,25 L-6,20 Z M8,10 L15,25 L6,20 Z" fill="#dc2626"/><circle cx="0" cy="-6" r="3.5" fill="#38bdf8"/></g>' +
            '<g transform="translate(215,78)"><circle cx="0" cy="0" r="12" fill="#f8fafc"/><rect x="-7" y="-5" width="14" height="8" rx="3" fill="#f59e0b"/>' +
            '<rect x="-12" y="12" width="24" height="28" rx="4" fill="#f8fafc"/><rect x="-6" y="18" width="12" height="7" fill="#2563eb"/>' +
            '<rect x="-10" y="40" width="8" height="8" fill="#e5e7eb"/><rect x="2" y="40" width="8" height="8" fill="#e5e7eb"/></g>' +
            '<rect x="250" y="55" width="30" height="70" fill="#3f3f46"/><text x="265" y="95" text-anchor="middle" fill="#a3e635" font-size="7" font-family="sans-serif">KONTROLL</text>' +
            muPixel(140, 120), "Raumfahrtausstellung – Kommandantin Stern");
    },
    kontrollraum: function () {
        var lights = '';
        for (var i = 0; i < 18; i++) lights += '<circle cx="' + (40 + i * 14) + '" cy="' + (100 + (i % 2) * 8) + '" r="3" fill="' + ['#22c55e', '#ef4444', '#facc15'][i % 3] + '"/>';
        return muSvg('#020617', '#111827',
            '<rect x="60" y="20" width="200" height="60" rx="4" fill="#0f172a" stroke="#334155" stroke-width="2"/>' +
            '<text x="160" y="47" text-anchor="middle" fill="#ef4444" font-size="11" font-family="monospace">LASTENAUFZUG</text>' +
            '<text x="160" y="63" text-anchor="middle" fill="#ef4444" font-size="11" font-family="monospace">OFFLINE</text>' +
            '<rect x="25" y="92" width="270" height="25" rx="3" fill="#1f2937"/>' + lights + muFloor('#111827') + muPixel(40, 140, 0.9), "Kontrollraum");
    },
    aufzug: function () {
        var bars = '';
        for (var i = 0; i < 9; i++) bars += '<line x1="' + (110 + i * 12.5) + '" y1="25" x2="' + (110 + i * 12.5) + '" y2="125" stroke="#71717a" stroke-width="2"/>';
        return muSvg('#18181b', '#27272a',
            muFloor('#18181b') + '<rect x="105" y="20" width="110" height="105" fill="#3f3f46"/>' + bars +
            '<rect x="235" y="40" width="14" height="60" rx="3" fill="#111"/><rect x="237" y="70" width="10" height="28" fill="#facc15"/>' +
            muPixel(70, 120), "Lastenaufzug");
    },
    werkstatt: function () {
        return muSvg('#1f1508', '#1c1917',
            muFloor('#3f2a14') +
            '<rect x="30" y="95" width="120" height="8" fill="#78350f"/><rect x="35" y="103" width="6" height="22" fill="#78350f"/><rect x="140" y="103" width="6" height="22" fill="#78350f"/>' +
            muGear(65, 60, 16, '#a16207') + muGear(95, 72, 10, '#ca8a04') +
            '<g transform="translate(225,78)"><rect x="-13" y="-30" width="26" height="22" rx="5" fill="#b45309"/><circle cx="-5" cy="-20" r="3" fill="#fef3c7"/><circle cx="5" cy="-20" r="5" fill="none" stroke="#fde68a" stroke-width="1.5"/>' +
            '<rect x="-15" y="-6" width="30" height="34" rx="4" fill="#92400e"/>' + muGear(0, 10, 7, '#facc15') + '<rect x="-11" y="28" width="8" height="18" fill="#78350f"/><rect x="3" y="28" width="8" height="18" fill="#78350f"/></g>' +
            muPixel(170, 120), "Historische Werkstatt – der Uhrmacher");
    },
    archiv: function () {
        var shelves = '';
        for (var s = 0; s < 3; s++) {
            shelves += '<rect x="' + (25 + s * 70) + '" y="25" width="55" height="100" fill="#44403c"/>';
            for (var r = 0; r < 4; r++) shelves += '<rect x="' + (29 + s * 70) + '" y="' + (30 + r * 24) + '" width="47" height="18" fill="' + ['#a16207', '#78716c', '#57534e', '#92400e'][(r + s) % 4] + '"/>';
        }
        return muSvg('#171412', '#1c1917',
            muFloor('#1c1917') + shelves +
            '<rect x="250" y="40" width="45" height="85" fill="#0c0a09" stroke="#57534e" stroke-width="2"/><rect x="285" y="80" width="6" height="10" fill="#facc15"/>' +
            muPixel(235, 140, 0.9), "Archiv");
    },
    diensttreppe: function () {
        var steps = '';
        for (var i = 0; i < 9; i++) steps += '<rect x="' + (90 + i * 14) + '" y="' + (122 - i * 11) + '" width="30" height="5" fill="#57534e"/>';
        return muSvg('#000', '#0c0a09',
            '<path d="M40,130 L200,20 L260,20 L260,140 Z" fill="#fef9c3" opacity="0.12"/>' + steps +
            '<rect x="220" y="15" width="36" height="3" fill="#facc15" opacity="0.8"/>' + muPixel(50, 135, 0.9), "Diensttreppe", "#a8a29e");
    },
    cafe: function () {
        return muSvg('#2a1a10', '#1c1917',
            muFloor('#44403c') +
            '<rect x="200" y="35" width="55" height="90" rx="6" fill="#b91c1c"/><rect x="208" y="45" width="39" height="25" rx="3" fill="#0f172a"/>' +
            '<text x="227" y="62" text-anchor="middle" fill="#4ade80" font-size="9" font-family="monospace">1,50€</text>' +
            '<circle cx="216" cy="82" r="3" fill="#facc15"/><circle cx="228" cy="82" r="3" fill="#22c55e"/><circle cx="240" cy="82" r="3" fill="#3b82f6"/>' +
            '<rect x="215" y="95" width="25" height="18" fill="#1c1917"/><circle cx="214" cy="56" r="2" fill="#fff"/><circle cx="241" cy="56" r="2" fill="#fff"/>' +
            '<ellipse cx="90" cy="100" rx="35" ry="6" fill="#78350f"/><rect x="87" y="100" width="6" height="25" fill="#78350f"/>' +
            '<rect x="45" y="85" width="4" height="40" fill="#a16207" transform="rotate(-12 47 105)"/><rect x="130" y="85" width="4" height="40" fill="#a16207" transform="rotate(12 132 105)"/>' +
            '<path d="M80,92 q5,-8 10,0 q5,-8 10,0" fill="none" stroke="#d97706" stroke-width="3"/>' +
            muPixel(160, 120), "Museumscafé – der genaue Automat");
    },
    aegypten: function () {
        return muSvg('#1f1708', '#1c1917',
            muFloor('#78350f') +
            '<polygon points="30,125 75,60 120,125" fill="#ca8a04" opacity="0.7"/><polygon points="75,60 120,125 95,125" fill="#a16207" opacity="0.8"/>' +
            '<rect x="170" y="70" width="40" height="55" rx="18" fill="#facc15" stroke="#a16207" stroke-width="2"/>' +
            '<rect x="178" y="80" width="24" height="5" fill="#1e3a8a"/><rect x="178" y="90" width="24" height="5" fill="#1e3a8a"/>' +
            '<g transform="translate(240,95)"><rect x="-9" y="-25" width="18" height="50" rx="8" fill="#e7e5e4"/>' +
            '<line x1="-9" y1="-12" x2="9" y2="-8" stroke="#a8a29e"/><line x1="-9" y1="0" x2="9" y2="4" stroke="#a8a29e"/><line x1="-9" y1="12" x2="9" y2="16" stroke="#a8a29e"/>' +
            '<circle cx="-3" cy="-17" r="1.8" fill="#1c1917"/><circle cx="3" cy="-17" r="1.8" fill="#1c1917"/><path d="M9,-5 q12,-6 14,-16" stroke="#e7e5e4" stroke-width="4" fill="none"/></g>' +
            '<rect x="268" y="45" width="40" height="80" fill="#57534e"/><text x="288" y="80" text-anchor="middle" fill="#fde68a" font-size="10">🌀∩|</text>' +
            muPixel(140, 120), "Ägyptischer Saal – Mumie Ramsi");
    },
    planetarium: function () {
        var st = '';
        for (var i = 0; i < 40; i++) st += '<circle cx="' + (20 + (i * 71) % 280) + '" cy="' + (10 + (i * 37) % 75) + '" r="' + (i % 3 === 0 ? 1.6 : 0.9) + '" fill="#fff"/>';
        return muSvg('#020617', '#1e1b4b',
            '<path d="M0,95 Q160,-40 320,95 Z" fill="#0b1026"/>' + st +
            '<polyline points="60,40 85,32 110,38 130,30 150,42 145,58 120,55" fill="none" stroke="#93c5fd" stroke-width="0.8" opacity="0.7"/>' +
            muFloor('#1e1b4b') +
            '<ellipse cx="160" cy="100" rx="16" ry="11" fill="#334155"/><circle cx="160" cy="88" r="9" fill="#475569"/><circle cx="160" cy="88" r="4" fill="#fef9c3"/>' +
            '<rect x="155" y="108" width="10" height="17" fill="#334155"/>' + muPixel(80, 120), "Planetarium");
    },
    mineralien: function () {
        var cr = '', cols = ['#a855f7', '#22d3ee', '#f472b6', '#4ade80', '#facc15'];
        for (var i = 0; i < 7; i++) {
            var x = 30 + i * 22, h = 20 + (i * 13) % 25;
            cr += '<polygon points="' + x + ',110 ' + (x + 8) + ',' + (110 - h) + ' ' + (x + 16) + ',110" fill="' + cols[i % 5] + '" opacity="0.85"/>';
        }
        return muSvg('#0c0a1a', '#1c1917',
            muFloor('#27272a') + '<rect x="20" y="110" width="170" height="15" fill="#3f3f46"/>' + cr +
            '<rect x="215" y="85" width="40" height="40" fill="#bae6fd" opacity="0.25" stroke="#e0f2fe"/>' +
            '<polygon points="235,92 245,105 235,118 225,105" fill="#38bdf8"/><circle cx="235" cy="105" r="18" fill="#38bdf8" opacity="0.15"/>' +
            '<g transform="translate(285,85)"><circle cx="0" cy="-15" r="8" fill="#a8a29e"/><rect x="-9" y="-7" width="18" height="30" rx="3" fill="#78716c"/><circle cx="12" cy="0" r="4" fill="none" stroke="#d6d3d1" stroke-width="1.5"/></g>' +
            muPixel(195, 140, 0.8), "Mineralienkabinett – Frau Quarz");
    },
    atelier: function () {
        var stars = '';
        for (var i = 0; i < 25; i++) stars += '<circle cx="' + (20 + (i * 53) % 280) + '" cy="' + (8 + (i * 29) % 45) + '" r="1" fill="#fff"/>';
        return muSvg('#0b1026', '#1e1b2e',
            '<path d="M0,60 L160,0 L320,60 Z" fill="#1e3a8a" opacity="0.5"/>' + stars + muFloor('#3f3f46') +
            '<polygon points="50,125 70,70 90,125" fill="none" stroke="#a16207" stroke-width="3"/><rect x="55" y="75" width="30" height="24" fill="#f472b6"/>' +
            '<rect x="140" y="95" width="40" height="30" fill="#57534e"/><rect x="142" y="60" width="36" height="35" fill="#bae6fd" opacity="0.35" stroke="#e0f2fe"/>' +
            muGear(160, 78, 11, '#facc15') + muPixel(240, 120), "Dachatelier – das Zeitrad!");
    },
    morgen: function () {
        return muSvg('#fb923c', '#fde68a',
            '<circle cx="160" cy="125" r="38" fill="#fef08a"/>' + muFloor('#a16207') +
            '<rect x="140" y="30" width="40" height="95" rx="4" fill="#78350f"/>' + muClock(160, 55, 16, false) +
            muGear(160, 95, 9, '#facc15') + muPixel(100, 120, 1.2) +
            '<text x="230" y="70" fill="#7c2d12" font-size="18" font-family="sans-serif">🎉</text>', "Guten Morgen!", "#7c2d12");
    }
};
