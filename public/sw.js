/*
 * Service worker do Campo de Treino.
 *
 * Escopo deliberadamente pequeno: guarda o casco do site e as páginas já
 * visitadas, para que voltar a uma página aberta antes funcione sem internet.
 * Não pré-baixa o acervo — PDFs de prova pesam megabytes e o site não promete
 * acervo offline. Quando não há rede nem cópia guardada, mostra /offline.
 */
const VERSAO = "campo-de-treino-v1";
const PAGINA_OFFLINE = "/offline";

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(VERSAO).then((cache) => cache.addAll(["/", PAGINA_OFFLINE])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(chaves.filter((c) => c !== VERSAO).map((c) => caches.delete(c))),
      )
      .then(() => self.clients.claim()),
  );
});

/** Guarda a resposta sem bloquear a navegação. PDFs ficam de fora. */
async function guardar(requisicao, resposta) {
  if (!resposta || !resposta.ok || resposta.type !== "basic") return;
  if (new URL(requisicao.url).pathname.startsWith("/acervo/")) return;
  const cache = await caches.open(VERSAO);
  await cache.put(requisicao, resposta.clone());
}

self.addEventListener("fetch", (evento) => {
  const { request } = evento;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegação: rede primeiro, para nunca servir um acervo desatualizado.
  if (request.mode === "navigate") {
    evento.respondWith(
      fetch(request)
        .then((resposta) => {
          guardar(request, resposta);
          return resposta;
        })
        .catch(async () => {
          const guardada = await caches.match(request);
          return guardada ?? caches.match(PAGINA_OFFLINE);
        }),
    );
    return;
  }

  // Estáticos do build: cache primeiro, já que têm hash no nome.
  if (url.pathname.startsWith("/_next/static/")) {
    evento.respondWith(
      caches.match(request).then(
        (guardada) =>
          guardada ??
          fetch(request).then((resposta) => {
            guardar(request, resposta);
            return resposta;
          }),
      ),
    );
  }
});
