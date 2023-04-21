FROM node:16
WORKDIR /app
COPY . .
RUN npm ci 
EXPOSE 8080
CMD [ "node","server.js" ]

