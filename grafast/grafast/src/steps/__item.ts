import chalk from "chalk";

import type { ExecutableStep } from "../step.js";
import { $$deepDepSkip, $$noExec, UnbatchedExecutableStep } from "../step.js";

/**
 * An __ItemStep is an internal plan (users must never construct it
 * themselves!) that Grafast uses to refer to an individual item within a list
 * or stream.
 */
export class __ItemStep<TData> extends UnbatchedExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__ItemStep",
  };
  isSyncAndSafe = true;
  [$$noExec] = true;

  /**
   * @internal
   */
  public transformStepId?: number;

  constructor(
    parentPlan: ExecutableStep<TData> | ExecutableStep<TData[]>,
    public readonly depth = 0,
  ) {
    super();
    this.addDependency(parentPlan);
  }

  toStringMeta(): string {
    return chalk.bold.yellow(
      String(this.opPlan.dangerouslyGetStep(this.dependencies[0]).id),
    );
  }

  [$$deepDepSkip](): ExecutableStep {
    return this.getDep(0);
  }

  execute(): never {
    throw new Error("__ItemStep must never execute");
  }
  executeSingle(): never {
    throw new Error("__ItemStep must never execute");
  }

  public finalize(): void {
    super.finalize();
    if (this.transformStepId != null) {
      this.transformStepId = this.opPlan.dangerouslyGetStep(
        this.transformStepId,
      ).id;
    }
  }
}
