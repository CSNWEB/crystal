import type { GrafastResultsList, GrafastValuesList } from "../interfaces.js";
import { ExecutableStep } from "../step.js";
import { ListStep } from "./list.js";

export class LastStep<TData> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "LastStep",
  };
  isSyncAndSafe = true;
  allowMultipleOptimizations = true;

  constructor(parentPlan: ExecutableStep<ReadonlyArray<TData>>) {
    super();
    this.addDependency(parentPlan);
  }

  execute(
    values: [GrafastValuesList<ReadonlyArray<TData>>],
  ): GrafastResultsList<TData> {
    return values[0].map((list) => list?.[list?.length - 1]);
  }

  executeSingle = (meta: any, list: ReadonlyArray<TData>): TData => {
    return list?.[list?.length - 1];
  };

  deduplicate(peers: LastStep<TData>[]): LastStep<TData>[] {
    return peers;
  }

  optimize() {
    const parent = this.getDep(0);
    // The last of a list plan is just the last dependency of the list plan.
    if (parent instanceof ListStep) {
      return this.getStep(parent.dependencies[parent.dependencies.length - 1]);
    }
    return this;
  }
}

/**
 * A plan that resolves to the last entry in the list returned by the given
 * plan.
 */
export function last<TData>(
  plan: ExecutableStep<ReadonlyArray<TData>>,
): LastStep<TData> {
  return new LastStep(plan);
}
