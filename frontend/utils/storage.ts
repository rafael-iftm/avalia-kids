type ImageFolder = 'default' | 'questions';
type FolderExtensionMap = Record<ImageFolder, 'png' | 'jpeg'>;
type AnimationName = 'success' | 'confetti' | 'error';

const folderExtensions: FolderExtensionMap = {
  default: 'png',
  questions: 'jpeg',
};

export function getImageUrl({
  folder = 'default',
  filename,
}: {
  folder?: ImageFolder;
  filename: string; // sem extensão
}) {
  const extension = folderExtensions[folder];
  const fullName = `${filename}.${extension}`;

  const encodedPath = encodeURIComponent(`assets/images/${extension}/${folder}/${fullName}`);
  return `https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/${encodedPath}?alt=media`;
}

export function getAnimationUrl(name: AnimationName) {
  const encodedPath = encodeURIComponent(`assets/animations/${name}.json`);
  return `https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/${encodedPath}?alt=media`;
}
