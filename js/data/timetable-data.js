/*
 * 시간표 (홈 화면을 옆으로 넘기면 보이는 두 번째 페이지)
 * -----------------------------------------
 * classes : 수업
 *   name  : 과목 이름
 *   room  : 강의실
 *   day   : "월" "화" "수" "목" "금"
 *   start / end : "HH:MM" (24시간)
 *   color : 칸 색 (없으면 자동, 같은 과목은 같은 색)
 * extras  : 시간이 정해지지 않은 과목 { name, note }
 * startHour / endHour : 시간표에 보이는 시간 범위
 */
window.YUSHI = window.YUSHI || {};
YUSHI.data = YUSHI.data || {};

YUSHI.data.timetable = {
  title: "2013년 1학기",
  startHour: 9,
  endHour: 18,
  classes: [
    { name: "무용레파토리(현대무용) 1", room: "무용원 중형 스튜디오",   day: "월", start: "11:00", end: "15:00" },
    { name: "중급실기(현대무용) 3",     room: "무용원 204호",          day: "화", start: "13:00", end: "15:00" },
    { name: "무용음악실습 1",           room: "실습실",                day: "수", start: "09:00", end: "11:00" },
    { name: "무용즉흥 1",               room: "소형 스튜디오",          day: "수", start: "11:00", end: "13:00" },
    { name: "서양무용역사",             room: "무용원 이론강의실",      day: "목", start: "10:00", end: "12:00" },
    { name: "중급실기(현대무용) 3",     room: "무용원 204호",          day: "목", start: "13:00", end: "15:00" },
    { name: "예술과 사회",              room: "석관동 캠퍼스 공동강의실", day: "금", start: "11:00", end: "13:00" },
    { name: "기초안무실습 1",           room: "무용원 소형 스튜디오",   day: "금", start: "14:00", end: "17:00" }
  ],

  // 시간이 정해지지 않은 과목 — 시간표 맨 아래 칸에 글자로만 보임
  extras: [
    { name: "무용원 공연 실습 1", note: "시간 자율" }
  ]
};
