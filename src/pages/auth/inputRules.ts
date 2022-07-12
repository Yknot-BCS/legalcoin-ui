export function requiredRule(val: string): string | boolean {
  return (val && val.length > 0) || 'Required';
}

export function passRule(val: string): string | boolean {
  const hasNum = /\d/.test(val);
  const hasAlpha = /[a-z]/.test(val);
  const hasUpper = /[A-Z]/.test(val);
  const hasSymbol = /[!-\/:-@[-`{-~]/.test(val);
  return (
    (hasNum && hasAlpha && hasUpper && hasSymbol) ||
    'Your password must have both an upper and lower-case letter, at least one number and at least one special character'
  );
}

export function passLenRule(val: string): string | boolean {
  return (
    val.length >= 8 || 'Your password should be at least 8 character in length'
  );
}

export function emailValidRule(val: string): string | boolean {
  const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val);
  return valid || 'Please input a valid email address';
}
