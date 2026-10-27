/*
 * 캘린더 · 메모 · 미리 알림 · 연락처 앱
 * -----------------------------------------
 * 캘린더  : 월 보기, 이전/다음 달, 날짜를 누르면 그날 일정
 * 메모    : 목록 → 메모 열기(키보드로 수정), + 새 메모, 휴지통으로 삭제
 * 미리 알림: 동그라미를 눌러 완료 표시, 아래 칸에 새 항목 추가
 * 연락처  : 전화 앱과 같은 연락처 목록과 정보 카드
 * 바꾼 내용은 페이지를 연 동안만 남습니다.
 * 데이터: js/data/apps-data.js, 연락처는 js/data/phone-data.js
 */
window.YUSHI = window.YUSHI || {};
YUSHI.appScreens = YUSHI.appScreens || {};

(function () {
  var ui = YUSHI.ui;
  var DAYS = ["일", "월", "화", "수", "목", "금", "토"];
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }

  function stage(appEl, cls) {
    appEl.classList.add(cls);
    var host = document.createElement("div");
    host.className = "app-stage";
    appEl.appendChild(host);
    return { host: host, stack: ui.createStack(host) };
  }

  /* =========================================================
   * 캘린더
   * ========================================================= */
  YUSHI.appScreens.calendar = function mount(appEl) {
    var D = YUSHI.data.apps, esc = ui.esc;
    var st = stage(appEl, "app-cal");
    var today = YUSHI.now();
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var selected = ymd(today);
    var MIN = new Date(2013, 0, 1); // 2013년 1월보다 앞은 보이지 않음

    st.stack.reset({ title: "캘린더", full: true, className: "cal" }, function (body) {
      function draw() {
        var y = view.getFullYear(), m = view.getMonth();
        var first = new Date(y, m, 1).getDay();
        var start = new Date(y, m, 1 - first);
        var cells = "";
        var weeks = Math.ceil((first + new Date(y, m + 1, 0).getDate()) / 7);
        for (var i = 0; i < weeks * 7; i++) {
          var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
          var key = ymd(d);
          if (d < MIN) { cells += '<span class="cal-cell is-blank"></span>'; continue; }
          var has = D.calendar.some(function (ev) { return ev.date === key; });
          cells +=
            '<button type="button" class="cal-cell' + (d.getMonth() !== m ? " is-other" : "") +
              (key === ymd(today) ? " is-today" : "") + (key === selected ? " is-sel" : "") + '" data-day="' + key + '">' +
              d.getDate() + (has ? '<i class="cal-dot"></i>' : "") + "</button>";
        }
        var evs = D.calendar.filter(function (ev) { return ev.date === selected; });
        var sd = new Date(+selected.slice(0, 4), +selected.slice(5, 7) - 1, +selected.slice(8, 10));
        body.innerHTML =
          '<div class="cal-head">' +
            '<button type="button" class="cal-nav" data-nav="-1" aria-label="이전 달"' + (view <= MIN ? " disabled" : "") + '>◀</button>' +
            '<span class="cal-title">' + y + "년 " + (m + 1) + "월</span>" +
            '<button type="button" class="cal-nav" data-nav="1" aria-label="다음 달">▶</button>' +
          "</div>" +
          '<div class="cal-week">' + DAYS.map(function (w) { return "<span>" + w + "</span>"; }).join("") + "</div>" +
          '<div class="cal-grid">' + cells + "</div>" +
          '<div class="cal-list">' +
            '<div class="cal-list-head">' + (sd.getMonth() + 1) + "월 " + sd.getDate() + "일 " + DAYS[sd.getDay()] + "요일</div>" +
            (evs.length
              ? evs.map(function (ev) {
                  return '<div class="cal-ev"><span class="cal-ev-time">' + (ev.time ? ui.timeText(selected + " " + ev.time) : "하루 종일") + '</span><span class="cal-ev-title">' + esc(ev.title) + "</span></div>";
                }).join("")
              : '<p class="cal-none">일정 없음</p>') +
          "</div>" +
          '<div class="cal-bar"><button type="button" class="cal-today">오늘</button></div>';
      }
      draw();
      body.addEventListener("click", function (e) {
        var nav = e.target.closest("[data-nav]");
        if (nav) {
          var next = new Date(view.getFullYear(), view.getMonth() + Number(nav.getAttribute("data-nav")), 1);
          if (next >= MIN) { view = next; draw(); }
          return;
        }
        var day = e.target.closest("[data-day]");
        if (day) {
          selected = day.getAttribute("data-day");
          var d = new Date(+selected.slice(0, 4), +selected.slice(5, 7) - 1, 1);
          if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = d;
          draw(); return;
        }
        if (e.target.closest(".cal-today")) {
          today = YUSHI.now();
          view = new Date(today.getFullYear(), today.getMonth(), 1);
          selected = ymd(today);
          draw();
        }
      });
    });
  };

  /* =========================================================
   * 메모
   * ========================================================= */
  YUSHI.appScreens.notes = function mount(appEl) {
    var D = YUSHI.data.apps, esc = ui.esc;
    var st = stage(appEl, "app-notes");
    var stack = st.stack;
    var listBody;

    function titleOf(n) { return (n.text.split("\n")[0] || "새로운 메모").trim() || "새로운 메모"; }
    function sorted() { return D.notes.slice().sort(function (a, b) { return ui.parseTime(b.time) - ui.parseTime(a.time); }); }

    function drawList() {
      var list = sorted();
      listBody.innerHTML = list.length
        ? list.map(function (n) {
            return '<button type="button" class="nt-row" data-note="' + D.notes.indexOf(n) + '"><span class="nt-title">' + esc(titleOf(n)) +
              '</span><span class="nt-time">' + ui.listTime(n.time) + " ›</span></button>";
          }).join("")
        : '<p class="nt-empty">메모 없음</p>';
      var h = listBody.parentNode.querySelector("h1");
      if (h) h.textContent = "메모 (" + D.notes.length + ")";
    }

    function openNote(i) {
      var n = D.notes[i];
      stack.push({ title: titleOf(n), back: "메모", full: true, className: "nt-page" }, function (body, scr) {
        var d = ui.parseTime(n.time);
        body.innerHTML =
          '<div class="nt-paper">' +
            '<div class="nt-date"><span>' + (d.getMonth() + 1) + "월 " + d.getDate() + "일</span><span>" + ui.timeText(d) + "</span></div>" +
            '<textarea class="nt-text" id="note-' + i + '" aria-label="메모 내용" maxlength="2000"></textarea>' +
          "</div>" +
          '<div class="nt-bar"><button type="button" class="nt-del" aria-label="메모 삭제">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8v2h5v2H3V5h5zM5 8h14l-1.2 13H6.2z"/></svg></button></div>';
        var area = body.querySelector(".nt-text");
        area.value = n.text;
        ui.attachKeyboard(body, area, {});
        area.addEventListener("input", function () {
          n.text = area.value;
          n.time = YUSHI.now();
          scr.querySelector("h1").textContent = titleOf(n);
        });
        body.querySelector(".nt-del").addEventListener("click", function () {
          D.notes.splice(D.notes.indexOf(n), 1);
          stack.pop();
        });
      });
    }

    stack.reset({
      title: "메모", full: true, className: "nt-list",
      right: { label: "새 메모", icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 4h2.8v6.6H20v2.8h-6.6V20h-2.8v-6.6H4v-2.8h6.6z"/></svg>',
               onClick: function () { D.notes.push({ time: YUSHI.now(), text: "" }); openNote(D.notes.length - 1); } },
      onShow: function () {
        // 빈 메모는 저장하지 않음
        D.notes = D.notes.filter(function (n) { return n.text.trim(); });
        drawList();
      }
    }, function (body) {
      listBody = body;
      drawList();
      body.addEventListener("click", function (e) {
        var r = e.target.closest("[data-note]");
        if (r) openNote(+r.getAttribute("data-note"));
      });
    });
  };

  /* =========================================================
   * 미리 알림
   * ========================================================= */
  YUSHI.appScreens.reminders = function mount(appEl) {
    var D = YUSHI.data.apps, esc = ui.esc;
    var st = stage(appEl, "app-rem");
    st.stack.reset({ title: "미리 알림", full: true, className: "rm" }, function (body) {
      body.innerHTML =
        '<div class="rm-paper"><div class="rm-list"></div>' +
          '<form class="rm-add" autocomplete="off"><span class="rm-plus">+</span>' +
          '<input type="text" class="rm-field" id="rm-new" placeholder="새로운 항목" aria-label="새로운 미리 알림" maxlength="80"></form>' +
        "</div>";
      var listEl = body.querySelector(".rm-list");
      var form = body.querySelector(".rm-add");
      var field = body.querySelector(".rm-field");
      function draw() {
        listEl.innerHTML = D.reminders.map(function (r, i) {
          return '<div class="rm-row' + (r.done ? " is-done" : "") + '">' +
            '<button type="button" class="rm-check" data-rm="' + i + '" role="checkbox" aria-checked="' + !!r.done + '" aria-label="완료 표시"></button>' +
            '<span class="rm-text">' + esc(r.text) + "</span></div>";
        }).join("");
      }
      function add() {
        var t = field.value.trim();
        if (!t) return;
        D.reminders.push({ text: t, done: false });
        field.value = "";
        draw();
      }
      ui.attachKeyboard(body, field, { onDone: add });
      draw();
      listEl.addEventListener("click", function (e) {
        var b = e.target.closest("[data-rm]");
        if (!b) return;
        var r = D.reminders[+b.getAttribute("data-rm")];
        r.done = !r.done;
        draw();
      });
      form.addEventListener("submit", function (e) { e.preventDefault(); add(); });
    });
  };

  /* =========================================================
   * 연락처 (전화 앱의 연락처와 같은 데이터)
   * ========================================================= */
  YUSHI.appScreens.contacts = function mount(appEl) {
    var P = YUSHI.data.phone, esc = ui.esc;
    var st = stage(appEl, "app-contacts");
    var stack = st.stack;

    function initialOf(name) {
      var n = name.charCodeAt(0) - 0xac00;
      if (n >= 0 && n < 11172) {
        var cho = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"[Math.floor(n / 588)];
        return { "ㄲ": "ㄱ", "ㄸ": "ㄷ", "ㅃ": "ㅂ", "ㅆ": "ㅅ", "ㅉ": "ㅈ" }[cho] || cho;
      }
      var ch = name.charAt(0).toUpperCase();
      return /[A-Z]/.test(ch) ? ch : "#";
    }

    function openCard(c) {
      stack.push({ title: "정보", back: "모든 연락처", full: true, className: "ph-card" }, function (body) {
        body.innerHTML =
          '<div class="card-head">' + ui.avatar(c, 64, "card-photo") + '<div class="card-name">' + esc(c.name) + "</div></div>" +
          '<div class="grp"><div class="grp-row"><span class="grp-label">휴대전화</span>' +
            (c.number ? '<span class="grp-value">' + esc(c.number) + "</span>" : '<span class="grp-value grp-empty">번호 없음</span>') +
          "</div></div>";
      });
    }

    st.stack.reset({ title: "모든 연락처", full: true }, function (body) {
      body.classList.add("list-plain");
      var sorted = P.contacts.slice().sort(function (a, b) {
        var ia = initialOf(a.name), ib = initialOf(b.name);
        if ((ia === "#") !== (ib === "#")) return ia === "#" ? 1 : -1;
        return a.name.localeCompare(b.name, "ko");
      });
      var html = "", cur = null;
      sorted.forEach(function (c) {
        var ini = initialOf(c.name);
        if (ini !== cur) { html += '<div class="list-head">' + esc(ini) + "</div>"; cur = ini; }
        html += '<button type="button" class="row" data-id="' + esc(c.id) + '"><span class="row-main"><span class="row-title">' + esc(c.name) + "</span></span></button>";
      });
      body.innerHTML = html + '<p class="ph-count">연락처 ' + P.contacts.length + "개</p>";
      body.addEventListener("click", function (e) {
        var r = e.target.closest("[data-id]");
        if (!r) return;
        var id = r.getAttribute("data-id");
        openCard(P.contacts.filter(function (c) { return c.id === id; })[0]);
      });
    });
  };
})();
