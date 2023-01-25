openssl genrsa 2048 > server.key
openssl req -new -key server.key -out server.csr -subj "/C=JP/ST=Saita/L=Fujimino/O=JRC/OU=Radio NW SG/CN=localhost"
openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt -extfile san.txt