# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file from your Maven target directory to /app in the container
# After a Maven build, the JAR will be in backend/order-service/target/
COPY target/order-service-0.0.1-SNAPSHOT.jar app.jar

# Expose the port on which the Spring Boot application runs (8082 as per application.properties)
EXPOSE 8082

# Define the command to run the JAR file when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]