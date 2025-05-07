/**
 * Valida o nome para aceitar apenas letras, acentos, espaços e til.
 * @param name O nome do usuário.
 * @returns Verdadeiro se o nome for válido, caso contrário, falso.
 */
export function validateName(name: string): boolean {
  const nameRegex = /^[A-Za-zÀ-ÿ\s~]+$/;
  return nameRegex.test(name);
}

/**
 * Valida se a data de nascimento está no formato DD/MM/AAAA e é lógica.
 * @param date A data de nascimento.
 * @returns Verdadeiro se a data for válida, caso contrário, falso.
 */
export function validateBirthDate(date: string): boolean {
  if (date.length !== 10) return false;

  const [day, month, year] = date.split('/').map(Number);
  const today = new Date();
  const enteredDate = new Date(year, month - 1, day);

  if (
    !day ||
    !month ||
    !year ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    enteredDate > today ||
    year < 1900 ||
    enteredDate.getDate() !== day ||
    enteredDate.getMonth() !== month - 1
  ) {
    return false;
  }
  return true;
}

/**
 * Valida se o email está no formato correto.
 * @param email O email do usuário.
 * @returns Verdadeiro se o email for válido, caso contrário, falso.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Verifica se a senha e a confirmação da senha são iguais e se atendem aos critérios mínimos.
 * @param password A senha digitada.
 * @param confirmPassword A confirmação da senha.
 * @returns Verdadeiro se a senha for válida e coincidir com a confirmação, caso contrário, falso.
 */
export function validatePassword(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length >= 6;
}
