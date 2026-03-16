/**
 * Récupère le companyName depuis l'URL (?companyName=...).
 * Utilisé pour décider si l'écran mot de passe doit être affiché (lien client avec companyName = protection).
 */
export const getCompanyNameFromUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get('companyName')?.trim() || '';
};
