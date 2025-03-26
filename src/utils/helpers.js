export default function trim(string, limit = 100) {
  if (string.length <= limit) return string;
  return string.substring(0, limit) + '...';
}
