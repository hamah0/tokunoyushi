/*
 * 데이로그(사진 SNS) 데이터
 * -----------------------------------------
 * "(예시)"가 붙은 항목은 화면 확인용이므로 지우거나 바꿔 주세요.
 *
 * reactions : 감정 표현 종류 (id는 영어, label은 화면에 보이는 이름)
 * posts     : 게시물 (위에 적을수록 먼저 보이는 것은 아니며, 시간순으로 정렬됩니다)
 *   author    : 올린 사람
 *   time      : "YYYY-MM-DD HH:MM"
 *   text      : 글
 *   photo     : 실제 존재하는 이미지 경로 (없으면 null)
 *   photoSlot : photo가 없을 때 true면 '사진 자리' 상자를 보여 줌
 *   (people의 cover에 이미지 경로를 넣으면 프로필 커버로 쓰임. 없으면 가장 최근 사진)
 *   reactions : { 감정id: [누른 사람들] }
 *   comments  : [{ from, text, time }] — 답글은 to: "사람 id"를 적으면 그 이름이 파란 글씨로 앞에 붙음
 *
 * people의 추가 항목: birthday "MM-DD"(프로필에 'OO월 OO일생'), friendCount(친구 수), cover(배경: 이미지 경로 또는 "white" = 하얀 단색)
 * activities  : 소식에 끼는 한 줄 알림. { who, text: "프로필 사진을 변경했습니다.", time }
 * suggestions : 친구추천에 보일 사람 id
 * requests    : 받은 친구 신청 (사람 id)
 */
window.YUSHI = window.YUSHI || {};
YUSHI.data = YUSHI.data || {};

YUSHI.data.daylog = {
  me: "yushi",

  // Talk Story에는 각자 정한 이름(본명)으로 보임
  people: {
    yushi:  { name: "유우시", status: "", photo: null, color: "#7fa7c9", cover: "assets/covers/cover02.jpg", birthday: "04-05" },
    c01:    { name: "이승현", status: "", photo: null, color: "#b88fb3", cover: "assets/covers/cover01.jpg", friendCount: 78 },
    c02:    { name: "정수빈", status: "", photo: null, color: "#c98f8f", cover: "assets/covers/cover06.jpg", friendCount: 70 },
    c03:    { name: "김민지", status: "", photo: null, color: "#8fbcb8", cover: "assets/covers/cover07.jpg", friendCount: 59 },
    sion:   { name: "오시온", status: "", photo: null, color: "#8fb38a", cover: "assets/covers/cover02.jpg", friendCount: 68 },
    c04:    { name: "박준영", status: "", photo: null, color: "#9a9fc9", cover: "assets/covers/cover08.jpg", friendCount: 41 },
    c05:    { name: "김민준", status: "", photo: null, color: "#c4a46a", cover: "assets/covers/cover09.jpg", friendCount: 35 },
    c06:    { name: "최유진", status: "", photo: null, color: "#86a88f", cover: "assets/covers/cover05.jpg", friendCount: 65 },
    c07:    { name: "이서연", status: "", photo: null, color: "#8fb38a", cover: "assets/covers/cover01.jpg", friendCount: 75 },
    c08:    { name: "강민석", status: "", photo: null, color: "#c9a27f", cover: "white", friendCount: 77 },
    c09:    { name: "박지훈", status: "", photo: null, color: "#7fa7c9", cover: "assets/covers/cover04.jpg", friendCount: 48 },
    c10:    { name: "윤하은", status: "", photo: null, color: "#b88fb3", cover: "assets/covers/cover09.jpg", friendCount: 41 },
    c11:    { name: "최유나", status: "", photo: null, color: "#c98f8f", cover: "white", friendCount: 72 },
    c12:    { name: "한지호", status: "", photo: null, color: "#8fbcb8", cover: "assets/covers/cover05.jpg", friendCount: 65 },
    c13:    { name: "정시현", status: "", photo: null, color: "#a9a07a", cover: "assets/covers/cover08.jpg", friendCount: 39 },
    c14:    { name: "송예린", status: "", photo: null, color: "#9a9fc9", cover: "assets/covers/cover12.jpg", friendCount: 46 },
    c15:    { name: "강수진", status: "", photo: null, color: "#c4a46a", cover: "white", friendCount: 80 },
    c16:    { name: "임도윤", status: "", photo: null, color: "#86a88f", cover: "assets/covers/cover10.jpg", friendCount: 58 },
    c17:    { name: "윤지호", status: "", photo: null, color: "#8fb38a", cover: "assets/covers/cover10.jpg", friendCount: 47 },
    c18:    { name: "조은서", status: "", photo: null, color: "#c9a27f", cover: "white", friendCount: 36 },
    c19:    { name: "한예은", status: "", photo: null, color: "#7fa7c9", cover: "white", friendCount: 64 },
    c20:    { name: "신재현", status: "", photo: null, color: "#b88fb3", cover: "assets/covers/cover07.jpg", friendCount: 59 },
    c21:    { name: "송민재", status: "", photo: null, color: "#c98f8f", cover: "assets/covers/cover06.jpg", friendCount: 46 },
    c22:    { name: "김다은", status: "", photo: null, color: "#8fbcb8", cover: "assets/covers/cover11.jpg", friendCount: 49 },
    c23:    { name: "임수아", status: "", photo: null, color: "#a9a07a", cover: "assets/covers/cover07.jpg", friendCount: 52 },
    c24:    { name: "이준서", status: "", photo: null, color: "#9a9fc9", cover: "white", friendCount: 66 },
    c25:    { name: "조현준", status: "", photo: null, color: "#c4a46a", cover: "assets/covers/cover01.jpg", friendCount: 37 },
    c26:    { name: "박소희", status: "", photo: null, color: "#86a88f", cover: "assets/covers/cover09.jpg", friendCount: 60 },
    c27:    { name: "신유리", status: "", photo: null, color: "#8fb38a", cover: "assets/covers/cover03.jpg", friendCount: 78 },
    c28:    { name: "최민호", status: "", photo: null, color: "#c9a27f", cover: "assets/covers/cover11.jpg", friendCount: 78 },
    c29:    { name: "김도윤", status: "", photo: null, color: "#7fa7c9", cover: "assets/covers/cover03.jpg", friendCount: 42 },
    c30:    { name: "정유림", status: "", photo: null, color: "#b88fb3", cover: "assets/covers/cover04.jpg", friendCount: 47 },
    c31:    { name: "이채원", status: "", photo: null, color: "#c98f8f", cover: "white", friendCount: 74 },
    c32:    { name: "강태현", status: "", photo: null, color: "#8fbcb8", cover: "white", friendCount: 49 },
    c33:    { name: "박성민", status: "", photo: null, color: "#a9a07a", cover: "assets/covers/cover09.jpg", friendCount: 50 },
    c34:    { name: "오지민", status: "", photo: null, color: "#9a9fc9", cover: "assets/covers/cover05.jpg", friendCount: 39 },
    c35:    { name: "최지우", status: "", photo: null, color: "#c4a46a", cover: "white", friendCount: 80 },
    c36:    { name: "장우진", status: "", photo: null, color: "#86a88f", cover: "assets/covers/cover10.jpg", friendCount: 50 },
    c37:    { name: "정다희", status: "", photo: null, color: "#8fb38a", cover: "assets/covers/cover07.jpg", friendCount: 50 },
    c38:    { name: "백서윤", status: "", photo: null, color: "#c9a27f", cover: "assets/covers/cover07.jpg", friendCount: 35 },
    c39:    { name: "강준호", status: "", photo: null, color: "#7fa7c9", cover: "assets/covers/cover05.jpg", friendCount: 59 },
    c40:    { name: "남도현", status: "", photo: null, color: "#b88fb3", cover: "assets/covers/cover05.jpg", friendCount: 51 },
    c41:    { name: "윤소영", status: "", photo: null, color: "#c98f8f", cover: "assets/covers/cover05.jpg", friendCount: 67 },
    c42:    { name: "권민아", status: "", photo: null, color: "#8fbcb8", cover: "assets/covers/cover03.jpg", friendCount: 50 },
    c43:    { name: "한승우", status: "", photo: null, color: "#a9a07a", cover: "assets/covers/cover09.jpg", friendCount: 61 },
    c44:    { name: "황지훈", status: "", photo: null, color: "#9a9fc9", cover: "assets/covers/cover01.jpg", friendCount: 48 },
    c45:    { name: "송지은", status: "", photo: null, color: "#c4a46a", cover: "white", friendCount: 45 },
    c46:    { name: "배수현", status: "", photo: null, color: "#86a88f", cover: "white", friendCount: 77 },
    c47:    { name: "임재민", status: "", photo: null, color: "#8fb38a", cover: "white", friendCount: 79 },
    c48:    { name: "문예진", status: "", photo: null, color: "#c9a27f", cover: "assets/covers/cover09.jpg", friendCount: 57 }
  },

  friends: [
    "c08", "c15", "c39", "c32", "c42", "c22", "c29", "c05",
    "c03", "c40", "c48", "c33", "c26", "c04", "c09", "c46",
    "c38", "c21", "c14", "c45", "c27", "c20", "sion", "c34",
    "c41", "c17", "c10", "c07", "c01", "c24", "c31", "c16",
    "c23", "c47", "c36", "c37", "c02", "c13", "c30", "c18",
    "c25", "c28", "c11", "c06", "c35", "c43", "c19", "c12",
    "c44"
  ],

  activities: [],

  suggestions: [],

  requests: [],

  reactions: [
    { id: "like",  label: "좋아요" },
    { id: "cool",  label: "멋져요" },
    { id: "happy", label: "기뻐요" },
    { id: "sad",   label: "슬퍼요" },
    { id: "cheer", label: "힘내요" }
  ],

  posts: [
    {
      id: "yushi-20120511",
      author: "yushi",
      time: "2012-05-11 21:14",
      text: "ㅎㅎ",
      photo: "assets/stories/yushi-20120511.jpg",
      reactions: {
        like: ["sion", "c13", "c03", "c27", "c38", "c11"],
        cool: ["c39", "c12", "c45", "c47"]
      },
      comments: []
    },
    {
      id: "sion-20120512",
      author: "sion",
      time: "2012-05-12 18:30",
      text: "♥",
      photo: "assets/stories/sion-20120512.jpg",
      reactions: {
        like: ["yushi", "c08", "c13", "c01", "c45"],
        cool: ["c12", "c03", "c11"]
      },
      comments: []
    },
    {
      id: "c39-20130101",
      author: "c39",
      time: "2013-01-01 00:01",
      text: "Happy New Year!!",
      photo: null,
      reactions: {
        like:  ["c37", "c12"],
        cool:  ["c47"],
        happy: ["yushi"]
      },
      comments: [
        { from: "c12",   text: "준호도 올해 화이팅", time: "2013-01-01 10:12" }
      ]
    },
    {
      id: "c11-20130101",
      author: "c11",
      time: "2013-01-01 00:03",
      text: "  ＼│／   복\n .*\"☆\"*.  주\n( ♡복♡ ) 머\n \"*.__.*\"  니\n새해복마니받앙~",
      photo: null,
      reactions: {
        like:  ["c03", "c27", "c38", "yushi"],
        happy: ["c45", "c01"]
      },
      comments: [
        { from: "c27",   text: "유나도 새해 복 많이 받아~♡", time: "2013-01-01 00:10" },
        { from: "c38",   text: "ㅋㅋㅋ 복주머니 귀엽다", time: "2013-01-01 00:21" }
      ]
    },
    {
      id: "c45-20130101",
      author: "c45",
      time: "2013-01-01 00:15",
      text: "",
      photo: "assets/stories/c45-20130101.jpg",
      reactions: {
        like:  ["c11", "c39", "sion"],
        happy: ["yushi", "c03", "c47"]
      },
      comments: [
        { from: "c03",   text: "ㅋㅋㅋㅋ 복 쏟아진다", time: "2013-01-01 00:30" },
        { from: "c01",   text: "나도 복 좀 나눠줘~", time: "2013-01-01 01:02" },
        { from: "c47",   text: "새해 복 많이 받아 지은아!", time: "2013-01-01 09:40" }
      ]
    },
    {
      id: "c13-20130101",
      author: "c13",
      time: "2013-01-01 14:20",
      text: "정진!",
      photo: "assets/stories/c13-20130101.jpg",
      reactions: {
        cool:  ["c03", "c39", "c47"],
        happy: ["yushi", "c27"],
        like:  ["c01", "c11", "c45", "c38"],
        cheer: ["c12", "c37"]
      },
      comments: []
    },
    {
      id: "sion-20121021",
      author: "sion",
      time: "2012-10-21 20:16",
      text: "",
      photo: "assets/stories/sion-20121021.jpg",
      reactions: {
        like: ["yushi", "c13", "c03", "c01", "c11", "c38"],
        cool: ["c08", "c12", "c45", "c27"]
      },
      comments: [
        { from: "c08",   text: "깜짝아 지금인 줄",              time: "2012-10-21 20:24" },
        { from: "sion",  to: "c08",   text: "그랬으면 좋겠다~~ㅋㅋ",  time: "2012-10-21 20:31" },
        { from: "c12",   text: "휴가?",                         time: "2012-10-21 20:40" },
        { from: "sion",  to: "c12",   text: "엉",                            time: "2012-10-21 20:42" },
        { from: "yushi", text: "내가 찍어준 거다",              time: "2012-10-21 20:55" },
        { from: "sion",  to: "yushi", text: "사랑해~~",                      time: "2012-10-21 20:57" }
      ]
    },
    {
      id: "yushi-20120418",
      author: "yushi",
      time: "2012-04-18 22:47",
      text: "",
      photo: "assets/stories/yushi-20120418.jpg",
      reactions: {
        like: ["c13", "c03", "c27", "c45", "c12", "c11", "c38"],
        cool: ["sion", "c39", "c01", "c47", "c37"]
      },
      comments: [
        { from: "c13", text: "날~다", time: "2012-04-18 22:51" },
        { from: "c03", text: "👏👏👏", time: "2012-04-18 22:58" },
        { from: "c39", text: "👍👍", time: "2012-04-18 23:06" },
        { from: "c27", text: "👏👍", time: "2012-04-18 23:20" },
        { from: "sion", text: "멋지다아~~~", time: "2012-05-11 19:32" }
      ]
    }
  ]
};
