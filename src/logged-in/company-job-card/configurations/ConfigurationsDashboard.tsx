import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import { useNavigate, useParams } from "react-router-dom";
// import TeamMembers from "./team-members/TeamMembers";
// import JobTypes from "./job-types/JobTypes";
const ConfigurationsDashboard = () => {
  const navigate = useNavigate();
const {id}=useParams()
  function handleNavigate(route: string) {
    navigate(route);
  }

  return (
    <div className="uk-flex uk-card uk-card-muted  uk-margin uk-padding">
      {/* <div
        className=" uk-card uk-card-default uk-card-body uk-flex-center uk-flex uk-padding uk-margin uk-width-2-6"
        style={{ marginRight: "4px", marginTop: "20px" }}>
        <span>
          <BuildCircleIcon />
        </span>
        <h5
          className="uk-heading"
          style={{ marginTop: "0px", marginLeft: "2px" }}>
          Team Members
        </h5>

      
      </div> */}

      {/* <div
        className=" uk-card uk-card-default uk-card-body uk-flex-center uk-flex uk-padding uk-margin uk-width-2-6"
        style={{ marginRight: "4px" }}>
        <span
          onClick={() =>
            handleNavigate("company-job-card/configurations/team-members")
          }>
          <BuildCircleIcon />
        </span>
        <h5
          className="uk-heading"
          style={{ marginTop: "0px", marginLeft: "2px" }}>
          Job Type
        </h5>
      </div> */}
      {/* <div
        className=" uk-card uk-card-default uk-card-body uk-flex-center uk-flex uk-padding uk-margin uk-width-2-6"
        style={{ marginRight: "4px" }}>
        <span
          onClick={() =>
            handleNavigate("company-job-card/configurations/team-members")
          }>
          <BuildCircleIcon />
        </span>
        <h5
          className="uk-heading"
          style={{ marginTop: "0px", marginLeft: "2px" }}>
          Team Type
        </h5>
      </div> */}
      {/* <div
        className=" uk-card uk-card-default uk-card-body uk-flex-center uk-flex uk-padding uk-margin uk-width-2-6"
        style={{ marginRight: "4px" }}>
        <span
          onClick={() =>
            handleNavigate("company-job-card/configurations/team-members")
          }>
          <BuildCircleIcon />
        </span>
        <h5
          className="uk-heading"
          style={{ marginTop: "0px", marginLeft: "2px" }}>
          Sub-Contractors
        </h5>
      </div> */}
      {/* <div
        className=" uk-card uk-card-default uk-card-body uk-flex-center uk-flex uk-padding uk-margin uk-width-2-6"
        style={{ marginRight: "4px" }}>
        <span
          onClick={() =>
            handleNavigate("company-job-card/configurations/team-members")
          }>
          <BuildCircleIcon />
        </span>
        <h5
          className="uk-heading"
          style={{ marginTop: "0px", marginLeft: "2px" }}>
          Materials
        </h5>
      </div> */}
      {/* <div
        className=" uk-card uk-card-default uk-card-body uk-flex-center uk-flex uk-padding uk-margin uk-width-2-6"
        style={{ marginRight: "4px" }}>
        <span
          onClick={() =>
            handleNavigate("company-job-card/configurations/team-members")
          }>
          <BuildCircleIcon />
        </span>
        <h5
          className="uk-heading"
          style={{ marginTop: "0px", marginLeft: "2px" }}>
          Tools
        </h5>
      </div> */}
      <p>Job Card ID: {id}</p>
      {/* <TeamMembers />

      <JobTypes /> */}
    </div>
  );
};
export default ConfigurationsDashboard;
