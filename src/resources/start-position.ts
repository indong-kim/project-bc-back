//start position 유효한데 몇군데 만들고
//들어오는대로 start position , id매칭해서
/**
 * 1. 접속하면 현재 클라이언트 위치 정보 + 유효한 위치 넘겨주면됨
 * 2. 클라는 받아서 해당 애들 addcharater다 해주고 그려주면됨
 * 3. 클라는 움직일때마다 해당 정보를 서버에 보내주고 서버는 그거 취합해서 업데이트 된거 다시 내려주고 클라는 다시 그려주고
 */

export const START_POSITION = {
  0: { x: 3, y: 3 },
  1: { x: 8, y: 8 },
};