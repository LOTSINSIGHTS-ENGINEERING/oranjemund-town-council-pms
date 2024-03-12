import { Box, Card } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import MODAL_NAMES from "../../dialogs/ModalName";

import Modal from "../../../shared/components/Modal";



import { IJobCard } from "../../../shared/models/job-card-model/Jobcard";

interface IProp {
  data: IJobCard[];
}

const JobCardGrid = observer(({ data }: IProp) => {
  // const { store, api, ui } = useAppContext();
  // const [loading, setLoading] = useState<boolean>(false);

  // const onUpdate = (jobCards: IJobCard[]) => {
  //   store.jobcard.jobcard.select(jobCards);
  //   showModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  // };
  // const onUpdate = (selectedJobCards: IJobCard[]) => {
  //   const selected =  store.jobcard.jobcard.select(selectedJobCards);
  //   showModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  // };
  
  // const onView = (jobCard: IJobCard) => {
  //   store.jobcard.jobcard.select(jobCard);

  //   showModalFromId(MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL);
  // };

  // const deleteJobCard = async (jobCard: IJobCard) => {
  //   confirmationDialog().then(
  //     async function () {
  //       await api.jobcard.delete(jobCard);
  //       setLoading(true);
  //       window.location.reload();
  //       ui.snackbar.load({
  //         id: Date.now(),
  //         message: "Jobcard Deleted!?.",
  //         type: "success",
  //       });
  //     },
  //     function () {}
  //   );
  //   setLoading(false);
  // };
  // const onView = (jobCards: IJobCard) => {
  //   store.jobCard.select(jobCards);
  // };
  // setTimeout(() => {
  // }, 2000);

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
              }}
            >
              {params.row.urgency}
            </span>
          );
        } else if (params.row.urgency === "Medium") {
          return (
            <span
              style={{
                background: "orange",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.urgency}
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
              }}
            >
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
              }}
            >
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
              }}
            >
              {params.row.status}
            </span>
          );
        } else if (params.row.status === "Not Started") {
          return (
            <span
              style={{
                background: "grey",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
              {params.row.status}
            </span>
          );
        } else if (params.row.status === "Assigned") {
          return (
            <span
              style={{
                background: "blue",
                color: "white",
                padding: "10px",
                width: "100%",
              }}
            >
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
              data-uk-tooltip="Edit Job card"
              // onClick={() => onUpdate(params.row)}
            ></button>
            <button
              className="uk-margin-right uk-icon"
              data-uk-icon="trash"
              data-uk-tooltip="Delete Job card"
              // onClick={() => deleteJobCard(params.row)}
            ></button>
            <button
              className="uk-margin-right uk-icon"
              data-uk-icon="info"
              data-uk-tooltip="View Job card"
              // onClick={() => onView(params.row)}
            ></button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {/* <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary> */}
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id} // Use the appropriate identifier property
          rowHeight={45}
          className="uk-card uk-card-default uk-card-body uk-card-small "
        />
      </Box>
      {/* )} */}

      <Modal modalId={MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL}>
        {/* <EditJobCardModal /> */}
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL}>
        {/* <ViewJobCardModal /> */}
      </Modal>
      <Modal modalId={MODAL_NAMES.EXECUTION.JOBCARDFEEDBACK_MODAL}>
  
      </Modal>
    </>
  );
});

export default JobCardGrid;
