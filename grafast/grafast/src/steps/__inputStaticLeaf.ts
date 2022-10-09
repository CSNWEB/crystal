import type { GraphQLLeafType, ValueNode } from "graphql";
import { valueFromAST } from "graphql";

import { UnbatchedExecutableStep } from "../step.js";

/**
 * Implements `InputStaticLeafStep`
 *
 * @see __InputDynamicScalarStep
 */
export class __InputStaticLeafStep<
  TLeaf = any,
> extends UnbatchedExecutableStep<TLeaf> {
  static $$export = {
    moduleName: "grafast",
    exportName: "__InputStaticLeafStep",
  };
  isSyncAndSafe = true;

  private readonly coercedValue: any;
  constructor(inputType: GraphQLLeafType, value: ValueNode | undefined) {
    super();
    // `coerceInputValue` throws on coercion failure. NOTE: it's only safe for
    // us to call coerceInputValue because we already know this is a scalar,
    // *not* a variable, and not an object/list therefore cannot _contain_ a
    // variable. Otherwise we'd need to process it via
    // opPlan.trackedVariableValuesStep.
    this.coercedValue = value != null ? valueFromAST(value, inputType) : value;
  }

  executeSingle(): TLeaf {
    return this.coercedValue;
  }

  eval(): TLeaf {
    return this.coercedValue;
  }

  evalIs(expectedValue: unknown): boolean {
    return this.coercedValue === expectedValue;
  }
}
