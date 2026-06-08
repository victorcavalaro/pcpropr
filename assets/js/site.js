
(function () {
  function safeStorageGet(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (e) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      if (window.localStorage) window.localStorage.setItem(key, value);
    } catch (e) {
      // Ignore storage errors and still close the banner.
    }
  }

  function closeCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    safeStorageSet('pcpropr-cookie-ok', '1');
    banner.hidden = true;
    banner.style.display = 'none';
    banner.setAttribute('aria-hidden', 'true');
  }

  function setupMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open');
    });

    nav.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
  }

  function setupCookies() {
    const banner = document.getElementById('cookie-banner');
    const accept = document.getElementById('accept-cookies');
    if (banner) {
      const accepted = safeStorageGet('pcpropr-cookie-ok');
      if (!accepted) {
        banner.hidden = false;
        banner.style.display = 'flex';
        banner.setAttribute('aria-hidden', 'false');
      } else {
        closeCookieBanner();
      }
    }

    if (accept) {
      accept.addEventListener('click', closeCookieBanner);
    }
  }

  function setupProfileWidget() {
    const widget = document.querySelector('[data-profile-widget]');
    if (!widget) return;

    const data = {
      iniciante: {
        title: 'Comece pelo básico sem cair em promessa milagrosa.',
        text: 'Leia guias de segurança, apps essenciais, IA para tarefas simples e organização digital antes de comprar ferramenta cara.',
        items: [
          'Checklist de segurança em 15 minutos',
          '5 apps que resolvem rotina sem configuração difícil',
          'IA no dia a dia: o que funciona e o que é exagero',
        ],
      },
      estudante: {
        title: 'Aprenda mais rápido usando tecnologia sem perder foco.',
        text: 'A trilha do estudante prioriza IA para estudo, organização de arquivos, ferramentas gratuitas e setup barato para aprender melhor.',
        items: [
          'Como usar IA para estudar sem copiar resposta pronta',
          'Setup barato para estudar programação',
          'Apps gratuitos para organizar aulas, PDFs e tarefas',
        ],
      },
      dev: {
        title: 'Ferramentas, código e produtividade com prova real.',
        text: 'O foco para devs é testar ferramentas no fluxo de trabalho: editor, deploy, banco de dados, automação e IA para código.',
        items: [
          'Construa uma landing page e publique em produção',
          'IA para programar: onde ajuda e onde atrapalha',
          'Checklist de deploy para projetos pequenos',
        ],
      },
      criador: {
        title: 'Crie mais conteúdo com menos ferramenta sobrando.',
        text: 'A trilha de criador compara apps de edição, IA, calendário editorial e automações simples para publicar com consistência.',
        items: [
          'Ferramentas de IA para roteiro, imagem e cortes',
          'Como montar um calendário editorial simples',
          'Apps que aceleram publicação sem perder qualidade',
        ],
      },
      empreendedor: {
        title: 'Tecnologia que reduz custo, risco e bagunça operacional.',
        text: 'Para empreendedores, o Pcpropr prioriza segurança, automação, organização financeira, atendimento e ferramentas com bom custo-benefício.',
        items: [
          'Automação simples para pequenos negócios',
          'Como escolher ferramenta sem cair em plano caro',
          'Fintech, pagamentos e organização com visão prática',
        ],
      },
    };

    const title = widget.querySelector('[data-profile-title]');
    const text = widget.querySelector('[data-profile-text]');
    const list = widget.querySelector('[data-profile-list]');
    const buttons = widget.querySelectorAll('[data-profile]');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const profile = button.getAttribute('data-profile');
        const selected = data[profile];
        if (!selected) return;

        buttons.forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        title.textContent = selected.title;
        text.textContent = selected.text;
        list.innerHTML = selected.items.map((item) => `<li>${item}</li>`).join('');
      });
    });
  }


  const WP_PLACEHOLDER_HOSTS = ['seu-wordpress-aqui.com'];

  function getWpConfig() {
    const defaults = {
      apiBase: '/wp-json/wp/v2',
      articlePage: '/paginas/artigo/index.html',
      postsPerPage: 12,
      homePosts: 6,
      cacheMinutes: 10,
    };
    const config = Object.assign({}, defaults, window.PCPROPR_WP_CONFIG || {});
    config.apiBase = String(config.apiBase || defaults.apiBase).replace(/\/+$/, '');
    config.articlePage = String(config.articlePage || defaults.articlePage);
    return config;
  }

  function isLikelyUnconfiguredApi(apiBase) {
    try {
      const url = new URL(apiBase, window.location.origin);
      return WP_PLACEHOLDER_HOSTS.some((host) => url.hostname.toLowerCase() === host.toLowerCase());
    } catch (e) {
      return false;
    }
  }

  function decodeHtml(value) {
    const element = document.createElement('textarea');
    element.innerHTML = value || '';
    return element.value;
  }

  function stripHtml(value) {
    const element = document.createElement('div');
    element.innerHTML = value || '';
    return (element.textContent || element.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function clampText(value, maxLength) {
    const text = stripHtml(value);
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
  }

  function formatDate(value) {
    if (!value) return '';
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(value));
    } catch (e) {
      return '';
    }
  }

  function estimateReadTime(html) {
    const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 220));
  }

  function getPostTerms(post) {
    const terms = post && post._embedded && post._embedded['wp:term'];
    if (!Array.isArray(terms)) return [];
    return terms.flat().filter((term) => term && term.name && term.taxonomy === 'category');
  }

  function getPostAuthor(post) {
    const authors = post && post._embedded && post._embedded.author;
    if (Array.isArray(authors) && authors[0] && authors[0].name) return authors[0].name;
    return 'Pcpropr';
  }

  function getFeaturedImage(post) {
    const media = post && post._embedded && post._embedded['wp:featuredmedia'];
    if (!Array.isArray(media) || !media[0]) return null;
    const item = media[0];
    const sizes = item.media_details && item.media_details.sizes ? item.media_details.sizes : {};
    const src = (sizes.large && sizes.large.source_url) || (sizes.medium_large && sizes.medium_large.source_url) || item.source_url;
    if (!src) return null;
    return {
      src,
      alt: item.alt_text || stripHtml(post.title && post.title.rendered) || 'Imagem do artigo Pcpropr',
    };
  }

  function createWpUrl(path, params) {
    const config = getWpConfig();
    const base = config.apiBase + path;
    const url = new URL(base, window.location.origin);
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
    });
    return url.toString();
  }

  async function fetchWp(path, params) {
    const config = getWpConfig();
    if (isLikelyUnconfiguredApi(config.apiBase)) {
      throw new Error('Configure a URL do WordPress em /assets/js/wordpress-config.js.');
    }

    const url = createWpUrl(path, params);
    const cacheKey = 'pcpropr-wp-cache:' + url;
    const cacheMinutes = Number(config.cacheMinutes || 0);

    if (cacheMinutes > 0) {
      try {
        const cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
        if (cached && cached.time && Date.now() - cached.time < cacheMinutes * 60 * 1000) {
          return cached.data;
        }
      } catch (e) {
        // Ignore cache failures.
      }
    }

    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Não foi possível carregar os artigos do WordPress.');
    const data = await response.json();

    if (cacheMinutes > 0) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), data }));
      } catch (e) {
        // Ignore cache quota failures.
      }
    }

    return data;
  }

  function postCardHtml(post, index) {
    const config = getWpConfig();
    const image = getFeaturedImage(post);
    const terms = getPostTerms(post).slice(0, 2);
    const title = decodeHtml(post.title && post.title.rendered);
    const excerpt = clampText(post.excerpt && post.excerpt.rendered, 150);
    const readTime = estimateReadTime(post.content && post.content.rendered);
    const date = formatDate(post.date);
    const href = `${config.articlePage}?slug=${encodeURIComponent(post.slug)}`;
    const badges = terms.length
      ? terms.map((term) => `<span class="tag">${decodeHtml(term.name)}</span>`).join('')
      : '<span class="tag">Pcpropr</span>';

    return `
      <a class="article-card wp-post-card" href="${href}">
        ${image ? `<span class="wp-card-image"><img src="${image.src}" alt="${image.alt}" loading="lazy"></span>` : `<span class="index-badge">${String(index + 1).padStart(2, '0')}</span>`}
        <div class="card-meta">
          ${badges}
          <span class="tag">${readTime} min</span>
        </div>
        <h3>${title}</h3>
        <p>${excerpt}</p>
        <span class="wp-card-footer">${date || 'Publicado no WordPress'} <strong>Ler artigo</strong></span>
      </a>
    `;
  }

  function renderLoading(container, count) {
    container.innerHTML = Array.from({ length: count || 4 }).map(() => `
      <article class="article-card wp-skeleton" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </article>
    `).join('');
  }

  function renderWpError(container, message) {
    container.innerHTML = `
      <div class="wp-status-card">
        <span class="eyebrow">WordPress headless</span>
        <h3>Conecte o painel do WordPress para liberar os artigos dinâmicos.</h3>
        <p>${message || 'Edite o arquivo /assets/js/wordpress-config.js e coloque a URL do WordPress no campo apiBase.'}</p>
        <code>apiBase: 'https://public-api.wordpress.com/wp/v2/sites/p3690.wordpress.com'</code>
      </div>
    `;
  }

  async function setupHomeWordPressPosts() {
    const container = document.querySelector('[data-wp-latest-posts]');
    if (!container) return;
    const limit = Number(container.getAttribute('data-limit') || getWpConfig().homePosts || 6);
    renderLoading(container, Math.min(limit, 6));
    try {
      const posts = await fetchWp('/posts', {
        _embed: '1',
        per_page: limit,
        status: 'publish',
        orderby: 'date',
        order: 'desc',
      });
      if (!Array.isArray(posts) || !posts.length) {
        renderWpError(container, 'Nenhum post publicado foi encontrado no WordPress ainda.');
        return;
      }
      container.innerHTML = posts.map(postCardHtml).join('');
    } catch (error) {
      renderWpError(container, error.message);
    }
  }

  async function setupArchiveWordPressPosts() {
    const container = document.querySelector('[data-wp-archive]');
    if (!container) return;

    const searchForm = document.querySelector('[data-wp-search-form]');
    const searchInput = document.querySelector('[data-wp-search-input]');
    const categoryWrap = document.querySelector('[data-wp-categories]');
    const status = document.querySelector('[data-wp-status]');
    let selectedCategory = new URLSearchParams(window.location.search).get('categoria') || '';
    let currentSearch = new URLSearchParams(window.location.search).get('busca') || '';

    if (searchInput && currentSearch) searchInput.value = currentSearch;

    async function loadPosts() {
      renderLoading(container, 8);
      if (status) status.textContent = 'Carregando artigos do WordPress…';
      try {
        const params = {
          _embed: '1',
          per_page: getWpConfig().postsPerPage || 12,
          status: 'publish',
          orderby: 'date',
          order: 'desc',
          search: currentSearch,
          categories: selectedCategory,
        };
        const posts = await fetchWp('/posts', params);
        if (!Array.isArray(posts) || !posts.length) {
          container.innerHTML = `<div class="wp-status-card"><h3>Nenhum artigo encontrado.</h3><p>Tente outra busca ou publique novos posts no WordPress.</p></div>`;
          if (status) status.textContent = 'Nenhum resultado encontrado.';
          return;
        }
        container.innerHTML = posts.map(postCardHtml).join('');
        if (status) status.textContent = `${posts.length} artigo${posts.length > 1 ? 's' : ''} carregado${posts.length > 1 ? 's' : ''} do WordPress.`;
      } catch (error) {
        renderWpError(container, error.message);
        if (status) status.textContent = 'Aguardando configuração da API do WordPress.';
      }
    }

    async function loadCategories() {
      if (!categoryWrap) return;
      try {
        const categories = await fetchWp('/categories', {
          per_page: 20,
          hide_empty: 'true',
          orderby: 'count',
          order: 'desc',
        });
        const buttons = [`<button type="button" class="${selectedCategory ? '' : 'is-active'}" data-category="">Todos</button>`]
          .concat((categories || []).map((category) => `<button type="button" class="${String(category.id) === String(selectedCategory) ? 'is-active' : ''}" data-category="${category.id}">${decodeHtml(category.name)}</button>`));
        categoryWrap.innerHTML = buttons.join('');
      } catch (error) {
        categoryWrap.innerHTML = '<button type="button" class="is-active" data-category="">Todos</button>';
      }
    }

    if (searchForm) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        currentSearch = searchInput ? searchInput.value.trim() : '';
        loadPosts();
      });
    }

    if (categoryWrap) {
      categoryWrap.addEventListener('click', (event) => {
        const button = event.target.closest('[data-category]');
        if (!button) return;
        selectedCategory = button.getAttribute('data-category') || '';
        categoryWrap.querySelectorAll('button').forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');
        loadPosts();
      });
    }

    await loadCategories();
    await loadPosts();
  }

  function setMeta(name, value, property) {
    if (!value) return;
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(property ? 'property' : 'name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', value);
  }

  async function setupSingleWordPressPost() {
    const container = document.querySelector('[data-wp-single]');
    if (!container) return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (!slug) {
      container.innerHTML = `<div class="wp-status-card"><h1>Artigo não informado.</h1><p>Volte para a página de artigos e escolha uma publicação.</p><a class="button button-primary" href="/paginas/artigos/index.html">Ver artigos</a></div>`;
      return;
    }

    container.innerHTML = '<div class="wp-status-card"><h1>Carregando artigo…</h1><p>Buscando a publicação no WordPress.</p></div>';

    try {
      const posts = await fetchWp('/posts', { slug, _embed: '1', status: 'publish' });
      const post = Array.isArray(posts) ? posts[0] : null;
      if (!post) {
        container.innerHTML = `<div class="wp-status-card"><h1>Artigo não encontrado.</h1><p>Confira se o slug existe no WordPress e se o post está publicado.</p><a class="button button-primary" href="/paginas/artigos/index.html">Ver artigos</a></div>`;
        return;
      }

      const title = decodeHtml(post.title && post.title.rendered);
      const excerpt = clampText(post.excerpt && post.excerpt.rendered, 170);
      const image = getFeaturedImage(post);
      const categories = getPostTerms(post).slice(0, 4);
      const author = getPostAuthor(post);
      const readTime = estimateReadTime(post.content && post.content.rendered);
      const date = formatDate(post.date);
      const tags = categories.map((category) => `<span class="tag">${decodeHtml(category.name)}</span>`).join('');

      document.title = `${title} | Pcpropr`;
      setMeta('description', excerpt || title);
      setMeta('og:title', `${title} | Pcpropr`, true);
      setMeta('og:description', excerpt || title, true);
      if (image) setMeta('og:image', image.src, true);

      container.innerHTML = `
        <nav class="breadcrumbs" aria-label="Caminho do artigo">
          <a href="/index.html">Início</a><span>/</span><a href="/paginas/artigos/index.html">Artigos</a><span>/</span><span>${title}</span>
        </nav>
        <article class="wp-article-shell">
          <header class="wp-article-hero">
            <div>
              <span class="eyebrow">Publicado no WordPress</span>
              <h1>${title}</h1>
              <p>${excerpt}</p>
              <div class="card-meta">
                ${tags || '<span class="tag">Pcpropr</span>'}
                <span class="tag">${date}</span>
                <span class="tag">${readTime} min de leitura</span>
                <span class="tag">Por ${author}</span>
              </div>
            </div>
            ${image ? `<figure class="wp-article-cover"><img src="${image.src}" alt="${image.alt}"></figure>` : ''}
          </header>
          <div class="wp-article-layout">
            <main class="wp-article-content">
              ${post.content && post.content.rendered ? post.content.rendered : '<p>Este artigo ainda não tem conteúdo.</p>'}
            </main>
            <aside class="wp-article-aside">
              <h2>Veredito Pcpropr</h2>
              <p>Use este bloco no WordPress para transformar cada post em uma decisão prática: para quem serve, quando vale a pena e qual o próximo passo.</p>
              <a class="button button-primary" href="/paginas/artigos/index.html">Mais artigos</a>
              <a class="button button-secondary" href="https://pay.pcpropr.com.br/" target="_blank" rel="noopener noreferrer">Conhecer PcproPay</a>
            </aside>
          </div>
        </article>
      `;
    } catch (error) {
      renderWpError(container, error.message);
    }
  }


  window.pcproprAcceptCookies = closeCookieBanner;

  document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    setupCookies();
    setupProfileWidget();
    setupHomeWordPressPosts();
    setupArchiveWordPressPosts();
    setupSingleWordPressPost();

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (target && target.id === 'accept-cookies') {
        closeCookieBanner();
      }
    });
  });
})();
