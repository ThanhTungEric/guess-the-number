export const host = "http://14.225.207.218";

//user
export const createUserRoute = `${host}/user/create`;
export const getUserByNameRoute = `${host}/user/userName`;
export const getUserByIdRoute = `${host}/user`;
export const attendanceRoute = `${host}/user/attendance`;
export const missionsUserRoute = `${host}/user/missions`;

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

//friend
export const addFriendRoute = `${host}/friend/add`;
export const acceptFriendRoute = `${host}/friend/accept`;
export const declineFriendRoute = `${host}/friend/decline`;
export const getFriendRoute = `${host}/friend/get`;
export const deleteFriendRoute = `${host}/friend/delete`;
export const searchUserRoute = `${host}/user/search`;