import { environment, expression, list } from "./types";
import { Environment } from "./environment";
import { RuntimeError } from "./checkedSpecials";

export interface Proc {
  call(args: expression): expression;
}

export class LambdaError extends RuntimeError {
  constructor(message: string) {
    super(message);
  }
}

export class Lambda implements Proc {
  constructor(
    readonly paramNames: list,
    readonly body: expression,
    readonly parentEnv: environment
  ) {}
  createLambdaEnv(args: list): Environment {
    const env = new Environment({}, this.parentEnv);
    if (args.length != this.paramNames.length) {
      throw new LambdaError(
        `Number of input args don't match number of param names: (paramNames: ${this.paramNames}, args: ${args})`
      );
    }
    for (let i = 0; i < args.length; i++) {
      env.map[this.paramNames[i] as string] = args[i];
    }
    return env;
  }

  call(args: list): expression {
    throw new Error(
      "This method shouldn't be called now that there is tail call optimization"
    );
  }
}

export class NativeLambda implements Proc {
  constructor(readonly builtIn: Function) {}
  call(args: expression): expression {
    return this.builtIn(args);
  }
}
