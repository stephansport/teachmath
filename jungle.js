// TeachMath – Dschungel-Abenteuer: Spiel-Logik und Oberfläche
var JG = {
    st: null,
    pending: null,
    msg: "",
    SAVE_KEY: "jungle_save",

    $: function (id) { return document.getElementById(id); },

    init: function () {
        var self = this;
        this.$("btn-new").onclick = function () { self.newGame(); };
        this.$("btn-continue").onclick = function () { self.loadGame(); };
        this.$("btn-save").onclick = function () { self.save(true); };
        this.$("btn-map").onclick = function () { self.showMap(true); };
        this.$("btn-close-map").onclick = function () { self.showMap(false); };
        this.$("btn-to-menu").onclick = function () { self.save(false); window.location.href = "index.html"; };
        this.$("btn-check").onclick = function () { self.checkAnswer(); };
        this.$("btn-hint").onclick = function () { self.showHint(); };
        this.$("btn-cancel").onclick = function () { self.cancelChallenge(); };
        this.$("ch-input").onkeydown = function (e) { if (e.key === "Enter") self.checkAnswer(); };
        this.$("btn-win-again").onclick = function () { self.showStart(); };
        this.$("btn-win-menu").onclick = function () { window.location.href = "index.html"; };
        this.$("btn-over-again").onclick = function () { self.showStart(); };
        this.$("btn-over-menu").onclick = function () { window.location.href = "index.html"; };
        this.$("start-scene").innerHTML = J_SCENES.ruine();
        this.showStart();
    },

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
        setTimeout(function () { el.classList.remove("show"); }, 2200);
    },
    button: function (text, cls, fn) {
        var b = document.createElement("button");
        b.className = cls;
        b.textContent = text;
        b.onclick = fn;
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

    readSave: function () {
        try {
            var s = JSON.parse(localStorage.getItem(this.SAVE_KEY));
            return (s && J_LOCATIONS[s.loc] && !J_LOCATIONS[s.loc].goal) ? s : null;
        } catch (e) { return null; }
    },
    showStart: function () {
        var saved = this.readSave(), btn = this.$("btn-continue");
        if (saved) {
            btn.classList.remove("hidden");
            btn.textContent = "▶️ Weiterspielen (" + saved.name + " – " + J_LOCATIONS[saved.loc].name + ")";
        } else {
            btn.classList.add("hidden");
        }
        this.renderHighscores();
        this.renderExitsFound(this.$("start-exits"));
        this.showScreen("screen-start");
    },
    newGame: function () {
        var name = String(this.$("player-name").value).trim();
        if (!name) { alert("Bitte gib deinen Namen ein!"); return; }
        if (this.readSave() && !confirm("Es gibt schon einen gespeicherten Spielstand. Neues Spiel starten und den alten überschreiben?")) return;
        this.st = { name: name, loc: "lager", lives: 3, score: 0, inventory: [], taken: [], solved: [], visited: ["lager"], restUsed: false };
        this.pending = null;
        this.msg = "";
        this.save(false);
        this.showScreen("screen-game");
        this.render();
    },
    loadGame: function () {
        var s = this.readSave();
        if (!s) return;
        this.st = s;
        this.pending = null;
        this.msg = "💾 Spielstand geladen. Willkommen zurück, " + this.esc(s.name) + "!";
        this.showScreen("screen-game");
        this.render();
    },
    save: function (manual) {
        if (!this.st) return;
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.st));
        if (manual) this.toast("💾 Spielstand gespeichert!");
    },

    render: function () {
        var self = this, st = this.st, loc = J_LOCATIONS[st.loc];
        this.$("hud-name").textContent = "🌿 " + st.name;
        this.$("hud-lives").textContent = this.hearts();
        this.$("hud-score").textContent = st.score;
        this.$("scene").innerHTML = J_SCENES[loc.scene]();
        this.$("loc-title").textContent = loc.icon + " " + loc.name;
        this.$("loc-text").innerHTML = loc.text;

        var m = this.$("msg");
        if (this.msg) { m.innerHTML = this.msg; m.classList.remove("hidden"); }
        else m.classList.add("hidden");

        var chBox = this.$("challenge"), acts = this.$("actions");
        if (this.pending) { chBox.classList.remove("hidden"); acts.classList.add("hidden"); }
        else { chBox.classList.add("hidden"); acts.classList.remove("hidden"); }

        acts.innerHTML = "";
        (loc.items || []).forEach(function (it) {
            if (st.taken.indexOf(it.id) !== -1) return;
            var lock = self.missing(it.requires).length > 0;
            acts.appendChild(self.button("🔍 " + it.label + (lock ? " 🔒" : ""), "act act-item", function () { self.take(it.id); }));
        });
        if (loc.rest && !st.restUsed) {
            acts.appendChild(self.button("😴 In der Hängematte ausruhen (einmalig: alle ❤️ zurück)", "act act-rest", function () { self.rest(); }));
        }
        (loc.exits || []).forEach(function (e) {
            var lock = self.missing(e.requires).length > 0;
            var known = st.visited.indexOf(e.to) !== -1 ? " (" + J_LOCATIONS[e.to].name + ")" : "";
            acts.appendChild(self.button("➡️ " + e.label + known + (lock ? " 🔒" : ""), "act act-exit", function () { self.go(e.to); }));
        });
        this.renderInventory();
    },
    renderInventory: function () {
        var self = this, box = this.$("inventory");
        box.innerHTML = "";
        if (!this.st.inventory.length) {
            var p = document.createElement("span");
            p.className = "inv-empty";
            p.textContent = "Noch leer – schau dich gut um!";
            box.appendChild(p);
            return;
        }
        this.st.inventory.forEach(function (id) {
            var it = J_ITEMS[id];
            var b = self.button(it.icon + " " + it.name + (it.heal ? " (benutzen)" : ""), "inv-item" + (it.heal ? " usable" : ""), function () {
                if (it.heal) self.useItem(id); else self.toast(it.icon + " " + it.desc);
            });
            b.title = it.desc;
            box.appendChild(b);
        });
    },

    take: function (id) {
        if (this.pending) return;
        var loc = J_LOCATIONS[this.st.loc], it = null;
        (loc.items || []).forEach(function (x) { if (x.id === id) it = x; });
        if (!it || this.st.taken.indexOf(id) !== -1) return;
        if (this.missing(it.requires).length) { this.msg = "🔒 " + it.locked; this.render(); return; }
        if (it.challenge && this.st.solved.indexOf("item:" + id) === -1) {
            this.startChallenge({ kind: "item", id: id, name: it.challenge });
            return;
        }
        this.completeItem(it, "");
    },
    completeItem: function (it, prefix) {
        this.st.taken.push(it.id);
        this.st.inventory.push(it.id);
        this.msg = (prefix ? prefix + "<br>" : "") + "✅ " + it.found + " " + J_ITEMS[it.id].icon;
        this.save(false);
        this.render();
    },
    go: function (to) {
        if (this.pending) return;
        var loc = J_LOCATIONS[this.st.loc], e = null;
        (loc.exits || []).forEach(function (x) { if (x.to === to) e = x; });
        if (!e) return;
        if (this.missing(e.requires).length) { this.msg = "🔒 " + e.locked; this.render(); return; }
        var key = this.st.loc + ">" + to;
        if (e.challenge && this.st.solved.indexOf(key) === -1) {
            this.startChallenge({ kind: "exit", to: to, key: key, name: e.challenge });
            return;
        }
        this.move(to, "");
    },
    move: function (to, prefix) {
        var st = this.st, parts = [];
        st.loc = to;
        if (prefix) parts.push(prefix);
        if (st.visited.indexOf(to) === -1) {
            st.visited.push(to);
            st.score += 10;
            parts.push("🆕 Neuer Ort entdeckt! +10 ⭐");
        }
        this.msg = parts.join("<br>");
        if (J_LOCATIONS[to].goal) { this.win(); return; }
        this.save(false);
        this.render();
    },
    useItem: function (id) {
        var it = J_ITEMS[id];
        if (this.st.lives >= 3) { this.toast("Du hast schon alle ❤️ – heb dir " + it.name + " lieber auf!"); return; }
        this.st.lives = Math.min(3, this.st.lives + it.heal);
        this.st.inventory.splice(this.st.inventory.indexOf(id), 1);
        this.msg = it.icon + " Du benutzt: " + it.name + ". Jetzt hast du " + this.st.lives + " ❤️.";
        this.save(false);
        this.render();
    },
    rest: function () {
        this.st.restUsed = true;
        this.st.lives = 3;
        this.msg = "😴 Du schläfst eine Stunde in der Hängematte. Ausgeruht hast du wieder alle ❤️!";
        this.save(false);
        this.render();
    },

    startChallenge: function (p) {
        p.ch = J_CHALLENGES[p.name]();
        p.tries = 0;
        this.pending = p;
        this.msg = "";
        this.$("ch-text").innerHTML = p.ch.text;
        this.$("ch-unit").textContent = p.ch.unit || "";
        this.$("ch-input").value = "";
        this.$("ch-hint").textContent = "";
        this.$("ch-feedback").className = "feedback hidden";
        this.render();
        this.$("ch-input").focus();
    },
    showHint: function () {
        if (this.pending) this.$("ch-hint").textContent = "💡 " + this.pending.ch.hint;
    },
    checkAnswer: function () {
        var p = this.pending;
        if (!p) return;
        var raw = String(this.$("ch-input").value).trim().replace(",", ".");
        var fb = this.$("ch-feedback");
        if (raw === "" || isNaN(parseFloat(raw))) {
            fb.textContent = "Bitte gib eine Zahl ein!";
            fb.className = "feedback wrong";
            return;
        }
        var x = parseFloat(raw);
        var ok = p.ch.accept ? p.ch.accept(x) : x === p.ch.answer;
        if (ok) {
            var pts = p.tries === 0 ? 30 : 15;
            this.st.score += pts;
            this.finishChallenge("🎉 Richtig! +" + pts + " ⭐");
            return;
        }
        p.tries++;
        this.st.lives--;
        this.$("hud-lives").textContent = this.hearts();
        if (this.st.lives <= 0) { this.gameOver(); return; }
        if (p.tries >= 2) {
            this.finishChallenge("😕 Leider wieder falsch. Richtig wäre <b>" + p.ch.answer + (p.ch.unit ? " " + p.ch.unit : "") + "</b> gewesen. Aber du kommst trotzdem weiter!");
            return;
        }
        fb.textContent = "❌ Leider falsch – du verlierst ein ❤️. Versuch es nochmal! (Der Tipp-Button hilft.)";
        fb.className = "feedback wrong";
        this.save(false);
    },
    finishChallenge: function (prefix) {
        var p = this.pending;
        this.pending = null;
        if (p.kind === "item") {
            this.st.solved.push("item:" + p.id);
            var it = null;
            (J_LOCATIONS[this.st.loc].items || []).forEach(function (x) { if (x.id === p.id) it = x; });
            this.completeItem(it, prefix);
        } else {
            this.st.solved.push(p.key);
            this.move(p.to, prefix);
        }
    },
    cancelChallenge: function () {
        this.pending = null;
        this.msg = "Du überlegst es dir anders und schaust dich weiter um.";
        this.save(false);
        this.render();
    },

    goals: function () { return Object.keys(J_LOCATIONS).filter(function (k) { return J_LOCATIONS[k].goal; }); },
    exitsFound: function () {
        try { return JSON.parse(localStorage.getItem("jungle_exits")) || []; } catch (e) { return []; }
    },
    readHs: function () {
        try { return JSON.parse(localStorage.getItem("jungle_hs")) || []; } catch (e) { return []; }
    },
    win: function () {
        var st = this.st, loc = J_LOCATIONS[st.loc];
        st.score += 50;
        var found = this.exitsFound();
        if (found.indexOf(st.loc) === -1) { found.push(st.loc); localStorage.setItem("jungle_exits", JSON.stringify(found)); }
        var hs = this.readHs();
        hs.push({ name: st.name, score: st.score, goal: loc.name, date: new Date().toLocaleDateString("de-DE") });
        hs.sort(function (a, b) { return b.score - a.score; });
        localStorage.setItem("jungle_hs", JSON.stringify(hs.slice(0, 5)));
        localStorage.removeItem(this.SAVE_KEY);
        this.$("win-scene").innerHTML = J_SCENES[loc.scene]();
        this.$("win-title").textContent = loc.icon + " " + loc.name;
        this.$("win-text").innerHTML = loc.text;
        this.$("win-score").textContent = st.score;
        this.renderExitsFound(this.$("win-exits"));
        this.showScreen("screen-win");
    },
    gameOver: function () {
        localStorage.removeItem(this.SAVE_KEY);
        this.pending = null;
        this.$("over-score").textContent = this.st.score;
        this.$("over-text").textContent = "Keine ❤️ mehr, " + this.st.name + "! Du hast " + this.st.visited.length + " Orte entdeckt. Beim nächsten Mal schaffst du es!";
        this.showScreen("screen-over");
    },
    renderExitsFound: function (box) {
        var found = this.exitsFound(), goals = this.goals();
        box.innerHTML = "";
        var h = document.createElement("div");
        h.className = "exits-title";
        h.textContent = "🚪 Wege aus dem Dschungel: " + found.length + " von " + goals.length + " entdeckt";
        box.appendChild(h);
        goals.forEach(function (g) {
            var d = document.createElement("span");
            var ok = found.indexOf(g) !== -1;
            d.className = "exit-chip" + (ok ? " found" : "");
            d.textContent = ok ? J_LOCATIONS[g].icon + " " + J_LOCATIONS[g].name : "❓ noch unentdeckt";
            box.appendChild(d);
        });
    },
    renderHighscores: function () {
        var box = this.$("hs-list"), hs = this.readHs();
        box.innerHTML = "";
        if (!hs.length) return;
        var h = document.createElement("h3");
        h.textContent = "🏆 Bestenliste";
        box.appendChild(h);
        hs.forEach(function (e, i) {
            var row = document.createElement("div");
            row.className = "hs-row";
            row.textContent = (i + 1) + ". " + e.name + " – " + e.score + " ⭐ (" + e.goal + ")";
            box.appendChild(row);
        });
    },

    showMap: function (on) {
        var ov = this.$("map-overlay");
        if (!on) { ov.classList.add("hidden"); return; }
        var st = this.st, grid = this.$("map-grid"), near = {}, cells = {};
        grid.innerHTML = "";
        st.visited.forEach(function (v) { (J_LOCATIONS[v].exits || []).forEach(function (e) { near[e.to] = true; }); });
        Object.keys(J_LOCATIONS).forEach(function (k) { var p = J_LOCATIONS[k].pos; cells[p[0] + "," + p[1]] = k; });
        for (var y = 0; y < 5; y++) {
            for (var x = 0; x < 4; x++) {
                var c = document.createElement("div"), k = cells[x + "," + y];
                c.className = "map-cell";
                if (k && st.visited.indexOf(k) !== -1) {
                    c.className += " visited" + (k === st.loc ? " here" : "");
                    c.textContent = (k === st.loc ? "📍 " : J_LOCATIONS[k].icon + " ") + J_LOCATIONS[k].name.replace(/^(Der|Die|Das) /, "");
                } else if (k && near[k]) {
                    c.className += " unknown";
                    c.textContent = "❓";
                } else {
                    c.className += " empty";
                }
                grid.appendChild(c);
            }
        }
        ov.classList.remove("hidden");
    }
};

document.addEventListener("DOMContentLoaded", function () { JG.init(); });
