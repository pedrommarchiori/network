// Nome do cache para armazenamento offline
const CACHE_NAME = 'sanusxpro-cache-v1';

// Recursos a serem cacheados inicialmente
const INITIAL_CACHE_URLS = [
  '/',
  '/index.html',
  '/assets/offline-image.svg',
  '/manifest.json'
];

// Páginas que terão versão offline
const OFFLINE_PAGES = [
  '/',
  '/timed-simulations',
  '/checklist-bank',
  '/dashboard'
];

// Página de fallback para quando não houver conexão
const OFFLINE_FALLBACK_PAGE = '/offline.html';

// Recursos que não devem ser cacheados
const EXCLUDED_URLS = [
  'chrome-extension',
  '/api/',
  'localhost:3001/sockjs-node',
  'ws://'
];

// Instalar o service worker e fazer o pré-cache dos recursos
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        return cache.addAll(INITIAL_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativar o service worker e limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativado');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Limpando cache antigo', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interceptar requisições e servir do cache, se disponível
self.addEventListener('fetch', (event) => {
  // Ignorar requisições excluídas
  if (shouldExcludeRequest(event.request)) {
    return;
  }
  
  // Verifica se a requisição é para uma página HTML
  if (isNavigationRequest(event.request)) {
    event.respondWith(handleNavigationRequest(event.request));
  } 
  // Verifica se é uma requisição para API
  else if (isApiRequest(event.request)) {
    event.respondWith(handleApiRequest(event.request));
  } 
  // Outros recursos (imagens, CSS, JS, etc)
  else {
    event.respondWith(handleStaticAssetRequest(event.request));
  }
});

// Verifica se a requisição deve ser excluída do cache
function shouldExcludeRequest(request) {
  const url = request.url;
  return EXCLUDED_URLS.some(excludedUrl => url.includes(excludedUrl));
}

// Verifica se é uma requisição de navegação (HTML)
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
    (request.method === 'GET' && 
     request.headers.get('accept').includes('text/html'));
}

// Verifica se é uma requisição para API
function isApiRequest(request) {
  return request.url.includes('/api/');
}

// Manipular requisições de API
async function handleApiRequest(request) {
  // Tenta primeiro a rede
  try {
    const networkResponse = await fetch(request);
    
    // Se foi uma requisição POST/PUT/DELETE bem-sucedida, salva as respostas pendentes para sincronização posterior
    if (networkResponse.ok && 
        (request.method === 'POST' || 
         request.method === 'PUT' || 
         request.method === 'DELETE')) {
      const clonedResponse = networkResponse.clone();
      const responseData = await clonedResponse.json();
      
      // Armazena a resposta para referência futura
      try {
        const db = await openDatabase();
        const tx = db.transaction('pendingResponses', 'readwrite');
        const store = tx.objectStore('pendingResponses');
        
        await store.put({
          id: Date.now().toString(),
          url: request.url,
          method: request.method,
          data: responseData,
          timestamp: Date.now()
        });
        
        await tx.complete;
      } catch (error) {
        console.error('Erro ao salvar resposta da API:', error);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Falha na rede para requisição da API:', error);
    
    // Retorna dados do cache para requisições GET, se disponíveis
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Para requisições POST/PUT/DELETE, armazena para sincronização posterior
    if (request.method === 'POST' || 
        request.method === 'PUT' || 
        request.method === 'DELETE') {
      try {
        const requestClone = request.clone();
        const requestData = await requestClone.json();
        
        const db = await openDatabase();
        const tx = db.transaction('pendingRequests', 'readwrite');
        const store = tx.objectStore('pendingRequests');
        
        await store.put({
          id: Date.now().toString(),
          url: request.url,
          method: request.method,
          data: requestData,
          timestamp: Date.now()
        });
        
        await tx.complete;
        
        // Registra uma tarefa de sincronização
        if ('sync' in self.registration) {
          await self.registration.sync.register('sync-pending-requests');
        }
        
        // Retorna uma resposta simulada para não quebrar o fluxo do app
        return new Response(JSON.stringify({
          success: true,
          offline: true,
          message: 'Dados armazenados para sincronização quando a conexão for restaurada'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Erro ao armazenar requisição para sincronização:', error);
        
        // Retorna erro para o cliente
        return new Response(JSON.stringify({
          success: false,
          offline: true,
          message: 'Não foi possível processar a requisição offline'
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Retorna erro para outros métodos
    return new Response(JSON.stringify({
      success: false,
      offline: true,
      message: 'Você está offline e esta operação não está disponível sem conexão'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Manipular recursos estáticos (imagens, CSS, JS)
async function handleStaticAssetRequest(request) {
  // Estratégia: Cache First, então rede
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Atualiza o cache em segundo plano
    fetch(request)
      .then(networkResponse => {
        caches.open(CACHE_NAME)
          .then(cache => cache.put(request, networkResponse));
      })
      .catch(() => {
        // Falha silenciosa, já temos a resposta do cache
      });
    
    return cachedResponse;
  }
  
  // Se não estiver no cache, tenta rede e atualiza o cache
  try {
    const networkResponse = await fetch(request);
    
    // Adiciona ao cache para uso futuro
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Se for uma requisição de imagem, podemos servir uma imagem de fallback
    if (request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
      return caches.match('/assets/offline-image.svg');
    }
    
    // Para outros recursos, apenas falha
    throw error;
  }
}

// Manipular requisições de navegação (HTML)
async function handleNavigationRequest(request) {
  // Tentamos primeiro a rede para obter uma versão atualizada
  try {
    const networkResponse = await fetch(request);
    
    // Atualiza o cache com a nova versão
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.log('Falha na rede para navegação, tentando cache:', error);
    
    // Verifica se temos uma versão cacheada
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Verifica se é uma das páginas designadas para ter versão offline
    const requestUrl = new URL(request.url);
    const isOfflinePage = OFFLINE_PAGES.some(path => 
      requestUrl.pathname === path || 
      requestUrl.pathname.endsWith(path)
    );
    
    if (isOfflinePage) {
      const fallbackResponse = await caches.match('/');
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }
    
    // Se tudo falhar, mostra a página de fallback offline
    return caches.match(OFFLINE_FALLBACK_PAGE);
  }
}

// Sincronizar requisições pendentes quando a conexão for restaurada
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-requests') {
    event.waitUntil(syncResponses());
  }
});

// Função para sincronizar respostas pendentes
async function syncResponses() {
  try {
    const db = await openDatabase();
    const pendingRequests = await getAllPendingResponses(db);
    
    // Processa cada requisição pendente
    for (const pendingRequest of pendingRequests) {
      try {
        // Tenta enviar a requisição novamente
        const response = await fetch(pendingRequest.url, {
          method: pendingRequest.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pendingRequest.data)
        });
        
        if (response.ok) {
          // Remove a requisição pendente após sucesso
          await deletePendingResponse(db, pendingRequest.id);
        }
      } catch (error) {
        console.error('Erro ao sincronizar requisição:', error);
        // Mantém a requisição no banco para tentar novamente depois
      }
    }
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}

// Abrir o banco de dados IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SanusXPROOfflineDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Armazena requisições pendentes para sincronização
      if (!db.objectStoreNames.contains('pendingRequests')) {
        db.createObjectStore('pendingRequests', { keyPath: 'id' });
      }
      
      // Armazena respostas para referência
      if (!db.objectStoreNames.contains('pendingResponses')) {
        db.createObjectStore('pendingResponses', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Obter todas as respostas pendentes
function getAllPendingResponses(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingRequests', 'readonly');
    const store = tx.objectStore('pendingRequests');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Excluir uma resposta pendente
function deletePendingResponse(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('pendingRequests', 'readwrite');
    const store = tx.objectStore('pendingRequests');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}