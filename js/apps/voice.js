/*
 * 음성 메모 앱
 * -----------------------------------------
 * 목록에서 메모를 누르면 재생 / 다시 누르면 일시정지.
 * 아래 패널의 막대로 원하는 위치로 옮길 수 있고, '삭제'로 목록에서 지울 수 있습니다.
 * 오른쪽 파란 화살표는 메모 정보 화면을 엽니다.
 * 데이터: js/data/voice-data.js
 */
window.YUSHI = window.YUSHI || {};
YUSHI.appScreens = YUSHI.appScreens || {};

(function () {
  var ui = YUSHI.ui;

  var PLAY = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5l9.5 5.5L3 12.5z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 14 14" aria-hidden="true"><rect x="2.5" y="1.5" width="3.3" height="11" rx=".6"/><rect x="8.2" y="1.5" width="3.3" height="11" rx=".6"/></svg>';
  var SHARE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h3v10h11v-4h3v7H4z"/><path d="M12 15c.5-5 3.6-7.6 8-7.8V4l4 4.8-4 4.7V10.3c-3.5.1-6 1.6-8 4.7z"/></svg>';
  var DISC = '<span class="disc" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M4.3 2.5L8 6l-3.7 3.5" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function clock(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    return Math.floor(sec / 60) + ":" + pad(sec % 60);
  }
  // "8초", "1분 11초"
  function durText(sec) {
    if (!sec && sec !== 0) return "";
    sec = Math.round(sec);
    var m = Math.floor(sec / 60), s = sec % 60;
    return m ? m + "분 " + s + "초" : s + "초";
  }
  // "13. 4. 3."
  function shortDate(t) {
    var d = ui.parseTime(t);
    return String(d.getFullYear()).slice(2) + ". " + (d.getMonth() + 1) + ". " + d.getDate() + ".";
  }

  YUSHI.appScreens.voice = function mount(appEl) {
    var D = YUSHI.data.voice;
    var esc = ui.esc;
    var audio = null;        // 지금 불러온 오디오
    var currentId = null;    // 선택한 메모
    var dragging = false;

    function memo(id) {
      for (var i = 0; i < D.memos.length; i++) if (D.memos[i].id === id) return D.memos[i];
      return null;
    }
    function sorted() {
      return D.memos.slice().sort(function (a, b) { return ui.parseTime(b.time) - ui.parseTime(a.time); });
    }

    // 실제 파일이 있는 메모는 길이를 미리 읽어 둠
    D.memos.forEach(function (m) {
      if (!m.audio) return;
      var probe = new Audio();
      probe.preload = "metadata";
      probe.addEventListener("loadedmetadata", function () {
        if (isFinite(probe.duration)) { m.duration = probe.duration; if (listBody) drawList(); }
      });
      probe.src = m.audio;
    });

    appEl.classList.add("app-voice");
    var host = document.createElement("div");
    host.className = "app-stage";
    appEl.appendChild(host);
    var stack = ui.createStack(host);
    var listBody = null, panel = null;

    function stop() {
      if (audio) { audio.pause(); audio = null; }
    }

    function drawList() {
      var list = sorted();
      if (!list.length) {
        listBody.innerHTML = '<p class="list-empty">음성 메모가 없습니다.</p>';
        return;
      }
      listBody.innerHTML = list.map(function (m) {
        var sel = m.id === currentId;
        var playing = sel && audio && !audio.paused;
        return (
          '<div class="vm-row' + (sel ? " is-selected" : "") + '">' +
            '<button type="button" class="vm-row-main" data-memo="' + esc(m.id) + '" aria-label="' +
              esc((m.label || ui.timeText(m.time)) + (playing ? " 일시정지" : " 재생")) + '">' +
              '<span class="vm-play">' + (sel ? (playing ? PAUSE : PLAY) : "") + "</span>" +
              '<span class="vm-text"><span class="vm-time">' + esc(m.label || ui.timeText(m.time)) + "</span>" +
              '<span class="vm-date">' + (m.label ? ui.timeText(m.time) + " · " : "") + shortDate(m.time) + "</span></span>" +
              '<span class="vm-dur">' + (m.audio || m.duration ? durText(m.duration) : "") + "</span>" +
            "</button>" +
            '<button type="button" class="disc-btn" data-info="' + esc(m.id) + '" aria-label="정보">' + DISC + "</button>" +
          "</div>"
        );
      }).join("");
    }

    function drawPanel() {
      var m = currentId ? memo(currentId) : null;
      var scrub;
      if (m && !m.audio) {
        scrub = '<div class="vm-note">이 메모에는 아직 오디오 파일이 없습니다.</div>';
      } else {
        var dur = audio && isFinite(audio.duration) ? audio.duration : (m && m.duration) || 0;
        var cur = audio ? audio.currentTime : 0;
        var p = dur ? Math.min(1000, Math.round((cur / dur) * 1000)) : 0;
        scrub =
          '<div class="vm-scrub"><span class="vm-cur">' + clock(cur) + "</span>" +
          '<input type="range" class="vm-range" id="vm-range" min="0" max="1000" value="' + p + '" aria-label="재생 위치"' +
            (m ? "" : " disabled") + ' style="--p:' + p / 10 + '%">' +
          '<span class="vm-left">-' + clock(dur - cur) + "</span></div>";
      }
      panel.innerHTML =
        scrub +
        '<div class="vm-btns">' +
          '<button type="button" class="vm-btn vm-share" disabled>' + SHARE + "<span>공유</span></button>" +
          '<button type="button" class="vm-btn vm-delete"' + (m ? "" : " disabled") + ">삭제</button>" +
        "</div>";
    }

    // 재생 중에는 막대와 시간만 갱신
    function tick() {
      if (!audio || dragging || !panel) return;
      var r = panel.querySelector(".vm-range");
      if (!r) return;
      var dur = isFinite(audio.duration) ? audio.duration : 0;
      var p = dur ? Math.round((audio.currentTime / dur) * 1000) : 0;
      r.value = p;
      r.style.setProperty("--p", p / 10 + "%");
      panel.querySelector(".vm-cur").textContent = clock(audio.currentTime);
      panel.querySelector(".vm-left").textContent = "-" + clock(dur - audio.currentTime);
    }

    function select(id) {
      var m = memo(id);
      if (!m) return;
      if (id === currentId && audio) {
        if (audio.paused) audio.play().catch(function () {}); else audio.pause();
        return;
      }
      stop();
      currentId = id;
      if (m.audio) {
        audio = new Audio(m.audio);
        audio.addEventListener("timeupdate", tick);
        audio.addEventListener("loadedmetadata", function () {
          if (isFinite(audio.duration)) m.duration = audio.duration;
          drawPanel();
        });
        audio.addEventListener("play", drawList);
        audio.addEventListener("pause", drawList);
        audio.addEventListener("ended", function () { audio.currentTime = 0; drawList(); drawPanel(); });
        audio.addEventListener("error", function () {
          panel.innerHTML = '<div class="vm-note">오디오 파일을 열 수 없습니다. 경로를 확인해 주세요.</div>';
        });
        audio.play().catch(function () {});
      }
      drawList();
      drawPanel();
    }

    function openInfo(id) {
      var m = memo(id);
      if (!m) return;
      stack.push({ title: "정보", back: "음성 메모", full: true, className: "vm-info" }, function (body) {
        body.innerHTML =
          '<div class="grp">' +
            '<div class="grp-row"><span class="grp-label">이름</span><span class="grp-value">' + esc(m.label || ui.timeText(m.time)) + "</span></div>" +
            '<div class="grp-row"><span class="grp-label">날짜</span><span class="grp-value">' + ui.dateText(m.time) + " " + ui.timeText(m.time) + "</span></div>" +
            '<div class="grp-row"><span class="grp-label">길이</span><span class="grp-value">' + (durText(m.duration) || "알 수 없음") + "</span></div>" +
          "</div>";
      });
    }

    stack.reset({ title: "음성 메모", full: true, className: "vm-list" }, function (body, scr) {
      listBody = body;
      panel = document.createElement("div");
      panel.className = "vm-panel";
      scr.appendChild(panel);
      drawList();
      drawPanel();

      body.addEventListener("click", function (e) {
        var info = e.target.closest("[data-info]");
        if (info) { openInfo(info.getAttribute("data-info")); return; }
        var row = e.target.closest("[data-memo]");
        if (row) select(row.getAttribute("data-memo"));
      });

      panel.addEventListener("input", function (e) {
        if (!e.target.classList.contains("vm-range")) return;
        dragging = true;
        e.target.style.setProperty("--p", e.target.value / 10 + "%");
      });
      panel.addEventListener("change", function (e) {
        if (!e.target.classList.contains("vm-range")) return;
        dragging = false;
        if (audio && isFinite(audio.duration)) {
          audio.currentTime = (e.target.value / 1000) * audio.duration;
          tick();
        }
      });
      panel.addEventListener("click", function (e) {
        if (!e.target.closest(".vm-delete") || !currentId) return;
        stop();
        D.memos = D.memos.filter(function (m) { return m.id !== currentId; });
        currentId = null;
        drawList();
        drawPanel();
      });
    });

    // 앱을 닫을 때 재생을 멈춤
    return stop;
  };
})();
