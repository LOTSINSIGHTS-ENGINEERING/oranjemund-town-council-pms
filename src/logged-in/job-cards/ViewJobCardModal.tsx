import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";
import { ITask, defaultTask } from "../../shared/models/job-card-model/Task";
import { ITool, defaultTool } from "../../shared/models/job-card-model/Tool";
import {
  IMaterial,
  defaultMaterial,
} from "../../shared/models/job-card-model/Material";
import {
  IPrecaution,
  IStandard,
  defaultPrecaution,
  defaultStandard,
} from "../../shared/models/job-card-model/PrecautionAndStandard";
import {
  ILabour,
  defaultLabour,
} from "../../shared/models/job-card-model/Labour";
import {
  IOtherExpense,
  defaultOtherExpense,
} from "../../shared/models/job-card-model/OtherExpense";
import {
  IJobCard,
  IUrgency,
  defaultJobCard,
} from "../../shared/models/job-card-model/Jobcard";
import { useNavigate, useParams } from "react-router-dom";
import MODAL_NAMES from "../dialogs/ModalName";
import { hideModalFromId } from "../../shared/functions/ModalShow";
import {
  IClient,
  defaultClient,
} from "../../shared/models/job-card-model/Client";


const ViewJobCardModal = observer(() => {
  const [loading, setLoading] = useState(false);
  const { api, store, ui } = useAppContext();
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });

  const { jobId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<ITask>({ ...defaultTask });
  const [createMode, setCreateMode] = useState(true);
  const [render, setRender] = useState(false);
  const [tool, setTool] = useState<ITool>({ ...defaultTool });
  const [material, setMaterial] = useState<IMaterial>({ ...defaultMaterial });
  const [precaution, setPrecaution] = useState<IPrecaution>({
    ...defaultPrecaution,
  });


  const [createdJobCardId, setCreatedJobCardId] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(false);

  const [standard, setStandard] = useState<IStandard>({
    ...defaultStandard,
  });
  const [labour, setLabour] = useState<ILabour>({
    ...defaultLabour,
  });
  const [otherExpense, setOtherExpense] = useState<IOtherExpense>({
    ...defaultOtherExpense,
  });

  //handle  tasks removal, addition,updating

  const handleTaskInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const { value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [fieldName]: value }));
  };
  const handleCreateTask = async () => {
    try {
      // Create a new task on the server
      await api.jobcard.task.create(task, jobCard.id);

      // Clear the form
      setTask({ ...defaultTask });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const onDeleteTask = async (task: ITask) => {
    try {
      // Delete from the server
      await api.jobcard.task.delete(task.id, jobId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const onUpdateTask = (updatedTask: ITask) => {
    setCreateMode(false);
    setTask(updatedTask);
  };

  const handleUpdateTask = async () => {
    try {
      // Update the task on the server
      await api.jobcard.task.update(task, jobCard.id);
      // Clear the form and revert to create mode
      setTask({ ...defaultTask });
      setCreateMode(true);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const taskList = store.jobcard.task.all;
  const materialList = store.jobcard.material.all;
  const labourList = store.jobcard.labour.all;
  const expensesList = store.jobcard.otherExpense.all;
  const toolList = store.jobcard.tool.all;
  const currentClient =store.jobcard.client.all


const [client, setClient] = useState<IClient>({ ...defaultClient });

const allClients = store.jobcard.client.all;



  //Handle tools
  const handleToolInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const { value } = e.target;
    // Exclude 'id' property from being updated
    setTool((prevTool) => ({ ...prevTool, [fieldName]: value }));
  };

  const handleCreateTool = async () => {
    try {
      // Create the tool on the server
      await api.jobcard.tool.create(tool, jobCard.id);

      // Clear the form
      setTool({ ...defaultTool });
    } catch (error) {
      console.error("Error creating tool:", error);
    }
  };

  const onDeleteTool = async (tool: ITool) => {
    try {
      // Delete the tool on the server
      await api.jobcard.tool.delete(tool.id, jobCard.id);
    } catch (error) {
      console.error("Error deleting tool:", error);
    }
  };

  const onUpdateTool = (updatedTool: ITool) => {
    setRender(true);
    // Assuming store.jobcard.tool.select() is available
    store.jobcard.tool.select(updatedTool);

    const selectedTool = store.jobcard.tool.selected;
    if (selectedTool) {
      setTool(selectedTool);
      setCreateMode(false);
    }
  };

  const handleUpdateTool = async () => {
    try {
      // Update the tool on the server
      await api.jobcard.tool.update(tool, jobCard.id);

      // Clear the form and revert to create mode
      setTool({ ...defaultTool });
      setCreateMode(true);
    } catch (error) {
      console.error("Error updating tool:", error);
    } finally {
      setRender(false);
    }
  };

  //handle materials

  
  const onCancel = () => {
    store.jobcard.jobcard.clearSelected();
    setJobCard({ ...defaultJobCard });
    hideModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  };

  useEffect(() => {
    if (store.jobcard.jobcard.selected) {
      setJobCard(store.jobcard.jobcard.selected);
    }
  }, [store.jobcard.jobcard.selected]);

  useEffect(() => {
    if (store.jobcard.jobcard.selected) {
      const loadData = async () => {
        try {
          // Fetch job card details
          const jobCardDetails = await api.jobcard.jobcard.getAll();
          // Assuming jobCardDetails is an array of job card objects, choose one based on your logic
          const selectedJobCard = store.jobcard.jobcard.selected;

          if (selectedJobCard) {
            // Fetch data for subcollections
            await api.jobcard.task.getAll(selectedJobCard.id);
            await api.jobcard.client.getAll(selectedJobCard.id);
            await api.jobcard.tool.getAll(selectedJobCard.id);
            await api.jobcard.labour.getAll(selectedJobCard.id);
            await api.jobcard.material.getAll(selectedJobCard.id);
            await api.jobcard.otherExpense.getAll(selectedJobCard.id);
            await api.jobcard.standard.getAll(selectedJobCard.id);
            await api.jobcard.precaution.getAll(selectedJobCard.id);
          } else {
            console.error("Job card not found.");
          }
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };

      loadData();
    }
  }, [api.jobcard.jobcard, api.jobcard.task, api.jobcard.client, api.jobcard.labour, jobId, store.jobcard.jobcard.selected, api.jobcard.tool, api.jobcard.material, api.jobcard.otherExpense, api.jobcard.standard, api.jobcard.precaution, jobCard.id]);

  return (
    <div
      className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      style={{ width: "60%" }}>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close></button>
      <h3 className="uk-modal-title text-to-break">View{jobCard.id} {client.name}</h3>
      <div className="dialog-content uk-position-relative">
        {/* Add create Section */}
        <div className="dialog-content uk-position-relative ">
          <div className="uk-flex-column">
            <div
              className="uk-flex"
              style={{ justifyContent: "space-around", width: "100%" }}>
              <div className="text uk-flex-column" style={{ width: "100%" }}>
                <div className="uk-margin">
                  <p className="uk-form-label">Objectives:</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">{jobCard.objectives}</p>
                  </div>
                </div>

                <div className="uk-margin">
                  <p className="uk-form-label">Job Description:*</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">{jobCard.jobDescription}</p>
                  </div>
                </div>

                <div className="uk-margin">
                  <p className="uk-form-label">Urgency:</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">{jobCard.urgency}</p>
                  </div>
                </div>
              </div>

              <div
                className="select uk-flex-column"
                style={{ width: "100%", marginLeft: "20px" }}>
                <div className="uk-margin">
                  <p className="uk-form-label">Date Issued:</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">{jobCard.dateIssued}</p>
                  </div>
                </div>

                <div className="uk-margin">
                  <p className="uk-form-label">Due Date:</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">{jobCard.dueDate}</p>
                  </div>
                </div>

                <div className="uk-margin">
                  <p className="uk-form-label">Expected Outcomes:</p>
                  <div className="uk-form-controls">
                    <p className="uk-text-small">{jobCard.expectedOutcomes}</p>
                  </div>
                </div>
              </div>
            </div>

            {/*Client Details */}
            <div>
              <h3>Client Details (Optional)</h3>
            
                <div className="uk-flex-column">
                  <div className="uk-margin">
                    <label className="uk-form-label">Client Name:</label>
                    <div className="uk-form-controls">{client.name}</div>
                  </div>
                  <div className="uk-flex">
                    <div className="uk-margin" style={{ width: "50%" }}>
                      <label className="uk-form-label">Telephone Number:</label>
                      <div className="uk-form-controls">{}</div>
                    </div>
                    <div className="uk-margin" style={{ width: "50%" }}>
                      <label className="uk-form-label">Mobile Number:</label>
                      <div className="uk-form-controls">
                        {client.mobileNumber}
                      </div>
                    </div>
                  </div>
                  <div className="uk-flex">
                    <div className="uk-margin" style={{ width: "50%" }}>
                      <label className="uk-form-label">Email:</label>
                      <div className="uk-form-controls">{client.email}</div>
                    </div>
                    <div className="uk-margin" style={{ width: "50%" }}>
                      <label className="uk-form-label">Address:</label>
                      <div className="uk-form-controls">{client.address}</div>
                    </div>
                  </div>
                  <div className="uk-flex">
                    <div className="uk-margin" style={{ width: "50%" }}>
                      <label className="uk-form-label">City:</label>
                      <div className="uk-form-controls">{client.city}</div>
                    </div>
                    <div className="uk-margin" style={{ width: "50%" }}>
                      <label className="uk-form-label">Location:</label>
                      <div className="uk-form-controls">{client.location}</div>
                    </div>
                  </div>
                </div>
            
            </div>
          </div>
        </div>

        <div>
          <h2>Allocation Section</h2>
        </div>

        <div>
          <div>
            <h3>Task List</h3>
            <p>
              This table displays the tasks with their descriptions, assigned
              users, estimated times, and actions.
            </p>

            <table className="uk-table uk-table-divider">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Assigned To</th>
                  <th>Estimated Time</th>
                </tr>
              </thead>
              <tbody>
                {taskList.map((task) => (
                  <tr key={task.asJson.id}>
                    <td>{task.asJson.description}</td>
                    <td>{task.asJson.assignedTo}</td>
                    <td>{task.asJson.estimatedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Add Tools Section */}
        <div>
          <div>
            <h3>Tool Description</h3>
            <p>View and manage tools in the inventory.</p>

            {/* Your HTML for displaying tools */}
            <table className="uk-table uk-table-divider">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                </tr>
              </thead>
              <tbody>
                {toolList.map((tool) => (
                  <tr key={tool.asJson.id}>
                    <td>{tool.asJson.name}</td>
                    <td>{tool.asJson.quantity}</td>
                    <td>{tool.asJson.unitCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Your form for creating/updating tools */}
        </div>

        {/* Add Materials Section */}

        <div>
          <h3>Material Description</h3>
          <p>View and manage materials in the inventory.</p>

          {/* Your HTML for displaying materials */}
          <table className="uk-table uk-table-divider">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Cost</th>
              </tr>
            </thead>
            <tbody>
              {materialList.map((material) => (
                <tr key={material.asJson.id}>
                  <td>{material.asJson.name}</td>
                  <td>{material.asJson.quantity}</td>
                  <td>{material.asJson.unitCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {/* Display data for IPrecaution */}
          <div className="uk-margin">
            <p>
              <strong>Precaution Description:</strong> {precaution.description}
            </p>
          </div>

          {/* Display data for IStandard */}
          <div className="uk-margin">
            <p>
              <strong>Standard Description:</strong> {standard.description}
            </p>
          </div>
        </div>

        {/* Add Labor Section */}
        <div className="uk-flex-column" style={{ marginBottom: "2px" }}>
          <h3
            className="text-center uk-text-center"
            style={{ marginBottom: "0px" }}>
            Labour Assigned
          </h3>
          <div>
            {/* Display data for labor */}
            <table className="uk-table uk-table-divider">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {labourList.map((labour) => (
                  <tr key={labour.asJson.id}>
                    <td>{labour.asJson.description}</td>
                    <td>{labour.asJson.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Other Expenses Section */}
        <div>
          <h3 className="uk-card-title">Expenses</h3>
          {/* Display data for other expenses */}
          <table className="uk-table uk-table-divider">
            <thead>
              <tr>
                <th>Description</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {expensesList.map((otherExpense) => (
                <tr key={otherExpense.asJson.id}>
                  <td>{otherExpense.asJson.description}</td>
                  <td>{otherExpense.asJson.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              View {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ViewJobCardModal;
