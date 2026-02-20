import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const srcDir = join(process.cwd(), "src");
const componentDir = join(srcDir, "component");
const kebabCaseRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
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
    if (entry === "ui") {
      errors.push(`${relPath}: use "parts" directory name instead of "ui".`);
    }

    if (!kebabCaseRegex.test(entry) && !entry.startsWith("(") && !entry.startsWith("[")) {
      errors.push(`${relPath}: directory name must be kebab-case.`);
    }
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
  if (content.includes("/ui/")) {
    errors.push(`${relPath}: import path includes "/ui/". Use "/parts/" instead.`);
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
