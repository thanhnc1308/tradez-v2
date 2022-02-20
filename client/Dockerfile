FROM nginx:1.21.4-alpine

# Nginx config
RUN rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf

# Static build
COPY ./build /var/www

# Set working directory
WORKDIR /var/www

# Alpine docker image doesn't have bash installed by default
# apk add --no-cache bash to keep docker image size small
# RUN apk update && apk add --no-cache bash

# ENV values can be used during the build
ENV REACT_APP_BASE_API=${REACT_APP_BASE_API}
ENV REACT_APP_PUBLIC_FOLDER=${REACT_APP_PUBLIC_FOLDER}

# Expose the port 80 to the public since that is the one we are using in the nginx config
EXPOSE 80

# Start Nginx server
# Run nginx with -g daemon off; so that nginx stays in the foreground so that Docker can track the process properly (otherwise your container will stop immediately after starting)
ENTRYPOINT ["nginx","-g","daemon off;"]
# CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
