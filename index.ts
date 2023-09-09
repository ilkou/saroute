import { init } from "./lib";
import { managePasswords } from "./src/manage-passwords";
import { setupEnv } from "./src/setup-env";

const prompts = require("prompts");

const { totalPasswords, totalPasskeys, hasReadyEnv } = await init();

if (hasReadyEnv) {
  await managePasswords(prompts, totalPasswords);
} else {
  await setupEnv(prompts, totalPasskeys);
}
