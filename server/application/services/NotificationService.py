from application.core.BaseService import BaseService
from application.models.Notification import Notification
from application.schemas.NotificationSchema import notification_schema, notifications_schema, notifications_paging_schema


class NotificationService(BaseService):
    model = Notification
    schema = notification_schema
    list_schema = notifications_schema
    paging_schema = notifications_paging_schema


notification_service = NotificationService()
