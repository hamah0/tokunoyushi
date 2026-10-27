/*
 * 메시지(문자) 앱 데이터
 * -----------------------------------------
 * "(예시)"가 붙은 항목은 화면 확인용이므로 지우거나 바꿔 주세요.
 *
 * threads : 대화 목록
 *   id       : 영어 이름 (띄어쓰기 없이)
 *   name     : 위쪽 제목과 목록에 보이는 이름 (전화번호여도 됨)
 *   type     : "imessage"(파란 말풍선) 또는 "sms"(초록 말풍선)
 *   unread   : true면 목록 왼쪽에 파란 점
 *   readAt   : (선택) 마지막 보낸 메시지 아래 '읽음 오후 7:47' 표시용 시각
 *   messages : from = "me"(유우시) 또는 "them"(상대)
 *              text = 내용 / 사진은 text 대신 photo: "실제 이미지 경로" (없으면 photoSlot: true)
 *              time = "YYYY-MM-DD HH:MM"
 */
window.YUSHI = window.YUSHI || {};
YUSHI.data = YUSHI.data || {};

YUSHI.data.messages = {
  threads: [
    {
      id: "c14",
      name: "송예린 선배(09학번)",
      type: "sms",
      unread: false,
      messages: [
        { from: "them", text: "우시야 내일모레 잠시 시간 가능해? 다름이 아니고 김태윤 교수님이 연출하시는 무용연극 무대 세팅하는 일이 있는데 도움이 좀 필요해서", time: "2013-01-27 13:22" },
        { from: "me",   text: "네 가능해요", time: "2013-01-27 13:24" },
        { from: "them", text: "아 다행이다 그러면 혜화역 2번출구에서 아침 9시 30분까지 집합이니까 그때까지 오면 돼", time: "2013-01-27 13:24" },
        { from: "me",   text: "네 알겠습니다", time: "2013-01-27 13:25" }
      ]
    },
    {
      id: "mama",
      name: "ママ",
      type: "imessage",
      unread: false,
      readAt: "2013-02-10 20:34",
      messages: [
        { from: "them", text: "シオンくんと楽しく過ごせた？", time: "2013-02-10 20:21" },
        { from: "me",   text: "うん, ちゃんと会ってきたよ。", time: "2013-02-10 20:32" },
        { from: "them", text: "よかった。気を付けて帰ってね。", time: "2013-02-10 20:33" },
        { from: "me",   text: "うん、わかった。", time: "2013-02-10 20:33" }
      ]
    },
    {
      id: "spam2",
      name: "010-284-5513",
      type: "sms",
      unread: false,
      messages: [
        { from: "them", text: "[Web발신]\n(광고)★설 특가★ 한우 선물세트 최대 40% 할인! 문의 010-284-5513\n무료수신거부 080-912-1004", time: "2013-02-04 14:07" }
      ]
    }
  ]
};
