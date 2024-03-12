// UpdateJobCard.tsx
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, FormEvent } from "react";
import { useAppContext } from "../../shared/functions/Context";
import swal from "sweetalert";
import { CustomCloseAccordion } from "../../shared/components/accordion/Accordion";
import MODAL_NAMES from "../dialogs/ModalName";
import showModalFromId from "../../shared/functions/ModalShow";
import {
  IJobCard,
  defaultJobCard,
} from "../../shared/models/job-card-model/Jobcard";
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

const UpdateJobCard: React.FC = observer(() => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { api, store } = useAppContext();
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
    const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });

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
      await api.jobcard.tool.create(tool, jobId);

      // Clear the form
      setTool({ ...defaultTool });
    } catch (error) {
      console.error("Error creating tool:", error);
    }
  };

  const onDeleteTool = async (tool: ITool) => {
    try {
      // Delete the tool on the server
      await api.jobcard.tool.delete(tool.id, jobId);
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
      await api.jobcard.tool.update(tool, jobId);

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
      await api.jobcard.material.create(material, jobId);

      // Clear the form
      setMaterial({ ...defaultMaterial });
    } catch (error) {
      console.error("Error creating material:", error);
    }
  };
  const onDeleteMaterial = async (material: IMaterial) => {
    try {
      // Delete the material on the server
      await api.jobcard.material.delete(material.id, jobId);
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
      await api.jobcard.material.update(material, jobId);

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
      await api.jobcard.labour.create(labour, jobId);
      // Clear the form
      setLabour({ ...defaultLabour });
    } catch (error) {
      console.error("Error creating labor:", error);
    }
  };

  const onDeleteLabour = async (labour: ILabour) => {
    try {
      // Delete the labor on the server
      await api.jobcard.labour.delete(labour.id, jobId);

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
      await api.jobcard.labour.update(labour,  jobId);

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
      await api.jobcard.otherExpense.create(otherExpense, jobId);

      // Clear the form
      setOtherExpense({ ...defaultOtherExpense });
    } catch (error) {
      console.error("Error creating other expense:", error);
    }
  };

  const onDeleteOtherExpense = async (otherExpense: IOtherExpense) => {
    try {
      // Delete the other expense on the server
      await api.jobcard.otherExpense.delete(otherExpense.id, jobId);
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
      await api.jobcard.otherExpense.update(otherExpense, jobId);

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
      navigate(`/c/job-cards/review/${jobId}`);
    } catch (error) {
      // Handle errors appropriately
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await api.user.getAll();
      await api.jobcard.jobcard.getAll;

      await api.department.getAll();
    };
    loadData();
  }, [api.user, api.jobcard, api.department]);

  // Fetch job card details based on the jobId from your data source
  // Example: const jobCardDetails = fetchJobCardDetails(jobId);

  return (
    <div>
    <form
      className="uk-card uk-card-default uk-card-body uk-card-small"
      style={{ justifyContent: "center", width:"70%" }}
      uk-grid
      onSubmit={handleSubmit}>
      {/* Add Task Section */}
      <h3>Fill In Allocation</h3>
      <div>
        <h2>Update Job Card</h2>
        <p>Job Card ID: {jobId}</p>
        {/* Render form or content for updating job card details */}
      </div>

      <div>
        {/* Your table for displaying tasks */}
        <table className="uk-table uk-table-divider">
          <thead>
            <tr>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Estimated Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskList.map((task) => (
              <tr key={task.asJson.id}>
                <td>{task.asJson.description}</td>
                <td>{task.asJson.assignedTo}</td>
                <td>{task.asJson.estimatedTime}</td>
                <td>
                  <button onClick={() => onUpdateTask(task.asJson)}>
                    Edit
                  </button>
                  <button onClick={() => onDeleteTask(task.asJson)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Your form for creating/updating tasks */}
        <div>
          <h3 className="uk-card-title">
            {createMode ? "Add Task" : "Edit Task"}
          </h3>
          <div className="uk-margin">
            <label>Task description</label>
            <input
              className="uk-input"
              type="text"
              placeholder="Enter task description"
              value={task.description}
              onChange={(e) => handleTaskInputChange(e, "description")}
            />
            <label>Assignee</label>
            <input
              className="uk-input"
              type="text"
              placeholder="Enter assigned to"
              value={task.assignedTo}
              onChange={(e) => handleTaskInputChange(e, "assignedTo")}
            />
            <label>Estimated time</label>
            <input
              className="uk-input"
              type="number"
              placeholder="Enter estimated time"
              value={task.estimatedTime}
              onChange={(e) => handleTaskInputChange(e, "estimatedTime")}
            />
            {/* Add more input fields for other task properties */}
          </div>
          {createMode ? (
            <button
              className="uk-button uk-button-secondary uk-button-small"
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                handleCreateTask(); // Call your function
              }}>
              Add Task
            </button>
          ) : (
            <button onClick={handleUpdateTask}>Save</button>
          )}
          <hr />
        </div>
      </div>
      {/* Add Tools Section */}
      <div>
        {/* Your HTML for displaying tools */}
        <table className="uk-table uk-table-divider">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Actions</th>
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
        <div>
          <h3 className="uk-card-title">
            {createMode ? "Add Tool" : "Edit Tool"}
          </h3>
          <div className="uk-margin">
            {/* Exclude input field for 'id' property */}
            <label>Tool Name</label>
            <input
              className="uk-input"
              type="text"
              placeholder="Enter tool name"
              value={tool.name}
              onChange={(e) => handleToolInputChange(e, "name")}
            />
            <label>Unit cost</label>
            <input
              className="uk-input"
              type="number"
              placeholder="Enter tool unit cost"
              value={tool.unitCost}
              onChange={(e) => handleToolInputChange(e, "unitCost")}
            />
            <label>Quantity</label>
            <input
              className="uk-input"
              type="number"
              placeholder="Enter tool quantity"
              value={tool.quantity}
              onChange={(e) => handleToolInputChange(e, "quantity")}
            />
            {/* Add more input fields for other tool properties */}
          </div>
          {createMode ? (
            <button
              className="uk-button uk-button-secondary uk-button-small"
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                handleCreateTool(); // Call your function
              }}>
              Add Tool
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                handleUpdateTool(); // Call your function
              }}>
              Save
            </button>
          )}
          <hr />
        </div>
      </div>

      {/* Add Materials Section */}

      <div>
        {/* Your HTML for displaying materials */}
        <table className="uk-table uk-table-divider">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {materialList.map((material) => (
              <tr key={material.asJson.id}>
                <td>{material.asJson.name}</td>
                <td>{material.asJson.quantity}</td>
                <td>{material.asJson.unitCost}</td>
                <td>
                  <button onClick={() => onUpdateMaterial(material.asJson)}>
                    Edit
                  </button>
                  <button onClick={() => onDeleteMaterial(material.asJson)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Your form for creating/updating materials */}
        <div>
          <h3 className="uk-card-title">
            {createMode ? "Add Material" : "Edit Material"}
          </h3>
          <div className="uk-margin">
            {/* Exclude input field for 'id' property */}
            <label>Material Name</label>
            <input
              className="uk-input"
              type="text"
              placeholder="Enter material name"
              value={material.name}
              onChange={(e) => handleMaterialInputChange(e, "name")}
            />
            <label>Unit cost</label>
            <input
              className="uk-input"
              type="number"
              placeholder="Enter material unit cost"
              value={material.unitCost}
              onChange={(e) => handleMaterialInputChange(e, "unitCost")}
            />
            <label>Quantity</label>
            <input
              className="uk-input"
              type="number"
              placeholder="Enter material quantity"
              value={material.quantity}
              onChange={(e) => handleMaterialInputChange(e, "quantity")}
            />
            {/* Add more input fields for other material properties */}
          </div>
          {createMode ? (
            <button
              className="uk-button uk-button-secondary uk-button-small"
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                handleCreateMaterial(); // Call your function
              }}>
              Add Material
            </button>
          ) : (
            <button
            
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                handleUpdateMaterial(); // Call your function
              }}>
              Save
            </button>
          )}
          <hr />
        </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {labourList.map((labour) => (
                <tr key={labour.asJson.id}>
                  <td>{labour.asJson.description}</td>
                  <td>{labour.asJson.cost}</td>
                  <td>
                    <button onClick={() => onUpdateLabour(labour.asJson)}>
                      Edit
                    </button>
                    <button onClick={() => onDeleteLabour(labour.asJson)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Your form for creating/updating labor */}
          <div>
            <h3 className="uk-card-title">
              {createMode ? "Add Labour" : "Edit Labour"}
            </h3>
            <div className="uk-margin">
              {/* Exclude input field for 'id' property */}
              <label>Description</label>
              <input
                className="uk-input"
                type="text"
                placeholder="Enter labor description"
                value={labour.description}
                onChange={(e) => handleLabourInputChange(e, "description")}
              />
              <label>Cost</label>
              <input
                className="uk-input"
                type="number"
                placeholder="Enter labor cost"
                value={labour.cost}
                onChange={(e) => handleLabourInputChange(e, "cost")}
              />
              {/* Add more input fields for other labor properties */}
            </div>
            {createMode ? (
              <button
                className="uk-button uk-button-secondary uk-button-small"
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  handleCreateLabour(); // Call your function
                }}>
                Add Labour
              </button>
            ) : (
              <button
              
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  handleUpdateLabour(); // Call your function
                }}>
                Save
              </button>
            )}
            <hr />
          </div>
        </div>
      </div>

      {/* Add Other Expenses Section */}
      <div>
        {/* Your HTML for displaying other expenses */}
        <table className="uk-table uk-table-divider">
          <thead>
            <tr>
              <th>Description</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expensesList.map((otherExpense) => (
              <tr key={otherExpense.asJson.id}>
                <td>{otherExpense.asJson.description}</td>
                <td>{otherExpense.asJson.cost}</td>
                <td>
                  <button
                    onClick={() => onUpdateOtherExpense(otherExpense.asJson)}>
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteOtherExpense(otherExpense.asJson)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Your form for creating/updating other expenses */}
        <div>
          <h3 className="uk-card-title">
            {createMode ? "Add Other Expense" : "Edit Other Expense"}
          </h3>
          <div className="uk-margin">
            {/* Exclude input field for 'id' property */}
            <label>Description</label>
            <input
              className="uk-input"
              type="text"
              placeholder="Enter other expense description"
              value={otherExpense.description}
              onChange={(e) => handleOtherExpenseInputChange(e, "description")}
            />
            <label>Cost</label>
            <input
              className="uk-input"
              type="number"
              placeholder="Enter other expense cost"
              value={otherExpense.cost}
              onChange={(e) => handleOtherExpenseInputChange(e, "cost")}
            />
            {/* Add more input fields for other other expense properties */}
          </div>
          {createMode ? (
            <button
              className="uk-button uk-button-secondary uk-button-small"
          
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                handleCreateOtherExpense(); // Call your function
              }}>
              Add Other Expense
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                handleUpdateOtherExpense(); // Call your function
              }}>
              Save
            </button>
          )}
          <hr />
        </div>
      </div>

      <div className="uk-width-1-1 uk-text-right" style={{ marginTop: "20px" }}>
        <div
          className="uk-width-1-1 uk-text-right"
          style={{ marginTop: "10px" }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            Next Step {loading && <div data-uk-spinner="ratio: .5"></div>}
          </button>
        </div>
      </div>
    </form>
    </div>
  );
});
export default UpdateJobCard;
