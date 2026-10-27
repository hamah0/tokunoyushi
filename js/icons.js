/*
 * 아이콘 그림
 * -----------------------------------------
 * 2013년 무렵의 광택 있는 아이콘 스타일을 참고해 직접 그린 SVG입니다.
 * 각 함수는 아이콘 안에 들어갈 그림(HTML 문자열)을 돌려줍니다.
 * 아이콘의 배경색은 apps.js의 bg 값으로 정합니다.
 */
window.YUSHI = window.YUSHI || {};

(function () {
  // 흰 그림 공통 스타일 (아래쪽으로 살짝 그림자)
  function svg(body, viewBox) {
    return (
      '<svg class="glyph" viewBox="' + (viewBox || "0 0 32 32") + '" aria-hidden="true">' +
      body + "</svg>"
    );
  }

  var W = 'fill="#fff"';

  YUSHI.icons = {
    phone: function () {
      return svg(
        '<path ' + W + ' d="M9.2 4.5c.9-.5 2-.2 2.5.6l2.3 3.8c.5.9.3 2-.5 2.6l-1.8 1.3c.9 2.6 3 5.3 5.6 6.9l1.5-1.6c.7-.7 1.8-.8 2.6-.2l3.6 2.6c.8.6 1 1.8.4 2.6l-1.3 1.9c-.8 1.2-2.3 1.8-3.7 1.4C12.4 24.5 6.7 17.9 5.4 10.6c-.2-1.4.4-2.8 1.6-3.6z"/>'
      );
    },

    mail: function () {
      return svg(
        '<rect x="4" y="8" width="24" height="16" rx="1.5" ' + W + '/>' +
        '<path d="M4.6 9l11.4 9 11.4-9" fill="none" stroke="#7c93ad" stroke-width="1.6"/>' +
        '<path d="M4.6 23.4l8.6-7M27.4 23.4l-8.6-7" fill="none" stroke="#b9c6d4" stroke-width="1"/>'
      );
    },

    web: function () {
      return svg(
        '<circle cx="16" cy="16" r="11" fill="none" stroke="#fff" stroke-width="2"/>' +
        '<ellipse cx="16" cy="16" rx="4.6" ry="11" fill="none" stroke="#fff" stroke-width="1.6"/>' +
        '<path d="M5.5 12.5h21M5.5 19.5h21" stroke="#fff" stroke-width="1.6"/>'
      );
    },

    music: function () {
      return svg(
        '<path ' + W + ' d="M12 7.5l13-3v15.2a3.6 3 0 1 1-2.2-2.8V9.3l-8.6 2v11.4a3.6 3 0 1 1-2.2-2.8z"/>'
      );
    },

    messages: function () {
      return svg(
        '<path fill="#fff" fill-opacity=".72" d="M19 8.5c5 0 9 2.9 9 6.6 0 2-.9 3.6-2.5 4.8l.9 3.2-3.8-1.9c-1.1.4-2.3.6-3.6.6"/>' +
        '<path ' + W + ' d="M13 6c5.5 0 10 3.4 10 7.6s-4.5 7.6-10 7.6c-1.3 0-2.5-.2-3.6-.5L5 23l1.3-3.9C4.2 17.7 3 15.8 3 13.6 3 9.4 7.5 6 13 6z"/>'
      );
    },

    photos: function () {
      return svg(
        '<rect x="4" y="6.5" width="24" height="19" rx="1.5" fill="#fff"/>' +
        '<rect x="6" y="8.5" width="20" height="15" fill="#6fa3d8"/>' +
        '<circle cx="21.5" cy="12.5" r="2.2" fill="#ffe27a"/>' +
        '<path d="M6 23.5l6-7.5 4 4.5 3-3 7 6z" fill="#4c8a3d"/>'
      );
    },

    camera: function () {
      return svg(
        '<path fill="#26282d" d="M6 10.5h4.2l1.8-2.8h8l1.8 2.8H26c1.1 0 2 .9 2 2v10.8c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V12.5c0-1.1.9-2 2-2z"/>' +
        '<circle cx="16" cy="17.8" r="5.4" fill="#c9ccd1"/>' +
        '<circle cx="16" cy="17.8" r="3.9" fill="#3a4152"/>' +
        '<circle cx="14.7" cy="16.5" r="1.1" fill="#cfe0f5"/>' +
        '<circle cx="24.5" cy="12.8" r=".9" fill="#f2f2f2"/>'
      );
    },

    weather: function () {
      return svg(
        '<circle cx="12" cy="12" r="5.5" fill="#ffd84a"/>' +
        '<path ' + W + ' d="M10 25.5c-2.8 0-5-1.9-5-4.4 0-2.3 1.9-4.2 4.4-4.4.8-2.9 3.4-5 6.6-5 3.2 0 5.9 2.2 6.6 5.2h.4c2.5 0 4.5 1.9 4.5 4.3s-2 4.3-4.5 4.3z"/>'
      );
    },

    maps: function () {
      return svg(
        '<path d="M4 8l7-2.5 10 2.5 7-2.5v18.5l-7 2.5-10-2.5-7 2.5z" fill="#f3efe1"/>' +
        '<path d="M11 5.5v18.5M21 8v18.5" stroke="#cfc6aa" stroke-width="1"/>' +
        '<path d="M4 18c5-1 8 2 13-1s7-3 11-2" fill="none" stroke="#5a8fd0" stroke-width="2.2"/>' +
        '<path d="M14 9.5c0-1.7 1.3-3 3-3s3 1.3 3 3c0 2.3-3 5.5-3 5.5s-3-3.2-3-5.5z" fill="#d6423b"/>'
      );
    },

    video: function () {
      return svg(
        '<rect x="4" y="8" width="24" height="16" rx="2" fill="#fff"/>' +
        '<path d="M4 11.5h24M4 20.5h24" stroke="#2c2f36" stroke-width="1"/>' +
        '<path d="M13.5 13v6l5.5-3z" fill="#2c2f36"/>'
      );
    },

    reminders: function () {
      return svg(
        '<rect x="5" y="4.5" width="22" height="23" rx="1.5" fill="#fff"/>' +
        '<circle cx="9.5" cy="11" r="1.7" fill="none" stroke="#e0583e" stroke-width="1.2"/>' +
        '<circle cx="9.5" cy="16.5" r="1.7" fill="none" stroke="#3d86d1" stroke-width="1.2"/>' +
        '<circle cx="9.5" cy="22" r="1.7" fill="none" stroke="#5aa54a" stroke-width="1.2"/>' +
        '<path d="M13 11h10M13 16.5h10M13 22h10" stroke="#9aa3ad" stroke-width="1.2"/>'
      );
    },

    calculator: function () {
      var keys = "";
      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
          keys += '<rect x="' + (7 + c * 6.6) + '" y="' + (12 + r * 5.4) + '" width="4.8" height="3.8" rx=".8" fill="' + (c === 2 ? "#f29b3d" : "#e9edf2") + '"/>';
        }
      }
      return svg(
        '<rect x="5" y="3.5" width="22" height="25" rx="2" fill="#3a3d43"/>' +
        '<rect x="7" y="6" width="18" height="4.2" rx=".6" fill="#c9d6a6"/>' + keys
      );
    },

    settings: function () {
      var teeth = "";
      for (var i = 0; i < 12; i++) {
        teeth += '<rect x="14.6" y="3.2" width="2.8" height="5" rx=".6" fill="#e9ebee" transform="rotate(' + i * 30 + ' 16 16)"/>';
      }
      return svg(
        teeth +
        '<circle cx="16" cy="16" r="9" fill="#e9ebee"/>' +
        '<circle cx="16" cy="16" r="6.6" fill="#8a9099"/>' +
        '<circle cx="16" cy="16" r="3" fill="#e9ebee"/>'
      );
    },

    contacts: function () {
      return svg(
        '<rect x="6" y="4" width="20" height="24" rx="1.5" fill="#f6efe2"/>' +
        '<rect x="4.5" y="7" width="3" height="3" fill="#c34c3a"/>' +
        '<rect x="4.5" y="13" width="3" height="3" fill="#3f7fc4"/>' +
        '<rect x="4.5" y="19" width="3" height="3" fill="#59a14b"/>' +
        '<circle cx="17" cy="13" r="3.8" fill="#9aa1aa"/>' +
        '<path d="M10.5 23.5c.5-3.6 3.2-5.6 6.5-5.6s6 2 6.5 5.6z" fill="#9aa1aa"/>'
      );
    },

    voice: function () {
      return svg(
        '<rect x="12" y="4" width="8" height="15" rx="4" fill="#fff"/>' +
        '<path d="M8.5 14.5c0 4.3 3.4 7.5 7.5 7.5s7.5-3.2 7.5-7.5" fill="none" stroke="#fff" stroke-width="1.8"/>' +
        '<path d="M16 22v4.5M11.5 27h9" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>'
      );
    },

    // Talk: 표정 없는 흰 말풍선 (살짝 입체감)
    wink: function () {
      return svg(
        '<defs><linearGradient id="g-talk" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ece6d2"/></linearGradient></defs>' +
        '<path fill="url(#g-talk)" stroke="rgba(150,100,0,.35)" stroke-width=".6" d="M16 4.5c6.9 0 12.5 4.3 12.5 9.6s-5.6 9.6-12.5 9.6c-1.2 0-2.4-.1-3.5-.4L6.5 27l1.7-5.2C5.2 20 3.5 17.2 3.5 14.1 3.5 8.8 9.1 4.5 16 4.5z"/>'
      );
    },

    // Talk Story: 2013년식 은색 똑딱이 디지털카메라
    daylog: function () {
      return svg(
        '<defs>' +
          '<linearGradient id="g-cam" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#fbfbfc"/><stop offset=".45" stop-color="#d5d8dd"/>' +
            '<stop offset=".5" stop-color="#bfc3c9"/><stop offset="1" stop-color="#e3e5e8"/></linearGradient>' +
          '<radialGradient id="g-glass" cx=".38" cy=".35" r=".7">' +
            '<stop offset="0" stop-color="#7c8db0"/><stop offset=".45" stop-color="#2a3044"/><stop offset="1" stop-color="#0d0f16"/></radialGradient>' +
        '</defs>' +
        '<rect x="20" y="6.2" width="5.5" height="2" rx=".8" fill="#9ea3aa"/>' +
        '<rect x="3.5" y="8" width="25" height="16" rx="3" fill="url(#g-cam)" stroke="rgba(0,0,0,.3)" stroke-width=".6"/>' +
        '<rect x="5.6" y="10" width="5.6" height="3.2" rx=".6" fill="#e9eef5" stroke="rgba(0,0,0,.25)" stroke-width=".4"/>' +
        '<circle cx="18.5" cy="16.4" r="5.6" fill="#a7acb3" stroke="rgba(0,0,0,.3)" stroke-width=".5"/>' +
        '<circle cx="18.5" cy="16.4" r="3.9" fill="url(#g-glass)"/>' +
        '<circle cx="17.2" cy="15.1" r="1" fill="rgba(255,255,255,.75)"/>' +
        '<circle cx="25.6" cy="11" r=".9" fill="#d84b3c"/>'
      );
    },

    /* 아래 세 가지는 날짜·시각을 반영하므로 HTML로 만듭니다. */

    calendar: function (now) {
      var days = ["일", "월", "화", "수", "목", "금", "토"];
      return (
        '<div class="g-cal">' +
          '<div class="g-cal-head">' + days[now.getDay()] + "요일</div>" +
          '<div class="g-cal-day">' + now.getDate() + "</div>" +
        "</div>"
      );
    },

    clock: function (now) {
      var h = now.getHours() % 12, m = now.getMinutes();
      var hourDeg = h * 30 + m * 0.5, minDeg = m * 6;
      var ticks = "";
      for (var i = 0; i < 12; i++) {
        ticks += '<rect x="15.4" y="4.4" width="1.2" height="' + (i % 3 === 0 ? 3 : 1.8) + '" fill="#333" transform="rotate(' + i * 30 + ' 16 16)"/>';
      }
      return svg(
        '<circle cx="16" cy="16" r="13" fill="#fff"/>' + ticks +
        '<rect class="g-hand-h" x="15.1" y="9" width="1.8" height="8" rx=".9" fill="#222" transform="rotate(' + hourDeg + ' 16 16)"/>' +
        '<rect class="g-hand-m" x="15.4" y="5.5" width="1.2" height="11.5" rx=".6" fill="#222" transform="rotate(' + minDeg + ' 16 16)"/>' +
        '<circle cx="16" cy="16" r="1.4" fill="#d6423b"/>'
      );
    },

    notes: function () {
      return (
        '<div class="g-notes">' +
          '<div class="g-notes-top"></div>' +
          '<div class="g-notes-lines"></div>' +
        "</div>"
      );
    }
  };
})();
