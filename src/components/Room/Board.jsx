import React, { useState, useEffect } from 'react';
import './Room.css';
import { updateGame } from '../../utils/ApiCalls';

export const Board = ({ gameData, setMensaje, setRefresh, idUsuario, esSuTurno, numeroJugador }) => {
  const winningPositions = [
    [0, 1, 2], // horizontal superior
    [3, 4, 5], // horizontal medio
    [6, 7, 8], // horizontal inferior
    [0, 3, 6], // vertical izquierda
    [1, 4, 7], // vertical medio
    [2, 5, 8], // vertical derecha
    [0, 4, 8], // diagonal \
    [2, 4, 6]  // diagonal /
  ];

  const [gameEnded, setGameEnded] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [mensajeMovimiento, setMensajeMovimiento] = useState('');
  const [allTokensPlaced, setAllTokensPlaced] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false)

  useEffect(() => {
    // Verificar si todas las fichas están colocadas cuando el componente se monta o gameData cambia
    const playerTokenCount = gameData.posiciones_tablero.filter(pos => pos === numeroJugador).length;
    setAllTokensPlaced(playerTokenCount >= 3);

    // Verificar si hay un ganador cada vez que cambian las posiciones
    checkWin(gameData.posiciones_tablero);
    checkGameIsReady()
    if(turno_actual==1) setGameEnded(false);
  }, [gameData]);

  const checkWin = (posiciones) => {
    for (const [a, b, c] of winningPositions) {
      if (
        posiciones[a] !== 0 &&
        posiciones[a] === posiciones[b] &&
        posiciones[a] === posiciones[c]
      ) {
        setGameEnded(true);
        return true;
      }
    }
    return false;
  };
  const checkGameIsReady = () => {
    gameData.jugador_1_id && gameData.jugador_2_id ? setIsGameReady(true) : setIsGameReady(false)
  }

  const checkLegality = (targetIndex) => {
    if (selectedSquare === null) return false;

    const legalMoves = {
      0: [1, 3, 4],
      1: [0, 2, 4],
      2: [1, 4, 5],
      3: [0, 4, 6],
      4: [0, 1, 2, 3, 5, 6, 7, 8],
      5: [2, 4, 8],
      6: [3, 4, 7],
      7: [4, 6, 8],
      8: [4, 5, 7]
    };

    return legalMoves[selectedSquare].includes(targetIndex);
  };

  const handleSquareClick = (arrayIndex) => {
    if (!esSuTurno) {
      setMensajeMovimiento("No es tu turno");
      return;
    }
    if (!isGameReady) {
      setMensajeMovimiento("Espera a que se conecte tu oponente");
      return
    }

    if (gameEnded) {
      setMensajeMovimiento("El juego ha terminado");
      return;
    }

    const currentPosition = gameData.posiciones_tablero[arrayIndex];

    // Si es una casilla del rival, no permitir interacción
    if (currentPosition !== 0 && currentPosition !== numeroJugador) {
      setMensajeMovimiento("Esa ficha es de tu rival");
      return;
    }

    // Si es fase de colocación inicial
    if (!allTokensPlaced) {
      if (currentPosition === 0) {
        const newPosiciones = [...gameData.posiciones_tablero];
        newPosiciones[arrayIndex] = numeroJugador;

        // Verificar si este movimiento resulta en victoria antes de enviarlo
        const isWinningMove = checkWin(newPosiciones);
        if (!isWinningMove) {
          changePosition(arrayIndex);
          setMensajeMovimiento("Ficha colocada");
        } else {
          // Si es un movimiento ganador, actualizar el estado y enviar el movimiento
          setGameEnded(true);
          changePosition(arrayIndex);
          setMensajeMovimiento("¡Has ganado!");
        }
      } else {
        setMensajeMovimiento("Esa casilla ya está ocupada");
      }
      return;
    }

    // Fase de movimiento
    if (currentPosition === numeroJugador && !selectedSquare) {
      setSelectedSquare(arrayIndex);
      setMensajeMovimiento("Ficha seleccionada");
    } else if (currentPosition === 0 && selectedSquare !== null) {
      if (checkLegality(arrayIndex)) {
        // Simular el movimiento y verificar si resulta en victoria
        const newPosiciones = [...gameData.posiciones_tablero];
        newPosiciones[selectedSquare] = 0;
        newPosiciones[arrayIndex] = numeroJugador;

        const isWinningMove = checkWin(newPosiciones);
        if (!isWinningMove) {
          changePosition(arrayIndex);
          setSelectedSquare(null);
          setMensajeMovimiento("Ficha movida");
        } else {
          setGameEnded(true);
          changePosition(arrayIndex);
          setSelectedSquare(null);
          setMensajeMovimiento("¡Has ganado!");
        }
      } else {
        setMensajeMovimiento("Ese movimiento no es legal");
      }
    } else {
      setSelectedSquare(null);
      setMensajeMovimiento("Selecciona una casilla válida");
    }
  };

  const changePosition = async (arrayIndex) => {
    try {
      const newPosiciones = [...gameData.posiciones_tablero];
      if (selectedSquare !== null) {
        newPosiciones[selectedSquare] = 0;
      }
      newPosiciones[arrayIndex] = numeroJugador;
      const newTurn = Number(gameData.turno_actual) + 1;

      const response = await updateGame(gameData.id, newPosiciones, newTurn);
      if (response.success) {
        setMensaje('Movimiento registrado');
        setRefresh(prev => !prev);
      } else {
        setMensaje('Error: ' + (response.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error en changePosition:', error);
      setMensaje('Error al realizar el movimiento');
    }
  };

  const getSquareClassName = (index, posicion) => {
    let className = 'square';

    if (posicion === numeroJugador) {
      className += ' yoursquare';
      if (index === selectedSquare) {
        className += ' selectedsquare';
      }
    } else if (posicion !== 0) {
      className += ' rivalsquare';
    }

    return className;
  };
  const resetGame = async () => {
    try {
      const newPosiciones = Array(9).fill(0);

      const response = await updateGame(gameData.id, newPosiciones, 1);
      if (response.success) {
        setMensaje('Juego reiniciado');
        setGameEnded(false)
        setRefresh(prev => !prev);
      } else {
        setMensaje('Error: ' + (response.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error en updateGame:', error);
      setMensaje('Error al reinciar');
    }
  };



  return (
    <div>
      {!isGameReady && <h1>Esperando a un oponente...</h1>}
      <h1>{esSuTurno ? "Tu Turno!" : "Es el turno de tu oponente..."}</h1>
      <h1>{gameEnded ? "¡Se acabó!" : "El juego continúa..."}</h1>
      <p>{mensajeMovimiento}</p>
      {gameEnded && <button className='resetbutton' onClick={resetGame}>Reinicar Partida</button>}
      <div className="board">
        {gameData.posiciones_tablero.map((posicion, index) => (
          <div
            className={getSquareClassName(index, posicion)}
            key={`${gameData.id}-${index}`}
            onClick={() => handleSquareClick(index)}
          >
            {posicion}
          </div>
        ))}
      </div>
    </div>
  );
};