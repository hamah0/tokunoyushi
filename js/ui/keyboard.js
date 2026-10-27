/*
 * iOS 6 한글 키보드
 * -----------------------------------------
 * 휴대폰 화면 안에 그려지는 두벌식 키보드입니다.
 *   var kb = YUSHI.ui.attachKeyboard(화면body, 입력칸, { onOpen, onClose });
 *   입력칸을 누르면 아래에서 올라오고, '완료'를 누르면 내려갑니다.
 *
 * - 한글 / 영어 / 이모티콘 (지구본 버튼으로 차례로 바뀜) / 숫자·기호(123 버튼)
 * - 컴퓨터 키보드로 직접 쳐도 입력됩니다.
 * - 휴대폰으로 볼 때는 실제 휴대폰 키보드가 뜨지 않도록 막아 둡니다 (inputmode="none").
 */
window.YUSHI = window.YUSHI || {};
YUSHI.ui = YUSHI.ui || {};

(function () {
  var ui = YUSHI.ui;

  /* ---------- 한글 조합 ---------- */
  var CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
  var JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
  var JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ",
              "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
  var VCOMB = { "ㅗㅏ": "ㅘ", "ㅗㅐ": "ㅙ", "ㅗㅣ": "ㅚ", "ㅜㅓ": "ㅝ", "ㅜㅔ": "ㅞ", "ㅜㅣ": "ㅟ", "ㅡㅣ": "ㅢ" };
  var FCOMB = { "ㄱㅅ": "ㄳ", "ㄴㅈ": "ㄵ", "ㄴㅎ": "ㄶ", "ㄹㄱ": "ㄺ", "ㄹㅁ": "ㄻ", "ㄹㅂ": "ㄼ",
                "ㄹㅅ": "ㄽ", "ㄹㅌ": "ㄾ", "ㄹㅍ": "ㄿ", "ㄹㅎ": "ㅀ", "ㅂㅅ": "ㅄ" };
  var VSPLIT = {}, FSPLIT = {};
  for (var k in VCOMB) VSPLIT[VCOMB[k]] = k;
  for (var f in FCOMB) FSPLIT[FCOMB[f]] = f;

  function decompose(ch) {
    if (!ch) return null;
    var n = ch.charCodeAt(0) - 0xac00;
    if (n < 0 || n > 11171) return null;
    return { c: CHO[Math.floor(n / 588)], v: JUNG[Math.floor((n % 588) / 28)], f: JONG[n % 28] };
  }
  function compose(c, v, f) {
    return String.fromCharCode(0xac00 + (CHO.indexOf(c) * 21 + JUNG.indexOf(v)) * 28 + JONG.indexOf(f || ""));
  }
  function isVowel(j) { return JUNG.indexOf(j) !== -1; }
  function isJamo(j) { return isVowel(j) || CHO.indexOf(j) !== -1 || JONG.indexOf(j) > 0; }

  // 마지막 글자에 자모 하나를 더함
  function typeJamo(text, j) {
    var last = text.slice(-1), head = text.slice(0, -1), s = decompose(last);
    if (isVowel(j)) {
      if (s) {
        if (s.f) {
          var sp = FSPLIT[s.f];
          if (sp) return head + compose(s.c, s.v, sp[0]) + compose(sp[1], j);
          if (CHO.indexOf(s.f) !== -1) return head + compose(s.c, s.v, "") + compose(s.f, j);
        } else if (VCOMB[s.v + j]) {
          return head + compose(s.c, VCOMB[s.v + j], "");
        }
      } else if (last && CHO.indexOf(last) !== -1) {
        return head + compose(last, j, "");
      } else if (last && VCOMB[last + j]) {
        return head + VCOMB[last + j];
      }
      return text + j;
    }
    if (s) {
      if (!s.f && JONG.indexOf(j) > 0) return head + compose(s.c, s.v, j);
      if (s.f && FCOMB[s.f + j]) return head + compose(s.c, s.v, FCOMB[s.f + j]);
    }
    return text + j;
  }

  // 한 번 지울 때 자모 하나씩
  function backspace(text) {
    if (!text) return "";
    var code = text.charCodeAt(text.length - 1);
    // 이모지는 한 번에 통째로 지움 (국기처럼 여러 글자로 된 것 포함)
    if ((code >= 0xdc00 && code <= 0xdfff) || code === 0xfe0f || code === 0x20e3) {
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        var segs = Array.from(new Intl.Segmenter("ko", { granularity: "grapheme" }).segment(text));
        return text.slice(0, segs[segs.length - 1].index);
      }
      var cut = code === 0xfe0f ? 1 : 0;
      var t = text.slice(0, text.length - cut);
      var c2 = t.charCodeAt(t.length - 1);
      return c2 >= 0xdc00 && c2 <= 0xdfff ? t.slice(0, -2) : t.slice(0, -1);
    }
    var last = text.slice(-1), head = text.slice(0, -1), s = decompose(last);
    if (s) {
      if (s.f) return head + compose(s.c, s.v, FSPLIT[s.f] ? FSPLIT[s.f][0] : "");
      if (VSPLIT[s.v]) return head + compose(s.c, VSPLIT[s.v][0], "");
      return head + s.c;
    }
    if (VSPLIT[last]) return head + VSPLIT[last][0];
    return head;
  }

  ui.hangul = { type: typeJamo, back: backspace };

  /* ---------- 자판 배열 ---------- */
  var ROW3_KO = ["ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ"];
  var LAYOUT = {
    ko:      [["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ"], ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"], ROW3_KO],
    koShift: [["ㅃ", "ㅉ", "ㄸ", "ㄲ", "ㅆ", "ㅛ", "ㅕ", "ㅑ", "ㅒ", "ㅖ"], ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"], ROW3_KO],
    en:      [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], ["a", "s", "d", "f", "g", "h", "j", "k", "l"], ["z", "x", "c", "v", "b", "n", "m"]],
    num:     [["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], ["-", "/", ":", ";", "(", ")", "₩", "&", "@", "\""], [".", ",", "?", "!", "'"]]
  };

  /* ---------- 이모티콘 (2010년 유니코드 6.0에 있던 것만) ----------
   * 그림은 보는 사람 기기의 이모지 글꼴로 그려집니다.
   * (아이폰·맥에서는 애플 이모지, 윈도우·안드로이드에서는 각 기기의 이모지)
   */
  function split(str) { return str.split(" "); }
  var EMOJI = [
    { id: "face", label: "얼굴", list: split(
      "😄 😊 😃 ☺️ 😉 😍 😘 😚 😳 😌 😁 😜 😝 😒 😏 😓 😔 😞 😖 😥 😰 😨 😣 😢 😭 😂 😲 😱 😠 😡 😪 😷 👿 👽 " +
      "💛 💙 💜 💗 💚 ❤️ 💔 💓 💘 ✨ ⭐ 🌟 💢 ❗ ❓ 💤 💨 💦 🎶 🎵 🔥 💩 👍 👎 👌 👊 ✊ ✌️ 👋 ✋ 👐 👆 👇 👉 👈 🙌 🙏 ☝️ 👏 💪 " +
      "🚶 🏃 👫 💃 👯 🙆 🙅 💁 🙇 💏 💑 💆 💇 💅 👦 👧 👩 👨 👶 👵 👴 👱 👲 👳 👷 👮 👼 👸 💂 💀 👣 💋 👄 👂 👀 👃") },
    { id: "nature", label: "자연", list: split(
      "☀️ ☔ ☁️ ⛄ 🌙 ⚡ 🌀 🌊 🌈 🌸 🌷 🍀 🌹 🌻 🌺 🍁 🍃 🍂 🌴 🌵 🌾 🐚 " +
      "🐱 🐶 🐭 🐹 🐰 🐺 🐸 🐯 🐨 🐻 🐷 🐮 🐗 🐵 🐒 🐴 🐎 🐫 🐑 🐘 🐍 🐦 🐤 🐔 🐧 🐛 🐙 🐠 🐟 🐳 🐬") },
    { id: "objects", label: "사물", list: split(
      "🎍 💝 🎎 🎒 🎓 🎏 🎆 🎇 🎐 🎑 🎃 👻 🎅 🎄 🎁 🔔 🎉 🎈 💿 📀 📷 🎥 💻 📺 📱 ☎️ 📻 🔍 🔒 🔑 ✂️ 🔨 💡 📩 📮 🛀 💺 💰 💣 🔫 💊 💉 " +
      "🏈 🏀 ⚽ ⚾ 🎾 ⛳ 🎱 🏊 🏄 🎿 ♠️ ♥️ ♣️ ♦️ 🏆 👾 🎯 🀄 🎬 📝 📖 🎨 🎤 🎧 🎺 🎷 🎸 " +
      "👟 👠 👢 👕 👔 👗 👘 👙 🎀 🎩 👑 👒 🌂 💼 👜 💄 💍 💎 " +
      "☕ 🍵 🍺 🍻 🍸 🍶 🍴 🍔 🍟 🍝 🍛 🍱 🍣 🍙 🍘 🍚 🍜 🍲 🍞 🍳 🍢 🍡 🍦 🍧 🎂 🍰 🍎 🍊 🍉 🍓 🍆 🍅") },
    { id: "places", label: "장소", list: split(
      "🏠 🏫 🏢 🏣 🏥 🏦 🏪 🏩 🏨 💒 ⛪ 🏬 🌇 🌆 🏯 🏰 ⛺ 🏭 🗼 🗻 🌄 🌅 🌃 🗽 🎡 ⛲ 🎢 " +
      "🚢 🚤 ⛵ ✈️ 🚀 🚲 🚙 🚗 🚕 🚌 🚓 🚒 🚑 🚚 🚃 🚉 🚄 🚅 🎫 ⛽ 🚥 ⚠️ 🚧 🔰 🎰 🚏 💈 ♨️ 🏁 🎌 🇰🇷 🇯🇵 🇺🇸 🇬🇧 🇫🇷 🇩🇪 🇮🇹 🇪🇸 🇷🇺 🇨🇳") },
    { id: "symbols", label: "기호", list: split(
      "⬆️ ⬇️ ⬅️ ➡️ ↗️ ↖️ ↘️ ↙️ ◀️ ▶️ ⏪ ⏩ 🆗 🆕 🔝 🆙 🆒 🎦 📶 🚻 🚹 🚺 🚼 🚭 🅿️ ♿ 🚇 🚾 ㊙️ ㊗️ 🔞 🆔 " +
      "✳️ ✴️ 💟 🆚 📳 📴 💹 💱 ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ⛎ 🔯 🅰️ 🅱️ 🆎 🅾️ 🔴 🔲 🔳 " +
      "🕛 🕐 🕑 🕒 🕓 🕔 🕕 🕖 🕗 🕘 🕙 🕚 ⭕ ❌ ©️ ®️ ™️") }
  ];
  var recentEmoji = [];   // 최근 사용 (페이지를 연 동안 모든 입력칸이 함께 씀)

  function stroke(body) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + body + "</g></svg>";
  }
  var CAT_ICON = {
    recent: stroke('<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>'),
    face: stroke('<circle cx="12" cy="12" r="8.5"/><path d="M8.3 14.2c1.9 2.4 5.5 2.4 7.4 0"/><path d="M9 9.6v.6M15 9.6v.6"/>'),
    nature: stroke('<circle cx="12" cy="11" r="2.2"/><path d="M12 8.8c-1-3 2-4.8 3-2.4.7 1.7-1.2 3.1-3 2.4zM14.2 11c3-1 4.8 2 2.4 3-1.7.7-3.1-1.2-2.4-3zM12 13.2c1 3-2 4.8-3 2.4-.7-1.7 1.2-3.1 3-2.4zM9.8 11c-3 1-4.8-2-2.4-3 1.7-.7 3.1 1.2 2.4 3zM12 13v8"/>'),
    objects: stroke('<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5z"/><path d="M10.3 20.2a1.8 1.8 0 0 0 3.4 0M12 3.5v2"/>'),
    places: stroke('<path d="M4.5 15.5l1.8-5.2A2 2 0 0 1 8.2 9h7.6a2 2 0 0 1 1.9 1.3l1.8 5.2v3h-15z"/><path d="M4.5 15.5h15"/><circle cx="8" cy="18.5" r="1.4"/><circle cx="16" cy="18.5" r="1.4"/>'),
    symbols: stroke('<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M8 10h3M9.5 8.5v3M13.5 15.5l3-3M13 10h4M8 14.5h3"/>')
  };

  var SVG_SHIFT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l8.5 9h-4.8V20H8.3v-7.5H3.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  var SVG_BACK = '<svg viewBox="0 0 28 20" aria-hidden="true"><path d="M9 2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9L1 10z" fill="currentColor"/><path d="M12.5 6l8 8M20.5 6l-8 8" stroke="#7d8492" stroke-width="2.2" stroke-linecap="round"/></svg>';
  var SVG_GLOBE = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3.5 9h17M3.5 15h17M12 3v18"/></g></svg>';

  /* ---------- 키보드 붙이기 ---------- */
  ui.attachKeyboard = function (host, field, opts) {
    opts = opts || {};
    var lang = "ko", shift = false, num = false, isOpen = false;
    var emojiCat = null;   // 이모티콘 화면에서 고른 분류
    var esc = ui.esc;

    var kb = document.createElement("div");
    kb.className = "kb";
    kb.setAttribute("role", "group");
    kb.setAttribute("aria-label", "키보드");
    host.appendChild(kb);

    field.setAttribute("inputmode", "none");
    field.setAttribute("autocomplete", "off");
    field.setAttribute("autocorrect", "off");
    field.setAttribute("autocapitalize", "off");
    field.setAttribute("spellcheck", "false");

    function rows() {
      if (num) return LAYOUT.num;
      if (lang === "ko") return shift ? LAYOUT.koShift : LAYOUT.ko;
      if (!shift) return LAYOUT.en;
      return LAYOUT.en.map(function (r) { return r.map(function (c) { return c.toUpperCase(); }); });
    }

    function charKey(c) {
      return '<button type="button" class="kb-key" data-ch="' + esc(c) + '">' + esc(c) + "</button>";
    }
    function fnKey(html, cls, act, label) {
      return '<button type="button" class="kb-key ' + cls + '" data-act="' + act + '"' +
        (label ? ' aria-label="' + label + '"' : "") + ">" + html + "</button>";
    }

    // 한 쪽(7칸 × 3줄)마다 왼쪽에서 오른쪽으로 채워지도록 순서를 바꿈
    function pageOrder(list) {
      var out = [], per = 21;
      for (var p = 0; p * per < list.length; p++) {
        for (var c = 0; c < 7; c++) for (var r = 0; r < 3; r++) {
          out.push(list[p * per + r * 7 + c] || null);
        }
      }
      return out;
    }

    function renderEmoji() {
      if (!emojiCat) emojiCat = recentEmoji.length ? "recent" : "face";
      var cat = null;
      for (var i = 0; i < EMOJI.length; i++) if (EMOJI[i].id === emojiCat) cat = EMOJI[i];
      var list = emojiCat === "recent" ? recentEmoji : cat.list;
      var label = emojiCat === "recent" ? "최근 사용" : cat.label;
      var tabs = [{ id: "recent", label: "최근 사용" }].concat(EMOJI);
      kb.classList.add("kb-emoji");
      kb.classList.remove("kb-num");
      kb.innerHTML =
        '<div class="kb-emo-label">' + label + "</div>" +
        '<div class="kb-emo-grid">' +
          (list.length
            ? pageOrder(list).map(function (e) {
                return e ? '<button type="button" class="kb-emo" data-emo="' + esc(e) + '" aria-label="' + esc(e) + '">' + e + "</button>"
                         : '<span class="kb-emo-blank"></span>';
              }).join("")
            : '<p class="kb-emo-empty">최근에 사용한 이모티콘이 없습니다.</p>') +
        "</div>" +
        '<div class="kb-emo-bar">' +
          fnKey(SVG_GLOBE, "kb-emo-tab", "globe", "한글로 전환") +
          tabs.map(function (t) {
            return '<button type="button" class="kb-key kb-emo-tab' + (t.id === emojiCat ? " is-on" : "") + '" data-cat="' + t.id + '" aria-label="' + t.label + '">' + CAT_ICON[t.id] + "</button>";
          }).join("") +
          fnKey(SVG_BACK, "kb-emo-tab kb-emo-back", "back", "지우기") +
        "</div>";
    }

    function render() {
      if (lang === "emoji") { renderEmoji(); return; }
      kb.classList.remove("kb-emoji");
      var r = rows();
      kb.classList.toggle("kb-num", num);
      kb.innerHTML =
        '<div class="kb-row">' + r[0].map(charKey).join("") + "</div>" +
        '<div class="kb-row">' + r[1].map(charKey).join("") + "</div>" +
        '<div class="kb-row kb-row3">' +
          (num ? '<span class="kb-spacer"></span>'
               : fnKey(SVG_SHIFT, "kb-fn kb-shift" + (shift ? " is-on" : ""), "shift", "Shift")) +
          '<span class="kb-mid">' + r[2].map(charKey).join("") + "</span>" +
          fnKey(SVG_BACK, "kb-fn kb-back", "back", "지우기") +
        "</div>" +
        '<div class="kb-row kb-row4">' +
          fnKey(num ? (lang === "ko" ? "한글" : "ABC") : "123", "kb-fn kb-123", "num", num ? "글자 자판" : "숫자 자판") +
          fnKey(SVG_GLOBE, "kb-fn kb-globe", "globe", lang === "ko" ? "영어로 전환" : "이모티콘으로 전환") +
          fnKey(lang === "ko" ? "간격" : "space", "kb-space", "space", "띄어쓰기") +
          fnKey(esc(opts.returnLabel || "완료"), "kb-return", "done", "키보드 닫기") +
        "</div>";
    }

    function setValue(v) {
      if (field.maxLength > 0 && v.length > field.maxLength) return;
      field.value = v;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      try { field.setSelectionRange(v.length, v.length); } catch (e) { /* 일부 입력칸은 지원 안 함 */ }
    }

    function insert(ch) {
      var v = field.value;
      setValue(lang === "ko" && !num && isJamo(ch) ? typeJamo(v, ch) : v + ch);
    }

    // 버튼을 눌러도 입력칸 포커스가 빠지지 않게
    kb.addEventListener("mousedown", function (e) { e.preventDefault(); });

    kb.addEventListener("click", function (e) {
      var em = e.target.closest("[data-emo]");
      if (em) {
        var ch2 = em.getAttribute("data-emo");
        setValue(field.value + ch2);
        recentEmoji = [ch2].concat(recentEmoji.filter(function (x) { return x !== ch2; })).slice(0, 28);
        return;
      }
      var cat = e.target.closest("[data-cat]");
      if (cat) { emojiCat = cat.getAttribute("data-cat"); render(); return; }
      var b = e.target.closest(".kb-key");
      if (!b) return;
      var ch = b.getAttribute("data-ch");
      if (ch !== null) {
        insert(ch);
        if (shift && !num) { shift = false; render(); }
        return;
      }
      switch (b.getAttribute("data-act")) {
        case "shift": shift = !shift; render(); break;
        case "back":  setValue(backspace(field.value)); break;
        case "space": setValue(field.value + " "); break;
        case "num":   num = !num; shift = false; render(); break;
        // 지구본: 한글 → 영어 → 이모티콘 → 한글
        case "globe":
          lang = lang === "ko" ? "en" : lang === "en" ? "emoji" : "ko";
          num = false; shift = false; emojiCat = null; render(); break;
        case "done":  if (opts.onDone) opts.onDone(field.value); close(); break;
      }
    });

    function open() {
      if (isOpen) return;
      isOpen = true;
      render();
      host.classList.add("kb-open");
      kb.classList.add("is-open");
      if (opts.onOpen) opts.onOpen();
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      host.classList.remove("kb-open");
      kb.classList.remove("is-open");
      field.blur();
      if (opts.onClose) opts.onClose();
    }

    field.addEventListener("focus", open);
    field.addEventListener("click", open);

    return { open: open, close: close, isOpen: function () { return isOpen; } };
  };
})();
