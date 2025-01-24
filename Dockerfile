# Use the official MySQL image
FROM mysql:latest

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=mydb

# Expose port 3306 for MySQL
EXPOSE 3306