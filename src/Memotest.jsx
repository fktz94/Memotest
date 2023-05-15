import { useEffect, useState } from 'react';
import './Memotest.css';
import Card from './Card';
import campazzo from './assets/campazzo.jpg';
import giannis from './assets/giannis.jpeg';
import ginobili from './assets/ginobili.jpeg';
import kobe from './assets/kobe.jpg';
import lebron from './assets/lebron.jpg';
import jordan from './assets/mj23.jpg';

// REFACTORIZING ...

function createPlayers() {
  const players = [
    {
      name: 'Campazzo',
      url: campazzo,
      isPicked: false,
      id: 0,
      found: false,
    },
    {
      name: 'Giannis',
      url: giannis,
      isPicked: false,
      id: 0,
      found: false,
    },
    {
      name: 'Ginobili',
      url: ginobili,
      isPicked: false,
      id: 0,
      found: false,
    },
    {
      name: 'Kobe',
      url: kobe,
      isPicked: false,
      id: 0,
      found: false,
    },
    {
      name: 'LeBron',
      url: lebron,
      isPicked: false,
      id: 0,
      found: false,
    },
    {
      name: 'Jordan',
      url: jordan,
      isPicked: false,
      id: 0,
      found: false,
    },
  ];
  return players;
}

const useMemotestState = () => {
  const [players, setPlayers] = useState([
    // spread dos veces para tener 2 imagenes de cada jugador
    ...createPlayers(),
    ...createPlayers(),
  ]);

  const [restart, setRestart] = useState(false);

  // useEffect para generar un array con los jugadores de forma aleatoria (solo al cargar por primera vez).
  // rompe las reglas de la programación funcional y la inmutabilidad?? los for y los if y los array y variables nuevas, etc.
  useEffect(() => {
    const randomizePlayers = () => {
      const randomizedPlayers = [];
      for (let i = 0; i < players.length; i++) {
        const randomPlayer =
          players[Math.floor(Math.random() * players.length)];
        let check = 0;
        randomizedPlayers.map(
          (player) => player.name === randomPlayer.name && check++,
        );
        check < 2 ? randomizedPlayers.push(randomPlayer) : i--;
      }
      // otro map para asignarle id, si inicializo el objeto sin propiedad id y se la creo después, no me lo lee el map del handleClick
      const idRandomizedPlayers = randomizedPlayers.map((player, index) => ({
        ...player,
        id: index,
      }));
      return idRandomizedPlayers;
    };

    setPlayers(randomizePlayers);
  }, [restart]);

  // function de dar click a una carta
  function handleClick(event) {
    const { target } = event;
    setPlayers((oldPlayers) =>
      oldPlayers.map((player) =>
        Number(target.id) === player.id
          ? { ...player, isPicked: !player.isPicked }
          : player,
      ),
    );
  }

  // chequear si ganó el juego
  const [founds, setFounds] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  useEffect(() => {
    founds === 6 && setGameEnded(true);
  }, [founds]);

  // comparar si las cartas elegidas son iguales,
  const [compareCards, setCompareCards] = useState([]);

  // un useEffect que corra cada vez que se elija una carta y en un state carga las cartas que se van a comparar
  useEffect(() => {
    setCompareCards(
      players.filter((player) => player.isPicked && !player.found),
    );
  }, [players]);

  // un useEffect para comparar las cartas elegidas
  useEffect(() => {
    if (compareCards.length === 2) {
      if (compareCards[0].name === compareCards[1].name) {
        setPlayers((oldPlayers) =>
          oldPlayers.map((player) =>
            player.name === compareCards[0].name
              ? { ...player, found: true }
              : player,
          ),
        );
        setFounds((oldFounds) => oldFounds + 1);
      } else {
        setPlayers((oldPlayers) =>
          oldPlayers.map((player) =>
            player.id === compareCards[0].id || player.id === compareCards[1].id
              ? { ...player, isPicked: false }
              : player,
          ),
        );
      }
    }
  }, [compareCards]);

  const restartGame = () => {
    setFounds(0);
    setGameEnded(false);
    setCompareCards([]);
    setRestart(!restart);
  };

  // lo que retorna el useMemotestState acá abajo
  return { players, handleClick, gameEnded, restartGame };
};

const Memotest = () => {
  const { players, handleClick, gameEnded, restartGame } = useMemotestState();

  const generateCards = players.map(({ url, isPicked, id, found }, index) => (
    <Card
      key={index}
      id={id}
      onClick={(event) => handleClick(event)}
      randomPlayer={url}
      isPicked={isPicked}
      found={found}
    />
  ));

  return (
    <>
      <main>
        {gameEnded && (
          <div className="win-card">
            You &#39;ve won!
            <button onClick={restartGame}>jugar de nuevo ?</button>
          </div>
        )}
        {!gameEnded && <div className="card-container">{generateCards}</div>}
      </main>
    </>
  );
};

export default Memotest;
