/*
 * Talk Story — 사진과 글을 나누는 SNS 앱
 * -----------------------------------------
 * 상단 탭: 소식 / 내 스토리 / 친구 / 더보기
 * 화면: 소식 피드 → 상세보기(감정 표현·댓글)
 *       프로필(큰 커버 + 스토리 격자) → 상세보기
 * 데이터: js/data/daylog-data.js
 *
 * 감정 표현과 새 댓글은 이 페이지를 연 동안만 남습니다.
 */
window.YUSHI = window.YUSHI || {};
YUSHI.appScreens = YUSHI.appScreens || {};

(function () {
  var ui = YUSHI.ui;

  // 감정 표현 얼굴 아이콘 (id별 색과 입 모양)
  // 감정 표현 얼굴 (eyes가 없으면 기본 눈)
  var FACE = {
    // 좋아요: 하트 볼터치 미소
    like:  { color: "#f6a5a0", mouth: '<path d="M6.5 12.2c1.6 2 5.4 2 7 0" fill="none" stroke="#7a2420" stroke-width="1.3" stroke-linecap="round"/><path d="M14.6 3.2c.6-.9 2-.6 2 .5 0 .9-1.4 1.8-2 2.3-.6-.5-2-1.4-2-2.3 0-1.1 1.4-1.4 2-.5z" fill="#e2392e"/>' },
    // 멋져요: 선글라스
    cool:  { color: "#f2c23a", eyes: '<path d="M3.6 7.2h5.6v1.6c0 1.3-1 2.2-2.4 2.2h-.8c-1.4 0-2.4-.9-2.4-2.2zM10.8 7.2h5.6v1.6c0 1.3-1 2.2-2.4 2.2h-.8c-1.4 0-2.4-.9-2.4-2.2zM9.2 7.6h1.6" fill="#2a2a2a" stroke="#2a2a2a" stroke-width=".6"/>',
             mouth: '<path d="M7.2 13.4c1.4.9 4.2.9 5.6-.4" fill="none" stroke="#5a3a10" stroke-width="1.3" stroke-linecap="round"/>' },
    // 기뻐요: 활짝 웃는 입, 눈웃음
    happy: { color: "#f0a63a", eyes: '<path d="M5.6 8.6c.6-1.2 2.2-1.2 2.8 0M11.6 8.6c.6-1.2 2.2-1.2 2.8 0" fill="none" stroke="#3a2a14" stroke-width="1.3" stroke-linecap="round"/>',
             mouth: '<path d="M6 11.5h8c0 2.6-1.8 4-4 4s-4-1.4-4-4z" fill="#5a3a10"/>' },
    // 슬퍼요: 눈물 한 방울
    sad:   { color: "#8fbbe6", mouth: '<path d="M7 14c1.8-1.4 4.2-1.4 6 0" fill="none" stroke="#1d3c5e" stroke-width="1.3" stroke-linecap="round"/><path d="M5.6 10.2c.5.8.9 1.4.9 1.9a.9.9 0 0 1-1.8 0c0-.5.4-1.1.9-1.9z" fill="#fff"/>' },
    // 힘내요: 활짝 웃는 얼굴 + 불끈 쥔 주먹
    cheer: { color: "#f39a4c", mouth: '<path d="M6.2 11.6c1.4 2.6 6.2 2.6 7.6 0" fill="none" stroke="#5a1d14" stroke-width="1.5" stroke-linecap="round"/>' +
             '<rect x="13.6" y="12.4" width="5.4" height="5.4" rx="1.6" fill="#ffd9a8" stroke="#8a4a14" stroke-width=".8"/>' +
             '<path d="M15.2 13.6v2.6M16.9 13.6v2.6" stroke="#8a4a14" stroke-width=".6"/>' }
  };
  function face(id, size) {
    var f = FACE[id] || { color: "#bbb", mouth: "" };
    return (
      '<svg class="emo" width="' + size + '" height="' + size + '" viewBox="0 0 20 20" aria-hidden="true">' +
      '<circle cx="10" cy="10" r="9" fill="' + f.color + '" stroke="rgba(0,0,0,.25)" stroke-width=".8"/>' +
      (f.eyes || '<circle cx="7" cy="8" r="1.2" fill="#3a2a14"/><circle cx="13" cy="8" r="1.2" fill="#3a2a14"/>') +
      f.mouth + "</svg>"
    );
  }

  var BUBBLE_ICON =
    '<svg class="emo" width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">' +
    '<path d="M10 3c4.4 0 8 2.7 8 6s-3.6 6-8 6c-.8 0-1.6-.1-2.3-.3L4 17l1-3.3C3.1 12.6 2 11 2 9c0-3.3 3.6-6 8-6z" fill="#a59a90"/></svg>';

  // 글만 있는 스토리 칸에 돌아가며 쓰는 바탕색
  var TILE_COLORS = ["#cfe3f2", "#f6dcc9", "#e3dcf3", "#d7ecd4", "#f3e7b8", "#f1d3dc"];

  YUSHI.appScreens.daylog = function mount(appEl) {
    var D = YUSHI.data.daylog;
    var me = D.me;
    var esc = ui.esc;

    function person(id) {
      var p = D.people[id] || { name: "알 수 없음" };
      // 프로필 사진은 Talk 프로필 사진과 같음 (wink-data.js의 photo를 바꾸면 함께 바뀜)
      // 여기(daylog-data.js)에 photo를 따로 적으면 그 사진이 우선합니다
      var talk = YUSHI.data.wink && YUSHI.data.wink.people && YUSHI.data.wink.people[id];
      if (!p.photo && talk && talk.photo) {
        var q = {};
        for (var k in p) q[k] = p[k];
        q.photo = talk.photo;
        return q;
      }
      return p;
    }
    function postById(id) {
      for (var i = 0; i < D.posts.length; i++) if (D.posts[i].id === id) return D.posts[i];
      return null;
    }
    function sortedPosts(list) {
      return list.slice().sort(function (a, b) { return ui.parseTime(b.time) - ui.parseTime(a.time); });
    }
    function postsBy(pid) { return sortedPosts(D.posts.filter(function (p) { return p.author === pid; })); }
    function reactionCount(p) {
      var n = 0;
      for (var k in p.reactions) n += p.reactions[k].length;
      return n;
    }
    function myReaction(p) {
      for (var k in p.reactions) if (p.reactions[k].indexOf(me) !== -1) return k;
      return null;
    }
    function shortDate(t) {
      var d = ui.parseTime(t);
      var y = d.getFullYear() !== YUSHI.now().getFullYear() ? d.getFullYear() + "년 " : "";   // 지난해 글은 연도까지
      return y + (d.getMonth() + 1) + "월 " + d.getDate() + "일";
    }

    appEl.classList.add("app-daylog");
    var host = document.createElement("div");
    host.className = "app-stage tabs-top";
    appEl.appendChild(host);
    var stack = ui.createStack(host);

    /* ---------- 소식 피드 ---------- */
    function photoHTML(p) {
      if (p.photo) return '<div class="post-photo"><img src="' + esc(p.photo) + '" alt=""></div>';
      if (p.photoSlot) return '<div class="post-photo post-photo-slot"><span>사진 자리</span></div>';
      return "";
    }

    function countsHTML(p) {
      return (
        '<span class="dl-counts">' +
          face(myReaction(p) || "like", 14) + "<span>" + reactionCount(p) + "</span>" +
          BUBBLE_ICON + "<span>" + p.comments.length + "</span>" +
        "</span>"
      );
    }

    function headHTML(p) {
      var a = person(p.author);
      return (
        '<div class="post-head">' +
          '<button type="button" class="post-author" data-person="' + esc(p.author) + '">' + ui.plainAvatar(a, 38) + "</button>" +
          '<div class="post-meta"><button type="button" class="post-name" data-person="' + esc(p.author) + '">' + esc(a.name) + "</button>" +
          '<span class="post-time">' + ui.relTime(p.time) + "</span></div>" +
          countsHTML(p) +
        "</div>"
      );
    }

    // 피드의 게시물: 이름 줄 + 흰 카드(글·사진)
    function postPanel(p) {
      var a = person(p.author);
      return (
        '<div class="fd-item" data-post="' + esc(p.id) + '">' +
          '<div class="fd-head">' +
            '<button type="button" class="post-author" data-person="' + esc(p.author) + '">' + ui.plainAvatar(a, 34) + "</button>" +
            '<div class="post-meta"><button type="button" class="post-name" data-person="' + esc(p.author) + '">' + esc(a.name) + "</button>" +
            '<span class="post-time">' + ui.relTime(p.time) + "</span></div>" +
          "</div>" +
          '<article class="fd-card">' +
            (p.text ? '<p class="fd-text">' + esc(p.text) + "</p>" : "") +
            photoHTML(p) +
            '<div class="fd-foot">' + countsHTML(p) + "</div>" +
          "</article>" +
        "</div>"
      );
    }

    // 피드의 활동 알림: "OO님이 프로필 사진을 변경했습니다."
    function activityPanel(ac) {
      var a = person(ac.who);
      return (
        '<div class="fd-act">' +
          '<button type="button" class="post-author" data-person="' + esc(ac.who) + '">' + ui.plainAvatar(a, 34) + "</button>" +
          '<div class="post-meta"><span class="fd-act-text">' + esc(a.name) + "님이 " + esc(ac.text) + "</span>" +
          '<span class="post-time">' + ui.relTime(ac.time) + "</span></div>" +
        "</div>"
      );
    }

    // 목록 안의 클릭: 이름/사진 → 프로필, 나머지 → 상세보기
    function wireList(body, backLabel) {
      body.addEventListener("click", function (e) {
        var who = e.target.closest("[data-person]");
        if (who) { openProfile(who.getAttribute("data-person"), backLabel); return; }
        var post = e.target.closest("[data-post]");
        if (post) openPost(post.getAttribute("data-post"), backLabel);
      });
    }

    var COMPOSE = {
      label: "스토리 쓰기",
      icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h9v2H6v11h11v-6h2v8H4z"/><path d="M17.5 3.5l3 3-8 8H9.5v-3z"/></svg>',
      onClick: function () { openCompose(); }
    };

    function showFeed() {
      var feedBody;
      function draw() {
        var items = D.posts.map(function (p) { return { t: ui.parseTime(p.time), html: postPanel(p) }; })
          .concat((D.activities || []).map(function (ac) { return { t: ui.parseTime(ac.time), html: activityPanel(ac) }; }));
        items.sort(function (x, y) { return y.t - x.t; });
        feedBody.innerHTML = items.length
          ? items.map(function (x) { return x.html; }).join("") + '<div class="fd-end">' + YUSHI.icons.daylog() + "<span>Talk Story</span></div>"
          : '<p class="list-empty">아직 올라온 소식이 없습니다.</p>';
      }
      stack.reset({ title: "Talk Story", right: COMPOSE, onShow: function () { draw(); } }, function (body) {
        feedBody = body;
        body.classList.add("dl-cream");
        draw();
        wireList(body, "소식");
      });
    }

    /* ---------- 스토리 쓰기 ---------- */
    function openCompose() {
      if (stack.depth() > 1) return;
      var withPhoto = false;
      stack.push({
        title: "스토리 쓰기", back: "취소", full: true, className: "dl-compose",
        right: { label: "올리기", onClick: function () { submit(); } }
      }, function (body) {
        body.innerHTML =
          '<textarea class="dl-write" id="dl-write" maxlength="500" placeholder="지금 무슨 생각을 하고 있나요?" aria-label="스토리 내용"></textarea>' +
          '<button type="button" class="dl-addphoto" aria-pressed="false" disabled>사진 추가</button>';
        var area = body.querySelector(".dl-write");
        var addBtn = body.querySelector(".dl-addphoto");
        ui.attachKeyboard(body, area, {});
        addBtn.addEventListener("click", function () {
          withPhoto = !withPhoto;
          addBtn.classList.toggle("is-on", withPhoto);
          addBtn.setAttribute("aria-pressed", String(withPhoto));
          addBtn.textContent = withPhoto ? "사진 자리 빼기" : "사진 자리 넣기";
        });
        submit = function () {
          var text = area.value.trim();
          if (!text && !withPhoto) { area.focus(); return; }
          D.posts.push({ id: "me-" + Date.now(), author: me, time: YUSHI.now(), text: text, photo: null,
                         photoSlot: withPhoto, reactions: {}, comments: [] });
          stack.pop();
        };
      });
    }
    var submit = function () {};

    /* ---------- 상세보기 ---------- */
    function openPost(id, backLabel) {
      var p = postById(id);
      if (!p) return;
      stack.push({ title: "상세보기", back: backLabel, backIcon: true, full: true, className: "daylog-detail" }, function (body) {
        body.innerHTML =
          '<div class="detail-scroll"><article class="dl-detail"></article></div>' +
          '<div class="emo-picker" hidden></div>' +
          '<form class="chat-input comment-input" autocomplete="off">' +
            '<button type="button" class="emo-toggle" aria-label="감정 표현 고르기" aria-expanded="false"></button>' +
            '<input type="text" class="chat-field" id="daylog-field-' + esc(p.id) + '" aria-label="댓글 입력" maxlength="200" placeholder="댓글을 남겨 주세요">' +
            '<button type="submit" class="chat-send" disabled>전송</button>' +
          "</form>";

        var art = body.querySelector(".dl-detail");
        var scroller = body.querySelector(".detail-scroll");
        var picker = body.querySelector(".emo-picker");
        var toggle = body.querySelector(".emo-toggle");
        var form = body.querySelector(".comment-input");
        var field = form.querySelector(".chat-field");
        var send = form.querySelector(".chat-send");

        // 화면 속 iOS 6 키보드
        var kb = ui.attachKeyboard(body, field, {
          onOpen: function () { setPicker(false); scroller.scrollTop = scroller.scrollHeight; }
        });
        scroller.addEventListener("click", function (e) { if (!e.target.closest("button")) kb.close(); });

        function reactedPeople() {
          var list = [];
          D.reactions.forEach(function (r) {
            (p.reactions[r.id] || []).forEach(function (pid) { list.push({ pid: pid, rid: r.id }); });
          });
          return list;
        }

        function draw() {
          var who = reactedPeople();
          var mine = myReaction(p);
          art.innerHTML =
            headHTML(p).replace("post-head", "post-head dl-detail-head") +
            (p.text ? '<p class="dl-detail-text">' + esc(p.text) + "</p>" : "") +
            photoHTML(p) +
            (who.length
              ? '<div class="dl-reacted">' + who.map(function (w) {
                  var a = person(w.pid);
                  return (
                    '<button type="button" class="dl-reactor" data-person="' + esc(w.pid) + '">' +
                      '<span class="dl-reactor-pic">' + ui.plainAvatar(a, 36) + '<span class="dl-reactor-emo">' + face(w.rid, 15) + "</span></span>" +
                      '<span class="dl-reactor-name">' + esc(a.name) + "</span>" +
                    "</button>"
                  );
                }).join("") + "</div>"
              : '<div class="dl-reacted dl-reacted-empty">아직 감정 표현이 없습니다.</div>') +
            '<div class="dl-comments">' +
              (p.comments.length
                ? p.comments.map(function (c) {
                    var a = person(c.from);
                    return (
                      '<div class="comment">' +
                        '<button type="button" class="post-author" data-person="' + esc(c.from) + '">' + ui.plainAvatar(a, 30) + "</button>" +
                        '<div class="comment-main"><span class="comment-name">' + esc(a.name) + "</span>" +
                        '<span class="comment-text">' +
                          // 답글: to에 적은 사람 이름이 파란 글씨로 앞에 붙음
                          (c.to ? '<span class="comment-to">' + esc(person(c.to).name) + "</span> " : "") +
                          esc(c.text) + "</span></div>" +
                        '<span class="comment-date">' + shortDate(c.time) + "</span>" +
                      "</div>"
                    );
                  }).join("")
                : '<p class="comments-empty">첫 댓글을 남겨 보세요.</p>') +
            "</div>";

          toggle.innerHTML = face(mine || "like", 24);
          toggle.classList.toggle("is-on", !!mine);
          picker.innerHTML = D.reactions.map(function (r) {
            return (
              '<button type="button" class="emo-choice' + (mine === r.id ? " is-on" : "") + '" data-react="' + esc(r.id) + '" aria-pressed="' + (mine === r.id) + '">' +
                face(r.id, 28) + "<span>" + esc(r.label) + "</span></button>"
            );
          }).join("");
        }
        draw();

        function setPicker(open) {
          picker.hidden = !open;
          toggle.setAttribute("aria-expanded", String(open));
        }

        toggle.addEventListener("click", function () { kb.close(); setPicker(picker.hidden); });

        picker.addEventListener("click", function (e) {
          var r = e.target.closest("[data-react]");
          if (!r) return;
          var id = r.getAttribute("data-react");
          var had = myReaction(p);
          // 한 사람은 감정 하나만: 기존 것을 지우고, 같은 것을 다시 누르면 취소
          if (had) p.reactions[had] = p.reactions[had].filter(function (x) { return x !== me; });
          if (had !== id) (p.reactions[id] = p.reactions[id] || []).push(me);
          setPicker(false);
          draw();
        });

        art.addEventListener("click", function (e) {
          var who = e.target.closest("[data-person]");
          if (who) openProfile(who.getAttribute("data-person"), "상세보기");
        });

        field.addEventListener("input", function () { send.disabled = !field.value.trim(); });
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var text = field.value.trim();
          if (!text) return;
          p.comments.push({ from: me, text: text, time: YUSHI.now() });
          field.value = "";
          send.disabled = true;
          setPicker(false);
          draw();
          scroller.scrollTop = scroller.scrollHeight;
        });
      });
    }

    /* ---------- 프로필: 큰 사진 + 이름·숫자·생일 + 스토리 격자 ---------- */
    var ICON_STORY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 2.4a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 0 0 0-11.2z"/><path d="M9 6h2v4.2l2.6 1.8-1.1 1.6L9 11.2z"/></svg>';
    var ICON_FRIENDS = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="7" cy="6.5" r="3"/><path d="M1.5 16c.5-3.6 2.6-5.6 5.5-5.6s5 2 5.5 5.6z"/><circle cx="14" cy="6" r="2.5"/><path d="M13 9.9c3.1-.2 5 1.7 5.5 5.1h-4.4c-.2-2-.6-3.6-1.1-5.1z"/></svg>';

    function birthdayText(b) {
      if (!b) return "";
      var m = /^(\d{1,2})-(\d{1,2})$/.exec(b);
      if (!m) return "";
      function two(n) { return (n.length < 2 ? "0" : "") + n; }
      return two(m[1]) + "월 " + two(m[2]) + "일생";
    }

    function profileHTML(pid) {
      var a = person(pid);
      var posts = postsBy(pid);
      // cover: 이미지 경로 / "white"(하얀 단색 배경)
      var white = a.cover === "white";
      var coverPhoto = white ? null : (a.cover || (posts.filter(function (p) { return p.photo; })[0] || {}).photo);
      var cover = coverPhoto ? '<img class="dl-cover-img" src="' + esc(coverPhoto) + '" alt="">' : "";
      var friendN = typeof a.friendCount === "number" ? a.friendCount : (pid === me ? D.friends.length : 0);

      var tiles = posts.map(function (p, i) {
        var inner;
        if (p.photo) inner = '<img src="' + esc(p.photo) + '" alt="">';
        else if (p.photoSlot) inner = '<span class="tile-slot">사진</span>';
        else inner = '<span class="tile-text" style="background:' + TILE_COLORS[i % TILE_COLORS.length] + '">' + esc(p.text) + "</span>";
        return '<button type="button" class="dl-tile" data-post="' + esc(p.id) + '" aria-label="' + esc(shortDate(p.time)) + ' 스토리">' + inner + "</button>";
      }).join("");

      return (
        '<div class="dl-hero2' + (white ? " dl-hero-white" : "") + '" style="--pcolor:' + esc(a.color || "#8a8fa8") + '">' + cover +
          '<div class="dl-hero-shade"></div>' +
          '<div class="dl-hero2-who">' +
            ui.plainAvatar(a, 92, "dl-hero2-thumb") +
            '<div class="dl-hero2-text">' +
              '<div class="dl-hero2-name">' + esc(a.name) + "</div>" +
              '<div class="dl-hero2-meta">' +
                '<span class="dl-meta-i">' + ICON_STORY + posts.length + "</span>" +
                '<span class="dl-meta-i">' + ICON_FRIENDS + friendN + "</span>" +
                (a.birthday ? "<span>" + birthdayText(a.birthday) + "</span>" : "") +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
        (a.status ? '<div class="dl-intro2">' + esc(a.status) + "</div>" : "") +
        (posts.length
          ? '<div class="dl-grid">' + tiles + "</div>"
          : '<p class="list-empty">아직 올린 스토리가 없습니다.</p>')
      );
    }

    function wireProfile(body, backLabel) {
      body.addEventListener("click", function (e) {
        var t = e.target.closest("[data-post]");
        if (t) openPost(t.getAttribute("data-post"), backLabel);
      });
    }

    function openProfile(pid, backLabel) {
      stack.push({ title: person(pid).name, back: backLabel, backIcon: true, full: true, className: "daylog-profile" }, function (body) {
        body.classList.add("dl-cream");
        body.innerHTML = profileHTML(pid);
        wireProfile(body, person(pid).name);
      });
    }

    function showMine() {
      var mineBody;
      stack.reset({
        title: "Talk Story", right: COMPOSE,
        className: "daylog-profile",
        onShow: function () { mineBody.innerHTML = profileHTML(me); }
      }, function (body) {
        mineBody = body;
        body.classList.add("dl-cream");
        body.innerHTML = profileHTML(me);
        wireProfile(body, "내 스토리");
      });
    }

    /* ---------- 친구: 검색 + 친구 / 친구추천 / 받은신청 ---------- */
    var CHO_ALL = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
    function initials(name) {
      var out = "";
      for (var i = 0; i < name.length; i++) {
        var n = name.charCodeAt(i) - 0xac00;
        out += n >= 0 && n < 11172 ? CHO_ALL[Math.floor(n / 588)] : name.charAt(i);
      }
      return out;
    }
    // 이름이나 초성으로 찾기 (예: "ㅅㅇ" → 시온)
    function matches(name, q) {
      if (!q) return true;
      if (name.indexOf(q) !== -1) return true;
      return /^[ㄱ-ㅎ]+$/.test(q) && initials(name).indexOf(q) !== -1;
    }

    function showFriends() {
      var seg = "friends", query = "", listEl, segEl;

      function row(id, side) {
        var a = person(id);
        return (
          '<div class="fr-row">' +
            '<button type="button" class="fr-main" data-person="' + esc(id) + '">' + ui.plainAvatar(a, 34) +
              '<span class="fr-name">' + esc(a.name) + "</span></button>" + side +
          "</div>"
        );
      }

      function drawList() {
        var html = "";
        if (seg === "friends") {
          var ids = D.friends.filter(function (id) { return matches(person(id).name, query); });
          html = '<div class="fr-head"><span>친구</span><span class="fr-col">' + ICON_STORY + '</span><span class="fr-col">' + ICON_FRIENDS + "</span></div>" +
            (ids.length
              ? ids.map(function (id) {
                  var a = person(id);
                  return row(id, '<span class="fr-num">' + postsBy(id).length + '</span><span class="fr-num">' + (a.friendCount || 0) + "</span>");
                }).join("")
              : '<p class="list-empty">' + (query ? "검색 결과가 없습니다." : "아직 친구가 없습니다.") + "</p>");
        } else if (seg === "suggest") {
          var sug = (D.suggestions || []).filter(function (id) { return matches(person(id).name, query); });
          html = '<div class="fr-head"><span>추천 친구 (' + sug.length + ")</span></div>" +
            (sug.length
              ? sug.map(function (id) {
                  var sent = (D.sent || []).indexOf(id) !== -1;
                  return row(id, '<button type="button" class="fr-btn' + (sent ? " is-done" : "") + '" data-ask="' + esc(id) + '"' + (sent ? " disabled" : "") + ">" + (sent ? "신청됨" : "친구신청") + "</button>");
                }).join("")
              : '<p class="list-empty">추천 친구가 없습니다.</p>');
        } else {
          var req = D.requests || [];
          html = '<div class="fr-head"><span>받은 신청 (' + req.length + ")</span></div>" +
            (req.length
              ? req.map(function (id) {
                  return row(id, '<button type="button" class="fr-btn fr-accept" data-accept="' + esc(id) + '">수락</button>');
                }).join("")
              : '<p class="list-empty">받은 친구 신청이 없습니다.</p>');
        }
        listEl.innerHTML = html;
        segEl.innerHTML =
          '<button type="button" data-seg="friends"' + (seg === "friends" ? ' class="is-on"' : "") + ">친구(" + D.friends.length + ")</button>" +
          '<button type="button" data-seg="suggest"' + (seg === "suggest" ? ' class="is-on"' : "") + ">친구추천</button>" +
          '<button type="button" data-seg="requests"' + (seg === "requests" ? ' class="is-on"' : "") + ">받은신청</button>";
      }

      stack.reset({ title: "Talk Story", right: COMPOSE, className: "dl-friends", onShow: function () { drawList(); } }, function (body) {
        body.classList.add("dl-cream");
        body.innerHTML =
          '<div class="fr-search"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12.5 12.5l4.5 4.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
            '<input type="text" class="fr-field" id="dl-friend-search" placeholder="이름, 초성으로 검색" aria-label="친구 검색" maxlength="20"></div>' +
          '<div class="fr-list"></div>' +
          '<div class="fr-seg" role="group" aria-label="친구 목록 종류"></div>';
        listEl = body.querySelector(".fr-list");
        segEl = body.querySelector(".fr-seg");
        var field = body.querySelector(".fr-field");
        var kb = ui.attachKeyboard(body, field, {});
        drawList();

        field.addEventListener("input", function () { query = field.value.trim(); drawList(); });
        listEl.addEventListener("click", function (e) {
          var ask = e.target.closest("[data-ask]");
          if (ask) { (D.sent = D.sent || []).push(ask.getAttribute("data-ask")); drawList(); return; }
          var acc = e.target.closest("[data-accept]");
          if (acc) {
            var id = acc.getAttribute("data-accept");
            D.requests = D.requests.filter(function (x) { return x !== id; });
            if (D.friends.indexOf(id) === -1) D.friends.push(id);
            drawList();
            return;
          }
          var who = e.target.closest("[data-person]");
          if (who) { kb.close(); openProfile(who.getAttribute("data-person"), "친구"); }
        });
        segEl.addEventListener("click", function (e) {
          var b = e.target.closest("[data-seg]");
          if (!b) return;
          seg = b.getAttribute("data-seg");
          kb.close();
          drawList();
        });
      });
    }

    /* ---------- 설정 ---------- */
    var SETTINGS = D.settings || (D.settings = {});
    var NOTI = [
      ["newStory", "새 소식 알림"],
      ["comment", "댓글 알림"],
      ["feeling", "느낌 알림"],
      ["request", "친구 신청 알림"]
    ];
    var SCOPES = ["전체 공개", "친구 공개", "나만 보기"];

    function showSettings() {
      stack.reset({ title: "설정" }, function (body) {
        body.classList.add("dl-cream");
        function draw() {
          var p = person(me);
          body.innerHTML =
            '<div class="st-head">내 정보</div>' +
            '<div class="grp"><button type="button" class="grp-row st-me" data-go="profile">' + ui.plainAvatar(p, 34) +
              '<span class="st-label">' + esc(p.name) + '</span><span class="st-chev">내 스토리 ›</span></button></div>' +
            '<div class="st-head">알림</div>' +
            '<div class="grp">' +
              NOTI.map(function (n) {
                var on = SETTINGS[n[0]] !== false;
                return '<div class="grp-row"><span class="st-label">' + n[1] + "</span>" +
                  '<button type="button" class="sw' + (on ? " is-on" : "") + '" data-sw="' + n[0] + '" role="switch" aria-checked="' + on + '" aria-label="' + n[1] + '">' +
                    '<span class="sw-on">ON</span><span class="sw-knob"></span><span class="sw-off">OFF</span></button></div>';
              }).join("") +
            "</div>" +
            '<div class="st-head">공개 설정</div>' +
            '<div class="grp"><button type="button" class="grp-row" data-go="scope"><span class="st-label">스토리 공개 범위</span>' +
              '<span class="st-value">' + (SETTINGS.scope || SCOPES[1]) + " ›</span></button></div>" +
            '<div class="st-head">정보</div>' +
            '<div class="grp">' +
              '<button type="button" class="grp-row" data-go="notice"><span class="st-label">공지사항</span><span class="st-chev">›</span></button>' +
              '<button type="button" class="grp-row" data-go="about"><span class="st-label">버전 정보</span><span class="st-value">1.0 ›</span></button>' +
            "</div>";
        }
        draw();
        body.addEventListener("click", function (e) {
          var sw = e.target.closest("[data-sw]");
          if (sw) {
            var k = sw.getAttribute("data-sw");
            SETTINGS[k] = SETTINGS[k] === false;
            draw();
            return;
          }
          var go = e.target.closest("[data-go]");
          if (!go) return;
          var g = go.getAttribute("data-go");
          if (g === "profile") openProfile(me, "설정");
          else if (g === "scope") {
            var cur = SCOPES.indexOf(SETTINGS.scope || SCOPES[1]);
            SETTINGS.scope = SCOPES[(cur + 1) % SCOPES.length];
            draw();
          } else if (g === "notice") openNotice();
          else openAbout();
        });
      });
    }

    function openNotice() {
      stack.push({ title: "공지사항", back: "설정", backIcon: true, full: true }, function (body) {
        body.classList.add("dl-cream");
        body.innerHTML = '<p class="list-empty">공지사항이 없습니다.</p>';
      });
    }

    function openAbout() {
      stack.push({ title: "버전 정보", back: "설정", backIcon: true, full: true }, function (body) {
        body.classList.add("dl-cream");
        body.innerHTML =
          '<div class="dl-about">' +
            '<span class="icon dl-about-icon" style="background:' + YUSHI.findApp("daylog").bg + '">' + YUSHI.icons.daylog() + "</span>" +
            '<div class="dl-about-name">Talk Story</div>' +
            '<div class="dl-about-ver">버전 1.0 · 창작 프로젝트용 가상 앱</div>' +
          "</div>";
      });
    }

    /* ---------- 상단 탭 ---------- */
    var TAB_FEED = '<svg viewBox="0 0 30 30" aria-hidden="true"><path fill-rule="evenodd" d="M15 4a11 11 0 1 1 0 22 11 11 0 0 1 0-22zm0 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"/><path d="M13.6 9h2.8v5.8l3.8 2.6-1.6 2.3-5-3.5z"/></svg>';
    var TAB_GEAR = (function () {
      var pts = [], n = 8, step = Math.PI * 2 / n;
      for (var k = 0; k < n * 4; k++) {
        var ang = k * step / 4 - Math.PI / 2, r = (k % 4 === 1 || k % 4 === 2) ? 12 : 9;
        pts.push((15 + r * Math.cos(ang)).toFixed(1) + " " + (15 + r * Math.sin(ang)).toFixed(1));
      }
      return '<svg viewBox="0 0 30 30" aria-hidden="true"><path fill-rule="evenodd" d="M' + pts.join("L") + 'Z M19 15a4 4 0 1 0-8 0 4 4 0 0 0 8 0z"/></svg>';
    })();

    var tabs = ui.createTabs(host, [
      { id: "feed",     label: "소식",     icon: TAB_FEED },
      { id: "mine",     label: "내 스토리", icon: ui.tabIcons.person },
      { id: "friends",  label: "친구",     icon: ui.tabIcons.people },
      { id: "settings", label: "설정",     icon: TAB_GEAR }
    ], function (id) {
      if (id === "feed") showFeed();
      else if (id === "mine") showMine();
      else if (id === "friends") showFriends();
      else showSettings();
    });

    tabs.select("feed");
  };
})();
