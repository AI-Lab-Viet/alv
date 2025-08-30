from google import genai
from google.genai.types import EmbedContentConfig
from pypdf import PdfReader
from db_supabase import DbSupabase
import asyncio
import os

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
    pdf_text = extract_text_from_pdf("./docs/Giao_Trinh_AI_Lab_Viet-6.pdf")
    for chunk in pdf_text:
        chunked_text = chunk_text(chunk)
        for text in chunked_text:
            print(f"Processing chunk: {text[:50]}...")
            embedding = embed_text([text])[0]
            print(f"Embedded chunk: {embedding}")
            insert_embedding(text, embedding)
        

asyncio.run(main())
