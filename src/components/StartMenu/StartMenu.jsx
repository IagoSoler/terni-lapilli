import React from 'react'
import { createUser } from '../../utils/ApiCalls';
import './StartMenu.css'
import InfoButton from './InfoButton';

export const StartMenu = ({
    usuarioEncreación,
    setUsuarioEncreación,
    setIdUsuario,
    mensaje,
    error,
    setError,
    setNombreUsuario,
    modoSolo,
    setModoSolo
}) => {
    const handleCreateUser = async () => {
        try {
            setError('');
            if (!usuarioEncreación.trim()) {
                setError('Por favor, ingresa un nombre de usuario');
                return;
            }

            const response = await createUser(usuarioEncreación);
            if (response.error) {
                setError(response.error);
            } else {

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
        <div className='startmenu'>
            <h1>Terni Lapilli 
            </h1>
            <InfoButton/>
            <h2>Introduce tu nombre</h2>
            {mensaje && <div>{mensaje}</div>}
            {error && <div>{error}</div>}
            <div className='startmenu--form'>
                <input
                    type="text"
                    value={usuarioEncreación}
                    onChange={(e) => setUsuarioEncreación(e.target.value)}
                    placeholder="Escribe un nombre"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleCreateUser();
                        }
                    }}
                />
                <button onClick={handleCreateUser}>
                    Entrar
                </button>
                <br />
                <h2>o juega en solitario: </h2>
                <button className='button--bronze' onClick={()=>setModoSolo(true)} >Probar en modo solitario</button>
                <br />
            </div>
        </div>
    )
}