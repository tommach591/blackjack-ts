import { useAccount, useCommand, useGame } from "../../utils/GameContext";
import Button from "../Button";
import Hand from "../Hand";
import "./App.css";

function App() {
  const game = useGame();
  const account = useAccount();
  const command = useCommand();

  return (
    <div className="App">
      <div className="Account">
        <div className="Balance">
          <img
            src="https://api.iconify.design/twemoji:coin.svg?color=%23ffffff"
            alt=""
          />
          <h1>{account.balance}</h1>
        </div>
        <div className="Bet">
          <Button
            name={"Bet"}
            handleOnClick={command.setup}
            active={game.done && account.balance >= account.bet}
            params={account.bet}
          />
          <input
            type="number"
            value={account.bet}
            step={1}
            min={1}
            onChange={(event) => {
              const newAccount = { ...account };
              newAccount.bet =
                parseInt(event.target.value) < 1
                  ? 1
                  : parseInt(event.target.value);
              command.updateAccount(newAccount);
            }}
          />
        </div>
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
            style={{ top: `${game.selected * 5 + 1.5}rem` }}
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

