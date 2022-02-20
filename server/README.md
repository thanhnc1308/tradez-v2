# Run the app
1. Give permission to manage.py
- chmod 775 manage.py
2. Create venv and install packages
- sudo apt-get install python3-venv
- sudo apt-get install python3-tk
- python3 -m venv .venv
- source .venv/bin/activate
- pip3 install -r requirements/development.txt
- python3 -m pip install <package>
- pip3 freeze > requirements.txt
2. Init database
- ./manage.py flask db init
- ./manage.py flask db stamp head
- ./manage.py flask db migrate
- ./manage.py flask db upgrade
3. Update database
- ./manage.py flask db stamp head
- ./manage.py flask db migrate
- ./manage.py flask db upgrade
4. Run flask with config
- Run by flask command line: 
  - FLASK_ENV="development" FLASK_DEBUG="1" flask run
  - FLASK_ENV="production" FLASK_DEBUG="1" flask run
    - FLASK_DEBUG helps you for hot reloading. When you change your code and save. The flask server will restart with new modified code.
- Run with PyCharm
  - Script path: <PROJECT_DIR>/venv/bin/flask
  - Parameters: run
  - Environment variables: PYTHONUNBUFFERED=1;FLASK_APP=wsgi.py;FLASK_ENV=development;FLASK_DEBUG=1;SQLALCHEMY_DATABASE_URI=postgresql+psycopg2://admin:12345678@Abc@localhost:5432/tradez;POSTGRES_DB=tradez;POSTGRES_USER=admin;POSTGRES_HOSTNAME=localhost;POSTGRES_PORT=5432;POSTGRES_PASSWORD=12345678;SECRET_KEY=SECRET_KEY;CACHE_REDIS_HOST=0.0.0.0;CACHE_REDIS_PORT=6379;CACHE_REDIS_PASSWORD=123456;CACHE_REDIS_DB=0
- Run with manage.py: 
  - ./manage.py flask run
5. Run the images
- docker-compose --env-file docker/.env.dev up
- docker-compose --env-file docker/.env.dev up tradez_db tradez_redis redis-commander
6. Run command in container 
- docker exec -it {CONTAINER_ID} sh
7. Database
- Restore data: psql postgresql://admin:12345678@localhost:5432/tradez < StockData.sql
- Backup data: pg_dump postgresql://admin:12345678@localhost:5432/tradez > StockData.sql
