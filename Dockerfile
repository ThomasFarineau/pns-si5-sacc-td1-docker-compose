FROM node:18-slim
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]