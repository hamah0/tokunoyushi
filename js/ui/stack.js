/*
 * 앱 공통 도구
 * -----------------------------------------
 * createStack : 앱 안에서 화면을 쌓고(push) 뒤로 가는(pop) 기능
 *               iOS 6처럼 새 화면이 오른쪽에서 밀려 들어옵니다.
 * createTabs  : 아래쪽 검은 탭 막대
 * avatar, esc, timeText, relTime : 여러 앱에서 쓰는 작은 도우미
 */
window.YUSHI = window.YUSHI || {};
YUSHI.ui = YUSHI.ui || {};

(function () {
  var ui = YUSHI.ui;

  /* ---------- 글자 안전 처리 ---------- */
  ui.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  /* ---------- 시간 ---------- */
  // "2013-04-04 20:12" → Date
  ui.parseTime = function (s) {
    if (s instanceof Date) return s;
    var m = /^(\d{4})-(\d{2})-(\d{2})(?: (\d{1,2}):(\d{2}))?$/.exec(s || "");
    if (!m) return new Date(NaN);
    return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
  };

  // "오후 8:12"
  ui.timeText = function (d) {
    d = ui.parseTime(d);
    var h = d.getHours(), mm = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    return (h < 12 ? "오전 " : "오후 ") + (h % 12 || 12) + ":" + mm;
  };

  var DAYS = ["일", "월", "화", "수", "목", "금", "토"];
  ui.dateText = function (d) {
    d = ui.parseTime(d);
    return d.getFullYear() + "년 " + (d.getMonth() + 1) + "월 " + d.getDate() + "일 " + DAYS[d.getDay()] + "요일";
  };

  ui.sameDay = function (a, b) {
    a = ui.parseTime(a); b = ui.parseTime(b);
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  // 채팅 목록용: 오늘이면 시각, 어제면 '어제', 그 전이면 날짜
  ui.listTime = function (d) {
    d = ui.parseTime(d);
    var now = YUSHI.now();
    if (ui.sameDay(d, now)) return ui.timeText(d);
    var y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    if (ui.sameDay(d, y)) return "어제";
    return (d.getMonth() + 1) + "월 " + d.getDate() + "일";
  };

  // 게시물용: '방금', 'n분 전', 'n시간 전', 'M월 D일'
  ui.relTime = function (d) {
    d = ui.parseTime(d);
    var min = Math.floor((YUSHI.now() - d) / 60000);
    if (min < 1) return "방금";
    if (min < 60) return min + "분 전";
    if (min < 60 * 24) return Math.floor(min / 60) + "시간 전";
    var y = d.getFullYear() !== YUSHI.now().getFullYear() ? d.getFullYear() + "년 " : "";   // 지난해는 연도까지
    return y + (d.getMonth() + 1) + "월 " + d.getDate() + "일";
  };

  /* ---------- 프로필 사진 ---------- */
  // photo가 있으면 이미지, 없으면 색 바탕의 기본 실루엣
  // Talk · Talk Story 기본 프로필: 사진이 없으면 흰 바탕에 연회색 사람 모양
  ui.plainAvatar = function (person, size, extraClass) {
    if (person && person.photo) return ui.avatar(person, size, extraClass);
    return '<span class="avatar talk-default' + (extraClass ? " " + extraClass : "") + '" style="width:' + size + "px;height:" + size + 'px">' +
      '<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="15.5" rx="6.6" ry="8.6" fill="#e3e4e6"/>' +
      '<path d="M14.6 22.5c-1 2.3-1.6 4-1.6 5.2C8 28.8 5.2 31.2 4.6 34.5V40h30.8v-5.5c-.6-3.3-3.4-5.7-8.4-6.8 0-1.2-.6-2.9-1.6-5.2a7 7 0 0 1-10.8 0z" fill="#e3e4e6"/></svg></span>';
  };

  ui.avatar = function (person, size, extraClass) {
    var cls = "avatar" + (extraClass ? " " + extraClass : "");
    var st = "width:" + size + "px;height:" + size + "px;";
    if (person && person.photo) {
      return '<span class="' + cls + '" style="' + st + '"><img src="' + ui.esc(person.photo) + '" alt=""></span>';
    }
    return (
      '<span class="' + cls + '" style="' + st + "background:" + ((person && person.color) || "#aab4c0") + '">' +
      '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15" r="7.5" fill="rgba(255,255,255,.85)"/>' +
      '<path d="M5 40c1.5-9 7.5-13.5 15-13.5S33.5 31 35 40z" fill="rgba(255,255,255,.85)"/></svg></span>'
    );
  };

  /* ---------- 화면 쌓기 ---------- */
  /*
   * var stack = ui.createStack(hostElement);
   * stack.push({ title, back, right, full, className, onShow }, function (body, screen) { ... });
   *   back  : 뒤로 버튼에 쓸 글자 (없으면 버튼 없음)
   *   backIcon : true면 뒤로 버튼을 화살표 그림으로
   *   right : { label, onClick, icon(선택: svg 문자열) } 오른쪽 버튼
   *   full  : true면 탭 막대를 덮는 전체 화면 (대화방 등)
   *   onShow: 이 화면이 다시 맨 위로 올 때 실행 (목록 새로고침 등)
   */
  ui.createStack = function (host) {
    var screens = [];
    var busy = false;

    function build(opts, fill) {
      var s = document.createElement("div");
      // noNav: true면 위쪽 제목 막대 없이 화면 전체를 씀 (전화 키패드, 통화 화면)
      s.className = "scr" + (opts.full ? " scr-full" : "") + (opts.noNav ? " scr-nonav" : "") +
        (opts.className ? " " + opts.className : "");
      s.innerHTML = '<header class="navbar"><h1></h1></header><div class="scr-body"></div>';
      var bar = s.firstChild;
      bar.querySelector("h1").textContent = opts.title || "";

      if (opts.back) {
        var b = document.createElement("button");
        b.type = "button";
        if (opts.backIcon) {
          // 글자 대신 화살표 그림 버튼 (대화방 등)
          b.className = "nav-icon-btn nav-icon-left";
          b.setAttribute("aria-label", opts.back + "(으)로 돌아가기");
          b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12l8-7.5V9h10v6H11v4.5z"/></svg>';
        } else {
          b.className = "nav-back";
          b.textContent = opts.back;
        }
        b.addEventListener("click", function () { api.pop(); });
        bar.appendChild(b);
      }
      if (opts.right) {
        var r = document.createElement("button");
        r.type = "button";
        if (opts.right.icon) {
          r.className = "nav-icon-btn nav-icon-right";
          r.setAttribute("aria-label", opts.right.label);
          r.innerHTML = opts.right.icon;
        } else {
          r.className = "nav-btn";
          r.textContent = opts.right.label;
        }
        r.addEventListener("click", opts.right.onClick);
        bar.appendChild(r);
      }
      s._onShow = opts.onShow || null;
      fill(s.querySelector(".scr-body"), s);
      return s;
    }

    function syncDepth() {
      host.classList.toggle("is-deep", screens.length > 1);
    }

    var api = {
      // 맨 아래 화면을 바꿈 (탭 전환용, 애니메이션 없음)
      reset: function (opts, fill) {
        screens.forEach(function (s) { s.remove(); });
        screens = [build(opts, fill)];
        host.appendChild(screens[0]);
        syncDepth();
        return screens[0];
      },

      push: function (opts, fill) {
        if (busy) return null;
        var prev = screens[screens.length - 1];
        var next = build(opts, fill);
        next.classList.add("is-right");
        host.appendChild(next);
        screens.push(next);
        syncDepth();
        busy = true;
        next.offsetWidth; // 시작 위치를 먼저 그림
        next.classList.remove("is-right");
        if (prev) prev.classList.add("is-left");
        setTimeout(function () { busy = false; }, 320);
        return next;
      },

      pop: function () {
        if (busy || screens.length < 2) return;
        var top = screens.pop();
        var prev = screens[screens.length - 1];
        busy = true;
        top.classList.add("is-right");
        prev.classList.remove("is-left");
        if (prev._onShow) prev._onShow();
        setTimeout(function () {
          top.remove();
          syncDepth();
          busy = false;
        }, 320);
      },

      depth: function () { return screens.length; }
    };
    return api;
  };

  /* ---------- 탭 막대 ---------- */
  /*
   * ui.createTabs(host, [{ id, label, icon(svg 문자열) }], function (id) { ... })
   */
  ui.createTabs = function (host, tabs, onSelect) {
    var bar = document.createElement("nav");
    bar.className = "tabbar";
    tabs.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tab";
      b.setAttribute("data-tab", t.id);
      b.innerHTML = '<span class="tab-icon">' + t.icon + '<span class="badge tab-badge" hidden></span></span><span class="tab-label">' + ui.esc(t.label) + "</span>";
      b.addEventListener("click", function () { select(t.id); });
      bar.appendChild(b);
    });
    host.appendChild(bar);

    function select(id) {
      var btns = bar.querySelectorAll(".tab");
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle("is-on", btns[i].getAttribute("data-tab") === id);
      }
      onSelect(id);
    }
    // 탭 아이콘 위 빨간 숫자 (0이면 숨김)
    function setBadge(id, n) {
      var el = bar.querySelector('[data-tab="' + id + '"] .tab-badge');
      if (!el) return;
      el.hidden = !n;
      el.textContent = n > 99 ? "99+" : String(n || "");
    }
    return { select: select, setBadge: setBadge };
  };

  /* ---------- 탭 아이콘 (단색 SVG) ---------- */
  function ti(path) {
    return '<svg viewBox="0 0 30 30" aria-hidden="true">' + path + "</svg>";
  }
  ui.tabIcons = {
    person: ti('<circle cx="15" cy="10" r="5.5"/><path d="M4.5 27c1-6.5 5.2-10 10.5-10s9.5 3.5 10.5 10z"/>'),
    people: ti('<circle cx="11" cy="10" r="4.6"/><path d="M2 25c.8-5.4 4.4-8.4 9-8.4s8.2 3 9 8.4z"/><circle cx="21" cy="9" r="3.8" opacity=".75"/><path d="M19.5 15.2c4.2-.3 7.6 2.3 8.5 7.8h-6.2c-.4-3-1.1-5.4-2.3-7.8z" opacity=".75"/>'),
    chat: ti('<path d="M15 4.5c6.6 0 12 4 12 9s-5.4 9-12 9c-1.4 0-2.7-.2-4-.5L5 25l1.6-5C4.4 18.4 3 16 3 13.5c0-5 5.4-9 12-9z"/>'),
    feed: ti('<rect x="4" y="4" width="22" height="7" rx="1.5"/><rect x="4" y="13" width="22" height="13" rx="1.5"/>'),
    book: ti('<path d="M4 6c4-1.5 8-1.2 10.2 1V26C12 24 8 23.6 4 25zM26 6c-4-1.5-8-1.2-10.2 1V26c2.2-2 6.2-2.4 10.2-1z"/>'),
    more: ti('<circle cx="7" cy="15" r="2.6"/><circle cx="15" cy="15" r="2.6"/><circle cx="23" cy="15" r="2.6"/>')
  };
})();
