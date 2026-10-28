/*
 * 전화 앱
 * -----------------------------------------
 * 아래 탭: 즐겨찾기 / 최근 통화 / 연락처 / 키패드 / 음성 사서함
 * 키패드로 번호를 누르고 '통화'를 누르면 통화 화면이 나오고, '종료'로 끝납니다.
 * (이야기 속 휴대폰이라 실제로 전화가 걸리지는 않고 '호출 중...' 상태로 머뭅니다.)
 * 데이터: js/data/phone-data.js
 */
window.YUSHI = window.YUSHI || {};
YUSHI.appScreens = YUSHI.appScreens || {};

(function () {
  var ui = YUSHI.ui;

  function svg(body, vb) {
    return '<svg viewBox="' + (vb || "0 0 30 30") + '" aria-hidden="true">' + body + "</svg>";
  }
  function dots(rows) {
    var out = "";
    for (var r = 0; r < rows; r++) for (var c = 0; c < 3; c++) {
      out += '<circle cx="' + (8 + c * 7) + '" cy="' + (5 + r * 7) + '" r="2.4"/>';
    }
    return out;
  }
  function ring(cx) {
    return '<path fill-rule="evenodd" d="M' + cx + ' 9a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z"/>';
  }

  var TAB = {
    fav: svg('<path d="M15 3.5l3.4 7.4 8.1.9-6 5.5 1.7 8-7.2-4.1-7.2 4.1 1.7-8-6-5.5 8.1-.9z"/>'),
    recent: svg('<path fill-rule="evenodd" d="M15 3a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4z"/><path d="M13.8 8h2.4v6.5l4.5 3.2-1.4 2-5.5-3.9z"/>'),
    contacts: svg('<path fill-rule="evenodd" d="M15 3a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 2.6a9.4 9.4 0 0 0-7.1 15.6c1.4-3 4.1-4.6 7.1-4.6s5.7 1.6 7.1 4.6A9.4 9.4 0 0 0 15 5.6z"/><circle cx="15" cy="12" r="4.2"/>'),
    keypad: svg(dots(4)),
    voicemail: svg(ring(8.5) + ring(21.5) + '<rect x="8.5" y="18.4" width="13" height="2.6"/>')
  };

  var HANDSET = '<path d="M9.2 4.5c.9-.5 2-.2 2.5.6l2.3 3.8c.5.9.3 2-.5 2.6l-1.8 1.3c.9 2.6 3 5.3 5.6 6.9l1.5-1.6c.7-.7 1.8-.8 2.6-.2l3.6 2.6c.8.6 1 1.8.4 2.6l-1.3 1.9c-.8 1.2-2.3 1.8-3.7 1.4C12.4 24.5 6.7 17.9 5.4 10.6c-.2-1.4.4-2.8 1.6-3.6z"/>';
  var ICON = {
    call: svg(HANDSET, "0 0 32 32"),
    end: svg('<g transform="rotate(135 16 16)">' + HANDSET + "</g>", "0 0 32 32"),
    del: svg('<path d="M10 6h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H10L2 15z"/><path d="M13.5 10.5l9 9M22.5 10.5l-9 9" stroke="#2a2c31" stroke-width="2.4" stroke-linecap="round"/>'),
    addContact: svg('<circle cx="12" cy="10" r="5"/><path d="M2.5 26c.8-6 4.6-9 9.5-9s8.7 3 9.5 9z"/><path d="M23.5 9v8M19.5 13h8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'),
    mute: svg('<rect x="11" y="3" width="8" height="14" rx="4"/><path d="M7 13c0 4.4 3.6 8 8 8s8-3.6 8-8M15 21v5M10.5 26h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 4l20 22" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'),
    keypad: svg(dots(4)),
    speaker: svg('<path d="M3 11h5l7-6v20l-7-6H3z"/><path d="M19.5 10.5c2 2.6 2 6.4 0 9M23 7.5c3.8 4.4 3.8 10.6 0 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    add: svg('<path d="M13.5 5h3v8.5H25v3h-8.5V25h-3v-8.5H5v-3h8.5z"/>'),
    facetime: svg('<rect x="2.5" y="9" width="17" height="12" rx="2"/><path d="M21 13.5l6.5-4.2v11.4L21 16.5z"/>'),
    book: svg('<rect x="6" y="3" width="18" height="24" rx="2"/><circle cx="15" cy="12" r="3.8" fill="rgba(0,0,0,.45)"/><path d="M9.5 22.5c.6-3.6 2.8-5.2 5.5-5.2s4.9 1.6 5.5 5.2z" fill="rgba(0,0,0,.45)"/>')
  };

  var DISC = '<span class="disc" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M4.3 2.5L8 6l-3.7 3.5" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  var KEYS = [["1", ""], ["2", "ABC"], ["3", "DEF"], ["4", "GHI"], ["5", "JKL"], ["6", "MNO"],
              ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"], ["*", ""], ["0", "+"], ["#", ""]];

  // 번호 모양: 010-1234-5678 / 02-123-4567
  function fmt(d) {
    if (/[*#]/.test(d) || d.length < 4) return d;
    var head = d.indexOf("02") === 0 ? 2 : 3;
    var a = d.slice(0, head), rest = d.slice(head);
    if (rest.length <= 4) return a + "-" + rest;
    if (rest.length <= 8) return a + "-" + rest.slice(0, rest.length - 4) + "-" + rest.slice(-4);
    return d;
  }
  function digitsOf(s) { return String(s || "").replace(/[^0-9*#]/g, ""); }

  YUSHI.appScreens.phone = function mount(appEl) {
    var D = YUSHI.data.phone;
    var esc = ui.esc;
    var dial = "";          // 키패드에 입력 중인 번호 (탭을 바꿔도 유지)

    function contact(id) {
      for (var i = 0; i < D.contacts.length; i++) if (D.contacts[i].id === id) return D.contacts[i];
      return null;
    }
    function contactByNumber(num) {
      var d = digitsOf(num);
      if (!d) return null;
      for (var i = 0; i < D.contacts.length; i++) if (digitsOf(D.contacts[i].number) === d) return D.contacts[i];
      return null;
    }
    function isFav(id) { return D.favorites.indexOf(id) !== -1; }

    appEl.classList.add("app-phone");
    var host = document.createElement("div");
    host.className = "app-stage";
    appEl.appendChild(host);
    var stack = ui.createStack(host);

    /* ---------- 키패드 ---------- */
    function showKeypad() {
      stack.reset({ noNav: true, className: "ph-keypad" }, function (body) {
        body.innerHTML =
          '<div class="kp-display"><div class="kp-number" aria-live="polite"></div><div class="kp-match"></div></div>' +
          '<div class="kp-keys">' +
            KEYS.map(function (k) {
              return '<button type="button" class="kp-key" data-key="' + k[0] + '" aria-label="' + k[0] + '">' +
                '<span class="kp-digit">' + k[0] + "</span>" +
                '<span class="kp-letters">' + k[1] + "</span></button>";
            }).join("") +
          "</div>" +
          '<div class="kp-actions">' +
            '<button type="button" class="kp-side kp-add" disabled aria-label="연락처 추가">' + ICON.addContact + "</button>" +
            '<button type="button" class="kp-call">' + ICON.call + "<span>통화</span></button>" +
            '<button type="button" class="kp-side kp-del" aria-label="지우기">' + ICON.del + "</button>" +
          "</div>";

        var numEl = body.querySelector(".kp-number");
        var matchEl = body.querySelector(".kp-match");

        function draw() {
          numEl.textContent = fmt(dial);
          numEl.classList.toggle("is-long", dial.length > 11);
          var c = contactByNumber(dial);
          matchEl.textContent = c ? c.name : "";
        }
        draw();

        body.querySelector(".kp-keys").addEventListener("click", function (e) {
          var k = e.target.closest("[data-key]");
          if (!k || dial.length >= 20) return;
          dial += k.getAttribute("data-key");
          draw();
        });
        body.querySelector(".kp-del").addEventListener("click", function () {
          dial = dial.slice(0, -1);
          draw();
        });
        body.querySelector(".kp-call").addEventListener("click", function () {
          if (!dial) {
            // 빈 상태에서 '통화'를 누르면 마지막으로 건 번호를 불러옴 (iOS와 같은 동작)
            for (var i = 0; i < D.recents.length; i++) {
              var r = D.recents[i];
              if (r.type === "out") { dial = digitsOf(r.number || (contact(r.who) || {}).number); break; }
            }
            draw();
            return;
          }
          var c = contactByNumber(dial);
          startCall({ who: c ? c.id : null, number: fmt(dial) });
        });
      });
    }

    /* ---------- 통화 화면 ---------- */
    function startCall(target) {
      var c = target.who ? contact(target.who) : contactByNumber(target.number);
      var name = c ? c.name : target.number;
      var wall = YUSHI.config.wallpaper;
      // 통화 화면 뒤에는 홈 화면 배경화면 (걸 때도, 올 때도)
      var wallPath = typeof wall === "string" ? wall : (wall && (wall.home || wall.lock));

      stack.push({ noNav: true, full: true, className: "ph-call" }, function (body) {
        if (wallPath) body.style.backgroundImage = 'url("' + wallPath + '")';
        body.innerHTML =
          '<div class="call-shade"></div>' +
          '<div class="call-top"><div class="call-name"></div><div class="call-status">호출 중...</div></div>' +
          '<div class="call-panel">' +
            '<button type="button" class="call-btn" data-toggle="mute" aria-pressed="false">' + ICON.mute + "<span>소리 끔</span></button>" +
            '<button type="button" class="call-btn" disabled>' + ICON.keypad + "<span>키패드</span></button>" +
            '<button type="button" class="call-btn" data-toggle="speaker" aria-pressed="false">' + ICON.speaker + "<span>스피커</span></button>" +
            '<button type="button" class="call-btn" disabled>' + ICON.add + "<span>통화 추가</span></button>" +
            '<button type="button" class="call-btn" disabled>' + ICON.facetime + "<span>FaceTime</span></button>" +
            '<button type="button" class="call-btn" disabled>' + ICON.book + "<span>연락처</span></button>" +
          "</div>" +
          '<button type="button" class="call-end">' + ICON.end + "<span>종료</span></button>";

        body.querySelector(".call-name").textContent = name;

        /* ---------- 통화 장면 (callScripts) ---------- */
        var timers = [], tickTimer = null, connected = false, ended = false;
        var statusEl = body.querySelector(".call-status");
        var script = c && D.callScripts && D.callScripts[c.id];
        var S = (YUSHI.session = YUSHI.session || {});
        S.unlocked = S.unlocked || {}; S.callsDone = S.callsDone || {};
        var canRun = script && (!script.unlock || S.unlocked[script.unlock]) && !S.callsDone[c.id];
        function later(f, sec) { timers.push(setTimeout(f, sec * 1000)); }
        function clearAll() { timers.forEach(clearTimeout); clearInterval(tickTimer); if (typeof stopRing === "function") stopRing(); }
        function two(n) { return (n < 10 ? "0" : "") + n; }
        function mmss(n) { return two(Math.floor(n / 60)) + ":" + two(n % 60); }
        function finish() {
          if (ended) return;
          ended = true;
          clearAll();
          var rec = { type: "out", time: YUSHI.now() };
          if (c) rec.who = c.id; else rec.number = target.number;
          D.recents.unshift(rec);
          dial = "";
          stack.pop();
        }
        // 통화 연결음: 연결음이 정해진 연락처에 걸면, 받을 때까지(또는 종료할 때까지) 반복
        var ring = null;
        if (script && script.ringback) {
          try {
            ring = new Audio(script.ringback);
            ring.loop = true;
            var rp = ring.play(); if (rp && rp.catch) rp.catch(function () {});
          } catch (e) { ring = null; }
        }
        function stopRing() { if (ring) { ring.pause(); ring = null; } }

        if (canRun) {
          var sub = document.createElement("div");
          sub.className = "call-sub";
          body.appendChild(sub);
          later(function () {
            stopRing();
            connected = true;
            S.callsDone[c.id] = true;
            var sec = 0;
            statusEl.textContent = "00:00";
            tickTimer = setInterval(function () { sec++; statusEl.textContent = mmss(sec); }, 1000);
            var t = 0;
            script.lines.forEach(function (ln) {
              t += ln.after;
              later(function () {
                sub.classList.remove("is-on");
                setTimeout(function () { sub.textContent = ln.text; sub.classList.add("is-on"); }, 120);
              }, t);
            });
            later(function () {
              clearInterval(tickTimer);
              sub.classList.remove("is-on");
              statusEl.textContent = "통화 종료";
              later(finish, 1.4);
            }, t + (script.hangup || 3));
          }, script.ring || 3);
        }

        body.querySelector(".call-panel").addEventListener("click", function (e) {
          var b = e.target.closest("[data-toggle]");
          if (!b) return;
          var on = b.classList.toggle("is-on");
          b.setAttribute("aria-pressed", String(on));
        });

        // 종료 버튼: 건 전화를 최근 통화 맨 위에 기록 (이 페이지를 연 동안만)
        body.querySelector(".call-end").addEventListener("click", finish);
      });
    }

    /* ---------- 최근 통화 ---------- */
    function showRecents() {
      var mode = "all", listBody;

      function draw() {
        var list = D.recents.filter(function (r) { return mode === "all" || r.type === "missed"; });
        if (!list.length) {
          listBody.innerHTML = '<p class="list-empty">' + (mode === "all" ? "최근 통화가 없습니다." : "부재중 전화가 없습니다.") + "</p>";
          return;
        }
        listBody.innerHTML = list.map(function (r) {
          var c = r.who ? contact(r.who) : contactByNumber(r.number);
          var idx = D.recents.indexOf(r);
          return (
            '<div class="row ph-row' + (r.type === "missed" ? " is-missed" : "") + '">' +
              '<button type="button" class="ph-row-main" data-call="' + idx + '">' +
                '<span class="row-title">' + esc(c ? c.name : r.number) + "</span>" +
                '<span class="row-sub">' + (c ? "휴대전화" : "알 수 없음") + "</span>" +
              "</button>" +
              '<span class="row-time">' + ui.listTime(r.time) + "</span>" +
              (c ? '<button type="button" class="disc-btn" data-contact="' + esc(c.id) + '" aria-label="' + esc(c.name) + ' 정보">' + DISC + "</button>"
                 : '<span class="disc-gap"></span>') +
            "</div>"
          );
        }).join("");
      }

      stack.reset({ title: "", className: "ph-recents", onShow: function () { draw(); } }, function (body, scr) {
        listBody = body;
        body.classList.add("list-plain");
        var bar = scr.querySelector(".navbar");
        var seg = document.createElement("div");
        seg.className = "seg";
        seg.setAttribute("role", "group");
        seg.innerHTML =
          '<button type="button" class="is-on" data-seg="all" aria-pressed="true">전체</button>' +
          '<button type="button" data-seg="missed" aria-pressed="false">부재중</button>';
        bar.appendChild(seg);
        seg.addEventListener("click", function (e) {
          var b = e.target.closest("[data-seg]");
          if (!b) return;
          mode = b.getAttribute("data-seg");
          Array.prototype.forEach.call(seg.children, function (x) {
            var on = x === b;
            x.classList.toggle("is-on", on);
            x.setAttribute("aria-pressed", String(on));
          });
          draw();
        });
        draw();

        body.addEventListener("click", function (e) {
          var d = e.target.closest("[data-contact]");
          if (d) { openContact(d.getAttribute("data-contact"), "최근 통화"); return; }
          var row = e.target.closest("[data-call]");
          if (!row) return;
          var r = D.recents[+row.getAttribute("data-call")];
          var c = r.who ? contact(r.who) : contactByNumber(r.number);
          callContactOrNumber(c, r.number);
        });
      });
    }

    function callContactOrNumber(c, number) {
      var num = c ? c.number : number;
      if (!num) {
        if (c) openContact(c.id, "뒤로");
        return;
      }
      startCall({ who: c ? c.id : null, number: num });
    }

    /* ---------- 즐겨찾기 ---------- */
    function showFavorites() {
      var listBody;
      function draw() {
        var favs = D.favorites.map(contact).filter(Boolean);
        listBody.innerHTML = favs.length
          ? favs.map(function (c) {
              return (
                '<div class="row ph-row">' +
                  '<button type="button" class="ph-row-main" data-fav="' + esc(c.id) + '"><span class="row-title">' + esc(c.name) + "</span></button>" +
                  '<span class="row-time ph-label">휴대전화</span>' +
                  '<button type="button" class="disc-btn" data-contact="' + esc(c.id) + '" aria-label="' + esc(c.name) + ' 정보">' + DISC + "</button>" +
                "</div>"
              );
            }).join("")
          : '<p class="list-empty">즐겨찾기가 없습니다.</p>';
      }
      stack.reset({ title: "즐겨찾기", onShow: function () { draw(); } }, function (body) {
        listBody = body;
        body.classList.add("list-plain");
        draw();
        body.addEventListener("click", function (e) {
          var d = e.target.closest("[data-contact]");
          if (d) { openContact(d.getAttribute("data-contact"), "즐겨찾기"); return; }
          var f = e.target.closest("[data-fav]");
          if (f) callContactOrNumber(contact(f.getAttribute("data-fav")));
        });
      });
    }

    /* ---------- 연락처 ---------- */
    function initialOf(name) {
      var n = name.charCodeAt(0) - 0xac00;
      if (n >= 0 && n < 11172) {
        var cho = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"[Math.floor(n / 588)];
        return { "ㄲ": "ㄱ", "ㄸ": "ㄷ", "ㅃ": "ㅂ", "ㅆ": "ㅅ", "ㅉ": "ㅈ" }[cho] || cho;
      }
      var ch = name.charAt(0).toUpperCase();
      return /[A-Z]/.test(ch) ? ch : "#";
    }

    function showContacts() {
      stack.reset({ title: "연락처" }, function (body) {
        body.classList.add("list-plain");
        var sorted = D.contacts.slice().sort(function (a, b) {
          var ia = initialOf(a.name), ib = initialOf(b.name);
          if ((ia === "#") !== (ib === "#")) return ia === "#" ? 1 : -1;   // '#'은 맨 아래
          return a.name.localeCompare(b.name, "ko");
        });
        var html = "", cur = null;
        sorted.forEach(function (c) {
          var ini = initialOf(c.name);
          if (ini !== cur) { html += '<div class="list-head">' + esc(ini) + "</div>"; cur = ini; }
          html += '<button type="button" class="row" data-contact="' + esc(c.id) + '"><span class="row-main"><span class="row-title">' + esc(c.name) + "</span></span></button>";
        });
        body.innerHTML = html + '<p class="ph-count">연락처 ' + D.contacts.length + "개</p>";
        body.addEventListener("click", function (e) {
          var r = e.target.closest("[data-contact]");
          if (r) openContact(r.getAttribute("data-contact"), "연락처");
        });
      });
    }

    function openContact(id, backLabel) {
      var c = contact(id);
      if (!c) return;
      stack.push({ title: "정보", back: backLabel, full: true, className: "ph-card" }, function (body) {
        function draw() {
          body.innerHTML =
            '<div class="card-head">' + ui.avatar(c, 64, "card-photo") + '<div class="card-name">' + esc(c.name) + "</div></div>" +
            '<div class="grp">' +
              (c.number
                ? '<button type="button" class="grp-row" data-act="call"><span class="grp-label">휴대전화</span><span class="grp-value">' + esc(c.number) + "</span></button>"
                : '<div class="grp-row"><span class="grp-label">휴대전화</span><span class="grp-value grp-empty">번호 없음</span></div>') +
            "</div>" +
            '<div class="grp grp-btn"><button type="button" class="grp-row grp-center" data-act="fav">' +
              (isFav(c.id) ? "즐겨찾기에서 제거" : "즐겨찾기에 추가") + "</button></div>";
        }
        draw();
        body.addEventListener("click", function (e) {
          var b = e.target.closest("[data-act]");
          if (!b) return;
          if (b.getAttribute("data-act") === "call") startCall({ who: c.id, number: c.number });
          else {
            var i = D.favorites.indexOf(c.id);
            if (i === -1) D.favorites.push(c.id); else D.favorites.splice(i, 1);
            draw();
          }
        });
      });
    }

    /* ---------- 음성 사서함 ---------- */
    function showVoicemail() {
      stack.reset({ title: "음성 사서함" }, function (body) {
        body.classList.add("list-plain");
        body.innerHTML = D.voicemail.length
          ? D.voicemail.map(function (v) {
              return '<div class="row"><span class="row-main"><span class="row-title">' + esc(v.name || v.number || "") + "</span></span></div>";
            }).join("")
          : '<p class="list-empty">음성 메시지가 없습니다.</p>';
      });
    }

    /* ---------- 탭 ---------- */
    var tabs = ui.createTabs(host, [
      { id: "fav",       label: "즐겨찾기",  icon: TAB.fav },
      { id: "recent",    label: "최근 통화", icon: TAB.recent },
      { id: "contacts",  label: "연락처",    icon: TAB.contacts },
      { id: "keypad",    label: "키패드",    icon: TAB.keypad },
      { id: "voicemail", label: "음성 사서함", icon: TAB.voicemail }
    ], function (id) {
      if (id === "fav") showFavorites();
      else if (id === "recent") { tabs.setBadge("recent", 0); showRecents(); }
      else if (id === "contacts") showContacts();
      else if (id === "keypad") showKeypad();
      else showVoicemail();
    });

    // 부재중 전화 수를 '최근 통화' 탭에 표시
    tabs.setBadge("recent", D.recents.filter(function (r) { return r.type === "missed"; }).length);

    tabs.select("keypad");
  };
})();
