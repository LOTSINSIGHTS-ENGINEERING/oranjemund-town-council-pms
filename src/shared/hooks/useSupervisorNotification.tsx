import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "../functions/Context";
import { defaultUser, IUser } from "../models/User";

interface ReturnType {
  onNotify: (
    subject: string,
    message: string,
    $cc?: string[] | undefined
  ) => Promise<void>;
}

const useSupervisorNotification = (): ReturnType => {
  const { store, api, ui } = useAppContext();
  const [supervisor, setSupervisor] = useState<IUser>({
    ...defaultUser,
  });
  const firstRender = useRef(true);
  const me = store.auth.meJson;

  const onNotify = async (subject: string, message: string, $cc?: string[]) => {
    if (!me || !supervisor) return; // if me is not defined, then return
    const $to = supervisor.email;
    const $from = me.email;

    if (!$to) {
      // if no email, do not send
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Your supervisor email is unknown.",
        type: "danger",
      });
      return;
    }

    if (!$from) {
      // if no email, do not send
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Your email is unknown.",
        type: "danger",
      });
      return;
    }

    const to = [$to];
    const from = $from;
    const cc = $cc ? $cc : [];

    try {
      await api.mail.sendMail(
        ["ananiasdave@outlook.com"],
        "ananiasdave@gmail.com",
        cc,
        subject,
        message
      );
      ui.snackbar.load({
        id: Date.now(),
        message: "Email notification sent!",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to send email notification.",
        type: "danger",
      });
    }
  };

  // get supervisor profile / user
  const load = useCallback(async () => {
    if (!me) return;
    const supervisorId = me.supervisor;
    try {
      await api.user.getByUid(supervisorId);
    } catch (error) {}
  }, [api.user, me]);

  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;
    load();
  }, [load]);

  useEffect(() => {
    if (!me) return;

    const supervisorId = me.supervisor;
    const $supervisor = store.user.getById(supervisorId); // get supervisor id
    if (!$supervisor) return;

    setSupervisor({
      ...defaultUser,
      ...$supervisor.asJson,
    });
  }, [me, store.user, store.user.all]);

  const returnType: ReturnType = {
    onNotify,
  };
  return returnType;
};

export default useSupervisorNotification;
