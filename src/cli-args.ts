export type Args = {
  help: boolean;
  all: boolean;
  colors: boolean;
  detailed: boolean;
  onlyDirs: boolean;
  onlyFiles: boolean;
  version: boolean;
};

export function parseCommandLineArgs(argsRaw: string[]): Args {
  const parsedArgs: Args = {
    help: false,
    all: false,
    colors: true,
    detailed: false,
    onlyDirs: false,
    onlyFiles: false,
    version: false,
  };

  const args = argsRaw.flatMap((arg) => {
    if (arg.startsWith("-") && arg[1] !== "-") {
      return arg.slice(1).split("");
    } else {
      return arg.slice(2);
    }
  });

  for (const arg of args) {
    switch (true) {
      case arg === "h" || arg === "help":
        parsedArgs.help = true;
        break;
      case arg === "a" || arg === "all":
        parsedArgs.all = true;
        break;
      case arg === "c" || arg === "no-colors":
        parsedArgs.colors = false;
        break;
      case arg === "l" || arg === "long":
        parsedArgs.detailed = true;
        break;
      case arg === "d" || arg === "only-dirs":
        parsedArgs.onlyDirs = true;
        break;
      case arg === "f" || arg === "only-files":
        parsedArgs.onlyFiles = true;
        break;
      case arg === "v" || arg === "version":
        parsedArgs.version = true;
        break;
    }
  }

  return parsedArgs;
}
