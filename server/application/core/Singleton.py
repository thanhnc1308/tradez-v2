import threading


class Singleton(type):
    __instance__ = {}
    __singleton_lock = threading.Lock()

    def __call__(cls, *args, **kwargs):
        if cls not in cls.__instance__:
            with cls.__singleton_lock:
                if cls not in cls.__instance__:
                    cls.__instance__[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls.__instance__[cls]
