import React, { useState, useEffect } from 'react';
import './Room.css';
import { getGameById } from '../../utils/ApiCalls';
import { Board } from './Board';
import { Header } from '../Header/Header';

export const Room = ({ idSala,nombreUsuario,setNombreUsuario,mensaje, setMensaje, idUsuario, setIdSala,setIdUsuario,error,setError }) => {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
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
            }   else {
                localStorage.removeItem('idSala');
                setIdSala('');
            }
        } catch (err) {
            console.error('Error actualizando los datos de la partida');
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
                    localStorage.removeItem('idSala');
                    setIdSala('');
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
        const intervalId = setInterval(updateGameData, 2000);

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
        <div className='room'>
            <Header
            gameData={gameData}
                idUsuario={idUsuario}
                setIdUsuario={setIdUsuario}
                nombreUsuario={nombreUsuario}
                setNombreUsuario={setNombreUsuario}
                numeroJugador={numeroJugador}
                mensaje={mensaje}
                error={error}
                setError={setError}
                idSala={idSala}
                setIdSala={setIdSala}
            />

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