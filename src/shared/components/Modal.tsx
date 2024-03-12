import ReactDOM from "react-dom";
import ErrorBoundary from "./error-boundary/ErrorBoundary";

interface Props {
  modalId: string;
  cssClass?: string;
  children: any;
}
const Modal = (props: Props) => {
  const { modalId, cssClass, children } = props;
  const newClass = cssClass ? cssClass : "";

  const modal = (
    <ErrorBoundary>
      <div
        id={modalId}
        className={`custom-modal-style ${newClass}`}
        data-uk-modal
        data-bg-close={false} // Close the modal when the background is clicked.
      // data-stack // Stack modals, when more than one is open. By default, the previous modal will be hidden.
      >
        {children}
      </div>
    </ErrorBoundary>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default Modal;
