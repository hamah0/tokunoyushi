/*
 * 실행 코드
 * -----------------------------------------
 * 1) 창 크기에 맞춰 기기 확대/축소
 * 2) 기기 속 시계 (config.js 기준)
 * 3) 상태 표시줄 그리기
 * 4) 홈 화면 아이콘 배치
 * 5) 밀어서 잠금 해제, 홈 버튼, 잠자기 버튼
 * 6) 앱 열기/닫기 (apps.js의 ready: true 앱만)
 *
 * 화면 상태: "lock"(잠금) → "home"(홈) ⇄ "app"(앱), 어느 때나 "off"(꺼짐)
 */
(function () {
  var C = YUSHI.config;
  var $ = function (id) { return document.getElementById(id); };

  var holder = $("holder");
  var lockEl = $("lock");
  var homeEl = $("home");
  var appLayer = $("appLayer");
  var offEl = $("screenOff");

  var state = "lock";
  var openAppEl = null;

  /* ---------- 1) 창 크기 맞춤 ---------- */
  var BASE_W = 376, BASE_H = 780, MARGIN = 16;

  function fit() {
    var s = Math.min(
      (window.innerWidth - MARGIN * 2) / BASE_W,
      (window.innerHeight - MARGIN * 2) / BASE_H,
      1.2
    );
    s = Math.max(s, 0.3);
    holder.style.setProperty("--s", s);
    holder.style.width = BASE_W * s + "px";
    holder.style.height = BASE_H * s + "px";
  }
  window.addEventListener("resize", fit);
  fit();

  /* ---------- 2) 기기 속 시계 ---------- */
  var start = new Date(C.date.year, C.date.month - 1, C.date.day, C.time.hour, C.time.minute, 0);
  var openedAt = Date.now();
  var DAYS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

  YUSHI.now = function () {
    return C.clockRuns ? new Date(start.getTime() + (Date.now() - openedAt)) : new Date(start.getTime());
  };

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // 잠금 화면용 큰 시각: "9:30"
  function bigTime(d) {
    if (C.use24Hour) return d.getHours() + ":" + pad(d.getMinutes());
    var h = d.getHours() % 12 || 12;
    return h + ":" + pad(d.getMinutes());
  }

  // 상태 표시줄용: "오후 9:30"
  function barTime(d) {
    if (C.use24Hour) return d.getHours() + ":" + pad(d.getMinutes());
    return (d.getHours() < 12 ? "오전 " : "오후 ") + bigTime(d);
  }

  // "4월 4일 목요일"
  function dateText(d) {
    return (d.getMonth() + 1) + "월 " + d.getDate() + "일 (" + DAYS[d.getDay()] + ")";
  }

  /* ---------- 3) 상태 표시줄 ---------- */
  var LOCK_GLYPH =
    '<svg class="sb-lock" viewBox="0 0 9 12" aria-hidden="true">' +
    '<path d="M2 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="#fff" stroke-width="1.4"/>' +
    '<rect x="0.5" y="5" width="8" height="6.5" rx="1" fill="#fff"/></svg>';

  function signalBars(n) {
    var html = '<span class="sb-signal" aria-hidden="true">';
    for (var i = 0; i < 5; i++) {
      html += '<i class="' + (i < n ? "on" : "") + '" style="height:' + (3 + i * 2) + 'px"></i>';
    }
    return html + "</span>";
  }

  // 통신 표시: "wifi"면 와이파이 부채꼴, 그 외에는 글자 (LTE, 3G 등)
  var WIFI_GLYPH =
    '<svg class="sb-wifi" viewBox="0 0 16 12" aria-label="Wi-Fi">' +
    '<path d="M8 11.2l2.1-2.6a3.3 3.3 0 0 0-4.2 0z" fill="#fff"/>' +
    '<path d="M3.6 6.1a6.9 6.9 0 0 1 8.8 0l-1.4 1.7a4.7 4.7 0 0 0-6 0z" fill="#fff"/>' +
    '<path d="M.9 2.8a11 11 0 0 1 14.2 0l-1.4 1.7a8.8 8.8 0 0 0-11.4 0z" fill="#fff"/></svg>';

  function networkHTML() {
    if (String(C.network).toLowerCase() === "wifi") return WIFI_GLYPH;
    return "<span>" + C.network + "</span>";
  }

  function renderStatusBar(el, d) {
    var variant = el.getAttribute("data-variant");
    var level = Math.max(0, Math.min(100, C.battery));
    var center = variant === "lock" ? LOCK_GLYPH : barTime(d);
    // 에어플레인 모드면 신호·통신사 대신 비행기 표시
    var left = C.airplane
      ? '<svg class="sb-plane" viewBox="0 0 16 12" aria-label="에어플레인 모드"><path fill="#fff" d="M15.5 6c0-.6-.6-1-1.3-1H10L6.6 0H5l1.8 5H3.4L2.2 3.4H1l.8 2.6L1 8.6h1.2L3.4 7h3.4L5 12h1.6L10 7h4.2c.7 0 1.3-.4 1.3-1z"/></svg>'
      : signalBars(C.signal) + "<span>" + C.carrier + "</span>" + networkHTML();
    el.innerHTML =
      '<span class="sb-left">' + left + "</span>" +
      '<span class="sb-center">' + center + "</span>" +
      '<span class="sb-right">' +
        (C.showBatteryPercent ? "<span>" + level + "%</span>" : "") +
        '<span class="sb-battery" aria-label="배터리 ' + level + '%"><b style="width:' + level + '%"></b></span>' +
      "</span>";
  }

  /* ---------- 4) 홈 화면 아이콘 ---------- */
  function iconHTML(app, d) {
    var draw = YUSHI.icons[app.glyph];
    return (
      '<span class="icon" style="background:' + app.bg + '">' + (draw ? draw(d) : "") + "</span>" +
      '<span class="icon-badge"' + (badges[app.id] ? "" : " hidden") + ">" + (badges[app.id] || "") + "</span>" +
      '<span class="app-label">' + app.label + "</span>"
    );
  }

  var badges = {};   // 홈 화면 아이콘 위 빨간 숫자 (앱 id → 개수)

  function buildIcons(list, container, d) {
    container.innerHTML = "";
    list.forEach(function (app) {
      // 연결된 앱은 버튼, 아직 연결 안 된 앱은 그냥 그림
      var el = document.createElement(app.ready ? "button" : "div");
      el.className = "app-icon";
      el.setAttribute("data-app", app.id);
      if (app.ready) {
        el.type = "button";
        el.setAttribute("aria-label", app.label + " 열기");
      }
      el.innerHTML = iconHTML(app, d);
      container.appendChild(el);
    });
  }

  function buildHome() {
    var d = YUSHI.now();
    buildIcons(YUSHI.apps.page, $("springboard"), d);
    buildIcons(YUSHI.apps.dock, $("dock"), d);
  }

  homeEl.addEventListener("click", function (e) {
    if (swiped) { swiped = false; return; }   // 옆으로 넘긴 직후의 클릭은 무시
    var btn = e.target.closest("button.app-icon");
    if (btn && state === "home") openApp(btn.getAttribute("data-app"));
  });

  /* ---------- 홈 화면 페이지 넘기기 (아이콘 ↔ 시간표) ---------- */
  var pages = $("homePages"), track = $("homeTrack");
  var pageIdx = 0, PAGE_N = 2, drag = null, swiped = false;
  if (YUSHI.renderTimetable) YUSHI.renderTimetable($("timetable"));

  function showPage(i, animate) {
    pageIdx = Math.max(0, Math.min(PAGE_N - 1, i));
    track.style.transition = animate === false ? "none" : "";
    track.style.transform = "translateX(" + (-pageIdx * 320) + "px)";
    var dots = homeEl.querySelectorAll(".page-dots .dot");
    for (var k = 0; k < dots.length; k++) dots[k].classList.toggle("is-on", k === pageIdx);
  }
  pages.addEventListener("pointerdown", function (e) {
    if (state !== "home") return;
    drag = { x: e.clientX, y: e.clientY, dx: 0, on: false, id: e.pointerId };
  });
  pages.addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var s = currentScale();
    var dx = (e.clientX - drag.x) / s, dy = (e.clientY - drag.y) / s;
    if (!drag.on) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      drag.on = true;
      try { pages.setPointerCapture(e.pointerId); } catch (err) {}
      track.style.transition = "none";
    }
    // 끝 페이지에서는 살짝만 끌림
    if ((pageIdx === 0 && dx > 0) || (pageIdx === PAGE_N - 1 && dx < 0)) dx = dx / 3;
    drag.dx = dx;
    track.style.transform = "translateX(" + (-pageIdx * 320 + dx) + "px)";
  });
  function endSwipe() {
    if (!drag) return;
    if (drag.on) {
      swiped = true;
      setTimeout(function () { swiped = false; }, 50);
      showPage(pageIdx + (drag.dx < -50 ? 1 : drag.dx > 50 ? -1 : 0));
    }
    drag = null;
  }
  pages.addEventListener("pointerup", endSwipe);
  pages.addEventListener("pointercancel", endSwipe);

  /* ---------- 시계 갱신 ---------- */
  var lastMinute = null;

  function tick() {
    var d = YUSHI.now();
    var minuteKey = d.getHours() * 60 + d.getMinutes();
    if (minuteKey === lastMinute) return;
    var dayChanged = lastMinute !== null && minuteKey < lastMinute; // 자정이 지남
    lastMinute = minuteKey;

    $("lockTime").textContent = bigTime(d);
    $("lockDate").textContent = dateText(d);
    var bars = document.querySelectorAll(".statusbar");
    for (var i = 0; i < bars.length; i++) renderStatusBar(bars[i], d);

    // 시계·캘린더 아이콘도 시각을 반영
    var clockIcon = document.querySelector('[data-app="clock"] .icon');
    if (clockIcon) clockIcon.innerHTML = YUSHI.icons.clock(d);
    if (dayChanged) buildHome();
  }

  /* ---------- 5) 밀어서 잠금 해제 ---------- */
  var slider = $("slider");
  var knob = $("knob");
  var KNOB_START = 3;
  var dragging = false, grabX = 0, knobX = KNOB_START;

  function maxKnob() { return slider.clientWidth - knob.offsetWidth - 3; }

  // 화면이 확대/축소되어 있으므로 실제 이동 거리를 기기 기준 픽셀로 환산
  function currentScale() {
    return parseFloat(getComputedStyle(holder).getPropertyValue("--s")) || 1;
  }

  function setKnob(x) {
    knobX = Math.max(KNOB_START, Math.min(maxKnob(), x));
    knob.style.left = knobX + "px";
    var progress = (knobX - KNOB_START) / (maxKnob() - KNOB_START);
    slider.querySelector(".slider-text").style.opacity = String(1 - progress * 1.6);
    knob.setAttribute("aria-valuenow", Math.round(progress * 100));
  }

  function resetKnob() {
    knob.classList.add("is-returning");
    setKnob(KNOB_START);
    setTimeout(function () { knob.classList.remove("is-returning"); }, 230);
  }

  knob.addEventListener("pointerdown", function (e) {
    if (state !== "lock") return;
    dragging = true;
    grabX = e.clientX / currentScale() - knobX;
    knob.classList.remove("is-returning");
    knob.setPointerCapture(e.pointerId);
  });

  knob.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    setKnob(e.clientX / currentScale() - grabX);
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    if (knobX >= maxKnob() - 4) unlock();
    else resetKnob();
  }
  knob.addEventListener("pointerup", endDrag);
  knob.addEventListener("pointercancel", endDrag);

  // 키보드: 오른쪽 화살표나 Enter로도 잠금 해제
  knob.addEventListener("keydown", function (e) {
    if (state !== "lock") return;
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setKnob(maxKnob());
      unlock();
    }
  });

  /* ---------- 화면 상태 전환 ---------- */
  function showLock() {
    state = "lock";
    closeAppNow();
    lockEl.classList.remove("is-hidden", "is-unlocking");
    slider.querySelector(".slider-text").style.opacity = "1";
    knob.classList.remove("is-returning");
    setKnob(KNOB_START);
  }

  function unlock() {
    state = "unlocking";
    lockEl.classList.add("is-unlocking");
    setTimeout(function () {
      lockEl.classList.add("is-hidden");
      state = "home";
    }, 300);
  }

  /* ---------- 6) 앱 열기/닫기 ---------- */
  function openApp(id) {
    var app = YUSHI.findApp(id);
    if (!app || !app.ready) return;

    var el = document.createElement("section");
    el.className = "app";
    el.setAttribute("data-app", id);
    el.setAttribute("aria-label", app.label);
    el.innerHTML = '<div class="statusbar" data-variant="app"></div>';

    // mount가 있는 앱은 상태 표시줄 아래 화면 전체를 직접 그림 (윙크, 데이로그)
    var mount = YUSHI.appScreens && YUSHI.appScreens[app.mount];
    if (typeof mount === "function") {
      // 앱이 정리 함수를 돌려주면 앱을 닫을 때 실행 (예: 음성 메모 재생 멈춤)
      var cleanup = mount(el);
      el._cleanup = typeof cleanup === "function" ? cleanup : null;
    } else {
      el.insertAdjacentHTML("beforeend",
        '<header class="navbar"><h1>' + app.label + "</h1></header>" +
        '<div class="app-body"></div>');
      var body = el.querySelector(".app-body");
      if (typeof app.render === "function") {
        app.render(body, el);
      } else {
        body.classList.add("pinstripe");
        body.innerHTML = '<p class="app-empty">이 앱의 내용은 다음 단계에서 추가됩니다.</p>';
      }
    }

    renderStatusBar(el.querySelector(".statusbar"), YUSHI.now());
    appLayer.appendChild(el);
    appLayer.classList.add("is-open");
    openAppEl = el;
    state = "app";
    el.offsetWidth; // 애니메이션 시작을 위해 한 번 그리기
    el.classList.add("is-shown");
  }

  function closeApp() {
    if (!openAppEl) return;
    var el = openAppEl;
    openAppEl = null;
    if (el._cleanup) el._cleanup();
    el.classList.remove("is-shown");
    state = "home";
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      if (!openAppEl) appLayer.classList.remove("is-open");
    }, 260);
  }

  function closeAppNow() {
    if (openAppEl && openAppEl._cleanup) openAppEl._cleanup();
    if (openAppEl && openAppEl.parentNode) openAppEl.parentNode.removeChild(openAppEl);
    openAppEl = null;
    appLayer.classList.remove("is-open");
  }

  /* ---------- 물리 버튼 ---------- */
  // 홈 버튼: 앱 → 홈 / 꺼진 화면 → 잠금 화면 켜기
  $("btnHome").addEventListener("click", function () {
    if (state === "app") closeApp();
    else if (state === "off") wake();
    else if (state === "home" && pageIdx > 0) showPage(0);   // 두 번째 페이지에서 누르면 첫 페이지로
  });

  // 잠자기/깨우기 버튼: 켜져 있으면 끄기, 꺼져 있으면 잠금 화면으로 켜기
  $("btnSleep").addEventListener("click", function () {
    if (state === "off") wake();
    else sleep();
  });

  function sleep() {
    showLock();
    state = "off";
    offEl.classList.remove("is-hidden");
  }

  function wake() {
    offEl.classList.add("is-hidden");
    showLock();
    tick();
  }

  /* ---------- 시작 ---------- */
  // 배경화면: 문자열 하나면 두 화면에 같이, { lock, home }이면 따로 적용
  function setWall(selector, path) {
    var el = document.querySelector(selector);
    if (el && path) el.style.backgroundImage = 'url("' + path + '")';
  }
  if (typeof C.wallpaper === "string") {
    setWall("#lock .wallpaper", C.wallpaper);
    setWall("#home .wallpaper", C.wallpaper);
  } else if (C.wallpaper) {
    setWall("#lock .wallpaper", C.wallpaper.lock);
    setWall("#home .wallpaper", C.wallpaper.home);
  }

  offEl.classList.add("is-hidden");
  buildHome();
  showLock();
  tick();
  setInterval(tick, 1000);

  // 설정 앱 등에서 상태 표시줄을 다시 그릴 때
  /* ---------- 모바일 확대 막기 ----------
   * 두 번 탭 확대는 CSS touch-action: manipulation (device.css)으로 막음.
   * (빠르게 키보드를 쳐도 글자가 빠지지 않도록 터치 이벤트는 건드리지 않음)
   * 아이폰 Safari의 두 손가락 확대만 따로 막음 */
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); });

  /* ---------- 다른 코드에서 쓰는 도구 ---------- */
  YUSHI.getState = function () { return state; };
  YUSHI.currentApp = function () { return openAppEl ? openAppEl.getAttribute("data-app") : null; };

  // 아이콘 배지
  YUSHI.setBadge = function (appId, n) {
    badges[appId] = n > 0 ? n : 0;
    var els = homeEl.querySelectorAll('.app-icon[data-app="' + appId + '"] .icon-badge');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = n > 0 ? String(n) : "";
      els[i].hidden = !(n > 0);
    }
  };

  // 다른 앱이 열려 있어도 그 앱으로 바로 이동 (알림을 눌렀을 때)
  YUSHI.openApp = function (id) {
    if (state !== "home" && state !== "app") return;
    if (openAppEl) closeAppNow();
    openApp(id);
  };

  // iOS 6 배너 알림: 화면 맨 위에 내려왔다가 몇 초 뒤 올라감
  var bannerEl = null, bannerTimer = null;
  YUSHI.banner = function (o) {
    if (state === "off") return;
    var app = YUSHI.findApp(o.appId) || {};
    if (!bannerEl) {
      bannerEl = document.createElement("button");
      bannerEl.type = "button";
      bannerEl.className = "banner";
      $("screen").appendChild(bannerEl);
      bannerEl.addEventListener("click", function () {
        var fn = bannerEl._onTap;
        hideBanner();
        if (fn && (state === "home" || state === "app")) fn();
      });
    }
    var draw = YUSHI.icons[app.glyph];
    bannerEl.innerHTML =
      '<span class="banner-icon"><span class="icon" style="background:' + (app.bg || "#888") + '">' + (draw ? draw(YUSHI.now()) : "") + "</span></span>" +
      '<span class="banner-text"><b>' + YUSHI.ui.esc(o.title || app.label || "") + "</b><span>" + YUSHI.ui.esc(o.text || "") + "</span></span>";
    bannerEl._onTap = o.onTap || null;
    bannerEl.classList.remove("is-shown");
    bannerEl.offsetWidth;
    bannerEl.classList.add("is-shown");
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(hideBanner, 4500);
  };
  function hideBanner() { if (bannerEl) bannerEl.classList.remove("is-shown"); }

  YUSHI.refreshStatusBars = function () {
    var d = YUSHI.now();
    var bars = document.querySelectorAll(".statusbar");
    for (var i = 0; i < bars.length; i++) renderStatusBar(bars[i], d);
  };

  // 다음 단계에서 다른 코드가 쓸 수 있도록 공개
  // (YUSHI.openApp은 위에서 정의: 열린 앱을 닫고 새 앱을 엶)
  YUSHI.goHome = closeApp;
  YUSHI.lock = showLock;
})();
