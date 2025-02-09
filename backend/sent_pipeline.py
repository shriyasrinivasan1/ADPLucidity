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
        system_prompt = "You are an AI workplace advisor. Keep responses concise and structured."
        response = run_ollama(system_prompt + " " + user_input)["response"]

    return response



if __name__ == "__main__":
    start_time = time.time()
    print(chatbot_response(input("You: ")))
    end_time = time.time()
    print(f"Response generated in {end_time - start_time:.2f} seconds.")