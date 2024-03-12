import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import useTitle from '../../shared/hooks/useTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import showModalFromId from '../../shared/functions/ModalShow';
import MODAL_NAMES from '../dialogs/ModalName';
import ErrorBoundary from '../../shared/components/error-boundary/ErrorBoundary';
import Modal from '../../shared/components/Modal';
import NewPortfolioModal from '../dialogs/project-management/NewPortfolioModal';
import { useAppContext } from '../../shared/functions/Context';
import Portfolio from '../../shared/models/Portfolio';
import PortfolioItem from './components/portfolioItem';
import "./styles/projects.style.scss";
import Filter from './utils/filter';
import { USER_ROLES } from '../../shared/functions/CONSTANTS';


const PortfolioPage = observer(() => {
    useTitle("Portfolios");
    // useBackButton("/c/c");
    const { api, store } = useAppContext();
    const me = store.auth.meJson;
    const role = store.auth.role;

    const projects = store.projectManagement.all.map(p => p.asJson);
    // const portfolios = store.portfolio.all.map(p => p.asJson).filter(p => p.department === me?.department);
    const department = store.department.all.map((d) => ({ id: d.asJson.id, name: d.asJson.name }));

    const [selectedValue, setSelectedValue] = useState("all");

    const sortByName = (a: Portfolio, b: Portfolio) => {
        return (a.asJson.portfolioName || "").localeCompare(
            b.asJson.portfolioName || ""
        );
    };

    const portfolios = () => {
        let portfolios: Portfolio[] = [];
        if (role === USER_ROLES.SUPER_USER || role === USER_ROLES.EXECUTIVE_USER || role === USER_ROLES.MD_USER)
            return portfolios = store.portfolio.all.sort(sortByName);

        else if (role === USER_ROLES.MANAGER_USER || role === USER_ROLES.EMPLOYEE_USER)
            portfolios = store.portfolio.all.sort(sortByName).filter((p) => {
                return p.asJson.department === me?.department;
            });
        return portfolios;
    };

    const handleNewPortfolio = () => {
        showModalFromId(MODAL_NAMES.PROJECTS.CREATE_PORTFOLIO);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!projects.length) await api.projectManagement.getAllProjects();
        }
        fetchData().catch();
    }, [api.projectManagement]);


    useEffect(() => {
        const fetchData = async () => {
            await api.department.getAll();
            await api.projectManagement.getAllPortfolios();
        }
        fetchData()
    }, [api.department, api.projectManagement]);


    return (
        <ErrorBoundary>
            <div style={{ padding: "1rem" }}>
                <div className="p-navbar">
                    <button className="btn btn-primary" type="button">
                        <span>Filter&nbsp;&nbsp;</span>
                        <FontAwesomeIcon
                            icon={faFilter}
                            className="icon uk-margin-small-right"
                        />
                    </button>
                    <div uk-drop="mode: click">
                        <Filter list={[...department, { name: "All Departments", id: "all" }]}
                            selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="btn btn-primary" onClick={handleNewPortfolio}>
                        <span>New Portfolio&nbsp;&nbsp;</span>
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="icon uk-margin-small-right"
                        />
                    </button>
                </div>
                <div className='portfolios'>
                    {portfolios().filter((p) => {
                        if (selectedValue === "all") return p;
                        else if (p.asJson.department === selectedValue) return p
                    }).map((p) => {
                        return <PortfolioItem
                            key={p.asJson.id}
                            portfolioName={p.asJson.portfolioName}
                            icon={p.asJson.icon} colors={p.asJson.colors}
                            textColor={p.asJson.textColor} id={p.asJson.id}
                            department={p.asJson.department}
                            section={p.asJson.section} />
                    })
                    }
                </div>
            </div>
            {/* Modals */}
            <ErrorBoundary>
                <Modal modalId={MODAL_NAMES.PROJECTS.CREATE_PORTFOLIO}>
                    <NewPortfolioModal />
                </Modal>
            </ErrorBoundary>
        </ErrorBoundary>
    )
});

export default PortfolioPage;