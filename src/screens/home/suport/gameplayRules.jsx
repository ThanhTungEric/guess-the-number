import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import ImageRules from "./image/Elite.png"

const GameplayRules = ({ modalVisible, toggleModal }) => {
    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleModal}
        >
            <View style={styles.modalContainer}>
                <Image source={ImageRules} style={{ width: "80%", height: "60%", borderRadius: 10 }} resizeMode="contain" />
                <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                    <Text style={styles.closeButtonText}>Đã hiểu  !!!</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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

export default GameplayRules;
