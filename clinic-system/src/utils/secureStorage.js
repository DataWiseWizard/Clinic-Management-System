import CryptoJS from "crypto-js";

const SECRET_KEY = "CLINIC_LOCAL_VAULT_KEY_2026";

export const saveSecurely = (key, data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    localStorage.setItem(key, encrypted);
    console.log("🔒 Data encrypted and saved to Edge Vault.");
  } catch (e) {
    console.error("Encryption Failed:", e);
  }
};

export const loadSecurely = (key) => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) return null;
    
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("Decryption Failed (Data might be corrupted or tampered):", e);
    return null;
  }
};

export const clearSecurely = (key) => {
  localStorage.removeItem(key);
};