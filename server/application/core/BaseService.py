from flask import request, url_for
from sqlalchemy import desc
from http import HTTPStatus
from application.core.ServiceResponse import ServiceResponse


class BaseService:
    model = None
    schema = None
    list_schema = None
    paging_schema = None

    def get_by_id(self, id=None):
        res = ServiceResponse()
        try:
            data = self.model.get_by_id(id)
            if not data:
                res.on_error(code=HTTPStatus.NOT_FOUND, user_message="Not found")
            else:
                res.on_success(data=self.schema.dump(data))
        except Exception as e:
            res.on_exception(e)
        return res

    def put(self, id, parameters):
        res = ServiceResponse()
        try:
            data = self.model.query.filter_by(id=id).first()
            if not data:
                res.on_error(code=HTTPStatus.NOT_FOUND, user_message="Not found")
            else:
                errors = self.schema.validate(parameters)
                if errors:
                    res.on_error(user_message=str(errors))
                else:
                    data.update(**parameters)
                    res.on_success(data=self.schema.dump(data))
        except Exception as e:
            res.on_exception(e)
        return res

    def delete(self, id):
        res = ServiceResponse()
        try:
            data = self.model.query.filter_by(id=id).first()
            if not data:
                res.on_error(code=HTTPStatus.NOT_FOUND, user_message="Not found")
            else:
                data.delete()
                res.on_success(data=self.schema.dump(data))
        except Exception as e:
            res.on_exception(e)
        return res

    def get_all(self, order_by='updated_at'):
        res = ServiceResponse()
        try:
            data = self.model.get_all(order_by=order_by)
            res.on_success(data=self.list_schema.dump(data))
        except Exception as e:
            res.on_exception(e)
        return res

    def get_paging(self, page=1, per_page=20, order_by='updated_at'):
        res = ServiceResponse()
        try:
            p = self.model.query.order_by(desc(order_by)).paginate(page, per_page)
            meta = {
                'page': page,
                'per_page': per_page,
                'total': p.total,
                'pages': p.pages,
            }
            links = {}
            if p.has_next:
                links['next'] = url_for(request.endpoint, page=p.next_num,
                                        per_page=per_page)
            if p.has_prev:
                links['prev'] = url_for(request.endpoint, page=p.prev_num,
                                        per_page=per_page)
            links['first'] = url_for(request.endpoint, page=1,
                                     per_page=per_page)
            links['last'] = url_for(request.endpoint, page=p.pages,
                                    per_page=per_page)
            meta['links'] = links
            result = {
                'items': p.items,
                'meta': meta
            }
            res.on_success(data=self.paging_schema.dump(result))
        except Exception as e:
            res.on_exception(e)
        return res

    def post(self, parameters):
        res = ServiceResponse()
        try:
            errors = self.schema.validate(parameters)
            if errors:
                res.on_error(user_message=str(errors))
            else:
                new_item = self.model.create(**parameters)
                res.on_success(data=self.schema.dump(new_item))
        except Exception as e:
            res.on_exception(e)
        return res
