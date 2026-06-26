
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

  function getCookieBanners() {
    return ['ap-cookie-banner', 'cookie-banner']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
  }

  function closeCookieBanner() {
    const banners = getCookieBanners();
    safeStorageSet('pcpropr-cookie-ok', '1');
    banners.forEach((banner) => {
      banner.hidden = true;
      banner.style.display = 'none';
      banner.setAttribute('aria-hidden', 'true');
    });
  }

  function setupMenu() {
    const toggles = document.querySelectorAll('.menu-toggle, .ap-menu-toggle');
    if (!toggles.length) return;

    toggles.forEach((toggle) => {
      const targetId = toggle.getAttribute('aria-controls');
      const nav = targetId
        ? document.getElementById(targetId)
        : document.querySelector('.site-nav, .ap-nav');
      if (!nav) return;

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
    });
  }

  function setupCookies() {
    const banners = getCookieBanners();
    const acceptButtons = document.querySelectorAll('#accept-cookies, #ap-accept-cookies');
    if (banners.length) {
      const accepted = safeStorageGet('pcpropr-cookie-ok');
      if (!accepted) {
        const visibleBanner = document.getElementById('ap-cookie-banner') || document.getElementById('cookie-banner');
        banners.forEach((banner) => {
          if (banner === visibleBanner) {
            banner.hidden = false;
            banner.style.display = 'flex';
            banner.setAttribute('aria-hidden', 'false');
          } else {
            banner.hidden = true;
            banner.style.display = 'none';
            banner.setAttribute('aria-hidden', 'true');
          }
        });
      } else {
        closeCookieBanner();
      }
    }

    acceptButtons.forEach((button) => button.addEventListener('click', closeCookieBanner));
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
      archivePageSize: 5,
      archiveFetchLimit: 100,
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
    if ((!Array.isArray(media) || !media[0]) && post && post.jetpack_featured_media_url) {
      return {
        src: post.jetpack_featured_media_url,
        alt: stripHtml(post.title && post.title.rendered) || 'Imagem do artigo Pcpropr',
      };
    }
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
      <a class="article-card wp-post-card ${image ? 'has-image' : 'no-image'}" href="${href}">
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
      <div class="wp-status-card wp-status-card-compact">
        <span class="eyebrow">WordPress conectado</span>
        <h3>Os artigos aparecem aqui automaticamente.</h3>
        <p>${message || 'Publique um post no WordPress para atualizar esta área do Pcpropr.'}</p>
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
        orderby: 'date',
        order: 'desc',
      });
      if (!Array.isArray(posts) || !posts.length) {
        container.innerHTML = `
          <div class="wp-status-card wp-status-card-compact">
            <span class="eyebrow">Aguardando publicações</span>
            <h3>Nenhum artigo publicado ainda.</h3>
            <p>Crie um post no WordPress para ele aparecer automaticamente na home do Pcpropr.</p>
          </div>
        `;
        return;
      }
      container.innerHTML = posts.map(postCardHtml).join('');
    } catch (error) {
      renderWpError(container, error.message);
    }
  }


  function sidebarPostHtml(post, index) {
    const config = getWpConfig();
    const title = decodeHtml(post.title && post.title.rendered) || 'Publicação Pcpropr';
    const date = formatDate(post.date);
    const terms = getPostTerms(post);
    const category = terms[0] ? decodeHtml(terms[0].name) : 'Pcpropr';
    const href = `${config.articlePage}?slug=${encodeURIComponent(post.slug)}`;
    return `
      <a class="sidebar-post-item" href="${href}">
        <span class="sidebar-post-number">${String(index + 1).padStart(2, '0')}</span>
        <span>
          <strong>${title}</strong>
          <small>${date || 'Publicado'} • ${category}</small>
        </span>
      </a>
    `;
  }

  async function setupSidebarWordPressPosts() {
    const container = document.querySelector('[data-wp-sidebar-posts]');
    if (!container) return;
    const limit = Number(container.getAttribute('data-limit') || 10);
    container.innerHTML = Array.from({ length: Math.min(limit, 5) }).map((_, index) => `
      <div class="sidebar-post-item sidebar-skeleton" aria-hidden="true">
        <span class="sidebar-post-number">${String(index + 1).padStart(2, '0')}</span>
        <span><strong></strong><small></small></span>
      </div>
    `).join('');
    try {
      const posts = await fetchWp('/posts', {
        _embed: '1',
        per_page: limit,
        orderby: 'date',
        order: 'desc',
      });
      if (!Array.isArray(posts) || !posts.length) {
        container.innerHTML = '<div class="sidebar-empty">Nenhum artigo publicado ainda.</div>';
        return;
      }
      container.innerHTML = posts.slice(0, limit).map(sidebarPostHtml).join('');
    } catch (error) {
      container.innerHTML = '<div class="sidebar-empty">Não foi possível carregar agora. Confira o arquivo wordpress-config.js e tente atualizar a página.</div>';
    }
  }

  async function setupArchiveWordPressPosts() {
    const container = document.querySelector('[data-wp-archive]');
    if (!container) return;

    const searchForm = document.querySelector('[data-wp-search-form]');
    const searchInput = document.querySelector('[data-wp-search-input]');
    const categoryWrap = document.querySelector('[data-wp-categories]');
    const status = document.querySelector('[data-wp-status]');
    const pagination = document.querySelector('[data-wp-pagination]') || createPaginationContainer(container);
    const paramsFromUrl = new URLSearchParams(window.location.search);
    const pageSize = Math.max(1, Number(container.getAttribute('data-page-size') || getWpConfig().archivePageSize || 5));
    const fetchLimit = Math.min(100, Math.max(pageSize, Number(getWpConfig().archiveFetchLimit || 100)));
    let selectedCategory = paramsFromUrl.get('categoria') || '';
    let currentSearch = paramsFromUrl.get('busca') || '';
    let currentPage = Math.max(1, Number(paramsFromUrl.get('pagina') || 1));
    let allPosts = [];

    if (searchInput && currentSearch) searchInput.value = currentSearch;

    function createPaginationContainer(reference) {
      const nav = document.createElement('nav');
      nav.className = 'ap-pagination';
      nav.setAttribute('data-wp-pagination', '');
      nav.setAttribute('aria-label', 'Paginação de artigos');
      reference.insertAdjacentElement('afterend', nav);
      return nav;
    }

    function updateArchiveUrl() {
      if (!window.history || !window.history.replaceState) return;
      const nextParams = new URLSearchParams(window.location.search);
      if (selectedCategory) nextParams.set('categoria', selectedCategory); else nextParams.delete('categoria');
      if (currentSearch) nextParams.set('busca', currentSearch); else nextParams.delete('busca');
      if (currentPage > 1) nextParams.set('pagina', String(currentPage)); else nextParams.delete('pagina');
      const query = nextParams.toString();
      const nextUrl = window.location.pathname + (query ? '?' + query : '') + window.location.hash;
      window.history.replaceState({}, '', nextUrl);
    }

    function scrollToArchiveTop() {
      const layout = document.querySelector('.ap-main-layout') || document.querySelector('#arquivo-wordpress') || container;
      if (!layout) return;
      layout.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderPagination(totalPages) {
      if (!pagination) return;
      if (totalPages <= 1) {
        pagination.innerHTML = '';
        pagination.hidden = true;
        return;
      }

      pagination.hidden = false;
      const pages = [];
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('…');
      }
      for (let page = startPage; page <= endPage; page += 1) pages.push(page);
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('…');
        pages.push(totalPages);
      }

      pagination.innerHTML = `
        <button type="button" class="ap-page-btn ap-page-prev" data-page-action="prev" ${currentPage <= 1 ? 'disabled' : ''}>Anterior</button>
        <div class="ap-page-numbers" aria-label="Páginas">
          ${pages.map((page) => page === '…'
            ? '<span class="ap-page-ellipsis">…</span>'
            : `<button type="button" class="ap-page-btn ${page === currentPage ? 'is-active' : ''}" data-page="${page}" aria-current="${page === currentPage ? 'page' : 'false'}">${page}</button>`
          ).join('')}
        </div>
        <button type="button" class="ap-page-btn ap-page-next" data-page-action="next" ${currentPage >= totalPages ? 'disabled' : ''}>Próxima</button>
      `;
    }

    function renderCurrentPage() {
      const totalPages = Math.max(1, Math.ceil(allPosts.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      const start = (currentPage - 1) * pageSize;
      const posts = allPosts.slice(start, start + pageSize);

      if (!posts.length) {
        container.innerHTML = `<div class="wp-status-card"><h3>Nenhum artigo encontrado.</h3><p>Tente outra busca ou publique novos posts no WordPress.</p></div>`;
        if (pagination) {
          pagination.innerHTML = '';
          pagination.hidden = true;
        }
        if (status) status.textContent = 'Nenhum resultado encontrado.';
        return;
      }

      container.innerHTML = posts.map((post, index) => postCardHtml(post, start + index)).join('');
      renderPagination(totalPages);
      updateArchiveUrl();

      const first = start + 1;
      const last = Math.min(start + pageSize, allPosts.length);
      if (status) {
        status.textContent = `Mostrando ${first}-${last} de ${allPosts.length} artigo${allPosts.length > 1 ? 's' : ''}. Página ${currentPage} de ${totalPages}.`;
      }
    }

    async function loadPosts(resetPage) {
      if (resetPage) currentPage = 1;
      renderLoading(container, pageSize);
      if (pagination) {
        pagination.innerHTML = '';
        pagination.hidden = true;
      }
      if (status) status.textContent = 'Carregando artigos do WordPress…';
      try {
        const params = {
          _embed: '1',
          per_page: fetchLimit,
          orderby: 'date',
          order: 'desc',
          search: currentSearch,
          categories: selectedCategory,
        };
        const posts = await fetchWp('/posts', params);
        allPosts = Array.isArray(posts) ? posts : [];
        renderCurrentPage();
      } catch (error) {
        allPosts = [];
        renderWpError(container, error.message);
        if (pagination) {
          pagination.innerHTML = '';
          pagination.hidden = true;
        }
        if (status) status.textContent = 'Aguardando configuração da API do WordPress.';
      }
    }

    function isCategorySelect() {
      return categoryWrap && categoryWrap.tagName && categoryWrap.tagName.toLowerCase() === 'select';
    }

    function renderCategoryOptions(categories) {
      const options = [`<option value="" ${selectedCategory ? '' : 'selected'}>Todos</option>`]
        .concat((categories || []).map((category) => `<option value="${category.id}" ${String(category.id) === String(selectedCategory) ? 'selected' : ''}>${decodeHtml(category.name)}</option>`));
      categoryWrap.innerHTML = options.join('');
    }

    function renderCategoryButtons(categories) {
      const buttons = [`<button type="button" class="${selectedCategory ? '' : 'is-active'}" data-category="">Todos</button>`]
        .concat((categories || []).map((category) => `<button type="button" class="${String(category.id) === String(selectedCategory) ? 'is-active' : ''}" data-category="${category.id}">${decodeHtml(category.name)}</button>`));
      categoryWrap.innerHTML = buttons.join('');
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

        if (isCategorySelect()) {
          renderCategoryOptions(categories);
          return;
        }

        renderCategoryButtons(categories);
      } catch (error) {
        if (isCategorySelect()) {
          categoryWrap.innerHTML = '<option value="">Todos</option>';
          return;
        }
        categoryWrap.innerHTML = '<button type="button" class="is-active" data-category="">Todos</button>';
      }
    }

    if (searchForm) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        currentSearch = searchInput ? searchInput.value.trim() : '';
        loadPosts(true);
      });
    }

    if (categoryWrap) {
      if (categoryWrap.tagName && categoryWrap.tagName.toLowerCase() === 'select') {
        categoryWrap.addEventListener('change', () => {
          selectedCategory = categoryWrap.value || '';
          loadPosts(true);
        });
      } else {
        categoryWrap.addEventListener('click', (event) => {
          const button = event.target.closest('[data-category]');
          if (!button) return;
          selectedCategory = button.getAttribute('data-category') || '';
          categoryWrap.querySelectorAll('button').forEach((item) => item.classList.remove('is-active'));
          button.classList.add('is-active');
          loadPosts(true);
        });
      }
    }

    if (pagination) {
      pagination.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button || button.disabled) return;
        const totalPages = Math.max(1, Math.ceil(allPosts.length / pageSize));
        const action = button.getAttribute('data-page-action');
        const page = Number(button.getAttribute('data-page'));

        if (action === 'prev') currentPage -= 1;
        else if (action === 'next') currentPage += 1;
        else if (page) currentPage = page;

        currentPage = Math.min(Math.max(1, currentPage), totalPages);
        renderCurrentPage();
        scrollToArchiveTop();
      });
    }

    await loadCategories();
    await loadPosts(false);
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
    const statusCard = (title, text, actionLabel = 'Ver artigos') => `
      <div class="reader-status-card">
        <span class="reader-status-mark"></span>
        <h1>${title}</h1>
        <p>${text}</p>
        <a class="ap-btn ap-btn-primary" href="/paginas/artigos/index.html">${actionLabel}</a>
      </div>`;

    if (!slug) {
      container.innerHTML = statusCard('Artigo não informado.', 'Volte para a página de artigos e escolha uma publicação.');
      return;
    }

    container.innerHTML = '<div class="reader-status-card"><span class="reader-status-mark"></span><h1>Carregando artigo…</h1><p>Buscando a publicação no WordPress.</p></div>';

    try {
      const posts = await fetchWp('/posts', { slug, _embed: '1' });
      const post = Array.isArray(posts) ? posts[0] : null;
      if (!post) {
        container.innerHTML = statusCard('Artigo não encontrado.', 'Confira se o slug existe no WordPress e se o post está publicado.');
        return;
      }

      const title = decodeHtml(post.title && post.title.rendered);
      const excerpt = clampText(post.excerpt && post.excerpt.rendered, 210);
      const image = getFeaturedImage(post);
      const categories = getPostTerms(post).slice(0, 4);
      const primaryCategory = categories[0] ? decodeHtml(categories[0].name) : 'Pcpropr';
      const author = getPostAuthor(post);
      const readTime = estimateReadTime(post.content && post.content.rendered);
      const date = formatDate(post.date);
      const tags = categories.map((category) => `<span>${decodeHtml(category.name)}</span>`).join('');
      const content = post.content && post.content.rendered ? post.content.rendered : '<p>Este artigo ainda não tem conteúdo.</p>';

      document.title = `${title} | Pcpropr`;
      setMeta('description', excerpt || title);
      setMeta('og:title', `${title} | Pcpropr`, true);
      setMeta('og:description', excerpt || title, true);
      setMeta('twitter:title', `${title} | Pcpropr`);
      setMeta('twitter:description', excerpt || title);
      if (image) {
        setMeta('og:image', image.src, true);
        setMeta('twitter:image', image.src);
      }

      const heroTags = categories.slice(0, 2).map((category) => `<span>${decodeHtml(category.name)}</span>`).join('');
      container.innerHTML = `
        <article class="reader-article reader-article-clean">
          <header class="reader-top-card ${image ? 'has-cover' : 'no-cover'}">
            ${image ? `<figure class="reader-top-cover"><img src="${image.src}" alt="${image.alt}"></figure>` : ''}

            <div class="reader-top-body" aria-label="Apresentação do artigo">
              <div class="reader-top-meta">
                ${heroTags || `<span>${primaryCategory}</span>`}
                <span>${readTime} min</span>
                <nav class="reader-breadcrumbs reader-breadcrumbs-chip" aria-label="Caminho do artigo">
                  <a href="/index.html">Início</a>
                  <span>/</span>
                  <a href="/paginas/artigos/index.html">Artigos</a>
                  <span>/</span>
                  <strong>${primaryCategory}</strong>
                </nav>
              </div>

              <h1 class="reader-top-title">${title}</h1>
              ${excerpt ? `<p class="reader-top-excerpt">${excerpt}</p>` : ''}

              <div class="reader-top-footer">
                <span class="reader-top-date">${date}</span>
                <div class="reader-author-actions">
                  <div class="reader-author-row reader-author-inline" aria-label="Informações do artigo">
                    <span class="reader-author-avatar" aria-hidden="true">${author ? author.charAt(0).toUpperCase() : 'P'}</span>
                    <span><strong>Por ${author || 'Pcpropr'}</strong><small>Publicado no WordPress</small></span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div class="reader-content-wrap">
            <section class="reader-content-card">
              <div class="reader-content">
                ${content}
              </div>
            </section>
          </div>

          <section class="reader-next-card" aria-label="Continuar navegando">
            <div>
              <span>Continue lendo</span>
              <h2>Explore outros artigos do Pcpropr</h2>
              <p>Volte para a lista, filtre por categoria e encontre o próximo guia prático.</p>
            </div>
            <a class="ap-btn ap-btn-primary" href="/paginas/artigos/index.html">Ver artigos</a>
          </section>
        </article>
      `;
    } catch (error) {
      container.innerHTML = statusCard('Não foi possível carregar.', error.message || 'Tente novamente em instantes.', 'Voltar aos artigos');
    }
  }


  window.pcproprAcceptCookies = closeCookieBanner;

  document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    setupCookies();
    setupProfileWidget();
    setupHomeWordPressPosts();
    setupSidebarWordPressPosts();
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
