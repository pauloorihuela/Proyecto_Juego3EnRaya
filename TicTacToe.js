import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { AdMobBanner, AdMobInterstitial } from 'expo-ads-admob';

const { width: screenWidth } = Dimensions.get('window');
const boardSize = screenWidth * 0.8;

const Square = ({ value, onPress }) => (
  <TouchableOpacity style={styles.square} onPress={onPress}>
    <Text style={styles.squareText}>{value}</Text>
  </TouchableOpacity>
);

const Board = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Prepara el anuncio intersticial al cargar el componente
  useEffect(() => {
    const prepareInterstitialAd = async () => {
      try {
        await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // ID de prueba
        await AdMobInterstitial.requestAdAsync();
      } catch (error) {
        console.log('Error preparando el interstitial:', error);
      }
    };

    prepareInterstitialAd();
  }, []);

  const showInterstitialAd = async () => {
    try {
      const isReady = await AdMobInterstitial.getIsReadyAsync();
      if (isReady) {
        await AdMobInterstitial.showAdAsync();
      } else {
        console.log('El anuncio intersticial no está listo');
      }
    } catch (error) {
      console.log('Error al mostrar el interstitial:', error);
    }
  };

  const restartGame = async () => {
    await showInterstitialAd(); // Muestra el anuncio antes de reiniciar
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6],           // Diagonales
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(squares);
  const isDraw = !squares.includes(null) && !winner;
  const status = winner
    ? `Ganador: ${winner}`
    : isDraw
      ? '¡Empate!'
      : `Turno de: ${xIsNext ? 'X' : 'O'}`;

  const handlePress = (i) => {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    if (calculateWinner(nextSquares)) {
      Alert.alert('¡Tenemos un ganador!', `El ganador es ${xIsNext ? 'X' : 'O'}`, [
        { text: 'Reiniciar', onPress: restartGame },
      ]);
    } else if (!nextSquares.includes(null)) {
      Alert.alert('¡Empate!', 'El juego ha terminado en empate.', [
        { text: 'Reiniciar', onPress: restartGame },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.board}>
        {squares.map((square, i) => (
          <Square key={i} value={square} onPress={() => handlePress(i)} />
        ))}
      </View>
      <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
        <Text style={styles.restartText}>Reiniciar</Text>
      </TouchableOpacity>

      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-3940256099942544/6300978111" // ID de prueba
        servePersonalizedAds={true}
        onDidFailToReceiveAdWithError={(error) => console.log('Error con banner:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  board: {
    width: boardSize,
    height: boardSize,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 20,
  },
  square: {
    width: boardSize / 3,
    height: boardSize / 3,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareText: {
    fontSize: 32,
  },
  status: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  restartButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  restartText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Board;
