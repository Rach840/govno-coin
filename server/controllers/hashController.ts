const crypto = require("crypto");
const iv = Buffer.from("1234567890123456"); // 16 байт для AES

// Хешируем ключ до 32 байт (sha256 = 32 байта)
const key = crypto
   .createHash("sha256")
   .update(process.env.SECRET_TGID_KEY || "dop_dop_yes_yes")
   .digest();

export function hashTgId(tgId: number): string {
   const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
   let encrypted = cipher.update(String(tgId), "utf8", "hex");
   encrypted += cipher.final("hex");
   return encrypted;
}

export function decryptTgId(encryptedTgId: string): number {
   const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
   let decrypted = decipher.update(encryptedTgId, "hex", "utf8");
   decrypted += decipher.final("utf8");
   return parseInt(decrypted, 10);
}

export function generateRefCode() {
   return crypto.randomBytes(5).toString("hex"); // 10 символов
}
