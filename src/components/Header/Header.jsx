import React, { useEffect } from 'react'
import { deleteUser, getUserById } from '../../utils/ApiCalls';

export const Header = ({ idUsuario, nombreUsuario, setNombreUsuario, setError, setIdUsuario, idSala, setIdSala, mensaje, error }) => {
    const getUserName = async () => {
        try {
            setError('');
            // Solo hacer la llamada si tenemos un ID y no tenemos el nombre
            if (idUsuario && !nombreUsuario) {
                const response = await getUserById(idUsuario);
                if (response.error) {
                    setError(response.error);

                    localStorage.removeItem('idUsuario');
                    localStorage.removeItem('nombreUsuario');
                } else {
                    setNombreUsuario(response.nombre_usuario);
                }
            }
        } catch (err) {
            setError('Error al obtener el usuario. Por favor, intenta de nuevo.');
            console.error('Error:', err);

            localStorage.removeItem('idUsuario');
            localStorage.removeItem('nombreUsuario');
        }
    };

    useEffect(() => {
        getUserName();
    }, [idUsuario]);

    const closeSession = async (idUsuario) => {
        try {
            const response = await deleteUser(idUsuario);
            if (response.success) {
                localStorage.removeItem('idUsuario');
                localStorage.removeItem('nombreUsuario');
                localStorage.removeItem('idSala')
                setIdUsuario(null);
                setNombreUsuario('');
                setIdSala('')
            } else {
                console.error('Error al abandonar la partida:', response.error);
                setError('Error al abandonar la partida');
            }
        } catch (err) {
            console.error('Error al abandonar la partida:', err);
            setError('Error al abandonar la partida');
        }
    };


    const handleClearStorage = () => {
        localStorage.removeItem('idUsuario');
        localStorage.removeItem('nombreUsuario');
        localStorage.removeItem('idSala')
        setIdUsuario(null);
        setNombreUsuario('');
        setIdSala('')
    };

    return (
        <div>
            {nombreUsuario ? <h1>Conectado como: {nombreUsuario} con Id:{idUsuario} En la Sala: {idSala}</h1> : ""}

            <button onClick={()=>closeSession(idUsuario)}>Cerrar sesión</button>


            {mensaje && <div>{mensaje}</div>}
            {error && <div>{error}</div>}
        </div>
    )
}