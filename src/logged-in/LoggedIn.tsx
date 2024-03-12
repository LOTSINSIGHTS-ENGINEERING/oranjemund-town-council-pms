import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppContext } from "../shared/functions/Context";
import MainLayout from "./main-layout/MainLayout";
import Drawer from "./nagivation/Drawer";

const LoggedIn = observer(() => {
  const { api, store } = useAppContext();
  const [fetchingData, setFetchingData] = useState(true);
  const firstUpdate = useRef(true);

  const loadAll = useCallback(async () => {
    const me = store.auth.meJson;
    const scorecard = store.scorecard.activeId;
    if (!me || !scorecard) return; // TODO: handle error.

    try {
      await api.objective.getAll(me.uid); // load objectives
      await api.measure.getAll(me.uid); // load measures
      await api.measure.getAll(me.uid); // load measures
      await api.strategicTheme.getAll(scorecard); // load strategic themes
      await api.visionmission.getAll(); // load vsion and mission
    } catch (error) {
    }
  }, [api.measure, api.objective, store.auth.meJson, api.strategicTheme, api.visionmission, store.scorecard.activeId]);

  const loadActive = useCallback(async () => {
    setFetchingData(true);
    try {
      await api.scorecard.getActive(); // load active scorecard
      await loadAll(); // load all
    } catch (error) { }

    setFetchingData(false);
  }, [api.scorecard, loadAll]);

  useEffect(() => {
    loadActive(); // load active scorecard
  }, [loadActive]);

  useEffect(() => {
    if (!store.scorecard.active) return;
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    loadAll(); // load all
  }, [loadAll, store.scorecard, store.scorecard.active]);

  return (
    <div className="responsive-drawer">
      <Drawer />
      <MainLayout fetchingData={fetchingData} />
    </div>
  );
});

export default LoggedIn;
