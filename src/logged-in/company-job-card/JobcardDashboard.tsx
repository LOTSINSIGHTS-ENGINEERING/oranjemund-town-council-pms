import { useAppContext } from "../../shared/functions/Context";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import showModalFromId from "../../shared/functions/ModalShow";
import MODAL_NAMES from "../dialogs/ModalName";
import { useExcelLikeFilters } from "../../shared/functions/AdvancedFilter";
import "datatables.net";
import * as $ from "jquery";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/buttons.print.mjs";
import "datatables.net-responsive-bs4";
import "datatables.net-searchbuilder-bs4";
import "datatables.net-searchpanes-bs4";
import "datatables.net-staterestore-bs4";
import "../company-job-card/styles/JobCardDashBoard.scss";

import useBackButton from "../../shared/hooks/useBack";
import useTitle from "../../shared/hooks/useTitle";
import JobCardGrid from "./job-card-components/JobCardGrid";


function JobcardDashboard() {
  useTitle("Job Card");
  useBackButton();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("JobCards");
  useExcelLikeFilters();

 

  //  const [jobCardData, setJobCardData] = useState([]);

  //  useEffect(() => {
  //    // Load or update data when the component mounts
  //    loadJobCardData();
  //  }, []); // Empty dependency array means this effect runs only on mount

  //  useEffect(() => {
  //    // This effect runs when store.jobCard.all changes
  //    console.log("Job cards updated", store.jobCard.all);
  //    loadJobCardData();
  //  }, [store.jobCard.all]); // Runs when store.jobCard.all changes

  //  const loadJobCardData = () => {
  //    const JobCard = store.jobCard.all.map((job) => job.asJson);
  //    setJobCardData(JobCard);
  //  };
// const jobs = 

//   const [searchText, setSearchText] = useState(""); // Initialize a state variable for search text

  // const onViewJobCard = (jobCard: IJobCard) => {
  //   store.jobCard.select(jobCard);
  // };

  // const onEditJobCard = (jobCard: IJobCard) => {
  //   // const selectedJobCard = store.jobCard.getById(id);
  //   store.jobCard.select(jobCard);
  //   // console.log("this is your jobcard id ", selectedJobCard?.asJson);

  //   showModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  // };

  // const onDelete = (jobCard: IJobCard) => {
  //   deleteJobCard(jobCard); // Call the Delete function
  // };

  // const deleteJobCard = async (jobCard: IJobCard) => {
  //   try {
  //     await api.jobcard.delete(jobCard);
  //   } catch (error) {
  //     console.log("Error" + error);

  //     // Handle error appropriately
  //   }
  // };

  //Card stats code
  // const inProgressJobCards = jobs.filter(
  //   (card) => card.status === "In Progress"
  // );
  // const numberOfInProgressJobCards = inProgressJobCards.length;
  // const notStartedJobCards = jobs.filter(
  //   (card) => card.status === "Not Started"
  // );
  // const numberOfNotStartedJobCards = notStartedJobCards.length;
  // const completed = jobs.filter(
  //   (card) => card.status === "Completed"
  // );
  // const numberOfCompletedJobCards = completed.length;
  //end here


  
// useEffect(() => {
//   const loadData = async () => {
   
//     try {
//       await api.jobcard.getAll();
     
//     } catch (error) {
//       // Handle error
//     }
//   };

  // loadData();

  // No need for $(document).ready() or DataTable initialization here

 


  // map through users to get the user Name

 

  return (
    <>
      <div
        className="uk-container uk-container-xlarge"
        style={{ paddingTop: "40px" }}>
        {/* Create Jobcard Button uk-position-top-right*/}
        <div className="uk-flex">
          <div
            className="uk-grid uk-child-width-1@l uk-margin-bottom uk-flex-column uk-width-2-3"
            style={{ width: "100%" }}
            uk-grid>
            {/* Section 1 */}
            <div>
              <div className="uk-card uk-card-default uk-card-body uk-card-small uk-width-1 uk-flex uk-flex-center">
                {/*Card Informatics */}
                <div
                  className="uk-width-1-2 uk-flex-column uk-flex-center uk-margin"
                  style={{ width: "100%" }}>
                  <div
                    className="info-card info-card--success  uk-card uk-card-default uk-card-small uk-margin "
                    style={{ marginTop: "20px", marginLeft: "10px" }}>
                    <div
                      className="icon"
                      // data-tooltip="View all measures in my scorecard"
                    >
                      <span>✓</span>
                    </div>
                    <div className=" info-body uk-card-body">
                      <h5 className="title uk-margin">Job Cards Completed </h5>
                      <h5 className="title uk-margin">
                        {/* {numberOfCompletedJobCards} */}
                      </h5>
                    </div>
                  </div>
                  <div
                    className="info-card info-card--warning  uk-card uk-card-default uk-card-small uk-margin "
                    style={{ marginLeft: "10px" }}>
                    <div
                      className="icon "
                      // data-tooltip="View all measures in my scorecard"
                    >
                      <span>↺</span>
                    </div>
                    <div className=" info-body uk-card-body">
                      <h5 className="title uk-margin">
                        Job Cards In Progress{" "}
                      </h5>
                      <h5 className="title uk-margin">
                        {/* {numberOfInProgressJobCards} */}
                      </h5>
                    </div>
                  </div>
                  <div
                    className="info-card info-card--danger  uk-card uk-card-default uk-card-small uk-margin "
                    style={{ marginLeft: "10px" }}>
                    <div
                      className="icon"
                      // data-tooltip="View all measures in my scorecard"
                    >
                      <span>❗</span>
                    </div>
                    <div className=" info-body uk-card-body">
                      <h5 className="title uk-margin">
                        Job Cards Not Started{" "}
                      </h5>
                      <h5 className="title uk-margin">
                        {/* {numberOfNotStartedJobCards} */}
                      </h5>
                    </div>
                  </div>
                </div>
                <div
                  className="uk-flex uk-flex-center uk-width-1-2 uk-card uk-card-muted uk-card-body"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: "10px",
                    //alignItems: "center",
                  }}>
                  {/* <JobCartPieChart /> */}
                </div>
              </div>
              <div className="dashboard--tabs uk-margin-top uk-margin-bottom uk-width-1">
                <ul className="kit-tabs" data-uk-tab>
                  <li className={"Chart"} onClick={() => setTab("JobCards")}>
                    <a href="void(0)">Job Cards</a>
                  </li>
                  <li
                    className={"BarGraph"}
                    onClick={() => setTab("NumberBar")}>
                    <a href="void(0)"> Job Card Numbers</a>
                  </li>
                </ul>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "right",
                    width: "100%",
                  }}></div>
              </div>
              <div className="uk-card-default uk-card-small uk-card-body">
                <div
                  className="uk-align-center uk-card uk-card-default uk-flex-column uk-flex-center"
                  style={{ height: "100%", width: "100%" }}>
                  {tab === "NumberBar" ? (
                    <div
                      style={{ padding: "20px", width: "100%", height: "70%" }}>
                      {/* <JobCartGraph /> */}
                    </div>
                  ) : tab === "JobCards" ? (
                    <div>
                      {/*Job card Table*/}
                      <div
                        className="uk-align-center uk-card-small uk-card-body uk-overflow-auto"
                        style={{
                          paddingRight: "4%",
                          paddingLeft: "4%",
                          margin: "0px",
                        }}>
                        <h4 className="uk-heading">All Job Cards</h4>
                        {/* <JobCardGrid data={JobCard } /> */}
                      </div>
                    </div>
                  ) : (
                    //: tab === "JobCardCost" ? (
                    //<div>{/* Your else content goes here */}</div>
                    //s)
                    <div>{/* Your else content goes here */}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobcardDashboard;

