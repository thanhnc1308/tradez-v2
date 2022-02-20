FROM python:3.8.3-slim-buster
WORKDIR /opt/code

# upgrade pip first so that we can install psycopg2 production.txt
# RUN python3 -m pip install --upgrade pip
# psycopg2 must be installed here. It doesn't work in requirements.txt
RUN apt-get update && apt-get -y install libpq-dev gcc && pip install psycopg2
COPY ./requirements/production.txt requirements.txt

RUN pip3 install -r requirements.txt
EXPOSE 5000
COPY . .
CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5001"]
