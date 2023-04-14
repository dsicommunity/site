FROM ghost

WORKDIR /var/lib/ghost

RUN ghost config url http://localhost:3102
