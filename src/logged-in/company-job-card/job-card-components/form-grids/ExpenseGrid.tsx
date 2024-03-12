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
import { IOtherExpense } from "../../../../shared/models/job-card-model/OtherExpense";


interface IProp {
  data: IOtherExpense[];
}

const ExpensesGrid = observer(({ data }: IProp) => {
  
  // const { store, api } = useAppContext();
  
  // // const otherExpenses = store.jobcard.otherExpense.all.map((job) => {
  // //   return job.asJson;
  // // });
  // // const jc = store.jobcard.otherExpense.map((job) => {
  // //   return job.asJson;});

  // const onUpdate = (expense: IOtherExpense) => {
  //   // store.jobcard.otherExpense.select(expense);
  //   // const myJobcard = store.jobCard.selected;
  //   // console.log("console jobcard", myJobcard);
  //   store.jobcard.otherExpense.select(expense);
  //   showModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  // };

  //  const onView = (expense: IOtherExpense) => {
  //   //  store.jobCard.select(jobCard);
  //    showModalFromId(MODAL_NAMES.EXECUTION.VIEWJOBCARD_MODAL);
  //  };

  //   const onFeedback = (expense: IOtherExpense) => {
  //     // store.jobCard.select(jobCard);

  //     showModalFromId(MODAL_NAMES.EXECUTION.JOBCARDFEEDBACK_MODAL);
  //   };

    //deleteExpense
  // const onDelete = (expense: IOtherExpense) => {
  //   deleteJobCard(expense); // Call the Delete function
  // };

  // const deleteJobCard = async (expense: IOtherExpense) => {
  //   try {
  //     const confirmed = window.confirm("Are you sure you want to delete this job card?");

  //   if (confirmed && expense?) {
  //     await api.jobcard.otherExpense.delete();

  //   //   swal({
  //   //     icon: "success",
  //   //     title: "Job Card Deleted!",
  //   //     text: "Your job card has been successfully deleted.",
  //   //   });
  //   // } else {
  //   //   swal({
  //   //     icon: "info",
  //   //     title: "Deletion Canceled",
  //   //     text: "Job Card deletion has been canceled.",
  //   //   });
  //   }
  //   } catch (error) {
  //     console.log("Error" + error);

  //     // Handle error appropriately
  //   }
  // };
  // const onView = (jobCards: IJobCard) => {
  //   store.jobCard.select(jobCards);
  // };
  // const onExtend = (jobCards: IJobCard) => {
  //   store.jobCard.select(jobCards);
  //   // showModalFromId(DIALOG_NAMES.MAINTENANCE.EXTEND_WINDOW_PERIOD);
  // };

  const columns: GridColDef[] = [
    {
      field: "description",
      headerName: "Descrption",
      flex: 1,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
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
              >
              </button>
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
    noRowsLabel: 'No Expenses',
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

export default ExpensesGrid;
