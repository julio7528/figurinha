# Painel de Controle de Figurinhas da Copa

Aplicação React + Vite + TypeScript para controlar figurinhas por seleção, sem login e com persistência no Supabase.

## Stack

- React
- Vite
- TypeScript
- CSS normal
- Supabase

## Configuração local

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local` com base em `.env.example`:

```env
VITE_SUPABASE_URL=COLE_A_URL_DO_SUPABASE_AQUI
VITE_SUPABASE_ANON_KEY=COLE_A_ANON_KEY_DO_SUPABASE_AQUI
```

No Supabase, execute o SQL em `supabase/tbf_figurinha.sql` para criar a tabela única usada pelo app.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Vercel

Ao subir para a Vercel, configure as mesmas variáveis:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
