import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { AdMobBanner, AdMobInterstitial } from 'expo-ads-admob';

const Square = ({ value, onPress }) => (
  <TouchableOpacity style={styles.square} onPress={onPress}>
    <Text style={styles.squareText}>{value}</Text>
  </TouchableOpacity>
);

const Board = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Función para mostrar anuncio intersticial
  const showInterstitialAd = async () => {
    try {
      await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712'); // ID de prueba
      await AdMobInterstitial.requestAdAsync();
      await AdMobInterstitial.showAdAsync();
    } catch (error) {
      console.log('Error al cargar el interstitial:', error);
    }
  };

  // Función para reiniciar el juego
  const restartGame = async () => {
    await showInterstitialAd(); // Mostrar anuncio antes de reiniciar
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // Lógica para determinar el ganador
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
  const status = winner
    ? `Ganador: ${winner}`
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
    }
  };

  return (
    <View>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.board}>
        {squares.map((square, i) => (
          <Square key={i} value={square} onPress={() => handlePress(i)} />
        ))}
      </View>
      <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
        <Text style={styles.restartText}>Reiniciar</Text>
      </TouchableOpacity>

      {/* Banner Ad */}
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
  board: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    height: 300,
    margin: 20,
  },
  square: {
    width: 100,
    height: 100,
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
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    alignSelf: 'center',
    borderRadius: 5,
  },
  restartText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Board;
