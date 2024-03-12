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
  defaultJobCard,
} from "../../shared/models/job-card-model/Jobcard";
import { useNavigate, useParams } from "react-router-dom";
import MODAL_NAMES from "../dialogs/ModalName";
import { hideModalFromId } from "../../shared/functions/ModalShow";

const EditJobCardModal = observer(() => {
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
      await api.jobcard.task.create(task, jobId);

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
      await api.jobcard.task.update(task, jobId);
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
  const handleMaterialInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const { value } = e.target;

    // Exclude 'id' property from being updated
    setMaterial((prevMaterial) => ({ ...prevMaterial, [fieldName]: value }));
  };
  const handleCreateMaterial = async () => {
    try {
      // Create the material on the server
      await api.jobcard.material.create(material, jobCard.id);

      // Clear the form
      setMaterial({ ...defaultMaterial });
    } catch (error) {
      console.error("Error creating material:", error);
    }
  };
  const onDeleteMaterial = async (material: IMaterial) => {
    try {
      // Delete the material on the server
      await api.jobcard.material.delete(material.id, jobCard.id);
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const onUpdateMaterial = (updatedMaterial: IMaterial) => {
    setRender(true);
    // Assuming store.jobcard.material.select() is available
    store.jobcard.material.select(updatedMaterial);

    const selectedMaterial = store.jobcard.material.selected;
    if (selectedMaterial) {
      setMaterial(selectedMaterial);
      setCreateMode(false);
    }
  };

  const handleUpdateMaterial = async () => {
    try {
      // Update the material on the server
      await api.jobcard.material.update(material, jobCard.id);

      // Clear the form and revert to create mode
      setMaterial({ ...defaultMaterial });
      setCreateMode(true);
    } catch (error) {
      console.error("Error updating material:", error);
    } finally {
      setRender(false);
    }
  };

  //handle precautions
  const handlePrecautionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPrecaution({
      ...precaution,
      [name]: value,
    });
  };
  const handleStandardInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setStandard({
      ...standard,
      [name]: value,
    });
  };

  //handle Labor actions
  const handleLabourInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const { value } = e.target;

    // Exclude 'id' property from being updated
    if (fieldName !== "id") {
      setLabour((prevLabour) => ({ ...prevLabour, [fieldName]: value }));
    }
  };

  const handleCreateLabour = async () => {
    try {
      // Create the labor on the server
      await api.jobcard.labour.create(labour, jobCard.id);
      // Clear the form
      setLabour({ ...defaultLabour });
    } catch (error) {
      console.error("Error creating labor:", error);
    }
  };

  const onDeleteLabour = async (labour: ILabour) => {
    try {
      // Delete the labor on the server
      await api.jobcard.labour.delete(labour.id, jobCard.id);

      // Update the local state by removing the deleted labor
    } catch (error) {
      console.error("Error deleting labor:", error);
    }
  };

  const onUpdateLabour = (updatedLabour: ILabour) => {
    setRender(true);
    // Assuming store.jobcard.labour.select() is available
    store.jobcard.labour.select(updatedLabour);
    const selectedLabour = store.jobcard.labour.selected;
    if (selectedLabour) {
      setLabour(selectedLabour);
      setCreateMode(false);
    }
  };

  const handleUpdateLabour = async () => {
    try {
      // Update the labor on the server
      await api.jobcard.labour.update(labour, jobCard.id);

      // Clear the form and revert to create mode
      setLabour({ ...defaultLabour });
      setCreateMode(true);
    } catch (error) {
      console.error("Error updating labor:", error);
    } finally {
      setRender(false);
    }
  };

  //handle other expense
  const handleOtherExpenseInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const { value } = e.target;

    // Exclude 'id' property from being updated
    if (fieldName !== "id") {
      setOtherExpense((prevOtherExpense) => ({
        ...prevOtherExpense,
        [fieldName]: value,
      }));
    }
  };

  const handleCreateOtherExpense = async () => {
    try {
      // Create the other expense on the server
      await api.jobcard.otherExpense.create(otherExpense, jobCard.id);

      // Clear the form
      setOtherExpense({ ...defaultOtherExpense });
    } catch (error) {
      console.error("Error creating other expense:", error);
    }
  };

  const onDeleteOtherExpense = async (otherExpense: IOtherExpense) => {
    try {
      // Delete the other expense on the server
      await api.jobcard.otherExpense.delete(otherExpense.id, jobCard.id);
    } catch (error) {
      console.error("Error deleting other expense:", error);
    }
  };

  const onUpdateOtherExpense = (updatedOtherExpense: IOtherExpense) => {
    setRender(true);
    // Assuming store.jobcard.otherExpense.select() is available
    store.jobcard.otherExpense.select(updatedOtherExpense);

    const selectedOtherExpense = store.jobcard.otherExpense.selected;
    if (selectedOtherExpense) {
      setOtherExpense(selectedOtherExpense);
      setCreateMode(false);
    }
  };

  const handleUpdateOtherExpense = async () => {
    try {
      // Update the other expense on the server
      await api.jobcard.otherExpense.update(otherExpense, jobCard.id);

      // Clear the form and revert to create mode
      setOtherExpense({ ...defaultOtherExpense });
      setCreateMode(true);
    } catch (error) {
      console.error("Error updating other expense:", error);
    } finally {
      setRender(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // navigate(`/c/job-cards/review/${jobId}`);
    } catch (error) {
      // Handle errors appropriately
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };
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
  }, [
    api.jobcard.jobcard,
    api.jobcard.task,
    api.jobcard.client,
    api.jobcard.labour,
    jobId,
    store.jobcard.jobcard.selected,
    api.jobcard.tool,
    api.jobcard.material,
    api.jobcard.otherExpense,
    api.jobcard.standard,
    api.jobcard.precaution,
  ]);

  return (
    <>
    <div style={{width:"70%"}}>
    <h3 className="uk-modal-title text-to-break">Job Card{jobCard.id}</h3>
      <div className="dialog-content uk-position-relative">
        {/* Add Task Section */}
        <h3>Fill In Allocation</h3>
        <div>
          <h2>Update Job Card</h2>
          <p>Job Card ID: {jobId}</p>
          {/* Render form or content for updating job card details */}
        </div>

        <div>
          {/* Your table for displaying tasks */}
          <h3>Your List of Tasks</h3>
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
          {/* Your form for creating/updating tasks */}
        </div>
        {/* Add Tools Section */}
        <div>
          {/* Your HTML for displaying tools */}
          <h3>List of tools</h3>
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
                  <td>
                    <button onClick={() => onUpdateTool(tool.asJson)}>
                      Edit
                    </button>
                    <button onClick={() => onDeleteTool(tool.asJson)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Your form for creating/updating tools */}
        </div>

        {/* Add Materials Section */}

        <div>
          {/* Your HTML for displaying materials */}
          <h3>Materials List</h3>
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

          {/* Your form for creating/updating materials */}
        </div>

        {/* Add Precautions Section Add Quality Standard Section */}

        <h3>Precautions and Quality Standard</h3>

        <div>
          {/* Input fields for IPrecaution */}
          <label>precaution-description</label>
          <div className="uk-form-controls">
            <input
              className="uk-input uk-form-small"
              type="text"
              id="precaution-description"
              name="description"
              placeholder="Precaution Description"
              value={precaution.description}
              onChange={handlePrecautionInputChange}
            />
          </div>

          {/* Input fields for IStandard */}

          <div className="uk-form-controls">
            <div>
              {/* Input fields for IPrecaution */}
              <label>standard-description</label>
              <input
                className="uk-input uk-form-small"
                type="text"
                id="standard-description"
                name="description"
                placeholder="Standard Description"
                value={standard.description}
                onChange={handleStandardInputChange}
              />
            </div>
          </div>
        </div>
        {/* Add Labor Section */}
        <h3>Labour List</h3>
        <div className="uk-flex-column" style={{ marginBottom: "2px" }}>
          <h3
            className="text-center uk-text-center"
            style={{ marginBottom: "0px" }}>
            Labour Assigned
          </h3>
          <div>
            {/* Your HTML for displaying labor */}
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

            {/* Your form for creating/updating labor */}
          </div>
        </div>

        {/* Add Other Expenses Section */}
        <div>
          {/* Your HTML for displaying other expenses */}
          Other Expenses
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
          {/* Your form for creating/updating other expenses */}
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
              Finish {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    </>
  );
});

export default EditJobCardModal;
