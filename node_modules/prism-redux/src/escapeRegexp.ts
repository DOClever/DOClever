const ESCAPE_PATTERN = /[|\\{}()[\]^$+*?.]/g;

export default (value : string) => value
  .replace(ESCAPE_PATTERN, '\\$&');
