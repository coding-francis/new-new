FROM node:20-slim AS build

# Set the working directory
WORKDIR /opt/app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package.lock.json ./
RUN npm i

# Copy the rest of the application code
COPY ./bin ./bin
COPY ./src ./src
COPY ./eslintrc.js ./
COPY ./tsconfig.json ./
COPY ./.eslintignore ./
COPY ./.prettierignore ./
COPY ./.prettierrc ./


RUN npm run build

FROM node:20-slim

WORKDIR /opt/app

# Create a new user
RUN adduser --disabled-password --gecos "" myuser


COPY package.json ./
COPY package.lock.json ./



# Install only production dependencies
RUN npm i --only=production

COPY --from=build /opt/app/build/* ./

USER myuser

CMD [ "node" , "bin/index.js"]


