FROM gradle AS build
WORKDIR /app
COPY . .
RUN gradle installDist

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/install/backend /app
CMD ["./bin/backend"]
