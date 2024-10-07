import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

// Get the directory of the current file using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base directory as the project root (assuming script is inside the project folder)
const projectRoot = path.resolve(__dirname, "../../"); // Adjust based on your structure, moves up to the project root

// Create an interface for getting user input from the terminal
const rl = readline.createInterface({
  // eslint-disable-next-line no-undef
  input: process.stdin,
  // eslint-disable-next-line no-undef
  output: process.stdout,
});

// Ask the user for the base file name and the target directory
rl.question("Enter the base file name (e.g., ReactComponent): ", (baseName) => {
  if (!baseName) {
    console.log("Base file name is required.");
    rl.close();
    return;
  }

  // Ask for the target directory (relative to the project root) or default to the "src" directory
  rl.question("Enter the target directory relative to project root (start from ./), in case not provided default dir is 'src': ", (directoryPath) => {
    const targetDirectory = directoryPath
      ? path.join(projectRoot, directoryPath, baseName)
      : path.join(projectRoot, 'src', baseName); // Default to src if not provided

    // Ensure the directory exists or create it
    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory, { recursive: true }); // create nested folders if necessary
      console.log(`Directory created: ${targetDirectory}`);
    } else {
      console.log(`Directory already exists: ${targetDirectory}`);
    }

    const Props = baseName + "Props";
    const State = baseName + "State";

    // Content templates for each file
    const fileContents = {
      [`${baseName}.tsx`]: `
import { PureComponent, ReactNode } from "react";
import styles from "./${baseName}.module.scss";

class ${baseName} extends PureComponent<${Props}, ${State}> {
  render(): ReactNode {
    return (
      <div className={styles["container"]}>
        ${baseName} component
      </div>
    );
  }
}

export default ${baseName};
      `,
      [`${baseName}.test.tsx`]: `
import { render } from "@testing-library/react";
import ${baseName} from "./${baseName}";

test('renders ${baseName} component', () => {
  render(<${baseName} />);
});
      `,
      [`${baseName}.types.d.ts`]: `
declare interface ${Props} {}
declare interface ${State} {}
      `,
      [`${baseName}.utils.ts`]: `
// Write utility functions, classes, templates for ${baseName} component...
      `,
      [`${baseName}.constants.ts`]: `
// Write constant variables for ${baseName} component...
      `,
      [`${baseName}.docs.md`]: `
# ${baseName} Component

## Description
Explain the purpose of the ${baseName} component.

## Props
List and explain each prop used in the component.
      `,
      [`${baseName}.module.scss`]: `
/* Styles for ${baseName} component */
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
      `
    };

    // Create each file in the specified directory
    Object.entries(fileContents).forEach(([fileName, content]) => {
      const filePath = path.join(targetDirectory, fileName);
      fs.writeFileSync(filePath, content.trim(), 'utf8');
      console.log(`File created: ${filePath}`);
    });

    // Close the readline interface
    rl.close();
  });
});
