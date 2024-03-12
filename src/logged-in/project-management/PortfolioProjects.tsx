import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useAppContext } from '../../shared/functions/Context';
import ErrorBoundary from '../../shared/components/error-boundary/ErrorBoundary';
import useTitle from '../../shared/hooks/useTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import MODAL_NAMES from '../dialogs/ModalName';
import Modal from '../../shared/components/Modal';
import NewProjectModal from '../dialogs/project-management/NewProjectModal';
import showModalFromId from '../../shared/functions/ModalShow';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectTabs from './tabs/ProjectsTabs';
import { getInitials } from './utils/common';
import useBackButton from '../../shared/hooks/useBack';
import "./styles/projects.style.scss";
import Filter from './utils/filter';
import { USER_ROLES } from '../../shared/functions/CONSTANTS';
import { defaultProject, IProject, IProjectStatus } from '../../shared/models/ProjectManagement';

const PortfolioProjects = observer(() => {
    const { api, store, ui } = useAppContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const me = store.auth.meJson;
    const role = store.auth.role;
    useTitle("Projects Home");
    useBackButton("/c/portfolio");
    const [selectedTab, setselectedTab] = useState("all");

    const [selectedProject, setSelectedProject] = useState<IProject>({ ...defaultProject });

    const [selectedValue, setSelectedValue] = useState("all");
    const [loading, setLoading] = useState(false);
    const department = store.department.all.map((d) => ({ id: d.asJson.id, name: d.asJson.name }));
    const projects: IProject[] = store.projectManagement.all.map((p) => p.asJson);

    const handleNewProject = () => {
        showModalFromId(MODAL_NAMES.PROJECTS.CREATE_PROJECT);
    };

    const quickProjectUpdate = (_project: IProject) => {
        store.projectManagement.select(_project)
        if (store.projectManagement.selected)
            setSelectedProject(store.projectManagement.selected)
        else setSelectedProject(defaultProject)
    };

    const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedProject) return;

        try {
            setLoading(true);
            await api.projectManagement.updateProject(selectedProject);
            setLoading(false);
        } catch (error) {
            ui.snackbar.load({
                id: Date.now(),
                message: "Error! Failed to update.",
                type: "danger",
            });
        }
    }

    const handleDeleteProject = async () => {
        setLoading(true);

        try {
            await api.projectManagement.getTasks(selectedProject.id)
            await api.projectManagement.getRisks(selectedProject.id)
            await api.projectManagement.getProjectLogs(selectedProject.id)

            if (store.projectTask.all.length !== 0
                || store.projectLogs.all.length !== 0
                || store.projectRisk.all.length !== 0) {
                ui.snackbar.load({
                    id: Date.now(),
                    message: "This project contain data, delete the data first.",
                    type: "danger",
                    timeoutInMs: 5000,
                });
            }
            else {
                await api.projectManagement.deleteProject(selectedProject);
            }
        } catch (error) {
        }
        setLoading(false);
    }


    useEffect(() => {
        if (me) {
            if (role === USER_ROLES.EXECUTIVE_USER || role === USER_ROLES.GUEST_USER || role === USER_ROLES.SUPER_USER)
                api.projectManagement.getAllProjects();
            else if (role === USER_ROLES.EMPLOYEE_USER || role === USER_ROLES.MANAGER_USER)
                api.projectManagement.getProjectsByDepartment(me.department);
            else
                api.projectManagement.getUserProjects(me.uid);
        }
    }, [api.projectManagement, me])

    useEffect(() => {
        if (store.user.all.length < 2) {
            api.user.getAll();
        }
    }, [api.user]);


    if (!me) return <div>  Can Not take these actions </div>

    return (
        <ErrorBoundary>
            <div className="topMain">
                <ProjectTabs
                    selectedTab={selectedTab}
                    setselectedTab={setselectedTab}
                />
                <div className="p-navbar" style={{ float: "right" }}>
                    <button className="btn btn-primary" type="button">
                        <span>Filter&nbsp;&nbsp;</span>
                        <FontAwesomeIcon
                            icon={faFilter}
                            className="icon uk-margin-small-right"
                        />
                    </button>
                    <div uk-drop="mode: click">
                        <Filter list={[...department, { name: "All Departments", id: "all" }]} selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
                    </div>

                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="btn btn-primary" onClick={handleNewProject}>
                        <span>New Project&nbsp;&nbsp;</span>
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="icon uk-margin-small-right"
                        />
                    </button>
                </div>
            </div>
            <div className="bottomMain">
                {
                    // eslint-disable-next-line array-callback-return
                    projects.filter((project) => {
                        if (selectedTab === "all") return project;
                        else if (project.status === selectedTab) return project;
                    }).filter((project) => {
                        if (selectedValue === "all") return project;
                        else if (project.department === selectedValue) return project;
                    }).filter((project) => project.portfolioId === id).map((project) => (
                        <div key={project.id}>
                            <div className="uk-card uk-card-hover">
                                <div className="card-content uk-card-body" onClick={() => { navigate(`/c/project/${project.id}`) }}>
                                    <h5 className="h-5" uk-tooltip={`${project.projectName}`}>{project.projectName}</h5>
                                    <p>{project.description ? project.description : "..."}</p>
                                    <div className="users">
                                        {project.usersId.slice(0, 5).map((userId) => {
                                            const user = store.user.getItemById(userId)?.asJson.displayName;
                                            return (
                                                <div className="user" style={{ textTransform: 'uppercase' }} key={userId} uk-tooltip={user}>
                                                    {user && (user !== me.displayName) ? getInitials(user) : "ME"}
                                                </div>
                                            )
                                        })}
                                        {project.usersId.length > 5 ? (<div className="user" style={{ textTransform: 'uppercase' }} uk-tooltip={project.usersId.slice(5).map((userId: any) => store.user.getItemById(userId)?.asJson.displayName)}>
                                            +{(project.usersId.length - 5)}
                                        </div>) : null
                                        }
                                    </div>
                                    <span style={{ fontSize: ".6rem" }}>{project.startDate ? project.startDate : ""}  -  {project.endDate ? project.endDate : ""}</span>
                                </div>
                                <div className="uk-inline card-actions">
                                    <button className={`card-badge ${project.status}`} uk-tooltip="more" type="button">
                                        <span>{project.status}</span>&nbsp;
                                    </button>
                                    <button className={`card-badge ${project.status}`} uk-tooltip="more" type="button" onClick={() => quickProjectUpdate(project)}>
                                        <span uk-icon="icon:more; ratio: .5"></span>
                                    </button>

                                    <form onSubmit={handleUpdateProject} className="uk-card uk-card-default p-actions" uk-drop="mode: click" style={{ borderRadius: "6px" }}>
                                        <div className="drop-input">
                                            <input type="text"
                                                name="name"
                                                id="name"
                                                placeholder="project name"
                                                defaultValue={project.projectName}
                                                onChange={(e) => setSelectedProject({ ...project, projectName: e.target.value })} />

                                        </div>
                                        <h5 style={{ textTransform: 'uppercase' }}>Status: {project.status}</h5>
                                        <div>
                                            <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
                                                <label><input
                                                    className="uk-radio"
                                                    type="radio"
                                                    name="status"
                                                    value={"active"}
                                                    onChange={(e) =>
                                                        setSelectedProject({ ...project, status: e.target.value as IProjectStatus })} /> Active </label>
                                                <label><input
                                                    className="uk-radio"
                                                    type="radio"
                                                    name="status"
                                                    value={"on-hold"}
                                                    onChange={(e) =>
                                                        setSelectedProject({ ...project, status: e.target.value as IProjectStatus })} /> On-Hold </label>
                                                <label><input
                                                    className="uk-radio"
                                                    type="radio"
                                                    name="status" value={"at-risk"}
                                                    onChange={(e) =>
                                                        setSelectedProject({ ...project, status: e.target.value as IProjectStatus })} /> At Risk </label>
                                                <label><input
                                                    className="uk-radio"
                                                    type="radio"
                                                    name="status"
                                                    value={"completed"}
                                                    onChange={(e) =>
                                                        setSelectedProject({ ...project, status: e.target.value as IProjectStatus })} /> Completed </label>
                                            </div>
                                            <div className="uk-margin">
                                                <div style={{ marginBottom: ".3rem" }}>
                                                    <label className="uk-form-label" htmlFor="start">Start Date</label>
                                                    <input id="start"
                                                        disabled={me.uid !== project.manager}
                                                        className="uk-input" type="date"
                                                        placeholder="Start Date"
                                                        defaultValue={project.startDate}
                                                        onChange={(e) =>
                                                            setSelectedProject({ ...project, startDate: e.target.value })} />
                                                </div>

                                                <div style={{ marginBottom: ".3rem" }}>
                                                    <label className="uk-form-label" htmlFor="end">End Date</label>
                                                    <input id="end" disabled={me.uid !== project.manager} className="uk-input" type="date" placeholder="Start Date" defaultValue={project.endDate}
                                                        onChange={(e) => setSelectedProject({ ...project, endDate: e.target.value })} />
                                                </div>
                                            </div>
                                            <button className="save-project"
                                                disabled={me.uid !== project.manager}
                                                type="submit">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-save">
                                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                                    <polyline points="7 3 7 8 15 8"></polyline>
                                                </svg>
                                                <span>Save</span>
                                            </button>
                                            <button className="delete-project" disabled={me?.uid !== project.manager} onClick={handleDeleteProject}
                                                type="button">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                                <span>Delete Project</span>
                                            </button>
                                            {loading && <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", display: "grid", placeItems: "center", backgroundColor: "#00000015" }}><div data-uk-spinner="ratio: 2"></div></div>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Modals */}
            <ErrorBoundary>
                <Modal modalId={MODAL_NAMES.PROJECTS.CREATE_PROJECT}>
                    <NewProjectModal />
                </Modal>
            </ErrorBoundary>
        </ErrorBoundary>
    )
});

export default PortfolioProjects;