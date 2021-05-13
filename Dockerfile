FROM fedora:34

RUN dnf update -y
RUN dnf module install nodejs:14 -y

COPY ./package.json /tcc/

WORKDIR /tcc/

RUN npm install -g pm2

RUN npm install

CMD ['pm2-runtime', "pm2.js"]

