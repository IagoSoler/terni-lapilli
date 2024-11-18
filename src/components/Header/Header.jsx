// src/components/Header/Header.jsx
import React, { useEffect } from 'react';
import { getUserName, closeSession } from './headerUtils'; // Importar las funciones

export const Header = ({ idUsuario, nombreUsuario, setNombreUsuario, setError, setIdUsuario, setIdSala, error }) => {
    useEffect(() => {
        getUserName(idUsuario, nombreUsuario, setError, setNombreUsuario); 
    }, [idUsuario]);

    const handleCloseSession = () => {
        closeSession(idUsuario, setError, setIdUsuario, setNombreUsuario, setIdSala); 
    };

    return (
        <div className='header'>
            {nombreUsuario ? <div className='header--info'><span>Conectado como {nombreUsuario} </span> <button onClick={handleCloseSession}>Cerrar sesión</button></div>: ""}
        </div>
    );
};