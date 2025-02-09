import time
import pandas as pd
import re
import json
import subprocess
import torch
import concurrent.futures
from collections import Counter
from transformers import pipeline

# Enable GPU if available
device = 0 if torch.cuda.is_available() else -1
print(f"Using {'GPU' if device == 0 else 'CPU'} for sentiment analysis.")

# Set up sentiment analysis pipeline with CUDA acceleration
sentiment_pipeline = pipeline("text-classification", model="cardiffnlp/twitter-roberta-base-sentiment-latest", device=device)

# Manually created test dataset
data = {
    "emails": [
        "I'm really happy with the new changes at work! The games we play are quite fun. I enjoyed the catch game especially.",
        "The meeting was very frustrating, nothing was resolved.",
        "It was an average day, nothing special happened.",
        "Our team achieved our quarterly goals thanks to the games we played!",
        "The constant games are making everyone upset. I didn't like the volleyball.",
        "The new policy is okay, I have no strong opinions on it.",
        "I'm very pleased with the progress on our project due to the games played.",
        "The budget cuts are really disappointing because of the games.",
        "The games like football and catch were informative but not exciting.",
        "I'm excited for the upcoming team games playing retreat in the!",
        "I really enjoyed the games like football! Had a great time.",
        "I love the games! I was so happy at the workplace.",
        "Volleyball made me quite happy. even to do work afterwords was fine."
    ]
}

# Convert to DataFrame
df = pd.DataFrame(data)

# Preprocess function
def preprocess_text(text):
    """Cleans and preprocesses text for sentiment analysis."""
    text = text.lower()
    text = re.sub(r"http\S+", "", text)  # Remove URLs
    text = re.sub(r"[^a-zA-Z\s]", "", text)  # Remove punctuation
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    return text

def map_sentiment(label):
    """Map model output to Sad, Happy, or Neutral."""
    mapping = {
        "positive": "Happy",
        "negative": "Sad",
        "neutral": "Neutral"
    }
    return mapping.get(label.lower(), "Neutral")

def extract_keywords(texts, top_n=5):
    """Extracts the most common words in employee emails."""
    words = " ".join(texts).split()
    common_words = Counter(words).most_common(top_n)
    return [word[0] for word in common_words if len(word[0]) > 3]  # Remove short words

def analyze_sentiment(df, column="Message Content"):
    """Analyze sentiment and extract key topics in parallel, then save the report."""
    start_time = time.time()
    
    df[column] = df[column].apply(preprocess_text)
    
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_sentiments = executor.submit(lambda: df[column].apply(lambda x: sentiment_pipeline(x)[0]["label"]))
        future_keywords = executor.submit(lambda: extract_keywords(df[column]))
        
        df["sentiment"] = future_sentiments.result()
        df["sentiment"] = df["sentiment"].apply(map_sentiment)
        keywords = future_keywords.result()
    
    report = df["sentiment"].value_counts().reset_index()
    report.columns = ["sentiment", "count"]
    report_data = {"sentiments": report.to_dict(orient="records"), "keywords": keywords}
    
    with open("sentiment_report.json", "w") as f:
        json.dump(report_data, f, indent=4)

    end_time = time.time()
    
    return report_data

def run_ollama(prompt):
    """Runs Mistral on Ollama locally with UTF-8 encoding fix."""
    start_time = time.time()
    command = ["ollama", "run", "llama3.2:3b"]
    
    result = subprocess.run(
        command,
        input=prompt,
        capture_output=True,
        text=True,
        encoding="utf-8"  # ✅ Ensure proper character decoding
    )
    
    end_time = time.time()
    return {"response": result.stdout.strip(), "time": f"{end_time - start_time:.2f} seconds"}


def get_sentiment_response():
    """Load sentiment data and provide AI-driven insights."""
    try:
        with open("sentiment_report.json", "r") as f:
            sentiment_data = json.load(f)
    except FileNotFoundError:
        return "I couldn't find recent sentiment data. Try running the sentiment analysis."

    sorted_sentiments = sorted(sentiment_data["sentiments"], key=lambda x: x["count"], reverse=True)
    dominant_emotion = sorted_sentiments[0]["sentiment"]
    topics = ", ".join(sentiment_data["keywords"])

    insight_prompt = f"""
    You are an AI workplace advisor to the Employer. Keep responses concise and informative, structured as advice.
    Employees are expressing {dominant_emotion}. Common discussion topics include: {topics}.
    Use common discussion topics to help deduce reasons for the sentiment.
    Summarize the key reasons for this sentiment and provide two actionable suggestions.
    """
    
    return run_ollama(insight_prompt)["response"]

def chatbot():
    """Interactive chatbot that can provide general AI responses and sentiment insights."""
    print("Employer AI Chatbot (type 'exit' to stop)")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break

        start_time = time.time()

        if "how is my team" in user_input.lower() or "workplace feeling" in user_input.lower() or "sentiment report" in user_input.lower():
            response = get_sentiment_response()
        else:
            system_prompt = "You are an AI workplace advisor. Keep responses to one paragraph, summarizing insights concisely."
            response = run_ollama(system_prompt + " " + user_input)["response"]

        end_time = time.time()
        print(f"Total execution time: {end_time - start_time:.2f} seconds.")
        print("Bot:", response)


def main():
    start_time = time.time()
    print("Running optimized sentiment analysis...")
    analyze_sentiment(df)
    chatbot()
    end_time = time.time()
    print(f"Total execution time: {end_time - start_time:.2f} seconds.")

if __name__ == "__main__":
    main()
