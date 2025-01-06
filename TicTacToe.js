import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native';
import { AdMobInterstitial } from 'expo-ads-admob';

const Square = ({ value, onPress, isWinning }) => (
  <TouchableOpacity
    style={[styles.square, isWinning ? styles.winningSquare : null]}
    onPress={onPress}
  >
    <Text style={styles.squareText}>{value}</Text>
  </TouchableOpacity>
);

const TicTacToe = () => {
  const [gameState, setGameState] = useState({
    squares: Array(9).fill(null),
    xIsNext: true,
  });
  const [winner, setWinner] = useState(null);
  const [winningSquares, setWinningSquares] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false);

  useEffect(() => {
    const loadInterstitialAd = async () => {
      try {
        await AdMobInterstitial.setAdUnitID('ca-app-pub-8633873973591632/6924969216'); // Cambia este ID por el tuyo
        await AdMobInterstitial.requestAdAsync();
        setIsInterstitialLoaded(true);
      } catch (error) {
        console.error('Error al cargar el anuncio intersticial:', error);
      }
    };

    loadInterstitialAd();

    return () => {
      AdMobInterstitial.removeAllListeners();
    };
  }, []);

  const showInterstitialAd = async () => {
    if (isInterstitialLoaded) {
      try {
        await AdMobInterstitial.showAdAsync();
      } catch (error) {
        console.error('Error mostrando el anuncio intersticial:', error);
      }
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
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (i) => {
    const { squares, xIsNext } = gameState;
    if (winner || squares[i]) return;

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    const result = calculateWinner(newSquares);

    if (result) {
      setWinner(result.winner);
      setWinningSquares(result.line);
      setIsModalVisible(true);
    }

    setGameState({
      squares: newSquares,
      xIsNext: !xIsNext,
    });

    if (newSquares.every((square) => square !== null) && !result) {
      setWinner('Empate');
      setIsModalVisible(true);
    }
  };

  const handleRestart = () => {
    setGameState({ squares: Array(9).fill(null), xIsNext: true });
    setWinner(null);
    setWinningSquares([]);
    setIsModalVisible(false);
    showInterstitialAd();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        {winner ? `Ganador: ${winner}` : `Siguiente jugador: ${gameState.xIsNext ? 'X' : 'O'}`}
      </Text>
      <View style={styles.board}>
        {gameState.squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onPress={() => handleClick(i)}
            isWinning={winningSquares.includes(i)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
        <Text style={styles.restartButtonText}>Reiniciar Partida</Text>
      </TouchableOpacity>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {winner === 'Empate' ? '¡Empate!' : `¡${winner} ha ganado!`}
            </Text>
            <Button title="Reiniciar" onPress={handleRestart} />
          </View>
        </View>
      </Modal>
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
  winningSquare: {
    backgroundColor: '#FFD700',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default TicTacToe;
