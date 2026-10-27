/*
 * 음성 메모 데이터
 * -----------------------------------------
 * "(예시)"가 붙은 항목은 화면 확인용이므로 지우거나 바꿔 주세요.
 *
 * memos : 음성 메모 목록 (시간순으로 자동 정렬, 최신이 위)
 *   time     : 녹음한 시각 "YYYY-MM-DD HH:MM"
 *   label    : (선택) 이름. 없으면 목록에 시각이 크게 보입니다.
 *   audio    : 실제 존재하는 오디오 파일 경로. 예) "assets/voice/memo1.mp3"
 *              mp3를 추천합니다 (대부분의 브라우저에서 재생됨).
 *              null이면 목록에는 보이지만 재생할 수 없습니다.
 *   duration : (선택) 길이(초). audio가 있으면 파일에서 자동으로 읽습니다.
 */
window.YUSHI = window.YUSHI || {};
YUSHI.data = YUSHI.data || {};

YUSHI.data.voice = {
  // 세 개 모두 2월 10일 오후 2:32 (같은 시각이면 아래에 적은 순서대로 보임)
  memos: [
    { id: "m3", time: "2013-02-10 14:32", audio: "assets/voice/memo3.mp3", duration: 7.8 },
    { id: "m2", time: "2013-02-10 14:32", audio: "assets/voice/memo2.mp3", duration: 8.2 },
    { id: "m1", time: "2013-02-10 14:32", audio: "assets/voice/memo1.mp3", duration: 4.8 }
  ]
};
