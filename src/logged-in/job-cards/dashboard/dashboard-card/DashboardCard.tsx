// DashboardCard.tsx

import React from "react";
import "./DashboardCard.scss";
import { Link } from "react-router-dom";

interface DashboardCardProps {
  cardValue: string | number;
  cardTitle: string;
  cardLink: string;
  cardColour: React.CSSProperties;
}

const DashboardCard = (props: DashboardCardProps) => {
  return (
    <div className="dashboard-card uk-card-hover">
      <div className="dashboard-card-body">
        <p>{props.cardTitle}</p>
        <h3 className="main-title-alt uk-text-bold">{props.cardValue}</h3>
      </div>
      <div className="dashboard-card-footer">
        {/* Uncomment the following link if you want to include it */}
        {/* <Link className="dashboard-card-link" to={props.cardLink}>
          View Members <span className="dashboard-card-link-icon" data-uk-icon="icon: arrow-right"></span>
        </Link> */}
        <div style={props.cardColour} className="dashboard-card-bar"></div>
      </div>
    </div>
  );
};

export default DashboardCard;
