// Función para crear un nuevo usuario
export async function createUser(nombre_usuario) {
  try {
    const response = await fetch(
      "http://localhost/terni-api/api.php?action=create_user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre_usuario }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en createUser:", error);
    throw error;
  }
}
//Función para obtener nombre mediante ID:
export async function getUserById(usuario_id) {
  const response = await fetch(
    `http://localhost/terni-api/api.php?action=get_username&usuario_id=${usuario_id}`
  );
  const data = await response.json();
  return data;
}
//////////////////////
// Función para crear una nueva partida
export async function createGame(partida_id, jugador_1_id) {
  try {
    const response = await fetch(
      "http://localhost/terni-api/api.php?action=create_game",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partida_id: partida_id,
          jugador_1_id: jugador_1_id,
        }),
      }
    );

    // Verificar si la respuesta es JSON válido
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Respuesta no válida del servidor: ${text}`);
    }

    const data = await response.json();

    // Verificar si la operación fue exitosa
    if (!data.success) {
      throw new Error(data.error || "Error desconocido al crear la partida");
    }

    // Verificar que el tablero inicial está presente
    if (!data.tablero_inicial) {
      console.warn("El servidor no devolvió el tablero inicial");
    }

    return data;
  } catch (error) {
    console.error("Error en createGame:", error);
    throw error;
  }
}
export async function checkIfExists(partida_id) {
  const response = await fetch(
    `http://localhost/terni-api/api.php?action=check_exists&partida_id=${partida_id}`
  );
  const data = await response.json();
  return data;
}
export async function checkIfFull(partida_id) {
  const response = await fetch(
    `http://localhost/terni-api/api.php?action=check_full&partida_id=${partida_id}`
  );
  const data = await response.json();
  return data;
}
// Función para unirse a una partida
export async function joinGame(partida_id, jugador_2_id) {
  const response = await fetch(
    "http://localhost/terni-api/api.php?action=join_game",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ partida_id, jugador_2_id }),
    }
  );
  const data = await response.json();
  return data;
}
export async function getGameById(partida_id) {
  try {
    const response = await fetch(
      `http://localhost/terni-api/api.php?action=get_game&partida_id=${partida_id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getGameById:", error);
    throw error;
  }
}

// Función para actualizar el estado de la partida
export async function updateGame(partida_id, posiciones_tablero, turno_actual) {
  const response = await fetch(
    "http://localhost/terni-api/api.php?action=update_game",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ partida_id, posiciones_tablero, turno_actual }),
    }
  );
  const data = await response.json();
  return data;
}
// Función para eliminar un jugador
export async function removePlayer(partida_id, player_number) {
  try {
    const response = await fetch(
      "http://localhost/terni-api/api.php?action=remove_player",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ partida_id, player_number }),
      }
    );

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error desconocido al eliminar el jugador");
    }
    return data;
  } catch (error) {
    console.error("Error en removePlayer:", error);
    throw error;
  }
}
// Función para borrar un usuario
export async function deleteUser(usuario_id) {
  try {
    const response = await fetch(
      "http://localhost/terni-api/api.php?action=delete_user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario_id }),
      }
    );

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error desconocido al eliminar el usuario");
    }
    return data;
  } catch (error) {
    console.error("Error en deleteUser:", error);
    throw error;
  }
}
export async function deleteGame() {
  try {
    const response = await fetch(
      "http://localhost/terni-api/api.php?action=delete_game",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Error desconocido al eliminar el partida");
    }
    return data;
  } catch (error) {
    console.error("Error en deleteGame:", error);
    throw error;
  }
}
