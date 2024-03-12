import { observer } from "mobx-react-lite";
import moment from "moment";
import { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useMemo, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { IOption } from "../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../shared/functions/Context";

import { IProject } from "../../../shared/models/ProjectManagement";
import { IProjectTask, IProjectTaskStatus, defaultTask } from "../../../shared/models/ProjectTasks";
import { IUser } from "../../../shared/models/User";
import { getInitials, timeFormart } from "../../project-management/utils/common";
import './task.scss';
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";
import { MAIL_EMAIL, MAIL_TASK_ADDED } from "../../../shared/functions/mailMessages";

const ViewTaskModal = observer(() => {
  const { api, store, ui } = useAppContext();
  const me = store.auth.meJson;

  const [task, setTask] = useState<IProjectTask>({ ...defaultTask })

  const tasksOptions = store.projectTask.all.map(t => t.asJson).filter(t => t.id !== task.id && t.type === "task").map(task => ({ value: task.id, label: task.taskName }));
  const uploadingStatus: string = store.projectStatus.status;
  const animatedComponents = makeAnimated();

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [dependencies, setDependencies] = useState<string[] | undefined>([]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0] as File || null;

    if (!file || !task) return;

    setLoading(true);
    try {
      await api.projectManagement.uploadTaskFile(task.projectId, task, file);
    } catch (error) { }

    setLoading(false);
  };

  const handleSubmitComments = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!task || !me) return;

    setLoading(true);
    try {
      await api.projectManagement.taskComment(task.projectId, task, `${me.displayName} => ${comment}`)
    } catch (error) { }

    setLoading(false)
  };

  const [search, setSearch] = useState("");

  const options: IOption[] = useMemo(() =>
    store.user.all.map((user) => {
      return {
        label: user.asJson.displayName || "",
        value: user.asJson.uid
      };
    }),
    [store.user]
  );

  const onSearch: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setSearch(event.target.value);
  };

  const updateTaskDeps = async () => {

    if (!task) return;

    setLoading(true);
    const _task: IProjectTask = {
      ...task,
      dependencies: dependencies,
    }
    try {
      await api.projectManagement.updateTask(task.projectId, _task);
    } catch (error) { }
    setLoading(false);
  };

  const updateStatus = async (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    if (!task) return;
    const _task: IProjectTask = {
      ...task,
      status: e.target.value as IProjectTaskStatus,
    }
    try {
      setLoading(true);
      await api.projectManagement.updateTask(task.projectId, _task);
      setLoading(false);
    } catch (error) {
    }
  }


  const onAddUser = async () => {
    if (!task) return;

    setLoading(true);

    const project: IProject | undefined = store.projectManagement.getItemById(task.projectId)?.asJson;
    const { MY_SUBJECT, MY_BODY } = MAIL_TASK_ADDED(me?.displayName!, project?.projectName!, task.taskName);
    const user: IUser | undefined = store.user.getItemById(search)?.asJson;

    const _task: IProjectTask = {
      ...task,
      usersId: [...task.usersId, search],
    }
    try {

      await api.projectManagement.updateTask(task.projectId, _task);
      await api.mail.sendMail([user?.email!], MAIL_EMAIL,[me?.email!], MY_SUBJECT, MY_BODY)

    } catch (error) {
    }

    setLoading(false);
  }

  const onRemoveMember = async (index: number) => {
    if (!task) return;

    const members = task.usersId.splice(index, 1);

    const _task: IProjectTask = {
      ...task,
      usersId: members
    }
    try {
      await api.projectManagement.updateTask(task.projectId, _task);
    } catch (error) { }
  };


  useEffect(() => {
    if (store.projectTask.selected) {
      setTask(store.projectTask.selected);
    }
    else hideModalFromId(MODAL_NAMES.PROJECTS.VIEW_TASK)
  }, [store.projectTask.selected]);


  if (!task || !me) return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-2-3">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <span>Task Not Available</span>
    </div>
  )

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-2-3" data-uk-overflow-auto>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>

      <div className="updateTask">
        <div>
          <select value={task.status}
            id="status" className="uk-select"
            name="status"
            onChange={(value) => updateStatus(value)}>
            <option value={"todo"}>To Do</option>
            <option value={"in-progress"}>In Progress</option>
            <option value={"in-review"}>In Review</option>
            <option value={"done"}>Done</option>
          </select>
        </div>
      </div>
      {loading && <div uk-spinner="ratio: .5"></div>}
      <h3 className="uk-modal-title">{task.taskName}</h3>
      <div className="dialog-content uk-position-relative modal-content">
        <div className="left flex-item">
          <div className="decription">
            <h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-align-left">
                <line x1="17" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="17" y1="18" x2="3" y2="18"></line>
              </svg>
              &nbsp;&nbsp;
              Description
            </h5>
            <p>{task.description}</p>
          </div>
          <div className="decription">
            <h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              &nbsp;
              Timeline
            </h5>
            <p>{moment(task.startDate).calendar(null, timeFormart)} - {moment(task.endDate).calendar(null, timeFormart)}</p>
          </div>
          <div className="members">
            <h5 className="heading3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              &nbsp;
              Members
            </h5>
            <div className="users">
              {task.usersId.map((userId: string, index) => {
                const user = store.user.getItemById(userId)?.asJson.displayName;
                return (
                  <div className="user" style={{ textTransform: 'uppercase' }} key={index} data-uk-tooltip={user}>
                    {user && (user !== me.displayName) ? getInitials(user) : "ME"}
                    {task.usersId[0] === me.uid && (
                      <div className="delete" data-uk-tooltip="Remove"
                        onClick={() => onRemoveMember(index)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-trash"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
              {task.usersId.length < 2 &&
                <button type="button" data-uk-tooltip="Add Member" className="user">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-plus">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </button>
              }
              <div data-uk-dropdown="mode: click">
                <div className="add-dep">
                  <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="add-user-to-task">Assign task to:</label>
                    <select className="uk-select uk-form-small"
                      aria-label="Select"
                      onChange={onSearch}
                    >
                      <option value={""}>None</option>
                      {options.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <button className="btn btn-primary" data-uk-tooltip="Save"
                    onClick={onAddUser}
                    disabled={task.usersId[0] !== me.uid}>
                    <svg width="20" height="20" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                      <path d="M3 19V5a2 2 0 012-2h11.172a2 2 0 011.414.586l2.828 2.828A2 2 0 0121 7.828V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5"></path>
                      <path d="M8.6 9h6.8a.6.6 0 00.6-.6V3.6a.6.6 0 00-.6-.6H8.6a.6.6 0 00-.6.6v4.8a.6.6 0 00.6.6zM6 13.6V21h12v-7.4a.6.6 0 00-.6-.6H6.6a.6.6 0 00-.6.6z" stroke="currentColor" strokeWidth="1.5"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <br />
          </div>
          <div className="Dependencies">
            <h5>
              <svg width="20" height="20" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                <rect x="2" y="21" width="7" height="5" rx="0.6" transform="rotate(-90 2 21)" stroke="currentColor" strokeWidth="1.5"></rect><rect x="17" y="15.5" width="7" height="5" rx="0.6" transform="rotate(-90 17 15.5)" stroke="currentColor" strokeWidth="1.5"></rect>
                <rect x="2" y="10" width="7" height="5" rx="0.6" transform="rotate(-90 2 10)" stroke="currentColor" strokeWidth="1.5"></rect>
                <path d="M7 17.5h3.5a2 2 0 002-2v-7a2 2 0 00-2-2H7M12.5 12H17" stroke="currentColor" strokeWidth="1.5"></path>
              </svg>
              &nbsp; Dependencies
            </h5>
            <div className="dependencies-list">
              {task.dependencies?.map((dep, index) => (
                <div className="dependencies-item" key={index}>
                  {store.projectTask.getItemById(dep)?.asJson.taskName}
                </div>
              ))}
              <button type="button" className="dependencies-item" data-uk-tooltip="Add dependencies">
                <span data-uk-icon="icon: plus; ratio:0.7"></span>
              </button>
              <div data-uk-dropdown="mode: click">
                <div className="add-dep">
                  <Select
                    isDisabled={task.usersId[0] !== me.uid}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    onChange={(value: any) => setDependencies(value.map((t: any) => t.value))}
                    isMulti
                    options={tasksOptions}
                  />
                  <button className="btn btn-primary"
                    data-uk-tooltip="save"
                    onClick={updateTaskDeps}
                    disabled={task.usersId[0] !== me.uid}
                  >
                    <svg width="20" height="20" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                      <path d="M3 19V5a2 2 0 012-2h11.172a2 2 0 011.414.586l2.828 2.828A2 2 0 0121 7.828V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5"></path>
                      <path d="M8.6 9h6.8a.6.6 0 00.6-.6V3.6a.6.6 0 00-.6-.6H8.6a.6.6 0 00-.6.6v4.8a.6.6 0 00.6.6zM6 13.6V21h12v-7.4a.6.6 0 00-.6-.6H6.6a.6.6 0 00-.6.6z" stroke="currentColor" strokeWidth="1.5"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <br />
          </div>
          <div className="attachments">
            <h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-paperclip">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
              &nbsp; Attachments &nbsp;&nbsp;
              <div className="upload" data-uk-tooltip="Upload File" data-uk-form-custom>
                <div data-uk-form-custom>
                  <input type="file" onChange={handleFileUpload} disabled={task.usersId[0] !== me.uid} />
                  <button className="file-upload" type="button" tabIndex={-1}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </button>
                  {uploadingStatus !== "start" && <div data-uk-spinner="ratio: .9">{uploadingStatus}%</div>}
                </div>
              </div>
            </h5>
            <ul className="uk-list">
              {task.files?.map((file, index) => (
                <li key={index}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  &nbsp;&nbsp;
                  <a href={file.link}>{file.name} &nbsp;&nbsp;<span data-uk-icon="download"></span></a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="right flex-item">
          <div className="comments">
            <h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              &nbsp;
              Comments
            </h5>
            <div className="messages">
              <div className="msg-in">
                {task.comments?.map((comm) => {
                  let name = comm.split("=>")[0];
                  let text = comm.split("=>")[1];
                  return (
                    <p className="msg" style={{ whiteSpace: "pre-line", fontSize: ".9rem" }}>
                      <span><b>{name}</b></span> <br />
                      {text}
                    </p>
                  )
                })}
              </div>
              <form onSubmit={handleSubmitComments} className="comment-form">
                <div className="send-msg">
                  <textarea className="uk-textarea" style={{ resize: "none" }} rows={2} placeholder="comment"
                    onChange={(e: any) => setComment(e.target.value)}></textarea>
                  <button
                    className="send-btn"
                    type="submit"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ViewTaskModal;
