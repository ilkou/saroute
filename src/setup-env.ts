import { generateRandomPassword, insertPasskey, onExit } from "../lib";
import clipboardy from "clipboardy";

export async function setupEnv(prompts: any, totalPasskeys: number) {
  if (totalPasskeys > 0) {
    console.log("Everything is already configured!");
    onExit();
  }

  prompts(
    [
      {
        type: "password",
        name: "passkey",
        message: "What is the passkey? (Enter to generate a random passkey)",
        initial: () => generateRandomPassword(),
        validate: (value: string) =>
          value.length < 6 ? "Try a longer passkey!" : true,
      },
    ],
    {
      onCancel: onExit,
      onSubmit: (_: any, passkey: string) => {
        try {
          insertPasskey({ passkey });
          clipboardy.writeSync(passkey);
        } catch (e) {
          console.error("Something went wrong! verify your setup");
          process.exit(1);
        }
        console.log(
          "Environment is configured and the passkey is copied to your clipboard!",
        );
      },
    },
  );
}
