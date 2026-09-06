"use client";

import { useEffect, useState } from "react";

/**
 * Registra o service worker e avisa quando a conexão cai.
 *
 * O aviso é explícito sobre o limite: sem internet, só abre o que já foi
 * visitado. Nada aqui promete o acervo inteiro offline.
 */
export function SuporteOffline() {
  const [semRede, setSemRede] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Sem service worker o site segue funcionando normalmente, só sem cache.
      });
    }

    const atualizar = () => setSemRede(!navigator.onLine);
    atualizar();
    window.addEventListener("online", atualizar);
    window.addEventListener("offline", atualizar);
    return () => {
      window.removeEventListener("online", atualizar);
      window.removeEventListener("offline", atualizar);
    };
  }, []);

  if (!semRede) return null;

  return (
    <div
      role="status"
      className="bg-oliva-700 px-4 py-2.5 text-center text-[15px] text-papel"
    >
      Você está sem internet. Dá para abrir as páginas que já visitou; os PDFs
      só carregam quando a conexão voltar.
    </div>
  );
}
