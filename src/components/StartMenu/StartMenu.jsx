import React from 'react'
import { createUser } from '../../utils/ApiCalls';

export const StartMenu = ({ 
    usuarioEncreación, 
    setUsuarioEncreación, 
    setIdUsuario, 
    mensaje, 
    setMensaje, 
    error, 
    setError,
    setNombreUsuario 
}) => {
    const handleCreateUser = async () => {
        try {
            setMensaje('');
            setError('');

            if (!usuarioEncreación.trim()) {
                setError('Por favor, ingresa un nombre de usuario');
                return;
            }

            const response = await createUser(usuarioEncreación);
            if (response.error) {
                setError(response.error);
            } else {
                setMensaje(`Usuario creado exitosamente con ID: ${response.user_id}`);
                // Guardar tanto el ID como el nombre en el estado y localStorage
                setIdUsuario(response.user_id);
                setNombreUsuario(usuarioEncreación);
                localStorage.setItem('idUsuario', response.user_id);
                localStorage.setItem('nombreUsuario', usuarioEncreación);
                setUsuarioEncreación('');
            }
        } catch (err) {
            setError('Error al crear el usuario. Por favor, intenta de nuevo.');
            console.error('Error:', err);
        }
    };

    return (
        <div>
            <h2>Crear usuario</h2>
            {mensaje && <div>{mensaje}</div>}
            {error && <div>{error}</div>}
            <div>
                <input
                    type="text"
                    value={usuarioEncreación}
                    onChange={(e) => setUsuarioEncreación(e.target.value)}
                    placeholder="Escribe un nombre"
                />
                <button onClick={handleCreateUser}>
                    Guardar
                </button>
            </div>
        </div>
    )
}