"use client";

import { useState, useEffect, ReactNode } from 'react';

/**
 * Este componente garante que seus filhos só serão renderizados no lado do cliente,
 * evitando erros de hidratação do Next.js.
 */
export function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  // Este hook só roda no navegador, após a primeira renderização.
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Enquanto não tiver montado (no servidor ou na primeira renderização), não mostra nada.
  // Isso garante que o HTML do servidor e do cliente sejam idênticos no início.
  if (!hasMounted) {
    return null;
  }

  // Depois de montar, renderiza os filhos normalmente.
  return <>{children}</>;
}