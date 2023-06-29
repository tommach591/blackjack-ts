import "./Button.css";

interface ButtonInterface {
  name: string;
  active: boolean;
  handleOnClick: any;
  params: any;
}

function Button(props: ButtonInterface) {
  return (
    <div
      className="Button"
      onClick={() => {
        if (props.active) props.handleOnClick(props.params);
      }}
      style={props.active ? { background: "white" } : { background: "gray" }}
    >
      <h1>{props.name}</h1>
    </div>
  );
}

export default Button;
