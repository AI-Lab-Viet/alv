import dotenv
import os
from supabase import create_client, Client
from typing import Type, Generic
from pydantic import BaseModel

dotenv.load_dotenv()

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

    def create(self, table: str, data: list[BaseModel]) -> dict:
        if not self.supabase:
            self.connect()
        result = self.supabase.table(table).insert(
            [item.model_dump(exclude_none=True) for item in data]
        ).execute()
        return result.data

    def find_all(self, table: str, model: Type[BaseModel]) -> list[BaseModel]:
        if not self.supabase:
            self.connect()
        result = self.supabase.table(table).select("*").execute()
        return [model(**item) for item in result.data]

    def find_by(self, table: str, model: Type[BaseModel], filters: dict = None, limit: int = 100, select_fields: list[str] = None) -> list[BaseModel]:
        if not self.supabase:
            self.connect()
        query = self.supabase.table(table)
        if select_fields:
            query = query.select(", ".join(select_fields))
        else:
            query = query.select("*")
        if filters:
            for key, value in filters.items():
                if key == "search" and isinstance(value, dict):
                    for field, search_value in value.items():
                        query = query.ilike(field, f"%{search_value}%")
                elif key == "from_time" and value:
                    query = query.gte("created_at", value)
                else:
                    query = query.eq(key, value)
        result = query.limit(limit).execute()
        return [model(**item) for item in result.data] if result.data else []

    def update(self, table: str, id: str, data: BaseModel, model: Type[BaseModel]) -> BaseModel | None:
        if not self.supabase:
            self.connect()
        result = self.supabase.table(table).update(data.dict()).eq("id", id).execute()
        if result.data:
            return model(**result.data[0])
        return None

    def upsert(self, table: str, data: BaseModel, model: Type[BaseModel]) -> BaseModel | None:
        if not self.supabase:
            self.connect()
        result = self.supabase.table(table).upsert(data.dict()).execute()
        if result.data:
            return model(**result.data[0])
        return None
    
    def delete(self, table: str, id: str):
        if not self.supabase:
            self.connect()
        self.supabase.table(table).delete().eq("id", id).execute()