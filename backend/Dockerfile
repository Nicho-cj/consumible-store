FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN apk add --no-cache postgresql-client
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]