# Ajuste aplicado para AdSense + WordPress Headless

O problema principal era que a página de artigos e a home dependiam da API do WordPress para exibir conteúdo. Quando o robô/avaliador acessava o HTML inicial, ele via mensagens como "Conectando ao WordPress" ou placeholders de carregamento.

## O que foi corrigido

- `/paginas/artigos/index.html` agora contém uma lista estática com 10 artigos reais no HTML inicial.
- `/index.html` agora contém artigos reais no grid principal e na sidebar, em vez de skeletons vazios.
- `assets/js/site.js` foi ajustado para preservar o conteúdo estático caso a API do WordPress falhe.
- A integração com WordPress continua funcionando: se a API carregar corretamente, o JavaScript substitui a lista estática pela lista dinâmica.

## Melhor fluxo daqui para frente

1. Publique o artigo no WordPress.
2. Gere também uma página estática em `/paginas/artigos/slug-do-artigo/index.html`.
3. Atualize a lista estática de `/paginas/artigos/index.html` e da home.
4. Só depois solicite nova revisão no Google AdSense.

Para aprovação no AdSense, evite páginas públicas com textos de teste, placeholders, "carregando", "em construção" ou conteúdo que só aparece depois de uma API externa responder.
