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
import { IClient, defaultClient } from "../../shared/models/job-card-model/Client";
import Required from "./Required";
import TextAreaWithRequired from "./Required";
import IsRequiredTextArea from "./Required";
import { doc, getDoc, getFirestore } from "firebase/firestore";

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
    ...defaultPrecaution
  });
   
  const [client, setClient] = useState<IClient>({ ...defaultClient });
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

   try {
     setLoading(true);
     await api.jobcard.jobcard.update(jobCard);
   
     const id=jobCard.id
     await api.jobcard.client.update(client,id);

    
     
     // navigate(`/c/job-cards/update/${id}`);
   } catch (error) {
     // Handle error appropriately
     console.error("Error submitting form:", error);
   } finally {
     setLoading(false); // Make sure to reset loading state regardless of success or failure
   }
 };
  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobCard({
      ...jobCard,
      urgency: e.target.value as IUrgency,
    });
  };



  const onCancel = () => {
    store.jobcard.jobcard.clearSelected();
    setJobCard({ ...defaultJobCard });
    hideModalFromId(MODAL_NAMES.EXECUTION.EDITJOBCARD_MODAL);
  };

  useEffect(() => {
    if (store.jobcard.jobcard.selected) {
      store.jobcard.client.select(client)
    
      
      setJobCard(store.jobcard.jobcard.selected);
    }
  }, [client, store.jobcard.client, store.jobcard.jobcard.selected]);



  

  const currentClient = store.jobcard.client.all;
 

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
          await api.jobcard.client.getAll(selectedJobCard.id);
        } else {
          console.error("Job card not found.");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }
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
    <div
      className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
      style={{ width: "60%" }}>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close></button>
      <h3 className="uk-modal-title text-to-break">Job Card{jobCard.id}</h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="review-info uk-card uk-card-default uk-card-body uk-card-small"
          style={{ justifyContent: "center" }}
          uk-grid
          onSubmit={handleSubmit}>
          {/* Add create Section */}
          <div className="dialog-content uk-position-relative ">
            <div className="uk-flex-column">
              <div
                className="uk-flex"
                style={{ justifyContent: "space-around", width: "100%" }}>
                <div className="text uk-flex-column" style={{ width: "100%" }}>
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="objectives">
                      Objectives:
                    </label>

                    <div className="uk-form-controls">
                      <textarea
                        className="uk-textarea uk-form-small"
                        rows={5}
                        id="objectives"
                        placeholder="Job Objectives"
                        value={jobCard.objectives}
                        onChange={(e) =>
                          setJobCard({
                            ...jobCard,
                            objectives: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                

                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="description">
                      Job Description:*
                    </label>
                    <div className="uk-form-controls">
                      <textarea
                        className="uk-textarea uk-form-small"
                        rows={5}
                        id="description"
                        placeholder="Job Description"
                        value={jobCard.jobDescription}
                        onChange={(e) =>
                          setJobCard({
                            ...jobCard,
                            jobDescription: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="urgency">
                      Urgency:
                    </label>
                    <div className="uk-form-controls">
                      <select
                        className="uk-select uk-form-small"
                        id="urgency"
                        value={jobCard.urgency}
                        onChange={handleUrgencyChange}
                        required>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div
                  className="select uk-flex-column"
                  style={{ width: "100%", marginLeft: "20px" }}>
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="due-date">
                      Date Issued:
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        id="date-issued"
                        type="date"
                        value={jobCard.dateIssued}
                        onChange={(e) =>
                          setJobCard({
                            ...jobCard,
                            dateIssued: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="dueDate">
                      Due Date:
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-input uk-form-small"
                        id="dueDate"
                        type="date"
                        value={jobCard.dueDate}
                        onChange={(e) =>
                          setJobCard({ ...jobCard, dueDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="uk-margin">
                    <label
                      className="uk-form-label"
                      htmlFor="expected-outcomes">
                      Expected Outcomes:
                    </label>
                    <div className="uk-form-controls">
                      <textarea
                        className="uk-textarea uk-form-small"
                        rows={5}
                        id="expected-outcomes"
                        placeholder="Expected Outcomes"
                        value={jobCard.expectedOutcomes}
                        onChange={(e) =>
                          setJobCard({
                            ...jobCard,
                            expectedOutcomes: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/*Client Details */}
              <div
                className="uk-flex-column"
                style={{
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: "10px",
                }}>
                <h3>Client Details (Optional)</h3>
                <div
                  className="uk-flex-column"
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}>
                  <div className="uk-margin">
                    <label
                      className="uk-form-label"
                      htmlFor="show-client-details">
                      Show Client Details
                    </label>
                    <div className="uk-form-controls">
                      <input
                        className="uk-checkbox"
                        type="checkbox"
                        id="show-client-details"
                        checked={showClientDetails}
                        onChange={() =>
                          setShowClientDetails(!showClientDetails)
                        }
                      />
                    </div>
                  </div>
                  <div
                    className="uk-flex-column"
                    style={{
                      visibility: showClientDetails ? "visible" : "hidden",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}>
                    <div
                      className="uk-flex-column"
                      style={{
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}>
                      <div className="uk-margin">
                        <label
                          className="uk-form-label"
                          htmlFor="client-contact">
                          Client Name
                        </label>
                        <div className="uk-form-controls">
                          <textarea
                            className="uk-textarea uk-form-small"
                            style={{ height: "20%" }}
                            rows={1}
                            id="client-contact"
                            placeholder="Client Contact Details"
                            value={client.name}
                            onChange={(e) =>
                              setClient({
                                ...client,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div
                        className="uk-flex"
                        style={{
                          justifyItems: "center",
                          alignItems: "center",
                        }}>
                        <div
                          className="uk-margin"
                          style={{
                            width: "100%",
                            marginRight: "20px",
                            marginTop: "20px",
                          }}>
                          <label
                            className="uk-form-label"
                            htmlFor="client-location">
                            Telephone Number:
                          </label>
                          <div className="uk-form-controls">
                            <input
                              className="uk-input uk-form-small"
                              type="text"
                              id="client-location"
                              placeholder="Telephone"
                              value={client.telephone}
                              onChange={(e) =>
                                setClient({
                                  ...client,
                                  telephone: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="uk-margin" style={{ width: "100%" }}>
                          <label
                            className="uk-form-label"
                            htmlFor="client-location"
                            style={{ width: "100%" }}>
                            Mobile Number:
                          </label>
                          <div className="uk-form-controls">
                            <input
                              className="uk-input uk-form-small"
                              type="text"
                              id="client-mobileNumber"
                              placeholder="Mobile Number"
                              value={client.mobileNumber}
                              onChange={(e) =>
                                setClient({
                                  ...client,
                                  mobileNumber: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="uk-flex"
                        style={{
                          justifyItems: "center",
                          alignItems: "center",
                        }}>
                        <div
                          className="uk-margin"
                          style={{
                            width: "100%",
                            marginRight: "20px",
                            marginTop: "20px",
                          }}>
                          <label
                            className="uk-form-label"
                            htmlFor="client-location">
                            Email:
                          </label>
                          <div className="uk-form-controls">
                            <input
                              className="uk-input uk-form-small"
                              type="email"
                              id="client-location"
                              placeholder="Email"
                              value={client.email}
                              onChange={(e) =>
                                setClient({
                                  ...client,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="uk-margin" style={{ width: "100%" }}>
                          <label
                            className="uk-form-label"
                            htmlFor="client-location"
                            style={{ width: "100%" }}>
                            Address:
                          </label>
                          <div className="uk-form-controls">
                            <input
                              className="uk-input uk-form-small"
                              type="text"
                              id="client-location"
                              placeholder="Address"
                              value={client.address}
                              onChange={(e) =>
                                setClient({
                                  ...client,
                                  address: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="uk-flex"
                        style={{
                          justifyItems: "center",
                          alignItems: "center",
                        }}>
                        <div
                          className="uk-margin"
                          style={{
                            width: "100%",
                            marginRight: "20px",
                            marginTop: "20px",
                          }}>
                          <label
                            className="uk-form-label"
                            htmlFor="client-location">
                            City:
                          </label>
                          <div className="uk-form-controls">
                            <input
                              className="uk-input uk-form-small"
                              type="text"
                              id="client-location"
                              placeholder="City"
                              value={client.city}
                              onChange={(e) =>
                                setClient({
                                  ...client,
                                  city: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="uk-margin" style={{ width: "100%" }}>
                          <label
                            className="uk-form-label"
                            htmlFor="client-location"
                            style={{ width: "100%" }}>
                            Location:
                          </label>
                          <div className="uk-form-controls">
                            <input
                              className="uk-input uk-form-small"
                              type="text"
                              id="client-location"
                              placeholder="Location"
                              value={client.location}
                              onChange={(e) =>
                                setClient({
                                  ...client,
                                  location: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Task Section */}
          <h3>Fill In Allocation</h3>
         
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
                  onClick={handleCreateTask}>
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
                  onClick={handleCreateTool}>
                  Add Tool
                </button>
              ) : (
                <button onClick={handleUpdateTool}>Save</button>
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
                  onClick={handleCreateMaterial}>
                  Add Material
                </button>
              ) : (
                <button onClick={handleUpdateMaterial}>Save</button>
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
                    onClick={handleCreateLabour}>
                    Add Labour
                  </button>
                ) : (
                  <button onClick={handleUpdateLabour}>Save</button>
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
                        onClick={() =>
                          onUpdateOtherExpense(otherExpense.asJson)
                        }>
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          onDeleteOtherExpense(otherExpense.asJson)
                        }>
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
                  onChange={(e) =>
                    handleOtherExpenseInputChange(e, "description")
                  }
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
                  onClick={handleCreateOtherExpense}>
                  Add Other Expense
                </button>
              ) : (
                <button onClick={handleUpdateOtherExpense}>Save</button>
              )}
              <hr />
            </div>
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
                Update {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default EditJobCardModal;
