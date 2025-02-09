import time
import json
import subprocess
import pandas as pd
import torch
from sent_pipeline_test_2 import preprocess_text

## hard code an input hello, then run no arguement version. Then on secon dinput use input for arugment


def run_ollama(prompt, model="mistral"):
    
    start_time = time.time()
    command = ["ollama", "run", model]

    result = subprocess.run(
        command,
        input=prompt,
        capture_output=True,
        text=True,
        encoding="utf-8"
    )

    end_time = time.time()
    return {"response": result.stdout.strip(), "time": f"{end_time - start_time:.2f} seconds"}


def employee_chatbot(user_input=None):
    """
    AI chatbot for employees that:
    - **First suggests discussion topics** based on employee messages (if no input is given).
    - **Then responds concisely** if the user asks a question.
    """
    
    df = pd.read_csv("webex_messages.csv")  # Ensure correct path
    df["Message Content"] = df["Message Content"].apply(preprocess_text)
    combined_text = " ".join(df["Message Content"])

    # If no user input, first suggest discussion topics
    if not user_input:
        topic_extraction_prompt = f"""
        Summarize the main discussions employees have been having in one to two sentences. 
        List two key topics briefly in one to two sentences, using natural language. No need to mention that this is a summary, just state the topics:
        {combined_text}
        """
        topic_summary = run_ollama(topic_extraction_prompt, model="llama3.2:3b")["response"]

        if not topic_summary.strip():
            return "What workplace topics would you like to discuss today?"
        
        return f"Hey! Employees have been talking about: {topic_summary}. Want to discuss one of these or something else?"

    # If user input exists, generate a response using Mistral
    system_prompt = "You are a workplace AI assistant for employees at ADP. Be very brief, structured, and engaging. One to two sentences of context on the workplace. Make responses under 30 words. -->"
    response = run_ollama(system_prompt + " " + user_input, model="llama3.2:3b")["response"]

    return response


# Example usage:
if __name__ == "__main__":
    # Step 1: AI suggests discussion topics first

    start_time = time.time()
    print(employee_chatbot())  # Will output suggested discussion topics

    # Step 2: Employee inputs a question or response
    
    end_time = time.time()
    print(f"Response generated in {end_time - start_time:.2f} seconds.")

    user_input = input("Employee: ")
    print("Bot:", employee_chatbot(user_input))
