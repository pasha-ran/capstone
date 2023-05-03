# Use slim buster image
FROM python:3.10.2-slim-buster

# Make a working directory
RUN mkdir /app
WORKDIR /app

# First, copy the requirements.txt and install the packages necessary
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# Now copy the source code
COPY . /app

# Export some environment variables
ENV FLASK_APP wsgi.py
ENV FLASK_ENV development

# Expose port 5000
EXPOSE 5000

# Now run the app
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]