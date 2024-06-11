import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e8e8e8",
        paddingVertical: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
    },
    cricle_back: {
        backgroundColor: "#fed034",
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    user_number: {
        backgroundColor: "#ffbe2e",
        flexDirection: "row",
        padding: 5,
        borderRadius: 20,
        width: 100,
        alignItems: "center",
    },
    icon_user_number: {
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        marginRight: 5,
    },
    input_number: {
        width: 50,
        height: 50,
        backgroundColor: "#ffbe2e",
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        borderRadius: 5,
    },
    number_button: {
        width: 30,
        height: 30,
        backgroundColor: "#ff7e39",
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        borderRadius: 5,
    },
    functionButton: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    hintContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#fffbe6",
        borderRadius: 10,
        alignItems: "center",
    },
    hintText: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
    },
    notificationContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#ffeb3b',
        borderRadius: 5,
    },
    notificationText: {
        color: '#000',
        textAlign: 'center',
    },
    logoutContainer: {
        alignItems: 'center', // Căn giữa icon theo chiều ngang
        marginBottom: 10, // Thêm khoảng cách dưới nếu cần
        color: '#fff', // Màu chữ
        // position: 'absolute',
        // bottom: 0,
    },
    
    guest: {
        height: height * 1, // Chiều cao bằng 60% chiều cao của màn hình
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
    },
    
    
    
});
