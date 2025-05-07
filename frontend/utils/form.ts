/**
 * Formata a entrada da data de nascimento no formato DD/MM/AAAA
 * @param text Texto inserido pelo usuário
 * @returns Texto formatado no padrão DD/MM/AAAA
 */
export function formatBirthDate(text: string): string {
    let cleanText = text.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cleanText.length > 8) cleanText = cleanText.slice(0, 8);
  
    let formattedDate = cleanText;
    if (cleanText.length > 2) {
      formattedDate = cleanText.slice(0, 2) + '/' + cleanText.slice(2);
    }
    if (cleanText.length > 4) {
      formattedDate = cleanText.slice(0, 2) + '/' + cleanText.slice(2, 4) + '/' + cleanText.slice(4);
    }
    return formattedDate;
  }
  
  /**
   * Verifica se todos os campos obrigatórios do formulário estão preenchidos
   * @param fields Campos do formulário a serem validados
   * @returns Verdadeiro se todos os campos forem válidos
   */
  export function areFieldsValid(fields: boolean[]): boolean {
    return fields.every(Boolean); // Verifica se todos os campos são verdadeiros
  }
