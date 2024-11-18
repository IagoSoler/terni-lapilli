import { deleteUser,getUserById } from '../../utils/ApiCalls';


export const getUserName = async (idUsuario, nombreUsuario, setError, setNombreUsuario) => {
    try {
        setError('');
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

export const closeSession = async (idUsuario, setError, setIdUsuario, setNombreUsuario, setIdSala) => {
    try {
        const response = await deleteUser(idUsuario);
        if (response.success) {
            localStorage.removeItem('idUsuario');
            localStorage.removeItem('nombreUsuario');
            localStorage.removeItem('idSala');
            setIdUsuario(null);
            setNombreUsuario('');
            setIdSala('');
        } else {
            console.error('Error al abandonar la partida:', response.error);
            setError('Error al abandonar la partida');
        }
    } catch (err) {
        console.error('Error al abandonar la partida:', err);
        setError('Error al abandonar la partida');
    }
};