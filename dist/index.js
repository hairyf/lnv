#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node/utils.ts
var import_pathe = __toESM(require("pathe"));
var import_fs = __toESM(require("fs"));
var import_dotenv = require("dotenv");
var import_get_packages = require("@manypkg/get-packages");
var import_child_process = require("child_process");

// node/log.ts
var logger = {
  wait_stacks: [],
  ...console,
  wait(...data) {
    this.wait_stacks.push(...data);
  },
  don(...data) {
    data.length && console.log(...data);
    this.wait_stacks.forEach((data2) => console.log(data2));
    this.wait_stacks = [];
    console.log();
  }
};

// node/utils.ts
var root = process.cwd();
var ProcessENV = {};
async function exp(monorepo, parsed = {}) {
  if (!monorepo) {
    write(`${root}/.env`, parsed);
    return;
  }
  const { packages, root: packRoot } = await (0, import_get_packages.getPackages)(process.cwd());
  if (packRoot.dir !== root) {
    logger.warn("Subproject exposes environment. If is correct, ignore this message.");
  }
  for (const pack of packages.filter((pack2) => pack2.dir !== root)) {
    logger.wait(` - ${import_pathe.default.relative(root, pack.dir)}/.env`);
    write(`${pack.dir}/.env`, parsed);
  }
}
async function cmd(command, env) {
  if (Array.isArray(command))
    command = command.join(" ");
  if (!command)
    throw new Error("Unable to run empty running script");
  const { execaSync } = await import("execa");
  const options = { stdio: "inherit", env: { ...process.env, ...env } };
  const commands = command.split("&&").map((cmd2) => cmd2.trim());
  for (let command2 of commands) {
    if (process.platform.startsWith("win") && command2.includes(".sh") && !command2.startsWith("sh ")) {
      command2 = "sh " + command2;
    }
    try {
      execaSync(command2, options);
    } catch (error) {
      (0, import_child_process.execSync)(command2, options);
    }
  }
}
function load(file) {
  file = "." + file;
  const filepath = find(file);
  if (!filepath)
    return void 0;
  if (file !== ".env.vault")
    return (0, import_dotenv.config)({ path: filepath, processEnv: ProcessENV });
  const DOTENV_KEY = dokey(".env.key") || ProcessENV.DOTENV_KEY || process.env.DOTENV_KEY || dokey(".env");
  if (!DOTENV_KEY)
    throw new Error("No DOTENV_KEY found in .env|.env.key or process.env");
  return (0, import_dotenv.config)({ DOTENV_KEY, path: filepath });
}
function find(file) {
  let currentDir = root;
  while (currentDir !== import_pathe.default.parse(currentDir).root) {
    const envPath = import_pathe.default.join(currentDir, file);
    if (import_fs.default.existsSync(envPath)) {
      return envPath;
    }
    currentDir = import_pathe.default.dirname(currentDir);
  }
  return void 0;
}
function uniq(array) {
  return [.../* @__PURE__ */ new Set([...array])];
}
function m2fi(mod) {
  return mod !== "env" ? mod === "dotenv" ? "env.vault" : `env.${mod}` : mod;
}
function dokey(file) {
  const envs = (0, import_dotenv.config)({ processEnv: {}, DOTENV_KEY: void 0, path: find(file) });
  return envs.parsed?.DOTENV_KEY;
}
function write(filepath, parsed = {}) {
  const contents = Object.entries(parsed).map(([key, value]) => `${key}=${value}`);
  const content = [
    "# This file is generated by lnv command",
    "# DO NOT ATTEMPT TO EDIT THIS FILE",
    contents.join("\n")
  ].join("\n");
  import_fs.default.writeFileSync(filepath, content, "utf-8");
}
function quotes(argv2) {
  const parsed = [];
  let currentString = "";
  let inQuotes = false;
  let quoteChar = "";
  for (const arg of argv2) {
    if (arg.startsWith("'") || arg.startsWith("`")) {
      if (inQuotes) {
        currentString += " " + arg.slice(1);
      } else {
        inQuotes = true;
        quoteChar = arg[0];
        currentString += arg.slice(1);
      }
    } else if (arg.endsWith("'") || arg.endsWith("`")) {
      if (inQuotes && quoteChar === arg[arg.length - 1]) {
        currentString += " " + arg.slice(0, -1);
        parsed.push(currentString.trim());
        currentString = "";
        inQuotes = false;
      } else {
        parsed.push(arg);
      }
    } else {
      if (inQuotes) {
        currentString += " " + arg;
      } else {
        parsed.push(arg);
      }
    }
  }
  currentString && parsed.push(currentString.trim());
  return parsed;
}

// node/cli.ts
var import_yargs = __toESM(require("yargs"));
var import_helpers = require("yargs/helpers");

// package.json
var version = "5.6.0";

// node/cli.ts
function createYargsArgv() {
  const argv2 = runs(quotes((0, import_helpers.hideBin)(process.argv)));
  return (0, import_yargs.default)(argv2).scriptName("lnv").showHelpOnFail(false).version(version).usage("lnv <mode> [args]").alias("h", "help").option("value", {
    type: "array",
    alias: "v",
    describe: "set environment variables"
  }).option("run", {
    describe: "load runtime environment and run any scripts",
    type: "array",
    alias: "r"
  }).option("mode", {
    describe: "Manual selection mode",
    type: "array"
  }).option("monorepo", {
    describe: "apply to packages in the monorepo.",
    type: "boolean",
    alias: "m"
  }).option("expose", {
    describe: "expose environment variables",
    alias: "e",
    type: "boolean"
  }).option("default", {
    describe: "the default environment (env|...|env.local) be loaded",
    alias: "d",
    type: "boolean"
  }).help();
}
function runs(argv2) {
  const news = [];
  const runs2 = [];
  let is = false;
  for (const arg of argv2) {
    if (is && arg === "e;") {
      news.push(runs2.join(" "));
      is = false;
      continue;
    }
    is ? runs2.push(arg) : news.push(arg);
    if (arg === "-r" || arg === "--run")
      is = true;
    if (arg === "-" || arg === "--") {
      news.splice(news.length - 1, 1, "-r");
      is = true;
    }
  }
  is && runs2.length && news.push(runs2.join(" "));
  return news;
}

// node/index.ts
var argv = createYargsArgv().parse();
async function mainTryError() {
  await main().catch((error) => {
    console.warn(`${error.message}`);
    process.exit();
  });
}
async function main() {
  if (!argv.e && !argv.r)
    throw new Error("Missing required --expose|-e or --run|-r options");
  if (argv.m && argv.r)
    throw new Error("In monorepo, the run script cannot be run");
  if (argv.e && argv.r)
    throw new Error("Expose and run cannot run simultaneously");
  const modes = [argv.d && "env", ...argv._ || [], argv.d && "local", ...argv.mode || []];
  const files = uniq(modes).filter(Boolean).map(m2fi);
  const parsed = {};
  const parsedFiles = [];
  for (const file of files) {
    const envs = load(file);
    if (!envs || envs?.error) {
      if (!(argv.d && (file === "env" || file === "env.local")))
        logger.log(`Failed to loading ${file} file not found in all scopes`);
      continue;
    }
    Object.assign(parsed, envs.parsed);
    parsedFiles.unshift(file);
  }
  for (const kv of argv.v || []) {
    const [key, value] = kv.split("=");
    if (!key || typeof value === "undefined")
      console.warn(`Invalid manual environment variable: ${kv}`);
    else
      parsed[key] = value || "";
  }
  if (!argv.v?.length && !files.length && !parsedFiles.length)
    console.warn("No environment variables loaded");
  const parsedMode = argv.e ? "exposed" : "loaded";
  const suffix = !argv.r ? argv.m ? "packages by" : "env" : "runtime environment";
  let successfullyMessage = parsedFiles.length ? `Successfully ${parsedMode} ${parsedFiles.join("|")} to ${suffix}` : argv.v?.length ? `Successfully manual loaded environment variables` : "";
  if (argv.v) {
    parsedFiles.length && (successfullyMessage += " with manual loaded variables");
    for (const kv of argv.v) {
      const [key, value] = kv.split("=");
      typeof value !== "undefined" && (successfullyMessage += `
  ${key}=${value}`);
    }
  }
  argv.r && (parsedFiles.length || argv.v) ? logger.log(successfullyMessage + "\n") : logger.log("");
  argv.r && await cmd(argv.r, parsed);
  argv.e && await exp(argv.m, parsed);
  argv.e && parsedFiles.length && logger.don(successfullyMessage);
}
mainTryError();
