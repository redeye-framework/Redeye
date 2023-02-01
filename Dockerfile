# Start by pulling the python image
FROM python:3.10.7

# Copy the requirements file into the image
RUN mkdir -p /redeye

# Switch working directory
WORKDIR /redeye
COPY . /redeye

# Install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# Install sqlite3
RUN apt-get install -y sqlite3

# Expose the port
EXPOSE 8443

# Init the DB
RUN python RedDB/db.py

# Configure the container to run in an executed manner
ENTRYPOINT [ "python" ]

# Run redeye
CMD ["redeye.py", "--safe", "--port", "8443"]
