import { Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId, {
  hideModalFromId,
} from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import EditJobCardModal from "../EditJobCardModal";
import Modal from "../../../shared/components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import ViewJobCardModal from "../ViewJobCardModal";
import { IJobCard } from "../../../shared/models/job-card-model/Jobcard";

interface IProp {
  data: IJobCard[];
}

const DashboardGrid = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  //   const me = store.user.;

  const jobC = store.jobcard.jobcard.all.map((job) => {
    return job.asJson;
  });

  const onUpdate = (jobCards: IJobCard) => {
    store.jobcard.jobcard.select(jobCards);
    const myJobcard = store.jobcard.jobcard.selected;
    console.log("console jobcard", myJobcard);
    showModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  };

  const onView = (jobCard: IJobCard) => {
    store.jobcard.jobcard.select(jobCard);

    showModalFromId(MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL);
  };

  const onDelete = (jobCard: IJobCard) => {
    deleteJobCard(jobCard); // Call the Delete function
  };

  const deleteJobCard = async (jobCard: IJobCard) => {
    try {
      await api.jobcard.jobcard.delete(jobCard.id);
    } catch (error) {
      console.log("Error" + error);

      // Handle error appropriately
    }
  };
  // const onView = (jobCards: IJobCard) => {
  //   store.jobCard.select(jobCards);
  // };
  const onExtend = (jobCards: IJobCard) => {
    store.jobcard.jobcard.select(jobCards);
    // showModalFromId(DIALOG_NAMES.MAINTENANCE.EXTEND_WINDOW_PERIOD);
  };

  useEffect(() => {
    const getJobcards = async () => {
      await api.jobcard.jobcard.getAll();
    };
    getJobcards();
  }, [api.jobcard]);

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
        if (params.row.status === "High") {
          return (
            <span
              style={{
                background: "red",
                color: "white",
                padding: "10px",
                width: "100%",
              }}>
              {params.row.status}
            </span>
          );
        } else if (params.row.status === "Medium") {
          return (
            <span
              style={{
                background: "amber",
                color: "black",
                padding: "10px",
                width: "100%",
              }}>
              {params.row.status}
            </span>
          );
        } else if (params.row.status === "Low") {
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
              onClick={() => onUpdate(params.row)}>
              {" "}
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="uk-margin-right uk-icon"
            
              onClick={() => onDelete(params.row)}>
              {" "}
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button
              className="uk-margin-right uk-icon"
            
              onClick={() => onView(params.row)}>
              {" "}
              <FontAwesomeIcon icon={faEye} />
            </button>

           
           
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
        <EditJobCardModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL}>
        <ViewJobCardModal />
      </Modal>
    </>
  );
});

export default DashboardGrid;
