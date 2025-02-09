/**
 * Valida o nome para aceitar apenas letras, acentos e espaços.
 * @param name O nome do aluno.
 * @returns Verdadeiro se o nome for válido.
 */
export function validateName(name: string): boolean {
    return /^[A-Za-zÀ-ÿ\s]*$/.test(name);
  }
  
  /**
   * Valida a data de nascimento no formato DD/MM/AAAA.
   * @param date A data de nascimento.
   * @returns Verdadeiro se a data for válida.
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
      year < 1900
    ) {
      return false;
    }
    return enteredDate.getDate() === day && enteredDate.getMonth() === month - 1;
  }
