import { dirBn } from "./bn";
import { dirMr } from "./mr";
import { dirTa } from "./ta";
import { dirTe } from "./te";
import { dirKn } from "./kn";
import { dirMl } from "./ml";
import { dirGu } from "./gu";
import { dirPa } from "./pa";
import { dirOr } from "./or";
import { dirAs } from "./as";
import { dirUr } from "./ur";
import type { DirectoryText } from "../../directory/types";
import type { IndianLocale } from "../../types";

/** Service and job wording in each Indian state language. */
export const directoryText: Partial<Record<IndianLocale, DirectoryText>> = { bn: dirBn, mr: dirMr, ta: dirTa, te: dirTe, kn: dirKn, ml: dirMl, gu: dirGu, pa: dirPa, or: dirOr, as: dirAs, ur: dirUr };
