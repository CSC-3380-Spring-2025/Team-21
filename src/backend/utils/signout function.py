def logout_user() -> bool:
    try:
        supabase.auth.sign_out()
        print("User has logged out.")
        return True
    except Exception as e:
        print(f"An Error occured during logout: {str(e)}")
        return False
