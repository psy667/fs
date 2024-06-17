import * as fs from "node:fs/promises";
import * as path from "node:path";

export type FileInfo = {
  isDirectory: boolean;
  name: string;
  size: number;
  mtime: Date;
  atime: Date;
  ctime: Date;
  path: string;
  extention: string;
  isSymbolicLink: boolean;
  isBlockDevice: boolean;
  isCharacterDevice: boolean;
  isFIFO: boolean;
  isSocket: boolean;
  linkPath: string | null;
};

export type GetFilesOptions = {
  all: boolean;
  detailed: boolean;
  onlyDirs: boolean;
  onlyFiles: boolean;
};

export async function getFiles(
  dirPath: string,
  options: GetFilesOptions,
): Promise<FileInfo[]> {
  const files = await fs.readdir(dirPath);

  const fileInfos = await Promise.all(
    files.map(async (file) => {
      const stats = await fs.lstat(file);

      return {
        name: file,
        size: stats.size,
        mtime: stats.mtime,
        atime: stats.atime,
        ctime: stats.ctime,
        isDirectory: stats.isDirectory(),
        path: path.join(dirPath, file),
        extention: path.extname(file),
        isSymbolicLink: stats.isSymbolicLink(),
        isBlockDevice: stats.isBlockDevice(),
        isCharacterDevice: stats.isCharacterDevice(),
        isFIFO: stats.isFIFO(),
        isSocket: stats.isSocket(),
        linkPath: stats.isSymbolicLink() ? await fs.readlink(file) : null,
      } satisfies FileInfo;
    }),
  );

  return fileInfos
    .filter((it) => options.all || !it.name.startsWith("."))
    .filter((it) => {
      if (options.onlyDirs) {
        return it.isDirectory;
      }
      if (options.onlyFiles) {
        return !it.isDirectory;
      }
      return true;
    });
}
