import type { IconName } from "../../components/Icon";
import type { ServiceCategory } from "../types";

/** Icon for each service category; the tone class (.tone-<category>) gives its colour. */
export const serviceIcon: Record<ServiceCategory, IconName> = {
  identity: "id",
  certificates: "certificate",
  welfare: "family",
  food: "food",
  health: "health",
  money: "money",
  pension: "security",
  tax: "receipt",
  land: "map",
  housing: "home",
  farm: "farm",
  education: "education",
  jobs: "work",
  business: "store",
  transport: "bus",
  travel: "plane",
  utilities: "bolt",
  police: "shield",
  legal: "scale",
  grievance: "megaphone",
};
