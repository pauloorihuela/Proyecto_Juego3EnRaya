import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { InterstitialAd, AdEventType, TestIds, BannerAd, BannerAdSize } from '@react-native-google-mobile-ads/interstitial';
import { AppOpenAd } from '@react-native-google-mobile-ads/app';  // Para usar anuncios de apertura si lo deseas

const Square = ({ value, onPress }) => (
  <TouchableOpacity style={styles.square} onPress={onPress}>
    <Text style={styles.squareText}>{value}</Text>
  </TouchableOpacity>
);

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);

  const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL); // Usando ID de prueba

  useEffect(() => {
    // Cargar el anuncio intersticial
    const loadInterstitialAd = () => {
      interstitial.load();
      interstitial.onAdEvent((type, error) => {
        if (type === AdEventType.LOADED) {
          setIsInterstitialLoaded(true);
        }
        if (type === AdEventType.ERROR) {
          console.error('Ad Error', error);
        }
      });
    };

    loadInterstitialAd();

    return () => {
      interstitial.removeAllListeners();
    };
  }, []);

  const showInterstitialAd = () => {
    if (isInterstitialLoaded) {
      interstitial.show();
      setIsInterstitialLoaded(false); // After showing ad, reload it
      interstitial.load();
    }
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Ganador: ${winner}`;
    Alert.alert('¡Tenemos un ganador!', `${winner} ha ganado la partida!`, [
      {
        text: 'Reiniciar',
        onPress: () => {
          setSquares(Array(9).fill(null));
          showInterstitialAd();
        },
      },
    ]);
  } else if (squares.every((square) => square !== null)) {
    status = 'Empate';
    Alert.alert('¡Empate!', 'La partida ha terminado en empate.', [
      {
        text: 'Reiniciar',
        onPress: () => {
          setSquares(Array(9).fill(null));
          showInterstitialAd();
        },
      },
    ]);
  } else {
    status = `Siguiente jugador: ${xIsNext ? 'X' : 'O'}`;
  }

  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    showInterstitialAd();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.board}>
        {squares.map((square, i) => (
          <Square key={i} value={square} onPress={() => handleClick(i)} />
        ))}
      </View>
      <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
        <Text style={styles.restartButtonText}>Reiniciar Partida</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  status: {
    fontSize: 24,
    marginBottom: 20,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 20,
  },
  square: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  squareText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TicTacToe;
