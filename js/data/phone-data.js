/*
 * 전화 앱 데이터
 * -----------------------------------------
 * "(예시)"가 붙은 항목은 화면 확인용이므로 지우거나 바꿔 주세요.
 *
 * contacts  : 연락처. id는 영어, number는 "010-1234-5678" 형식 (없으면 "")
 *             photo에 실제 존재하는 이미지 경로를 넣으면 사진이 보입니다.
 * favorites : 즐겨찾기에 보일 연락처 id (순서대로)
 * recents   : 최근 통화. who = 연락처 id (모르는 번호면 number만)
 *             type = "in"(받은 전화) / "out"(건 전화) / "missed"(부재중)
 *             time = "YYYY-MM-DD HH:MM"
 * voicemail : 음성 사서함 (지금은 비어 있음)
 */
window.YUSHI = window.YUSHI || {};
YUSHI.data = YUSHI.data || {};

YUSHI.data.phone = {
  contacts: [
    { id: "mama", name: "ママ", number: "010-347-0628", photo: null, color: "#8fb38a" },
    { id: "papa", name: "パパ", number: "010-826-0628", photo: null, color: "#c9a27f" },
    { id: "jiu", name: "ジウ", number: "010-591-0628", photo: null, color: "#7fa7c9" },
    { id: "c01", name: "이승현", number: "010-482-1936", photo: null, color: "#b88fb3" },
    { id: "c02", name: "정수빈", number: "010-739-5824", photo: null, color: "#c98f8f" },
    { id: "c03", name: "김민지", number: "010-265-4179", photo: null, color: "#8fbcb8" },
    { id: "sion", name: "시오니~", number: "010-511-2200", photo: null, color: "#8fb38a" },
    { id: "c04", name: "박준영", number: "010-914-3285", photo: null, color: "#9a9fc9" },
    { id: "c05", name: "김민준", number: "010-573-2614", photo: null, color: "#c4a46a" },
    { id: "c06", name: "최유진 누나", number: "010-346-8152", photo: null, color: "#86a88f" },
    { id: "c07", name: "이서연", number: "010-827-4961", photo: null, color: "#8fb38a" },
    { id: "c08", name: "강민석 형", number: "010-451-6372", photo: null, color: "#c9a27f" },
    { id: "c09", name: "박지훈", number: "010-692-1847", photo: null, color: "#7fa7c9" },
    { id: "c10", name: "윤하은(한무)", number: "010-318-9257", photo: null, color: "#b88fb3" },
    { id: "c11", name: "최유나", number: "010-764-5318", photo: null, color: "#c98f8f" },
    { id: "c12", name: "한지호 형", number: "010-529-3461", photo: null, color: "#8fbcb8" },
    { id: "c13", name: "정시현", number: "010-238-7932", photo: null, color: "#a9a07a" },
    { id: "c14", name: "송예린 선배(09학번)", number: "010-875-6149", photo: null, color: "#9a9fc9" },
    { id: "c15", name: "강수진", number: "010-246-7831", photo: null, color: "#c4a46a" },
    { id: "c16", name: "임도윤 선배(10학번)", number: "010-681-2573", photo: null, color: "#86a88f" },
    { id: "c17", name: "윤지호 형", number: "010-937-4618", photo: null, color: "#8fb38a" },
    { id: "c18", name: "조은서(발레)", number: "010-354-8291", photo: null, color: "#c9a27f" },
    { id: "c19", name: "한예은", number: "010-718-3629", photo: null, color: "#7fa7c9" },
    { id: "c20", name: "신재현(발레)", number: "010-492-1578", photo: null, color: "#b88fb3" },
    { id: "c21", name: "송민재", number: "010-863-5942", photo: null, color: "#c98f8f" },
    { id: "c22", name: "김다은 선배(11학번)", number: "010-275-8163", photo: null, color: "#8fbcb8" },
    { id: "c23", name: "임수아", number: "010-641-7385", photo: null, color: "#a9a07a" },
    { id: "c24", name: "이준서 선배(11학번)", number: "010-386-9471", photo: null, color: "#9a9fc9" },
    { id: "c25", name: "조현준", number: "010-952-3146", photo: null, color: "#c4a46a" },
    { id: "c26", name: "박소희", number: "010-417-6852", photo: null, color: "#86a88f" },
    { id: "c27", name: "신유리", number: "010-584-9276", photo: null, color: "#8fb38a" },
    { id: "c28", name: "최민호 선배(11학번)", number: "010-726-4138", photo: null, color: "#c9a27f" },
    { id: "c29", name: "김도윤", number: "010-193-8642", photo: null, color: "#7fa7c9" },
    { id: "c30", name: "정유림 누나", number: "010-648-2719", photo: null, color: "#b88fb3" },
    { id: "c31", name: "이채원", number: "010-315-7462", photo: null, color: "#c98f8f" },
    { id: "c32", name: "강태현", number: "010-879-5316", photo: null, color: "#8fbcb8" },
    { id: "c33", name: "박성민", number: "010-462-1975", photo: null, color: "#a9a07a" },
    { id: "c34", name: "오지민(한무)", number: "010-537-9468", photo: null, color: "#9a9fc9" },
    { id: "c35", name: "최지우", number: "010-284-7139", photo: null, color: "#c4a46a" },
    { id: "c36", name: "장우진(한무)", number: "010-916-4827", photo: null, color: "#86a88f" },
    { id: "c37", name: "정다희", number: "010-753-1294", photo: null, color: "#8fb38a" },
    { id: "c38", name: "백서윤", number: "010-391-6584", photo: null, color: "#c9a27f" },
    { id: "c39", name: "강준호", number: "010-627-8951", photo: null, color: "#7fa7c9" },
    { id: "c40", name: "남도현", number: "010-845-3167", photo: null, color: "#b88fb3" },
    { id: "c41", name: "윤소영", number: "010-269-5748", photo: null, color: "#c98f8f" },
    { id: "c42", name: "권민아", number: "010-714-2839", photo: null, color: "#8fbcb8" },
    { id: "c43", name: "한승우", number: "010-583-1627", photo: null, color: "#a9a07a" },
    { id: "c44", name: "황지훈 선배(10학번)", number: "010-942-6753", photo: null, color: "#9a9fc9" },
    { id: "c45", name: "송지은", number: "010-376-9184", photo: null, color: "#c4a46a" },
    { id: "c46", name: "배수현 선배(10학번)", number: "010-851-4296", photo: null, color: "#86a88f" },
    { id: "c47", name: "임재민", number: "010-496-8317", photo: null, color: "#8fb38a" },
    { id: "c48", name: "문예진", number: "010-632-5741", photo: null, color: "#c9a27f" },
    { id: "p01", name: "김태윤 교수님", number: "010-427-6815", photo: null, color: "#8fb38a" },
    { id: "p02", name: "박선영 교수님", number: "010-583-2749", photo: null, color: "#c9a27f" },
    { id: "p03", name: "이정우 교수님", number: "010-316-8527", photo: null, color: "#7fa7c9" },
    { id: "p04", name: "최은정 교수님", number: "010-749-1638", photo: null, color: "#b88fb3" },
    { id: "p05", name: "한도현 교수님", number: "010-652-4917", photo: null, color: "#c98f8f" },
    { id: "p06", name: "윤미경 교수님", number: "010-891-5374", photo: null, color: "#8fbcb8" }
  ],

  favorites: ["sion"],

  // 통화 장면: 이 연락처에 걸었을 때, unlock 조건이 열렸으면 상대가 받고 대사가 차례로 나온 뒤 끊김
  //   ring: 받기까지 초 / lines: [{ after: 앞 대사 뒤 초, text }] / hangup: 마지막 대사 뒤 끊기까지 초
  //   unlock: Talk 대화방에서 특정 메시지를 봤을 때 열림 (wink-data.js의 unlockOnSeen.key)
  //   조건이 안 열렸으면 예전처럼 '호출 중...'에서 멈춤. 한 번 통화하면 다음부터는 다시 호출 중.
  callScripts: {
    sion: {
      unlock: "sionCall",
      ring: 4,
      lines: [
        { after: 1.5, text: "여보세요?" },
        { after: 3.5, text: "우시 놀랐지이" },
        { after: 4,   text: "서프라이즈 하고 싶어서 거짓말 좀 했어" },
        { after: 5,   text: "생일은 같이 보내야지" },
        { after: 4.5, text: "아직 도착하려면 멀었어" },
        { after: 4,   text: "집 가서 얌전히 기다리고 있을게" },
        { after: 5,   text: "사랑해애 이따 봐" }
      ],
      hangup: 4
    }
  },

  // 최근 통화 (위에서부터 최근 순)
  recents: [
    { number: "070-989-1365",    type: "in", time: "2013-04-03 19:26" },
    { number: "070-989-1365",    type: "in", time: "2013-03-31 11:22" },
    { number: "070-989-1365",    type: "in", time: "2013-03-30 18:54" },
    { number: "02-318-5527",     type: "missed", time: "2013-03-29 10:37" },
    { number: "070-989-1365",    type: "in", time: "2013-03-27 20:12" },
    { who: "mama",               type: "in", time: "2013-03-26 21:15" },
    { number: "070-989-1365",    type: "in", time: "2013-03-24 19:32" },
    { number: "070-989-1365",    type: "in", time: "2013-03-22 11:03" },
    { number: "070-989-1365",    type: "missed", time: "2013-03-21 19:13" },
    { number: "070-989-1365",    type: "missed", time: "2013-03-21 18:52" },
    { who: "c13",                type: "in", time: "2013-03-16 16:05" },
    { number: "02-736-2091",     type: "missed", time: "2013-03-13 14:51" },
    { who: "jiu",                type: "in", time: "2013-03-12 22:10" },
    { number: "070-989-1365",    type: "in", time: "2013-03-10 11:09" },
    { number: "070-989-1365",    type: "in", time: "2013-03-09 18:35" },
    { number: "070-989-1365",    type: "in", time: "2013-03-06 18:48" },
    { number: "070-989-1365",    type: "in", time: "2013-03-05 20:08" },
    { who: "mama",               type: "in", time: "2013-03-03 20:40" },
    { number: "070-989-1365",    type: "in", time: "2013-03-02 11:04" },
    { number: "070-989-1365",    type: "in", time: "2013-02-27 19:13" },
    { number: "070-989-1365",    type: "in", time: "2013-02-25 18:55" },
    { number: "070-989-1365",    type: "in", time: "2013-02-24 10:52" },
    { who: "c13",                type: "in", time: "2013-02-23 14:40" },
    { number: "070-989-1365",    type: "in", time: "2013-02-22 20:10" },
    { number: "070-989-1365",    type: "in", time: "2013-02-20 18:48" },
    { number: "070-989-1365",    type: "in", time: "2013-02-19 19:27" },
    { who: "mama",               type: "in", time: "2013-02-17 21:05" },
    { number: "031-263-6421",    type: "in", time: "2013-02-17 11:13" },
    { number: "031-263-6421",    type: "in", time: "2013-02-16 19:20" },
    { number: "070-989-1365",    type: "in", time: "2013-02-14 18:34" },
    { number: "070-989-1365",    type: "in", time: "2013-02-12 19:20" },
    { number: "070-989-1365",    type: "in", time: "2013-02-11 18:52" },
    { number: "02-517-3842",     type: "missed", time: "2013-02-08 11:24" },
    { number: "070-989-1365",    type: "in", time: "2013-02-06 18:48" },
    { number: "070-989-1365",    type: "missed", time: "2013-02-05 19:45" },
    { number: "070-989-1365",    type: "missed", time: "2013-02-05 19:42" },
    { who: "jiu",                type: "in", time: "2013-02-02 17:40" },
    { number: "070-989-1365",    type: "in", time: "2013-02-01 07:33" },
    { who: "c13",                type: "in", time: "2013-01-31 15:12" },
    { number: "070-989-1365",    type: "in", time: "2013-01-29 19:20" },
    { who: "p01",                type: "in", time: "2013-01-29 13:32" },
    { number: "070-989-1365",    type: "in", time: "2013-01-28 20:12" },
    { number: "031-263-6421",    type: "in", time: "2013-01-27 18:52" },
    { number: "070-989-1365",    type: "in", time: "2013-01-24 18:49" },
    { number: "070-989-1365",    type: "in", time: "2013-01-22 20:00" },
    { number: "070-989-1365",    type: "in", time: "2013-01-21 19:02" },
    { who: "mama",               type: "in", time: "2013-01-20 21:10" },
    { number: "031-263-6421",    type: "in", time: "2013-01-20 10:26" },
    { number: "031-263-6421",    type: "in", time: "2013-01-19 18:53" },
    { number: "070-989-1365",    type: "in", time: "2013-01-17 19:25" },
    { number: "070-989-1365",    type: "in", time: "2013-01-15 19:30" }
  ],

  voicemail: []
};
