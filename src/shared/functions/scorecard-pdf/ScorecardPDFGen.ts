import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import DocDefinition, {
  bodyText,
  boldText,
  marginTopBottom,
  subSectionHeader,
} from "./DocDefition";
import Objective, { IObjective } from "../../models/Objective";
import Measure, { IMeasure } from "../../models/Measure";
import {
  dataTypeSymbol,
  totalFinalIndividualObjectiveRating,
} from "../../../logged-in/shared/functions/Scorecard";
import { useAppContext } from "../Context";
import { IUser } from "../../models/User";
import { observer } from "mobx-react-lite";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

// create pdf
const createPDF = async (name: string, docRef: any) => {
  const newWindow = window.open();
  pdfMake
    .createPdf((await DocDefinition(name, docRef)) as any)
    .open({}, newWindow);
};

// create tasks ref
// const tasksRef = (
//   objectiveIndex: number,
//   measureIndex: number,
//   tasks: any[]
// ) => {
//   // Return pdf->docRef of tasks
//   // Tasks
//   const tasksDocRef = tasks.map((task, taskIndex) =>
//     bodyText(
//       `${objectiveIndex + 1}.${measureIndex + 1}.${taskIndex + 1}. ${
//         task.asJson.name
//       }`
//     )
//   );

//   return tasksDocRef;
// };

//
// const getStaffDetails = useMemo(())


// Get measures that belong to objective
const getMeasures = (
  objective: IObjective,
  measures: Measure[]
): IMeasure[] => {
  return measures
    .filter((measure) => measure.asJson.objective === objective.id)
    .map((measure) => measure.asJson);
};

// create measure ref
const measuresRef = (
  objectiveIndex: number,
  measures: IMeasure[],
  tasksRef: any[]
) => {
  return measures.map((measure, index) => {
    const measureDocRef = [
      boldText(`${objectiveIndex + 1}.${index + 1}. ${measure.description}`),
      bodyText(
        `Baseline: ${dataTypeSymbol(measure.dataType).prefix}${
          measure.baseline
        }${dataTypeSymbol(measure.dataType).suffix}`
      ),
      bodyText(
        `Maximum: ${dataTypeSymbol(measure.dataType).prefix}${measure.rating5}${
          dataTypeSymbol(measure.dataType).suffix
        }`
      ),
      bodyText(
        `Minimum: ${dataTypeSymbol(measure.dataType).prefix}${measure.rating1}${
          dataTypeSymbol(measure.dataType).suffix
        }`
      ),
      bodyText(
        `Target: ${dataTypeSymbol(measure.dataType).prefix}${
          measure.annualTarget
        }${dataTypeSymbol(measure.dataType).suffix}`
      ),
      bodyText(
        `Actual value: ${dataTypeSymbol(measure.dataType).prefix}${
          measure.annualActual
        }${dataTypeSymbol(measure.dataType).suffix}`
      ),
      bodyText(`Measure's Rating value: ${measure.autoRating}/5`),
      // bodyText(
      //   `Measure's Supervisor Rating value: ${
      //     measure.ratingS || measure.rating
      //   }/5`
      // ),
      // bodyText(
      //   `Measure's Agreed Rating value: ${
      //     measure.ratingC || measure.rating
      //   }/5`
      // ),
      // marginTopBottom(),
      boldText("Record of Tasks performed under this Measure/KPI"),
      ...tasksRef,
      marginTopBottom(),
    ];

    return measureDocRef;
  });
};

// calculate rating
const calculateRating = (objective: IObjective, all_measures: Measure[]) => {
  const measures = getMeasures(objective, all_measures);
  const rating = totalFinalIndividualObjectiveRating(measures);
  return rating;
};

// create objective ref
const objectivesRef = (objectives: Objective[], measures: Measure[]) => {
  return objectives.map((objective, objectiveIndex) => {
    // Get measures belonging to objective

    // Return pdf->docRef of measures
    const measuresDocRef = measuresRef(
      objectiveIndex,
      getMeasures(objective.asJson, measures),
      []
    );

    // rating of objective
    const rating = calculateRating(objective.asJson, measures);

    // Objectives
    const objectiveDocRef = [
      marginTopBottom(),
      subSectionHeader(
        `${objectiveIndex + 1}. ${objective.asJson.description}`,
        `Objective score: ${rating}`
      ),
      bodyText(`Perspective: ${objective.asJson.perspective}`),
      // bodyText(`Status: ${objective.asJson.status}`),
      bodyText(`Description: ${objective.asJson.description}`),
      marginTopBottom(),
      boldText("Measures/KPIs"),
      ...measuresDocRef,
    ];

    return objectiveDocRef;
  });
};

const ScorecardPDFGen = async (
  scorecardName: string,
  objectives: Objective[],
  measures: Measure[]
) => {
  // Return pdf->docRef of objectives
  const docRef = objectivesRef(objectives, measures);

  // create pdf
  createPDF(scorecardName, docRef);
};

export default ScorecardPDFGen;
