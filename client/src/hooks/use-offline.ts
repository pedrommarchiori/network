import { useState, useEffect } from "react";

/**
 * Hook para detectar o estado online/offline do navegador
 * Retorna um objeto com:
 * - isOffline: booleano indicando se o usuário está offline
 * - wasOffline: booleano indicando se o usuário esteve offline recentemente
 * - since: data desde quando o usuário está offline (se aplicável)
 */
export function useOffline() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [since, setSince] = useState<Date | null>(null);

  useEffect(() => {
    // Manipuladores de eventos
    const handleOffline = () => {
      setIsOffline(true);
      setSince(new Date());
    };

    const handleOnline = () => {
      if (isOffline) {
        setWasOffline(true);
        
        // Resetar o estado "wasOffline" após alguns segundos
        setTimeout(() => {
          setWasOffline(false);
        }, 5000);
      }
      
      setIsOffline(false);
      setSince(null);
    };

    // Registrar os event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Inicializar o estado "since" se já estivermos offline
    if (!navigator.onLine && !since) {
      setSince(new Date());
    }

    // Limpar os event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOffline, since]);

  // Funções utilitárias para o usuário do hook
  const getOfflineDuration = () => {
    if (!isOffline || !since) return 0;
    return Math.floor((new Date().getTime() - since.getTime()) / 1000);
  };

  return {
    isOffline,
    wasOffline,
    since,
    getOfflineDuration
  };
}