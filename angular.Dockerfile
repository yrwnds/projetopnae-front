FROM alpine/git:latest AS cloner
WORKDIR /source

RUN git clone --branch master https://github.com/yrwnds/projetopnae-front.git .

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=cloner /source/package*.json ./

RUN npm install

COPY --from=cloner /source/ .

RUN npm run build -- --configuration production

FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/projetopnae-front/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]