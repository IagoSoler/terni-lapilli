
import React, { useState, useEffect } from 'react';
import { createGame } from '../../utils/ApiCalls';
import { JoinRoom } from './JoinRoom';

export const RoomManage = ({ idUsuario, setIdSala, setError }) => {

    function randomCode() {
        const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let codigo = '';
        for (let i = 0; i < 5; i++) {
            const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
            codigo += caracteres[indiceAleatorio];
        }
        return codigo;
    }
    const handleCreateGame = async () => {
        try {
            const nuevoId = randomCode();
            const response = await createGame(nuevoId, idUsuario);
            if (response.success) {
                setIdSala(nuevoId);
                console.log("Partida creada:", response);
            } else {
                console.error("Error al crear la partida:", response.error);
            }
        } catch (error) {
            console.error("Error al crear la partida:", error);
        }
    };
    return (
        <div>
            <button onClick={handleCreateGame}>Crear Sala</button>
            <br />
            <JoinRoom
                setError={setError}
                idUsuario={idUsuario}
                setIdSala={setIdSala}
            />
            <br />
            <button >Probar en modo solitario</button>
            <br />
        </div>
    )
}
