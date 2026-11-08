export async function sessionKey(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`nexlane-admin-session-v1:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function signSession(expUnix: number, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`admin:${expUnix}`);
  const keyBuffer = encoder.encode(key);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ),
    data
  );
  const signature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `${expUnix}.${signature}`;
}

export async function verifySessionCookie(cookieValue: string, key: string): Promise<boolean> {
  const [exp, sig] = cookieValue.split('.');
  if (!exp || !sig) return false; // malformed cookie must not throw
  const expUnix = parseInt(exp, 10);
  if (isNaN(expUnix) || expUnix <= Date.now() / 1000) {
    return false;
  }
  const expectedSig = await signSession(expUnix, key);
  const [, expectedSigPart] = expectedSig.split('.');
  return timingSafeEqualHex(sig, expectedSigPart);
}

export async function hashPassword(pw: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pw);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function getSessionKeyFromEnv(): Promise<string | null> {
  return process.env.ADMIN_PASSWORD ? await sessionKey(process.env.ADMIN_PASSWORD) : null;
}