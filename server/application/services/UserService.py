from application.core.BaseService import BaseService
from application.models.User import User
from application.schemas.UserSchema import user_schema, users_schema, users_paging_schema


class UserService(BaseService):
    model = User
    schema = user_schema
    list_schema = users_schema
    paging_schema = users_paging_schema


user_service = UserService()
