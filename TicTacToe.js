import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { AdMobInterstitial } from 'expo-ads-admob'; // Solo interstitial

const Square = ({ value, onPress }) => (
  <TouchableOpacity style={styles.square} onPress={onPress}>
    <Text style={styles.squareText}>{value}</Text>
  </TouchableOpacity>
);

const Board = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);

  useEffect(() => {
    // Cargar el intersticial al montar el componente
    const loadInterstitialAd = async () => {
      await AdMobInterstitial.setAdUnitID('ca-app-pub-8633873973591632/6924969216'); // ID de prueba
      await AdMobInterstitial.requestAdAsync();
      setIsInterstitialLoaded(true);
    };

    loadInterstitialAd();

    return () => {
      // Limpiar intersticial cuando el componente se desmonta
      AdMobInterstitial.removeAllListeners();
    };
  }, []);

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

  const showInterstitialAd = () => {
    if (isInterstitialLoaded) {
      AdMobInterstitial.showAdAsync()
        .catch((error) => console.log("Error mostrando el anuncio intersticial", error));
    }
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
    Alert.alert(
      "¡Tenemos un ganador!",
      `¡${winner} ha ganado la partida!`,
      [
        { text: "Reiniciar", onPress: () => {
          setSquares(Array(9).fill(null));
          showInterstitialAd();
        }}
      ]
    );
  } else if (squares.every(square => square !== null)) {
    status = "Empate";
    Alert.alert(
      "¡Empate!",
      "La partida ha terminado en empate.",
      [
        { text: "Reiniciar", onPress: () => {
          setSquares(Array(9).fill(null));
          showInterstitialAd();
        }}
      ]
    );
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

export default Board;
