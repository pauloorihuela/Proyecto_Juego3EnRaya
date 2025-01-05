import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AdMobBanner, AdMobInterstitial } from 'expo-ads-admob'; // Importa AdMob
import Board from './TicTacToe';  // Suponiendo que Board es el componente donde manejas el juego

export default function App() {
  // Inicialización de anuncios intersticiales en App.js (si es necesario)
  React.useEffect(() => {
    // Configura el ID del anuncio intersticial
    const loadInterstitialAd = async () => {
      await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/9214589741'); // ID de prueba
      await AdMobInterstitial.requestAdAsync();
    };

    loadInterstitialAd();

    return () => {
      // Limpiar los listeners si es necesario
      AdMobInterstitial.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Board />
      
      {/* Banner Ad */}
      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-3940256099942544/9214589741"  // ID de prueba para banner
        servePersonalizedAds={false}
        onDidFailToReceiveAdWithError={(error) => console.log("Error del banner:", error)}
      />
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
