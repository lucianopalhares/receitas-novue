FROM node:22-alpine AS build

WORKDIR /app

# compila a api pricipal
COPY api/package.json ./package.json
COPY api/tsconfig.json ./tsconfig.json
COPY api/src ./src

RUN npm install && npm run build

FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY api/package.json ./package.json
RUN npm install --omit=dev  && npm cache clean --force
COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
