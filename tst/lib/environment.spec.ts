import { expect } from "chai";
import "mocha";

import { createReplEnv } from "../../src/lib/environment";

describe("Environment", () => {
  it("can be created", () => {
    expect(createReplEnv()).to.not.null;
  });
  it("should have addition defined", () => {
    expect(createReplEnv()["+"]).to.be.not.undefined;
  });
});
