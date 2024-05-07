FROM node:18-alpine
WORKDIR /chat-app/
COPY public/
COPY src/
COPY package.json
RUN npm install
CMD ["npm", "start"]