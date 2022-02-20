from flask import Blueprint, request, current_app
import jwt
import json
import datetime
from application.core.ServiceResponse import ServiceResponse
from application.models.User import User
from application.schemas.UserSchema import user_schema, user_public_schema

auth_controller = Blueprint('auth_controller', __name__, url_prefix='/api/auth')


@auth_controller.route('/register', methods=['POST'])
def register():
    res = ServiceResponse()
    try:
        auth = json.loads(request.data)
        email = auth.get('email')
        username = auth.get('username')
        password = auth.get('password')
        if not auth or username is None or password is None:
            res.on_error(code=99, user_message='Please enter username and password')
            return res.build()
        user = None
        # check if email exists
        user = User.get_by_email(email)
        if user is not None:
            res.on_error(code=99, user_message='Email existed')
            return res.build()

        # check if user exists
        user = User.get_by_username(username)
        if user is not None:
            res.on_error(code=99, user_message='Username existed')
            return res.build()

        new_user = User.create(**auth)
        if new_user:
            res.on_success(data=user_public_schema.dump(new_user))
        else:
            res.on_error(code=99, user_message='Error when create new user')
    except Exception as ex:
        res.on_exception(ex)
    return res.build()


@auth_controller.route('/login', methods=['POST'])
def login():
    res = ServiceResponse()
    try:
        auth = json.loads(request.data)
        username = auth.get('username')
        password = auth.get('password')
        if not auth or username is None or password is None:
            res.on_error(code=99, user_message='Please enter username and password')
            return res.build()

        # check if user exists
        user = User.get_by_username(username)
        if not user:
            res.on_error(code=99, user_message='Password or password is not correct')
            return res.build()

        # check password here
        if user.check_password(password):
            token = jwt.encode({
                'user': username,  # it's better to return a public_id field here
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60*24*7)
            }, current_app.config['SECRET_KEY'], algorithm="HS256")
            if hasattr(token, 'decode'):
                res.on_success(data=token.decode('UTF-8'))
            else:
                res.on_success(data=token)
        else:
            res.on_error(code=99, user_message='Password or password is not correct')
    except Exception as ex:
        res.on_exception(ex)
    return res.build()


@auth_controller.route('/user_info', methods=['POST'])
def user_info():
    res = ServiceResponse()
    try:
        auth = json.loads(request.data)
        token = auth.get('token')
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        username = data.get('user')
        current_user = User.get_by_username(username)
        res.on_success(data=user_public_schema.dump(current_user))
    except Exception as ex:
        res.on_exception(ex)
    return res.build()
