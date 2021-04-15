FROM fedora:33

RUN dnf update -y
RUN dnf module install nodejs:12 -y

VOLUME . /tcc/

WORKDIR /tcc/

RUN npm install -g pm2

RUN npm install

CMD ['pm2-runtime', "pm2.js"]

