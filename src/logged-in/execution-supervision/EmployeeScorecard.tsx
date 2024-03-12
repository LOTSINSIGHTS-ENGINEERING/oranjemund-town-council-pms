import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import SingleSelect from "../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import useTitle from "../../shared/hooks/useTitle";
import Toolbar from "../shared/components/toolbar/Toolbar";
import UserItem from "./UserItem";
import NoScorecardData from "../shared/components/no-scorecard-data/NoScorecardData";

interface IOption {
  label: string;
  value: string;
}

const EmployeeScorecard = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useTitle("Employee");
  useBackButton();

  const me = store.auth.meJson;

  const users = useMemo(() => {
    const _users =
      (me &&
        store.user.all.filter((u) => {
          if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
            return u.asJson.uid !== me.uid;
          else return u.asJson.uid !== me.uid && !u.asJson.devUser; // production code
        })) ||
      [];

    return search !== ""
      ? _users.filter((u) => u.asJson.uid === search)
      : _users;
  }, [me, search, store.user.all]);

  const options: IOption[] = useMemo(
    () =>
      users.map((user) => {
        return { label: user.asJson.displayName || "", value: user.asJson.uid };
      }),
    [users]
  );

  const onSearch = (value: string) => setSearch(value);

  useEffect(() => {
    // load users from db.
    const loadAll = async () => {
      if (!me) return; // TODO: handle error

      setLoading(true); // start loading
      try {
        await api.user.getImmediateSubordinates(me.uid);
      } catch (error) {
        console.log("Error: ", error);
      }
      setLoading(false); // stop loading
    };

    loadAll();
  }, [api.user, me]);

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
      <div className="team-supervision uk-section uk-section-small">
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
              {users.map((user) => (
                <div key={user.asJson.uid}>
                  <UserItem user={user.asJson} />
                </div>
              ))}
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default EmployeeScorecard;
