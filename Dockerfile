FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN ls -l /app/node_modules/.prisma/client
EXPOSE 8080
CMD ["npm", "run", "dev"]
