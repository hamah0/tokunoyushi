/*
 * 계산기 · 시계 앱
 * -----------------------------------------
 * 계산기: 사칙연산, ±, 메모리(mc m+ m- mr)가 실제로 계산됩니다.
 * 시계  : 세계 시계 / 알람 / 스톱워치 / 타이머 (스톱워치와 타이머는 실제로 흐릅니다)
 * 데이터: js/data/apps-data.js (alarms)
 */
window.YUSHI = window.YUSHI || {};
YUSHI.appScreens = YUSHI.appScreens || {};

(function () {
  var ui = YUSHI.ui;

  /* =========================================================
   * 계산기
   * ========================================================= */
  YUSHI.appScreens.calculator = function mount(appEl) {
    appEl.classList.add("app-calc");
    var root = document.createElement("div");
    root.className = "calc";
    var KEYS = [
      ["mc", "mem", "mc"], ["m+", "mem", "m+"], ["m−", "mem", "m-"], ["mr", "mem", "mr"],
      ["C", "fn", "clear"], ["±", "fn", "neg"], ["÷", "op", "/"], ["×", "op", "*"],
      ["7", "num", "7"], ["8", "num", "8"], ["9", "num", "9"], ["−", "op", "-"],
      ["4", "num", "4"], ["5", "num", "5"], ["6", "num", "6"], ["+", "op", "+"],
      ["1", "num", "1"], ["2", "num", "2"], ["3", "num", "3"], ["=", "eq", "="],
      ["0", "num zero", "0"], [".", "num", "."]
    ];
    root.innerHTML =
      '<div class="calc-display"><span class="calc-m" hidden>M</span><span class="calc-value" aria-live="polite">0</span></div>' +
      '<div class="calc-keys">' +
        KEYS.map(function (k) {
          return '<button type="button" class="calc-key calc-' + k[1].split(" ").join(" calc-") + '" data-k="' + k[2] + '">' + k[0] + "</button>";
        }).join("") +
      "</div>";
    appEl.appendChild(root);

    var valueEl = root.querySelector(".calc-value");
    var memEl = root.querySelector(".calc-m");
    var display = "0", acc = null, op = null, fresh = false, mem = 0, error = false;

    function num() { return parseFloat(display) || 0; }

    function format(s) {
      if (error) return "오류";
      var neg = s.charAt(0) === "-";
      if (neg) s = s.slice(1);
      var parts = s.split(".");
      var int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return (neg ? "-" : "") + int + (parts.length > 1 ? "." + parts[1] : "");
    }

    function fromNumber(n) {
      if (!isFinite(n)) { error = true; return "0"; }
      var s = String(parseFloat(n.toPrecision(9)));
      if (s.indexOf("e") !== -1 || s.replace(/[-.]/g, "").length > 9) s = n.toExponential(3).replace("+", "");
      return s;
    }

    function compute(a, b, o) {
      if (o === "+") return a + b;
      if (o === "-") return a - b;
      if (o === "*") return a * b;
      if (o === "/") return b === 0 ? NaN : a / b;
      return b;
    }

    function draw() {
      valueEl.textContent = format(display);
      valueEl.classList.toggle("is-small", format(display).length > 9);
      memEl.hidden = mem === 0;
      var ops = root.querySelectorAll(".calc-op");
      for (var i = 0; i < ops.length; i++) {
        ops[i].classList.toggle("is-on", fresh && op === ops[i].getAttribute("data-k"));
      }
    }

    root.querySelector(".calc-keys").addEventListener("click", function (e) {
      var b = e.target.closest("[data-k]");
      if (!b) return;
      var k = b.getAttribute("data-k");
      if (error && k !== "clear") return;

      if (/^[0-9.]$/.test(k)) {
        if (fresh || display === "0") { display = k === "." ? "0." : k; fresh = false; }
        else if (k === "." && display.indexOf(".") !== -1) return;
        else if (display.replace(/[-.]/g, "").length < 9) display += k;
      } else if (k === "clear") {
        display = "0"; acc = null; op = null; fresh = false; error = false;
      } else if (k === "neg") {
        if (display !== "0") display = display.charAt(0) === "-" ? display.slice(1) : "-" + display;
      } else if (k === "=" ) {
        if (op !== null && acc !== null) { display = fromNumber(compute(acc, num(), op)); acc = null; op = null; }
        fresh = true;
      } else if (/^[-+*/]$/.test(k)) {
        if (op !== null && acc !== null && !fresh) display = fromNumber(compute(acc, num(), op));
        acc = num(); op = k; fresh = true;
      } else if (k === "mc") { mem = 0; }
      else if (k === "m+") { mem += num(); fresh = true; }
      else if (k === "m-") { mem -= num(); fresh = true; }
      else if (k === "mr") { display = fromNumber(mem); fresh = true; }
      draw();
    });
    draw();
  };

  /* =========================================================
   * 시계
   * ========================================================= */
  var CITIES = [   // 2013년 4월 기준 시차 (서머타임 반영)
    { name: "서울", offset: 9 },
    { name: "도쿄", offset: 9 },
    { name: "베이징", offset: 8 },
    { name: "런던", offset: 1 },
    { name: "뉴욕", offset: -4 }
  ];

  function analog(d, size) {
    var night = d.getHours() < 6 || d.getHours() >= 18;
    var h = d.getHours() % 12, m = d.getMinutes(), s = d.getSeconds();
    var ticks = "";
    for (var i = 0; i < 12; i++) {
      ticks += '<rect x="24.4" y="4" width="1.2" height="' + (i % 3 === 0 ? 5 : 3) + '" transform="rotate(' + i * 30 + ' 25 25)"/>';
    }
    return (
      '<svg class="wc-face' + (night ? " is-night" : "") + '" viewBox="0 0 50 50" width="' + size + '" height="' + size + '" aria-hidden="true">' +
        '<circle cx="25" cy="25" r="24" class="wc-dial"/>' +
        '<g class="wc-ticks">' + ticks + "</g>" +
        '<rect class="wc-hand" x="23.8" y="12" width="2.4" height="14" rx="1.2" transform="rotate(' + (h * 30 + m / 2) + ' 25 25)"/>' +
        '<rect class="wc-hand" x="24.2" y="7" width="1.6" height="19" rx=".8" transform="rotate(' + m * 6 + ' 25 25)"/>' +
        '<rect x="24.6" y="6" width=".8" height="22" fill="#d6392b" transform="rotate(' + s * 6 + ' 25 25)"/>' +
        '<circle cx="25" cy="25" r="1.8" fill="#d6392b"/>' +
      "</svg>"
    );
  }

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  YUSHI.appScreens.clock = function mount(appEl) {
    var D = YUSHI.data.apps;
    var esc = ui.esc;
    var timers = [];
    function every(fn, ms) { var id = setInterval(fn, ms); timers.push(id); return id; }

    appEl.classList.add("app-clock");
    var host = document.createElement("div");
    host.className = "app-stage";
    appEl.appendChild(host);
    var stack = ui.createStack(host);
    var tick = null;   // 지금 보이는 탭의 갱신 함수

    every(function () { if (tick) tick(); }, 200);

    /* ---------- 세계 시계 ---------- */
    function showWorld() {
      stack.reset({ title: "세계 시계", className: "clk-dark" }, function (body) {
        var last = -1;
        tick = function () {
          var now = YUSHI.now();
          if (now.getSeconds() === last) return;
          last = now.getSeconds();
          body.innerHTML = CITIES.map(function (c) {
            var t = new Date(now.getTime() + (c.offset - 9) * 3600000);
            var dayDiff = Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
            var dayWord = dayDiff === 0 ? "오늘" : dayDiff > 0 ? "내일" : "어제";
            return (
              '<div class="wc-row">' + analog(t, 58) +
                '<div class="wc-text"><span class="wc-city">' + c.name + "</span>" +
                '<span class="wc-sub">' + dayWord + ", " + ui.timeText(t) + "</span></div>" +
              "</div>"
            );
          }).join("");
        };
        tick();
      });
    }

    /* ---------- 알람 ---------- */
    function showAlarms() {
      tick = null;
      stack.reset({ title: "알람" }, function (body) {
        body.classList.add("list-plain");
        function draw() {
          if (!D.alarms.length) { body.innerHTML = '<p class="list-empty">알람 없음</p>'; return; }
          body.innerHTML = D.alarms.map(function (a, i) {
            var hm = a.time.split(":");
            var d = new Date(2013, 3, 4, +hm[0], +hm[1]);
            var ampm = d.getHours() < 12 ? "오전" : "오후";
            return (
              '<div class="al-row' + (a.on ? "" : " is-off") + '">' +
                '<div class="al-text"><span class="al-time"><small>' + ampm + "</small> " + (d.getHours() % 12 || 12) + ":" + pad2(d.getMinutes()) + "</span>" +
                '<span class="al-label">' + esc(a.label || "알람") + "</span></div>" +
                '<button type="button" class="sw' + (a.on ? " is-on" : "") + '" data-al="' + i + '" role="switch" aria-checked="' + !!a.on + '" aria-label="알람 켜기">' +
                  '<span class="sw-on">ON</span><span class="sw-knob"></span><span class="sw-off">OFF</span></button>' +
              "</div>"
            );
          }).join("");
        }
        draw();
        body.addEventListener("click", function (e) {
          var b = e.target.closest("[data-al]");
          if (!b) return;
          var a = D.alarms[+b.getAttribute("data-al")];
          a.on = !a.on;
          draw();
        });
      });
    }

    /* ---------- 스톱워치 ---------- */
    // 스톱워치·타이머는 앱을 닫았다 열어도 계속 흐름 (페이지를 연 동안)
    YUSHI.session = YUSHI.session || {};
    var sw = YUSHI.session.stopwatch = YUSHI.session.stopwatch || { running: false, start: 0, elapsed: 0, laps: [] };
    function swTime() { return sw.elapsed + (sw.running ? Date.now() - sw.start : 0); }
    function fmtSw(ms) {
      var t = Math.floor(ms / 100);
      return pad2(Math.floor(t / 600)) + ":" + pad2(Math.floor(t / 10) % 60) + "." + (t % 10);
    }

    function showStopwatch() {
      stack.reset({ title: "스톱워치" }, function (body) {
        body.classList.add("sw-screen");
        body.innerHTML =
          '<div class="sw-top"><div class="sw-lap"></div><div class="sw-main"></div></div>' +
          '<div class="sw-btns"><button type="button" class="big-btn sw-go"></button><button type="button" class="big-btn sw-lapbtn"></button></div>' +
          '<div class="sw-laps"></div>';
        var mainEl = body.querySelector(".sw-main"), lapEl = body.querySelector(".sw-lap");
        var go = body.querySelector(".sw-go"), lapBtn = body.querySelector(".sw-lapbtn");
        var lapsEl = body.querySelector(".sw-laps");

        function drawButtons() {
          go.textContent = sw.running ? "중단" : "시작";
          go.className = "big-btn sw-go " + (sw.running ? "is-red" : "is-green");
          lapBtn.textContent = sw.running ? "랩" : "재설정";
          lapBtn.disabled = !sw.running && swTime() === 0;
          lapsEl.innerHTML = sw.laps.map(function (l, i) {
            return '<div class="sw-laprow"><span>랩 ' + (sw.laps.length - i) + "</span><span>" + fmtSw(l) + "</span></div>";
          }).join("");
        }
        tick = function () {
          var t = swTime();
          mainEl.textContent = fmtSw(t);
          var lapStart = sw.laps.reduce(function (s, l) { return s + l; }, 0);
          lapEl.textContent = sw.laps.length ? fmtSw(t - lapStart) : "";
        };
        go.addEventListener("click", function () {
          if (sw.running) { sw.elapsed = swTime(); sw.running = false; }
          else { sw.start = Date.now(); sw.running = true; }
          drawButtons(); tick();
        });
        lapBtn.addEventListener("click", function () {
          if (sw.running) {
            var used = sw.laps.reduce(function (s, l) { return s + l; }, 0);
            sw.laps.unshift(swTime() - used);
          } else { sw.elapsed = 0; sw.laps = []; }
          drawButtons(); tick();
        });
        drawButtons(); tick();
      });
    }

    /* ---------- 타이머 ---------- */
    var tm = YUSHI.session.timer = YUSHI.session.timer || { h: 0, m: 5, running: false, paused: false, end: 0, left: 0, done: false };
    function fmtLeft(ms) {
      var s = Math.ceil(ms / 1000);
      var h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60;
      return (h ? h + ":" + pad2(m) : m) + ":" + pad2(s % 60);
    }

    function showTimer() {
      stack.reset({ title: "타이머" }, function (body) {
        body.classList.add("tm-screen");
        function draw() {
          if (tm.running || tm.paused) {
            body.innerHTML =
              '<div class="tm-left"></div>' +
              '<div class="sw-btns"><button type="button" class="big-btn is-red" data-t="cancel">취소</button>' +
              '<button type="button" class="big-btn" data-t="pause">' + (tm.paused ? "재개" : "일시 정지") + "</button></div>";
          } else {
            body.innerHTML =
              '<div class="tm-picker">' +
                '<div class="tm-col"><button type="button" data-t="h+" aria-label="시간 늘리기">▲</button><span>' + tm.h + '<small>시간</small></span><button type="button" data-t="h-" aria-label="시간 줄이기">▼</button></div>' +
                '<div class="tm-col"><button type="button" data-t="m+" aria-label="분 늘리기">▲</button><span>' + tm.m + '<small>분</small></span><button type="button" data-t="m-" aria-label="분 줄이기">▼</button></div>' +
              "</div>" +
              (tm.done ? '<p class="tm-done">타이머가 끝났습니다.</p>' : "") +
              '<div class="sw-btns tm-start"><button type="button" class="big-btn is-green" data-t="start"' + (tm.h + tm.m ? "" : " disabled") + ">시작</button></div>";
          }
          tick();
        }
        tick = function () {
          var el = body.querySelector(".tm-left");
          if (!el) return;
          var left = tm.paused ? tm.left : tm.end - Date.now();
          if (left <= 0 && tm.running) { tm.running = false; tm.done = true; draw(); return; }
          el.textContent = fmtLeft(left);
        };
        body.addEventListener("click", function (e) {
          var b = e.target.closest("[data-t]");
          if (!b) return;
          var t = b.getAttribute("data-t");
          if (t === "h+") tm.h = (tm.h + 1) % 24;
          else if (t === "h-") tm.h = (tm.h + 23) % 24;
          else if (t === "m+") tm.m = (tm.m + 1) % 60;
          else if (t === "m-") tm.m = (tm.m + 59) % 60;
          else if (t === "start") { tm.end = Date.now() + (tm.h * 3600 + tm.m * 60) * 1000; tm.running = true; tm.paused = false; tm.done = false; }
          else if (t === "cancel") { tm.running = false; tm.paused = false; }
          else if (t === "pause") {
            if (tm.paused) { tm.end = Date.now() + tm.left; tm.paused = false; tm.running = true; }
            else { tm.left = tm.end - Date.now(); tm.paused = true; tm.running = false; }
          }
          draw();
        });
        draw();
      });
    }

    function svgTab(p) { return '<svg viewBox="0 0 30 30" aria-hidden="true">' + p + "</svg>"; }
    var tabs = ui.createTabs(host, [
      { id: "world", label: "세계 시계", icon: svgTab('<path fill-rule="evenodd" d="M15 3a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm-1.3 2.7a9.4 9.4 0 0 0-7.8 6.3h4.3c.6-2.4 1.8-4.6 3.5-6.3zm2.6 0c1.7 1.7 2.9 3.9 3.5 6.3h4.3a9.4 9.4 0 0 0-7.8-6.3zM12.5 12h5c-.6-2.2-1.4-4-2.5-5.5-1.1 1.5-1.9 3.3-2.5 5.5zm-7 3c0 .7.1 1.4.2 2h4.6a17 17 0 0 1 0-4H5.7c-.1.6-.2 1.3-.2 2zm7.3-2a14 14 0 0 0 0 4h4.4a14 14 0 0 0 0-4zm7 0a17 17 0 0 1 0 4h4.6a9.4 9.4 0 0 0 0-4zm-13.9 5a9.4 9.4 0 0 0 7.8 6.3c-1.7-1.7-2.9-3.9-3.5-6.3zm6.6 0c.6 2.2 1.4 4 2.5 5.5 1.1-1.5 1.9-3.3 2.5-5.5zm7.8 0c-.6 2.4-1.8 4.6-3.5 6.3a9.4 9.4 0 0 0 7.8-6.3z"/>') },
      { id: "alarm", label: "알람", icon: svgTab('<path fill-rule="evenodd" d="M15 6a10.5 10.5 0 1 1 0 21 10.5 10.5 0 0 1 0-21zm0 2.6a7.9 7.9 0 1 0 0 15.8 7.9 7.9 0 0 0 0-15.8z"/><path d="M13.8 11h2.4v5.2l3.4 2.4-1.4 2-4.4-3.1zM3 8.5L8.5 3l1.7 1.7-5.5 5.5zM27 8.5L21.5 3l-1.7 1.7 5.5 5.5z"/>') },
      { id: "stopwatch", label: "스톱워치", icon: svgTab('<path fill-rule="evenodd" d="M15 6.5a10.3 10.3 0 1 1 0 20.6 10.3 10.3 0 0 1 0-20.6zm0 2.6a7.7 7.7 0 1 0 0 15.4 7.7 7.7 0 0 0 0-15.4z"/><path d="M12 2h6v2.6h-6zM13.8 10.5h2.4v6.8h-2.4z"/>') },
      { id: "timer", label: "타이머", icon: svgTab('<path d="M7 3h16v2.5h-1.8c0 4.3-2.6 7.2-4.7 9.5 2.1 2.3 4.7 5.2 4.7 9.5H23V27H7v-2.5h1.8c0-4.3 2.6-7.2 4.7-9.5C11.4 12.7 8.8 9.8 8.8 5.5H7z"/>') }
    ], function (id) {
      tick = null;
      if (id === "world") showWorld();
      else if (id === "alarm") showAlarms();
      else if (id === "stopwatch") showStopwatch();
      else showTimer();
    });
    tabs.select("world");

    return function () { timers.forEach(clearInterval); };
  };
})();
