import chalk from "chalk";
import type {
  AccessStep,
  CrystalResultsList,
  CrystalValuesList,
} from "dataplanner";
import { access, ExecutableStep } from "dataplanner";

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | Array<JSONValue>;

/**
 * This plan accepts as JSON string as its only input and will result in the
 * parsed JSON object (or array, boolean, string, etc).
 */
export class JSONParseStep<
  TJSON extends JSONValue,
> extends ExecutableStep<TJSON> {
  static $$export = {
    moduleName: "@dataplan/json",
    exportName: "JSONParseStep",
  };
  // We're not safe because if parsing JSON fails we'll include a rejected
  // promise.
  isSyncAndSafe = false;

  constructor($stringPlan: ExecutableStep<string | null>) {
    super();
    this.addDependency($stringPlan);
  }

  toStringMeta(): string {
    return chalk.bold.yellow(String(this.dependencies[0]));
  }

  get<TKey extends keyof TJSON>(
    key: TKey,
  ): AccessStep<
    TJSON extends { [key: string]: unknown } ? TJSON[TKey] : never
  > {
    return access(this, [key as string]);
  }

  at<TIndex extends keyof TJSON & number>(
    index: TIndex,
  ): AccessStep<TJSON[TIndex]> {
    return access(this, [index]);
  }

  execute(values: [CrystalValuesList<string>]): CrystalResultsList<TJSON> {
    return values[0].map((v) => {
      if (typeof v === "string") {
        try {
          return JSON.parse(v);
        } catch (e) {
          return Promise.reject(e);
        }
      } else if (v == null) {
        return null;
      } else {
        return Promise.reject(
          new Error(
            `JSONParseStep: expected string to parse, but received ${
              Array.isArray(v) ? "array" : typeof v
            }`,
          ),
        );
      }
    }) as CrystalResultsList<TJSON>;
  }
}

/**
 * This plan accepts as JSON string as its only input and will result in the
 * parsed JSON object (or array, boolean, string, etc).
 */
export function jsonParse<TJSON extends JSONValue>(
  $string: ExecutableStep<string | null>,
): JSONParseStep<TJSON> {
  return new JSONParseStep<TJSON>($string);
}

Object.defineProperty(jsonParse, "$$export", {
  value: {
    moduleName: "@dataplan/json",
    exportName: "jsonParse",
  },
});
