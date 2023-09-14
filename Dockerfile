#Base Image node:16.19.1-alpine
FROM node:16.19.1-alpine


#Set working directory to /app
WORKDIR /


#Set PATH /app/node_modules/.bin
ENV PATH /node_modules/.bin:$PATH


#Copy package.json in the image
COPY package.json ./


RUN npm install

#Copy the app
COPY . ./

EXPOSE 8000

#Start the app
CMD ["node", "/src/server.js"]

