from application.core.BaseService import BaseService
from application.models.Journal import Journal
from application.schemas.JournalSchema import journal_schema, journals_schema, journals_paging_schema


class JournalService(BaseService):
    model = Journal
    schema = journal_schema
    list_schema = journals_schema
    paging_schema = journals_paging_schema


journal_service = JournalService()
