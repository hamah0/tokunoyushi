/*
 * 메시지(문자) 앱 — iOS 6 스타일
 * -----------------------------------------
 * 메시지함(대화 목록) → 대화 화면
 * - 대화 화면에서 입력칸을 누르면 화면 속 키보드가 올라오고, '전송'으로 보낼 수 있습니다.
 * - 왼쪽 카메라 버튼은 모양만 있고 사진은 보내지지 않습니다.
 * - 보낸 메시지는 페이지를 연 동안만 남습니다.
 * 데이터: js/data/messages-data.js
 */
window.YUSHI = window.YUSHI || {};
YUSHI.appScreens = YUSHI.appScreens || {};

(function () {
  var ui = YUSHI.ui;
  var CAM = '<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M5 6h4.5l1.8-3h9.4l1.8 3H27c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z"/><circle cx="16" cy="13.5" r="5" fill="#e8eaed"/><circle cx="16" cy="13.5" r="3.2"/></svg>';
  var CHEV = '<svg class="sms-chev" viewBox="0 0 8 13" aria-hidden="true"><path d="M1.5 1.5l5 5-5 5" fill="none" stroke="#a6abb3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // 말풍선 꼬리 (말풍선 아래 모서리에서 휘어져 나옴)
  var TAIL = '<svg class="sms-tail" viewBox="0 0 14 16" aria-hidden="true"><path d="M0 12.8L2 11 4 8.6 6 4.7 7 0C7 7 9 12 14 15.6 9 16.4 4 16 0 16z"/></svg>';

  // 목록 시각: 오늘이면 '오후 8:02', 어제면 '어제', 그 전이면 '13. 4. 2.'
  function listTime(t) {
    var d = ui.parseTime(t), now = YUSHI.now();
    if (ui.sameDay(d, now)) return ui.timeText(d);
    var y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    if (ui.sameDay(d, y)) return "어제";
    return String(d.getFullYear()).slice(2) + ". " + (d.getMonth() + 1) + ". " + d.getDate() + ".";
  }
  // 대화 중간의 시각 표시: '2013. 4. 4. 오후 7:45'
  function stamp(t) {
    var d = ui.parseTime(t);
    return d.getFullYear() + ". " + (d.getMonth() + 1) + ". " + d.getDate() + ". " + ui.timeText(d);
  }

  YUSHI.appScreens.sms = function mount(appEl) {
    var D = YUSHI.data.messages;
    var esc = ui.esc;

    function thread(id) {
      for (var i = 0; i < D.threads.length; i++) if (D.threads[i].id === id) return D.threads[i];
      return null;
    }
    function last(t) { return t.messages[t.messages.length - 1]; }

    appEl.classList.add("app-sms");
    var host = document.createElement("div");
    host.className = "app-stage";
    appEl.appendChild(host);
    var stack = ui.createStack(host);

    /* ---------- 메시지함 ---------- */
    var listBody;
    function drawList() {
      var list = D.threads.filter(function (t) { return t.messages.length; });
      list.sort(function (a, b) { return ui.parseTime(last(b).time) - ui.parseTime(last(a).time); });
      if (!list.length) { listBody.innerHTML = '<p class="list-empty">메시지가 없습니다.</p>'; return; }
      listBody.innerHTML = list.map(function (t) {
        var m = last(t);
        return (
          '<button type="button" class="sms-row" data-thread="' + esc(t.id) + '">' +
            '<span class="sms-dot' + (t.unread ? " is-on" : "") + '" aria-label="' + (t.unread ? "읽지 않음" : "") + '"></span>' +
            '<span class="sms-main">' +
              '<span class="sms-top"><span class="sms-name">' + esc(t.name) + "</span>" +
              '<span class="sms-time">' + listTime(m.time) + "</span>" + CHEV + "</span>" +
              '<span class="sms-preview">' + esc(m.text || "사진") + "</span>" +
            "</span>" +
          "</button>"
        );
      }).join("");
    }

    stack.reset({ title: "메시지", full: true, className: "sms-list", onShow: drawList }, function (body) {
      listBody = body;
      drawList();
      body.addEventListener("click", function (e) {
        var r = e.target.closest("[data-thread]");
        if (r) openThread(r.getAttribute("data-thread"));
      });
    });

    /* ---------- 대화 화면 ---------- */
    function bubbleHTML(m, t) {
      var cls = "sms-b " + (m.from === "me" ? "is-me" + (t.type === "sms" ? " is-sms" : "") : "is-them");
      var inner;
      if (m.photo) inner = '<img src="' + esc(m.photo) + '" alt="사진">';
      else if (m.photoSlot) inner = '<span class="sms-photo-slot">사진</span>';
      else inner = esc(m.text);
      var tail = m.photo || m.photoSlot ? "" : TAIL;
      return '<div class="sms-line ' + (m.from === "me" ? "me" : "them") + '"><div class="' + cls + (m.photo || m.photoSlot ? " is-photo" : "") + '">' + inner + tail + "</div></div>";
    }

    function openThread(id) {
      var t = thread(id);
      if (!t) return;
      t.unread = false;
      var sentNow = false;   // 이 화면에서 새로 보냈는지

      stack.push({ title: t.name, back: "메시지", full: true, className: "sms-room" }, function (body) {
        body.innerHTML =
          '<div class="chat-log sms-log"></div>' +
          '<form class="chat-input sms-input" autocomplete="off">' +
            '<button type="button" class="sms-cam" aria-label="사진 보내기">' + CAM + "</button>" +
            '<input type="text" class="chat-field" id="sms-field-' + esc(t.id) + '" aria-label="메시지 입력" maxlength="300" placeholder="' +
              (t.type === "sms" ? "문자 메시지" : "iMessage") + '">' +
            '<button type="submit" class="chat-send sms-send" disabled>전송</button>' +
          "</form>";

        var log = body.querySelector(".sms-log");
        var form = body.querySelector(".sms-input");
        var field = form.querySelector(".chat-field");
        var send = form.querySelector(".sms-send");

        function draw() {
          var html = "", prevTime = null;
          t.messages.forEach(function (m) {
            var tm = ui.parseTime(m.time);
            // 15분 넘게 떨어지면 가운데에 시각 표시
            if (!prevTime || tm - prevTime > 15 * 60000) html += '<div class="sms-stamp">' + stamp(m.time) + "</div>";
            prevTime = tm;
            html += bubbleHTML(m, t);
          });
          var lm = last(t);
          if (lm && lm.from === "me") {
            if (sentNow) html += '<div class="sms-status">전송됨</div>';
            else if (t.readAt) html += '<div class="sms-status">읽음 ' + ui.timeText(t.readAt) + "</div>";
          }
          log.innerHTML = html || '<p class="chat-empty">메시지가 없습니다.</p>';
          log.scrollTop = log.scrollHeight;
        }
        draw();

        var kb = ui.attachKeyboard(body, field, {
          returnLabel: "완료",
          onOpen: function () { log.scrollTop = log.scrollHeight; }
        });
        log.addEventListener("click", function () { kb.close(); });

        function push(msg) {
          t.messages.push(msg);
          sentNow = true;
          draw();
        }

        // 카메라 버튼은 모양만 있고 실제로 사진이 보내지지 않도록 막아 둠
        field.addEventListener("input", function () { send.disabled = !field.value.trim(); });
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var text = field.value.trim();
          if (!text) return;
          field.value = "";
          send.disabled = true;
          push({ from: "me", text: text, time: YUSHI.now() });
        });
      });
    }
  };
})();
