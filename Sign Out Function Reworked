//Allows User Options to log-out from the current active session and when the page is closed.


class AuthManager:
    def __init__(self, supabase_client):
        self.supabase = supabase_client

    def sign_out_user(self):
        
        session = self.supabase.auth.get_session()

        if session and session.get('access_token'):
            try:
                self.supabase.auth.sign_out()
                print("Logout successful.")
                return True
            except Exception as e:
                print(f"Failed to log out: {e}")
                return False
        else:
            print("No active session to log out from.")
            return False
