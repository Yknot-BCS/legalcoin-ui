export function requiredRule(val: string): string | boolean {
  return (val && val.length > 0) || 'Required';
}
