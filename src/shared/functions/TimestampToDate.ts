import { Timestamp } from "firebase/firestore";

export const serverTimestampInMillis = () => {
  const timestampMillis = Timestamp.now().toMillis();
  return timestampMillis;
};

export const timestampToDate = (timestamp: any): string => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    time: "numeric",
  };
  return timestamp.toDate().toLocaleDateString("en-US", options);
};

export const timestampToTime = (timestamp: any): string => {
  return timestamp.toDate().toLocaleTimeString("en-US");
};

export const mapMonthToAbbreviation = (month: number): string => {
  switch (month) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
    default:
      return "";
  }
};
