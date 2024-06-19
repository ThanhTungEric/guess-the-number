export const host = "http://192.168.1.8:8000";

//user
export const createUserRoute = `${host}/user/create`;
export const getUserByNameRoute = `${host}/user/userName`;
export const getUserByIdRoute = `${host}/user/userId`;

//room
export const createRoomRoute = `${host}/room/create`;
export const joinRoomRoute = `${host}/room/join`;
export const getRoomRoute = `${host}/room/get`;
export const getRoomListRoute = `${host}/room/getList`;
export const deleteRoomRoute = `${host}/room/delete`;
export const startGameRoute = `${host}/room/startGame`;
export const guessNumberRoute = `${host}/room/guess`;
export const leaveRoomRoute = `${host}/room/leave`;
export const getAllRoomRoute = `${host}/room/get-all`;
export const deleteAllRoomRoute = `${host}/room/delete-rooms`;