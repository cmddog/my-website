FROM gradle:8.14.3-jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle installDist

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/build/install/backend /app
CMD ["./bin/backend"]
