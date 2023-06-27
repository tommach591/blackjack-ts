import Card from "../Card";
import "./Hand.css";

interface HandInterface {
  hand: number[];
}

function Hand(props: HandInterface) {
  return (
    <div className="Hand">
      {props.hand?.map((card, i) => (
        <Card key={i} card={card} />
      ))}
    </div>
  );
}

export default Hand;

