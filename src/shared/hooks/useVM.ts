import { useEffect } from "react";
import { useAppContext } from "../functions/Context";

interface ReturnType {
  vision: string;
  mission: string;
  firstName: string;
}

const useVM = (): ReturnType => {
  const { store, api } = useAppContext();

  const vision = store.visionmission.all.map((vm) => vm.asJson.vision);
  const mission = store.visionmission.all.map((vm) => vm.asJson.mission);
  const firstName = store.auth.meJson?.firstName || "";

  useEffect(() => {
    const getUser = async () => {
      await api.user.getAll();
    };
    getUser();
  }, [api.user]);

  const returnType: ReturnType = {
    vision: vision[0],
    mission: mission[0],
    firstName: firstName,
  };
  return returnType;
};

export default useVM;
