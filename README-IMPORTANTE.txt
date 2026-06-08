PCPROPR — FRONT-END PREMIUM + WORDPRESS HEADLESS
================================================

Esta versão transforma o Pcpropr em um front-end moderno e independente, usando o WordPress apenas como painel de publicação dos artigos.

COMO FICA A ARQUITETURA
-----------------------
1. Você cria e publica os artigos dentro do WordPress normalmente.
2. O front-end do Pcpropr busca os posts pela API pública do WordPress.
3. A home, a página de artigos e a página individual do artigo são montadas automaticamente com o design premium do Pcpropr.

ARQUIVOS NOVOS / IMPORTANTES
----------------------------
- /assets/js/wordpress-config.js
  Arquivo onde você configura a URL do WordPress.

- /assets/js/site.js
  Agora também contém a integração com a API do WordPress.

- /paginas/artigos/index.html
  Página de arquivo dinâmico de artigos vindos do WordPress.

- /paginas/artigo/index.html
  Página individual dinâmica. Exemplo de URL:
  /paginas/artigo/index.html?slug=meu-primeiro-artigo

- /assets/css/site.css
  Recebeu estilos para cards dinâmicos, busca, filtros, página individual e conteúdo vindo do WordPress.

CONFIGURAÇÃO PRINCIPAL
----------------------
Abra o arquivo:
/assets/js/wordpress-config.js

Troque a linha:
apiBase: 'https://SEU-WORDPRESS-AQUI.com/wp-json/wp/v2',

Pela URL real do seu WordPress.

Exemplos:
- WordPress em subdomínio:
  apiBase: 'https://wp.pcpropr.com.br/wp-json/wp/v2'

- WordPress no mesmo domínio:
  apiBase: '/wp-json/wp/v2'

- WordPress em outro domínio:
  apiBase: 'https://seudominio.com.br/wp-json/wp/v2'

RECOMENDAÇÃO DE INSTALAÇÃO
--------------------------
Para manter o front-end bonito e separado, recomendo instalar o WordPress em um subdomínio, por exemplo:
https://wp.pcpropr.com.br

E manter o front-end em:
https://pcpropr.com.br

No WordPress:
1. Vá em Configurações > Links permanentes.
2. Escolha "Nome do post".
3. Crie categorias como:
   - IA sem hype
   - Setup inteligente
   - Apps
   - Segurança
   - Programação prática
   - PcproPay
4. Sempre preencha:
   - Título
   - Resumo / excerpt
   - Imagem destacada
   - Categoria
   - Conteúdo do artigo

COMO TESTAR
-----------
Abra no navegador:
https://SEU-WORDPRESS/wp-json/wp/v2/posts

Se aparecer uma lista em JSON, a API está funcionando.

Depois abra no front-end:
/paginas/artigos/index.html

PUBLICAÇÃO DO DIA A DIA
-----------------------
A partir de agora, para publicar artigo:
1. Entre no painel do WordPress.
2. Crie um post.
3. Publique.
4. O artigo aparece automaticamente no Pcpropr.

OBSERVAÇÃO IMPORTANTE
---------------------
Se o WordPress estiver em outro domínio/subdomínio e os posts não carregarem, pode ser uma configuração de CORS, cache, firewall ou segurança do servidor. Nesse caso, libere requisições públicas da API REST para o domínio do front-end.

VERSÃO
------
Pcpropr Premium + WordPress Headless — Junho de 2026.


============================================================
CONFIGURACAO WORDPRESS GRATUITO - p3690.wordpress.com
============================================================

Este pacote ja esta configurado para buscar artigos do WordPress gratuito:

https://public-api.wordpress.com/wp/v2/sites/p3690.wordpress.com

Para funcionar:
1. O site WordPress precisa estar lancado/publico.
2. Publique artigos em Posts, nao em Paginas.
3. Cada artigo deve estar com status Publicado.
4. O front-end deve carregar assets/js/wordpress-config.js antes de assets/js/site.js.
5. Enquanto estiver testando, cacheMinutes esta em 0 para nao guardar dados antigos.

Teste no navegador:
https://public-api.wordpress.com/wp/v2/sites/p3690.wordpress.com/posts?per_page=5&_embed=1

Se aparecer JSON com title, content e slug, a API esta funcionando.
Se aparecer [] significa que ainda nao existem posts publicados.
