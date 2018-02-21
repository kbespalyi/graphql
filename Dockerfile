FROM node:9.1.0 AS build

ARG PORT=5300

RUN if [ "x$PORT" = "x" ] ; then echo The PORT argument not provided ; else echo The running port is $PORT ; fi

ENV PORT=$PORT

# setup user home dir
ENV USER node

#RUN apk add --update --no-cache curl

# setup application dir
ENV APP_HOME /app
RUN mkdir -vp $APP_HOME
RUN chown $USER:$USER $APP_HOME

# run next commands as user deamon
USER $USER
ENV HOME /home/$USER

# setup temp dir for building distribution
USER root

#install required packages (magick)
#RUN apt-get update
#RUN apt-get install apt-utils netcat -y
#RUN apt-get install imagemagick libmagick++-dev  libmagick++-6.q16-dev -y
#ENV PATH /usr/lib/x86_64-linux-gnu/ImageMagick-6.8.9/bin-Q16:$PATH

# install staging packages

WORKDIR $APP_HOME
COPY . $APP_HOME
RUN chown -R $USER:$USER $APP_HOME
USER $USER

# set NPM stuff
ENV NODE_ENV staging
ENV NPM_CONFIG_LOGLEVEL warn

# Install NPM packages first
ADD ./package.json $APP_HOME/package.json
ADD ./package-lock.json $APP_HOME/package-lock.json

# Setup service
#ENV DIR=/usr/src/service
#COPY $APP_HOME/package.json $DIR/package.json
#COPY $APP_HOME/package-lock.json $DIR/package-lock.json
#COPY $APP_HOME/node_modules $DIR/node_modules
#COPY $APP_HOME/src $DIR/src

HEALTHCHECK --interval=5s \
            --timeout=5s \
            --retries=6 \
            CMD curl -fs http://localhost:$PORT/_health || exit 1

# Start app
CMD ["npm", "start"]
