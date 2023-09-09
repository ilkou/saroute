import {
  deletePasswordById,
  generateRandomPassword,
  getAllEncryptedPasswords,
  getAllPleinPasswords,
  insertPassword,
  onExit,
  Password,
  verifyPasskey,
} from "../lib";
import clipboardy from "clipboardy";

export async function managePasswords(prompts: any, totalPasswords: number) {
  const options = [
    {
      title: "Add a password",
      value: "add",
    },
    {
      title: "Delete a password",
      value: "delete",
    },
  ];
  if (totalPasswords > 0) {
    options.unshift({
      title: "Copy a password",
      value: "get",
    });
  }
  const questions = [
    {
      type: "password",
      name: "passkey",
      message: "What is the passkey?",
      validate: async (input: string) => {
        const passkey = await verifyPasskey(input);
        return passkey != null ? true : "Incorrect passkey";
      },
    },
    {
      type: "autocomplete",
      name: "menu",
      message: "What do you want to do?",
      choices: options,
    },
  ];

  const answers = await prompts(questions, {
    onCancel: onExit,
  });

  if (answers.menu === "get") {
    await getPassword(answers.passkey);
  }

  if (answers.menu === "add") {
    await addPassword(answers.passkey);
  }

  if (answers.menu === "delete") {
    await deletePassword();
  }

  async function getPassword(passkey: string) {
    return prompts(
      [
        {
          type: "autocomplete",
          name: "password",
          message: "Which password do you want to copy?",
          choices: () => {
            const passwords = getAllPleinPasswords(passkey);

            return passwords.map((password: Password) => ({
              title: password.description,
              value: password.value,
            }));
          },
        },
      ],
      {
        onCancel: onExit,
        onSubmit: (_: any, answer: string) => {
          try {
            clipboardy.writeSync(answer, passkey);
          } catch (e) {
            console.error("Error decrypting password");
            process.exit(1);
          }
          console.log("Password copied to clipboard!");
        },
      },
    );
  }

  async function addPassword(passkey: string) {
    return prompts(
      [
        {
          type: "password",
          name: "value",
          message:
            "What is the password? (Enter to generate a random password)",
          initial: () => generateRandomPassword(),
          validate: (value: string) =>
            value.length < 6 ? "Try a longer password!" : true,
        },
        {
          type: "text",
          name: "description",
          message: "What is the description?",
          validate: (value: string) =>
            value.length < 3 ? "Try a better description!" : true,
        },
      ],
      {
        onCancel: onExit,
        onSubmit: (_: any, __: string, answers: Password) => {
          if (answers.value && answers.description) {
            try {
              insertPassword(answers, passkey);
              clipboardy.writeSync(answers.value);
            } catch (e) {
              console.error("Something went wrong! verify your setup");
              process.exit(1);
            }
            console.log("Password added and copied to clipboard successfully!");
          }
        },
      },
    );
  }

  async function deletePassword() {
    return prompts(
      [
        {
          type: "autocomplete",
          name: "password",
          message: "Which password do you want to delete?",
          choices: () => {
            const passwords = getAllEncryptedPasswords();

            return passwords.map((password: any) => ({
              title: password.description,
              value: password.id,
            }));
          },
        },
      ],
      {
        onCancel: onExit,
        onSubmit: (_: any, answer: string) => {
          try {
            deletePasswordById(answer);
          } catch (e) {
            console.error("Error while deleting the password");
            onExit();
          }
          console.log("Password deleted!");
        },
      },
    );
  }
}
