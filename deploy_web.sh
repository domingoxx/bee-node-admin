
npm run build:stage

scp -r -i  ~/.ssh/id_xchw dist/index.html root@47.242.89.189:"/opt/server/www/index.html"
ssh -i  ~/.ssh/id_xchw root@47.242.89.189 "rm -rf /opt/server/www/static"
scp -r -i  ~/.ssh/id_xchw dist/static root@47.242.89.189:"/opt/server/www/static"