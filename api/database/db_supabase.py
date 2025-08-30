import dotenv
import os
from supabase import create_client, Client
from typing import TypeVar, Generic
from pydantic import BaseModel

dotenv.load_dotenv()
T = TypeVar('T', bound=BaseModel)

class DbSupabase:
    def __init__(self):
        self.supabase_url = os.environ.get('SUPABASE_URL')
        self.supabase_key = os.environ.get('SUPABASE_KEY')
        self.supabase: Client = None

    def connect(self) -> Client: 
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        return self.supabase

    def close(self):
        self.supabase = None

    def create(self, table: str, data: T) -> T:
        if not self.supabase:
            self.connect()
        result = self.supabase.table(table).insert(data).execute()
        print("result", result)
        return result.data

    def find_all(self, table: str) -> list[T]:
        if not self.supabase:
            self.connect()
        result = self.supabase.table(table).select("*").execute()
        return [T(**item) for item in result.data]

    def find_by_id(self, table: str, id: str) -> T | None:
        if not self.supabase:
            self.connect()
        result = self.supabase.table(table).select("*").eq("id", id).execute()
        if result.data:
            return T(**result.data[0])
        return None

    def update(self, table: str, id: str, data: T) -> T | None:
        if not self.supabase:
            self.connect()
        result = self.supabase.table(table).update(data).eq("id", id).execute()
        if result.data:
            return T(**result.data[0])
        return None

    def upsert(self, table: str, data: T) -> T | None:
        if not self.supabase:
            self.connect()
        result = self.supabase.table(table).upsert(data).execute()
        if result.data:
            return T(**result.data[0])
        return None

    def delete(self, table: str, id: str):
        if not self.supabase:
            self.connect()
        self.supabase.table(table).delete().eq("id", id).execute()