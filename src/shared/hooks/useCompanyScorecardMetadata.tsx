import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../functions/Context";
import {
  defaultScorecardMetadata,
  IScorecardMetadata,
} from "../models/ScorecardMetadata";

const useCompanyScorecardMetadata = (
  scorecardId: string
): IScorecardMetadata => {
  const { store, api } = useAppContext();
  const [agreement, setAgreement] = useState<IScorecardMetadata>({
    ...defaultScorecardMetadata,
  });
  const firstRender = useRef(true);

  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;

    const load = async () => {
      try {
        await api.companyScorecardMetadata.getByUid(scorecardId);
      } catch (error) {
        console.log(error);
      }
    };

    load();
  }, [api.companyScorecardMetadata, scorecardId]);

  useEffect(() => {
    const $agreement = store.companyScorecardMetadata.getById(scorecardId); //   get uid user, or me
    if (!$agreement) return;

    setAgreement({
      ...defaultScorecardMetadata,
      ...$agreement.asJson,
    });
  }, [
    scorecardId,
    store.companyScorecardMetadata,
    store.companyScorecardMetadata.all,
  ]);

  const returnType: IScorecardMetadata = agreement;
  return returnType;
};

export default useCompanyScorecardMetadata;
