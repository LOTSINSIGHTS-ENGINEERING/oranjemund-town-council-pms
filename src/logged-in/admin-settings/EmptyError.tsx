import { Fragment } from "react";

interface IProps {
  errorMessage: string;
  textOnly?: boolean;
}
const EmptyError = (props: IProps) => {
  const { errorMessage, textOnly } = props;

  return (
    <Fragment>
      {!textOnly && (
        <div className="empty-error uk-card uk-card-default uk-card-small uk-card-body">
          <p className="uk-text-center">
            {errorMessage} <span>😔</span>
          </p>
        </div>
      )}

      {textOnly && (
        <p className="uk-text-center">
          {errorMessage} <span>😔</span>
        </p>
      )}
    </Fragment>
  );
};

export default EmptyError;
