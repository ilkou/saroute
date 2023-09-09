const crypto = require("node:crypto");

// Encrypt a string using a secret key and initialization vector (IV)
export function encrypt(text: string, secret: string): string {
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(generateHash(secret), "hex");
  const iv = crypto.randomBytes(16); // Generate a random IV

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");

  // Combine IV and encrypted data into a single string
  return iv.toString("hex") + encrypted;
}

// Decrypt an encrypted string using a secret key
export function decrypt(encryptedText: string, secret: string): string {
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(generateHash(secret), "hex");
  const iv = Buffer.from(encryptedText.slice(0, 32), "hex"); // Extract IV from the first 32 characters

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText.slice(32), "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}

function generateHash(input: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(input, "utf-8");
  return hash.digest("hex");
}
