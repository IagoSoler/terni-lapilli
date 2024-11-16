import React, { useState, useEffect } from 'react';
import { createUser } from './utils/ApiCalls';
import { StartMenu } from './components/StartMenu/StartMenu';
import { Header } from './components/Header/Header';
import { RoomManage } from './components/RoomManage/RoomManage';
import { Room } from './components/Room/Room';

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
    <div className="App">
      <Header
        idUsuario={idUsuario}
        setIdUsuario={setIdUsuario}
        nombreUsuario={nombreUsuario}
        setNombreUsuario={setNombreUsuario}
        mensaje={mensaje}
        error={error}
        setError={setError}
        idSala={idSala}
        setIdSala = {setIdSala}
      />
      {!nombreUsuario && <StartMenu
        usuarioEncreación={usuarioEncreación}
        setUsuarioEncreación={setUsuarioEncreación}
        mensaje={mensaje}
        setMensaje={setMensaje}
        error={error}
        setError={setError}
        setIdUsuario={setIdUsuario}
        nombreUsuario={nombreUsuario}
        setNombreUsuario={setNombreUsuario}
      />}
      {nombreUsuario && !idSala && <RoomManage
        nombreUsuario={nombreUsuario}
        idUsuario={idUsuario}
        idSala={idSala}
        setIdSala={setIdSala}
        setError={setError}

      />}
      {idSala && nombreUsuario && <Room
      idUsuario={idUsuario}
      idSala={idSala}
      setIdSala={setIdSala}
      setMensaje={setMensaje}
      />}
    </div>
  );
}

export default App;