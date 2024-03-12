import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import Select from 'react-select';
import SingleSelect from "../../../shared/components/single-select/SingleSelect";
import makeAnimated from 'react-select/animated';
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultProject, IProject, IProjectStatus } from "../../../shared/models/ProjectManagement";
import MODAL_NAMES from "../ModalName";
import { getUsersEmail } from "../../project-management/utils/common";
import { USER_ROLES } from "../../../shared/functions/CONSTANTS";
import { MAIL_EMAIL, MAIL_PROJECT_TASK_ADDED } from "../../../shared/functions/mailMessages";

const NewProjectModal = observer(() => {
  const { api, store, ui } = useAppContext();
  const me = store.auth.meJson;
  const role = store.auth.role;
  const portfolios = store.portfolio.all.map(item => item.asJson);
  const [loading, setLoading] = useState(false);
  const [portfolioId, setSearchPort] = useState("");
  const animatedComponents = makeAnimated();
  const [project, setProject] = useState<IProject>({ ...defaultProject });

  const users = store.user.all.map(u => u.asJson).map(user => ({
    value: user.uid,
    label: user.displayName
  })).filter(user => user.value !== me?.uid);


  const currency = [
    "NAD",
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "NZD",
    "YEN",
  ]
    ;
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (me) {
      const $project: IProject = {
        ...project,
        usersId: [me.uid, ...project.usersId],
        portfolioId: portfolioId,
        manager: me.uid,
        department: me.department,
      }
      await create($project);
    }
    setLoading(false); // stop loading
    onCancel();
  };

  const create = async (project: IProject) => {
    if (!me) return;
    try {
      await api.projectManagement.createProject(project);

      const DEV_MODE = !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      if (!DEV_MODE && !project.usersId) return;
      const emails = getUsersEmail(project.usersId.filter(id => id !== me.uid), store);
      const { MY_SUBJECT, MY_BODY } = MAIL_PROJECT_TASK_ADDED(me.displayName, project.projectName, "project");
      await api.mail.sendMail(emails, MAIL_EMAIL, [me.email!], MY_SUBJECT, MY_BODY);

    } catch (error) { }
  };

  const options = portfolios.map((portfolio) => ({
    label: portfolio.portfolioName,
    value: portfolio.id || ""
  }));

  const onSearch = (value: string) => setSearchPort(value);

  const onCancel = () => {
    setProject(defaultProject)
    hideModalFromId(MODAL_NAMES.PROJECTS.CREATE_PROJECT);
  };

  useEffect(() => {
    if (portfolios.length < 1) {
      const FetchPortfolio = async () => {
        if (!me) return;
        if (role === USER_ROLES.EXECUTIVE_USER || role === USER_ROLES.GUEST_USER || role === USER_ROLES.SUPER_USER)
          await api.projectManagement.getAllPortfolios();
        else if (role === USER_ROLES.EMPLOYEE_USER || role === USER_ROLES.MANAGER_USER)
          await api.projectManagement.getDepartmentPortfolios(me.department);
      }
      FetchPortfolio().catch()
    }
  }, [api.projectManagement, portfolios.length, me, role]);



  return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical" data-uk-overflow-auto>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Project</h3>
      <div className="dialog-content uk-position-relative">
        <form onSubmit={handleSubmit}>
          <fieldset className="uk-fieldset">
            <div className="uk-margin">
              <input
                className="uk-input"
                required type="text"
                placeholder="Project name"
                onChange={(e) => setProject({ ...project, projectName: e.target.value })} />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="objectives">Which company objectives is the project linked to?</label>
              <input className="uk-input" type="text" placeholder="objectives"
                onChange={(e) => setProject({ ...project, objectives: e.target.value })} />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="status">Status</label>
              <select id="status" className="uk-select" defaultValue="active" name="status"
                onChange={(e) => setProject({ ...project, status: e.target.value as IProjectStatus })}>
                <option value={"active"}>Active</option>
                <option value={"on-hold"}>On-Hold</option>
                <option value={"at-risk"}>At-Risk</option>
                <option value={"completed"}>Completed</option>
              </select>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="portfolio">Portfolio</label>
              <SingleSelect
                name="portifolio"
                options={options}
                width="100%"
                onChange={onSearch}
                placeholder="Choose portfolio"
              />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="portfolio">Select project members</label>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                onChange={(value: any) => setProject({ ...project, usersId: value.map((t: any) => t.value) })}
                isMulti
                placeholder="Search users"
                options={users}
              />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="start">Start Date</label>
              <input id="start" required className="uk-input" type="date" placeholder="Start Date"
                onChange={(e) => setProject({ ...project, startDate: e.target.value })} />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="end">End Date</label>
              <input id="end" required className="uk-input" type="date" placeholder="End Date"
                onChange={(e) => setProject({ ...project, endDate: e.target.value })} />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="status">Currency ({project.currency})</label>
              <select id="status" className="uk-select" defaultValue="NAD" name="currency"
                onChange={(e) => setProject({ ...project, currency: e.target.value })}>
                {currency.map((currency, index) => (<option key={index} value={currency}>{currency}</option>))}
              </select>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="budgeted-amount">Budgeted Amount ({project.currency})</label>
              <input required className="uk-input" type="number" placeholder={`Cost (${project.currency})`}
                onChange={(e) => setProject({ ...project, budgetedAmount: e.target.valueAsNumber })} />
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="awarded-amount">Awarded Amount ({project.currency})</label>
              <input required className="uk-input" type="number" placeholder={`Cost (${project.currency})`}
                onChange={(e) => setProject({ ...project, awardedAmount: e.target.valueAsNumber })} />
            </div>
            <div className="uk-margin">
              <textarea className="uk-textarea" rows={2} placeholder="Description" required
                onChange={(e) => setProject({ ...project, description: e.target.value })}></textarea>
            </div>
          </fieldset>
          <div className="uk-width-1-1 uk-text-right">
            <button
              className="btn-text uk-margin-right"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default NewProjectModal;