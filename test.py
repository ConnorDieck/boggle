from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def test_display_board(self):
        """Check to see that home route is found and delivers correct HTML"""
        with app.test_client() as client:
            resp = client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn("<h1>Let's Play Boggle!</h1>", html)

    def test_handle_guess(self):
        """Pass in specific value for the board and then ensure that handle_guess returns json that includes 'ok'"""

        with app.test_client() as client:
            # import pdb
            # pdb.set_trace()
            # Add extra code in order to modify session
            with client.session_transaction() as change_session:
                
                # Modify board to preset value
                change_session['board'] = [["H", "E", "L", "I", "X"],["H", "E", "L", "I", "X"],["H", "E", "L", "I", "X"],["H", "E", "L", "I", "X"],["H", "E", "L", "I", "X"]]

            # Pass the desired word through as part of the query string
            resp = client.get('/guess?word=helix')
            # Pull json response from resp object
            json = resp.get_data(as_text=True)

            # Assert that json resposne includes 'ok'
            self.assertIn("ok", json)

    def test_handle_stats(self):
        """Check to make sure post request for highscore is passed through, and that the server updates 'playtimes' in session"""

        with app.test_client() as client:

            # import pdb
            # pdb.set_trace()

            #Modify 'playtimes' in session
            with client.session_transaction() as change_session:
                # change_session['highscore'] = 20
                change_session['playtimes'] = 5
            
            # Pass a post request with highscore data
            resp = client.post("/stats", json={"score": 20})
    
            # Test that highscore was passed through to json
            self.assertEqual(resp.json["highscore"], 20)
            # Test that playtimes was incremented after receiving post request
            self.assertEqual(session['playtimes'], 6)