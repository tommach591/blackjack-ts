import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

interface GameInterface {
  deck: number[];
  dealer: number[];
  player: number[][];
  selected: number;
  bet: number;
  done: boolean;
}

export const GameContext = createContext<GameInterface>(null!);
export function useGame() {
  return useContext(GameContext);
}

interface CommandInterface {
  hit: any;
  stand: any;
  split: any;
  double: any;
  setup: any;
  updateAccount: any;
}

export const CommandContext = createContext<CommandInterface>(null!);
export function useCommand() {
  return useContext(CommandContext);
}

interface AccountInterface {
  balance: number;
  bet: number;
}

export const AccountContext = createContext<AccountInterface>(null!);
export function useAccount() {
  return useContext(AccountContext);
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
  const standardDeck = useMemo(
    () => [
      1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 1.1,
      2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 11.1, 12.1, 13.1, 1.2, 2.2,
      3.2, 4.2, 5.2, 6.2, 7.2, 8.2, 9.2, 10.2, 11.2, 12.2, 13.2, 1.3, 2.3, 3.3,
      4.3, 5.3, 6.3, 7.3, 8.3, 9.3, 10.3, 11.3, 12.3, 13.3,
    ],
    []
  );

  const [game, setGame] = useState<GameInterface>({
    deck: standardDeck,
    dealer: [],
    player: [],
    selected: 0,
    bet: 0,
    done: true,
  });

  const [account, setAccount] = useState<AccountInterface>(
    JSON.parse(
      localStorage.getItem("account") ||
        JSON.stringify({ balance: 100, bet: 1 })
    )
  );

  const updateAccount = useCallback((newAccount: AccountInterface) => {
    setAccount(newAccount);
    localStorage.setItem("account", JSON.stringify(newAccount));
  }, []);

  const shuffleDeck = (deck: number[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const countHand = (hand: number[]) => {
    let sum = 0;
    let hasAce = 0;
    hand?.forEach((card: number) => {
      let temp = card > 10 ? 10 : Math.floor(card);
      if (temp === 1) {
        hasAce++;
        temp += 10;
      }
      sum += temp;
    });

    while (hasAce > 0 && sum > 21) {
      sum -= 10;
      hasAce--;
    }

    return sum;
  };

  const setup = useCallback(
    (bet: number) => {
      const newDeck = shuffleDeck([...standardDeck]);
      const dealerHand = [newDeck.shift()!, newDeck.shift()!];
      const playerHand = [newDeck.shift()!, newDeck.shift()!];

      setGame({
        deck: newDeck,
        dealer: dealerHand,
        player: [playerHand],
        selected: 0,
        bet: bet,
        done: countHand(playerHand) === 21,
      });

      const newAccount = JSON.parse(JSON.stringify(account));
      newAccount.balance -= bet;
      updateAccount(newAccount);
    },
    [standardDeck, account, updateAccount]
  );

  const dealDealer = useCallback(
    (oldGame: GameInterface | null) => {
      const newGame = oldGame
        ? JSON.parse(JSON.stringify(oldGame))
        : JSON.parse(JSON.stringify(game));

      let dealerVal = countHand(newGame.dealer);

      while (dealerVal <= 16) {
        newGame.dealer.push(newGame.deck.shift());
        dealerVal = countHand(newGame.dealer);
      }

      newGame.done = true;
      setGame(newGame);
    },
    [game]
  );

  const checkGame = useCallback(() => {
    const newGame = JSON.parse(JSON.stringify(game));
    if (!newGame.done) {
      const sum = countHand(newGame.player[newGame.selected]);
      if (sum > 21) {
        if (newGame.selected < newGame.player.length - 1) {
          newGame.selected++;
          setGame(newGame);
        } else {
          newGame.done = true;
          dealDealer(newGame);
        }
      } else if (newGame.player[newGame.selected].length === 5) {
        if (newGame.selected < newGame.player.length - 1) {
          newGame.selected++;
          setGame(newGame);
        } else {
          newGame.done = true;
          dealDealer(newGame);
        }
      }
    } else if (newGame.bet > 0) {
      let payout = 0;
      let dealerVal = countHand(newGame.dealer);

      newGame.player.forEach((hand: number[]) => {
        let playerVal = countHand(hand);

        const blackjack = playerVal === 21 && newGame.player[0].length === 2;
        const higherValue = playerVal <= 21 && playerVal > dealerVal;
        const dealerBust = playerVal <= 21 && dealerVal > 21;
        const fiveCards = playerVal <= 21 && hand.length === 5;
        const push = playerVal <= 21 && playerVal === dealerVal;

        if (blackjack) {
          payout += Math.round(newGame.bet * 2.5);
        } else if (higherValue || dealerBust || fiveCards)
          payout += newGame.bet * 2;
        else if (push) payout += newGame.bet;
      });

      if (payout > 0) {
        const newAccount = JSON.parse(JSON.stringify(account));
        newAccount.balance += payout;
        updateAccount(newAccount);

        newGame.bet = 0;
        setGame(newGame);
      }
    }
  }, [game, account, updateAccount, dealDealer]);

  const hit = useCallback(() => {
    const newGame = JSON.parse(JSON.stringify(game));
    newGame.player[newGame.selected].push(newGame.deck.shift());
    setGame(newGame);
  }, [game]);

  const stand = useCallback(() => {
    const newGame = JSON.parse(JSON.stringify(game));
    if (newGame.selected < newGame.player.length - 1) {
      newGame.selected++;
      setGame(newGame);
    } else dealDealer(newGame);
  }, [game, dealDealer]);

  const split = useCallback(() => {
    const newGame = JSON.parse(JSON.stringify(game));
    newGame.player.push([
      newGame.player[newGame.selected].pop(),
      newGame.deck.shift(),
    ]);
    newGame.player[newGame.selected].push(newGame.deck.shift());
    setGame(newGame);

    const newAccount = JSON.parse(JSON.stringify(account));
    newAccount.balance -= newAccount.bet;
    updateAccount(newAccount);
  }, [game, account, updateAccount]);

  const double = useCallback(() => {
    const newGame = JSON.parse(JSON.stringify(game));
    newGame.player[newGame.selected].push(newGame.deck.shift());
    newGame.bet *= 2;

    const newAccount = JSON.parse(JSON.stringify(account));
    newAccount.balance -= newAccount.bet;
    updateAccount(newAccount);

    dealDealer(newGame);
  }, [game, account, updateAccount, dealDealer]);

  useEffect(() => {
    checkGame();
  }, [checkGame]);

  return (
    <GameContext.Provider value={game}>
      <AccountContext.Provider value={account}>
        <CommandContext.Provider
          value={{ hit, stand, split, double, setup, updateAccount }}
        >
          {children}
        </CommandContext.Provider>
      </AccountContext.Provider>
    </GameContext.Provider>
  );
}
