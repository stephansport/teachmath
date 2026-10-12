// TeachMath – Museums-Abenteuer: Spiel-Logik und Oberfläche
var MU = {
    st: null,
    pending: null,
    msg: "",
    SAVE_KEY: "museum_save",
    HS_KEY: "museum_hs",
    ROUTES_KEY: "museum_routes",

    $: function (id) { return document.getElementById(id); },

    init: function () {
        var self = this;
        this.$("btn-new").onclick = function () { self.newGame(); };
        this.$("btn-continue").onclick = function () { self.loadGame(); };
        this.$("btn-save").onclick = function () { self.save(true); };
        this.$("btn-map").onclick = function () { self.showMap(true); };
        this.$("btn-close-map").onclick = function () { self.showMap(false); };
        this.$("btn-to-menu").onclick = function () { self.save(false); self.showStart(); };
        this.$("btn-check").onclick = function () { self.checkAnswer(); };
        this.$("btn-hint").onclick = function () { self.showHint(); };
        this.$("btn-cancel").onclick = function () { self.cancelChallenge(); };
        this.$("btn-ch-continue").onclick = function () { self.continueAfterSuccess(); };
        this.$("ch-input").onkeydown = function (e) { if (e.key === "Enter") { e.stopPropagation(); self.checkAnswer(); } };
        document.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && self.pending && self.pending.done) { e.preventDefault(); self.continueAfterSuccess(); }
        });
        this.$("player-name").onkeydown = function (e) { if (e.key === "Enter") self.newGame(); };
        this.$("btn-win-again").onclick = function () { self.showStart(); };
        this.$("btn-win-menu").onclick = function () { window.location.href = "index.html"; };
        this.$("btn-over-again").onclick = function () { self.showStart(); };
        this.$("btn-over-menu").onclick = function () { window.location.href = "index.html"; };
        this.$("start-scene").innerHTML = MU_SCENES.halle();
        this.showStart();
    },

    // ---------- Hilfsfunktionen ----------
    esc: function (t) {
        return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; });
    },
    showScreen: function (id) {
        ["screen-start", "screen-game", "screen-win", "screen-over"].forEach(function (s) {
            document.getElementById(s).classList.toggle("active", s === id);
        });
        if (window.scrollTo) window.scrollTo(0, 0);
    },
    toast: function (t) {
        var el = this.$("toast");
        el.textContent = t;
        el.classList.add("show");
        clearTimeout(this._tt);
        this._tt = setTimeout(function () { el.classList.remove("show"); }, 2400);
    },
    button: function (text, cls, fn) {
        var b = document.createElement("button");
        b.className = cls;
        b.textContent = text;
        if (fn) b.onclick = fn;
        return b;
    },
    hearts: function () {
        var h = "";
        for (var i = 0; i < 3; i++) h += i < this.st.lives ? "❤️" : "🖤";
        return h;
    },
    has: function (id) { return this.st.inventory.indexOf(id) !== -1; },
    missing: function (req) {
        var self = this;
        return (req || []).filter(function (r) { return !self.has(r); });
    },
    blocked: function (o) {
        var self = this, miss = this.missing(o.requires);
        if (o.requiresAny && !o.requiresAny.some(function (r) { return self.has(r); })) miss.push(o.requiresAny[0]);
        return miss;
    },
    stampCount: function () {
        return this.st.inventory.filter(function (id) { return MU_ITEMS[id] && MU_ITEMS[id].stamp; }).length;
    },
    stampTotal: function () {
        return Object.keys(MU_ITEMS).filter(function (id) { return MU_ITEMS[id].stamp; }).length;
    },
    readJSON: function (key, def) {
        try { var v = JSON.parse(localStorage.getItem(key)); return v === null ? def : v; } catch (e) { return def; }
    },
    writeJSON: function (key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} },

    // ---------- Start / Speichern / Laden ----------
    readSave: function () {
        var s = this.readJSON(this.SAVE_KEY, null);
        return (s && MU_LOCATIONS[s.loc] && !MU_LOCATIONS[s.loc].goal) ? s : null;
    },
    showStart: function () {
        this.pending = null;
        var saved = this.readSave(), btn = this.$("btn-continue");
        if (saved) {
            btn.classList.remove("hidden");
            btn.textContent = "▶️ Weiterspielen (" + saved.name + " – " + MU_LOCATIONS[saved.loc].name + ")";
        } else {
            btn.classList.add("hidden");
        }
        this.renderHighscores();
        this.renderRoutesFound(this.$("start-exits"));
        this.showScreen("screen-start");
    },
    newGame: function () {
        var name = this.$("player-name").value.trim() || "Museumsheld";
        this.st = { name: name, loc: "halle", lives: 3, score: 0, inventory: [], taken: {}, solved: {}, visited: ["halle"], route: null, streak: 0, correct: 0, wrong: 0 };
        this.msg = "";
        this.pending = null;
        this.save(false);
        this.showScreen("screen-game");
        this.render();
    },
    loadGame: function () {
        var s = this.readSave();
        if (!s) { this.toast("Kein Spielstand gefunden."); return; }
        if (s.streak === undefined) { s.streak = 0; s.correct = 0; s.wrong = 0; }
        this.st = s;
        this.msg = "Willkommen zurück, " + this.esc(s.name) + "! Pixel hat auf dich gewartet.";
        this.pending = null;
        this.showScreen("screen-game");
        this.render();
    },
    save: function (manual) {
        if (!this.st) return;
        this.writeJSON(this.SAVE_KEY, this.st);
        if (manual) this.toast("💾 Spielstand gespeichert!");
    },

    // ---------- Darstellung ----------
    render: function () {
        var self = this, st = this.st, loc = MU_LOCATIONS[st.loc];
        this.$("hud-name").textContent = "🧒 " + st.name;
        this.$("hud-lives").textContent = this.hearts();
        this.$("hud-score").textContent = st.score;
        this.$("hud-stamps").textContent = this.stampCount() + "/" + this.stampTotal();
        this.$("scene").innerHTML = MU_SCENES[loc.scene] ? MU_SCENES[loc.scene]() : "";
        this.$("loc-title").textContent = loc.icon + " " + loc.name;
        this.$("loc-text").innerHTML = loc.text;
        var pix = this.$("pixel-tip");
        if (loc.pixel) { pix.innerHTML = "🤖 <b>Pixel:</b> " + loc.pixel; pix.classList.remove("hidden"); }
        else pix.classList.add("hidden");

        var m = this.$("msg");
        if (this.msg) { m.innerHTML = this.msg; m.classList.remove("hidden"); } else m.classList.add("hidden");
        m.classList.toggle("ok", this.msg.indexOf("✅") === 0);

        var act = this.$("actions");
        act.innerHTML = "";
        var busy = !!this.pending;

        (loc.items || []).forEach(function (it, i) {
            if (st.taken[st.loc + ":" + it.id]) return;
            var b = self.button("🔍 " + it.label + (it.challenge ? "  🧮" : ""), "act act-item", function () { self.tryItem(i); });
            b.disabled = busy;
            act.appendChild(b);
        });
        (loc.exits || []).forEach(function (ex, i) {
            var miss = self.blocked(ex);
            if (miss.length && ex.hideLocked) return;
            var key = st.loc + ">" + ex.to;
            var needsMath = ex.challenge && !st.solved[key];
            var label = "➡️ " + ex.label + (needsMath ? "  🧮" : "") + (miss.length ? "  🔒" : "");
            var b = self.button(label, "act act-exit" + (miss.length ? " act-locked" : ""), function () { self.tryExit(i); });
            b.disabled = busy;
            act.appendChild(b);
        });
        this.renderInventory();
    },
    renderInventory: function () {
        var self = this, inv = this.$("inventory");
        inv.innerHTML = "";
        if (!this.st.inventory.length) {
            inv.innerHTML = '<span class="inv-empty">🎒 Dein Rucksack ist noch leer.</span>';
            return;
        }
        this.st.inventory.forEach(function (id) {
            var it = MU_ITEMS[id];
            var b = self.button(it.icon + " " + it.name + (it.stamp ? " 🏅" : ""), "inv-item" + (it.stamp ? " inv-stamp" : ""), function () { self.useItem(id); });
            b.title = it.desc;
            inv.appendChild(b);
        });
    },
    useItem: function (id) {
        var it = MU_ITEMS[id];
        if (!it.heal) { this.toast(it.icon + " " + it.desc); return; }
        if (this.st.lives >= 3) { this.toast("Du hast schon volle Energie – heb dir " + it.name + " auf!"); return; }
        this.st.lives = Math.min(3, this.st.lives + it.heal);
        this.st.inventory.splice(this.st.inventory.indexOf(id), 1);
        this.msg = it.icon + " Du benutzt <b>" + it.name + "</b>. Mmh! Du fühlst dich wieder stärker.";
        this.save(false);
        this.render();
    },

    // ---------- Aktionen ----------
    tryItem: function (i) {
        var loc = MU_LOCATIONS[this.st.loc], it = loc.items[i];
        var miss = this.blocked(it);
        if (miss.length) { this.msg = it.locked || "Dafür fehlt dir noch etwas."; this.render(); return; }
        if (it.challenge) this.startChallenge({ kind: "item", idx: i, ch: it.challenge });
        else this.takeItem(it);
    },
    takeItem: function (it, pre) {
        this.st.taken[this.st.loc + ":" + it.id] = true;
        if (!this.has(it.id)) this.st.inventory.push(it.id);
        this.st.score += 5;
        var extra = "";
        if (MU_ITEMS[it.id].stamp) {
            var n = this.stampCount(), t = this.stampTotal();
            extra = "<br>🏅 <b>Museumsstempel " + n + "/" + t + "!</b>" + (n === t ? " Alle Stempel gesammelt – Pixel hat eine Überraschung für dich am Ende!" : "");
        }
        this.msg = (pre ? pre + "<br>" : "") + "✨ " + it.found + " <i>(+5 Punkte für den Fund)</i>" + extra;
        this.save(false);
        this.render();
    },
    tryExit: function (i) {
        var st = this.st, ex = MU_LOCATIONS[st.loc].exits[i];
        var miss = this.blocked(ex);
        if (miss.length) { this.msg = "🔒 " + (ex.locked || "Hier kommst du noch nicht weiter."); this.render(); return; }
        if (ex.challenge && !st.solved[st.loc + ">" + ex.to]) this.startChallenge({ kind: "exit", idx: i, ch: ex.challenge });
        else this.goTo(ex);
    },
    goTo: function (ex, pre) {
        var st = this.st;
        if (ex.route && !st.route) st.route = ex.route;
        st.loc = ex.to;
        if (st.visited.indexOf(ex.to) === -1) st.visited.push(ex.to);
        this.msg = pre || "";
        var loc = MU_LOCATIONS[ex.to];
        if (loc.goal) { this.win(); return; }
        if (ex.to === "halle" && this.has("zeitrad")) this.msg += (this.msg ? "<br>" : "") + "🤖 Pixel jubelt: „Du hast das Zeitrad! Schnell, setz es in die große Uhr ein!\"";
        this.save(false);
        this.render();
    },

    // ---------- Rätsel ----------
    startChallenge: function (p) {
        p.data = MU_CHALLENGES[p.ch]();
        p.hintUsed = false;
        this.pending = p;
        this.msg = "";
        this.render();
        this.$("ch-text").innerHTML = p.data.text;
        this.$("ch-unit").textContent = p.data.unit || "";
        this.$("ch-input").value = "";
        this.$("ch-hint").textContent = "";
        this.$("ch-feedback").classList.add("hidden");
        this.$("ch-work").classList.remove("hidden");
        this.$("ch-success").classList.add("hidden");
        this.$("challenge").classList.remove("hidden");
        var self = this;
        setTimeout(function () { self.$("ch-input").focus(); self.$("challenge").scrollIntoView({ behavior: "smooth", block: "center" }); }, 50);
    },
    closeChallenge: function () {
        this.pending = null;
        this.$("challenge").classList.add("hidden");
    },
    cancelChallenge: function () {
        this.closeChallenge();
        this.msg = "Du überlegst es dir anders. Pixel nickt: „Wir können später wiederkommen.\"";
        this.render();
    },
    PRAISE: ["Super gerechnet!", "Genau richtig!", "Klasse, das stimmt!", "Bravo – Volltreffer!", "Spitze, du Rechenprofi!", "Perfekt gelöst!"],
    answerCorrect: function (p) {
        var st = this.st, d = p.data;
        var pts = p.hintUsed ? 5 : 10;
        st.correct++;
        st.streak++;
        var bonus = (st.streak > 0 && st.streak % 3 === 0) ? 5 : 0;
        st.score += pts + bonus;
        p.done = true;
        var sol = "<b>" + d.answer + (d.unit ? " " + d.unit : "") + "</b>";
        var html = '<div class="ch-ok-big">✅ Richtig!</div>' +
            '<div>' + pick(this.PRAISE) + " " + sol + " ist die richtige Lösung.</div>" +
            '<div class="ch-ok-points">⭐ +' + pts + " Punkte" + (p.hintUsed ? " (mit Tipp)" : "") + "</div>" +
            (bonus ? '<div class="ch-ok-streak">🔥 ' + st.streak + " richtige Antworten in Folge: +" + bonus + " Bonuspunkte!</div>" : "");
        this.$("ch-success-text").innerHTML = html;
        this.$("ch-work").classList.add("hidden");
        this.$("ch-feedback").classList.add("hidden");
        this.$("ch-success").classList.remove("hidden");
        this.$("hud-score").textContent = st.score;
        p.summary = "✅ <b>Richtig!</b> " + sol + " stimmt – <b>+" + (pts + bonus) + " Punkte</b>" + (bonus ? " (inkl. 🔥 Serienbonus)" : "") + ".";
        this.save(false);
        var self = this;
        setTimeout(function () { self.$("btn-ch-continue").focus(); }, 30);
    },
    continueAfterSuccess: function () {
        var p = this.pending;
        if (!p || !p.done) return;
        var st = this.st, loc = MU_LOCATIONS[st.loc];
        this.closeChallenge();
        if (p.kind === "item") {
            this.takeItem(loc.items[p.idx], p.summary);
        } else {
            var ex = loc.exits[p.idx];
            st.solved[st.loc + ">" + ex.to] = true;
            this.goTo(ex, p.summary);
        }
    },
    showHint: function () {
        var p = this.pending;
        if (!p || p.done) return;
        p.hintUsed = true;
        this.$("ch-hint").textContent = "💡 " + p.data.hint;
    },
    checkAnswer: function () {
        var p = this.pending;
        if (!p) return;
        var raw = this.$("ch-input").value.trim().replace(/\s/g, "").replace(",", ".");
        if (raw === "") { this.$("ch-input").focus(); return; }
        var val = Number(raw), fb = this.$("ch-feedback");
        if (isNaN(val)) {
            fb.textContent = "Bitte gib eine Zahl ein.";
            fb.className = "feedback wrong";
            return;
        }
        if (p.done) return;
        if (val === p.data.answer) { this.answerCorrect(p); return; }
        this.st.streak = 0;
        this.st.wrong++;
        this.st.lives--;
        this.$("hud-lives").textContent = this.hearts();
        if (this.st.lives <= 0) { this.closeChallenge(); this.gameOver(p.data.answer); return; }
        fb.innerHTML = "❌ Leider falsch – du verlierst ein ❤️. Versuch es noch einmal!" + (p.hintUsed ? "" : " Tipp gefällig? 💡");
        fb.className = "feedback wrong";
        this.$("ch-input").select();
        this.save(false);
    },

    // ---------- Ende ----------
    win: function () {
        var st = this.st, self = this;
        var stamps = this.stampCount(), allStamps = stamps === this.stampTotal();
        st.score += 50 + st.lives * 10 + (allStamps ? 50 : 0);
        localStorage.removeItem(this.SAVE_KEY);
        var routes = this.readJSON(this.ROUTES_KEY, []);
        if (st.route && routes.indexOf(st.route) === -1) routes.push(st.route);
        this.writeJSON(this.ROUTES_KEY, routes);
        var hs = this.readJSON(this.HS_KEY, []);
        hs.push({ name: st.name, score: st.score, route: st.route });
        hs.sort(function (a, b) { return b.score - a.score; });
        this.writeJSON(this.HS_KEY, hs.slice(0, 5));

        this.$("win-scene").innerHTML = MU_SCENES.morgen();
        this.$("win-title").textContent = "🌅 Geschafft, " + st.name + "!";
        this.$("win-text").innerHTML = MU_LOCATIONS.morgen.text +
            (st.route ? "<br><br>Dein Weg: <b>" + MU_ROUTES[st.route] + "</b>" : "") +
            "<br><br>✅ Richtig gelöste Aufgaben: <b>" + st.correct + "</b>" + (st.wrong ? " · ❌ Fehlversuche: " + st.wrong : " · ohne einen einzigen Fehler! 🌟") +
            "<br>🏅 Museumsstempel: <b>" + stamps + "/" + this.stampTotal() + "</b>" +
            (allStamps ? "<br>🎖️ Pixel ernennt dich zur <b>Ehren-Kuratorin / zum Ehren-Kurator</b> des Museums! (+50 Punkte)" : "") +
            "<br>Ziel-Bonus: 50 Punkte + " + (st.lives * 10) + " für übrige ❤️";
        this.$("win-score").textContent = st.score;
        this.renderRoutesFound(this.$("win-exits"));
        this.showScreen("screen-win");
    },
    gameOver: function (answer) {
        localStorage.removeItem(this.SAVE_KEY);
        this.$("over-scene").innerHTML = MU_SCENES.halle();
        this.$("over-text").innerHTML = "Dir ist die Puste ausgegangen. (Die richtige Antwort wäre <b>" + answer + "</b> gewesen.)<br>Pixel bringt dich zur Eingangshalle zurück: „Kein Problem – die Nacht ist lang. Versuch es nochmal!\"";
        this.$("over-score").textContent = this.st.score;
        this.showScreen("screen-over");
    },
    renderRoutesFound: function (el) {
        var found = this.readJSON(this.ROUTES_KEY, []);
        var html = '<div class="exits-title">🗺️ Gefundene Wege zum Dachatelier: ' + found.length + ' / 3</div>';
        Object.keys(MU_ROUTES).forEach(function (k) {
            var f = found.indexOf(k) !== -1;
            html += '<span class="exit-chip' + (f ? ' found' : '') + '">' + (f ? MU_ROUTES[k] : '❓ Unentdeckt') + '</span>';
        });
        el.innerHTML = html;
    },
    renderHighscores: function () {
        var self = this, hs = this.readJSON(this.HS_KEY, []), el = this.$("hs-list");
        if (!hs.length) { el.innerHTML = '<h3>🏆 Bestenliste</h3><div class="hs-row">Noch keine Einträge – sei der Erste!</div>'; return; }
        el.innerHTML = '<h3>🏆 Bestenliste</h3>' + hs.map(function (h, i) {
            return '<div class="hs-row">' + (i + 1) + ". " + self.esc(h.name) + " – ⭐ " + h.score + (h.route && MU_ROUTES[h.route] ? " · " + MU_ROUTES[h.route].split(" ")[0] : "") + "</div>";
        }).join("");
    },

    // ---------- Karte ----------
    showMap: function (show) {
        var ov = this.$("map-overlay");
        if (!show) { ov.classList.add("hidden"); return; }
        var grid = this.$("map-grid"), st = this.st, cells = {};
        Object.keys(MU_LOCATIONS).forEach(function (k) {
            var l = MU_LOCATIONS[k];
            cells[l.pos[0] + "," + l.pos[1]] = k;
        });
        grid.innerHTML = "";
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                var k = cells[x + "," + y], d = document.createElement("div");
                if (!k) { d.className = "map-cell"; }
                else if (k === st.loc) { d.className = "map-cell here"; d.textContent = "📍 " + MU_LOCATIONS[k].name; }
                else if (st.visited.indexOf(k) !== -1) { d.className = "map-cell visited"; d.textContent = MU_LOCATIONS[k].icon + " " + MU_LOCATIONS[k].name; }
                else { d.className = "map-cell unknown"; d.textContent = "❓"; }
                grid.appendChild(d);
            }
        }
        ov.classList.remove("hidden");
    }
};

document.addEventListener("DOMContentLoaded", function () { MU.init(); });
