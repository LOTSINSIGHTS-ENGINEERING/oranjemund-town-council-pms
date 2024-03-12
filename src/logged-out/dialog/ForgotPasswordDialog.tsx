import { observer } from "mobx-react-lite";
import { FormEvent, useState } from "react";
import { useAppContext } from "../../shared/functions/Context";
import { hideModalFromId } from "../../shared/functions/ModalShow";
import { PASSWORD } from "./Dialogs";

const ForgotPasswordDialog = observer(() => {
    const [loading, setLoading] = useState(false);
    const { api } = useAppContext()

    const [email, setEmail] = useState("");

    const onReset = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        await api.auth.passwordResetWithEmail(email);
        setLoading(false);
    };

    const onClose = () => {
        hideModalFromId(PASSWORD.FORGOT_PASSWORD_DIALOG)
    };

    return (
        <div className="forgot-password uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
            <button className="uk-modal-close-default" type="button" data-uk-close />
            <h3 className="uk-modal-title">Reset password</h3>
            <div className="dialog-content uk-position-relative">
                <form className="uk-form-stacked" onSubmit={onReset}>
                    <div className="uk-margin">
                        <label className="uk-form-label" htmlFor="user-password-email">
                            Email
                        </label>
                        <div className="uk-form-controls">
                            <input
                                className="uk-input"
                                id="user-password-email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="uk-margin">
                        <button className="uk-button uk-button-primary uk-margin-right" type="submit">
                            Send password reset link
                            {loading && (<div className="uk-margin-small-left" data-uk-spinner="ratio: 0.5" />)}
                        </button>
                        <button
                            className="uk-button uk-remove-padding"
                            type="button"
                            onClick={onClose}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default ForgotPasswordDialog;
