import { useCommand, useModal } from "../../utils/GameContext";
import "./Modal.css";

function Modal() {
  const modal = useModal();
  const command = useCommand();

  const handleCloseModal = () => {
    const newModal = JSON.parse(JSON.stringify(modal));
    newModal.modalOn = false;
    command.setModal(newModal);
  };

  const win = modal.payout > modal.bet;
  const lose = modal.payout < modal.bet;

  return modal.modalOn ? (
    <div className="Modal" onClick={() => handleCloseModal()}>
      <div
        className="Inner"
        style={
          win
            ? { color: "green" }
            : lose
            ? { color: "red" }
            : { color: "orange" }
        }
      >
        <h1>{`You ${win ? "WIN!" : lose ? "LOSE!" : "PUSH!"}`}</h1>
        <h1>{`Net Gain: ${
          modal.payout - modal.bet > 0
            ? `+${modal.payout - modal.bet}`
            : modal.payout - modal.bet
        }`}</h1>
      </div>
    </div>
  ) : (
    <div />
  );
}

export default Modal;
