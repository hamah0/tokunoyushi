/*
 * 사진 · 음악 · Mail · 인터넷 · 지도 · 날씨 · 설정 앱
 * -----------------------------------------
 * 모두 이야기 속 휴대폰 안에서만 동작합니다 (실제 인터넷·지도·메일에 연결하지 않음).
 * 데이터: js/data/apps-data.js
 */
window.YUSHI = window.YUSHI || {};
YUSHI.appScreens = YUSHI.appScreens || {};

(function () {
  var ui = YUSHI.ui;
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function stage(appEl, cls) {
    appEl.classList.add(cls);
    var host = document.createElement("div");
    host.className = "app-stage";
    appEl.appendChild(host);
    return { host: host, stack: ui.createStack(host) };
  }
  function cameraShots() { return (YUSHI.session && YUSHI.session.cameraShots) || []; }

  /* =========================================================
   * 사진
   * ========================================================= */
  var VID_ICON = '<svg viewBox="0 0 20 12" aria-hidden="true"><rect x="0" y="1" width="12" height="10" rx="1.5" fill="#fff"/><path d="M13 6l6-4v8z" fill="#fff"/></svg>';

  YUSHI.appScreens.photos = function mount(appEl) {
    var D = YUSHI.data.apps, esc = ui.esc;
    var st = stage(appEl, "app-photos");
    var stack = st.stack;
    // 카메라 롤 항목: { src, video?, poster?, duration? } (찍은 사진은 문자열 주소)
    function all() {
      return cameraShots().map(function (u) { return { src: u }; }).concat(D.photos);
    }
    function thumbOf(it) { return it.video ? it.poster : it.src; }
    function durText(sec) { sec = Math.floor(sec || 0); return Math.floor(sec / 60) + ":" + (sec % 60 < 10 ? "0" : "") + (sec % 60); }

    function openViewer(i) {
      var list = all();
      stack.push({ title: (i + 1) + " / " + list.length, back: "카메라 롤", full: true, className: "ph-viewer" }, function (body, scr) {
        function show() {
          scr.querySelector("h1").textContent = (i + 1) + " / " + list.length;
          var it = list[i];
          body.innerHTML =
            (it.video
              ? '<video class="pv-img" src="' + esc(it.video) + '" poster="' + esc(it.poster || "") + '" controls playsinline preload="metadata"></video>'
              : '<img class="pv-img" src="' + esc(it.src) + '" alt="사진 ' + (i + 1) + '">') +
            '<div class="pv-bar"><button type="button" data-d="-1" aria-label="이전 사진"' + (i ? "" : " disabled") + '>◀</button>' +
            '<button type="button" data-d="1" aria-label="다음 사진"' + (i < list.length - 1 ? "" : " disabled") + ">▶</button></div>";
        }
        show();
        body.addEventListener("click", function (e) {
          var b = e.target.closest("[data-d]");
          if (b) { i = Math.max(0, Math.min(list.length - 1, i + Number(b.getAttribute("data-d")))); show(); }
        });
      });
    }

    function openRoll() {
      stack.push({ title: "카메라 롤", back: "앨범", full: true, className: "ph-roll" }, function (body) {
        var list = all();
        body.innerHTML = list.length
          ? '<div class="pr-grid">' + list.map(function (src, i) {
              var it = src;
              return '<button type="button" class="pr-thumb' + (it.video ? " is-video" : "") + '" data-i="' + i + '" style="background-image:url(&quot;' + esc(thumbOf(it)) + '&quot;)" aria-label="' + (it.video ? "비디오 " : "사진 ") + (i + 1) + '">' +
                (it.video ? '<span class="pr-vid">' + VID_ICON + "<span>" + durText(it.duration) + "</span></span>" : "") + "</button>";
            }).join("") + '</div><p class="pr-count">' + (function () {
              var v = list.filter(function (x) { return x.video; }).length;
              return "사진 " + (list.length - v) + "장" + (v ? ", 비디오 " + v + "개" : "");
            })() + "</p>"
          : '<p class="list-empty">사진 없음<br><small>카메라 앱으로 찍은 사진이 여기에 보입니다.</small></p>';
        body.addEventListener("click", function (e) {
          var t = e.target.closest("[data-i]");
          if (t) openViewer(+t.getAttribute("data-i"));
        });
      });
    }

    stack.reset({ title: "앨범", full: true }, function (body) {
      body.classList.add("list-plain");
      var list = all();
      body.innerHTML =
        '<button type="button" class="row al-album" data-open="roll">' +
          '<span class="al-cover"' + (list[0] ? ' style="background-image:url(&quot;' + esc(thumbOf(list[0])) + '&quot;)"' : "") + "></span>" +
          '<span class="row-main"><span class="row-title">카메라 롤</span><span class="row-sub">' + list.length + "</span></span>" +
          '<span class="row-time">›</span></button>';
      body.addEventListener("click", function (e) { if (e.target.closest("[data-open]")) openRoll(); });
    });
  };

  /* =========================================================
   * 음악
   * ========================================================= */
  YUSHI.appScreens.music = function mount(appEl) {
    var D = YUSHI.data.apps, esc = ui.esc;
    var st = stage(appEl, "app-music");
    var stack = st.stack;
    var audio = null;

    function stop() { if (audio) { audio.pause(); audio = null; } }

    // 음원 파일이 없는 곡: 소리 없이 진짜 재생처럼 시간이 흐르는 가짜 플레이어 (Audio와 같은 사용법)
    function SilentTrack(duration) {
      var self = this, timer = null, last = 0, handlers = {};
      this.duration = duration || 180;
      this.currentTime = 0;
      this.paused = true;
      function emit(t) { (handlers[t] || []).forEach(function (f) { f(); }); }
      function tick() {
        var now = Date.now();
        self.currentTime = Math.min(self.duration, self.currentTime + (now - last) / 1000);
        last = now;
        emit("timeupdate");
        if (self.currentTime >= self.duration) { self.pause(); emit("ended"); }
      }
      this.addEventListener = function (t, f) { (handlers[t] = handlers[t] || []).push(f); };
      this.play = function () {
        if (!self.paused) return Promise.resolve();
        if (self.currentTime >= self.duration) self.currentTime = 0;
        self.paused = false; last = Date.now();
        timer = setInterval(tick, 250);
        emit("play");
        return Promise.resolve();
      };
      this.pause = function () {
        if (self.paused) return;
        self.paused = true; clearInterval(timer);
        emit("pause");
      };
    }

    function mmss(sec) { sec = Math.round(sec || 0); return Math.floor(sec / 60) + ":" + pad2(sec % 60); }

    // order: 재생할 곡 번호 목록 (재생목록이면 그 순서), pos: 그중 몇 번째
    function openPlayer(pos, order, backLabel) {
      order = order || D.music.map(function (_, k) { return k; });
      var i = pos;
      var songs = order.map(function (k) { return D.music[k]; });
      stack.push({ title: "지금 재생 중", back: backLabel || "노래", full: true, className: "mu-player" }, function (body) {
        function load() {
          stop();
          var s = songs[i];
          body.innerHTML =
            '<div class="mu-info"><span class="mu-artist">' + esc(s.artist || "") + '</span><span class="mu-title">' + esc(s.title) + '</span><span class="mu-album">' + esc(s.album || "") + "</span></div>" +
            (s.art
              ? '<div class="mu-art has-art"><img src="' + esc(s.art) + '" alt="앨범 커버"></div>'
              : '<div class="mu-art" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 4l11-2v13.5a3 3 0 1 1-2-2.8V6.3l-7 1.3v10a3 3 0 1 1-2-2.8z"/></svg></div>') +
            '<div class="mu-ctrl">' +
              '<div class="vm-scrub"><span class="mu-cur">0:00</span><input type="range" class="vm-range" id="mu-range" min="0" max="1000" value="0" aria-label="재생 위치"><span class="mu-left">-' + mmss(s.duration) + "</span></div>" +
              '<div class="mu-btns">' +
                '<button type="button" data-m="prev" aria-label="이전 곡"' + (i ? "" : " disabled") + '><svg viewBox="0 0 24 24"><path d="M5 5h2.5v14H5zM20 5v14L8.5 12z"/></svg></button>' +
                '<button type="button" data-m="play" class="mu-play" aria-label="재생"><svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg></button>' +
                '<button type="button" data-m="next" aria-label="다음 곡"' + (i < songs.length - 1 ? "" : " disabled") + '><svg viewBox="0 0 24 24"><path d="M16.5 5H19v14h-2.5zM4 5v14l11.5-7z"/></svg></button>' +
              "</div>" +
            "</div>";
          {
            audio = s.audio ? new Audio(s.audio) : new SilentTrack(s.duration);
            var range = body.querySelector(".vm-range");
            audio.addEventListener("timeupdate", function () {
              if (!isFinite(audio.duration)) return;
              var p = Math.round(audio.currentTime / audio.duration * 1000);
              range.value = p; range.style.setProperty("--p", p / 10 + "%");
              body.querySelector(".mu-cur").textContent = Math.floor(audio.currentTime / 60) + ":" + pad2(Math.floor(audio.currentTime % 60));
              var left = audio.duration - audio.currentTime;
              body.querySelector(".mu-left").textContent = "-" + Math.floor(left / 60) + ":" + pad2(Math.floor(left % 60));
            });
            audio.addEventListener("play", setIcon);
            audio.addEventListener("pause", setIcon);
            // 곡이 끝나면 다음 곡으로 (마지막 곡이면 멈춤)
            audio.addEventListener("ended", function () { if (i < songs.length - 1) { i++; load(); } else setIcon(); });
            range.addEventListener("change", function () {
              if (audio && isFinite(audio.duration)) audio.currentTime = range.value / 1000 * audio.duration;
            });
            audio.play().catch(function () {});
          }
        }
        function setIcon() {
          var b = body.querySelector(".mu-play");
          var playing = audio && !audio.paused;
          b.innerHTML = playing ? '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>';
          b.setAttribute("aria-label", playing ? "일시 정지" : "재생");
        }
        load();
        body.addEventListener("click", function (e) {
          var b = e.target.closest("[data-m]");
          if (!b) return;
          var m = b.getAttribute("data-m");
          if (m === "play" && audio) { if (audio.paused) audio.play().catch(function () {}); else audio.pause(); }
          else if (m === "prev") { i--; load(); }
          else if (m === "next") { i++; load(); }
        });
      });
    }

    function songList(groupBy) {
      return function () {
        stack.reset({ title: { songs: "노래", artists: "아티스트", albums: "앨범" }[groupBy], full: false }, function (body) {
          body.classList.add("list-plain");
          if (!D.music.length) { body.innerHTML = '<p class="list-empty">노래 없음</p>'; return; }
          var html = "";
          if (groupBy === "songs") {
            html = D.music.map(function (s, i) {
              return '<button type="button" class="row" data-song="' + i + '"><span class="row-main"><span class="row-title">' + esc(s.title) +
                '</span><span class="row-sub">' + esc(s.artist || "") + "</span></span>" +
                (s.duration ? '<span class="row-time mu-dur">' + mmss(s.duration) + "</span>" : "") + "</button>";
            }).join("");
          } else {
            var groups = {};
            D.music.forEach(function (s, i) {
              var g = groupBy === "artists" ? (s.artistGroup || s.artist || "알 수 없음") : (s.album || "알 수 없는 앨범");
              (groups[g] = groups[g] || []).push(i);
            });
            Object.keys(groups).forEach(function (g) {
              html += '<div class="list-head">' + esc(g) + "</div>" + groups[g].map(function (i) {
                return '<button type="button" class="row" data-song="' + i + '"><span class="row-main"><span class="row-title">' + esc(D.music[i].title) + "</span></span></button>";
              }).join("");
            });
          }
          body.innerHTML = html;
          body.addEventListener("click", function (e) {
            var r = e.target.closest("[data-song]");
            if (r) openPlayer(+r.getAttribute("data-song"));
          });
        });
      };
    }

    function svgTab(p) { return '<svg viewBox="0 0 30 30" aria-hidden="true">' + p + "</svg>"; }
    // 재생목록
    function showPlaylists() {
      var lists = D.playlists || [];
      stack.reset({ title: "재생목록", full: false }, function (body) {
        body.classList.add("list-plain");
        body.innerHTML = lists.length ? lists.map(function (pl, i) {
          return '<button type="button" class="row" data-pl="' + i + '"><span class="row-main"><span class="row-title">' + esc(pl.name) + "</span></span>" +
            '<span class="row-time">' + pl.songs.length + "곡 ›</span></button>";
        }).join("") : '<p class="list-empty">재생목록 없음</p>';
        body.addEventListener("click", function (e) {
          var r = e.target.closest("[data-pl]");
          if (r) openPlaylist(lists[+r.getAttribute("data-pl")]);
        });
      });
    }
    function openPlaylist(pl) {
      stack.push({ title: pl.name, back: "재생목록", full: false }, function (body) {
        body.classList.add("list-plain");
        var total = 0;
        pl.songs.forEach(function (k) { total += (D.music[k] && D.music[k].duration) || 0; });
        body.innerHTML = '<div class="mu-pl-head">' + pl.songs.length + "곡, " + Math.round(total / 60) + "분</div>" +
          pl.songs.map(function (k, pos) {
            var s = D.music[k];
            return '<button type="button" class="row" data-pos="' + pos + '"><span class="row-main"><span class="row-title">' + esc(s.title) +
              '</span><span class="row-sub">' + esc(s.artist || "") + "</span></span>" +
              '<span class="row-time mu-dur">' + mmss(s.duration) + "</span></button>";
          }).join("");
        body.addEventListener("click", function (e) {
          var r = e.target.closest("[data-pos]");
          if (r) openPlayer(+r.getAttribute("data-pos"), pl.songs, pl.name);
        });
      });
    }

    var tabs = ui.createTabs(st.host, [
      { id: "playlists", label: "재생목록", icon: svgTab('<rect x="3" y="5" width="17" height="3" rx="1"/><rect x="3" y="11.5" width="17" height="3" rx="1"/><rect x="3" y="18" width="10" height="3" rx="1"/><path d="M17 16.5v8l8-4z"/>') },
      { id: "artists", label: "아티스트", icon: svgTab('<circle cx="15" cy="10" r="5.5"/><path d="M4.5 27c1-6.5 5.2-10 10.5-10s9.5 3.5 10.5 10z"/>') },
      { id: "songs",   label: "노래",     icon: svgTab('<path d="M11 6l13-3v16a3.5 3 0 1 1-2.5-2.9V8.4L13.5 10.3v12.2a3.5 3 0 1 1-2.5-2.9z"/>') },
      { id: "albums",  label: "앨범",     icon: svgTab('<path fill-rule="evenodd" d="M15 3a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>') }
    ], function (id) { if (id === "playlists") showPlaylists(); else songList(id)(); });
    tabs.select((D.playlists || []).length ? "playlists" : "songs");

    return stop;
  };

  /* =========================================================
   * Mail
   * ========================================================= */
  YUSHI.appScreens.mail = function mount(appEl) {
    var D = YUSHI.data.apps, esc = ui.esc;
    var st = stage(appEl, "app-mail");
    var stack = st.stack;

    function subj(m) { return m.subject ? m.subject : "(제목 없음)"; }
    function who(m) { return m.to ? m.to : m.from; }

    function openMessage(m, boxName) {
      m.unread = false;
      stack.push({ title: "", back: boxName || "받은 편지함", full: true, className: "ml-msg" }, function (body) {
        body.innerHTML =
          '<div class="ml-head">' +
            (m.to
              ? '<div><span class="ml-k">받는 사람:</span> <span class="ml-from">' + esc(m.to) + "</span>" +
                  (m.toAddr ? ' <span class="ml-addr">&lt;' + esc(m.toAddr) + "&gt;</span>" : "") + "</div>"
              : '<div><span class="ml-k">보낸 사람:</span> <span class="ml-from">' + esc(m.from) + "</span>" +
                  (m.fromAddr ? ' <span class="ml-addr">&lt;' + esc(m.fromAddr) + "&gt;</span>" : "") + "</div>") +
            '<div class="ml-subject">' + esc(subj(m)) + "</div>" +
            '<div class="ml-date">' + ui.dateText(m.time) + " " + ui.timeText(m.time) + "</div>" +
          "</div>" +
          '<div class="ml-body">' + esc(m.body || "") + "</div>";
      });
    }

    function openBox(name, list) {
      stack.push({ title: name, back: "메일상자", full: true, className: "ml-box", onShow: function () { draw(); } }, function (body) {
        body.classList.add("list-plain");
        draw = function () {
          var sorted = list.slice().sort(function (a, b) { return ui.parseTime(b.time) - ui.parseTime(a.time); });
          body.innerHTML = sorted.length
            ? sorted.map(function (m) {
                return '<button type="button" class="sms-row" data-mail="' + list.indexOf(m) + '">' +
                  '<span class="sms-dot' + (m.unread ? " is-on" : "") + '"></span>' +
                  '<span class="sms-main"><span class="sms-top"><span class="sms-name">' + esc(who(m)) + "</span>" +
                  '<span class="sms-time">' + ui.listTime(m.time) + "</span></span>" +
                  '<span class="ml-subj">' + esc(subj(m)) + "</span>" +
                  '<span class="sms-preview">' + esc((m.body || "").replace(/\n/g, " ")) + "</span></span></button>";
              }).join("")
            : '<p class="list-empty">메일 없음</p>';
        };
        draw();
        body.addEventListener("click", function (e) {
          var r = e.target.closest("[data-mail]");
          if (r) openMessage(list[+r.getAttribute("data-mail")], name);
        });
      });
    }
    var draw = function () {};

    var drawRoot = function () {};
    stack.reset({ title: "메일상자", full: true, className: "ml-root", onShow: function () { drawRoot(); } }, function (body) {
      body.classList.add("pin");
      drawRoot = function () {
        var unread = D.mail.filter(function (m) { return m.unread; }).length;
        body.innerHTML =
          '<div class="grp">' +
            '<button type="button" class="grp-row" data-box="inbox"><span class="st-label">받은 편지함</span>' +
              (unread ? '<span class="ml-count">' + unread + "</span>" : "") + '<span class="st-chev">›</span></button>' +
            '<button type="button" class="grp-row" data-box="sent"><span class="st-label">보낸 편지함</span><span class="st-chev">›</span></button>' +
            '<button type="button" class="grp-row" data-box="trash"><span class="st-label">휴지통</span><span class="st-chev">›</span></button>' +
          "</div>";
      };
      drawRoot();
      body.addEventListener("click", function (e) {
        var b = e.target.closest("[data-box]");
        if (!b) return;
        var k = b.getAttribute("data-box");
        if (k === "inbox") openBox("받은 편지함", D.mail);
        else if (k === "sent") openBox("보낸 편지함", D.mailSent || []);
        else openBox("휴지통", []);
      });
    });
  };

  /* =========================================================
   * 인터넷 (Safari)
   * ========================================================= */
  function norm(u) {
    return String(u || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
  }

  YUSHI.appScreens.web = function mount(appEl) {
    var D = YUSHI.data.apps, esc = ui.esc;
    YUSHI.session = YUSHI.session || {};
    // 검색 기록·방문 기록 (데이터 파일 값으로 시작, 이 페이지를 연 동안 새로 쌓임)
    // 검색 기록: { q, time } (예전처럼 글자만 적어도 됨)
    var recents = YUSHI.session.webSearches = YUSHI.session.webSearches ||
      (D.webSearches || []).map(function (x) { return typeof x === "string" ? { q: x, time: null } : { q: x.q, time: x.time }; });
    var visits = YUSHI.session.webHistory = YUSHI.session.webHistory || (D.webHistory || []).slice();
    var DAYS = ["일", "월", "화", "수", "목", "금", "토"];
    var MAG = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12.5 12.5l4.5 4.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

    appEl.classList.add("app-web");
    var root = document.createElement("div");
    root.className = "web";
    root.innerHTML =
      '<div class="web-top">' +
        '<div class="web-title"></div>' +
        '<div class="web-fields">' +
          '<form class="web-addr" autocomplete="off"><input type="text" class="web-url" id="web-url" aria-label="주소" placeholder="주소 입력">' +
          '<button type="submit" class="web-go" aria-label="이동"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4a6 6 0 1 0 6 6h-2a4 4 0 1 1-4-4v2.5L14 5 10 1.5z"/></svg></button></form>' +
          '<form class="web-search" autocomplete="off">' + MAG + '<input type="text" class="web-q" id="web-q" aria-label="검색" placeholder="Google"></form>' +
        "</div>" +
      "</div>" +
      '<div class="web-page"></div>' +
      '<div class="web-recent" hidden></div>' +
      '<div class="web-bar">' +
        '<button type="button" data-w="back" aria-label="뒤로"><svg viewBox="0 0 24 24"><path d="M16 4L7 12l9 8z"/></svg></button>' +
        '<button type="button" data-w="fwd" aria-label="앞으로"><svg viewBox="0 0 24 24"><path d="M8 4l9 8-9 8z"/></svg></button>' +
        '<button type="button" disabled aria-label="공유"><svg viewBox="0 0 24 24"><path d="M5 10h3v9h8v-9h3v12H5z"/><path d="M12 2l5 5h-3.5v8h-3V7H7z"/></svg></button>' +
        '<button type="button" data-w="books" aria-label="북마크"><svg viewBox="0 0 24 24"><path d="M3 5c3-1.3 6-1 8.3.8V21C9 19.4 6 19 3 20zM21 5c-3-1.3-6-1-8.3.8V21c2.3-1.6 5.3-2 8.3-1z"/></svg></button>' +
        '<button type="button" disabled aria-label="페이지"><svg viewBox="0 0 24 24"><path d="M6 6h12v14H6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 3h12v14" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>' +
      "</div>";
    appEl.appendChild(root);

    var page = root.querySelector(".web-page");
    var urlField = root.querySelector(".web-url");
    var qField = root.querySelector(".web-q");
    var recentEl = root.querySelector(".web-recent");
    var titleEl = root.querySelector(".web-title");
    var hist = [], pos = -1;

    function searchUrl(q) { return "www.google.co.kr/search?q=" + q; }

    // 날짜 묶음 이름: 오늘 / 어제 / 4월 2일 화요일
    function dayLabel(t) {
      var d = ui.parseTime(t), now = YUSHI.now();
      if (ui.sameDay(d, now)) return "오늘";
      if (ui.sameDay(d, new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))) return "어제";
      return (d.getMonth() + 1) + "월 " + d.getDate() + "일 " + DAYS[d.getDay()] + "요일";
    }

    function bookmarksHTML() {
      return '<div class="web-books"><h2>북마크</h2>' +
        '<a href="about:history" class="web-book web-folder"><span class="web-folder-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 5.5V10l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
          "</span><b>방문 기록</b><span class=\"web-chev\">›</span></a>" +
        // 북마크: 눌린 표시만 되고 이동하지 않음
        (D.bookmarks || []).map(function (p) { return '<button type="button" class="web-book web-static"><b>' + esc(p.title) + "</b><span>" + esc(p.url) + "</span></button>"; }).join("") +
        // web에 적은 가상 페이지는 눌러서 열 수 있음
        D.web.map(function (p) { return '<a href="' + esc(p.url) + '" class="web-book"><b>' + esc(p.title) + "</b><span>" + esc(p.url) + "</span></a>"; }).join("") +
        "</div>";
    }

    function historyHTML() {
      if (!visits.length) return '<div class="web-books"><h2>방문 기록</h2><p class="list-empty">방문 기록 없음</p></div>';
      var sorted = visits.slice().sort(function (x, y) { return ui.parseTime(y.time) - ui.parseTime(x.time); });
      var html = '<div class="web-books"><h2>방문 기록<button type="button" class="web-clear" data-clear="history">지우기</button></h2>', cur = null;
      sorted.forEach(function (v) {
        var label = dayLabel(v.time);
        if (label !== cur) { html += '<div class="web-day">' + label + "</div>"; cur = label; }
        // 인터넷이 없는 휴대폰이므로, web에 적은 페이지가 아니면 눌러도 눌린 표시만 됩니다
        html += canOpen(v.url)
          ? '<a href="' + esc(v.url) + '" class="web-book"><b>' + esc(v.title) + "</b><span>" + esc(v.url) + "</span></a>"
          : '<button type="button" class="web-book web-static"><b>' + esc(v.title) + "</b><span>" + esc(v.url) + "</span></button>";
      });
      return html + "</div>";
    }

    function render(u) {
      if (u === "") {
        titleEl.textContent = "북마크";
        urlField.value = "";
        page.innerHTML = bookmarksHTML();
      } else if (u === "about:history") {
        titleEl.textContent = "방문 기록";
        urlField.value = "";
        page.innerHTML = historyHTML();
      } else {
        var p = D.web.filter(function (x) { return norm(x.url) === norm(u); })[0];
        urlField.value = p ? p.url : u;
        if (p) {
          titleEl.textContent = p.title;
          page.innerHTML = '<div class="web-doc">' + p.html + "</div>";   // 작가가 직접 쓴 페이지 내용
          visits.push({ time: YUSHI.now(), title: p.title, url: p.url });
        } else {
          titleEl.textContent = "페이지를 열 수 없음";
          page.innerHTML = '<div class="web-err"><h2>페이지를 열 수 없음</h2><p>인터넷에 연결되어 있지 않기 때문에 Safari에서 페이지를 열 수 없습니다.</p></div>';
        }
      }
      page.scrollTop = 0;
      root.querySelector('[data-w="back"]').disabled = pos <= 0;
      root.querySelector('[data-w="fwd"]').disabled = pos >= hist.length - 1;
    }
    function canOpen(u) {
      return u === "" || u === "about:history" || D.web.some(function (x) { return norm(x.url) === norm(u); });
    }
    function go(u) {
      if (!canOpen(u)) return;   // 열 수 없는 주소는 아무 화면도 띄우지 않음
      hist = hist.slice(0, pos + 1);
      hist.push(u);
      pos = hist.length - 1;
      render(u);
    }

    /* ---------- 검색칸: 누르면 '최근 검색' 목록 ---------- */
    function drawRecent() {
      var sorted = recents.slice().sort(function (x, y) {
        return (y.time ? ui.parseTime(y.time) : 0) - (x.time ? ui.parseTime(x.time) : 0);
      });
      var html = "", cur = null;
      sorted.forEach(function (r) {
        var label = r.time ? dayLabel(r.time) : "";
        if (label && label !== cur) { html += '<div class="web-day">' + label + "</div>"; cur = label; }
        html += '<button type="button" class="web-recent-row" data-q="' + esc(r.q) + '">' + MAG + "<span>" + esc(r.q) + "</span>" +
          (r.time ? '<small class="web-recent-time">' + ui.timeText(r.time) + "</small>" : "") + "</button>";
      });
      recentEl.innerHTML =
        '<div class="web-recent-head"><span>최근 검색</span>' +
          (recents.length ? '<button type="button" class="web-clear" data-clear="search">지우기</button>' : "") + "</div>" +
        (recents.length ? html : '<p class="web-recent-none">최근 검색 없음</p>');
    }
    function search(q) {
      q = q.trim();
      if (!q || !canOpen(searchUrl(q))) return;   // 검색 결과 페이지가 없으면 그대로 둠
      for (var i = recents.length - 1; i >= 0; i--) if (recents[i].q === q) recents.splice(i, 1);
      recents.push({ q: q, time: YUSHI.now() });
      qField.value = "";
      go(searchUrl(q));
    }
    var qKb = ui.attachKeyboard(root, qField, {
      returnLabel: "검색",
      onOpen: function () { root.classList.add("is-searching"); drawRecent(); recentEl.hidden = false; },
      onClose: function () { root.classList.remove("is-searching"); recentEl.hidden = true; },
      onDone: function (v) { search(v); }
    });
    recentEl.addEventListener("mousedown", function (e) { e.preventDefault(); });
    recentEl.addEventListener("click", function (e) {
      if (e.target.closest('[data-clear="search"]')) { recents.length = 0; drawRecent(); return; }
      var r = e.target.closest("[data-q]");
      if (r) { var q = r.getAttribute("data-q"); if (canOpen(searchUrl(q))) { qKb.close(); search(q); } }
    });
    root.querySelector(".web-search").addEventListener("submit", function (e) { e.preventDefault(); qKb.close(); search(qField.value); });

    ui.attachKeyboard(root, urlField, { returnLabel: "이동", onDone: function (v) { if (v.trim()) go(v.trim()); } });

    root.querySelector(".web-addr").addEventListener("submit", function (e) {
      e.preventDefault();
      if (urlField.value.trim()) go(urlField.value.trim());
    });
    page.addEventListener("click", function (e) {
      if (e.target.closest('[data-clear="history"]')) { visits.length = 0; render("about:history"); return; }
      var a = e.target.closest("a[href]");
      if (!a) return;
      e.preventDefault();
      go(a.getAttribute("href"));
    });
    root.querySelector(".web-bar").addEventListener("click", function (e) {
      var b = e.target.closest("[data-w]");
      if (!b) return;
      var w = b.getAttribute("data-w");
      if (w === "back" && pos > 0) { pos--; render(hist[pos]); }
      else if (w === "fwd" && pos < hist.length - 1) { pos++; render(hist[pos]); }
      else if (w === "books") go("");
    });
    go("");
  };

  /* =========================================================
   * 지도 (가상의 동네 지도, 끌어서 움직이기)
   * ========================================================= */
  function cityMap() {
    var W = 900, H = 900, s = "";
    s += '<rect width="' + W + '" height="' + H + '" fill="#ede9e0"/>';
    // 공원
    s += '<rect x="520" y="140" width="180" height="140" rx="8" fill="#c6e3a9"/><rect x="120" y="560" width="150" height="120" rx="8" fill="#c6e3a9"/>';
    // 건물 블록
    for (var bx = 0; bx < W; bx += 90) for (var by = 0; by < H; by += 90) {
      if ((bx * 7 + by * 3) % 5 === 0) continue;
      s += '<rect x="' + (bx + 14) + '" y="' + (by + 14) + '" width="62" height="62" rx="3" fill="#e2ddd2"/>';
    }
    // 강
    s += '<path d="M0 430 C150 380 300 470 450 420 S750 360 900 410 V500 C750 450 600 520 450 500 S150 470 0 520z" fill="#a6cbef"/>';
    // 작은 길
    for (var x = 0; x <= W; x += 90) s += '<path d="M' + x + ' 0V' + H + '" stroke="#fff" stroke-width="6"/>';
    for (var y = 0; y <= H; y += 90) s += '<path d="M0 ' + y + 'H' + W + '" stroke="#fff" stroke-width="6"/>';
    // 큰 길 (노란색)
    s += '<path d="M0 270H900M450 0V900" stroke="#d9b24a" stroke-width="16"/><path d="M0 270H900M450 0V900" stroke="#f7d977" stroke-width="12"/>';
    s += '<path d="M120 900L780 0" stroke="#d9b24a" stroke-width="14"/><path d="M120 900L780 0" stroke="#f7d977" stroke-width="10"/>';
    // 다리
    s += '<path d="M450 400V520" stroke="#b9b4a8" stroke-width="20"/><path d="M450 400V520" stroke="#f7d977" stroke-width="12"/>';
    return '<svg class="map-svg" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">' + s + "</svg>";
  }

  YUSHI.appScreens.maps = function mount(appEl) {
    appEl.classList.add("app-maps");
    var root = document.createElement("div");
    root.className = "maps";
    root.innerHTML =
      '<form class="map-top" autocomplete="off"><input type="text" class="map-search" id="map-search" placeholder="검색 또는 주소 입력" aria-label="지도 검색"></form>' +
      '<div class="map-view"><div class="map-pan">' + cityMap() + '<span class="map-me" hidden></span></div>' +
        '<div class="map-banner" hidden></div></div>' +
      '<div class="map-bar"><button type="button" class="map-loc" aria-label="현재 위치"><svg viewBox="0 0 24 24"><path d="M21 3L3 10.5l7.5 2.3L12.8 21z"/></svg></button>' +
        '<span class="map-hint">지도를 끌어서 움직일 수 있습니다</span></div>';
    appEl.appendChild(root);

    var view = root.querySelector(".map-view"), pan = root.querySelector(".map-pan");
    var me = root.querySelector(".map-me"), banner = root.querySelector(".map-banner");
    var x = -290, y = -230, drag = null;
    function place() {
      var maxX = 0, minX = view.clientWidth - 900, maxY = 0, minY = view.clientHeight - 900;
      x = Math.min(maxX, Math.max(minX, x));
      y = Math.min(maxY, Math.max(minY, y));
      pan.style.transform = "translate(" + x + "px," + y + "px)";
    }
    function scale() { return parseFloat(getComputedStyle(document.getElementById("holder")).getPropertyValue("--s")) || 1; }
    view.addEventListener("pointerdown", function (e) { drag = { px: e.clientX, py: e.clientY, x: x, y: y }; view.setPointerCapture(e.pointerId); });
    view.addEventListener("pointermove", function (e) {
      if (!drag) return;
      x = drag.x + (e.clientX - drag.px) / scale();
      y = drag.y + (e.clientY - drag.py) / scale();
      place();
    });
    view.addEventListener("pointerup", function () { drag = null; });
    view.addEventListener("pointercancel", function () { drag = null; });
    root.querySelector(".map-loc").addEventListener("click", function () {
      me.hidden = false;
      x = -(450 - view.clientWidth / 2); y = -(330 - view.clientHeight / 2);
      pan.classList.add("is-moving");
      place();
      setTimeout(function () { pan.classList.remove("is-moving"); }, 400);
    });
    var field = root.querySelector(".map-search");
    function search(v) {
      if (!v.trim()) return;
      banner.textContent = "'" + v.trim() + "'에 대한 결과 없음";
      banner.hidden = false;
      setTimeout(function () { banner.hidden = true; }, 2500);
    }
    ui.attachKeyboard(root, field, { returnLabel: "검색", onDone: search });
    root.querySelector(".map-top").addEventListener("submit", function (e) { e.preventDefault(); search(field.value); });
    requestAnimationFrame(place);
  };

  /* =========================================================
   * 날씨
   * ========================================================= */
  function wIcon(cond, size) {
    var sun = '<circle cx="16" cy="16" r="7" fill="#ffd43b"/>';
    var cloud = '<path d="M9 26c-3.3 0-6-2.3-6-5.2 0-2.7 2.2-4.9 5-5.2.9-3.5 4-6 7.7-6 3.8 0 7 2.7 7.7 6.2h.4c2.9 0 5.2 2.3 5.2 5.1S26.7 26 23.8 26z" fill="#f4f7fa"/>';
    var rain = '<path d="M11 28l-1.5 3M17 28l-1.5 3M23 28l-1.5 3" stroke="#9fd3ff" stroke-width="2" stroke-linecap="round"/>';
    var body = cond === "sunny" ? sun : cond === "rain" ? cloud.replace("26c", "24c").replace("26z", "24z") + rain : '<g transform="translate(5 -4) scale(.7)">' + sun + "</g>" + cloud;
    return '<svg viewBox="0 0 32 32" width="' + size + '" height="' + size + '" aria-hidden="true">' + body + "</svg>";
  }
  var COND = { sunny: "맑음", cloudy: "구름 조금", rain: "비" };

  YUSHI.appScreens.weather = function mount(appEl) {
    var W = YUSHI.data.apps.weather, esc = ui.esc;
    appEl.classList.add("app-weather");
    var root = document.createElement("div");
    root.className = "wx";
    root.innerHTML =
      '<div class="wx-card">' +
        '<div class="wx-top"><div><div class="wx-city">' + esc(W.city) + '</div><div class="wx-hilo">최고 ' + W.now.hi + "° 최저 " + W.now.lo + "°</div></div>" +
          '<div class="wx-now">' + wIcon(W.now.cond, 56) + '<span class="wx-temp">' + W.now.temp + "°</span></div></div>" +
        '<div class="wx-cond">' + (COND[W.now.cond] || "") + "</div>" +
        '<div class="wx-days">' + W.days.map(function (d) {
          return '<div class="wx-day"><span>' + esc(d.day) + "</span>" + wIcon(d.cond, 30) + "<b>" + d.hi + "°</b><small>" + d.lo + "°</small></div>";
        }).join("") + "</div>" +
      "</div>" +
      '<div class="wx-dots"><span class="is-on"></span></div>';
    appEl.appendChild(root);
  };

  /* =========================================================
   * 설정
   * ========================================================= */
  function sw(id, on, label) {
    return '<button type="button" class="sw' + (on ? " is-on" : "") + '" data-sw="' + id + '" role="switch" aria-checked="' + on + '" aria-label="' + label + '">' +
      '<span class="sw-on">ON</span><span class="sw-knob"></span><span class="sw-off">OFF</span></button>';
  }

  function dimmer() {
    var screen = document.getElementById("screen");
    var el = screen.querySelector(".dim");
    if (!el) { el = document.createElement("div"); el.className = "dim"; screen.appendChild(el); }
    return el;
  }

  YUSHI.appScreens.settings = function mount(appEl) {
    var C = YUSHI.config, A = YUSHI.data.apps;
    YUSHI.session = YUSHI.session || {};
    var S = YUSHI.session.settings = YUSHI.session.settings || { brightness: 1 };
    var st = stage(appEl, "app-settings");
    var stack = st.stack;

    // 설정 목록 왼쪽의 작은 아이콘 (흰 그림, 24×24 기준)
    var W = 'fill="#fff"', WS = 'fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"';
    var GLYPH = {
      air: '<path ' + W + ' d="M12 2.5c.9 0 1.4 1 1.4 2.2v5.1l7.1 4.1v2l-7.1-2.2v4.4l2.1 1.6v1.6L12 20.5l-3.5.8v-1.6l2.1-1.6v-4.4l-7.1 2.2v-2l7.1-4.1V4.7c0-1.2.5-2.2 1.4-2.2z"/>',
      wifi: '<g ' + WS + ' stroke-width="2.4"><path d="M3.5 10a12 12 0 0 1 17 0"/><path d="M6.8 13.4a7.3 7.3 0 0 1 10.4 0"/></g><path ' + W + ' d="M12 20l-2.9-3.1a4.1 4.1 0 0 1 5.8 0z"/>',
      bt: '<path ' + WS + ' stroke-width="2.1" d="M7 8l9.5 8.5L12 20.5V3.5l4.5 4L7 16"/>',
      cell: '<g ' + WS + ' stroke-width="2"><path d="M12 9.5V21"/><path d="M8.6 6.4a4.8 4.8 0 0 0 0 6.2M15.4 6.4a4.8 4.8 0 0 1 0 6.2"/><path d="M5.8 3.8a8.6 8.6 0 0 0 0 11.4M18.2 3.8a8.6 8.6 0 0 1 0 11.4"/></g><circle ' + W + ' cx="12" cy="9.5" r="1.9"/>',
      noti: '<g ' + W + '><rect x="4" y="5" width="16" height="4" rx="1.2"/><rect x="4" y="10.5" width="16" height="4" rx="1.2" opacity=".85"/><rect x="4" y="16" width="16" height="3.4" rx="1.2" opacity=".7"/></g>',
      gear: '<path ' + W + ' fill-rule="evenodd" d="M10.3 2.5h3.4l.5 2.6 1.8.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.8 2.6.5v3.4l-2.6.5-.8 1.8 1.5 2.2-2.4 2.4-2.2-1.5-1.8.8-.5 2.6h-3.4l-.5-2.6-1.8-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.8-2.6-.5v-3.4l2.6-.5.8-1.8-1.5-2.2 2.4-2.4 2.2 1.5 1.8-.8zM12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2z"/>',
      sound: '<path ' + W + ' d="M3.5 9h3.8L12.5 4.5v15L7.3 15H3.5z"/><g ' + WS + ' stroke-width="2"><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18.2 6.3a8 8 0 0 1 0 11.4"/></g>',
      bright: '<circle ' + W + ' cx="12" cy="12" r="4.2"/><g ' + WS + ' stroke-width="2"><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/></g>',
      privacy: '<path ' + W + ' d="M8 11.5V5.3a1.3 1.3 0 0 1 2.6 0v5.2h.4V3.8a1.3 1.3 0 0 1 2.6 0v6.7h.4V4.9a1.3 1.3 0 0 1 2.6 0v6.6h.4V7.4a1.3 1.3 0 0 1 2.6 0v7.4c0 4-2.6 6.7-6.3 6.7-2.6 0-4.1-1.2-5.5-3.3l-2.8-4.3a1.3 1.3 0 0 1 2.1-1.5z"/>'
    };
    function setIcon(bg, g) {
      return '<span class="set-icon" style="background:' + bg + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + (GLYPH[g] || "") + "</svg></span>";
    }

    function row(label, value, go, icon, glyph) {
      var inner = (icon ? setIcon(icon, glyph) : "") +
        '<span class="st-label">' + label + "</span>" + (value ? '<span class="st-value">' + value + "</span>" : "");
      return go
        ? '<button type="button" class="grp-row" data-go="' + go + '">' + inner + '<span class="st-chev">›</span></button>'
        : '<div class="grp-row">' + inner + "</div>";
    }

    function openAbout() {
      stack.push({ title: "정보", back: "일반", full: true }, function (body) {
        body.classList.add("pin");
        var apps = YUSHI.apps.page.length + YUSHI.apps.dock.length;
        body.innerHTML =
          '<div class="grp">' + row("이름", "유우시의 iPhone") + row("네트워크", ui.esc(C.carrier)) + "</div>" +
          '<div class="grp">' + row("노래", String(A.music.filter(function (m) { return m.audio; }).length)) +
            row("사진", String(A.photos.length + cameraShots().length)) + row("응용 프로그램", String(apps)) +
            row("용량", "13.0GB") + row("버전", "6.1.3 (10B329)") + row("모델", "iPhone 5") + "</div>";
      });
    }
    function openGeneral() {
      stack.push({ title: "일반", back: "설정", full: true }, function (body) {
        body.classList.add("pin");
        body.innerHTML = '<div class="grp">' + row("정보", "", "about") + "</div>";
        body.addEventListener("click", function (e) { if (e.target.closest('[data-go="about"]')) openAbout(); });
      });
    }
    function openBrightness() {
      stack.push({ title: "밝기 및 배경화면", back: "설정", full: true }, function (body) {
        body.classList.add("pin");
        var wall = C.wallpaper || {};
        var lock = typeof wall === "string" ? wall : wall.lock, home = typeof wall === "string" ? wall : wall.home;
        body.innerHTML =
          '<div class="grp"><div class="grp-row set-bright"><span class="set-sun">☼</span>' +
            '<input type="range" class="vm-range" id="set-bright" min="30" max="100" value="' + Math.round(S.brightness * 100) + '" aria-label="밝기">' +
            '<span class="set-sun big">☀</span></div></div>' +
          '<div class="st-head pin-head">배경화면</div>' +
          '<div class="grp"><div class="grp-row set-walls">' +
            '<span class="set-wall"' + (lock ? ' style="background-image:url(&quot;' + ui.esc(lock) + '&quot;)"' : "") + "></span>" +
            '<span class="set-wall"' + (home ? ' style="background-image:url(&quot;' + ui.esc(home) + '&quot;)"' : "") + "></span>" +
          "</div></div>";
        var r = body.querySelector("#set-bright");
        r.style.setProperty("--p", ((r.value - 30) / 70 * 100) + "%");
        r.addEventListener("input", function () {
          S.brightness = r.value / 100;
          r.style.setProperty("--p", ((r.value - 30) / 70 * 100) + "%");
          dimmer().style.opacity = String((1 - S.brightness) * 0.85);
        });
      });
    }

    stack.reset({ title: "설정", full: true }, function (body) {
      body.classList.add("pin");
      function draw() {
        body.innerHTML =
          '<div class="grp">' +
            '<div class="grp-row">' + setIcon("linear-gradient(#ffb04a,#f07a14)", "air") + '<span class="st-label">에어플레인 모드</span>' + sw("air", !!C.airplane, "에어플레인 모드") + "</div>" +
            row("Wi-Fi", C.airplane ? "끔" : (String(C.network).toLowerCase() === "wifi" ? "연결됨" : "끔"), "", "linear-gradient(#6fb3f5,#2a72d3)", "wifi") +
            row("Bluetooth", "끔", "", "linear-gradient(#6fb3f5,#2a72d3)", "bt") +
            row("셀룰러", "", "", "linear-gradient(#8fd96c,#3aa526)", "cell") +
          "</div>" +
          '<div class="grp">' +
            row("알림", "", "", "linear-gradient(#f2645c,#c8261d)", "noti") +
            row("일반", "", "general", "linear-gradient(#a9aeb6,#5c6169)", "gear") +
            row("소리", "", "", "linear-gradient(#f2645c,#c8261d)", "sound") +
            row("밝기 및 배경화면", "", "bright", "linear-gradient(#6fb3f5,#2a72d3)", "bright") +
            row("개인정보 보호", "", "", "linear-gradient(#a9aeb6,#5c6169)", "privacy") +
          "</div>";
      }
      draw();
      body.addEventListener("click", function (e) {
        if (e.target.closest('[data-sw="air"]')) {
          C.airplane = !C.airplane;
          if (YUSHI.refreshStatusBars) YUSHI.refreshStatusBars();
          draw();
          return;
        }
        var g = e.target.closest("[data-go]");
        if (!g) return;
        if (g.getAttribute("data-go") === "general") openGeneral();
        else openBrightness();
      });
    });
  };
})();
