import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import ImageRules from "./image/Elite.png"

const GameAds = ({ modalVisibleAds, toggleModalAds }) => {
    return (
        <Modal
            visible={modalVisibleAds}
            animationType="slide"
            transparent={true}
            onRequestClose={modalVisibleAds}
        >
            <View style={styles.modalContainer}>
                <Image source={ImageRules} style={{ width: "80%", height: "60%", borderRadius: 10 }} resizeMode="contain" />
                <TouchableOpacity style={styles.closeButton} onPress={toggleModalAds}>
                    <Text style={styles.closeButtonText}>Đã hiểu  !!!</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        position: 'absolute',
        top: 550,
        width: "30%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: '#111',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GameAds;
