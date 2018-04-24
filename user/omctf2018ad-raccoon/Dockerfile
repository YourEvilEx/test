FROM node:carbon
LABEL Description="omctf2018ad-space-raccoon"

RUN mkdir -p /raccoon
COPY . /raccoon
WORKDIR /raccoon
RUN npm install

EXPOSE 6666
ENTRYPOINT ["npm", "run", "server"]

