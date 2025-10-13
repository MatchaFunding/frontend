# README

Este repositorio Front está hecho con **React + Vite + Tailwind**

La versión utilizada de Node es **24.6.0**, para instalarla con `nvm`:

```bash
nvm install latest
```
```bash
nvm use latest
```

A priori, para instalar el repositorio hace falta ejecutar estos comandos en este orden:

```bash
cd my-app
```
```bash
npm install
```
```bash
npm install -D tailwindcss@3.4.3
```
```bash
npx tailwindcss init -p
```
Para ejecutar el código:
```bash
npm run dev
```
Asegurarse de que el tailwind.config.js esté así:
```bash
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```
Y el src/index.css: 
```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Todas esas cosas las hice yo pero no sé si estén en sus carpetas al clonar
