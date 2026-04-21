# PROVENDA — Deploy Guide

## Estrutura do Projeto

```
provenda/
├── index.html     ← Página principal
├── style.css      ← Todos os estilos
├── main.js        ← VFX, GSAP, Checkout, Confetti
└── README.md      ← Este arquivo
```

---

## Deploy no GitHub Pages (Gratuito)

### 1. Crie o repositório
1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"**
3. Nome: `provenda` (ou o que preferir)
4. Marque **Public**
5. Clique em **"Create repository"**

### 2. Suba os arquivos
**Opção A — Pelo navegador (mais fácil):**
1. No repositório criado, clique em **"uploading an existing file"**
2. Arraste os 3 arquivos: `index.html`, `style.css`, `main.js`
3. Clique em **"Commit changes"**

**Opção B — Pelo terminal:**
```bash
git init
git add .
git commit -m "deploy inicial provenda"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/provenda.git
git push -u origin main
```

### 3. Ative o GitHub Pages
1. No repositório, vá em **Settings → Pages**
2. Em "Branch", selecione `main` e pasta `/root`
3. Clique em **Save**
4. Aguarde 1-2 minutos
5. Seu site estará em: `https://SEU_USUARIO.github.io/provenda`

---

## Deploy na Vercel (Recomendado — mais rápido)

### 1. Via GitHub (mais fácil)
1. Suba os arquivos no GitHub conforme acima
2. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositório `provenda`
5. Clique em **"Deploy"** — pronto!

### 2. Via Vercel CLI
```bash
npm i -g vercel
cd provenda
vercel
```

### 3. Domínio customizado na Vercel
1. No painel da Vercel, vá em **Settings → Domains**
2. Adicione seu domínio (ex: `provenda.com.br`)
3. Configure os DNS conforme instruído

---

## Atualizando o site

### GitHub Pages — pelo navegador:
1. Abra o arquivo no GitHub
2. Clique no ícone de lápis (editar)
3. Faça a alteração
4. Clique em **"Commit changes"**
5. Aguarde ~1 min para atualizar

### Vercel — automático:
Qualquer push no GitHub atualiza a Vercel automaticamente.

---

## Configurações para personalizar

### Chave PIX (em `index.html`):
Procure por `provenda@gmail.com` e substitua pela sua chave real.

### Preço (em `index.html`):
Procure por `47` e atualize conforme necessário.

### Cor principal (em `style.css`):
```css
:root {
  --amber: #F5A623;   /* cor principal */
  --amber2: #ffc246;  /* hover */
}
```

---

## Dependências (CDN — não precisa instalar nada)

- **GSAP 3.12.5** — animações
- **ScrollTrigger** — animações no scroll
- **SplitType 0.3.4** — animação char-by-char nos textos
- **Anton + JetBrains Mono** — Google Fonts

Todas carregadas via CDN automaticamente.

---

## Checklist antes de ir ao ar

- [ ] Trocar chave PIX real
- [ ] Confirmar e-mail de contato
- [ ] Revisar todos os textos
- [ ] Testar no mobile (Chrome + Safari)
- [ ] Testar checkout (PIX e Cartão)
- [ ] Verificar se confetti aparece no sucesso
- [ ] Testar FAQ (abrir/fechar)
- [ ] Testar scroll suave dos links de nav
