import { observer } from "mobx-react-lite";
import React, { FormEvent, useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import { defaultPortfolio, IPortfolio } from "../../../shared/models/Portfolio";
import MODAL_NAMES from "../ModalName";

const NewPortfolioModal = observer(() => {
    const { api, store } = useAppContext();
    const me = store.auth.meJson;

    const [portfolio, setPortfolio] = useState<IPortfolio>({ ...defaultPortfolio });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (me) {
            const $portfolio: IPortfolio = {
                ...portfolio,
                department: me.department,
                colors: ["#8ecae6", "#219ebc", "#023047"],
                textColor: 'black'
            }
            await api.projectManagement.createPortfolio($portfolio);
        }
        setLoading(false); // stop loading
        onCancel();
    };

    const onCancel = () => {
        hideModalFromId(MODAL_NAMES.PROJECTS.CREATE_PORTFOLIO);
    };

    return (
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical" data-uk-overflow-auto>
            <button
                className="uk-modal-close-default"
                type="button"
                data-uk-close
            ></button>
            <h3 className="uk-modal-title">Create Portfolio</h3>
            <div className="dialog-content uk-position-relative">
                <form onSubmit={handleSubmit}>
                    <fieldset className="uk-fieldset">
                        <div className="uk-margin">
                            <input className="uk-input" type="text" placeholder="Portfolio Name"
                                onChange={(e) => setPortfolio({ ...portfolio, portfolioName: e.target.value })} />
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

export default NewPortfolioModal;