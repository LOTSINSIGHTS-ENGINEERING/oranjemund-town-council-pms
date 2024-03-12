import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import SingleSelect from "../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../shared/functions/Context";
import useTitle from "../../shared/hooks/useTitle";
import Toolbar from "../shared/components/toolbar/Toolbar";
import UserItem from "./UserItem";
import useBackButton from "../../shared/hooks/useBack";
import { USER_ROLES } from "../../shared/functions/CONSTANTS";
import User from "../../shared/models/User";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import NoScorecardData from "../shared/components/no-scorecard-data/NoScorecardData";

const People = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const role = store.auth.role;
  const me = store.auth.meJson;
  const department = store.auth.department;

  useTitle("People");
  useBackButton();

  const onSearch = (value: string) => setSearch(value);

  const users = useMemo(() => {
    let _users: User[] = [];

    switch (role) {
      case USER_ROLES.MD_USER:
        _users = [...store.user.all];
        break;
      case USER_ROLES.SUPER_USER:
        _users = [...store.user.all];
        break;
      case USER_ROLES.EXECUTIVE_USER:
        _users = [
          ...store.user.all.filter((u) => {
            return u.asJson.department === department;
          }),
        ];
        break;
      case USER_ROLES.MANAGER_USER:
        _users = [
          ...store.user.all.filter((u) => {
            return me && u.asJson.supervisor === me.uid;
          }),
        ];
        break;
      case USER_ROLES.SUPERVISOR_USER:
        _users = [
          ...store.user.all.filter((u) => {
            return me && u.asJson.supervisor === me.uid;
          }),
        ];
        break;
      default:
        _users = [
          ...store.user.all.filter((u) => {
            return me && u.asJson.supervisor === me.uid;
          }),
        ];
        break;
    }

    return search ? _users.filter((u) => u.asJson.uid === search) : _users;
  }, [department, me, role, search, store.user.all]);

  const groupedByDepartment = useMemo(() => {
    const departments = store.department.all;
    const grouped = departments.map((department) => {
      return {
        id: department.asJson.id,
        department: department.asJson.name,
        users: users.filter((u) => {
          if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
            return u.asJson.department === department.asJson.id;
          else
            return (
              u.asJson.department === department.asJson.id && !u.asJson.devUser
            ); // production code
        }),
      };
    });
    return grouped;
  }, [store.department.all, users]);

  const options = users.map((user) => ({
    label: user.asJson.displayName || "",
    value: user.asJson.uid,
  }));

  useEffect(() => {
    // load users from db
    const loadAll = async () => {
      setLoading(true); // start loading
      try {
        await api.user.getAll();
        await api.department.getAll();
      } catch (error) {
        console.log("Error: ", error);
      }
      setLoading(false); // stop loading
    };
    loadAll();
  }, [api.department, api.user]);

  if (loading)
    return (
      <ErrorBoundary>{loading && <LoadingEllipsis fullHeight />}</ErrorBoundary>
    );

  if (users.length === 0)
    return (
      <ErrorBoundary>
        <NoScorecardData
          title="No subordinates found."
          subtitle="You do not have subordinates/employees reporting to you"
          instruction="Please contact IT if there is a mix-up."
        />
      </ErrorBoundary>
    );

  return (
    <ErrorBoundary>
      <div className="performance-team uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <ErrorBoundary>
            <Toolbar
              rightControls={
                <ErrorBoundary>
                  <SingleSelect
                    name="search-team"
                    options={options}
                    width="250px"
                    onChange={onSearch}
                    placeholder="Search by name"
                  />
                </ErrorBoundary>
              }
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <div
              className="uk-grid-small uk-grid-match uk-child-width-1-2 uk-child-width-1-3@m uk-child-width-1-4@l"
              data-uk-grid
            >
              {groupedByDepartment.map((dep) => (
                <ErrorBoundary key={dep.id}>
                  {dep.users.length !== 0 && (
                    <ErrorBoundary>
                      <div className="uk-width-1-1 uk-margin-top">
                        {dep.department}
                      </div>
                      <ErrorBoundary>
                        {dep.users.map((user) => (
                          <div key={user.asJson.uid}>
                            <UserItem user={user.asJson} />
                          </div>
                        ))}
                      </ErrorBoundary>
                    </ErrorBoundary>
                  )}
                </ErrorBoundary>
              ))}
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default People;
