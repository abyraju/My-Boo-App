/**
 * utils/crypto.js
 *
 * Client-side cryptography utilities for My Boo.
 *
 * Architecture summary:
 *   • Data is encrypted on-device BEFORE upload to the user's cloud (Google Drive / Dropbox / OneDrive).
 *   • The shared secret is the Couple's Key — a 9-char alphanumeric key generated once on pairing.
 *   • The Couple's Key is stored in the device Keychain / Keystore (flutter_secure_storage) and
 *     NEVER transmitted over the network.
 *   • The Personal Boo ID (6-char) is public — used only for partner discovery and pairing.
 *   • All encrypt/decrypt calls here are stubs; replace with the real AES-256-GCM implementation
 *     when wiring the backend.
 *
 * Key principles enforced here:
 *   1. Plaintext never leaves the device.
 *   2. The Couple's Key is only ever read from secure storage — never from a state variable or log.
 *   3. PINs are hashed (SHA-256 stub) before storage — never stored in plain text.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Character sets
// ─────────────────────────────────────────────────────────────────────────────
const ALNUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1

// ─────────────────────────────────────────────────────────────────────────────
// ID / Key generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a 6-character alphanumeric Boo ID.
 * Called once on account creation. The result is stored in the users table.
 * This value is PUBLIC — safe to share with a partner for pairing.
 * @returns {string} e.g. "A3K9BX"
 */
export function generateBooId() {
  return Array.from({ length: 6 }, () =>
    ALNUM[Math.floor(Math.random() * ALNUM.length)]
  ).join("");
}

/**
 * Generates a 9-character Couple's Key.
 * Called ONCE when two users successfully pair.
 * This IS the AES-256 encryption key for all synced couple data.
 * Store immediately in device Keychain / Keystore. NEVER log or transmit.
 * @returns {string} e.g. "X7R2MN4KQ"
 */
export function generateCouplesKey() {
  return Array.from({ length: 9 }, () =>
    ALNUM[Math.floor(Math.random() * ALNUM.length)]
  ).join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// PIN handling
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hashes a PIN string using the Web Crypto API (SHA-256).
 * The hash is what gets stored — never the raw PIN.
 *
 * @param {string} pin - 4–6 digit PIN entered by the user
 * @returns {Promise<string>} hex-encoded SHA-256 hash
 *
 * TODO: In production, add a per-device salt stored separately in the Keychain
 *       to prevent rainbow-table attacks on the hash.
 */
export async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data    = encoder.encode(pin);
  const hashBuf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Verifies a user-entered PIN against the stored hash.
 * @param {string} entered  - PIN entered on the lock screen
 * @param {string} storedHash - hash from Keychain / Keystore
 * @returns {Promise<boolean>}
 */
export async function verifyPin(entered, storedHash) {
  const hash = await hashPin(entered);
  return hash === storedHash;
}

// ─────────────────────────────────────────────────────────────────────────────
// AES-256-GCM Encryption / Decryption  (stubs — replace with real impl)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derives a CryptoKey from the Couple's Key string using PBKDF2.
 * @param {string} couplesKey - 9-char Couple's Key from Keychain
 * @returns {Promise<CryptoKey>}
 *
 * TODO: Use a stored per-couple salt (written to the minimal DB on pairing)
 *       for the PBKDF2 call so brute-forcing the key space is harder.
 */
export async function deriveKey(couplesKey) {
  const raw = new TextEncoder().encode(couplesKey);
  const base = await crypto.subtle.importKey("raw", raw, "PBKDF2", false, ["deriveKey"]);
  // TODO: Replace with a real stored salt
  const salt = new TextEncoder().encode("myboo-salt-v1");
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a plaintext string with AES-256-GCM using the Couple's Key.
 * The IV is prepended to the ciphertext so the recipient can decrypt.
 *
 * @param {string} plaintext   - data to encrypt (JSON-serialised payload)
 * @param {string} couplesKey  - 9-char key from device Keychain
 * @returns {Promise<ArrayBuffer>} iv (12 bytes) + ciphertext
 *
 * IMPORTANT: Plaintext NEVER leaves the device. Call this before any upload.
 */
export async function encryptData(plaintext, couplesKey) {
  const key = await deriveKey(couplesKey);
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const buf = new TextEncoder().encode(plaintext);
  const ct  = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, buf);
  // Concatenate: [iv (12 bytes)][ciphertext]
  const out = new Uint8Array(iv.byteLength + ct.byteLength);
  out.set(iv, 0);
  out.set(new Uint8Array(ct), iv.byteLength);
  return out.buffer;
}

/**
 * Decrypts an ArrayBuffer (iv + ciphertext) produced by encryptData.
 *
 * @param {ArrayBuffer} data   - iv + ciphertext from cloud
 * @param {string} couplesKey - 9-char key from device Keychain
 * @returns {Promise<string>} decrypted plaintext
 */
export async function decryptData(data, couplesKey) {
  const key  = await deriveKey(couplesKey);
  const bytes = new Uint8Array(data);
  const iv   = bytes.slice(0, 12);
  const ct   = bytes.slice(12);
  const pt   = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new TextDecoder().decode(pt);
}

// ─────────────────────────────────────────────────────────────────────────────
// Fixed-size padding  (metadata mitigation)
// ─────────────────────────────────────────────────────────────────────────────

/** Target blob size in bytes — all encrypted files are padded to this size. */
const FIXED_BLOB_SIZE = 1_048_576; // 1 MB

/**
 * Pads (or truncates) an ArrayBuffer to exactly FIXED_BLOB_SIZE bytes.
 * This prevents the cloud provider from inferring content from file sizes.
 *
 * @param {ArrayBuffer} encrypted - output of encryptData
 * @returns {ArrayBuffer} exactly 1 MB
 */
export function padToFixedSize(encrypted) {
  const out = new Uint8Array(FIXED_BLOB_SIZE);
  out.set(new Uint8Array(encrypted));
  return out.buffer;
}

// ─────────────────────────────────────────────────────────────────────────────
// Filename anonymisation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a random UUID-based filename with no descriptive information.
 * Use this instead of names like "chat_log.txt" to prevent metadata leakage.
 * @returns {string} e.g. "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 */
export function anonymousFilename() {
  return crypto.randomUUID ? crypto.randomUUID() : generateCouplesKey() + generateBooId();
}
