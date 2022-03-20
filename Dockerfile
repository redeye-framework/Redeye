# start by pulling the python image
FROM python:latest

# copy the requirements file into the image
RUN mkdir -p /redeye

# switch working directory
WORKDIR /redeye
COPY . /redeye

# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# Expose the port
EXPOSE 5000

# configure the container to run in an executed manner
ENTRYPOINT [ "python" ]

CMD ["redeye.py" ]
