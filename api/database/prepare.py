from google import genai
from google.genai.types import EmbedContentConfig
from pypdf import PdfReader
from db_supabase import DbSupabase
import asyncio
import os
import json

def extract_text_from_pdf(pdf_path):
    reader = PdfReader(pdf_path)
    text_chunks = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            text_chunks.append(text)
    print(f"Extracted {len(text_chunks)} chunks from PDF.")
    return text_chunks

def chunk_text(text, chunk_size=500, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
        
    return chunks


client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
def embed_text(chunks, dim=1536):
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=chunks,
        config=EmbedContentConfig(output_dimensionality=dim)
    )
    return [e.values for e in response.embeddings]

def insert_embedding(content, embedding):
    db = DbSupabase()
    response = db.create("documents", {
        "content": content,
        "embedding": embedding
    })
    return response

async def search_similar(query, top_k=5):
    query_emb = embed_text([query])[0]
    
    db = DbSupabase()
    supabase = db.connect()
    response = await supabase.rpc("match_documents", {
        "query_embedding": query_emb,
        "match_count": top_k
    }).execute()
    return response.data

async def main():
    with open("./docs/curriculum.json", "r", encoding="utf-8") as f:
        curriculum = json.load(f)

    for key, obj in curriculum.items():
        content = json.dumps({"key": key, **obj}, ensure_ascii=False)
        print(f"Processing object: {content[:50]}...")
        embedding = embed_text([content])[0]
        with open("log.txt", "a", encoding="utf-8") as log_file:
            log_file.write(f"{content}\n\n")
        insert_embedding(content, embedding)
        

asyncio.run(main())
