import type { ExecutionArgs } from "graphql";

import { hook, NULL_PRESET } from "./config.js";
import { isPromiseLike } from "./utils.js";

/**
 * Applies Graphile Config hooks to your GraphQL request, e.g. to
 * populate context or similar.
 *
 * @experimental
 */
export function hookArgs(
  args: ExecutionArgs,
  resolvedPreset: GraphileConfig.ResolvedPreset,
  ctx: Partial<Grafast.RequestContext>,
): ExecutionArgs | PromiseLike<ExecutionArgs> {
  // FIXME: assert that args haven't already been hooked

  // Make context mutable
  args.contextValue = Object.assign(Object.create(null), args.contextValue);

  // finalize(args): args is deliberately shadowed
  const finalize = (args: ExecutionArgs) => {
    const userContext = resolvedPreset.grafast?.context;
    if (typeof userContext === "function") {
      const result = userContext(ctx, args.contextValue as Record<string, any>);
      if (isPromiseLike(result)) {
        // Deliberately shadowed 'result'
        return result.then((result) => {
          Object.assign(args.contextValue as Record<string, any>, result);
          return args;
        });
      } else {
        Object.assign(args.contextValue as Record<string, any>, result);
        return args;
      }
    } else if (typeof userContext === "object" && userContext !== null) {
      Object.assign(args.contextValue as Record<string, any>, userContext);
      return args;
    } else {
      return args;
    }
  };

  if (
    resolvedPreset !== NULL_PRESET &&
    resolvedPreset.plugins &&
    resolvedPreset.plugins.length > 0
  ) {
    const event = { args };
    const extra = { ctx, resolvedPreset };
    const result = hook(resolvedPreset, "args", event, extra);
    if (isPromiseLike(result)) {
      return result.then(() => finalize(event.args));
    } else {
      return finalize(event.args);
    }
  }
  return finalize(args);
}
