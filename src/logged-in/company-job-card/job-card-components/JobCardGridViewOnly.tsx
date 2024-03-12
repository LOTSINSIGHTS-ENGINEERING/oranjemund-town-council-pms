import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
// import EditJobCardModal from "../EditJobCardModal";
// import ViewJobCardModal from "../ViewJobCardModal";
// import JobcardFeedbackModal from "../JobcardFeedbackModal";
import MODAL_NAMES from "../../dialogs/ModalName";
import showModalFromId from "../../../shared/functions/ModalShow";
import Modal from "../../../shared/components/Modal";
import { IJobCard } from "../../../shared/models/job-card-model/Jobcard";

interface IProp {
  data: IJobCard[];
}


const JobCardGridViewOnly = observer(({ data }: IProp) => {
 
 
//   //   const me = store.user.;
//   const [loading, setLoading] = useState(false);
//   const { api, store } = useAppContext();
//   const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });
//   const jobC = store.jobCard.all.map((job) => {
//     return job.asJson;
//   });

//   const onUpdate = (jobCards: IJobCard) => {
//     store.jobCard.select(jobCards);
//     const myJobcard = store.jobCard.selected;
//     console.log("console jobcard", myJobcard);
//     showModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
//   };

//   const onView = (jobCard: IJobCard) => {
//     store.jobCard.select(jobCard);

//     showModalFromId(MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL);
//   };
//   const onFeedback = (jobCard: IJobCard) => {
//     store.jobCard.select(jobCard);

//     showModalFromId(MODAL_NAMES.EXECUTION.JOBCARDFEEDBACK_MODAL);
//   };
  


// const handleAcknowledge = async (selectedJobCard: IJobCard) => {
//   // Toggle the acknowledged status of the selected job card
//   const updatedJobCard = {
//     ...selectedJobCard,
//     acknowledged: !selectedJobCard.acknowledged,
//   };

//   // Update the jobCard state
//   setJobCard(updatedJobCard);

//   try {
//     // Call your update function or dispatch an action to update the job card
//     await update(updatedJobCard);
//     // updateJobCardFunction(updatedJobCard);
//   } catch (error) {
//     // Handle the error appropriately
//     console.error("Error updating job card:", error);
//   }
// };


//   const update = async (jobCard: IJobCard) => {
//     try {
//       await api.jobcard.update(jobCard);
//     } catch (error) {
//       // Handle error appropriately
//     }
//   };

  // useEffect(() => {
  //   const getJobcards = async () => {
  //     await api.jobcard.getAll();
  //   };
  //   getJobcards();
  // }, [api.jobcard]);

  const columns: GridColDef[] = [
    {
      field: "jobDescription",
      headerName: "Descrption",
      flex: 1,
    },
    {
      field: "objectives",
      headerName: "Objective",
      flex: 1,
    },
    {
      field: "dateIssued",
      headerName: "Date Issued",
      flex: 1,
    },
    {
      field: "dueDate",
      headerName: "Date Due",
      flex: 1,
    },
    {
      field: "urgency",
      headerName: "Urgency",
      flex: 1,
      renderCell: (params) => {
        if (params.row.urgency === "High") {
          return (
            <span
              style={{
                background: "red",
                color: "white",
                padding: "10px",
                width: "100%",
              }}>
              {params.row.urgency}
            </span>
          );
        } else if (params.row.urgency === "Medium") {
          return (
            <span
              style={{
                background: "amber",
                color: "white",
                padding: "10px",
                width: "100%",
              }}>
              {params.row.status}
            </span>
          );
        } else if (params.row.urgency === "Low") {
          return (
            <span
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                width: "100%",
              }}>
              {params.row.urgency}{" "}
            </span>
          );
        }
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        if (params.row.status === "Completed") {
          return (
            <span
              style={{
                background: "green",
                color: "white",
                padding: "10px",
                width: "100%",
              }}>
              {params.row.status}
            </span>
          );
        } else if (params.row.status === "In Progress") {
          return (
            <span
              style={{
                background: "orange",
                color: "white",
                padding: "10px",
                width: "100%",
              }}>
              {params.row.status}
            </span>
          );
        }else if (params.row.status === "Not Started") {
          return (
            <span
              style={{
                background: "grey",
                color: "white",
                padding: "10px",
                width: "100%",
              }}>
              {params.row.status}
            </span>
          );} else if (params.row.status === "Assigned") {
          return (
            <span
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                width: "100%",
              }}>
              {params.row.status}{" "}
            </span>
          );
        }
      },
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <div>
            <button
              className="uk-margin-right uk-icon"
              data-uk-icon="info"
              // onClick={() => onFeedback(params.row)}
              ></button>

            {/* {params.row.acknowledged ? (
              // Render button when acknowledged is true
              <button
                className="btn btn-secondary"
                onClick={() => handleAcknowledge(params.row)}>
                <span className="uk-margin-small-right uk-icon-check"></span>
                Acknowledged
              </button>
            ) : (
              // Render button when acknowledged is false
              <button
                className="btn btn-primary"
                onClick={() => handleAcknowledge(params.row)}>
                <span className="uk-margin-small-right uk-icon-warning"></span>
                Acknowledge
              </button>
            )} */}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id} // Use the appropriate identifier property
          rowHeight={45}
          className="uk-card uk-card-default uk-card-body uk-card-small "
        />
      </Box>
      <Modal modalId={MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL}>
        {/* <EditJobCardModal /> */}
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL}>
        {/* <ViewJobCardModal /> */}
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.JOBCARDFEEDBACK_MODAL}>
        {/* <JobcardFeedbackModal /> */}
      </Modal>
    </>
  );
});

export default JobCardGridViewOnly;
