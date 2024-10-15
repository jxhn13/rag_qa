import os
from flask import request, jsonify
import cohere
import pinecone
from pinecone import ServerlessSpec

cohere_api_key = 'BeBlNsOsARJ46Ms3lAUFfqVMh0SiNHBWyP1Rwwk9'
pinecone_api_key = '20596298-e469-4c57-9dc8-3b82391a2446'

pc = pinecone.Pinecone(api_key=pinecone_api_key)

index_name = 'myindex'
serverless_spec = ServerlessSpec(
    cloud='aws',
    region='us-east-1'
)

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name, 
        dimension=4096,  
        metric='euclidean',
        spec=serverless_spec
    )

pinecone_index = pc.Index(index_name)


co = cohere.Client(cohere_api_key)

def process_chat():
    try:
        file_dir = '/home/john/resume_qa/files'
        input_files = []

        for filename in os.listdir(file_dir):
            file_path = os.path.join(file_dir, filename)
            input_files.append(file_path)

        embeddings = []
        for file_path in input_files:
            with open(file_path, 'r') as file:
                text = file.read()

            embedding = co.embed(texts=[text], model='embed-english-v2.0').embeddings[0]
            embeddings.append((os.path.basename(file_path), embedding))

        
        pinecone_index.upsert(vectors=[(filename, embedding) for filename, embedding in embeddings])

        data = request.get_json()
        requirements = data.get('requirements')

        if not requirements:
            return jsonify({'output': 'No requirements provided'}), 400

        query_embedding = co.embed(texts=[requirements], model='embed-english-v2.0').embeddings[0]

        query_results = pinecone_index.query(vector=query_embedding, top_k=5, include_metadata=True)

        documents_content = " ".join([result['metadata']['text'] for result in query_results['matches']])

        cohere_response = co.generate(
            model='command-xlarge-nightly', 
            prompt=f"Based on the following documents: {documents_content}. Generate a summary that matches these requirements: {requirements}.", 
            max_tokens=500
        )

        generated_answer = cohere_response.generations[0].text.strip()

        return jsonify({'output': generated_answer})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
