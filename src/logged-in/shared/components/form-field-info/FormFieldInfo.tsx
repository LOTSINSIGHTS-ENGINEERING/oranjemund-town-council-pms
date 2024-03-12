import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  align?: "align-center" | "";
  children: string;
}
const FormFieldInfo = (props: IProps) => {
  const { align: alignment = "", children } = props;

  const className = `field-info ${alignment} uk-margin-small-left`;

  return (
    <div className={className}>
      <FontAwesomeIcon icon={faInfoCircle} className="icon" size="xs" />
      <p className="description">{children}</p>
    </div>
  );
};

export default FormFieldInfo;
