import { useState, useEffect } from "react";

export function useConsent() {
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Verificar si el usuario ya dio su consentimiento
  useEffect(() => {
    const hasGivenConsent = localStorage.getItem('gtr-consent-given');
    const consentDate = localStorage.getItem('gtr-consent-date');
    
    // Si no ha dado consentimiento o fue hace más de 1 año, mostrar modal
    if (!hasGivenConsent || (consentDate && isConsentExpired(consentDate))) {
      // Esperar un poco para que la página cargue
      const timer = setTimeout(() => {
        setShowConsentModal(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closeConsentModal = () => {
    setShowConsentModal(false);
  };

  const hasConsent = (consentType: string): boolean => {
    // Verificar desde localStorage por ahora
    const consent = localStorage.getItem(`gtr-consent-${consentType}`);
    return consent === 'true';
  };

  return {
    showConsentModal,
    closeConsentModal,
    hasConsent,
  };
}

function isConsentExpired(consentDateStr: string): boolean {
  const consentDate = new Date(consentDateStr);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  return consentDate < oneYearAgo;
}