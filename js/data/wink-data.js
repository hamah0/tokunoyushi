/*
 * 윙크(메신저) 데이터
 * -----------------------------------------
 * 이야기 콘텐츠는 이 파일에서만 관리합니다.
 * "(예시)"가 붙은 항목은 화면 확인용이므로 지우거나 바꿔 주세요.
 *
 * people   : 등장인물. photo에 실제 존재하는 이미지 경로를 넣으면 사진이 보입니다.
 *            (예: "assets/people/sion.jpg") 비워 두면 색깔 기본 프로필이 나옵니다.
 * friends  : 친구 목록에 보일 사람 (순서대로)
 * chats    : 대화방. with = 상대, unread = 안 읽은 메시지 수
 *            그룹채팅방은 with 대신 name(방 이름)과 members(나를 뺀 참여자 id 목록)
 *            메시지가 없는 방은 채팅 목록 아래쪽에 보입니다
 *   messages: from = 보낸 사람, text = 내용, time = "YYYY-MM-DD HH:MM"
 *             사진 메시지는 text 대신 photo: "실제 이미지 경로" (없으면 photoSlot: true)
 *             unread: 숫자 → 말풍선 옆에 안 읽은 사람 수 (예: 1)
 *             안내 문구는 { system: "OO님이 나갔습니다.", time: "..." }
 *   draft  : (선택) 독자가 입력칸을 누르면 키보드로 한 글자씩 저절로 쳐지는 글. 전송은 독자가 직접 누름
 *   afterDraft : (선택) { delay: 초, gap: 메시지 사이 초, messages: [...], readNow, next } draft를 보낸 뒤 상대가 보내는 메시지
 *                readNow: true면 보내자마자 '1'이 사라짐 / next: { draft, ...afterDraft } 그다음 단계
 */
window.YUSHI = window.YUSHI || {};
YUSHI.data = YUSHI.data || {};

YUSHI.data.wink = {
  me: "yushi",

  // 연락처와 같은 사람들 (Talk에는 연락처에 저장한 이름 그대로 보임)
  people: {
    yushi:  { name: "유우시", status: "", photo: "assets/people/yushi.jpg", color: "#7fa7c9" },
    mama:   { name: "ママ", status: "", photo: "assets/people/mama.jpg", color: "#8fb38a" },
    papa:   { name: "パパ", status: "", photo: null, color: "#c9a27f" },
    jiu:    { name: "ジウ", status: "", photo: null, color: "#7fa7c9" },
    c01:    { name: "이승현", status: "", photo: "assets/people/c01.jpg", color: "#b88fb3" },
    c02:    { name: "정수빈", status: "", photo: null, color: "#c98f8f" },
    c03:    { name: "김민지", status: "", photo: "assets/people/c03.jpg", color: "#8fbcb8" },
    sion:   { name: "시오니~", status: "", photo: "assets/people/sion.jpg", color: "#8fb38a" },
    c04:    { name: "박준영", status: "", photo: null, color: "#9a9fc9" },
    c05:    { name: "김민준", status: "", photo: null, color: "#c4a46a" },
    c06:    { name: "최유진 누나", status: "", photo: null, color: "#86a88f" },
    c07:    { name: "이서연", status: "", photo: null, color: "#8fb38a" },
    c08:    { name: "강민석 형", status: "", photo: "assets/people/c08.jpg", color: "#c9a27f" },
    c09:    { name: "박지훈", status: "", photo: "assets/people/c09.jpg", color: "#7fa7c9" },
    c10:    { name: "윤하은(한무)", status: "", photo: null, color: "#b88fb3" },
    c11:    { name: "최유나", status: "", photo: null, color: "#c98f8f" },
    c12:    { name: "한지호 형", status: "", photo: "assets/people/c12.jpg", color: "#8fbcb8" },
    c13:    { name: "정시현", status: "", photo: "assets/people/c13.jpg", color: "#a9a07a" },
    c14:    { name: "송예린 선배(09학번)", status: "", photo: null, color: "#9a9fc9" },
    c15:    { name: "강수진", status: "", photo: "assets/people/c15.jpg", color: "#c4a46a" },
    c16:    { name: "임도윤 선배(10학번)", status: "", photo: null, color: "#86a88f" },
    c17:    { name: "윤지호 형", status: "", photo: null, color: "#8fb38a" },
    c18:    { name: "조은서(발레)", status: "", photo: null, color: "#c9a27f" },
    c19:    { name: "한예은", status: "", photo: null, color: "#7fa7c9" },
    c20:    { name: "신재현(발레)", status: "", photo: "assets/people/c20.jpg", color: "#b88fb3" },
    c21:    { name: "송민재", status: "", photo: null, color: "#c98f8f" },
    c22:    { name: "김다은 선배(11학번)", status: "", photo: "assets/people/c22.jpg", color: "#8fbcb8" },
    c23:    { name: "임수아", status: "", photo: null, color: "#a9a07a" },
    c24:    { name: "이준서 선배(11학번)", status: "", photo: "assets/people/c24.jpg", color: "#9a9fc9" },
    c25:    { name: "조현준", status: "", photo: null, color: "#c4a46a" },
    c26:    { name: "박소희", status: "", photo: null, color: "#86a88f" },
    c27:    { name: "신유리", status: "", photo: "assets/people/c27.jpg", color: "#8fb38a" },
    c28:    { name: "최민호 선배(11학번)", status: "", photo: "assets/people/c28.jpg", color: "#c9a27f" },
    c29:    { name: "김도윤", status: "", photo: null, color: "#7fa7c9" },
    c30:    { name: "정유림 누나", status: "", photo: null, color: "#b88fb3" },
    c31:    { name: "이채원", status: "", photo: null, color: "#c98f8f" },
    c32:    { name: "강태현", status: "", photo: null, color: "#8fbcb8" },
    c33:    { name: "박성민", status: "", photo: null, color: "#a9a07a" },
    c34:    { name: "오지민(한무)", status: "", photo: "assets/people/c34.jpg", color: "#9a9fc9" },
    c35:    { name: "최지우", status: "", photo: null, color: "#c4a46a" },
    c36:    { name: "장우진(한무)", status: "", photo: null, color: "#86a88f" },
    c37:    { name: "정다희", status: "", photo: null, color: "#8fb38a" },
    c38:    { name: "백서윤", status: "", photo: "assets/people/c38.jpg", color: "#c9a27f" },
    c39:    { name: "강준호", status: "", photo: "assets/people/c39.jpg", color: "#7fa7c9" },
    c40:    { name: "남도현", status: "", photo: "assets/people/c40.jpg", color: "#b88fb3" },
    c41:    { name: "윤소영", status: "", photo: "assets/people/c41.jpg", color: "#c98f8f" },
    c42:    { name: "권민아", status: "", photo: null, color: "#8fbcb8" },
    c43:    { name: "한승우", status: "", photo: null, color: "#a9a07a" },
    c44:    { name: "황지훈 선배(10학번)", status: "", photo: null, color: "#9a9fc9" },
    c45:    { name: "송지은", status: "", photo: "assets/people/c45.jpg", color: "#c4a46a" },
    c46:    { name: "배수현 선배(10학번)", status: "", photo: "assets/people/c46.jpg", color: "#86a88f" },
    c47:    { name: "임재민", status: "", photo: "assets/people/c47.jpg", color: "#8fb38a" },
    c48:    { name: "문예진", status: "", photo: "assets/people/c48.jpg", color: "#c9a27f" },
    p01:    { name: "김태윤 교수님", status: "", photo: "assets/people/p01.jpg", color: "#8fb38a" },
    p02:    { name: "박선영 교수님", status: "", photo: "assets/people/p02.jpg", color: "#c9a27f" },
    p03:    { name: "이정우 교수님", status: "", photo: null, color: "#7fa7c9" },
    p04:    { name: "최은정 교수님", status: "", photo: "assets/people/p04.jpg", color: "#b88fb3" },
    p05:    { name: "한도현 교수님", status: "", photo: null, color: "#c98f8f" },
    p06:    { name: "윤미경 교수님", status: "", photo: null, color: "#8fbcb8" }
  },

  friends: [
    "c08", "c15", "c39", "c32", "c42", "c22", "c29", "c05",
    "c03", "p01", "c40", "c48", "p02", "c33", "c26", "c04",
    "c09", "c46", "c38", "c21", "c14", "c45", "sion", "c27",
    "c20", "c34", "p06", "c41", "c17", "c10", "c07", "c01",
    "p03", "c24", "c31", "c16", "c23", "c47", "c36", "c37",
    "c02", "c13", "c30", "c18", "c25", "c28", "c11", "c06",
    "p04", "c35", "p05", "c43", "c19", "c12", "c44", "jiu",
    "papa", "mama"
  ],

  chats: [
    {
      id: "dance-2013",
      name: "2013 중급실기(현대무용)",
      members: [
        "p06", "c01", "c03", "c29", "c39", "c43", "c12", "c11",
        "c25", "c47", "c37", "c27", "c45", "c38", "c33"
      ],
      unread: 0,
      messages: [
        { from: "p06",   text: "이번 주 화요일 중급실기 수업은 무용원 204호 아니고 301호 대형 스튜디오에서 진행합니다. 착오 없길 바랍니다.", time: "2013-03-11 13:14" },
        { from: "c11",   text: "네!", time: "2013-03-11 13:15" },
        { from: "c01",   text: "넵!", time: "2013-03-11 13:15" },
        { from: "c03",   text: "네 확인했습니다 교수님", time: "2013-03-11 13:16" },
        { from: "c39",   text: "네!", time: "2013-03-11 13:16" },
        { from: "c37",   text: "네 확인했습니다 교수님", time: "2013-03-11 13:18" },
        { from: "c43",   text: "넵!", time: "2013-03-11 13:19" },
        { from: "yushi", text: "네 확인했습니다", time: "2013-03-11 13:21" },
        { from: "c27",   text: "네!", time: "2013-03-11 13:22" },
        { from: "c12",   text: "네 확인했습니다 교수님", time: "2013-03-11 13:24" },
        { from: "c45",   text: "넵!", time: "2013-03-11 13:27" },
        { from: "c25",   text: "네!", time: "2013-03-11 13:31" },
        { from: "c38",   text: "네 확인했습니다 교수님", time: "2013-03-11 13:36" },
        { from: "c47",   text: "넵!", time: "2013-03-11 13:42" }
      ]
    },
    {
      id: "sion",
      with: "sion",
      unread: 0,
      // 독자가 입력칸을 누르면 저절로 쳐지는 글 (전송은 독자가 누름)
      draft: "보고 싶다잉",
      // 독자가 이 메시지를 대화방에서 보면 시오니~에게 거는 전화가 연결됨 (phone-data.js의 callScript)
      unlockOnSeen: { text: "그래서 우리 우시 보러 가는 중", key: "sionCall" },
      // 위 글을 독자가 보내면 15초 뒤 시오니~가 보냄 (다른 화면에 있으면 배너 알림)
      // "보고 싶다잉"을 보내면 15초 뒤 시오니~가 답장
      afterDraft: {
        delay: 15, gap: 7, messages: ["나도 보고 싶어잉", "그래서 우리 우시 보러 가는 중"],
        // 그다음: 독자가 입력칸을 누르면 "에 나니 뭐야???"가 쳐지고, 보내면 바로 읽음 → 시오니~ 답장
        next: { draft: "에 나니 뭐야???", readNow: true, delay: 6, gap: 4, messages: ["ㅎㅎㅎ", "오늘 3시에 끝나는 거 맞지?", "이따 데리러 갈게~~ 파이팅"] }
      },
      messages: [
        { from: "yushi", text: "내 메모장", time: "2013-01-14 23:23" },
        { from: "yushi", text: "메롱", time: "2013-01-16 10:43" },
        { from: "yushi", text: "내일 10시까지 무용원 105호 대형실습실", time: "2013-01-17 17:06" },
        { from: "yushi", text: "기상!", time: "2013-01-19 11:48" },
        { from: "yushi", text: "부대찌개 먹을 거야", time: "2013-01-19 11:48" },
        { from: "yushi", text: "내 빡빡이 미남 보고 싶은 오후 1시 5분", time: "2013-01-21 13:05" },
        { from: "yushi", photo: "assets/talk/sion-20130123.jpg", time: "2013-01-23 16:23" },
        { from: "sion",  text: "귀여워ㅋㅋㅋㅋㅋㅋㅋ", time: "2013-01-25 10:22" },
        { from: "yushi", text: "앞에 있는데 왜", time: "2013-01-25 10:22" },
        { from: "yushi", text: "카톡해", time: "2013-01-25 10:22" },
        { from: "sion",  text: "멧챠 카와이니깐", time: "2013-01-25 10:22" },
        { from: "sion",  text: "말로도 해줄게 바보야", time: "2013-01-25 10:22" },
        { from: "yushi", text: "바보", time: "2013-01-29 18:28" },
        { from: "yushi", text: "오늘 장 볼 거\n1. 라면(신라면? 너구리?)\n2. 김자반\n3. 과일..(뭐 사지)\n4. 다마네기\n5. 과자\n에... 모르겠다", time: "2013-02-01 09:22" },
        { from: "yushi", text: "학교 정문 앞에 맛있는 우육탕면집 생김!", time: "2013-02-03 15:22" },
        { from: "yushi", text: "형한테 가는 중", time: "2013-02-10 07:24" },
        { from: "sion",  text: "배 볼록 만두", time: "2013-02-10 13:28" },
        { from: "yushi", text: "만두자나이.....", time: "2013-02-10 13:29" },
        { from: "yushi", text: "앞에 있는 나한테 집중해", time: "2013-02-10 13:29" },
        { from: "sion",  text: "네 알겠습니다.", time: "2013-02-10 13:29" },
        { from: "yushi", text: "무용레파토리\n중급실기3\n무용음악실습\n서양무용역사\n예술과사회\n기초안무실습\n제발 이렇게만..", time: "2013-02-13 14:25", unread: 1 },
        { from: "yushi", text: "　 =☆=　.+ .\"+\n∧(* \")♂\" ,+　\"\n.ノ ノ.\"   ┏▶◀┓\n내♡담긴┣╋╋┫\n*초콜릿*┗┻┻┛", time: "2013-02-14 00:00", unread: 1 },
        { from: "yushi", text: "바쁘다 바빠..", time: "2013-02-16 15:23", unread: 1 },
        { from: "yushi", text: "자고 싶어", time: "2013-02-16 15:23", unread: 1 },
        { from: "yushi", text: "오늘 형이랑 통화 못하니깐..\n여기다가 자랑할 거야\n수강신청 완전완전 성공했지요", time: "2013-02-26 19:23", unread: 1 },
        { from: "yushi", text: "개강이...다가온다....\n형보다 힘 세지는 시기가 온다..", time: "2013-03-03 14:29", unread: 1 },
        { from: "yushi", text: "음 이건 너무 말이 안되네", time: "2013-03-03 14:29", unread: 1 },
        { from: "yushi", text: "형 군대 가더니 더 울퉁불퉁 멋쟁이 토마토 됐어", time: "2013-03-03 14:29", unread: 1 },
        { from: "yushi", text: "이건 아니야.....................................", time: "2013-03-15 22:22", unread: 1 },
        { from: "yushi", text: "나를 사랑으로 채워줘요..", time: "2013-03-16 16:20", unread: 1 },
        { from: "yushi", text: "사랑에 배터리가 다 됐나봐요..", time: "2013-03-16 16:20", unread: 1 },
        { from: "yushi", text: "눈이 땡땡 부었다", time: "2013-03-22 09:53", unread: 1 },
        { from: "yushi", text: "오시온 진짜 바보", time: "2013-03-24 01:34", unread: 1 },
        { from: "yushi", text: "오늘 오시온 전역날", time: "2013-04-01 00:00", unread: 1 },
        { from: "yushi", text: "응 아니라구요?", time: "2013-04-01 00:00", unread: 1 },
        { from: "yushi", text: "에 만우절이라고요?", time: "2013-04-01 00:00", unread: 1 },
        { from: "yushi", text: "생일날 같이 못 보내는 거 너무 아쉽네...", time: "2013-04-03 22:22", unread: 1 }
      ]
    },
    {
      id: "c36",
      with: "c36",
      unread: 0,
      messages: [
        { from: "c36",   text: "우시야 18일에 무용원 105호 대형실습실으로 10시까지 오면 돼!", time: "2013-01-15 10:22" },
        { from: "yushi", text: "응 확인했어 그 날 보자", time: "2013-01-15 10:22" },
        { from: "c36",   text: "우시야 고생했어~~ 도와줘서 고마워ㅜㅜ", time: "2013-01-18 21:46" },
        { from: "c36",   text: "너 없었으면 큰일날 뻔", time: "2013-01-18 21:46" },
        { from: "yushi", text: "아냐ㅎㅎ 덕분에 나도 좋은 경험했어", time: "2013-01-18 21:48" }
      ]
    },
    {
      id: "c13",
      with: "c13",
      unread: 0,
      messages: [
        { from: "c13",   text: "내일 피씨방ㄱ?", time: "2013-01-17 21:21" },
        { from: "yushi", text: "내일 작품 도와줘야 하는 거 있어", time: "2013-01-17 21:22" },
        { from: "c13",   text: "아 ㅇㅋ", time: "2013-01-17 21:22" },
        { from: "c13",   text: "근데 뭔 작품?", time: "2013-01-17 21:22" },
        { from: "yushi", text: "한국무용", time: "2013-01-17 21:23" },
        { from: "c13",   text: "아하 파이팅", time: "2013-01-17 21:23" },
        { from: "c13",   text: "피파 꼬", time: "2013-02-02 16:23" },
        { from: "yushi", text: "ok", time: "2013-02-02 16:30" },
        { from: "yushi", text: "남자친구 선물을 뭘 줘야할까", time: "2013-03-20 20:21" },
        { from: "c13",   text: "갑자기?그걸 나한테?", time: "2013-03-20 20:21" },
        { from: "yushi", text: "형 전역 얼마 안남았는데..", time: "2013-03-20 20:22" },
        { from: "c13",   text: "아 맞다 4월에 전역하시지", time: "2013-03-20 20:22" },
        { from: "c13",   text: "형은 너가 아무 거나 줘도 좋아하실듯", time: "2013-03-20 20:22" },
        { from: "yushi", text: "그래서 문제야", time: "2013-03-20 20:23" },
        { from: "c13",   text: ";;", time: "2013-03-20 20:24" },
        { from: "c13",   text: "그냥 무난하게 신발..", time: "2013-03-20 20:24" },
        { from: "yushi", text: "안돼 도망가면 어떡해", time: "2013-03-20 20:24" },
        { from: "c13",   text: "진짜 지랄 맞다..", time: "2013-03-20 20:28" }
      ]
    }
  ]
};
