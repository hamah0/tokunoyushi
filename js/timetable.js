/*
 * 홈 화면 두 번째 페이지: 시간표
 * 데이터는 js/data/timetable-data.js
 */
(function () {
  var Y = window.YUSHI;
  var DAYS = ["월", "화", "수", "목", "금"];
  var COLORS = ["#f08a74", "#a5c86a", "#76cfc0", "#7fa6e8", "#f0c068", "#f4a46a", "#c49ad8", "#e98fae"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function mins(t) { var p = String(t).split(":"); return (+p[0]) * 60 + (+p[1] || 0); }

  Y.renderTimetable = function (el) {
    var T = (Y.data && Y.data.timetable) || { classes: [] };
    var h0 = T.startHour || 9, h1 = T.endHour || 18;
    var rows = h1 - h0;
    var html =
      '<div class="tt-card">' +
        '<div class="tt-head">' + esc(T.title || "시간표") + "</div>" +
        '<div class="tt-days"><span></span>' + DAYS.map(function (d) { return "<span>" + d + "</span>"; }).join("") + "</div>" +
        '<div class="tt-grid" style="--rows:' + rows + '">';
    // 시간 줄
    html += '<div class="tt-hours">';
    for (var h = h0; h < h1; h++) html += "<span>" + (h > 12 ? h - 12 : h) + "</span>";
    html += "</div>";
    // 같은 과목은 같은 색
    var colorOf = {}, nColor = 0;
    (T.classes || []).forEach(function (c) {
      if (!colorOf[c.name]) colorOf[c.name] = c.color || COLORS[nColor++ % COLORS.length];
    });
    // 요일 칸
    DAYS.forEach(function (d) {
      html += '<div class="tt-col">';
      (T.classes || []).forEach(function (c) {
        if (c.day !== d) return;
        var top = (mins(c.start) - h0 * 60) / (rows * 60) * 100;
        var hgt = (mins(c.end) - mins(c.start)) / (rows * 60) * 100;
        html += '<div class="tt-class" style="top:' + top + "%;height:" + hgt + "%;background:" + esc(c.color || colorOf[c.name]) + '">' +
          "<b>" + esc(c.name) + "</b>" + (c.room ? "<span>" + esc(c.room) + "</span>" : "") + "</div>";
      });
      html += "</div>";
    });
    html += "</div>";
    if ((T.extras || []).length) {
      html += '<div class="tt-extra">' + T.extras.map(function (x) {
        return "<span><b>" + esc(x.name) + "</b>" + (x.note ? " · " + esc(x.note) : "") + "</span>";
      }).join("") + "</div>";
    }
    html += "</div>";
    el.innerHTML = html;
  };
})();
