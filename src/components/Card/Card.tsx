import "./Card.css";

interface CardInterface {
  card: number;
}

function Card(props: CardInterface) {
  const getSuite = (val: number) => {
    switch (Math.round((val - Math.floor(val)) * 10)) {
      case 3:
        return "https://api.iconify.design/mdi:cards-spade.svg?color=%23000000";
      case 2:
        return "https://api.iconify.design/mdi:cards-heart.svg?color=%23ff0000";
      case 1:
        return "https://api.iconify.design/mdi:cards-club.svg?color=%23000000";
      default:
        return "https://api.iconify.design/mdi:cards-diamond.svg?color=%23ff0000";
    }
  };

  const getValue = (val: number) => {
    switch (Math.floor(val)) {
      case 13:
        return "K";
      case 12:
        return "Q";
      case 11:
        return "J";
      case 1:
        return "A";
      default:
        return `${Math.floor(val)}`;
    }
  };

  return (
    <div className="Card">
      <h1 className="Value">{getValue(props.card)}</h1>
      <img className="Suite" src={getSuite(props.card)} alt="" />
    </div>
  );
}

export default Card;

