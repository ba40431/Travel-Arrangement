# 使用 Node 的版本  v17.8.0
FROM node:17

# Node 環境設定為 production
# ENV NODE_ENV production

# Node 在容器內的位置
WORKDIR /usr/src/app

# 複製 package 設定
COPY package*.json ./

# 安裝必要的套件並移動到專案的 node_modules 底下
# RUN yarn --production --silent && mv node_modules ../
RUN npm install

# 第一個 . 是我們本地位置，第二個是 docker 裡面專案的位置，就是將我們專案的程式碼全部複製進去
COPY . .

# 開放對外的 port
EXPOSE 3000

# 執行專案
CMD [ "node", "app.js" ]