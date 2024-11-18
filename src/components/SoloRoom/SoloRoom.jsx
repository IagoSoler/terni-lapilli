import React, { useEffect, useState } from 'react'
import './SoloRoom.css'
import goldCoin from '../../assets/goldCoin.png'
import silverCoin from '../../assets/silverCoin.png'

export const SoloRoom = ({ setModoSolo }) => {
  const [posicionesTablero, setPosicionesTablero] = useState(Array(9).fill(0));
  const [turno, setTurno] = useState("doradas");
  const [ganador, setGanador] = useState('');
  const [fichasColocadas, setFichasColocadas] = useState(false);
  const [mensajeMovimiento, setMensajeMovimiento] = useState('Escoge una casilla para colocar la ficha');
  const [fichaSeleccionadaIndex, setFichaSeleccionadaIndex] = useState(null); // Cambiado a null por defecto y renombrado para claridad

  const winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 1, 3],
    [1, 2, 5],
    [3, 6, 7],
    [5, 7, 8],
  ];

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

  useEffect(() => {
    const huecosLibres = posicionesTablero.filter(pos => pos === 0).length;
    if (huecosLibres <= 3) setFichasColocadas(true);
  }, [posicionesTablero]);

  const getBoardTitle = () => {
    if (ganador) {
      return "Ganan " + ganador;
    }
    return "Mueven " + turno;
  };

  const getBoardMessage = () => {
    if (ganador) {
      return <button className='resetbutton' onClick={resetGame}>Reinicar Partida</button>;
    }
    if (!mensajeMovimiento) {
      if (!fichasColocadas) {
        return "Selecciona una casilla desocupada para colocar la ficha";
      } else {
        return "Selecciona una de las fichas para mover";
      }
    }
    return mensajeMovimiento;
  };

  const checkWin = (posiciones) => {
    for (const [a, b, c] of winningPositions) {
      if (
        posiciones[a] !== 0 &&
        posiciones[a] === posiciones[b] &&
        posiciones[a] === posiciones[c]
      ) {
        const winner = posiciones[a] === "doradas" ? "doradas" : "plateadas";
        setGanador(winner);
        return true;
      }
    }
    return false;
  };

  const checkLegality = (targetIndex) => {
    if (fichaSeleccionadaIndex === null) return false;
    return legalMoves[fichaSeleccionadaIndex].includes(targetIndex);
  };

  const handleSquareClick = (arrayIndex) => {
    if (ganador) {
      setMensajeMovimiento("El juego ha terminado");
      return;
    }

    const currentPosition = posicionesTablero[arrayIndex];

    // Si es una casilla del rival, no permitir interacción
    if (currentPosition !== 0 && currentPosition !== turno) {
      setMensajeMovimiento("Ahora es el turno de " + turno);
      return;
    }

    // Si es fase de colocación inicial
    if (!fichasColocadas) {
      if (currentPosition === 0) {
        const newPosiciones = [...posicionesTablero];
        newPosiciones[arrayIndex] = turno;
        setPosicionesTablero(newPosiciones);
        setTurno(prev => prev === "doradas" ? "plateadas" : "doradas");
        setMensajeMovimiento("Ficha colocada");
      } else {
        setMensajeMovimiento("Esa casilla ya está ocupada");
      }
      return;
    }

    // Fase de movimiento
    if (currentPosition === turno && fichaSeleccionadaIndex === null) {
      // Seleccionar ficha
      setFichaSeleccionadaIndex(arrayIndex);
      setMensajeMovimiento("Escoge una posición adyacente");
    } else if (currentPosition === 0 && fichaSeleccionadaIndex !== null) {
      // Intentar mover la ficha
      if (checkLegality(arrayIndex)) {
        const newPosiciones = [...posicionesTablero];
        newPosiciones[fichaSeleccionadaIndex] = 0;
        newPosiciones[arrayIndex] = turno;

        if (!checkWin(newPosiciones)) {
          setPosicionesTablero(newPosiciones);
          setTurno(prev => prev === "doradas" ? "plateadas" : "doradas");
          setMensajeMovimiento("Ficha movida");
        } else {
          setPosicionesTablero(newPosiciones);
        }
        setFichaSeleccionadaIndex(null);
      } else {
        setMensajeMovimiento("Esa casilla no es adyacente");
      }
    } else {
      // Deseleccionar ficha
      setFichaSeleccionadaIndex(null);
      setMensajeMovimiento("Escoge una de tus fichas para moverla");
    }
  };

  const getSquareClassName = (index, posicion) => {
    let className = '';

    if (posicion === "doradas") {
      className += ' yoursquare';
      if (index === fichaSeleccionadaIndex) {
        className += ' selectedsquare';
      }
    } else if (posicion === "plateadas") {
      className += ' rivalsquare';
      if (index === fichaSeleccionadaIndex) {
        className += ' selectedsquare';
      }
    }

    return className;
  };

  const setSquares = (posicion) => {
    if (posicion === "doradas") {
      return <img alt='GoldCoin' className='player__squares' src={goldCoin} />;
    }
    if (posicion === "plateadas") {
      return <img alt='silverCoin' className='player__squares' src={silverCoin} />;
    }
    return '';
  };

  const resetGame = () => {
    setPosicionesTablero(Array(9).fill(0));
    setTurno("doradas");
    setGanador('');
    setFichasColocadas(false);
    setMensajeMovimiento('Escoge una casilla para colocar la ficha');
    setFichaSeleccionadaIndex(null);
  };

  return (
    <div>
      <div className='header solo__mode'>
        <h1>Modo solitario</h1>
        <button onClick={() => setModoSolo(false)}>Salir</button>
      </div>

      <div className='info__board__wrapper'>
        <h1>{getBoardTitle()}</h1>
        <p>{getBoardMessage()}</p>
        <div className="back__board">
          <div className="board">
            {posicionesTablero.map((posicion, index) => (
              <div
                className={`square pos-${index}`}
                key={index}
                onClick={() => handleSquareClick(index)}
              >
                <div className={`square__center ${getSquareClassName(index, posicion)}`}>
                  {setSquares(posicion)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};