import { useCommand, useGame } from "../../utils/GameContext";
import Card from "../Card";
import "./Hand.css";

interface HandInterface {
  hand: number[];
  isDealer: boolean;
}

function Hand(props: HandInterface) {
  const game = useGame();
  const command = useCommand();

  return (
    <div className="Hand">
      {props.hand?.map((card, i) => (
        <Card
          key={i}
          card={card}
          hide={props.isDealer ? i === 0 && !game.done : false}
        />
      ))}
      <h1 className="Count">
        {props.isDealer && !game.done
          ? command.countHand(props.hand.slice(1))
          : command.countHand(props.hand)}
      </h1>
    </div>
  );
}

export default Hand;

