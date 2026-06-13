# syntax=docker/dockerfile:1.7

# Build stage
FROM maven:3.9-eclipse-temurin-11 AS build
WORKDIR /app

# Use Aliyun Maven Mirror
RUN mkdir -p /root/.m2 && echo '<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd"><mirrors><mirror><id>aliyunmaven</id><mirrorOf>*</mirrorOf><name>aliyun maven</name><url>https://maven.aliyun.com/repository/public</url></mirror></mirrors></settings>' > /root/.m2/settings.xml

COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn -B -ntp dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -ntp package -DskipTests

# Run stage
FROM tomcat:9.0-jdk11-openjdk-slim
# Remove default apps
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /app/target/todo-app.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080
CMD ["catalina.sh", "run"]
