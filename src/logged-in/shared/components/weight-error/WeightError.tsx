interface IProps {
  weightError: number;
}
const WeightError = (props: IProps) => {
  const { weightError } = props;
  return (
    <>
      {weightError !== 100 && (
        <div className="weight-error">
          <div className="uk-alert-danger" data-uk-alert>
            <p>
              The weights of all the objectives don't add up to{" "}
              <strong>100%. </strong>
              Currently at
              <strong> {weightError || 0}%.</strong>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default WeightError;
