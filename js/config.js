/*
 * Yushi's iPhone — 기본 설정
 * -----------------------------------------
 * 스토리에 맞춰 바꿀 값은 이 파일에만 모아 두었습니다.
 * 숫자만 바꾸고 저장한 뒤 브라우저를 새로고침하면 반영됩니다.
 */
window.YUSHI = window.YUSHI || {};

YUSHI.config = {
  // 기기 속 날짜 (2013년 4월 4일 = 목요일)
  date: { year: 2013, month: 4, day: 4 },

  // 기기 속 시작 시각 (24시간 기준으로 입력) — 지금은 예시 값입니다.
  time: { hour: 9, minute: 53 },

  // true: 페이지를 연 뒤 실제 시간처럼 1분씩 흘러감
  // false: 위 시각에 멈춰 있음
  clockRuns: true,

  // false: '오후 9:30' 방식(당시 한국어 기본) / true: '21:30'
  use24Hour: false,

  // 상태 표시줄
  carrier: "SKT",
  network: "wifi",       // "wifi"(와이파이 표시), "LTE", "3G", "E" 등
  signal: 4,             // 0~5 칸
  battery: 64,           // 0~100
  showBatteryPercent: false,

  // 배경화면: 실제로 존재하는 파일 경로만 적어 주세요.
  // null로 두면 CSS로 그린 기본 배경을 씁니다.
  wallpaper: {
    lock: "assets/wallpaper-lock.jpg",   // 잠금 화면 (사진)
    home: "assets/wallpaper-home.jpg"    // 홈 화면 (물방울)
  }
};
