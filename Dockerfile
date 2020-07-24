FROM node:8.11.1-alpine as builder
RUN apk update && apk add bash curl tzdata
ENV TZ=Asia/Hong_Kong
ARG EVQSENSE_ENV
ENV REACT_APP_EVQSENSE_PORTAL_ENV=$EVQSENSE_ENV
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app  
COPY package.json .
RUN yarn 
COPY . .  
RUN yarn build

# production environment
FROM nginx:1.13.9-alpine
RUN apk update && apk add bash curl tzdata
ENV TZ=Asia/Hong_Kong
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]