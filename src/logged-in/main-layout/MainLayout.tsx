import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loading from "../../shared/components/loading/Loading";
import Navbar from "../nagivation/Navbar";

interface IProps {
  fetchingData: boolean;
}
const MainLayout = (props: IProps) => {
  const { fetchingData } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === "/c") navigate("/dashboard");
  }, [navigate, pathname]);

  return (
    <main className="main-layout">
      <Navbar />
      {!fetchingData && <Outlet />}
      {fetchingData && <Loading fullHeight={true} />}
    </main>
  );
};

export default MainLayout;
