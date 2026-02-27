import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const srcDir = join(process.cwd(), "src");
const componentDir = join(srcDir, "components");
const pascalCaseTsxRegex = /^[A-Z][A-Za-z0-9]*\.tsx$/;

const errors = [];

const walk = (dirPath, visitor) => {
  const entries = readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stats = statSync(fullPath);
    visitor(fullPath, entry, stats.isDirectory());
    if (stats.isDirectory()) {
      walk(fullPath, visitor);
    }
  }
};

walk(componentDir, (fullPath, entry, isDirectory) => {
  const relPath = relative(process.cwd(), fullPath).replaceAll("\\", "/");

  if (isDirectory) {
    return;
  }

  if (extname(entry) === ".tsx" && !pascalCaseTsxRegex.test(entry)) {
    errors.push(`${relPath}: component file name must be PascalCase.tsx.`);
  }
});

walk(srcDir, (fullPath, entry, isDirectory) => {
  if (isDirectory) {
    return;
  }

  if (!entry.endsWith(".ts") && !entry.endsWith(".tsx")) {
    return;
  }

  const relPath = relative(process.cwd(), fullPath).replaceAll("\\", "/");
  const content = readFileSync(fullPath, "utf8");
  if (content.includes("/component/")) {
    errors.push(`${relPath}: import path includes "/component/". Use "/components/" instead.`);
  }
});

if (errors.length > 0) {
  console.error("Component naming lint failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Component naming lint passed.");
