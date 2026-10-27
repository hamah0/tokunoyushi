/*
 * 앱 목록
 * -----------------------------------------
 * 홈 화면에 놓일 아이콘들의 정보입니다.
 *
 *   id     : 앱을 구분하는 이름 (영어, 띄어쓰기 없이)
 *   label  : 아이콘 아래에 표시되는 이름
 *   glyph  : icons.js 안의 그림 이름
 *   bg     : 아이콘 배경 (위쪽 색 → 아래쪽 색)
 *   ready  : true면 눌렀을 때 앱 화면이 열립니다.
 *            false면 아직 연결되지 않은 장식용 아이콘입니다 (눌러도 반응 없음).
 *   render : (선택) 앱 화면 안을 채우는 함수. 없으면 '준비 중' 빈 화면이 나옵니다.
 *
 * 다음 단계에서 앱을 만들 때는 해당 앱의 render 함수를 채우면 됩니다.
 * 예)  render: function (body) { body.innerHTML = "..."; }
 */
window.YUSHI = window.YUSHI || {};

(function () {
  function bg(top, bottom) {
    return "linear-gradient(" + top + ", " + bottom + ")";
  }

  YUSHI.apps = {
    // 홈 화면 첫 페이지 (4칸씩 줄바꿈)
    page: [
      { id: "mail",       label: "Mail",     glyph: "mail",       bg: bg("#8fc3f5", "#2a6bc4"), ready: true, mount: "mail" },
      { id: "calendar",   label: "캘린더",   glyph: "calendar",   bg: bg("#ffffff", "#e3e3e3"), ready: true, mount: "calendar" },
      { id: "photos",     label: "사진",     glyph: "photos",     bg: bg("#ffe9a8", "#e2a83b"), ready: true, mount: "photos" },
      { id: "camera",     label: "카메라",   glyph: "camera",     bg: bg("#ffffff", "#d9dbdf"), ready: true, mount: "camera" },

      { id: "weather",    label: "날씨",     glyph: "weather",    bg: bg("#6fb8f2", "#2763b8"), ready: true, mount: "weather" },
      { id: "clock",      label: "시계",     glyph: "clock",      bg: bg("#4a4d52", "#141517"), ready: true, mount: "clock" },
      { id: "maps",       label: "지도",     glyph: "maps",       bg: bg("#a6d07a", "#5a8f3a"), ready: true, mount: "maps" },
      { id: "notes",      label: "메모",     glyph: "notes",      bg: bg("#fff3a6", "#f2d55c"), ready: true, mount: "notes" },

      { id: "reminders",  label: "미리 알림", glyph: "reminders", bg: bg("#f4f4f4", "#cfcfcf"), ready: true, mount: "reminders" },
      { id: "calculator", label: "계산기",   glyph: "calculator", bg: bg("#6a6e75", "#2a2c30"), ready: true, mount: "calculator" },
      { id: "voice",      label: "음성 메모", glyph: "voice",     bg: bg("#b08be8", "#5b2fa3"), ready: true, mount: "voice" },
      { id: "contacts",   label: "연락처",   glyph: "contacts",   bg: bg("#c9a77c", "#7f5b34"), ready: true, mount: "contacts" },

      { id: "settings",   label: "설정",     glyph: "settings",   bg: bg("#a9aeb6", "#5c6169"), ready: true, mount: "settings" },
      // mount: js/apps/ 폴더의 앱 화면 이름 (YUSHI.appScreens)
      { id: "wink",       label: "Talk",     glyph: "wink",       bg: bg("#ffe866", "#f0b400"), ready: true, mount: "wink" },
      { id: "daylog",     label: "Talk Story", glyph: "daylog",     bg: bg("#ffe866", "#f0b400"), ready: true, mount: "daylog" }
    ],

    // 하단 독 (최대 4개)
    dock: [
      { id: "phone",    label: "전화",   glyph: "phone",    bg: bg("#7fd66a", "#278a1c"), ready: true, mount: "phone" },
      { id: "messages", label: "메시지", glyph: "messages", bg: bg("#8fdc5f", "#2f9a1e"), ready: true, mount: "sms" },
      { id: "web",      label: "인터넷", glyph: "web",      bg: bg("#7cc8f0", "#1f6fb8"), ready: true, mount: "web" },
      { id: "music",    label: "음악",   glyph: "music",    bg: bg("#ffa25a", "#e04a17"), ready: true, mount: "music" }
    ]
  };

  // id로 앱 정보를 찾는 도우미
  YUSHI.findApp = function (id) {
    var all = YUSHI.apps.page.concat(YUSHI.apps.dock);
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return null;
  };
})();
