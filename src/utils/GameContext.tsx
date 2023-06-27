import { createContext, useContext, useEffect, useState } from "react";

interface GameInterface {
  deck: number[];
  dealer: number[];
  player: number[][];
  bet: number;
}

export const GameContext = createContext<GameInterface>(null!);
export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }: { children: JSX.Element }) {
  /**
   * Standard Deck
   * 1.0 = Ace of Diamonds,
   * 2.1 = Two of Clubs,
   * ...,
   * 12.2 = Queen of Hearts,
   * 13.3 = King of Spades
   *
   */
  const standardDeck = [
    1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 1.1,
    2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 1.2, 2.2,
    3.2, 4.2, 5.2, 6.2, 7.2, 8.2, 9.2, 10.2, 11.2, 12.2, 13.2, 1.3, 2.3, 3.3,
    4.3, 5.3, 6.3, 7.3, 8.3, 9.3, 10.3, 11.3, 12.3, 13.3,
  ];

  const [game, setGame] = useState<GameInterface>({
    deck: standardDeck,
    dealer: [],
    player: [],
    bet: 0,
  });

  const shuffleDeck = (deck: number[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const setUpGame = (bet: number) => {
    const newDeck = shuffleDeck([...standardDeck]);
    const dealerHand = [newDeck.shift()!, newDeck.shift()!];
    const playerHand = [newDeck.shift()!, newDeck.shift()!];

    setGame({
      deck: newDeck,
      dealer: dealerHand,
      player: [playerHand],
      bet: bet,
    });
  };

  useEffect(() => {
    setUpGame(0);
  }, []);

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}
