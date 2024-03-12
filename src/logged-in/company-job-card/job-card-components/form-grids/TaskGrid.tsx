import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId, {
  hideModalFromId,
} from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../dialogs/ModalName";

import Modal from "../../../../shared/components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";


import swal from "sweetalert";
import { ITask } from "../../../../shared/models/job-card-model/Task";


interface IProp {
  data: ITask[];
}

const TaskGrid = observer(({ data }: IProp) => {
  // const { store, api } = useAppContext();
  // const tasks: ITask[] = data.flatMap((jobCard) => jobCard.tasks);
  // //   const me = store.user.;

  // const jobC = store.jobCard.all.map((job) => {
  //   return job.asJson;
  // });
  // // Assuming tasks is an array of rows
  // const tasksWithIds = tasks.map((task, index) => ({
  //   ...task,
  //   id: index + 1, // You can use a more meaningful identifier if available
  // }));
  // const onUpdate = (jobCards: IJobCard) => {
  //   store.jobCard.select(jobCards);
  //   const myJobcard = store.jobCard.selected;
  //   console.log("console jobcard", myJobcard);
  //   showModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  // };

  // const onView = (jobCard: IJobCard) => {
  //   store.jobCard.select(jobCard);

  //   showModalFromId(MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL);
  // };
  // const onFeedback = (jobCard: IJobCard) => {
  //   store.jobCard.select(jobCard);

  //   showModalFromId(MODAL_NAMES.EXECUTION.JOBCARDFEEDBACK_MODAL);
  // };

  // const onDelete = (jobCard: IJobCard) => {
  //   deleteJobCard(jobCard); // Call the Delete function
  // };

  // const deleteJobCard = async (jobCard: IJobCard) => {
  //   try {
  //     const confirmed = window.confirm(
  //       "Are you sure you want to delete this job card?"
  //     );

  //     if (confirmed && jobCard) {
  //       await api.jobcard.delete(jobCard);

  //       swal({
  //         icon: "success",
  //         title: "Job Card Deleted!",
  //         text: "Your job card has been successfully deleted.",
  //       });
  //     } else {
  //       swal({
  //         icon: "info",
  //         title: "Deletion Canceled",
  //         text: "Job Card deletion has been canceled.",
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Error" + error);

  //     // Handle error appropriately
  //   }
  // };
  // // const onView = (jobCards: IJobCard) => {
  // //   store.jobCard.select(jobCards);
  // // };
  // const onExtend = (jobCards: IJobCard) => {
  //   store.jobCard.select(jobCards);
  //   // showModalFromId(DIALOG_NAMES.MAINTENANCE.EXTEND_WINDOW_PERIOD);
  // };

  // useEffect(() => {
  //   const getJobcards = async () => {
  //     await api.jobcard.getAll();
  //   };
  //   getJobcards();
  // }, [api.jobcard]);

  const columns: GridColDef[] = [
    {
      field: "description",
      headerName: "Descrption",
      flex: 1,
    },
    {
      field: "assignedTo",
      headerName: "Assigned To",
      flex: 1,
    },
    {
      field: "estimatedTime",
      headerName: "Estimated Duration",
      flex: 1,
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
                color: "black",
                padding: "10px",
                width: "100%",
              }}>
              {params.row.status}
            </span>
          );
        } else if (params.row.status === "Assigned") {
          return (
            <span
              style={{
                background: "grey",
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
              data-uk-icon="pencil"
              // onClick={() => onUpdate(params.row)}
              ></button>
            <button
              className="uk-margin-right uk-icon"
              data-uk-icon="trash"
              // onClick={() => onDelete(params.row)}
              ></button>
            <button
              className="uk-margin-right uk-icon"
              data-uk-icon="info"
              data-uk-tooltip="Add Feedback and Comments"
              // onClick={() => onView(params.row)}
              ></button>
          </div>
        );
      },
    },
  ];
  const customLocaleText = {
    noRowsLabel: "No Tasks",
  };
  return (
    <>
      <Box sx={{ height: 300 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id} // Use the appropriate identifier property
          rowHeight={45}
          className="uk-card uk-card-default uk-card-body uk-card-small "
          localeText={customLocaleText}
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

export default TaskGrid;
