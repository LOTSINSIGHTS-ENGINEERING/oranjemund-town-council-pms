import React from "react";

interface INoDataProps {
  title: string;
  subtitle?: string;
  instruction?: string;
  children?: React.ReactNode;
}
const NoPerformanceData = (props: INoDataProps) => {
  const {
    title,
    subtitle = "There is no data available.",
    instruction = "Please select another one.",
    children,
  } = props;

  return (
    <div className="uk-section uk-section-small">
      <div className="uk-container uk-container-xlarge">
        <div className="no-data uk-padding uk-card uk-card-default uk-card-body uk-text-center">
          <div className="no-data-icon">
            <span data-uk-icon="icon: info; ratio: 3"></span>
          </div>
          <div className="no-data-text uk-margin">
            <h3>{title}</h3>
            <p>
              {subtitle}
              <br />
              {instruction}
            </p>
          </div>
          {children && <div className="no-data-children">{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default NoPerformanceData;
