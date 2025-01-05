import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AdMobInterstitial } from 'expo-ads-admob'; // Importa solo AdMobInterstitial
import Board from './TicTacToe';  // Suponiendo que Board es el componente donde manejas el juego

export default function App() {
  // Inicialización de anuncios intersticiales en App.js
  useEffect(() => {
    // Configura el ID del anuncio intersticial
    const loadInterstitialAd = async () => {
      await AdMobInterstitial.setAdUnitID('ca-app-pub-8633873973591632/6924969216'); // ID de prueba
      await AdMobInterstitial.requestAdAsync();
    };

    loadInterstitialAd();

    return () => {
      // Limpiar los listeners si es necesario
      AdMobInterstitial.removeAllListeners();
    };
  }, []);

  const showInterstitialAd = async () => {
    try {
      await AdMobInterstitial.showAdAsync(); // Muestra el anuncio intersticial
    } catch (error) {
      console.log('Error mostrando el anuncio intersticial', error);
    }
  };

  return (
    <View style={styles.container}>
      <Board />
      
      {/* Puedes llamar a `showInterstitialAd` en eventos específicos */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
});
