import { useEffect, useMemo, useState } from "react";
import useTitle from "../../shared/hooks/useTitle";
import { useAppContext } from "../../shared/functions/Context";
import useBackButton from "../../shared/hooks/useBack";
import { observer } from "mobx-react-lite";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useNavigate, useParams } from "react-router-dom";
import CheckInUserItem from "./CheckIUserItem";
import User from "../../shared/models/User";
import Toolbar from "../shared/components/toolbar/Toolbar";
import SingleSelect, { IOption } from "../../shared/components/single-select/SingleSelect";

const CheckInMonthView = observer(() => {
  const { api, store } = useAppContext();
  const { monthId = 'defaultMonthId' } = useParams<{ monthId?: string }>();

  const [loading, setLoading] = useState(false);
  const [_, setTitle] = useTitle();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const onSearch = (value: string) => setSearch(value);

  const month = store.checkIn.checkInMonth.getById(monthId);

  useBackButton(`/c/checkin/${month?.asJson.yearId}`);
  useTitle("People");

  const users = useMemo(() => {
    const _users = store.user.all.filter(($users) => {
      return $users;
    }) || [];
    return search !== "" ? _users.filter((u) => u.asJson.uid === search) : _users;
  }, [search, store.user.all]);

  const options: IOption[] = useMemo(() =>
    users.map((user) => {
      return {
        label: user.asJson.displayName || "",
        value: user.asJson.uid
      };
    }), [users]);

  useEffect(() => {
    if (month) setTitle(`Check In for ${month.asJson.monthName}`);
    else navigate(`/c/checkin/`);
  }, [navigate, month, setTitle]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        if (store.user.all.length < 2) {
          await api.user.getAll()
        }
      } catch (error) { }
      setLoading(false)
    };
    loadData()
  });

  return (
    <ErrorBoundary>
      <div className="checkin-page uk-section uk-section-small">
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
            {!loading && month && (
              <div className="uk-grid-small" data-uk-grid>
                {users.map((user) => (
                  <CheckInUserItem
                    key={user.asJson.uid}
                    user={user.asJson}
                    month={month.asJson}
                  />
                ))}
              </div>
            )}
          </ErrorBoundary>
          {loading && <LoadingEllipsis />}
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default CheckInMonthView;
