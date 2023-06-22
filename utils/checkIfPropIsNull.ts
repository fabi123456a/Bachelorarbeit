export function checkPropsForNull(obj) {
  for (const prop in obj) {
    if (obj[prop] === null) {
      return true; // Prop ist null
    }
  }
  return false; // Keine null-Props gefunden
}
