const fs = require("fs");
const path = require("path");

const DIST_CONFIG_DIR = path.resolve(__dirname, "../dist/configs"); // Adjust based on output
const PACKAGE_JSON_PATH = path.resolve(__dirname, "../package.json");

// Function to generate the correct export paths
function getConfigExports() {
  const files = fs.readdirSync(DIST_CONFIG_DIR);
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf-8"));

  // Only update exports if they exist in the package.json
  const exports = packageJson.exports || {};

  // Remove all exports that start with './configs'
  Object.keys(exports).forEach((key) => {
    if (key.startsWith("./configs")) {
      delete exports[key];
    }
  });

  files.forEach((file) => {
    const match = file.match(/^(.+?)\.config\.(js|json|d\.ts)$/); // Match config files
    if (!match) return;

    const baseName = match[1]; // Extract the config name (e.g., "tailwind")

    if (!exports[`./configs/${baseName}`]) {
      exports[`./configs/${baseName}`] = {};
    }

    if (file.endsWith(".js")) {
      exports[`./configs/${baseName}`]["default"] = `./dist/configs/${file}`;
    } else if (file.endsWith(".d.ts")) {
      exports[`./configs/${baseName}`]["types"] = `./dist/configs/${file}`;
    } else if (file.endsWith(".json")) {
      exports[`./configs/${baseName}`] = `./dist/configs/${file}`;
    }
  });

  return exports;
}

// Update package.json with new exports
function updatePackageJson() {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf8"));
  packageJson.exports = getConfigExports();

  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2));
  console.log("✅ package.json exports updated.");
}

updatePackageJson();
