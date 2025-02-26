import { inspect } from "util";

const bold = (str: string) => `\x1b[1m${str}\x1b[0m`;
const red = (str: string) => `\x1b[31m${str}\x1b[0m`;
const yellow = (str: string) => `\x1b[33m${str}\x1b[0m`;
const blue = (str: string) => `\x1b[34m${str}\x1b[0m`;
const cyan = (str: string) => `\x1b[36m${str}\x1b[0m`;
const green = (str: string) => `\x1b[32m${str}\x1b[0m`;
const dim = (str: string) => `\x1b[2m${str}\x1b[0m`;
const color = {
  bold,
  red,
  yellow,
  blue,
  cyan,
  green,
  dim,
};

const createOutput = (
  prefix: string,
  target: "log" | "error" | "warn" | "info" | "debug",
  shouldLog?: (message: string) => boolean
) => {
  const log = console[target].bind(console);

  return Object.assign((name: string, ...optionalParams: any[]) => {
    let message = [prefix, name].filter(Boolean).join(" ");
    while (optionalParams.length) {
      const param = optionalParams.shift(),
        str =
          typeof param === "string"
            ? param
            : inspect(param, {
                colors: true,
                depth: 2,
              });
      if (/%s/.test(message)) {
        message = message.replace("%s", str);
      } else {
        if (message) message += " ";
        message += str;
      }
    }
    if (!shouldLog || shouldLog(message)) log(message);
  });
};

const err = createOutput(red(bold("Error!")), "error");

const error = (name: string, ...optionalParams: any[]) =>
  err(name, ...optionalParams);

error.fatal = (name: string, ...optionalParams: any[]) => {
  error(name, ...optionalParams);
  process.exit(1);
};

const enqoute = (str: string) => `"${str}"`;

const WARNED = new Set<string>();
const warn = createOutput(yellow(bold("Warning!")), "warn", (m) => {
  if (WARNED.has(m)) return false;
  WARNED.add(m);
  return true;
});

const success = createOutput(bold(green("✓")), "log");

export { enqoute, error, warn, success };

const out = {
  warn,
  error,
  success,
  enqoute,
  color,
};

export default out;
