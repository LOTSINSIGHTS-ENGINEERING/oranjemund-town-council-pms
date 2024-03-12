interface AlertProps {
  msg: string;
  children?: any;
  onClose?: () => void;
  type: "danger" | "warning" | "success" | "primary";
}

const Alert = (props: AlertProps) => {
  const { msg, type, children, onClose } = props;

  return (
    <div className={`uk-alert-${type}`} data-uk-alert>
      {onClose && (
        <div className="close" onClick={onClose}>
          <span data-uk-icon="icon: close"></span>
        </div>
      )}
      <p>{msg}</p>
      {children && <>{children}</>}
    </div>
  );
};

interface Props {
  msg: string;
  children?: any;
  onClose?: () => void;
}
export const ErrorAlert = (props: Props) => {
  return (
    <div className="alert uk-margin">
      <Alert {...props} type="danger" />
    </div>
  );
};

export const WarningAlert = (props: Props) => {
  return (
    <div className="alert uk-margin">
      <Alert {...props} type="warning" />
    </div>
  );
};

export const SuccessAlert = (props: Props) => {
  return (
    <div className="alert uk-margin">
      <Alert {...props} type="success" />
    </div>
  );
};

export const PrimaryAlert = (props: Props) => {
  return (
    <div className="alert uk-margin">
      <Alert {...props} type="primary" />
    </div>
  );
};
