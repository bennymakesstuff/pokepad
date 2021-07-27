#FROM nginx

#COPY ./nginx.conf /etc/nginx/nginx.conf

#WORKDIR /app

#COPY ./dist .

#EXPOSE 8080:8080

#CMD [“nginx”, “-g”, “daemon off;”]


FROM node:lts-alpine

RUN apk update

RUN apk add --update python

#RUN apt-get update || : && apt-get install python -y

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./dist .

EXPOSE 8080

RUN npm run build
