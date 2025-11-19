# ==============================================================================
# BUILD STAGE
# Instala dependências e compila a aplicação Next.js
# ==============================================================================
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de manifesto de pacotes
COPY package.json package-lock.json ./

# Instala as dependências de produção primeiro para otimizar o cache
RUN npm install --omit=dev

# Copia o restante do código-fonte da aplicação
COPY . .

# Compila a aplicação Next.js
RUN npm run build

# ==============================================================================
# PRODUCTION STAGE
# Cria a imagem final, leve e otimizada para produção
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Define o ambiente para produção
ENV NODE_ENV=production

# Copia os arquivos da aplicação compilada e as dependências de produção do 'builder'
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expõe a porta que o Next.js usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]