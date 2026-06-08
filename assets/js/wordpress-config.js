/*
  Pcpropr + WordPress.com gratuito
  --------------------------------
  Este arquivo conecta o front-end Pcpropr ao WordPress gratuito p3690.wordpress.com.

  Importante:
  - Nao coloque /posts no final do apiBase.
  - O site.js adiciona /posts, /categories e outras rotas automaticamente.
  - Enquanto estiver testando, cacheMinutes fica 0 para mostrar as mudancas na hora.
*/
window.PCPROPR_WP_CONFIG = {
  apiBase: 'https://public-api.wordpress.com/wp/v2/sites/p3690.wordpress.com',
  articlePage: '/paginas/artigo/index.html',
  postsPerPage: 12,
  homePosts: 6,
  cacheMinutes: 0
};
