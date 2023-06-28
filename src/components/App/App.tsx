import { useCommand, useGame } from "../../utils/GameContext";
import Button from "../Button";
import Hand from "../Hand";
import "./App.css";

function App() {
  const game = useGame();
  const command = useCommand();

  return (
    <div className="App">
      <div className="Controls">
        <Button name={"Hit"} handleOnClick={command.hit} active={!game.done} />
        <Button
          name={"Stand"}
          handleOnClick={command.stand}
          active={!game.done}
        />
        <Button
          name={"Split"}
          handleOnClick={command.split}
          active={
            !game.done &&
            game.player[game.selected]?.length === 2 &&
            Math.floor(game.player[game.selected][0]) ===
              Math.floor(game.player[game.selected][1])
          }
        />
        <Button
          name={"Double"}
          handleOnClick={command.double}
          active={!game.done && game.player[game.selected]?.length === 2}
        />
      </div>
      {game.dealer.length > 0 && <Hand hand={game.dealer} isDealer={true} />}
      <div className="Player">
        <img
          className="Selected"
          src="https://api.iconify.design/material-symbols:arrow-right-alt.svg?color=%23ffffff"
          alt=""
          style={{ top: `${game.selected * 5 + 1.5}rem` }}
        />

        {game.player.length > 0 &&
          game.player.map((hand, i) => (
            <Hand key={i} hand={hand} isDealer={false} />
          ))}
      </div>
    </div>
  );
}

export default App;

