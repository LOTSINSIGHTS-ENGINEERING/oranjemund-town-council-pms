const AgreementError = () => {
  return (
    <div className="agreement-error">
      <div className="uk-alert-danger" data-uk-alert>
        <p>
          You've empty objectives in your scorecard. Please add{" "}
          <strong>Measures/KPIs</strong> to all objectives.
        </p>
      </div>
    </div>
  );
};

export default AgreementError;
