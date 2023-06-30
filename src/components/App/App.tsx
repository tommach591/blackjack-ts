import { useAccount, useCommand, useGame } from "../../utils/GameContext";
import Button from "../Button";
import Hand from "../Hand";
import Modal from "../Modal";
import "./App.css";

function App() {
  const game = useGame();
  const account = useAccount();
  const command = useCommand();

  const getTimer = () => {
    const currentTime = new Date();
    const lastCoin = new Date(account.lastCoin);
    const timeDiff = currentTime.getTime() - lastCoin.getTime();
    const cooldown = 6 * 60 * 1000;

    if (timeDiff < cooldown) {
      let min = Math.floor(
        ((cooldown - timeDiff) % (1000 * 60 * 60)) / (1000 * 60)
      );
      let sec = Math.floor(
        (((cooldown - timeDiff) % (1000 * 60 * 60)) % (1000 * 60)) / 1000
      );

      let m = min < 10 ? "0" + min.toString() : min.toString();
      let s = sec < 10 ? "0" + sec.toString() : sec.toString();

      return `${m}:${s}`;
    } else return "00:00";
  };

  return (
    <div className="App">
      <Modal />
      <div className="Account">
        <div className="Balance">
          <img
            src="https://api.iconify.design/twemoji:coin.svg?color=%23ffffff"
            alt=""
          />
          <h1>{account.balance}</h1>
        </div>
        <h1 className="Timer">{`Next Coin: ${getTimer()}`}</h1>
      </div>
      <div className="Bet">
        <Button
          name={"Bet"}
          handleOnClick={command.setup}
          active={
            game.done && account.balance >= account.bet && account.bet !== null
          }
          params={account.bet}
        />
        <input
          type="number"
          value={account.bet ?? ""}
          step={1}
          min={1}
          onChange={(event) => {
            const newAccount = JSON.parse(JSON.stringify(account));
            newAccount.bet =
              event.target.valueAsNumber < 1
                ? 1
                : Math.floor(event.target.valueAsNumber);
            command.updateAccount(newAccount);
          }}
          disabled={!game.done}
        />
      </div>
      <div className="Controls">
        <Button
          name={"Hit"}
          handleOnClick={command.hit}
          active={!game.done}
          params={null}
        />
        <Button
          name={"Stand"}
          handleOnClick={command.stand}
          active={!game.done}
          params={null}
        />
        <Button
          name={"Split"}
          handleOnClick={command.split}
          active={
            !game.done &&
            game.player[game.selected]?.length === 2 &&
            Math.floor(game.player[game.selected][0]) ===
              Math.floor(game.player[game.selected][1]) &&
            game.player.length < 4
          }
          params={null}
        />
        <Button
          name={"Double"}
          handleOnClick={command.double}
          active={
            !game.done &&
            game.player[game.selected]?.length === 2 &&
            game.player.length === 1
          }
          params={null}
        />
      </div>
      {game.dealer.length > 0 && <Hand hand={game.dealer} isDealer={true} />}
      <div className="Player">
        {!game.done && (
          <img
            className="Selected"
            src="https://api.iconify.design/material-symbols:arrow-right-alt.svg?color=%23ffffff"
            alt=""
            style={{ top: `${game.selected * (3.5 + 0.5) + 1.575}rem` }}
          />
        )}
        {game.player.length > 0 &&
          game.player.map((hand, i) => (
            <Hand key={i} hand={hand} isDealer={false} />
          ))}
      </div>
    </div>
  );
}

export default App;

