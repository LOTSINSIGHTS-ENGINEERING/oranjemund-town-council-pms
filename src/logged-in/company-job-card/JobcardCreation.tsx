import { observer } from "mobx-react-lite";
import React, { Component, FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import swal from "sweetalert";
import "../company-job-card/styles/ReviewStep.scss";
import StepStage from "./StepStage";
import "datatables.net";
import * as $ from "jquery";
import DataTable from "datatables.net-bs4";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/buttons.print.mjs";
import "datatables.net-responsive-bs4";
import "datatables.net-searchbuilder-bs4";
import "datatables.net-searchpanes-bs4";
import "datatables.net-staterestore-bs4";
import { useNavigate } from "react-router-dom";
import { JobCartGraph } from "./graphs/JobCardGraph";
import JobCartPieChart from "./graphs/JobCardPieChart";
import { SuccessAlert } from "../../shared/components/alert/Alert";
import AssignComponent from "./JobcardAssign";
import { CustomCloseAccordion } from "../../shared/components/accordion/Accordion";
import DepartmentScorecard from "../department-scorecard/DepartmentScorecard";
import {
  IJobCard,
  IUrgency,
  defaultJobCard,
 
} from "../../shared/models/job-card-model/Jobcard";
import Status from "../shared/components/status-type/Status";
import {
  IClient,
  defaultClient,
} from "../../shared/models/job-card-model/Client";
interface IStep {
  title: string;
  component: React.ReactNode;
}
interface IReviewStepProps {
  steps: IStep[];
}

const ReviewStep: React.FC<IReviewStepProps> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleNextStep = () => {
    const nextStep = currentStep + 1;

    if (nextStep < steps.length) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep(nextStep);
    }
  };

  return (
    <div
      className="review-step-container uk-flex-column"
      style={{ alignItems: "center" }}
    >
      <div
        className="step--stage-container uk-card-default"
        style={{
          marginLeft: "30px",
          alignItems: "center",
          justifyContent: "center",
          width: "auto",
        }}
      >
        {steps.map((step, index) => (
          <StepStage
            key={index}
            index={index + 1}
            title={step.title}
            isActive={index === currentStep}
            // isCompleted={completedSteps.includes(index)}
            // onClick={() => setCurrentStep(index)}
          />
        ))}
      </div>
      <div className="rendered-content-container">
        {React.cloneElement(
          steps[currentStep]?.component as React.ReactElement,
          { onNextStep: handleNextStep }
        )}
        {/* {currentStep < steps.length - 1 && (
          <button
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
            onClick={handleNextStep}>
            Next Step
          </button>
        )} */}
      </div>
    </div>
  );
};
// JobcardCreation.tsx
const JobcardCreation: React.FC<{ onNextStep: () => void }> = observer(
  ({ onNextStep }) => {
    const [loading, setLoading] = useState(false);
    const { api, store, ui } = useAppContext();
    const [jobCard, setJobCard] = useState<IJobCard>();
    const [client, setClient] = useState<IClient>();
    const navigate = useNavigate();
    // const [createdJobCard,setCraetedJobCard]= useState(false)
    //new codes
    const [selectedJobCardFile, setSelectedJobCardFile] = useState<File | null>(
      null
    );
    const [showClientDetails, setShowClientDetails] = useState(false);

    const [uploadedJobCardFileURL, setUploadedJobCardFileURL] = useState<
      string | null
    >(null);
    const [jobCardUploadProgress, setJobCardUploadProgress] =
      useState<number>(0);
    const me = store.auth.meJson;
    //using the department and Supervisor id to get supervisor and deparment name
    const currentUser = me?.uid; // check for current user Id
    const employees = store.user.all;
    // Filter employees based on my Uid
    const filteredEmployees = employees.filter((employee) => {
      return employee.asJson.supervisor === currentUser; // current user Id is equal to supervisor Id to my subdinates // my subodinates will have my uid as their supervisor
    });
    const employeeOptions = filteredEmployees.map((employee) => ({
      label: employee.asJson.displayName || "",
      value: employee.asJson.uid,
    }));
    //new code
    const handleSourceOfFundsFileSelect = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      if (e.target.files) {
        setSelectedJobCardFile(e.target.files[0]);
      }
    };

    const generateUniqueId = () => {
      const existingUid = store.jobcard.jobcard.all;

      // Extract the unique IDs from the existing job cards
      const existingUniqueIds = existingUid.map(
        (employee) => employee.asJson.uniqueId
      );

      let idCounter = 1;
      // Generate a unique ID and check for uniqueness
      let nextUniqueId = `N${idCounter.toString().padStart(3, "0")}`;
      while (existingUniqueIds.includes(nextUniqueId)) {
        idCounter++;
        nextUniqueId = `N${idCounter.toString().padStart(3, "0")}`;
      }

      return nextUniqueId;
    };
    const handleJobCardDocumentUpload = async () => {
      if (!selectedJobCardFile) return;

      const storage = getStorage();
      const storageRef = ref(storage, `uploads/jobcards `);
      const uploadTask = uploadBytesResumable(storageRef, selectedJobCardFile);

      uploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setJobCardUploadProgress(progress);
      });

      try {
        await uploadTask;

        const downloadURL = await getDownloadURL(storageRef);
        setUploadedJobCardFileURL(downloadURL);

        setSelectedJobCardFile(null);
        setJobCardUploadProgress(0);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    const handleJobCardDocumentFileReplace = async () => {
      if (!selectedJobCardFile) return;

      const storage = getStorage();
      const storageRef = ref(storage, `uploads/jobcards`);

      try {
        // const existingSourceOfFundsFileSnapshot = await getDownloadURL(
        //   storageRef
        // );

        await deleteObject(storageRef);

        await handleJobCardDocumentUpload();
      } catch (error) {
        if (error === "storage/object-not-found") {
          await handleJobCardDocumentUpload();
        } else {
        }
      }
    };

    const clients = store.jobcard.client.all.map((client) => {
      return client.asJson;
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
        if (jobCard || client) {
          const updatedJobCard: IJobCard = {
            ...jobCard,
            uniqueId: uniqueId,
            status: "Not Started",
          };

          setJobCard(updatedJobCard);
          await create(updatedJobCard);
          store.jobcard.jobcard.select(updatedJobCard);
          // await create(client);
          ui.snackbar.load({
            id: Date.now(),
            type: "success",
            message: `Created Successfully`,
            timeoutInMs: 10000,
          });
          navigate("/c/job-cards/dashboard");
          onNextStep();
        } else {
          swal({
            icon: "error",
            title: "Error!",
            text: "Job Card could not be created.",
          });
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    const create = async (jobCard: IJobCard) => {
      try {
        await api.jobcard.jobcard.create(jobCard);
      } catch (error) {
        console.log("Error" + error);

        // Handle error appropriately
      }
    };

    const uniqueId = generateUniqueId();
    useEffect(() => {
      if (store.jobcard.jobcard.selected) {
        setJobCard(store.jobcard.jobcard.selected);
      }
    }, [store.jobcard.jobcard.selected]);

    useEffect(() => {
      const loadData = async () => {
        await api.user.getAll();
        await api.jobcard.jobcard.getAll();
        if (jobCard?.uniqueId) {
          await api.jobcard.client.getAll(jobCard.id);
        }
      };
      loadData();
    }, [api.user, api.jobcard.jobcard, api.jobcard.client]);
    return (
      <div className="uk-flex" style={{ justifyContent: "center" }}>
        <form
          className="review-info uk-card uk-card-default uk-card-body uk-card-small "
          style={{ width: "70%", justifyContent: "center" }}
          onSubmit={handleSubmit}
        >
          {/*Heading*/}
          <div>
            <h3 className="text-to-break">Jobcard ID:{uniqueId}</h3>
          </div>
          <div className="dialog-content uk-position-relative ">
            <div className="uk-flex-column">
              <div
                className="uk-flex"
                style={{ justifyContent: "space-around", width: "100%" }}
              >
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
                        onChange={(e) =>
                          setJobCard({
                            ...jobCard,
                            urgency: e.target.value as IUrgency,
                          })
                        }
                        required
                      >
                        <option value={"Low"}>Low</option>
                        <option value={"Medium"}>Medium</option>
                        <option value={"High"}>High</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div
                  className="select uk-flex-column"
                  style={{ width: "100%", marginLeft: "20px" }}
                >
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
                      htmlFor="expected-outcomes"
                    >
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
                }}
              >
                <h3>Client Details (Optional)</h3>
                <div
                  className="uk-flex-column"
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <div className="uk-margin">
                    <label
                      className="uk-form-label"
                      htmlFor="show-client-details"
                    >
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
                    }}
                  >
                    <div
                      className="uk-flex-column"
                      style={{
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <div className="uk-margin">
                        <label
                          className="uk-form-label"
                          htmlFor="client-contact"
                        >
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
                            onChange={(e) => ({
                              setClient: {
                                ...client,
                                name: e.target.value,
                              },
                            })}
                          />
                        </div>
                      </div>
                      <div
                        className="uk-flex"
                        style={{ justifyItems: "center", alignItems: "center" }}
                      >
                        <div
                          className="uk-margin"
                          style={{
                            width: "100%",
                            marginRight: "20px",
                            marginTop: "20px",
                          }}
                        >
                          <label
                            className="uk-form-label"
                            htmlFor="client-location"
                          >
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
                            style={{ width: "100%" }}
                          >
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
                        style={{ justifyItems: "center", alignItems: "center" }}
                      >
                        <div
                          className="uk-margin"
                          style={{
                            width: "100%",
                            marginRight: "20px",
                            marginTop: "20px",
                          }}
                        >
                          <label
                            className="uk-form-label"
                            htmlFor="client-location"
                          >
                            Email:
                          </label>
                          <div className="uk-form-controls">
                            <input
                              className="uk-input uk-form-small"
                              type="text"
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
                            style={{ width: "100%" }}
                          >
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
                        style={{ justifyItems: "center", alignItems: "center" }}
                      >
                        <div
                          className="uk-margin"
                          style={{
                            width: "100%",
                            marginRight: "20px",
                            marginTop: "20px",
                          }}
                        >
                          <label
                            className="uk-form-label"
                            htmlFor="client-location"
                          >
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
                            style={{ width: "100%" }}
                          >
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
                      <div data-uk-form-custom="target: true">
                        <label
                          className="uk-form-label"
                          htmlFor="client-location"
                        >
                          Select File :
                        </label>
                        <input
                          type="file"
                          aria-label="Custom controls"
                          accept=".pdf, .jpg, .jpeg, .png, .eml"
                          onChange={handleSourceOfFundsFileSelect}
                          id="sourceOfFundsFile"
                        />
                        <input
                          className="uk-input uk-form-width-medium"
                          type="text"
                          placeholder="Select file"
                          aria-label="Custom controls"
                          disabled
                        />
                      </div>{" "}
                      <div className="uk-form-controls">
                        {selectedJobCardFile && (
                          <div>
                            <button
                              type="button"
                              className="btn btn-primary uk-margin-small-top uk-margin-small-bottom"
                              onClick={
                                uploadedJobCardFileURL
                                  ? handleJobCardDocumentFileReplace
                                  : handleJobCardDocumentUpload
                              }
                            >
                              {uploadedJobCardFileURL ? "Replace" : "Upload"}
                            </button>
                          </div>
                        )}
                        {uploadedJobCardFileURL && (
                          <a
                            className="btn btn-primary uk-margin-medium-top"
                            href={uploadedJobCardFileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            view file
                          </a>
                        )}
                        {selectedJobCardFile && (
                          <progress
                            className="uk-progress uk-progress-success"
                            value={jobCardUploadProgress}
                            max="100"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="uk-width-1-1 uk-text-right"
            style={{ marginTop: "10px" }}
          >
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Next Step {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    );
  }
);

const JobcardOverview = observer(() => {
  const { store } = useAppContext();
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });

  const steps = [
    { title: "Create", component: <JobcardCreation onNextStep={() => {}} /> },
    { title: "Assign", component: <AssignComponent onNextStep={() => {}} /> },
  
  ];

  return (
    <ErrorBoundary>
      <div className="performance-reviews-page uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ReviewStep steps={steps} />
          {/* <JobcardCreation />  */}
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default JobcardOverview;
