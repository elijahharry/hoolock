import { readdirSync } from "fs";
import path from "path";

export type File = {
  /** Full filename, with extension */
  filename: string;
  /** Filename without extension */
  name: string;
  path: string;
};

type Ent = {
  name: string;
  path: string;
  isDirectory: boolean;
  isFile: boolean;
};

const recursiveReadDir = (
  dir: string,
  shouldContinue: (file: Ent) => boolean = () => true
): File[] => {
  try {
    const contents = readdirSync(dir, { withFileTypes: true });
    return contents.reduce((files, dirent) => {
      const ent: Ent = {
        name: dirent.name,
        path: path.join(dir, dirent.name),
        isDirectory: dirent.isDirectory(),
        isFile: dirent.isFile(),
      };

      if (shouldContinue(ent)) {
        if (ent.isDirectory) return files.concat(recursiveReadDir(ent.path));
        if (ent.isFile) {
          return files.concat({
            filename: ent.name,
            name: path.parse(ent.name).name,
            path: ent.path,
          });
        }
      }
      return files;
    }, [] as File[]);
  } catch (e) {
    return [];
  }
};

export default recursiveReadDir;
