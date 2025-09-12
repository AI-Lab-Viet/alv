import json, os, redis
from typing import Any, Dict, List, Optional, Union

class RedisComponent:
    _instance: Optional["RedisComponent"] = None

    def __init__(self):
        host = os.getenv("REDIS_HOST", "localhost")
        port = int(os.getenv("REDIS_PORT", "6379"))
        db = int(os.getenv("REDIS_DB", "0"))

        self.client = redis.Redis(
            host=host,
            port=port,
            db=db,
            decode_responses=True
        )

    @classmethod
    def get_instance(cls) -> "RedisComponent":
        if cls._instance is None:
            cls._instance = RedisComponent()
        return cls._instance

    # ---- Expose raw client (nếu cần) ----
    def get_client(self) -> redis.Redis:
        return self.client

    # --------- BASIC KV ---------
    def set(self, key: str, value: Union[str, int, float], expire: int = 60) -> None:
        if expire > 0:
            self.client.setex(key, expire, value)
        else:
            self.client.set(key, value)

    def get(self, key: str) -> Optional[str]:
        return self.client.get(key)

    def delete(self, key: str) -> int:
        return self.client.delete(key)

    def keys(self, pattern: str = "*") -> List[str]:
        return self.client.keys(pattern)

    # --------- JSON ---------
    def set_json(self, key: str, data: Any, expire: int = 60) -> None:
        value = json.dumps(data, ensure_ascii=False)
        self.set(key, value, expire)

    def get_json(self, key: str) -> Optional[Any]:
        raw = self.get(key)
        if raw:
            try:
                return json.loads(raw)
            except json.JSONDecodeError:
                return None
        return None

    # --------- HASH ---------
    def hset(self, name: str, field: str, value: Union[str, int, float]) -> None:
        self.client.hset(name, field, value)

    def hget(self, name: str, field: str) -> Optional[str]:
        return self.client.hget(name, field)

    def hgetall(self, name: str) -> Dict[str, str]:
        return self.client.hgetall(name)

    def hdel(self, name: str, field: str) -> int:
        return self.client.hdel(name, field)

    # --------- LIST ---------
    def lpush(self, key: str, value: Union[str, int, float]) -> int:
        return self.client.lpush(key, value)

    def rpush(self, key: str, value: Union[str, int, float]) -> int:
        return self.client.rpush(key, value)

    def lpop(self, key: str) -> Optional[str]:
        return self.client.lpop(key)

    def rpop(self, key: str) -> Optional[str]:
        return self.client.rpop(key)

    # --------- SET ---------
    def sadd(self, key: str, *values: Union[str, int, float]) -> int:
        return self.client.sadd(key, *values)

    def smembers(self, key: str) -> List[str]:
        return list(self.client.smembers(key))

    def sismember(self, key: str, value: Union[str, int, float]) -> bool:
        return self.client.sismember(key, value)

