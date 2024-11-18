import React, { useState } from 'react';
import { checkIfFull, checkIfExists, joinGame } from '../../utils/ApiCalls';

export const JoinRoom = ({ setError, idUsuario, setIdSala }) => {
    const [idSalaInsertada, setIdSalaInsertada] = useState('');
    const [mostrarInput, setMostrarInput] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const mostrarUnirse = () => {
        setMostrarInput(true);
        setMessage('');
    };
    const handleJoinRoom = async () => {
        if (!idSalaInsertada.trim()) {
            setMessage('Por favor, ingresa un código de sala');
            return;
        }

        setIsLoading(true);
        setMessage('Verificando sala...');

        try {
            // Verificar si la sala existe
            const existsResponse = await checkIfExists(idSalaInsertada);
            if (!existsResponse) {
                setMessage('La sala no existe.');
                setIsLoading(false);
                return;
            }

            // Verificar si la sala está llena
            const isFullResponse = await checkIfFull(idSalaInsertada);
            if (isFullResponse) {
                setMessage('La sala ya está completa.');
                setIsLoading(false);
                return;
            }

            // Unirse a la sala
            const joinResponse = await joinGame(idSalaInsertada, idUsuario);
            if (joinResponse) {
                setMessage('¡Te has unido a la sala exitosamente!');
                setIdSala(idSalaInsertada)
                // Aquí podrías agregar redirección o actualización del estado global
            } else {
                setMessage('Hubo un error al unirse a la sala.');
            }
        } catch (error) {
            setError(error.message || 'Ocurrió un error al procesar tu solicitud');
            setMessage('Hubo un error al procesar tu solicitud.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="">
            {!mostrarInput && (
                <button
                    onClick={mostrarUnirse}
                >
                    Unirse a una Sala
                </button>
            )}

            {mostrarInput && (
                <div className='join__room' >
                    <div className='startmenu--form'>
                        <input
                            type="text"
                            value={idSalaInsertada}
                            onChange={(e) => setIdSalaInsertada(e.target.value)}
                            placeholder="Número de sala"
                            disabled={isLoading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleJoinRoom();
                                }
                            }}
                        />
                        <button
                            onClick={handleJoinRoom}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Procesando...' : 'Unirse'}
                        </button>
                    </div>

                    {message && (
                        <div >
                            {message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
