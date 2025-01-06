import React from 'react';
import { StatusBar } from 'react-native';
import TicTacToe from './TicTacToe';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <TicTacToe />
    </>
  );
}
