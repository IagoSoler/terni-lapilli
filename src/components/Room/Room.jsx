import React, { useState, useEffect } from 'react';
import { deleteGame, getGameById, removePlayer } from '../../utils/ApiCalls';
import { Board } from './Board';

export const Room = ({ idSala, setMensaje, idUsuario, setIdSala, }) => {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(true);
    const [numeroJugador, setNumeroJugador] = useState('');
    const [esSuTurno, setEsSuTurno] = useState(false);

    // Función para actualizar el estado del jugador
    const updatePlayerState = (data) => {
        const nuevoNumeroJugador = data.jugador_1_id == idUsuario ? '1' : '2';
        setNumeroJugador(nuevoNumeroJugador);
        setEsSuTurno((data.turno_actual - nuevoNumeroJugador) % 2 === 0);
    };

    // Función de actualización que podemos reutilizar
    const updateGameData = async () => {
        try {
            const response = await getGameById(idSala);

            if (response.success) {
                const newData = {
                    ...gameData,
                    ...response.data
                };
                setGameData(newData);
                updatePlayerState(newData);
            }
        } catch (err) {
            console.error('Error actualizando los datos de la partida');
        }
    };
    const handleRemovePlayer = async (idSala, numeroJugador) => {
        try {
            const response = await removePlayer(idSala, numeroJugador);
            if (response.success) {
                localStorage.removeItem('idSala');
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

    // Fetch inicial
    useEffect(() => {
        const fetchGameData = async () => {
            try {
                setLoading(true);
                const response = await getGameById(idSala);

                if (response.success) {
                    const newData = response.data;
                    setGameData(newData);
                    updatePlayerState(newData);
                } else {
                    setError(response.error || 'Error al obtener los datos de la partida');
                }
            } catch (err) {
                setError('Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };

        if (idSala) {
            fetchGameData();
        }
    }, [idSala]);

    // Actualización periódica y cuando refresh cambia
    useEffect(() => {
        if (!idSala) return;
        updateGameData();
        const intervalId = setInterval(updateGameData, 3000);

        return () => clearInterval(intervalId);
    }, [idSala, refresh]);


    if (loading) {
        return <div className="text-center p-4">Cargando...</div>;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    if (!gameData) {
        return <div className="text-center p-4">No se encontró la partida</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Partida: {gameData.id}</h2>
            <div className="space-y-2">
                <p>Numero jugador: {numeroJugador}</p>
                <p>Es tu turno: {esSuTurno ? 'Sí' : 'No'}</p>
                <p>Jugador 1: {gameData.jugador_1_nombre}</p>
                <p>Jugador 2: {gameData.jugador_2_nombre || 'Esperando jugador...'}</p>
                <p>Turno actual: {gameData.turno_actual}</p>
                <p>Posiciones: {gameData.posiciones_tablero}</p>
                {idSala && <button onClick={()=>handleRemovePlayer(idSala, numeroJugador)}>Abandonar partida</button>}
            </div>
            <Board
                gameData={gameData}
                idUsuario={idUsuario}
                setMensaje={setMensaje}
                setRefresh={setRefresh}
                esSuTurno={esSuTurno}
                numeroJugador={numeroJugador}
            />
        </div>
    );
};