FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY client ./client
RUN npm install --prefix client && npm run build --prefix client

COPY controllers ./controllers
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY utils ./utils
COPY secrets ./secrets
COPY app.js .
COPY .env .

EXPOSE 3001

CMD ["node", "app.js"]