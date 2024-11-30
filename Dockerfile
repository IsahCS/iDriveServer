FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN apt-get update && apt-get install -y postgresql-client
EXPOSE 8080
CMD ["npm", "run", "start", "dev"]
