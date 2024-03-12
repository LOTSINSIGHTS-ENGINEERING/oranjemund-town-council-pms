import React, { useEffect } from "react";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../shared/functions/Context";

export const ReportingTo = observer(() => {
  const { store, api } = useAppContext();

  const users = store.user.all;
  //   .filter((u) => u.asJson.role === "Employee");
  const allUser = store.user.all;

  useEffect(() => {
    const getData = async () => {
      await api.user.getAll();
    };
    getData();
  }, [api.user]);

  return (
    <ErrorBoundary>
      <div className="business-unit-list">
        <div className="department uk-card uk-card-default uk-card-body uk-card-small">
          <div className="uk-grid-small uk-grid-match" data-uk-grid>
            <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
              <table className="uk-table uk-table-small uk-table-divider">
                <thead>
                  <tr style={{fontSize:"12px"}}>
                    <th>Employee</th>
                    <th>Role</th>
                    <th>Reporting To</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr style={{fontSize:"12px"}}>
                      <td>{u.asJson.displayName}</td>
                      <td>{u.asJson.role}</td>
                      <td>
                        {allUser.find(
                          (s) => s.asJson.uid === u.asJson?.supervisor
                        )?.asJson.displayName || "Reporting to no one"}
                      </td>
                      <td>
                        {
                          allUser.find(
                            (s) => s.asJson.uid === u.asJson.supervisor
                          )?.asJson.role
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
});
