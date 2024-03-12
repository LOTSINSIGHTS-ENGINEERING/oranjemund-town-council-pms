import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import SingleSelect, {
  IOption,
} from "../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../shared/functions/Context";
import User from "../../shared/models/User";
import Toolbar from "../shared/components/toolbar/Toolbar";
import EmptyError from "./EmptyError";
import UserItem from "./UserItem";

const UserList = observer(() => {
  const { store } = useAppContext();
  const [search, setSearch] = useState("");

  const sortByName = (a: User, b: User) => {
    if ((a.asJson.displayName || "") < (b.asJson.displayName || "")) return -1;
    if ((a.asJson.displayName || "") > (b.asJson.displayName || "")) return 1;
    return 0;
  };

  const me = store.auth.meJson;

  const users = useMemo(() => {
    const _users =
      (me &&
        store.user.all.filter(($users) => {
          if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
            return $users;
          else return !$users.asJson.devUser;
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

  return (
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
      <div className="users-list">
        <ErrorBoundary>
          {users.sort(sortByName).map((user) => (
            <div key={user.asJson.uid}>
              <UserItem user={user.asJson} />
            </div>
          ))}
        </ErrorBoundary>
        <ErrorBoundary>
          {!store.user.all.length && (
            <EmptyError errorMessage="No users found" />
          )}
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
});

export default UserList;
