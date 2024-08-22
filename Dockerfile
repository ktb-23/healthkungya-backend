# Node.js 이미지 기반
FROM node:22

# 애플리케이션 디렉터리 생성
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .


# 애플리케이션 포트 설정 (필요시 변경)
EXPOSE 3000

# 애플리케이션 시작 명령어
CMD ["npm", "start"]
