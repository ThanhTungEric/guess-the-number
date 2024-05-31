export const host = "http://192.168.1.6:8000";

//user
export const createUserRoute = `${host}/user/create`;

//room
export const createRoomRoute = `${host}/room/create`;
export const joinRoomRoute = `${host}/room/join`;
export const getRoomRoute = `${host}/room/get`;
export const getRoomListRoute = `${host}/room/getList`;
export const deleteRoomRoute = `${host}/room/delete`;
export const startGameRoute = `${host}/room/startGame`;
export const guessNumberRoute = `${host}/room/guessNumber`;
export const leaveRoomRoute = `${host}/room/leave`;
