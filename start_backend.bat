@echo off
echo Starting College Event Management System Backend...

cd springapp

echo Cleaning and building the project...
call mvnw clean compile

echo Starting the Spring Boot application...
call mvnw spring-boot:run

pause