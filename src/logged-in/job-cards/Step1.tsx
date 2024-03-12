// Step1.tsx

// CreateJobCard.jsx

import { observer } from "mobx-react-lite";
import React, { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";

import "../company-job-card/styles/ReviewStep.scss";
import "datatables.net";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/buttons.print.mjs";
import "datatables.net-responsive-bs4";
import "datatables.net-searchbuilder-bs4";
import "datatables.net-searchpanes-bs4";
import "datatables.net-staterestore-bs4";
import { useNavigate } from "react-router-dom";
import {
  IJobCard,
  IUrgency,
  defaultJobCard,
} from "../../shared/models/job-card-model/Jobcard";
import {
  IClient,
  defaultClient,
} from "../../shared/models/job-card-model/Client";
import IsRequiredInput from "./Required";

interface Step1Props {
  handleNext: () => void;
}

// Wrap the component with observer
const Step1: React.FC<Step1Props> = observer(({ handleNext }) => {
  const [loading, setLoading] = useState(false);
  const { api, store } = useAppContext();
  const [jobCard, setJobCard] = useState<IJobCard>({ ...defaultJobCard });
  const [client, setClient] = useState<IClient>({ ...defaultClient });
  const [createdJobCardId, setCreatedJobCardId] = useState(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const uniqueId = generateUniqueId();
      const updatedJobCard = {
        ...jobCard,
        uniqueId: uniqueId,
      };
      setJobCard(updatedJobCard);
      await api.jobcard.jobcard.create(updatedJobCard);

      console.log("my created job card ", updatedJobCard);

      // store.jobcard.jobcard.select(jobCard);
      store.jobcard.jobcard.select(updatedJobCard);
    } catch (error) {
    } finally {
      handleNext();
      setLoading(false);
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

      await api.department.getAll();
    };
    loadData();
  }, [api.user, api.jobcard, api.department]);
  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobCard({
      ...jobCard,
      urgency: e.target.value as IUrgency,
    });
  };

  const handleNextClick = () => {
    // Additional validation or processing can be done here
    handleNext();
  };

  return (
    <>
      <div className="uk-flex" style={{ justifyContent: "center" }}>
        <form
          className="review-info uk-card uk-card-default uk-card-body uk-card-small "
          style={{ width: "70%", justifyContent: "center" }}
          onSubmit={handleSubmit}>
          {/*Heading*/}
          <div>
            <h3 className="text-to-break">
              Jobcard ID:
              {uniqueId}
            </h3>
          </div>
          <div className="dialog-content uk-position-relative ">
            <div className="uk-flex-column">
              <div
                className="uk-flex"
                style={{ justifyContent: "space-around", width: "100%" }}>
                <div className="text uk-flex-column" style={{ width: "100%" }}>
                  <div className="uk-margin">
                    <IsRequiredInput
                      type="textarea"
                      id="objectives"
                      placeholder="Job Objectives"
                      value={jobCard.objectives}
                      onChange={(e) =>
                        setJobCard({
                          ...jobCard,
                          objectives: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="uk-margin">
                    <IsRequiredInput
                      type="textarea"
                      id="description"
                      placeholder="Job Description"
                      value={jobCard.jobDescription}
                      onChange={(e) =>
                        setJobCard({
                          ...jobCard,
                          jobDescription: e.target.value,
                        })
                      }
                    />
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
                    <IsRequiredInput
                      type="date"
                      placeholder="Date Issued"
                      value={jobCard.dateIssued}
                      id="date-issued"
                      onChange={(e) =>
                        setJobCard({
                          ...jobCard,
                          dateIssued: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="dueDate">
                      Due Date:
                    </label>

                    <div className="uk-margin">
                      <IsRequiredInput
                        placeholder="Due Date"
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
                    <IsRequiredInput
                      id="expected-outcomes"
                      type="textarea"
                      placeholder="Expected Outcomes"
                      value={jobCard.expectedOutcomes}
                      onChange={(e) =>
                        setJobCard({
                          ...jobCard,
                          expectedOutcomes: e.target.value,
                        })
                      }
                    />
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
          <div
            className="uk-width-1-1 uk-text-right"
            style={{ marginTop: "10px" }}>
            {/* <button onClick={handleNextClick}>Next</button> */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              // onClick={handleCreateJobCard}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
});

export default Step1;
