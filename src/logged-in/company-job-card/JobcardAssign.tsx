import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { observer } from "mobx-react-lite";
import { useState, useEffect, FormEvent } from "react";
import SingleSelect from "../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../shared/functions/Context";

import swal from "sweetalert";
import { CustomCloseAccordion } from "../../shared/components/accordion/Accordion";

import TaskGrid from "./job-card-components/form-grids/TaskGrid";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId from "../../shared/functions/ModalShow";
import Modal from "../../shared/components/Modal";
import ToolGrid from "./job-card-components/form-grids/ToolsGrid";

import MaterialsGrid from "./job-card-components/form-grids/MaterialsGrid";
import LabourGrid from "./job-card-components/form-grids/LabourGrid";
import ExpensesGrid from "./job-card-components/form-grids/ExpenseGrid";
import ToolsGrid from "./job-card-components/form-grids/ToolsGrid";
import { IJobCard, defaultJobCard } from "../../shared/models/job-card-model/Jobcard";
import { ITask, defaultTask } from "../../shared/models/Task";
import { IPrecaution, IStandard, defaultPrecaution, defaultStandard } from "../../shared/models/job-card-model/PrecautionAndStandard";
import { ITool, defaultTool } from "../../shared/models/job-card-model/Tool";

const AssignComponent: React.FC<{ onNextStep: () => void }> = observer(
  ({ onNextStep }) => {
    const [loading, setLoading] = useState(false);
    const { api, store } = useAppContext();
    const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });
    const [newTask, setNewTask] = useState<ITask>({ ...defaultTask });
  const [standard, setStandard] = useState<IStandard>({ ...defaultStandard });
  const [precaution, setPrecaution] = useState<IPrecaution>({
  ...defaultPrecaution
  });
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        if (jobCard) {
          const updatedJobCard = {
            ...jobCard,
            status: "Not Started",
          };
          // await api.jobcard.update(updatedJobCard);
        
          onNextStep();
          swal({
            icon: "success",
            title: "Job Card Allocated!",
            text: "Your job card has been successfully allocated.",
          });
        } else {
          swal({
            icon: "error",
            title: "Error!",
            text: "Job Card could not be allocated.",
          });
        }
      } catch (error) {
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };
    const update = async (jobCard: IJobCard) => {
      try {
        // await api.jobcard.update(jobCard);
      } catch (error) {
        // Handle error appropriately
      }
    };

    //new code
 
  
    const jobs = store.jobcard.jobcard
     
    // const tasks = jobs.filter((job) => {
    //   return job.tasks;
    // });

    // const tools = jobs.filter((job) => {
    //   return job.tools;
    // });

    // const materials = jobs.filter((job) => {
    //   return job.materials;
    // });

    // const labour = jobs.filter((job) => {
    //   return job.materials;
    // });

    // const expense = jobs.filter((job) => {
    //   return job.expenses;
    // });

    const createTask = () => {
      // console.log("seleted ", store.jobCard.selected);
      // const getSelected = store.jobCard.selected;
      // console.log(getSelected.id);
      showModalFromId(MODAL_NAMES.JOBCARD.CREATE_TASK);
    };
    // Set the local state with the selected job card
    // useEffect(() => {
    //   if (selectedJobCard) {
    //     setJobCard(selectedJobCard);
    //   }
    // }, []);
    const createTool = () => {
      showModalFromId(MODAL_NAMES.JOBCARD.CREATE_TOOL);
    };
    const createMaterial = () => {
      showModalFromId(MODAL_NAMES.JOBCARD.CREATE_MATERIAL);
    };
    const createExpense = () => {
      showModalFromId(MODAL_NAMES.JOBCARD.CREATE_EXPENSE);
    };
    const createLabour = () => {
      showModalFromId(MODAL_NAMES.JOBCARD.CREATE_LABOUR);
    };
    useEffect(() => {
      const loadData = async () => {
        await api.user.getAll();
        // await api.jobcard.getAll();

        await api.department.getAll();
      };
      loadData();
    }, [api.user, api.jobcard, api.department]);

    return (
      <div className="uk-flex" style={{ justifyContent: "center" }}>
        <form
          className="review-info uk-card uk-card-default uk-card-body uk-card-small"
          style={{ width: "90%", justifyContent: "center" }}
          uk-grid
          onSubmit={handleSubmit}>
          <div className="dialog-content uk-position-relative uk-flex-column">
            {/* Add Task Section */}
            <h3>Fill In Allocation</h3>

            <div className="uk-flex-column" style={{ marginBottom: "2px" }}>
              <h3
                className="text-center uk-text-center"
                style={{ marginBottom: "0px" }}>
                Tasks Assigned
              </h3>

              <div className="uk-flex uk-flex-right uk-justify-content-right">
                {" "}
                <button
                  onClick={createTask}
                  className="uk-margin-top  uk-margin-right uk-button uk-button-primary">
                  ADD TASK{" "}
                  <span
                    style={{ marginLeft: "2px" }}
                    data-uk-icon="icon: plus-circle; ratio:.8"></span>
                </button>
              </div>
              <div
                className="uk-card uk-card-small uk-card-default uk-card-body"
                style={{ width: "100%", marginBottom: "20px" }}>
                {/* <TaskGrid data={tasks} /> */}
              </div>
            </div>

            {/* Add Tools Section */}
            <CustomCloseAccordion
              title={<h3 className="custom-title">{"Tools"}</h3>}>
              <div className="uk-flex-column" style={{ marginBottom: "2px" }}>
                <h3
                  className="text-center uk-text-center"
                  style={{ marginBottom: "0px" }}>
                  Tools Assigned
                </h3>

                <div className="uk-flex uk-flex-right uk-justify-content-right">
                  {" "}
                  <button
                    onClick={createTool}
                    className="uk-margin-top  uk-margin-right uk-button uk-button-primary">
                    ADD Tool{" "}
                    <span
                      style={{ marginLeft: "2px" }}
                      data-uk-icon="icon: plus-circle; ratio:.8"></span>
                  </button>
                </div>
                <hr />
                <div
                  className="uk-card uk-card-small uk-card-default uk-card-body"
                  style={{ width: "100%", marginBottom: "20px" }}>
                  {/* <ToolsGrid data={tools} /> */}
                </div>
              </div>
            </CustomCloseAccordion>
            {/* Add Materials Section */}
            <CustomCloseAccordion
              title={<h3 className="custom-title">{"Materials"}</h3>}>
              <div className="uk-flex-column" style={{ marginBottom: "2px" }}>
                <h3
                  className="text-center uk-text-center"
                  style={{ marginBottom: "0px" }}>
                  Material Assigned
                </h3>

                <div className="uk-flex uk-flex-right uk-justify-content-right">
                  {" "}
                  <button
                    onClick={createMaterial}
                    className="uk-margin-top  uk-margin-right uk-button uk-button-primary">
                    ADD Material{" "}
                    <span
                      style={{ marginLeft: "2px" }}
                      data-uk-icon="icon: plus-circle; ratio:.8"></span>
                  </button>
                </div>
                <div
                  className="uk-card uk-card-small uk-card-default uk-card-body"
                  style={{ width: "100%", marginBottom: "20px" }}>
                  {/* <MaterialsGrid data={materials} /> */}
                </div>
              </div>
            </CustomCloseAccordion>
            {/* Add Precautions Section Add Quality Standard Section */}
            <CustomCloseAccordion
              title={
                <h3 className="custom-title">
                  {"Precautions and Quality Standards"}
                </h3>
              }>
              <div style={{ marginBottom: "2px" }}>
                <h3>Precautions and Quality Standard</h3>

                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="objectives">
                    Add Precautions:
                  </label>
                  <div className="uk-form-controls">
                    <textarea
                      className="uk-textarea uk-form-small"
                      rows={5}
                      id="objectives"
                      placeholder=" Add Precautions"
                      value={precaution.description}
                      onChange={(e) =>
                        setPrecaution({
                          ...precaution,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="objectives">
                    Quality Standard:
                  </label>
                  <div className="uk-form-controls">
                    <textarea
                      className="uk-textarea uk-form-small"
                      rows={5}
                      id="objectives"
                      placeholder="Quality Standard"
                      value={standard.description}
                      onChange={(e) =>
                        setStandard({
                          ...standard,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </CustomCloseAccordion>
            {/* Add Labor Section */}
            <CustomCloseAccordion
              title={<h3 className="custom-title">{"Add Labour"}</h3>}>
              <div className="uk-flex-column" style={{ marginBottom: "2px" }}>
                <h3
                  className="text-center uk-text-center"
                  style={{ marginBottom: "0px" }}>
                  Labour Assigned
                </h3>

                <div className="uk-flex uk-flex-right uk-justify-content-right">
                  {" "}
                  <button
                    onClick={createLabour}
                    className="uk-margin-top  uk-margin-right uk-button uk-button-primary">
                    ADD LABOUR{" "}
                    <span
                      style={{ marginLeft: "2px" }}
                      data-uk-icon="icon: plus-circle; ratio:.8"></span>
                  </button>
                </div>
                <div
                  className="uk-card uk-card-small uk-card-default uk-card-body"
                  style={{ width: "100%", marginBottom: "20px" }}>
                  {/* <LabourGrid data={labour} /> */}
                </div>
              </div>
            </CustomCloseAccordion>
            {/* Add Other Expenses Section */}
            <CustomCloseAccordion
              title={<h3 className="custom-title">{"Other Expenses"}</h3>}>
              <div className="uk-flex-column" style={{ marginBottom: "2px" }}>
                <h3
                  className="text-center uk-text-center"
                  style={{ marginBottom: "0px" }}>
                  Other Expenses Assigned
                </h3>

                <div className="uk-flex uk-flex-right uk-justify-content-right">
                  {" "}
                  {/* <button
                  type="button"
                  className="btn btn-primary uk-flex uk-flex-right"
                  style={{ justifyContent: "right" }}
                  onClick={handleAddTask}>
                  {editMode ? "Save Task" : "Add Task"}{" "}
                  {editMode ? null : (
                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span>
                  )}
                </button> */}
                  <button
                    onClick={createExpense}
                    className="uk-margin-top  uk-margin-right uk-button uk-button-primary">
                    ADD EXPENSE{" "}
                    <span
                      style={{ marginLeft: "2px" }}
                      data-uk-icon="icon: plus-circle; ratio:.8"></span>
                  </button>
                </div>
                <div
                  className="uk-card uk-card-small uk-card-default uk-card-body"
                  style={{ width: "100%", marginBottom: "20px" }}>
                  {/* <ExpensesGrid data={expense} /> */}
                </div>
              </div>
            </CustomCloseAccordion>
          </div>

          <div
            className="uk-width-1-1 uk-text-right"
            style={{ marginTop: "20px" }}>
            <div
              className="uk-width-1-1 uk-text-right"
              style={{ marginTop: "10px" }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}>
                Next Step {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </div>
        </form>
        {/* <Modal modalId={MODAL_NAMES.JOBCARD.CREATE_TASK}>
          <CreateTask />
        </Modal>
        <Modal modalId={MODAL_NAMES.JOBCARD.CREATE_MATERIAL}>
          <CreateMaterial />
        </Modal>
        <Modal modalId={MODAL_NAMES.JOBCARD.CREATE_LABOUR}>
          <CreateLabour />
        </Modal>
        <Modal modalId={MODAL_NAMES.JOBCARD.CREATE_EXPENSE}>
          <CreateExpense />
        </Modal>
        <Modal modalId={MODAL_NAMES.JOBCARD.CREATE_TOOL}>
          <CreateTool />
        </Modal> */}
      </div>
    );
  }
);
export default AssignComponent;
