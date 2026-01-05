import * as core from "@actions/core";
import semverParse from "semver/functions/parse.js";

try {
  const safeParse = core.getBooleanInput("safe-parse");
  const version = core.getInput("version", { required: true });
  const v = semverParse(version);
  if (v) {
    core.setOutput("version", v.version);
    core.setOutput("major", v.major);
    core.setOutput("minor", v.minor);
    core.setOutput("patch", v.patch);
    core.setOutput("prerelease", v.prerelease.join("."));
    core.setOutput("build", v.build.join("."));
  } else if (safeParse) {
    core.setOutput("version", "");
  } else {
    throw new Error(`Failed to parse semver: ${JSON.stringify(version)}`);
  }
} catch (ex) {
  let err: Error;
  if (ex instanceof Error) {
    err = ex;
  } else {
    err = new Error("Failed to parse semver", { cause: ex });
  }

  core.error(err);
  core.setFailed(err);
}
