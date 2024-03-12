import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../../shared/config/firebase-config";
import { MAIL_EMAIL } from "../../../shared/functions/mailMessages";
import "./task.scss";

export interface IProps {
  milestone: string;
  project: string;
  projectId: string;
}

const AttachmentModal = observer((props: IProps) => {

  const { milestone, project, projectId } = props

  const { api, store } = useAppContext();
  const me = store.auth.meJson;
  const [to, setTo] = useState<string>("")

  const [file, setFile] = useState<File>();

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<string>(`
 Dear Finance.

 Find a copy for the budget attached below.
 For completion of ${milestone} (milestone) in ${project}.

 Regards
${me?.displayName}.`);


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const fileValue = e.target.files?.[0] as File || null;

    if (!fileValue) return;
    setFile(fileValue)
  };

  const onCancel = () => {
    setLoading(false)
    hideModalFromId(MODAL_NAMES.PROJECTS.ATTACH_MILESTONE_BILL);
  };


  const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)

    if (!file) return;

    const filePath = `completedMilestones/${projectId}/${file.name}`;
    const uploadTask = uploadBytesResumable(ref(storage, filePath), file);

    uploadTask.on('state_changed', (snapshot) => { }, (error) => { }, () => {

      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

        const $message = [message.split(".").join(`.<br/><br/>`)];
        const body = [`${$message}`, ""];
        const $msg = body.join("<br/>");

        const msg = $msg.concat(`</br><a href="${downloadURL}" download>${file.name}</a>`);

        await api.mail.sendMail([to], MAIL_EMAIL,[me?.email!], "Milestone Budget", msg)

        setLoading(false)
        onCancel()
      });
    });
  }


  return (
    <div className="user-modal uk-modal-dialog uk-modal-body uk-margin-auto-vertical" data-uk-overflow-auto>
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Send Email to {to}</h3>
      <div className="dialog-content uk-position-relative">
        <form onSubmit={onSubmit} className="comment-form">
          <div className="uk-margin">
            <div className="uk-margin">
              <h5>Email</h5>
              <input
                className="uk-input"
                required
                type="email"
                placeholder="Email"
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <h5>Message</h5>
            <div className="send-msg">
              <textarea className="uk-textarea"
                style={{ resize: "none" }}
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}>
              </textarea>
            </div>
            <div className="attachments">
              <h5>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-paperclip">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
                &nbsp; Attachments &nbsp;&nbsp;
                <div className="upload" data-uk-tooltip="Upload File" data-uk-form-custom>
                  <div data-uk-form-custom>
                    <input type="file" onChange={handleFileUpload} />
                    <button className="file-upload" type="button" tabIndex={-1}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-upload">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </h5>
              <span>{file?.name}</span>
            </div>
            <div className="uk-margin-top uk-flex">
              <div className="uk-margin-small-right">
                <button className="uk-margin btn btn-primary" type="button" onClick={onCancel}>
                  Cancel
                </button>
              </div>
              <div>
                <button className="uk-margin btn btn-primary" type="submit" disabled={loading}>
                  Send
                  {loading && <div className="uk-margin-left" data-uk-spinner="ratio: .4"></div>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default AttachmentModal;