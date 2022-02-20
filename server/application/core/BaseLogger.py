# from loguru import logger
import logging
import inspect
from application.core.Singleton import Singleton
MAX_COUNT_LOG = 1000


class BaseLogger(metaclass=Singleton):
    exception_count = 0

    def __init__(self):
        logging.basicConfig(format="%(asctime)s - %(levelname)s - %(message)s")

    def process_log(self, log_level, msg):
        # TODO: create a new thread to not affect the current request
        try:
            prefix = self.get_prefix()
            logging.log(log_level, f"{prefix} | {msg}")
        except Exception as e:
            # limit the log time
            if self.exception_count < MAX_COUNT_LOG:
                self.exception(str(e))
            self.exception_count += 1

    def debug(self, msg, data={}):
        self.process_log(logging.DEBUG, msg)

    def info(self, msg, data={}):
        self.process_log(logging.INFO, msg)

    def warning(self, msg, data={}):
        self.process_log(logging.WARNING, msg)

    def error(self, msg, data={}):
        self.process_log(logging.ERROR, msg)

    def exception(self, msg, data={}):
        self.process_log(logging.CRITICAL, msg)

    def get_prefix(self):
        last_stack_call = inspect.stack()[2]
        func = last_stack_call.function
        filename = last_stack_call.filename
        lineno = last_stack_call.lineno
        return f"{filename} | {func}:{lineno}"


base_logger = BaseLogger()
