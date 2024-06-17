import { colorize, type Color } from "./colors";
import type { FileInfo } from "./files";

export const formatDatetime = (date: Date) => {
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();
  const datePart = date
    .toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
    })
    .padStart(6, " ");
  if (currentYear === year) {
    const timePart = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${datePart} ${timePart}`;
  } else {
    const yearPart = date.toLocaleDateString("en-US", {
      year: "numeric",
    });
    return `${datePart}  ${yearPart}`;
  }
};

export const formatSize = (size: number) => {
  let sizeNum = size;
  let unit = "B";

  if (sizeNum >= 1024) {
    sizeNum /= 1024;
    unit = "KB";
  }

  if (sizeNum >= 1024) {
    sizeNum /= 1024;
    unit = "MB";
  }

  if (sizeNum >= 1024) {
    sizeNum /= 1024;
    unit = "GB";
  }

  if (sizeNum < 10) {
    return `${sizeNum.toFixed(1)} ${unit}`;
  } else {
    return `${sizeNum.toFixed(0)} ${unit}`;
  }
};

export const getColorForFileExtention = (extention: string): Color => {
  const fileExtentionsToColorMap = {
    // media
    ".mp4": "magenta",
    ".mp3": "magenta",
    ".avi": "magenta",
    ".mov": "magenta",
    ".wmv": "magenta",
    ".mkv": "magenta",
    ".flv": "magenta",
    ".webm": "magenta",
    ".ogg": "magenta",
    ".wav": "magenta",
    ".jpg": "magenta",
    ".jpeg": "magenta",
    ".png": "magenta",
    ".gif": "magenta",

    // office
    ".doc": "green",
    ".docx": "green",
    ".xls": "green",
    ".xlsx": "green",
    ".ppt": "green",
    ".pptx": "green",
    ".pdf": "green",
    ".txt": "green",
    ".rtf": "green",
    ".odt": "green",
    ".md": "green",
    ".json": "green",
    ".yaml": "green",
    ".yml": "green",
    ".toml": "green",
    ".xml": "green",

    // binary
    ".zip": "red",
    ".rar": "red",
    ".7z": "red",
    ".tar": "red",
    ".gz": "red",
    ".bz2": "red",
    ".xz": "red",
    ".lz": "red",
    ".lzma": "red",
    ".iso": "red",
    ".exe": "red",
    ".dmg": "red",
    ".apk": "red",
    ".deb": "red",
    ".rpm": "red",
    ".msi": "red",
    ".bin": "red",

    // script
    ".js": "yellow",
    ".py": "yellow",
    ".sh": "yellow",
    ".rb": "yellow",
    ".php": "yellow",
    ".pl": "yellow",
    ".c": "yellow",
    ".cpp": "yellow",
    ".h": "yellow",
    ".hpp": "yellow",
    ".cs": "yellow",
    ".go": "yellow",
    ".html": "yellow",
  } as const;

  return (
    fileExtentionsToColorMap[
      extention as keyof typeof fileExtentionsToColorMap
    ] ?? "white"
  );
};

export type DrawFileInfoOptions = {
  colors: boolean;
  detailed: boolean;
};

export function drawFileInfo(fileInfo: FileInfo, options: DrawFileInfoOptions) {
  const {
    isDirectory,
    name,
    size,
    mtime,
    atime,
    ctime,
    extention,
    isSymbolicLink,
  } = fileInfo;

  let nameColor: Color;

  switch (true) {
    case isDirectory:
      nameColor = "cyan";
      break;
    case isSymbolicLink:
      nameColor = "magenta";
      break;
    case !extention:
      nameColor = "red";
      break;
    default:
      nameColor = getColorForFileExtention(extention);
  }

  let nameStr = name;

  if (isSymbolicLink) {
    nameStr = `${nameStr} -> ${fileInfo.linkPath}`;
  }

  if (options.detailed) {
    const timeStr = formatDatetime(ctime);
    const sizeStr = (isDirectory ? "-" : `${formatSize(size)}`).padEnd(7, " ");

    if (options.colors) {
      return `${colorize(sizeStr, "green")} ${colorize(timeStr, "blue")} ${colorize(nameStr, nameColor)}`;
    } else {
      return `${sizeStr} ${timeStr} ${nameStr}`;
    }
  } else {
    if (options.colors) {
      return `${colorize(name, nameColor)}`;
    } else {
      return `${name}`;
    }
  }
}
