type ImageFolder = 'default' | 'questions';
type FolderExtensionMap = Record<ImageFolder, 'png' | 'webp'>;
type AnimationName = 'success';
type ContentName = 'terms';

const folderExtensions: FolderExtensionMap = {
  default: 'webp',
  questions: 'webp',
};

export function getImageUrl({
  folder = 'default',
  filename,
}: {
  folder?: ImageFolder;
  filename: string;
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

export function getContentUrl(name: ContentName) {
  const encodedPath = encodeURIComponent(`assets/content/${name}.json`);
  return `https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/${encodedPath}?alt=media`;
}

export function getPlaceholderUrl({
  folder = 'default',
  filename,
}: {
  folder?: ImageFolder;
  filename: string;
}) {
  const extension = folderExtensions[folder];
  const fullName = `${filename}.${extension}`;

  const encodedPath = encodeURIComponent(`assets/images/${extension}/placeholders/${folder}/${fullName}`);
  return `https://firebasestorage.googleapis.com/v0/b/avaliakids.firebasestorage.app/o/${encodedPath}?alt=media`;
}