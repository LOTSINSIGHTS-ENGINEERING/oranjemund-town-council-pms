import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../functions/Context";
import {
  defaultScorecardMetadata,
  IScorecardMetadata,
} from "../models/ScorecardMetadata";

interface IReturnType {
  agreement: IScorecardMetadata;
  loading: boolean;
}

const useIndividualScorecard = (uid?: string): IReturnType => {
  const { store, api } = useAppContext();
  const [agreement, setAgreement] = useState<IScorecardMetadata>({
    ...defaultScorecardMetadata,
  });
  const [loading, setLoading] = useState(true);
  const firstRender = useRef(true);
  const me = store.auth.me;

  const metadataNotFound = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (!firstRender.current || !me) return;
    firstRender.current = false;

    const load = async () => {
      if (!me) return;
      const $uid = uid ? uid : me.asJson.uid;
      const $department = me.asJson.department;
      setLoading(true);
      try {
        await api.individualScorecardMetadata.getByUid($uid, metadataNotFound);
        await api.department.getById($department);
      } catch (error) {}
      setLoading(false);
    };

    load();
  }, [
    me,
    uid,
    api.individualScorecardMetadata,
    api.department,
    store.department,
  ]);

  useEffect(() => {
    if (!me) return;

    const $uid = uid ? uid : me.asJson.uid;

    const displayName: string | null = me.asJson.displayName || "No Found";
    const position: string = me.asJson.jobTitle || "Not Found";
    const role: string = me.asJson.role || "-";

    const supervisor = me.supervisor;
    const supervisorName: string = supervisor
      ? supervisor.asJson.displayName || "Undefined"
      : "Not Found";

    const department = me.department;
    const deparmentName: string = department
      ? department.asJson.name
      : "Not Found";
    const deparmentId: string = department ? department.asJson.id : "Not Found";

    const $agreement = store.individualScorecardMetadata.getById($uid); //   get uid user, or me
    if (!$agreement) return;

    // Metadata found. Stop loading.
    setLoading(false);

    setAgreement({
      ...defaultScorecardMetadata,
      ...$agreement.asJson,
      uid: $uid,

      supervisorId: me.asJson.supervisor,
      supervisorName: supervisorName,

      displayName: displayName,
      jobTitle: position,

      department: deparmentId,
      departmentName: deparmentName,
      role: role,
    });
  }, [
    me,
    store.department,
    store.individualScorecardMetadata,
    store.individualScorecardMetadata.all,
    store.user,
    uid,
  ]);

  const returnType = {
    agreement,
    loading,
  };
  return returnType;
};

export default useIndividualScorecard;
