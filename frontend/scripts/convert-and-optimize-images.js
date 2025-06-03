const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const pngInputRoot = path.join(__dirname, '..', 'assets', 'images', 'png');
const webpOutputRoot = path.join(__dirname, '..', 'assets', 'images', 'webp');
const placeholderWebpOutput = path.join(webpOutputRoot, 'placeholders');
const placeholderPngOutput = path.join(pngInputRoot, 'placeholders');

const MAX_WIDTH = 300;

let totalProcessed = 0;
let totalErrors = 0;

async function convertToWebp(inputPath, outputPath) {
  try {
    await fs.ensureDir(path.dirname(outputPath));
    await sharp(inputPath)
      .resize({ width: MAX_WIDTH })
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(chalk.cyan('🟢 WebP:'), chalk.gray(outputPath));
  } catch (err) {
    totalErrors++;
    console.log(chalk.red('❌ Erro WebP:'), chalk.gray(inputPath), '-', chalk.red(err.message));
  }
}

async function optimizePngInPlace(filePath) {
  try {
    const tempPath = `${filePath}.tmp`;

    await sharp(filePath)
      .resize({ width: MAX_WIDTH })
      .png({ quality: 80, compressionLevel: 9, adaptiveFiltering: true })
      .toFile(tempPath);

    await fs.move(tempPath, filePath, { overwrite: true });
    console.log(chalk.green('✅ PNG :'), chalk.gray(filePath));
    totalProcessed++;
  } catch (err) {
    totalErrors++;
    console.log(chalk.red('❌ Erro PNG :'), chalk.gray(filePath), '-', chalk.red(err.message));
  }
}

async function generatePlaceholders(inputPath, relativePath) {
  try {
    // Destinos
    const placeholderPngPath = path.join(placeholderPngOutput, relativePath);
    const placeholderWebpPath = path.join(placeholderWebpOutput, relativePath).replace(/\.png$/, '.webp');

    // Criar versao PNG (opaca e desaturada)
    await fs.ensureDir(path.dirname(placeholderPngPath));
    await sharp(inputPath)
      .resize({ width: MAX_WIDTH })
      .blur(10)
      .modulate({ brightness: 1.2, saturation: 0.2 })
      .png({ quality: 60 })
      .toFile(placeholderPngPath);
    console.log(chalk.magenta('🟪 Placeholder PNG :'), chalk.gray(placeholderPngPath));

    // Criar versão WebP
    await fs.ensureDir(path.dirname(placeholderWebpPath));
    await sharp(inputPath)
      .resize({ width: MAX_WIDTH })
      .blur(10)
      .modulate({ brightness: 1.2, saturation: 0.2 })
      .webp({ quality: 60 })
      .toFile(placeholderWebpPath);
    console.log(chalk.magenta('🟪 Placeholder WebP:'), chalk.gray(placeholderWebpPath));
  } catch (err) {
    totalErrors++;
    console.log(chalk.red('❌ Erro Placeholder:'), chalk.gray(relativePath), '-', chalk.red(err.message));
  }
}

async function processFolder(currentFolder) {
  const items = await fs.readdir(currentFolder);

  for (const item of items) {
    const fullPath = path.join(currentFolder, item);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await processFolder(fullPath);
    } else if (item.toLowerCase().endsWith('.png')) {
      const relativePath = path.relative(pngInputRoot, fullPath);
      const webpPath = path.join(webpOutputRoot, relativePath).replace(/\.png$/, '.webp');

      await convertToWebp(fullPath, webpPath);
      await optimizePngInPlace(fullPath);
      await generatePlaceholders(fullPath, relativePath);
    }
  }
}

(async () => {
  console.log(chalk.blue.bold('\n🔄 Iniciando otimização de imagens PNG, conversão para WebP e geração de placeholders...\n'));
  const start = Date.now();
  await processFolder(pngInputRoot);
  const duration = ((Date.now() - start) / 1000).toFixed(2);
  console.log(chalk.yellow(`\n📊 Imagens processadas: ${totalProcessed}`));
  console.log(chalk.red(`❗ Erros: ${totalErrors}`));
  console.log(chalk.blue(`⏱️ Tempo total: ${duration}s\n`));
})();
