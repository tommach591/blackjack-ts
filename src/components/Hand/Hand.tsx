import { useGame } from "../../utils/GameContext";
import Card from "../Card";
import "./Hand.css";

interface HandInterface {
  hand: number[];
  isDealer: boolean;
}

function Hand(props: HandInterface) {
  const game = useGame();

  return (
    <div className="Hand">
      {props.hand?.map((card, i) => (
        <Card
          key={i}
          card={card}
          hide={props.isDealer ? i === 0 && !game.done : false}
        />
      ))}
    </div>
  );
}

export default Hand;

