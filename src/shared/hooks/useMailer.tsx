import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../functions/Context";
import { defaultUser, IUser } from "../models/User";

interface ReturnType {
  mailSupervisor: (subject: string, message: string) => Promise<void>;
  mailMe: (subject: string, message: string) => Promise<void>;
}

const useMailer = (): ReturnType => {
  const { store, api, ui } = useAppContext();
  const [supervisor, setSupervisor] = useState<IUser>({
    ...defaultUser,
  });
  const firstRender = useRef(true);
  const me = store.auth.meJson;

  const mailSupervisor = async (subject: string, message: string) => {
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

    const to = $to;
    const from = $from;

    try {
      await api.mail.scorecardMail(to, from, subject, message);
      // console.log("To :", $to, "from :", $from);
      // console.log("Supervisor email:", supervisor.email);
      ui.snackbar.load({
        id: Date.now(),
        message: "Email notification sent!",
        type: "success",
      });
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to send email notification.",
        type: "danger",
      });
    }
  };

  const mailMe = async (subject: string, message: string) => {
    if (!me || !supervisor) return; // if me is not defined, then return
    const $to = me.email;
    const $from = "no-reply@namcorpms.com";

    if (!$to) {
      // if no email, do not send
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Your email address is unknown.",
        type: "danger",
      });
      return;
    }

    const to = $to;
    const from = $from;

    try {
      await api.mail.scorecardMail(to, from, subject, message);
      // console.log("To :", $to, "from :", $from);
      // console.log("Current user email:", me.email);
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to send email notification.",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;

    // get supervisor profile / user
    const load = async () => {
      if (!me) return;
      const supervisorId = me.supervisor;
      try {
        await api.user.getByUid(supervisorId);
      } catch (error) { }
    };
    load();
  }, [api.user, me]);

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
    mailSupervisor,
    mailMe,
  };
  return returnType;
};

export default useMailer;
