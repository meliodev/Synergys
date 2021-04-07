/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function StepInstruction({
  instructions,
  showPopup,
  setShowPopup,
}) {
  return (
    <View>
      <Ionicons
        onPress={() => setShowPopup(!showPopup)}
        name="ios-information-circle-outline"
        size={20}
        color="#0A0F70"
      />
      {showPopup && (
        <View style={styles.instructionContainer}>
          <TouchableOpacity
            onPress={() => setShowPopup(false)}
            style={styles.instructionSection}>
            <Text style={{ fontSize: 12 }}>{instructions}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  instructionContainer: {
    padding: 10,
    position: 'absolute',
    top: 15,
    width: 200,
    alignSelf: 'center',
  },
  instructionSection: {
    borderRadius: 7,
    borderColor: '#0A0F70',
    borderWidth: 1,
    padding: 3,
    backgroundColor: 'white',
    zIndex: 11,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
});
