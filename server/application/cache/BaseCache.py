"""
Class handles all the operation with cache
"""
import re
import uuid
import json
import threading
import os
from enum import IntEnum
from application.cache.CacheType import CacheType
from application.core.extensions import mem_cache, redis_cache


class CacheLevel(IntEnum):
    MemCache = 1
    RedisCache = 2
    All = 3

    def __str__(self):
        return '%s' % self.value


class BaseCache:
    # state shared by each instance
    __instance__ = None
    __singleton_lock = threading.Lock()
    _CACHE_CONFIG = dict()
    _SERVICE_CACHE = dict()

    # constructor method
    def __init__(self):
        if BaseCache.__instance__ is None:
            self.init_cache_config()
            BaseCache.__instance__ = self
        else:
            raise Exception("You cannot create another BaseCache instance")

    @classmethod
    def instance(cls):
        if not cls.__instance__:
            with cls.__singleton_lock:
                if not cls.__instance__:
                    cls()
        return cls.__instance__

    def init_cache_config(self):
        try:
            dir_path = os.path.dirname(os.path.realpath(__file__))
            path = os.path.join(dir_path, "Cache.json")
            with open(path) as f:
                cache = json.load(f)
                cache_config = cache.get("CacheConfig")
                if cache_config:
                    self._CACHE_CONFIG = cache_config.get("CacheItems")
                    self._SERVICE_CACHE = cache_config.get("RedisServers")
        except IOError as e:
            print(str(e))

    def get_cache_item(self, cache_type: CacheType):
        key = str(cache_type.name)
        if self._CACHE_CONFIG is not None and key in self._CACHE_CONFIG:
            return self._CACHE_CONFIG.get(key)
        return None

    def get(self, cache_type: CacheType, param: dict):
        ret = None
        cache_config = self.get_cache_item(cache_type)
        if cache_config:
            key = self.generate_key(cache_config, param)
            cache_level = cache_config.get("CacheLevel")
            if cache_level == CacheLevel.MemCache:
                ret = mem_cache.get(key)
            elif cache_level == CacheLevel.RedisCache:
                ret = redis_cache.get(key)
            elif cache_level == CacheLevel.All:
                ret = mem_cache.get(key)
                if not ret:
                    ret = redis_cache.get(key)
        return ret

    def set(self, cache_type: CacheType, param: dict, value):
        cache_config = self.get_cache_item(cache_type)
        if cache_config:
            key = self.generate_key(cache_config, param)
            cache_level = cache_config.get("CacheLevel")
            if cache_level == CacheLevel.MemCache:
                timeout = cache_config.get("ExpireTimeoutMem")
                if not timeout:
                    timeout = cache_config.get("ExpireTimeout")
                mem_cache.set(key, value, timeout)
            elif cache_level == CacheLevel.RedisCache:
                timeout = cache_config.get("ExpireTimeout")
                redis_cache.set(key, value, timeout)
            elif cache_level == CacheLevel.All:
                timeout = cache_config.get("ExpireTimeout")
                timeout_mem = cache_config.get("ExpireTimeoutMem")
                if not timeout_mem:
                    timeout_mem = cache_config.get("ExpireTimeout")
                mem_cache.set(key, value, timeout_mem)
                redis_cache.set(key, value, timeout)

    def delete(self, cache_type: CacheType, param: dict):
        cache_config = self.get_cache_item(cache_type)
        if cache_config:
            key = self.generate_key(cache_config, param)
            cache_level = cache_config.get("CacheLevel")
            if cache_level == CacheLevel.MemCache:
                mem_cache.delete(key)
            elif cache_level == CacheLevel.RedisCache:
                redis_cache.delete(key)
            elif cache_level == CacheLevel.All:
                mem_cache.delete(key)
                redis_cache.delete(key)

    def get_cache_key(self, cache_type: CacheType, param: dict) -> str:
        ret = ""
        key = str(cache_type.name)
        cache_config = self._CACHE_CONFIG.get(key)
        if cache_config is not None:
            ret = self.generate_key(cache_config, param)
        return ret

    def generate_key(self, config: dict, param: dict) -> str:
        key = ""
        if config is not None:
            key = key_format = config.get("KeyFormat")
            if key_format and not key_format.isspace():
                matches = re.findall(pattern=r"{(.*?)}", string=key_format)
                for match in matches:
                    value = self.get_value_by_format(match, param)
                    pattern = f"{{{match}}}"
                    key = key.replace(pattern, value)
            else:
                raise Exception("Missing key format")
        return key

    def get_value_by_format(self, key_format: str, param: dict) -> str:
        ret = ""
        key_format = key_format.lower()
        if key_format == "guid":
            ret = str(uuid.uuid4())
        elif key_format == "uid":
            if "user_id" in param:
                ret = param.get("user_id")
            else:
                raise Exception("user_id is not in param")
        elif key_format == "v_other":
            if "other_value" in param:
                ret = param.get("other_value")
            else:
                raise Exception("other_value is not in param")
        return ret
