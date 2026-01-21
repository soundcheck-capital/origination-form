import { ticketingPartners } from '../store/form/hubspotLists';

// Imports statiques des logos disponibles
// Les noms des fichiers doivent correspondre EXACTEMENT aux clés de ticketingPartners
import shotgunLogo from '../assets/ticketing_co/Shotgun.png';
import venuePilotLogo from '../assets/ticketing_co/Venue Pilot.png';

/**
 * Normalise un nom de ticketing partner pour la comparaison (insensible à la casse)
 * Exemple: "Venue Pilot" -> "venue pilot", "Shotgun" -> "shotgun"
 */
const normalizePartnerName = (name: string): string => {
  return name.toLowerCase().trim();
};

/**
 * Mapping automatique des clés exactes de ticketingPartners vers leurs logos
 * Les clés doivent correspondre EXACTEMENT aux noms dans ticketingPartners
 */
const logoMap: { [key: string]: string } = {
  'Shotgun': shotgunLogo,
  'Venue Pilot': venuePilotLogo,
};

/**
 * Récupère le chemin du logo pour un ticketing partner donné
 * Le partnerName doit correspondre EXACTEMENT à une clé de ticketingPartners
 * Retourne null si le logo n'existe pas
 */
export const getTicketingPartnerLogo = (partnerName: string): string | null => {
  if (!partnerName) return null;
  
  // Chercher la clé exacte dans ticketingPartners
  const exactKey = findTicketingPartnerKey(partnerName);
  if (!exactKey) return null;
  
  // Retourner le logo correspondant à la clé exacte
  return logoMap[exactKey] || null;
};

/**
 * Vérifie si un nom de ticketing partner est valide (présent dans la liste)
 */
export const isValidTicketingPartner = (partnerName: string): boolean => {
  if (!partnerName) return false;
  
  const normalizedName = normalizePartnerName(partnerName);
  const partnerKeys = Object.keys(ticketingPartners).map(key => normalizePartnerName(key));
  
  return partnerKeys.includes(normalizedName);
};

/**
 * Trouve la clé exacte du ticketing partner à partir d'un nom (peut être normalisé)
 */
export const findTicketingPartnerKey = (partnerName: string): string | null => {
  if (!partnerName) return null;
  
  const normalizedName = normalizePartnerName(partnerName);
  
  // Chercher la clé exacte dans ticketingPartners
  for (const key of Object.keys(ticketingPartners)) {
    if (normalizePartnerName(key) === normalizedName) {
      return key;
    }
  }
  
  return null;
};
