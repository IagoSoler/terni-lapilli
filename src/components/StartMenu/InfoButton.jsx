import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import './InfoButton.css';

const InfoButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button className="info-button" onClick={handleOpen} aria-label="Más información">
        <HelpCircle />
      </button>

      {isOpen && (
        <>
          <div className="info-dialog-overlay" onClick={handleClose} />
          <div className="info-dialog" role="dialog" aria-modal="true" onClick={handleClose}>
            <h2 className="info-dialog__title">Terni Lapilli</h2>
            <div className="info-dialog__content">
              <p>
                Terni Lapilli es un antiguo juego romano similar a nuestro "tres en raya", 
                obstando tres variaciones fundamentales:
              </p>
              
              <ul className="info-dialog__list">
                <li>Cada jugador solo tiene 3 fichas</li>
                <li>Una vez colocadas todas las fichas, debe mover una de sus fichas 
                    existentes a una casilla adyacente y vacía  </li>
                <li>El layout del tablero cambia, siendo circular y permitiendo tres en raya a lo largo de toda la circunferencia</li>
              </ul>

              <p className="info-dialog__footer">
               aquí Puedes jugar contra otro jugador o probarlo contra ti mismo/a en el modo solitario
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InfoButton;