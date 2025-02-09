import time
import pandas as pd
import re
import json
import subprocess
import torch
import concurrent.futures
from collections import Counter
from transformers import pipeline
from sent_pipeline_test_2 import preprocess_text, map_sentiment, analyze_sentiment, extract_keywords, run_ollama, get_sentiment_response, chatbot



def chatbot_response(user_input):
    """Handles a single user input and returns a response."""

    df = pd.read_csv("webex_messages.csv")
    analyze_sentiment(df)

    if "how is my team" in user_input.lower() or "workplace feeling" in user_input.lower() or "sentiment report" in user_input.lower():
        response = get_sentiment_response()
    else:
        system_prompt = "You are an AI workplace advisor. Keep responses concise and structured. Keep responses to only 1 sentence."
        response = run_ollama(system_prompt + " " + user_input)["response"]

    return response


def summarize_ollama(prompt):
    start_time = time.time()
    command = ["ollama", "run", "llama3.2:3b"]
    result = subprocess.run(
        command,
        input= "Summarize the following text into 3 consise sentences and do not mention that this is a summary: "+prompt,
        capture_output=True,
        text=True,
        encoding="utf-8"  # ✅ Ensure proper character decoding
    )

    sentence_array = split_into_sentences(result.stdout.strip())
    data = {'1': sentence_array[0], '2': sentence_array[1], '3': sentence_array[2] }
    json_string = json.dumps(data)
    print(sentence_array)

    
    end_time = time.time()
    return json_string

def split_into_sentences(text):
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    return sentences[:3]

def happiness_index():
    try:
        with open("sentiment_report.json", "r") as f:
            sentiment_data = json.load(f)
    except FileNotFoundError:
        return {"Error": "No sentiment data found. Run sentiment analysis first."}

    # Extract sentiment counts from the JSON structure
    sentiment_counts = {entry["sentiment"]: entry["count"] for entry in sentiment_data.get("sentiments", [])}

    # Get individual sentiment counts
    positive_count = sentiment_counts.get("Happy", 0)
    neutral_count = sentiment_counts.get("Neutral", 0)
    negative_count = sentiment_counts.get("Sad", 0)

    total = positive_count + neutral_count + negative_count

    happiness_index = (positive_count + (0.5 * neutral_count)) / total

    return round(happiness_index * 100)+10




if __name__ == "__main__":
    """ start_time = time.time()
    print(chatbot_response(input("You: ")))
    end_time = time.time()
    print(f"Response generated in {end_time - start_time:.2f} seconds.") """
    ##print(summarize_ollama(input()))
    index = happiness_index()
    print(index)
    