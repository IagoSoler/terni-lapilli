import React, { useState, useEffect } from 'react';
import './App.css'
import { StartMenu } from './components/StartMenu/StartMenu';
import { closeSession } from './components/Header/headerUtils';
import { RoomManage } from './components/RoomManage/RoomManage';
import { Room } from './components/Room/Room';
import { SoloRoom } from './components/SoloRoom/SoloRoom';

function App() {
  const [nombreUsuario, setNombreUsuario] = useState(() => {
    return localStorage.getItem('nombreUsuario') || '';
  });

  const [idUsuario, setIdUsuario] = useState(() => {
    return localStorage.getItem('idUsuario') || '';
  });

  const [idSala, setIdSala] = useState(() => {
    return localStorage.getItem('idSala') || '';
  });

  const [usuarioEncreación, setUsuarioEncreación] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [modoSolo,setModoSolo] = useState(false)

  // Efecto para manejar la persistencia del ID de usuario
  useEffect(() => {
    if (idUsuario) {
      localStorage.setItem('idUsuario', idUsuario);
    } else {
      localStorage.removeItem('idUsuario');
      localStorage.removeItem('nombreUsuario');
      localStorage.removeItem('idSala');
    }
  }, [idUsuario]);
  const handleCloseSession = () => {
    closeSession(idUsuario, setError, setIdUsuario, setNombreUsuario, setIdSala);
};
  // Efecto para manejar la persistencia del nombre de usuario
  useEffect(() => {
    if (nombreUsuario) {
      localStorage.setItem('nombreUsuario', nombreUsuario);
    } else {
      localStorage.removeItem('nombreUsuario');
    }
  }, [nombreUsuario]);

  useEffect(() => {
    if (idSala) {
      localStorage.setItem('idSala', idSala);
    } else {
      localStorage.removeItem('idSala');
    }
  }, [idSala]);


  return (
    <div className="App border">
       {modoSolo && <SoloRoom
       setModoSolo={setModoSolo}/>}
      {!nombreUsuario && !modoSolo && <StartMenu
        usuarioEncreación={usuarioEncreación}
        setUsuarioEncreación={setUsuarioEncreación}
        mensaje={mensaje}
        setMensaje={setMensaje}
        error={error}
        setError={setError}
        setIdUsuario={setIdUsuario}
        nombreUsuario={nombreUsuario}
        setNombreUsuario={setNombreUsuario}
        modoSolo={modoSolo}
        setModoSolo={setModoSolo}
      />}
        {nombreUsuario && !idSala && <div className='header'>
          <div className='header--name'>
                    <span>{nombreUsuario}</span>
                    <button onClick={handleCloseSession}>Salir</button>
                </div>
        </div> }
      {nombreUsuario && !idSala && <RoomManage
        nombreUsuario={nombreUsuario}
        idUsuario={idUsuario}
        setIdSala={setIdSala}
        setError={setError}

      />}
      {idSala && nombreUsuario && <Room
      nombreUsuario={nombreUsuario}
      setNombreUsuario={setNombreUsuario}
      idUsuario={idUsuario}
      setIdUsuario={setIdUsuario}
      idSala={idSala}
      setIdSala={setIdSala}
      mensaje={mensaje}
      setMensaje={setMensaje}
      error={error}
      setError={setError}
      />}
    </div>
  );
}

export default App;