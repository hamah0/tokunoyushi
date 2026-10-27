/*
 * 윙크 — 메신저 앱
 * -----------------------------------------
 * 화면: 친구 목록 / 채팅 목록 / 대화방 / 프로필
 * 데이터: js/data/wink-data.js
 *
 * 대화방에서 보낸 메시지는 이 페이지를 연 동안만 남습니다 (새로고침하면 데이터 파일 상태로 돌아감).
 */
window.YUSHI = window.YUSHI || {};
YUSHI.appScreens = YUSHI.appScreens || {};

(function () {
  var ui = YUSHI.ui;

  /* ---------- 상대가 보내는 메시지 (앱이 닫혀 있어도 도착) ----------
   * 대화방의 afterDraft: { delay: 초, messages: ["…", "…"] }
   * → 준비된 글(draft)을 독자가 전송하면 delay초 뒤에 상대가 차례로 보냄.
   *   독자가 그 방을 보고 있으면 바로 말풍선이 생기고,
   *   다른 곳에 있으면 위쪽 배너 알림 + 안 읽은 수 + 홈 화면 아이콘 배지.
   */
  var live = null;   // Talk 앱이 열려 있을 때만 채워짐

  function totalUnread() {
    var n = 0;
    YUSHI.data.wink.chats.forEach(function (c) { n += c.unread || 0; });
    return n;
  }
  function personName(id) {
    var p = YUSHI.data.wink.people[id];
    return p ? p.name : "";
  }
  // 톡 알림음 (Talk 더보기 > 알림음이 켜져 있을 때)
  var talkSound = null;
  function playTalkSound() {
    var set = (YUSHI.session && YUSHI.session.winkSettings) || {};
    if (set.noti === false || set.sound === false) return;
    try {
      if (!talkSound) talkSound = new Audio("assets/sounds/talk.mp3");
      talkSound.currentTime = 0;
      var p = talkSound.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* 소리를 낼 수 없는 환경 */ }
  }

  // 독자가 대화방에서 특정 메시지를 '봤는지' 기록 (전화 장면 등을 여는 조건)
  // 대화방 데이터의 unlockOnSeen: { text: "메시지", key: "이름" }
  function checkSeen(c) {
    var u = c.unlockOnSeen;
    if (!u) return;
    for (var i = 0; i < c.messages.length; i++) {
      if (c.messages[i].from === c.with && c.messages[i].text === u.text) {
        YUSHI.session = YUSHI.session || {};
        YUSHI.session.unlocked = YUSHI.session.unlocked || {};
        YUSHI.session.unlocked[u.key] = true;
        return;
      }
    }
  }

  function deliver(c, text) {
    // 독자가 그 대화방을 보고 있지 않을 때만 알림음
    var watching = live && live.isRoomOpen(c.id) && YUSHI.currentApp && YUSHI.currentApp() === "wink";
    if (!watching) playTalkSound();
    // 상대가 답장했다는 건 그동안 보낸 메시지를 읽었다는 뜻 → 말풍선 옆 '1' 지움
    c.messages.forEach(function (m) { if (m.from !== c.with && m.unread) m.unread = 0; });
    c.messages.push({ from: c.with, text: text, time: YUSHI.now() });
    if (live && live.isRoomOpen(c.id) && YUSHI.currentApp && YUSHI.currentApp() === "wink") { live.redrawRoom(); checkSeen(c); return; }
    if (live && live.isRoomOpen(c.id)) live.redrawRoom();
    c.unread = (c.unread || 0) + 1;
    YUSHI.setBadge && YUSHI.setBadge("wink", totalUnread());
    if (live) live.refresh();
    if (YUSHI.banner) {
      YUSHI.banner({
        appId: "wink",
        title: "Talk",
        text: personName(c.with) + " : " + text,
        onTap: function () {
          if (live) live.openChat(c.id);
          else { YUSHI.session = YUSHI.session || {}; YUSHI.session.winkOpenChat = c.id; YUSHI.openApp("wink"); }
        }
      });
    }
  }
  function scheduleReply(c) {
    var r = c.afterDraft;
    if (!r || c._replyScheduled) return;
    c._replyScheduled = true;
    // readNow: 보내자마자(1.5초 뒤) 상대가 읽음 → 말풍선 옆 '1' 사라짐
    if (r.readNow) setTimeout(function () { markRead(c); }, 1500);
    var t = (r.delay || 15) * 1000, list = r.messages || [];
    // 상대 메시지 없이 바로 다음 준비된 글로 이어지는 단계
    if (!list.length && r.next) {
      c.afterDraft = r.next;
      c.draft = r.next.draft || null;
      c._replyScheduled = false;
      setTimeout(function () { if (live) live.draftReady(c.id); }, 500);
      return;
    }
    list.forEach(function (text, i) {
      setTimeout(function () {
        deliver(c, text);
        // 마지막 메시지가 오면 다음 단계(next)를 준비: 다음 준비된 글과 그 뒤 답장
        if (i === list.length - 1 && r.next) {
          c.afterDraft = r.next;
          c.draft = r.next.draft || null;
          c._replyScheduled = false;
        }
      }, t + i * (r.gap || 2) * 1000);
    });
  }
  function markRead(c) {
    var changed = false;
    c.messages.forEach(function (m) { if (m.from !== c.with && m.unread) { m.unread = 0; changed = true; } });
    if (changed && live && live.isRoomOpen(c.id)) live.redrawRoom();
  }

  YUSHI.appScreens.wink = function mount(appEl) {
    var D = YUSHI.data.wink;
    var me = D.me;
    var esc = ui.esc;

    function av(p, size, extra) { return ui.plainAvatar(p, size, extra); }
    function person(id) { return D.people[id] || { name: "알 수 없음" }; }
    function chatById(id) {
      for (var i = 0; i < D.chats.length; i++) if (D.chats[i].id === id) return D.chats[i];
      return null;
    }
    function chatWith(pid) {
      for (var i = 0; i < D.chats.length; i++) if (D.chats[i].with === pid) return D.chats[i];
      var c = { id: pid, with: pid, unread: 0, messages: [] };
      D.chats.push(c);
      return c;
    }
    function lastMsg(c) { return c.messages[c.messages.length - 1]; }
    function isGroup(c) { return !!c.members; }
    function chatTitle(c) { return isGroup(c) ? c.name : person(c.with).name; }
    function memberCount(c) { return c.members.length + 1; }   // 나 포함
    // 그룹채팅방 사진: 참여자 4명 얼굴을 2×2로
    function chatAvatar(c, size) {
      if (!isGroup(c)) return av(person(c.with), size);
      var half = Math.floor((size - 2) / 2);
      return '<span class="avatar group-avatar" style="width:' + size + "px;height:" + size + 'px">' +
        c.members.slice(0, 4).map(function (id) { return av(person(id), half); }).join("") + "</span>";
    }

    // 말풍선: 글 / 사진(photo 경로) / 사진 자리(photoSlot)
    function bubbleHTML(m) {
      if (m.photo) return '<div class="bubble bubble-photo"><img src="' + esc(m.photo) + '" alt="사진"></div>';
      if (m.photoSlot) return '<div class="bubble bubble-photo bubble-photo-slot"><span>사진</span></div>';
      return '<div class="bubble">' + esc(m.text) + "</div>";
    }

    appEl.classList.add("app-wink");
    var host = document.createElement("div");
    host.className = "app-stage";
    appEl.appendChild(host);
    var stack = ui.createStack(host);

    /* ---------- 친구 목록 ---------- */
    function friendRow(pid, big) {
      var p = person(pid);
      return (
        '<button type="button" class="row' + (big ? " row-me" : "") + '" data-person="' + esc(pid) + '">' +
          av(p, big ? 46 : 38) +
          '<span class="row-main"><span class="row-title">' + esc(p.name) + "</span>" +
          (p.status ? '<span class="row-sub">' + esc(p.status) + "</span>" : "") +
          "</span>" +
        "</button>"
      );
    }

    function showFriends() {
      stack.reset({ title: "친구" }, function (body) {
        body.classList.add("list-plain");
        body.innerHTML =
          '<div class="list-head">내 프로필</div>' + friendRow(me, true) +
          '<div class="list-head">친구 ' + D.friends.length + "</div>" +
          D.friends.map(function (id) { return friendRow(id); }).join("");
        // 프로필은 눌린 표시만 되고 안으로 들어가지 않습니다 (인터넷 북마크와 같음)
      });
    }

    /* ---------- 프로필 ---------- */
    function openProfile(pid, backLabel) {
      var p = person(pid);
      stack.push({ title: p.name, back: backLabel, full: true, className: "wink-profile" }, function (body) {
        body.style.setProperty("--pcolor", p.color || "#7c8a99");
        body.innerHTML =
          '<div class="profile-card">' +
            av(p, 96, "avatar-big") +
            '<div class="profile-name">' + esc(p.name) + "</div>" +
            '<div class="profile-status">' + (p.status ? esc(p.status) : "&nbsp;") + "</div>" +
          "</div>" +
          (pid !== me
            ? '<div class="profile-actions"><button type="button" class="glossy-btn" data-act="chat">1:1 채팅</button></div>'
            : "");
        var btn = body.querySelector('[data-act="chat"]');
        if (btn) btn.addEventListener("click", function () { openChat(chatWith(pid).id, "프로필"); });
      });
    }

    /* ---------- 채팅 목록 ---------- */
    function renderChatList(body) {
      // 메시지가 있는 방은 최근 순, 아직 메시지가 없는 방은 그 아래 (데이터 순서대로)
      var list = D.chats.filter(function (c) { return c.messages.length > 0; });
      list.sort(function (a, b) { return ui.parseTime(lastMsg(b).time) - ui.parseTime(lastMsg(a).time); });
      list = list.concat(D.chats.filter(function (c) { return c.messages.length === 0 && (isGroup(c) || D.people[c.with]); }));
      if (!list.length) {
        body.innerHTML = '<p class="list-empty">대화가 없습니다.</p>';
        return;
      }
      body.innerHTML = list.map(function (c) {
        var m = lastMsg(c);
        return (
          '<button type="button" class="row row-chat" data-chat="' + esc(c.id) + '">' +
            chatAvatar(c, 44) +
            '<span class="row-main"><span class="row-title"><span class="rt-name">' + esc(chatTitle(c)) + "</span>" +
              (isGroup(c) ? '<span class="row-count">' + memberCount(c) + "</span>" : "") + "</span>" +
            '<span class="row-sub">' + (m ? esc(m.system || m.text || "사진") : "&nbsp;") + "</span></span>" +
            '<span class="row-side"><span class="row-time">' + (m ? ui.listTime(m.time) : "") + "</span>" +
            (c.unread ? '<span class="badge">' + c.unread + "</span>" : "") + "</span>" +
          "</button>"
        );
      }).join("");
    }

    function showChats() {
      stack.reset({
        title: "채팅",
        onShow: function () { renderChatList(listBody); }
      }, function (body) {
        listBody = body;
        body.classList.add("list-plain");
        renderChatList(body);
        body.addEventListener("click", function (e) {
          var r = e.target.closest("[data-chat]");
          if (r) openChat(r.getAttribute("data-chat"), "채팅");
        });
      });
    }
    var listBody = null;

    // 그룹채팅방 대화상대 목록 (프로필은 눌린 표시만)
    function openMembers(c) {
      stack.push({ title: "대화상대 " + memberCount(c), back: "채팅방", full: true }, function (body) {
        body.classList.add("list-plain");
        body.innerHTML = friendRow(me) + c.members.map(function (id) { return friendRow(id); }).join("");
      });
    }

    /* ---------- 대화방 ---------- */
    function messagesHTML(c) {
      var html = "", prev = null;
      c.messages.forEach(function (m) {
        if (!prev || !ui.sameDay(prev.time, m.time)) {
          html += '<div class="chat-date"><span>' + ui.dateText(m.time) + "</span></div>";
          prev = null;
        }
        // 안내 문구 (예: "OO님이 나갔습니다.")
        if (m.system) {
          html += '<div class="chat-date chat-system"><span>' + esc(m.system) + "</span></div>";
          prev = null;
          return;
        }
        var mine = m.from === me;
        var first = !prev || prev.from !== m.from;
        var p = person(m.from);
        html +=
          '<div class="msg ' + (mine ? "msg-me" : "msg-them") + (first ? " msg-first" : "") + '">' +
            (!mine ? (first ? av(p, 40, "msg-avatar") : '<span class="msg-avatar-gap"></span>') : "") +
            '<div class="msg-col">' +
              (!mine && first ? '<div class="msg-name">' + esc(p.name) + "</div>" : "") +
              '<div class="msg-line">' +
                bubbleHTML(m) +
                '<span class="msg-time">' +
                  (m.unread ? '<b class="msg-unread">' + m.unread + "</b>" : "") +
                  ui.timeText(m.time) + "</span>" +
              "</div>" +
            "</div>" +
          "</div>";
        prev = m;
      });
      return html || '<p class="chat-empty">아직 주고받은 메시지가 없습니다.</p>';
    }

    var ICON_MENU = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6.5h15M4.5 12h15M4.5 17.5h15" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';
    var ICON_MORE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="#555" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var ICON_SMILE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="#777" stroke-width="1.6"/><circle cx="8.8" cy="10" r="1.3" fill="#777"/><circle cx="15.2" cy="10" r="1.3" fill="#777"/><path d="M7.6 14c2.2 3 6.6 3 8.8 0" fill="none" stroke="#777" stroke-width="1.6" stroke-linecap="round"/></svg>';
    // 이모티콘 버튼에서 넣을 수 있는 글자 (당시 자주 쓰던 문자 이모티콘)
    var TEXT_EMOTICONS = ["^^", "ㅋㅋ", "ㅎㅎ", "ㅠㅠ", "♥", "^^;", "-_-", "!!"];

    function openChat(chatId, backLabel) {
      var c = chatById(chatId);
      if (!c) return;
      c.unread = 0;
      updateBadge();
      roomChatId = c.id;
      var group = isGroup(c);
      var p = group ? null : person(c.with);
      var menu = null;

      stack.push({
        title: chatTitle(c) + (group ? " " + memberCount(c) : ""),
        back: backLabel,
        full: true,
        className: "wink-room" + (group ? " wink-room-group" : ""),
        right: { label: "대화방 메뉴", icon: ICON_MENU, onClick: function () { if (menu) menu.toggle(); } }
      }, function (body) {
        body.classList.add("wk-font-" + ({ "작게": "s", "크게": "l" }[SET.font] || "m"));
        // 그룹방 제목: 이름이 길면 이름만 줄이고 인원수는 항상 보이게
        var h1 = group && body.closest(".scr") && body.closest(".scr").querySelector("h1");
        if (h1) h1.innerHTML = '<span class="gt-name">' + esc(c.name) + '</span><span class="gt-count">' + memberCount(c) + "</span>";
        body.innerHTML =
          '<div class="chat-log"></div>' +
          '<div class="room-menu" hidden>' +
            (group
              ? '<button type="button" data-menu="members">대화상대 ' + memberCount(c) + "명</button>"
              : '<button type="button" data-menu="profile">' + esc(p.name) + " 프로필 보기</button>") +
            '<button type="button" data-menu="top">처음 메시지로 가기</button>' +
          "</div>" +
          '<div class="room-tray room-tray-more" hidden>' +
            '<button type="button" data-tray="photo" disabled>사진 보내기</button>' +
          "</div>" +
          '<div class="room-tray room-tray-emo" hidden>' +
            TEXT_EMOTICONS.map(function (t) { return '<button type="button" data-emo="' + esc(t) + '">' + esc(t) + "</button>"; }).join("") +
          "</div>" +
          '<form class="chat-input room-input" autocomplete="off">' +
            '<button type="button" class="room-more" aria-label="더보기" aria-expanded="false">' + ICON_MORE + "</button>" +
            '<span class="room-field">' +
              '<input type="text" class="chat-field" id="wink-field-' + esc(c.id) + '" aria-label="메시지 입력" maxlength="300">' +
              '<button type="button" class="room-emo" aria-label="문자 이모티콘" aria-expanded="false">' + ICON_SMILE + "</button>" +
            "</span>" +
            '<button type="submit" class="chat-send" disabled>전송</button>' +
          "</form>";

        var log = body.querySelector(".chat-log");
        var form = body.querySelector(".chat-input");
        var field = body.querySelector(".chat-field");
        var send = body.querySelector(".chat-send");
        var menuEl = body.querySelector(".room-menu");
        var trayMore = body.querySelector(".room-tray-more");
        var trayEmo = body.querySelector(".room-tray-emo");
        var btnMore = body.querySelector(".room-more");
        var btnEmo = body.querySelector(".room-emo");

        // 화면 속 iOS 6 키보드
        var kb = ui.attachKeyboard(body, field, {
          onOpen: function () {
            closeAll(); log.scrollTop = log.scrollHeight;
            setTimeout(function () { log.scrollTop = log.scrollHeight; }, 280);   // 키보드가 다 올라온 뒤에도 최근 메시지가 보이게
            if (c.draft && !field.value && !autoTyping) setTimeout(autoType, 350);
          }
        });

        /* ---------- 준비된 글이 키보드로 저절로 쳐짐 (draft) ---------- */
        var autoTyping = false;
        var CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ", JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
        var JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
        var SPLIT = { "ㅘ": "ㅗㅏ", "ㅙ": "ㅗㅐ", "ㅚ": "ㅗㅣ", "ㅝ": "ㅜㅓ", "ㅞ": "ㅜㅔ", "ㅟ": "ㅜㅣ", "ㅢ": "ㅡㅣ",
          "ㄳ": "ㄱㅅ", "ㄵ": "ㄴㅈ", "ㄶ": "ㄴㅎ", "ㄺ": "ㄹㄱ", "ㄻ": "ㄹㅁ", "ㄼ": "ㄹㅂ", "ㄽ": "ㄹㅅ", "ㄾ": "ㄹㅌ", "ㄿ": "ㄹㅍ", "ㅀ": "ㄹㅎ", "ㅄ": "ㅂㅅ" };
        var SHIFTED = { "ㄲ": "ㄱ", "ㄸ": "ㄷ", "ㅃ": "ㅂ", "ㅆ": "ㅅ", "ㅉ": "ㅈ", "ㅒ": "ㅐ", "ㅖ": "ㅔ" };
        function keysOf(text) {
          var out = [];
          for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i), n = ch.charCodeAt(0) - 0xac00;
            if (ch === " ") { out.push(" "); continue; }
            if (n < 0 || n >= 11172) { out.push(ch); continue; }
            [CHO.charAt(Math.floor(n / 588)), JUNG.charAt(Math.floor((n % 588) / 28)), JONG[n % 28]].forEach(function (j) {
              if (!j) return;
              (SPLIT[j] || j).split("").forEach(function (k) { out.push(k); });
            });
          }
          return out;
        }
        function press(sel) {
          var b = body.querySelector(".kb " + sel);
          if (!b) return false;
          b.classList.add("is-press");
          setTimeout(function () { b.classList.remove("is-press"); }, 90);
          b.click();
          return true;
        }
        function autoType() {
          if (!c.draft || autoTyping) return;
          var keys = keysOf(c.draft), i = 0;
          autoTyping = true;
          (function next() {
            if (!kb.isOpen() || i >= keys.length) { autoTyping = false; if (i >= keys.length) { c.draft = null; c._draftTyped = true; } return; }
            var k = keys[i++];
            if (k === " ") press('[data-act="space"]');
            else if (SHIFTED[k]) { press('[data-act="shift"]'); setTimeout(function () { press('[data-ch="' + k + '"]'); }, 60); }
            else if (!press('[data-ch="' + k + '"]')) {
              // 한글 자판에 없는 글자(?, ! 등)는 123 자판으로 바꿔서 누르고 다시 돌아옴
              press('[data-act="num"]');
              setTimeout(function () {
                press('[data-ch="' + k.replace(/"/g, '\\"') + '"]');
                setTimeout(function () { press('[data-act="num"]'); }, 90);
              }, 110);
              setTimeout(next, 420);
              return;
            }
            setTimeout(next, k === " " ? 190 : 120 + Math.random() * 70);
          })();
        }
        // 저절로 쳐지는 동안에는 독자가 키를 눌러도 섞이지 않게
        body.addEventListener("click", function (e) {
          if (autoTyping && e.isTrusted && e.target.closest(".kb")) { e.stopPropagation(); e.preventDefault(); }
        }, true);

        function draw() {
          log.innerHTML = messagesHTML(c);
          log.scrollTop = log.scrollHeight;
        }
        draw();
        roomBody = body;
        roomRedraw = draw;
        checkSeen(c);   // 방에 들어와서 메시지를 봄
        // 화면이 다 그려진 뒤에도 맨 아래(최근 메시지)로
        setTimeout(function () { log.scrollTop = log.scrollHeight; }, 0);
        setTimeout(function () { log.scrollTop = log.scrollHeight; }, 350);

        // 한 번에 하나의 창만 열림
        function openOnly(el) {
          [menuEl, trayMore, trayEmo].forEach(function (x) { x.hidden = x !== el ? true : !x.hidden; });
          btnMore.classList.toggle("is-open", !trayMore.hidden);
          btnMore.setAttribute("aria-expanded", String(!trayMore.hidden));
          btnEmo.setAttribute("aria-expanded", String(!trayEmo.hidden));
        }
        function closeAll() { openOnly(null); }

        menu = { toggle: function () { openOnly(menuEl); } };

        menuEl.addEventListener("click", function (e) {
          var m = e.target.closest("[data-menu]");
          if (!m) return;
          closeAll();
          var what = m.getAttribute("data-menu");
          if (what === "top") log.scrollTop = 0;   // 프로필 보기는 눌린 표시만
          else if (what === "members") openMembers(c);
        });

        btnMore.addEventListener("click", function () { kb.close(); openOnly(trayMore); });
        btnEmo.addEventListener("click", function (e) { e.stopPropagation(); kb.close(); openOnly(trayEmo); });

        // '사진 보내기'는 모양만 있고 실제로 보내지지 않도록 막아 둠

        trayEmo.addEventListener("click", function (e) {
          var t = e.target.closest("[data-emo]");
          if (!t) return;
          field.value += t.getAttribute("data-emo");
          send.disabled = !field.value.trim();
          field.focus();
        });

        log.addEventListener("click", function () { closeAll(); kb.close(); });

        field.addEventListener("input", function () { send.disabled = !field.value.trim(); });
        // 키보드가 이미 올라와 있을 때 입력칸을 다시 누르면 준비된 글 시작
        field.addEventListener("click", function () {
          if (c.draft && !field.value && !autoTyping && kb.isOpen()) setTimeout(autoType, 250);
        });
        roomDraftReady = function (id) {
          // 이 방을 보고 있고 키보드가 열려 있으면 다음 준비된 글이 바로 이어서 쳐짐
          if (id === c.id && c.draft && !field.value && !autoTyping && kb.isOpen() && isTop(body)) autoType();
        };
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var text = field.value.trim();
          if (!text) return;
          // 상대가 아직 안 읽은 상태(바로 전 내 메시지에 '1')라면 새 메시지에도 '1'
          var lastMine = null;
          for (var k = c.messages.length - 1; k >= 0; k--) if (c.messages[k].from === me) { lastMine = c.messages[k]; break; }
          var msg = { from: me, text: text, time: YUSHI.now() };
          if (!group && lastMine && lastMine.unread) msg.unread = 1;
          c.messages.push(msg);
          if (c._draftTyped) { c._draftTyped = false; scheduleReply(c); }   // 준비된 글을 보내면 상대 답장 예약
          field.value = "";
          send.disabled = true;
          closeAll();
          draw();
        });
      });
    }

    /* ---------- 탭 ---------- */
    var tabs = ui.createTabs(host, [
      { id: "friends", label: "친구",    icon: ui.tabIcons.people },
      { id: "chats",   label: "채팅",    icon: ui.tabIcons.chat },
      { id: "more",    label: "더보기",  icon: ui.tabIcons.more }
    ], function (id) {
      if (id === "friends") showFriends();
      else if (id === "chats") showChats();
      else showMore();
    });

    /* ---------- 더보기 (설정) ---------- */
    // 페이지를 연 동안만 기억합니다 (새로고침하면 처음 상태)
    YUSHI.session = YUSHI.session || {};
    var SET = YUSHI.session.winkSettings = YUSHI.session.winkSettings ||
      { noti: true, preview: true, sound: true, vibe: true, autoAdd: true, recommend: true, font: "보통" };
    var FONTS = ["작게", "보통", "크게"];

    function swHTML(key, label) {
      var on = !!SET[key];
      return '<div class="grp-row"><span class="st-label">' + label + "</span>" +
        '<button type="button" class="sw' + (on ? " is-on" : "") + '" data-sw="' + key + '" role="switch" aria-checked="' + on + '" aria-label="' + label + '">' +
          '<span class="sw-on">ON</span><span class="sw-knob"></span><span class="sw-off">OFF</span></button></div>';
    }
    function goRow(go, label, value) {
      return '<button type="button" class="grp-row" data-go="' + go + '"><span class="st-label">' + label + "</span>" +
        '<span class="st-value">' + (value ? esc(value) + " " : "") + "›</span></button>";
    }

    function showMore() {
      stack.reset({ title: "더보기" }, function (body) {
        body.classList.add("wk-set");
        function draw() {
          var p = person(me);
          body.innerHTML =
            '<div class="grp"><button type="button" class="grp-row st-me">' + av(p, 40) +
              '<span class="st-label"><b>' + esc(p.name) + '</b><small class="wk-set-sub">내 프로필</small></span></button></div>' +
            '<div class="st-head">알림</div>' +
            '<div class="grp">' + swHTML("noti", "새 메시지 알림") +
              (SET.noti ? swHTML("preview", "메시지 미리보기") + swHTML("sound", "알림음") + swHTML("vibe", "진동") : "") +
            "</div>" +
            '<div class="st-head">친구</div>' +
            '<div class="grp">' + swHTML("autoAdd", "자동 친구 추가") + swHTML("recommend", "친구 추천 허용") +
              goRow("hidden", "숨김친구 관리") + goRow("blocked", "차단친구 관리") +
            "</div>" +
            '<div class="st-head">채팅</div>' +
            '<div class="grp">' + goRow("font", "글자 크기", SET.font) + "</div>" +
            '<div class="st-head">정보</div>' +
            '<div class="grp">' + goRow("notice", "공지사항") + goRow("about", "버전 정보", "1.0") + "</div>";
        }
        draw();
        body.addEventListener("click", function (e) {
          var sw = e.target.closest("[data-sw]");
          if (sw) { var k = sw.getAttribute("data-sw"); SET[k] = !SET[k]; draw(); return; }
          var r = e.target.closest("[data-go]");
          if (!r) return;
          var g = r.getAttribute("data-go");
          if (g === "font") { SET.font = FONTS[(FONTS.indexOf(SET.font) + 1) % FONTS.length]; draw(); }
          else if (g === "hidden") openEmpty("숨김친구 관리", "숨김친구가 없습니다.");
          else if (g === "blocked") openEmpty("차단친구 관리", "차단친구가 없습니다.");
          else if (g === "notice") openEmpty("공지사항", "공지사항이 없습니다.");
          else openAbout();
        });
      });
    }

    function openEmpty(title, text) {
      stack.push({ title: title, back: "더보기", full: true }, function (body) {
        body.classList.add("wk-set");
        body.innerHTML = '<p class="list-empty">' + text + "</p>";
      });
    }

    function openAbout() {
      stack.push({ title: "버전 정보", back: "더보기", full: true }, function (body) {
        body.classList.add("wk-set");
        body.innerHTML =
          '<div class="dl-about">' +
            '<span class="icon dl-about-icon" style="background:' + YUSHI.findApp("wink").bg + '">' + YUSHI.icons.wink() + "</span>" +
            '<div class="dl-about-name">Talk</div>' +
            '<div class="dl-about-ver">현재 버전 1.0 · 최신 버전입니다</div>' +
          "</div>";
      });
    }

    // 채팅 탭 위 안 읽은 메시지 합계 (홈 화면 아이콘 배지도 같이)
    function updateBadge() {
      var n = totalUnread();
      tabs.setBadge("chats", n);
      if (YUSHI.setBadge) YUSHI.setBadge("wink", n);
    }

    // 지금 보고 있는 대화방
    var roomChatId = null, roomBody = null, roomRedraw = null, roomDraftReady = null;
    function isTop(el) {
      var scr = el && el.closest(".scr");
      var all = host.querySelectorAll(".scr");
      return !!(scr && document.contains(scr) && !scr.classList.contains("is-right") && scr === all[all.length - 1]);
    }
    live = {
      isRoomOpen: function (id) { return roomChatId === id && isTop(roomBody); },
      redrawRoom: function () { if (roomRedraw) roomRedraw(); },
      refresh: function () { updateBadge(); if (listBody && isTop(listBody)) renderChatList(listBody); },
      openChat: function (id) { tabs.select("chats"); openChat(id, "채팅"); },
      draftReady: function (id) { if (roomDraftReady) roomDraftReady(id); }
    };

    YUSHI.session = YUSHI.session || {};
    var pending = YUSHI.session.winkOpenChat;
    YUSHI.session.winkOpenChat = null;
    if (pending) { tabs.select("chats"); openChat(pending, "채팅"); }
    else tabs.select("friends");
    updateBadge();

    return function cleanup() { live = null; };
  };
})();
