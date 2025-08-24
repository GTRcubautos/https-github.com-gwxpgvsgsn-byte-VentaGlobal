import { useState, useEffect } from "react";

export function useConsent() {
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Verificar si el usuario ya dio su consentimiento
  useEffect(() => {
    const hasGivenConsent = localStorage.getItem('gtr-terms-privacy-consent');
    const consentDate = localStorage.getItem('gtr-consent-date');
    
    // Si no ha dado consentimiento o fue hace más de 1 año, mostrar modal inmediatamente
    if (!hasGivenConsent || (consentDate && isConsentExpired(consentDate))) {
      setShowConsentModal(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('gtr-terms-privacy-consent', 'true');
    localStorage.setItem('gtr-consent-date', new Date().toISOString());
    setShowConsentModal(false);
  };

  const rejectConsent = () => {
    // Si rechaza, mostrar mensaje y redirigir
    alert('Para utilizar GTR CUBAUTO debe aceptar nuestros términos y política de privacidad. Será redirigido.');
    window.location.href = 'https://www.google.com';
  };

  const hasConsent = (consentType: string): boolean => {
    // Verificar desde localStorage por ahora
    const consent = localStorage.getItem(`gtr-consent-${consentType}`);
    return consent === 'true';
  };

  return {
    showConsentModal,
    acceptConsent,
    rejectConsent,
    hasConsent,
  };
}

function isConsentExpired(consentDateStr: string): boolean {
  const consentDate = new Date(consentDateStr);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  return consentDate < oneYearAgo;
}