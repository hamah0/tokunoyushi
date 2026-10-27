/*
 * 기본 앱 데이터 (캘린더 · 메모 · 미리 알림 · 시계 · 사진 · 음악 · Mail · 인터넷 · 날씨)
 * -----------------------------------------
 * "(예시)"가 붙은 항목은 화면 확인용이므로 지우거나 바꿔 주세요.
 * 시각은 모두 "YYYY-MM-DD HH:MM" 형식입니다.
 * 이미지·오디오 경로는 실제로 존재하는 파일만 적어 주세요.
 */
window.YUSHI = window.YUSHI || {};
YUSHI.data = YUSHI.data || {};

YUSHI.data.apps = {
  // 캘린더: date = "YYYY-MM-DD", time = "HH:MM" (없으면 하루 종일)
  calendar: [
    { date: "2013-01-25", title: "형 외출" },
    { date: "2013-02-10", title: "형 외출" },
    { date: "2013-03-17", title: "형 면회" },
    { date: "2013-04-07", title: "형 휴가" },
    { date: "2013-04-17", title: "형 전역 !!" }
  ],

  // 메모: 첫 줄이 목록 제목이 됩니다
  notes: [
    { time: "2013-03-20 22:20", text: "전역 선물\n1. 지갑\n2. 향수\n3. 음.............\n진짜 뭐하지 휴대폰?\n그냥 현금을 주는 게........." },
    { time: "2013-01-18 23:35", text: "힘내자\nhttps://youtu.be/KH5cDSVt0lA?si=iILgiPBnwRNZM-Hg (120408 인기가요)\nhttps://youtu.be/hDYqFM1lMuM?si=dE7To09AJZ6itCY1 (120530 Cultwoshow)\nhttps://youtu.be/bKWnBnf5p74?si=c4z5-ehcY7h0jnSa (121130 MAMA)" },
    { time: "2013-03-28 22:14", text: "[공연실습] 정기공연 1차 리허설\n4월부터 매주 월,수,금 저녁 6시 30분" }
  ],

  // 미리 알림
  reminders: [],

  // 시계 > 알람: time = "HH:MM" (24시간), on = 켜짐 여부
  alarms: [
    { time: "07:10", label: "알람", on: false },
    { time: "07:20", label: "알람", on: true },
    { time: "07:30", label: "알람", on: false },
    { time: "08:40", label: "알람", on: false }
  ],

  // 사진 > 카메라 롤: src = 실제 이미지 경로, time = 찍은 날짜(선택)
  //   동영상은 { video: "mp4 경로", poster: "첫 화면 jpg", duration: 초 }
  // (카메라 앱으로 찍은 사진도 페이지를 연 동안 여기에 함께 보입니다)
  photos: [
    { src: "assets/photos/photo01.jpg" },
    { src: "assets/photos/photo02.jpg" },
    { src: "assets/photos/photo03.jpg" },
    { src: "assets/photos/photo04.jpg" },
    { src: "assets/photos/photo05.jpg" },
    { src: "assets/photos/photo06.jpg" },
    { src: "assets/photos/photo07.jpg" },
    { src: "assets/photos/photo08.jpg" },
    { src: "assets/photos/photo09.jpg" },
    { video: "assets/videos/video01.mp4", poster: "assets/videos/video01.jpg", duration: 6.8 },
    { src: "assets/photos/photo10.jpg" },
    { src: "assets/photos/photo11.jpg" },
    { src: "assets/photos/photo12.jpg" },
    { src: "assets/photos/photo13.jpg" },
    { video: "assets/videos/video02.mp4", poster: "assets/videos/video02.jpg", duration: 2.2 },
    { src: "assets/photos/photo14.jpg" },
    { src: "assets/photos/photo15.jpg" },
    { src: "assets/photos/photo16.jpg" },
    { src: "assets/photos/photo17.jpg" },
    { src: "assets/photos/photo18.jpg" },
    { src: "assets/photos/photo19.jpg" },
    { src: "assets/photos/photo20.jpg" },
    { src: "assets/photos/photo22.jpg" },
    { src: "assets/photos/photo24.jpg", time: "2012-05-11 21:10" },
    { src: "assets/photos/photo23.jpg", time: "2013-02-03 13:40" },
    { src: "assets/photos/photo25.jpg" }
  ],

  // 음악: title, artist, duration(초), audio = 실제 오디오 파일 경로(없으면 null)
  //   art: 앨범 커버 이미지 경로
  //   artistGroup: 아티스트 탭에서 같은 가수로 묶을 이름 (표기가 조금씩 다를 때)
  music: [
    { title: "Officially Missing You", artist: "긱스(Geeks)", duration: 212, audio: null, art: "assets/albums/song01.jpg" },
    { title: "어땠을까(Feat. 박정현)", artist: "싸이(PSY)", duration: 245, audio: null, art: "assets/albums/song02.jpg" },
    { title: "? (물음표) (Feat. 최자 Of 다이나믹듀오, Zion.T)", artist: "프라이머리", duration: 199, audio: null, art: "assets/albums/song03.jpg" },
    { title: "What Is Love", artist: "EXO-K", duration: 272, audio: null, art: "assets/albums/song04.jpg" },
    { title: "방백 (Aside)", artist: "샤이니", duration: 225, audio: null, art: "assets/albums/song05.jpg" },
    { title: "MAMA", artist: "EXO-K", duration: 271, audio: null, art: "assets/albums/song06.jpg" },
    { title: "너의 세상으로", artist: "EXO - K", duration: 180, audio: null, artistGroup: "EXO-K", art: "assets/albums/song07.jpg" },
    { title: "Call Me Maybe", artist: "Carly Rae Jepsen", duration: 200, audio: null, art: "assets/albums/song08.jpg" },
    { title: "September", artist: "Earth, Wind & Fire·Feel Good Friday", duration: 215, audio: null, art: "assets/albums/song09.jpg" },
    { title: "Automatic", artist: "Hikaru Utada", duration: 327, audio: null, art: "assets/albums/song10.jpg" },
    { title: "花", artist: "Orange range", duration: 257, audio: null, art: "assets/albums/song11.jpg" },
    { title: "Miss You", artist: "m-flo", duration: 355, audio: null, art: "assets/albums/song12.jpg" },
    { title: "Sky High", artist: "FreeTEMPO", duration: 271, audio: null, art: "assets/albums/song13.jpg" },
    { title: "The Great Escape", artist: "Boys Like Girls", duration: 208, audio: null, art: "assets/albums/song14.jpg" },
    { title: "Good-Bye Days", artist: "YUI", duration: 274, audio: null, art: "assets/albums/song15.jpg" },
    { title: "No.1", artist: "보아(BoA)", duration: 193, audio: null, art: "assets/albums/song16.jpg" },
    { title: "Every Heart", artist: "보아(BoA)", duration: 273, audio: null, art: "assets/albums/song17.jpg" },
    { title: "Flower Dance", artist: "DJ Okawari", duration: 264, audio: null, art: "assets/albums/song18.jpg" },
    { title: "Love In The Ice", artist: "동방신기(TVXQ!)", duration: 284, audio: null, art: "assets/albums/song19.jpg" },
    { title: "기적 destiny", artist: "BoA", duration: 259, audio: null, artistGroup: "보아(BoA)", art: "assets/albums/song20.jpg" },
    { title: "Milky Way", artist: "보아 (BoA)", duration: 199, audio: null, artistGroup: "보아(BoA)", art: "assets/albums/song21.jpg" },
    { title: "Show Me Your Love", artist: "동방신기 (TVXQ!), SUPER JUNIOR (슈퍼주니어)", duration: 245, audio: null, art: "assets/albums/song22.jpg" },
    { title: "Love Love Love (Feat. 융진 Of Casker)", artist: "에픽하이(EPIK HIGH)", duration: 231, audio: null, art: "assets/albums/song23.jpg" },
    { title: "One (Feat. 지선)", artist: "에픽하이(EPIK HIGH)", duration: 230, audio: null, art: "assets/albums/song24.jpg" },
    { title: "처음 사랑하는 연인들을 위해 (부제: 반말송)", artist: "정용화", duration: 212, audio: null, art: "assets/albums/song25.jpg" },
    { title: "소원을 말해봐 (Genie)", artist: "소녀시대", duration: 231, audio: null, art: "assets/albums/song26.jpg" },
    { title: "LOVE", artist: "CNBLUE", duration: 228, audio: null, art: "assets/albums/song27.jpg" }
  ],

  // 음악 > 재생목록: songs = 위 music 목록의 번호 (0부터)
  playlists: [
    { name: "제목 없는 재생목록", songs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26] }
  ],

  // Mail > 받은 편지함
  mail: [
    { from: "시온이형", fromAddr: "oceanveiw5@naver.com", subject: "2013년 3월 23일", time: "2013-03-23 08:10",
      body: "우리 애기 너무 바빠서 어떡해\n요즘 목소리에 힘이 너무 없어보여서 조금 걱정되네 이럴 거면 저번에 더 꽉 안아주고 보낼 걸 형 조금 후회중 정신 하나도 없을 와중에도 보러 와줘서 고마워 거진 2년 다 되어가도록 바빠도 나 보러 오고 사람들이랑 있다가도 다른 일 하다가도 전화 받고 그거 진짜 쉬운 일 아니라는 거 알아서 미안하고 고마운 마음 뿐인데 표현을 잘 못한 거 같아서.. 한국인 남자친구 만나느라 고생 많네 우리 우시ㅋㅋㅋㅋ 너무너무 사랑해 아이시떼루" },
    { from: "시온이형", fromAddr: "oceanveiw5@naver.com", subject: "2013년 1월 29일", time: "2013-01-29 19:14",
      body: "아이시떼루 유우시\n나도 너무너무 사랑해" },
    { from: "시온이형", fromAddr: "oceanveiw5@naver.com", subject: "2013년 2월 6일", time: "2013-02-06 19:03",
      body: "뭐가 미안해 못 받을 수도 있는 거지\n울지말고 미안해 하지도 말고\n사랑해" },
    { from: "시온이형", fromAddr: "oceanveiw5@naver.com", subject: "2013년 2월 12일", time: "2013-02-12 18:54",
      body: "애기 음성 메모 들어가봐" },
    { from: "시온이형", fromAddr: "oceanveiw5@naver.com", subject: "2013년 2월 12일", time: "2013-02-12 19:10",
      body: "서프라이즈니까~~ㅎㅎㅎ\n울지마 형이 못 달래주잖아\n전화하자 전화 걸게 형이" },
    { from: "시온이형", fromAddr: "oceanveiw5@naver.com", subject: "2013년 3월 2일", time: "2013-03-02 10:20",
      body: "너한테 쓰는 건 괜찮아ㅋㅋㅋ\n대신 바로바로 안 이어지는게 아쉬운 거지..\n맞다 형 오늘 라면 먹을 거야\n유우시도 맛있는 거 먹어\n이따가 전화하자~!!!!" }
  ],

  // Mail > 보낸 편지함: to = 받는 사람 이름, toAddr = 주소, subject가 ""이면 '(제목 없음)'
  mailSent: [
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 1월 14일", time: "2013-01-14 15:20",
      body: "형 나 휴대폰 새로 샀다! 형이 엄청 가지고 싶어하던 폰으로ㅎㅎ\n빡빡이 탈출하면 검은색으로 샀다고 했으니까 나는 흰색으로 샀어\n커플폰 합시다 우리~~~" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 1월 18일", time: "2013-01-18 23:22",
      body: "오늘 훈련 잘 받았는지요\n나는 오늘 친구 도와서 코레오 좀 했는데..\n약간 무리했더니 발목 시큰시큰\n형이 파스 붙여주면 금방 나을 거 같은데\n왜 옆에 없는 거야\n보고 싶어 너무너무" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 1월 25일", time: "2013-01-25 07:52",
      body: "빡빡이 미남 보는 날\n파주 새로운 맛집 뚫고 싶어서 어제 찾아봤는데\n별 거 없드라고 그래서 어쩌지 싶었는데\n형이 다 알아놨다고 해서 기분 좋아졌어\n역시 내 이케멘 최고ㅎㅎ" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 1월 26일", time: "2013-01-26 10:21",
      body: "어제 봐서 그런가 더 보고 싶다\n봐도봐도 보고 싶다!!!\n오늘 하루도 다치지말고 행복하게 보내기" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 1월 28일", time: "2013-01-28 01:45",
      body: "사랑해" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 2월 3일", time: "2013-02-03 15:32",
      body: "큰일났습니다\n시간표 망할 거 같습니다\n야바이야~ㅜㅜㅜ" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 2월 3일", time: "2013-02-03 21:13",
      body: "학교 앞에 새로운 맛집이 생겼어\n오늘 선배들 도와드릴 거 있어서 학교 잠깐 갔다가\n먹었는데 엄청 맛있더라..\n그래서 형 생각이 났어..\n같이 먹자" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 2월 5일", time: "2013-02-05 22:45",
      body: "에 나 형 전화 못 받은 거 처음인 거 같다..ㅋㅋ\n짜증나서 울 뻔했어\n목소리 듣고 싶었는데\n전화 못 받아서 미안해................." },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 2월 9일", time: "2013-02-09 08:44",
      body: "내일 형 보러 가지요!!!!!\n충전할 수 있겠다~~ 얏따!!\n보자마자 안아버릴 거야" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 2월 11일", time: "2013-02-11 19:33",
      body: "병장이면 30분은 전화할 수 있게 해줬으면 좋겠네...\n형 목소리 들으면서 자고 싶다\n내 자장가 얼른 돌아와" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 2월 12일", time: "2013-02-12 19:02",
      body: "음성 메모 해놨던 거 왜 말 안 했어............\n눈물날 거 같아" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 3월 1일", time: "2013-03-01 15:32",
      body: "메일 뭔가 오랜만인 기분이네\n그치만 사지방?이 너무 비싸잖아 ㅡ.,ㅡ\n그 돈으로 형 px에서 맛있는 거 먹고\n형 목소리 듣는게 더 나은 거 같아\n근데 이걸 전역 거의 다 되어서 알아버렸네ㅋㅋ...." },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 3월 21일", time: "2013-03-21 02:32",
      body: "오늘 두번째로 형 전화 못 받은 날이다..\n근데 꼭 이런 날 형이 더 보고 싶어\n자꾸 이렇게 땡깡 부리기 싫은데 미안\n오늘 그래도 나 부대찌개 먹었고\n안 다치게 연습 잘 마쳤고\n교수님한테 칭찬도 받았어ㅎㅎㅎ\n형은 오늘 좋은 하루 보냈을려나\n엊그제 감기 기운 있었다고 했었잖아 아프지말고\n내가 챙겨주고 싶어도 못 챙겨주니까는..\n이따 자고 일어나서도 하루 잘 보내보자 우리" },
    { to: "시온이형", toAddr: "oceanveiw5@naver.com", subject: "2013년 4월 1일", time: "2013-04-01 09:33",
      body: "4월은 무슨 달~~~?\n오시온 전역!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n나 지금 기분 이만큼 좋아 ^ㅁ^" }
  ],

  // 인터넷: 주소창에 url을 치거나 북마크를 누르면 열리는 가상 페이지
  // html에는 간단한 태그(<h1>, <p>, <a href="다른 페이지 url">)를 쓸 수 있습니다.
  // 예) { url: "example.com", title: "페이지 제목", html: "<h1>제목</h1><p>내용</p>" }
  web: [],

  // 인터넷 > 북마크 (위에서부터 순서대로). 눌러도 눌린 표시만 되고 다른 화면으로 넘어가지 않습니다
  bookmarks: [
    { title: "곰신카페", url: "https://cafe.naver.com/komusincafe" },
    { title: "한국예술대학교 학사행정시스템", url: "https://korearts.ac.kr/nuri/login.do" }
  ],

  // 인터넷 > 검색칸을 누르면 보이는 '최근 검색' — 날짜별로 묶여 보입니다 (이야기를 위한 가상 기록)
  // EXO·카이 / 현대무용 / 곰신카페 / 군인 남자친구 / 전역 선물
  webSearches: [
    // 1월
    { time: "2013-01-12 14:18", q: "EXO" },
    { time: "2013-01-12 14:25", q: "EXO 카이" },
    { time: "2013-01-17 23:40", q: "피나 바우쉬 카페 뮐러" },
    { time: "2013-01-24 22:10", q: "파주 맛집" },
    { time: "2013-01-27 23:52", q: "곰신카페" },
    // 2월
    { time: "2013-02-03 21:30", q: "국립현대무용단 공연" },
    { time: "2013-02-19 00:20", q: "군인 선물 추천" },
    // 3월
    { time: "2013-03-04 23:05", q: "현대무용 콩쿠르" },
    { time: "2013-03-13 22:48", q: "동아무용콩쿠르 현대무용 일반부" },
    { time: "2013-03-20 00:12", q: "군인 남자친구 전역" },
    { time: "2013-03-27 23:31", q: "남자친구 전역 선물" },
    { time: "2013-03-30 22:57", q: "남자친구 선물 시계" },
    // 4월 초 (전역을 앞둔 지금)
    { time: "2013-04-02 22:30", q: "동아무용콩쿠르 참가 신청" }
  ],

  // 인터넷 > 북마크 > 방문 기록 — 실제로 열어 본 페이지 (검색 결과 페이지 포함, 이야기를 위한 가상 기록)
  // 매일이 아니라 필요할 때 들어간 것처럼 간격을 두었습니다.
  webHistory: [
    // 1월
    { time: "2013-01-12 14:19", title: "EXO - Google 검색", url: "www.google.co.kr/search?q=EXO" },
    { time: "2013-01-12 14:26", title: "EXO 카이 - Google 검색", url: "www.google.co.kr/search?q=EXO 카이" },
    { time: "2013-01-17 23:41", title: "피나 바우쉬 카페 뮐러 - Google 검색", url: "www.google.co.kr/search?q=피나 바우쉬 카페 뮐러" },
    { time: "2013-01-24 22:11", title: "파주 맛집 - Google 검색", url: "www.google.co.kr/search?q=파주 맛집" },
    { time: "2013-01-27 23:53", title: "곰신카페 - Google 검색", url: "www.google.co.kr/search?q=곰신카페" },
    { time: "2013-01-27 23:54", title: "곰신카페 : 네이버 카페", url: "https://cafe.naver.com/komusincafe" },
    // 2월
    { time: "2013-02-03 21:31", title: "국립현대무용단 공연 - Google 검색", url: "www.google.co.kr/search?q=국립현대무용단 공연" },
    { time: "2013-02-11 00:40", title: "곰신카페 : 네이버 카페", url: "https://cafe.naver.com/komusincafe" },
    { time: "2013-02-19 00:21", title: "군인 선물 추천 - Google 검색", url: "www.google.co.kr/search?q=군인 선물 추천" },
    { time: "2013-02-27 00:56", title: "곰신카페 : 네이버 카페", url: "https://cafe.naver.com/komusincafe" },
    // 3월
    { time: "2013-03-04 10:12", title: "한국예술대학교 학사행정시스템", url: "https://korearts.ac.kr/nuri/login.do" },
    { time: "2013-03-04 23:06", title: "현대무용 콩쿠르 - Google 검색", url: "www.google.co.kr/search?q=현대무용 콩쿠르" },
    { time: "2013-03-13 22:49", title: "동아무용콩쿠르 현대무용 일반부 - Google 검색", url: "www.google.co.kr/search?q=동아무용콩쿠르 현대무용 일반부" },
    { time: "2013-03-18 00:31", title: "곰신카페 : 네이버 카페", url: "https://cafe.naver.com/komusincafe" },
    { time: "2013-03-20 00:13", title: "군인 남자친구 전역 - Google 검색", url: "www.google.co.kr/search?q=군인 남자친구 전역" },
    { time: "2013-03-27 23:32", title: "남자친구 전역 선물 - Google 검색", url: "www.google.co.kr/search?q=남자친구 전역 선물" },
    { time: "2013-03-30 22:58", title: "남자친구 선물 시계 - Google 검색", url: "www.google.co.kr/search?q=남자친구 선물 시계" },
    // 4월 초 (전역을 앞둔 지금)
    { time: "2013-04-02 22:31", title: "동아무용콩쿠르 참가 신청 - Google 검색", url: "www.google.co.kr/search?q=동아무용콩쿠르 참가 신청" },
    { time: "2013-04-02 23:16", title: "곰신카페 : 네이버 카페", url: "https://cafe.naver.com/komusincafe" },
    { time: "2013-04-04 00:42", title: "곰신카페 : 네이버 카페", url: "https://cafe.naver.com/komusincafe" }
  ],

  // 날씨 (예시 값)
  weather: {
    city: "서울",
    now: { temp: 12, cond: "cloudy", hi: 15, lo: 6 },
    days: [
      { day: "금", cond: "sunny",  hi: 17, lo: 7 },
      { day: "토", cond: "rain",   hi: 13, lo: 8 },
      { day: "일", cond: "cloudy", hi: 14, lo: 6 },
      { day: "월", cond: "sunny",  hi: 16, lo: 5 },
      { day: "화", cond: "sunny",  hi: 18, lo: 7 },
      { day: "수", cond: "cloudy", hi: 15, lo: 8 }
    ]
  }
};
