//potential rework to our current account functionality for finished product


import re

def is_valid_password(password: str) -> bool:
    rules = [
        (len(password) >= 8, "at least 8 characters"),
        (re.search(r"\d", password), "a number"),
        (re.search(r"[A-Z]", password), "an uppercase letter"),
        (re.search(r"[!@#$%^&*(),.?\":{}|<>]", password), "a special character")
    ]

    for valid, 
requirement in rules:
        if not valid:
            print(f"Password must contain {password}.")
            return False
    return True


def register_user(email: str, password: str, name: str) -> bool:
    if not is_valid_password(password):
        return False

    try:
        response = supabase.auth.sign_up(email=email, password=password)
        if getattr(response, "user", None):
            print("User registered successfully.")
            return True
        print("Registration failed.")
        return False
    except Exception as e:
        print(f"Registration error: {e}")
        return False


def login_user(email: str, password: str) -> bool:
    try:
        response = supabase.auth.sign_in_with_password(email=email, password=password)
        if getattr(response, "session", None):
            print("Login successful.")
            return True
        print("Login failed.")
        return False
    except Exception as e:
        print(f"Login error: {e}")
        return False
