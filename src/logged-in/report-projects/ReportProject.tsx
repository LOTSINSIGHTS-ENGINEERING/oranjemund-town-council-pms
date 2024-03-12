import React from "react";
import useBackButton from "../../shared/hooks/useBack";
import useTitle from "../../shared/hooks/useTitle";
import ReportProjectTabs from "./ReportProjectTabs";
import "./Reports.scss";

const ReportProject = () => {
  const [selectedTab, setselectedTab] = React.useState("user-tab");

  useTitle("Project Reports");
  useBackButton();

  return (
    <div className="uk-section">
      <div className="uk-container uk-container-large">
        <div className="uk-margin">
          <ReportProjectTabs
            selectedTab={selectedTab}
            setselectedTab={setselectedTab}
          />
        </div>

        <div className="uk-card uk-card-default uk-card-body">
          <h6>Red Emoji :)</h6>
        </div>
      </div>
    </div>
  );
};

export default ReportProject;
