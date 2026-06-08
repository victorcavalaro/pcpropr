# Guia rápido — WordPress como back-end do Pcpropr

## Objetivo

Usar o WordPress apenas como painel de publicação. O site público continua sendo o front-end premium do Pcpropr.

## Configuração recomendada

- Front-end: `https://pcpropr.com.br`
- WordPress admin/API: `https://wp.pcpropr.com.br`

No WordPress, configure links permanentes como **Nome do post**.

## Endpoint usado pelo front-end

O front-end busca posts em:

```txt
https://wp.pcpropr.com.br/wp-json/wp/v2/posts?_embed=1
```

O parâmetro `_embed=1` permite trazer autor, categorias e imagem destacada junto com o post.

## Checklist para cada artigo

- Título forte.
- Resumo preenchido.
- Imagem destacada.
- Categoria correta.
- Conteúdo com subtítulos H2 e H3.
- Conclusão com veredito claro.

## Categorias sugeridas

- IA sem hype
- Setup inteligente
- Apps que economizam tempo
- Segurança para gente normal
- Programação prática
- Fintech e vida digital
- PcproPay

## Onde alterar a URL da API no front-end

Edite:

```txt
/assets/js/wordpress-config.js
```

E ajuste:

```js
apiBase: 'https://wp.pcpropr.com.br/wp-json/wp/v2'
```
