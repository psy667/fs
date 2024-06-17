import { parseCommandLineArgs } from "./cli-args";
import { getFiles } from "./files";
import { drawFileInfo } from "./formatter";
import { version } from "../package.json" assert { type: "json" };

try {
  const options = parseCommandLineArgs(process.argv);

  if (options.help) {
    console.log("Usage: fs [options]");
    console.log("Options:");
    console.log("-h, --help");
    console.log("-a, --all");
    console.log("-c, --no-colors");
    console.log("-l, --detailed");
    console.log("-d, --only-dirs");
    console.log("-f, --only-files");
    console.log(`-v, --version`);
    process.exit(0);
  }

  if (options.version) {
    console.log(version);
    process.exit(0);
  }

  const currentPath = process.cwd();

  const files = await getFiles(currentPath, {
    all: options.all,
    detailed: options.detailed,
    onlyDirs: options.onlyDirs,
    onlyFiles: options.onlyFiles,
  });

  for (const file of files) {
    console.log(
      drawFileInfo(file, {
        colors: options.colors,
        detailed: options.detailed,
      }),
    );
  }
} catch (err) {
  console.error(err);
}
