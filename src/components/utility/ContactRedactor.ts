// Redact emails and phone numbers before deposit or acceptance.
export function redactSensitive(input: string): string {
  if (!input) return input;

  // Email mask
  const emailRe = /([a-zA-Z0-9._%+\-]{1,64})@([a-zA-Z0-9.\-]{1,253})\.[A-Za-z]{2,}/g;
  // E.164 and common spaced numbers, keep last 2 digits
  const phoneRe = /(?:\+?\d[\s\-()]*){7,15}/g;

  const masked = input
    .replace(emailRe, (m) => {
      const [user, domain] = m.split("@");
      const head = user.slice(0, 1);
      const tail = user.slice(-1);
      return `${head}•••${tail}@${domain.replace(/[^.]+/g, "•••")}`;
    })
    .replace(phoneRe, (m) => {
      const digits = m.replace(/\D/g, "");
      if (digits.length < 7) return m;
      const keep = digits.slice(-2);
      return `••• ••• ••${keep}`;
    });

  return masked;
}
