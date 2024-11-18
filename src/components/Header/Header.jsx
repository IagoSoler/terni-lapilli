// src/components/Header/Header.jsx
import React, { useEffect } from 'react';
import './Header.css';
import { deleteGame, removePlayer } from '../../utils/ApiCalls';
import { getUserName, closeSession } from './headerUtils'; // Importar las funciones

export const Header = ({ idUsuario, nombreUsuario, setNombreUsuario,numeroJugador, setError, setIdUsuario, idSala, setIdSala, gameData }) => {
    useEffect(() => {
        getUserName(idUsuario, nombreUsuario, setError, setNombreUsuario);
    }, [idUsuario]);


    const handleRemovePlayer = async (idSala, numeroJugador) => {
        try {
            const response = await removePlayer(idSala, numeroJugador);
            if (response.success) {
                localStorage.clear(); 
                setIdSala('');
                deleteEmptyGames();
            } else {
                console.error('Error al abandonar la partida:', response.error);
                setError('Error al abandonar la partida');
            }
        } catch (err) {
            console.error('Error al abandonar la partida:', err);
            setError('Error al abandonar la partida');
        }
    };
    const deleteEmptyGames = async () => {
        try {
            const response = await deleteGame();
            if (!response.success) {
                console.error('Error al abandonar la partida:', response.error);
                setError('Error al abandonar la partida');
            }
        } catch (err) {
            console.error('Error al abandonar la partida:', err);
            setError('Error al abandonar la partida');
        }
    };
    const handleCloseSession = () => {
        closeSession(idUsuario, setError, setIdUsuario, setNombreUsuario, setIdSala);
    };

    return (
        <div className='header'>
            {gameData && (
                <div className='leave-game'>
                    <button onClick={() => handleRemovePlayer(idSala, numeroJugador)}>Dejar Sala</button>
                </div>
            )}
            {gameData && (
                <div className='room--name'>
                    <h1>Sala: {gameData.id}</h1>
                </div>
            )}
            {nombreUsuario && (
                <div className='header--name'>

                    <button onClick={handleCloseSession}>Cerrar sesión</button>
                </div>
            )}
        </div>
    );
};