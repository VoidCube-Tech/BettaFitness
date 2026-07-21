# Casa Matéria

Vitrine pública e painel administrativo para uma loja de objetos para casa. O projeto usa React, TypeScript, Vite, React Router, Tailwind CSS, Framer Motion, GSAP ScrollTrigger, Lenis e Lucide React.

## Executar

```bash
npm install
npm run dev
npm run build
npm run preview
```

Rotas:

- `/` — landing page pública.
- `/admin` — redireciona para o painel.
- `/admin/produtos` — cadastro, edição e exclusão de produtos.

## Como os produtos funcionam

Os dados iniciais ficam em `src/data/initialProducts.ts`. A landing e o painel consomem o mesmo estado em `src/store/ProductContext.tsx`.

O acesso ao `localStorage` acontece apenas em `src/services/productService.ts`. Essa camada expõe `getProducts`, `createProduct`, `updateProduct` e `deleteProduct`, podendo ser substituída por uma API sem alterar as páginas.

Campos editáveis:

- Nome.
- Foto PNG, JPG, JPEG ou WebP de até 2 MB.
- Preço.
- Tipo.

## Personalização

- Marca, WhatsApp e e-mail: `src/config/siteConfig.ts`.
- Produtos iniciais: `src/data/initialProducts.ts`.
- Imagens: `src/assets/images/products/`.
- Vídeo e poster: `src/assets/videos/` e `src/assets/images/vitrine-hero.png`.
- Tokens visuais: `src/styles/tokens.css`.
- Layout e responsividade: `src/styles/globals.css`.
- SEO: `index.html`, `public/robots.txt` e `public/sitemap.xml`.

## Acessibilidade e movimento

O painel utiliza diálogos nativos, com foco contido e fechamento por `Esc`. Campos inválidos recebem mensagens associadas, o FAQ usa `aria-expanded`, imagens possuem texto alternativo e todos os controles têm foco visível.

Com `prefers-reduced-motion`, vídeo, Lenis e pinning são desativados. No mobile, o storytelling vira uma sequência vertical com indicador horizontal.

## Acesso administrativo

A rota `/admin/produtos` exige autenticação e redireciona para `/login`. A sessão permanece ativa enquanto a aba estiver aberta.

Credenciais locais padrão:

- E-mail: `admin@casamateria.com.br`
- Senha: `materia2026`

Copie `.env.example` para `.env` para personalizar `VITE_ADMIN_EMAIL` e `VITE_ADMIN_PASSWORD`. Esta autenticação protege a navegação do protótipo no cliente; em produção, use uma API com senha criptografada e cookie de sessão seguro.

## Vídeo da tela de login

O vídeo corporativo da tela de login é de Mikhail Nilov, disponibilizado gratuitamente pelo [Pexels](https://www.pexels.com/video/a-business-team-doing-a-meeting-8103039/) sob a licença da plataforma. Uma cópia otimizada e sua imagem de capa ficam em `src/assets/videos/login-corporativo.mp4` e `src/assets/images/login-corporativo.jpg`.

## Assets autorais

A prancha de catálogo foi criada para este projeto com a geração de imagens integrada. O prompt definiu quatro fotografias editoriais independentes — luminária de argila, tigela cerâmica, manta verde e aroma em vidro âmbar — com materiais naturais, luz de janela e sem logos ou textos. Os recortes finais estão em `src/assets/images/products/`.
