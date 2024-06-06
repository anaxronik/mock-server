const fs = require("fs").promises;
const path = require("path");

async function readFilesRecursively(dir, rootDir) {
  let files = await fs.readdir(dir, { withFileTypes: true });
  let allFiles = [];

  for (let file of files) {
    let filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      allFiles = allFiles.concat(await readFilesRecursively(filePath, rootDir));
    } else {
      const shortPath = filePath.replace(rootDir, "");

      allFiles.push({
        path: shortPath,
        fullPath: filePath,
        name: file.name,
        url: shortPath.substring(0, shortPath.lastIndexOf("/")),
        method: file.name.split(".")[0],
      });
    }
  }
  return allFiles;
}

module.exports = readFilesRecursively;
