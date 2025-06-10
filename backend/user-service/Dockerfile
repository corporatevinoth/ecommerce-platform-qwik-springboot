# Stage 1: Build the Java application using Maven
FROM maven:3-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven project files (pom.xml and source code)
COPY pom.xml .
COPY src ./src

# Build the JAR file
# Use -DskipTests to skip tests during the Docker build; tests should be run separately in CI
RUN mvn clean package -DskipTests

# Stage 2: Create the final Docker image with just the JAR and JRE
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port your Spring Boot application runs on (e.g., 8082 for user-service)
# Adjust this based on your application.properties for user-service
EXPOSE 8083 

# Command to run the Spring Boot application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]