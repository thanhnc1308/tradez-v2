from marshmallow import fields, post_load, validates, ValidationError
from application.core.BaseSchema import BaseSchema, BaseListSchema
from application.models.User import User


class UserPublicSchema(BaseSchema):
    username = fields.Str(required=True)

    @post_load()
    def user_details_strip(self, data):
        data['email'] = data['email'].lower().strip()

    @validates('username')
    def validate_username(self, username, **kwargs):
        if bool(User.query.filter_by(username=username).first()):
            raise ValidationError(
                '"{username}" username already exists, '
                'please use a different username.'.format(username=username)
            )


class UserSchema(UserPublicSchema):
    password = fields.Str(required=True)
    email = fields.Email(required=True)


class UserListSchema(BaseListSchema):
    items = fields.List(fields.Nested(UserSchema()))


user_public_schema = UserPublicSchema()
user_schema = UserSchema()
users_schema = UserSchema(many=True)
users_paging_schema = UserListSchema()
