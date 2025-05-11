const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '..' , 'src', 'components');

function generateExports(dir) {
  const files = fs.readdirSync(dir);

  const exportLines = files
    .filter((file) => {
      const ext = path.extname(file);
      return ext === '.ts' || ext === '.tsx';
    })
    .map((file) => {
      const fileName = path.basename(file, path.extname(file));
      return `export * from './${fileName}';`;
    });

  // Check for nested folders and add their exports
  files
    .filter((file) => fs.statSync(path.join(dir, file)).isDirectory())
    .forEach((subdir) => {
      generateExports(path.join(dir, subdir));
      exportLines.push(`export * from './${subdir}';`);
    });

  const exportFilePath = path.join(dir, 'index.ts');
  fs.writeFileSync(exportFilePath, exportLines.join('\n') + '\n');
  console.log(`Generated exports at: ${exportFilePath}`);
}

generateExports(COMPONENTS_DIR);
