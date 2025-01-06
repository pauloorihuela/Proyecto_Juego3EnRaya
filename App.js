import React from 'react';
import { StyleSheet, View } from 'react-native';
import { initializeApp } from 'expo-ads-admob';
import TicTacToe from './TicTacToe';

// Inicializar AdMob
initializeApp();

const App = () => {
  return (
    <View style={styles.container}>
      <TicTacToe />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
});

export default App;
