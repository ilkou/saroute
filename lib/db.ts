import { Database } from "bun:sqlite";
import { Passkey, Password } from "./types";
import { decrypt, encrypt } from "./encryption";
import { password } from "bun";

const DB_PATH = process.env.DB_PATH || "passwords.sqlite";

const db = new Database(DB_PATH);

export const init = async () => {
  db.query(
    `
        create table if not exists passwords (
            id integer primary key,
            value text not null,
            description text
        );
    `,
  ).run();

  db.query(
    `
        create table if not exists passkeys (
            id integer primary key,
            passkey text not null
        );
    `,
  ).run();
  const totalPasswords = await countPasswords();
  const totalPasskeys = await countPasskeys();
  const hasReadyEnv = totalPasskeys > 0;
  return { totalPasswords, totalPasskeys, hasReadyEnv };
};

export const countPasskeys = async () => {
  const passkeys = db
    .query<{ total: number }, any>(`select count(*) as total from passkeys;`)
    .get();
  return passkeys?.total || 0;
};

export const countPasswords = async () => {
  const passkeys = db
    .query<{ total: number }, any>(`select count(*) as total from passwords;`)
    .get();
  return passkeys?.total || 0;
};

export const insertPasskey = async (payload: Passkey) => {
  const hashedPasskey = await password.hash(payload.passkey);
  db.query(
    `
        insert into passkeys (passkey)
        values ($passkey);
    `,
  ).run({
    $passkey: hashedPasskey,
  });
};

export const verifyPasskey = async (passkey: string) => {
  const passkeyVal = db.query<Passkey, []>(`select * from passkeys;`).get();
  return password
    .verify(passkey, passkeyVal?.passkey)
    .then((validPasskey) => (validPasskey ? passkey : null))
    .catch(() => null);
};

export const getAllPleinPasswords = (passkey: string) => {
  return db
    .query<Password, []>(`select * from passwords;`)
    .all()
    .map((o: Password) => ({ ...o, value: decrypt(o.value, passkey) }));
};

export const getAllEncryptedPasswords = () => {
  return db.query(`select * from passwords;`).all();
};

export const insertPassword = (payload: Password, passkey: string) => {
  db.query(
    `
    insert into passwords (value, description)
    values ($password, $description);
`,
  ).run({
    $password: encrypt(payload.value, passkey),
    $description: payload.description,
  });
};

export const deletePasswordById = (id: string) => {
  db.query(`delete from passwords where id = $id`).run({
    $id: id,
  });
};
