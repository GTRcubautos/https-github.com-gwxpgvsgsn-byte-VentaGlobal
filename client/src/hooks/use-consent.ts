import { useState, useEffect } from "react";

export function useConsent() {
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showMandatoryTerms, setShowMandatoryTerms] = useState(false);

  // Verificar términos obligatorios primero
  useEffect(() => {
    const hasAcceptedTerms = localStorage.getItem('gtr-mandatory-terms-accepted');
    const termsDate = localStorage.getItem('gtr-terms-acceptance-date');
    
    // Si no ha aceptado términos o fue hace más de 1 año, mostrar modal obligatorio
    if (!hasAcceptedTerms || (termsDate && isConsentExpired(termsDate))) {
      setShowMandatoryTerms(true);
      return; // No continuar con otras verificaciones hasta que acepte términos
    }

    // Solo después de aceptar términos, verificar consentimientos opcionales
    const hasGivenConsent = localStorage.getItem('gtr-consent-given');
    const consentDate = localStorage.getItem('gtr-consent-date');
    
    if (!hasGivenConsent || (consentDate && isConsentExpired(consentDate))) {
      const timer = setTimeout(() => {
        setShowConsentModal(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closeMandatoryTerms = () => {
    setShowMandatoryTerms(false);
    
    // Después de aceptar términos, verificar consentimientos opcionales
    const hasGivenConsent = localStorage.getItem('gtr-consent-given');
    const consentDate = localStorage.getItem('gtr-consent-date');
    
    if (!hasGivenConsent || (consentDate && isConsentExpired(consentDate))) {
      setTimeout(() => {
        setShowConsentModal(true);
      }, 500);
    }
  };

  const closeConsentModal = () => {
    setShowConsentModal(false);
  };

  const hasConsent = (consentType: string): boolean => {
    const consent = localStorage.getItem(`gtr-consent-${consentType}`);
    return consent === 'true';
  };

  const hasMandatoryAcceptance = (): boolean => {
    const hasAcceptedTerms = localStorage.getItem('gtr-mandatory-terms-accepted');
    return hasAcceptedTerms === 'true';
  };

  return {
    showConsentModal,
    showMandatoryTerms,
    closeConsentModal,
    closeMandatoryTerms,
    hasConsent,
    hasMandatoryAcceptance,
  };
}

function isConsentExpired(consentDateStr: string): boolean {
  const consentDate = new Date(consentDateStr);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  return consentDate < oneYearAgo;
}