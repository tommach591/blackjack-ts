import { useGame } from "../../utils/GameContext";
import Hand from "../Hand";
import "./App.css";

function App() {
  const game = useGame();

  return (
    <div className="App">
      {game.dealer.length > 0 && <Hand hand={game.dealer} />}
    </div>
  );
}

export default App;

