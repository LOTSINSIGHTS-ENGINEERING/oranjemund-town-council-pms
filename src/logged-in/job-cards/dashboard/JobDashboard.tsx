import { faCheckCircle, faClock, faEdit, faEye, faFilter, faTasks, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/functions/Context";
import {
  IJobCard,
  defaultJobCard,
} from "../../../shared/models/job-card-model/Jobcard";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import EditJobCardModal from "../EditJobCardModal";
import Modal from "../../../shared/components/Modal";
import "./Dashboard.css"; // Your custom styles
import ViewJobCardModal from "../ViewJobCardModal";
import { IClient, defaultClient } from "../../../shared/models/job-card-model/Client";
import DashboardGrid from "../grids/dashboardGrid";
import RecentJobCards from "../recent-job-cards/RecentJobCards";
import swal from "sweetalert";
import DashboardCard from "./dashboard-card/DashboardCard";
import DeductionSubmissionCard from "../recent-job-cards/RecentJobCards";


const CompanyJobCard = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState<string>("JobCards");
  const [client, setClient] = useState<IClient>({ ...defaultClient });
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });



  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  // const onViewJobCard = (jobCard: IJobCard) => {
  //   store.jobcard.jobcard.select(jobCard);

  //   showModalFromId(MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL);
  // };


  // const onEditJobCard = (jobCard: IJobCard) => {
  //   const currentclient = store.jobcard.client.selected;

  //   store.jobcard.jobcard.select(jobCard);
    

  //   showModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  // };
  
  // const onDelete = (jobCard: IJobCard) => {
  //   deleteJobCard(jobCard); // Call the Delete function
  // };

  // const deleteJobCard = async (jobCard: IJobCard) => {
  //   try {
  //     await api.jobcard.jobcard.delete(jobCard.id);
  //   } catch (error) {
  //     console.log("Error" + error);

  //     // Handle error appropriately
  //   }
  // };

  // Define a function to handle search text input
   const Jobcards = store.jobcard.jobcard.all.map((job) => {
     return job.asJson;
   });


    const handleAcknowledge = async (jobCard: IJobCard) => {
      // If user clicks "Record", proceed with acknowledgment
        try {
          const updatedJobCard: IJobCard = {
            ...jobCard,
            acknowledged: true,
          };

          // Assuming that `api.jobcard.jobcard.update` method accepts the job card ID and the updated data
          await api.jobcard.jobcard.update(updatedJobCard);

          // Call any additional logic or UI updates as needed after a successful acknowledgment

          // Optionally, show a success message
          swal({
            title: "Acknowledged!",
            icon: "success",
          });
        } catch (error) {
          console.log("Error: " + error);
          // Handle error appropriately
        }
     
      
    };
    

  useEffect(() => {

    const loadData = async () => {
      setLoading(true);
      try {
        await api.jobcard.jobcard.getAll();
      
        setLoading(false);
      } catch (error) {}
    };
    loadData();
  }, [api.jobcard]);

  if (loading) return <LoadingEllipsis />;

  return (
    <ErrorBoundary>
      <div className="uk-container uk-container-xlarge">
        {/* <h1>Job Card Dashboard</h1> */}

        {/* Job Cards Statistics */}
        {/* <div className="uk-flex uk-flex-center uk-child-width-1-3@s">
          <div>
            <div className="uk-card uk-card-default uk-card-body ">
              <h3 className="uk-card-title">
                <FontAwesomeIcon icon={faTasks} /> Total Job Cards
              </h3>
              <p className="dashboard-stat">10</p>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default uk-card-body uk-background-warning">
              <h3 className="uk-card-title">
                <FontAwesomeIcon icon={faClock} /> Pending Job Cards
              </h3>
              <p className="dashboard-stat">5</p>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-default uk-card-body uk-background-success">
              <h3 className="uk-card-title">
                <FontAwesomeIcon icon={faCheckCircle} /> Completed Job Cards
              </h3>
              <p className="dashboard-stat">5</p>
            </div>
          </div>
        </div> */}
        <div className="uk-child-width-expand" data-uk-grid>
          <div className="uk-child-width-expand">
            <DashboardCard
              cardValue={0}
              cardTitle="Total Job Cards"
              cardLink="/members"
              cardColour={{ background: "#5CC858" }}
            />
          </div>
          <div className="">
            <DashboardCard
              cardValue={0}
              cardTitle="Pending Job Cards"
              cardLink="/members/terminated"
              cardColour={{ background: "#FF326E" }}
            />
          </div>
          <div className="">
            <DashboardCard
              cardValue={0}
              cardTitle=" Completed Job Cards"
              cardLink="/members"
              cardColour={{ background: "#F97A53" }}
            />
          </div>
        
        
        </div>
        <div className="uk-width-1-2">
          <div className="display-label">
            <h4 className="main-title-alt">Recent Job Card List Submissions</h4>
            <div>
              <DeductionSubmissionCard jobcards={Jobcards} />
            </div>
          </div>
        </div>
        <div>
          <ul className="uk-tab" data-uk-tab="true">
            <li className={activeTab === 0 ? "uk-active" : ""}>
              <a href="#" onClick={() => handleTabChange(0)}>
                All Job Cards
              </a>
            </li>
            <li className={activeTab === 1 ? "uk-active" : ""}>
              <a href="#" onClick={() => handleTabChange(1)}>
                Not Acknowledged Job Cards
              </a>
            </li>
            {/* Add more tabs as needed */}
          </ul>

          <ul className="uk-switcher uk-margin" data-uk-switcher="true">
            <li className={activeTab === 0 ? "uk-active" : ""}>
              <DashboardGrid data={Jobcards} />
            </li>
            <li className={activeTab === 1 ? "uk-active" : ""}>
              <p>Second Tab</p>
              <DashboardGrid data={Jobcards} />
            </li>
            {/* Add more table content as needed */}
          </ul>
        </div>
      </div>

      {/* <table className="uk-table uk-table-divider custom-table">
     
        <thead>
          <tr>
            <th className="uk-text-bold">Unique ID</th>
            <th className="uk-text-bold">Description</th>
            <th className="uk-text-bold">Status</th>
            <th className="uk-text-bold">Date Issued</th>
            <th className="uk-text-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobcards.map((jobCard) => (
            <tr key={jobCard.asJson.id}>
              <td>{jobCard.asJson.jobDescription}</td>
              <td>{jobCard.asJson.objectives}</td>
              <td>{jobCard.asJson.status}</td>
              <td>{jobCard.asJson.dateIssued}</td>
              <td>
                <button onClick={() => onEditJobCard(jobCard.asJson)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => onViewJobCard(jobCard.asJson)}>
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button onClick={() => onDelete(jobCard.asJson)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

      <Modal modalId={MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL}>
        <ViewJobCardModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL}>
        <EditJobCardModal
        // id={jobCard.id}
        />
      </Modal>
    </ErrorBoundary>
  );
});

export default CompanyJobCard;
