# 使用 Node 的版本  v17.8.0
FROM node:17

# Node 環境設定為 production
ENV NODE_ENV production

# RUN mkdir /website
# Node 在容器內的位置
WORKDIR /home/ubuntu/travel-project

# ADD ./website /

# 複製 package 設定
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

# EXPOSE 3000

# 執行專案
CMD [ "node", "app.js" ]