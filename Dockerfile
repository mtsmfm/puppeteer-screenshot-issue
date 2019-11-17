FROM node:alpine AS dev-env

RUN apk add --no-cache zsh git less curl perl gnupg \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont

RUN adduser -D app
RUN mkdir /app
RUN chown -R app /app

WORKDIR /app

USER app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

FROM dev-env

COPY --chown=app . .

RUN yarn install

CMD ls -la
