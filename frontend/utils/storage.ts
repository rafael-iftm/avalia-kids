type ImageFolder = 'default' | 'questions';
type AnimationName = 'success';
type ContentName = 'terms';

const FIREBASE_BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/avalia-kids.firebasestorage.app/o';
const IMAGE_EXTENSION = 'webp';

/**
 * Constrói uma URL para um arquivo hospedado no Firebase Storage.
 */
function buildFirebaseUrl(path: string): string {
  const encodedPath = encodeURIComponent(path);
  return `${FIREBASE_BASE_URL}/${encodedPath}?alt=media`;
}

/**
 * Retorna a URL de uma imagem.
 */
export function getImageUrl({
  folder = 'default',
  filename,
}: {
  folder?: ImageFolder;
  filename: string;
}): string {
  const path = `assets/images/${IMAGE_EXTENSION}/${folder}/${filename}.${IMAGE_EXTENSION}`;
  return buildFirebaseUrl(path);
}

/**
 * Retorna a URL de um placeholder de imagem.
 */
export function getPlaceholderUrl({
  folder = 'default',
  filename,
}: {
  folder?: ImageFolder;
  filename: string;
}): string {
  const path = `assets/images/${IMAGE_EXTENSION}/placeholders/${folder}/${filename}.${IMAGE_EXTENSION}`;
  return buildFirebaseUrl(path);
}

/**
 * Retorna a URL de uma animação Lottie.
 */
export function getAnimationUrl(name: AnimationName): string {
  const path = `assets/animations/${name}.json`;
  return buildFirebaseUrl(path);
}

/**
 * Retorna a URL de um conteúdo JSON.
 */
export function getContentUrl(name: ContentName): string {
  const path = `assets/content/${name}.json`;
  return buildFirebaseUrl(path);
}
