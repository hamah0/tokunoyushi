/*
 * 카메라 앱
 * -----------------------------------------
 * - 앱을 열면 조리개가 열리듯 화면이 나타납니다.
 * - 보는 사람의 기기 카메라를 쓸 수 있으면(브라우저가 허락을 물어봄) 실제 화면이 보이고,
 *   셔터를 누르면 사진이 찍혀 왼쪽 아래 작은 사진에 쌓입니다.
 *   찍은 사진은 이 페이지를 연 동안만 남고 어디에도 저장·전송되지 않습니다.
 * - 카메라를 쓸 수 없으면 그 사실을 화면에 알려 주고 셔터는 꺼집니다.
 */
window.YUSHI = window.YUSHI || {};
YUSHI.appScreens = YUSHI.appScreens || {};

(function () {
  var SHUTTER = '<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M5 6h4.5l1.8-3h9.4l1.8 3H27c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z"/><circle cx="16" cy="13.5" r="5.2" fill="#9ea3ab"/><circle cx="16" cy="13.5" r="3.3" fill="#4a4e55"/></svg>';
  var FLIP = '<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M5 6h4.5l1.8-3h9.4l1.8 3H27c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M11 12.5a5 5 0 0 1 9-2.2M21 14.5a5 5 0 0 1-9 2.2" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M20.5 7.5v3.2h-3.2M11.5 19.5v-3.2h3.2" fill="none" stroke="#fff" stroke-width="1.6"/></svg>';

  var BOLT = '<svg viewBox="0 0 12 18" aria-hidden="true"><path d="M7.5 0L1 10h4.2L3.8 18 11 7.2H6.6z" fill="#fff"/></svg>';
  var MODE_CAM = '<svg viewBox="0 0 20 14" aria-hidden="true"><path d="M2 3h4l1.3-2h5.4L14 3h4a1 1 0 0 1 1 1v8.5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="#5a5e65"/><circle cx="10" cy="8" r="3.2" fill="#c9ccd1"/></svg>';
  var MODE_VID = '<svg viewBox="0 0 20 14" aria-hidden="true"><rect x="1" y="2.5" width="12" height="9" rx="1.5" fill="#5a5e65"/><path d="M14 6l5-3v8l-5-3z" fill="#5a5e65"/></svg>';

  YUSHI.appScreens.camera = function mount(appEl) {
    // 찍은 사진은 사진 앱의 '카메라 롤'과 함께 씀 (페이지를 연 동안만)
    YUSHI.session = YUSHI.session || {};
    var photos = YUSHI.session.cameraShots = YUSHI.session.cameraShots || [];
    var stream = null, facing = "environment", viewIndex = 0, alive = true;

    appEl.classList.add("app-camera");
    var root = document.createElement("div");
    root.className = "cam";
    root.innerHTML =
      '<div class="cam-view">' +
        '<video class="cam-video" playsinline muted autoplay></video>' +
        '<div class="cam-msg" hidden></div>' +
        '<div class="cam-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
        '<span class="cam-top-btn cam-flash-btn" aria-hidden="true">' + BOLT + "자동</span>" +
        '<span class="cam-top-btn cam-opt-btn" aria-hidden="true">옵션</span>' +
        '<button type="button" class="cam-flip" aria-label="앞뒤 카메라 바꾸기" disabled>' + FLIP + "</button>" +
        '<div class="cam-flash"></div>' +
        '<div class="cam-iris is-closed" aria-hidden="true"></div>' +
      "</div>" +
      '<div class="cam-bar">' +
        '<button type="button" class="cam-thumb" aria-label="찍은 사진 보기" disabled></button>' +
        '<button type="button" class="cam-shutter" aria-label="사진 찍기" disabled>' + SHUTTER + "</button>" +
        '<span class="cam-mode" aria-hidden="true">' + MODE_CAM + '<span class="cam-mode-track"><span class="cam-mode-knob"></span></span>' + MODE_VID + "</span>" +
      "</div>" +
      '<div class="cam-roll" hidden>' +
        '<div class="cam-roll-top"><button type="button" class="cam-roll-done">완료</button><span class="cam-roll-title"></span></div>' +
        '<img class="cam-roll-img" alt="찍은 사진">' +
        '<div class="cam-roll-nav">' +
          '<button type="button" data-dir="1" aria-label="이전 사진">◀</button>' +
          '<button type="button" data-dir="-1" aria-label="다음 사진">▶</button>' +
        "</div>" +
      "</div>";
    appEl.appendChild(root);

    var video = root.querySelector(".cam-video");
    var msg = root.querySelector(".cam-msg");
    var iris = root.querySelector(".cam-iris");
    var flash = root.querySelector(".cam-flash");
    var shutter = root.querySelector(".cam-shutter");
    var thumb = root.querySelector(".cam-thumb");
    var flip = root.querySelector(".cam-flip");
    var roll = root.querySelector(".cam-roll");

    // 썸네일·보기 목록: 방금 찍은 사진 → 카메라 롤의 마지막 사진 순 (맨 앞이 가장 최근)
    function rollList() {
      var saved = ((YUSHI.data.apps && YUSHI.data.apps.photos) || []).map(function (p) { return p.video ? p.poster : p.src; }).reverse();
      return photos.concat(saved);
    }
    function updateThumb() {
      var list = rollList();
      thumb.style.backgroundImage = list.length ? 'url("' + list[0] + '")' : "";
      thumb.disabled = !list.length;
    }
    updateThumb();

    function openIris() { setTimeout(function () { iris.classList.remove("is-closed"); }, 350); }

    // 카메라를 쓸 수 없을 때도 안내 문구 없이 검은 뷰파인더만 보여 줌
    function showMessage() {
      msg.hidden = true;
      shutter.disabled = true;
      flip.disabled = true;
    }

    function stopStream() {
      if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
      stream = null;
    }

    function start() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showMessage("이 브라우저에서는 카메라를 사용할 수 없습니다.");
        openIris();
        return;
      }
      navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false })
        .then(function (s) {
          if (!alive) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
          stopStream();
          stream = s;
          video.srcObject = s;
          video.classList.toggle("is-mirror", facing === "user");
          msg.hidden = true;
          shutter.disabled = false;
          flip.disabled = false;
          openIris();
        })
        .catch(function () {
          showMessage("카메라를 사용할 수 없습니다.\n브라우저에서 카메라 사용을 허용하면 볼 수 있습니다.");
          openIris();
        });
    }

    function capture() {
      if (!stream || !video.videoWidth) return;
      // 화면에 보이는 비율대로 잘라서 저장
      var vw = video.videoWidth, vh = video.videoHeight;
      var box = video.getBoundingClientRect();
      var ratio = box.width / box.height;
      var sw = vw, sh = vw / ratio;
      if (sh > vh) { sh = vh; sw = vh * ratio; }
      var canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = Math.round(640 / ratio);
      var ctx = canvas.getContext("2d");
      if (facing === "user") { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
      ctx.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, canvas.width, canvas.height);
      var url = canvas.toDataURL("image/jpeg", 0.85);
      photos.unshift(url);

      // 찰칵: 조리개가 닫혔다 열림
      iris.classList.add("is-closed");
      flash.classList.add("is-on");
      setTimeout(function () { iris.classList.remove("is-closed"); flash.classList.remove("is-on"); }, 260);

      updateThumb();
    }

    function showRoll(i) {
      var list = rollList();
      viewIndex = Math.max(0, Math.min(list.length - 1, i));
      roll.querySelector(".cam-roll-img").src = list[viewIndex];
      roll.querySelector(".cam-roll-title").textContent = (list.length - viewIndex) + " / " + list.length;
      roll.hidden = false;
    }

    shutter.addEventListener("click", capture);
    thumb.addEventListener("click", function () { if (rollList().length) showRoll(0); });
    roll.querySelector(".cam-roll-done").addEventListener("click", function () { roll.hidden = true; });
    roll.querySelector(".cam-roll-nav").addEventListener("click", function (e) {
      var b = e.target.closest("[data-dir]");
      if (b) showRoll(viewIndex + Number(b.getAttribute("data-dir")));
    });
    flip.addEventListener("click", function () {
      facing = facing === "environment" ? "user" : "environment";
      iris.classList.add("is-closed");
      start();
    });

    start();

    // 앱을 닫으면 카메라를 끔
    return function () {
      alive = false;
      stopStream();
    };
  };
})();
