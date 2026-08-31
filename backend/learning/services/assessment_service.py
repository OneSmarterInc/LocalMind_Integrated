import json
import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

OLLAMA_BASE_URL = getattr(settings, "LOCALMIND_OLLAMA_URL", "http://127.0.0.1:11434")
OLLAMA_URL = f"{OLLAMA_BASE_URL.rstrip('/')}/api/chat"
MODEL = getattr(settings, "LOCALMIND_TUTOR_MODEL", "qwen3:1.7b")

HYBRID_ASSESSMENT_SCHEMA = {
    "type": "object",
    "properties": {
        "mcq_questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "type": {"type": "string"},
                    "question": {"type": "string"},
                    "options": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "key": {"type": "string"},
                                "text": {"type": "string"}
                            },
                            "required": ["key", "text"]
                        },
                        "minItems": 4,
                        "maxItems": 4
                    },
                    "correct_answer": {"type": "string"},
                    "explanation": {"type": "string"},
                    "source_reference": {"type": "string"}
                },
                "required": [
                    "id",
                    "type",
                    "question",
                    "options",
                    "correct_answer",
                    "explanation",
                    "source_reference"
                ]
            },
            "minItems": 6,
            "maxItems": 6
        }
    },
    "required": ["mcq_questions"]
}


def _generate_fallback_questions(source_text, title="", num_mcqs=6, num_subjective=2):
    """
    Fallback dynamic question generator if Ollama service is unavailable.
    Creates grounded MCQs and Subjective questions from the source text.
    """
    import random
    sentences = [s.strip() for s in source_text.replace("\n", " ").split(".") if len(s.strip()) > 20]
    if not sentences:
        sentences = [source_text.strip() or title or "Cybersecurity fundamental concept"]

    questions = []
    
    # Generate MCQs
    for i in range(1, num_mcqs + 1):
        # Select sentence randomly to allow variation on revisit
        sent = random.choice(sentences)
        
        # Randomize the correct answer key
        correct_key = random.choice(["A", "B", "C", "D"])
        
        options_map = {
            "A": f"It states that: {sent[:120]}",
            "B": f"It contradicts the stated principles of {title or 'the section'}",
            "C": f"It applies only to external unverified third-party hardware",
            "D": f"None of the above statements are supported by the text"
        }
        
        # Swap correct option content to the chosen random key
        if correct_key != "A":
            options_map[correct_key], options_map["A"] = options_map["A"], options_map[correct_key]
        
        options = [
            {"key": "A", "text": options_map["A"]},
            {"key": "B", "text": options_map["B"]},
            {"key": "C", "text": options_map["C"]},
            {"key": "D", "text": options_map["D"]}
        ]
        
        questions.append({
            "id": f"q{len(questions) + 1}",
            "type": "mcq",
            "question": f"Based on the text regarding '{title or 'the material'}', which of the following is true regarding: \"{sent[:80]}...\"?",
            "options": options,
            "correct_answer": correct_key,
            "explanation": f"According to the source material: '{sent}'",
            "source_reference": sent
        })

    # Generate Subjective questions
    for i in range(1, num_subjective + 1):
        sent = random.choice(sentences)
        
        questions.append({
            "id": f"q{len(questions) + 1}",
            "type": "subjective",
            "question": f"Explain the core concept or key details from the following statement: \"{sent[:100]}...\"",
            "expected_rubric": f"The response should accurately explain the context or facts described in: \"{sent}\"",
            "source_reference": sent
        })

    return questions


def generate_assessment_questions(source_text, title="", num_mcqs=6, num_subjective=2, previous_questions=None):
    """
    Generate assessment questions (MCQs and Subjective questions) grounded strictly in source_text.
    """
    exclusion_text = ""
    if previous_questions and isinstance(previous_questions, list) and len(previous_questions) > 0:
        prev_list_str = "\n".join(f"- {q}" for q in previous_questions[:20])
        exclusion_text = f"\nEXCLUDE PREVIOUS QUESTIONS:\nDo NOT repeat or rephrase any of these previously asked questions:\n{prev_list_str}\nGenerate fresh questions testing different factual details or angles of the text.\n"

    # Construct rules, prompts, and schema dynamically based on inputs
    rules = [
        "Every question, option, correct answer, expected_rubric, explanation, and source_reference must be strictly based on facts written in the SOURCE TEXT.",
        "Do NOT invent outside knowledge, trivia, or facts not in the text."
    ]
    
    properties = {}
    required = []
    tasks = []

    if num_mcqs > 0:
        rules.append(f"Provide exactly {num_mcqs} Multiple Choice Questions (mcq_questions) with 4 options each ('A', 'B', 'C', 'D'). Set type to 'mcq'.")
        properties["mcq_questions"] = {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "type": {"type": "string"},
                    "question": {"type": "string"},
                    "options": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "key": {"type": "string"},
                                "text": {"type": "string"}
                            },
                            "required": ["key", "text"]
                        },
                        "minItems": 4,
                        "maxItems": 4
                    },
                    "correct_answer": {"type": "string"},
                    "explanation": {"type": "string"},
                    "source_reference": {"type": "string"}
                },
                "required": [
                    "id",
                    "type",
                    "question",
                    "options",
                    "correct_answer",
                    "explanation",
                    "source_reference"
                ]
            },
            "minItems": num_mcqs,
            "maxItems": num_mcqs
        }
        required.append("mcq_questions")
        tasks.append(f"exactly {num_mcqs} Multiple Choice Questions (mcq_questions)")

    if num_subjective > 0:
        rules.append(f"Provide exactly {num_subjective} Subjective Questions (subjective_questions) requiring open-ended, written responses. Set type to 'subjective'. Supply a detailed expected_rubric listing key points or facts the student must mention to receive credit.")
        properties["subjective_questions"] = {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "type": {"type": "string"},
                    "question": {"type": "string"},
                    "expected_rubric": {"type": "string"},
                    "source_reference": {"type": "string"}
                },
                "required": [
                    "id",
                    "type",
                    "question",
                    "expected_rubric",
                    "source_reference"
                ]
            },
            "minItems": num_subjective,
            "maxItems": num_subjective
        }
        required.append("subjective_questions")
        tasks.append(f"exactly {num_subjective} Subjective Questions (subjective_questions)")

    system_prompt = (
        "You are a strict, factual exam generator for students. "
        "Generate assessment questions grounded SOLELY in the provided SOURCE TEXT.\n"
        "CRITICAL RULES:\n" + "\n".join(f"{idx+1}. {rule}" for idx, rule in enumerate(rules))
    )

    task_desc = " and ".join(tasks)
    user_prompt = f"""
TITLE: {title}

SOURCE TEXT:
\"\"\"{source_text}\"\"\"
{exclusion_text}
TASK:
Generate {task_desc} to test comprehension of the SOURCE TEXT above.
"""

    schema = {
        "type": "object",
        "properties": properties,
        "required": required
    }

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "format": schema,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9
                },
                "keep_alive": "30m"
            },
            timeout=90
        )

        response.raise_for_status()
        payload = response.json()
        parsed = json.loads(payload["message"]["content"])

        mcqs = parsed.get("mcq_questions", [])
        subjectives = parsed.get("subjective_questions", [])

        combined_questions = []
        for q in mcqs:
            q["type"] = "mcq"
            combined_questions.append(q)

        for q in subjectives:
            q["type"] = "subjective"
            combined_questions.append(q)

        for idx, q in enumerate(combined_questions, 1):
            q["id"] = f"q{idx}"

        if len(combined_questions) > 0:
            return combined_questions

    except Exception as exc:
        logger.warning("Ollama unavailable or error (%s), using fallback question generator", exc)

    return _generate_fallback_questions(source_text, title=title, num_mcqs=num_mcqs, num_subjective=num_subjective)
