import React, { useState, useEffect } from 'react';
import { useValidation } from '../../contexts/ValidationContext';

interface PhoneFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onBlur?: () => void;
  required?: boolean;
}

// Liste des préfixes de pays les plus communs (USA en premier)
const COUNTRY_CODES = [
  { code: '+1', country: 'US', label: '🇺🇸 +1 (US/CA)' },
  { code: '+44', country: 'GB', label: '🇬🇧 +44 (UK)' },
  { code: '+33', country: 'FR', label: '🇫🇷 +33 (FR)' },
  { code: '+49', country: 'DE', label: '🇩🇪 +49 (DE)' },
  { code: '+34', country: 'ES', label: '🇪🇸 +34 (ES)' },
  { code: '+39', country: 'IT', label: '🇮🇹 +39 (IT)' },
  { code: '+61', country: 'AU', label: '🇦🇺 +61 (AU)' },
  { code: '+81', country: 'JP', label: '🇯🇵 +81 (JP)' },
  { code: '+86', country: 'CN', label: '🇨🇳 +86 (CN)' },
  { code: '+91', country: 'IN', label: '🇮🇳 +91 (IN)' },
  { code: '+52', country: 'MX', label: '🇲🇽 +52 (MX)' },
  { code: '+55', country: 'BR', label: '🇧🇷 +55 (BR)' },
];

// Formater le numéro selon le préfixe
const formatPhoneNumber = (digits: string, countryCode: string): string => {
  // Format américain par défaut (prioritaire)
  if (countryCode === '+1') {
    if (digits.length === 0) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.substring(0, 3)}) ${digits.substring(3)}`;
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`;
  }
  
  // Pour les autres pays, format simple avec espaces
  // Formater par groupes de 2-3 chiffres
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) {
    return `${digits.substring(0, 4)} ${digits.substring(4)}`;
  }
  return `${digits.substring(0, 4)} ${digits.substring(4, 8)} ${digits.substring(8, 12)}`;
};

// Extraire le préfixe et le numéro d'une valeur complète
const parsePhoneValue = (value: string): { countryCode: string; number: string } => {
  if (!value) return { countryCode: '+1', number: '' };
  
  // Chercher le premier préfixe qui correspond
  for (const { code } of COUNTRY_CODES) {
    if (value.startsWith(code)) {
      const number = value.substring(code.length).replace(/[^\d]/g, '');
      return { countryCode: code, number };
    }
  }
  
  // Si pas de préfixe trouvé, extraire les chiffres et supposer +1
  const digits = value.replace(/[^\d]/g, '');
  if (digits.startsWith('1') && digits.length === 11) {
    return { countryCode: '+1', number: digits.substring(1) };
  }
  
  // Par défaut USA
  return { countryCode: '+1', number: digits };
};

const PhoneField: React.FC<PhoneFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error = '',
  onBlur,
  required = false,
}) => {
  const { hasError, getFieldError } = useValidation();
  const hasFieldError = hasError(name);
  const fieldError = getFieldError(name);
  const [isFocused, setIsFocused] = useState(false);
  
  // Parser la valeur initiale
  const { countryCode: initialCountryCode, number: initialNumber } = parsePhoneValue(value);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);
  
  // Mettre à jour quand la valeur externe change
  useEffect(() => {
    const parsed = parsePhoneValue(value);
    setCountryCode(parsed.countryCode);
    setPhoneNumber(parsed.number);
  }, [value]);

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = e.target.value;
    setCountryCode(newCountryCode);
    
    // Recalculer la valeur complète
    const digits = phoneNumber.replace(/[^\d]/g, '');
    const fullValue = digits ? `${newCountryCode}${digits}` : '';
    onChange(fullValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    // Garder uniquement les chiffres
    const digits = input.replace(/[^\d]/g, '');
    
    // Limiter selon le format
    let maxDigits = countryCode === '+1' ? 10 : 15;
    const trimmedDigits = digits.substring(0, maxDigits);
    
    setPhoneNumber(trimmedDigits);
    
    // Envoyer la valeur complète (préfixe + numéro)
    const fullValue = trimmedDigits ? `${countryCode}${trimmedDigits}` : '';
    onChange(fullValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlurEvent = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  // Formater l'affichage
  const displayValue = isFocused 
    ? phoneNumber 
    : formatPhoneNumber(phoneNumber, countryCode);

  const id = name.replace(/\s+/g, '_').toLowerCase();

  return (
    <div className="relative w-full mb-4" data-field-name={name}>
      <label htmlFor={id} className="mb-[7px] ml-1 block text-left text-sm text-[#6b7280]">
        {label}
        {required ? <span className="text-[#ef6b2f]"> *</span> : null}
      </label>

      <div className="flex items-center gap-3">
        {/* Sélecteur de préfixe pays */}
        <select
          value={countryCode}
          onChange={handleCountryCodeChange}
          className={`
            block w-[150px] flex-none rounded-[14px] border bg-white px-4 py-3.5 text-[15px] text-[#1f2a37]
            focus:outline-none focus:ring-[3px] focus:ring-violet-500/10
            ${hasFieldError
              ? 'border-red-300 focus:border-red-500'
              : 'border-[#dfe3e8] focus:border-violet-500'
            }
          `}
          style={{ fontFamily: 'inherit' }}
          aria-label="Country code"
        >
          {COUNTRY_CODES.map(({ code, label: codeLabel }) => (
            <option key={code} value={code}>
              {codeLabel}
            </option>
          ))}
        </select>

        {/* Champ de numéro */}
        <input
          id={id}
          type="tel"
          name={name}
          value={displayValue}
          onChange={handlePhoneChange}
          onFocus={handleFocus}
          onBlur={handleBlurEvent}
          placeholder={countryCode === '+1' ? '(555) 123-4567' : 'Enter phone number'}
          className={`
            min-w-0 flex-1 rounded-[14px] border bg-white px-[18px] py-3.5 text-base text-[#1f2a37] placeholder:text-[#aab1bb]
            focus:outline-none focus:ring-[3px] focus:ring-violet-500/10
            ${hasFieldError
              ? 'border-red-300 focus:border-red-500'
              : 'border-[#dfe3e8] focus:border-violet-500'
            }
          `}
        />
      </div>

      {(fieldError || error) && (
        <p className="mt-1.5 ml-1 text-left text-sm text-red-600">{fieldError || error}</p>
      )}
    </div>
  );
};

export default PhoneField;
