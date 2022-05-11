# start by pulling the python image
FROM python:latest

# copy the requirements file into the image
RUN mkdir -p /redeye

# switch working directory
WORKDIR /redeye
COPY . /redeye

# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# install sqlite3
RUN apt-get update && apt-get install -y sqlite3

# Expose the port
EXPOSE 5000

# Init the DB
RUN python RedDB/db.py

# Configure the container to run in an executed manner
ENTRYPOINT [ "python" ]

# Run redeye
CMD ["redeye.py", "--safe", "--docker"]