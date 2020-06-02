### Stage 0 - Create image based on the official Node 8.9 image from DockerHub
### Node 10.9 or higher required fro the projects generated with Angular CLI 8.0.0 or higher
FROM node:10.9 as node

### Expect build-time variables
ARG ENVIRONMENT

### Set all global variables from the build-time variables
ENV ENVIRONMENT=$ENVIRONMENT

### Create a directory where our app will be placed
RUN mkdir -p /app

### Change directory so that our commands run inside this new directory
WORKDIR /app

### Copy dependencies
COPY package.json /app/

### Install dependencies
RUN npm install

### Get all the code needed to run the app
COPY ./ /app/

### Expose the port the app runs on
EXPOSE 80

### Build App
### RUN npm run build -- --prod --configuration=$ENVIRONMENT
#RUN npm run build -- --prod --configuration=production
RUN npm run build -- --prod

### Stage 1 - Wrap up the app with Nginx
FROM nginx:1.13
COPY --from=node /app/dist /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf