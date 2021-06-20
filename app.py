from flask.json import jsonify
from boggle import Boggle
from flask import Flask, session, render_template, request, redirect
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()

app = Flask(__name__)
app.config['SECRET_KEY'] = "no-telling"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

# debug = DebugToolbarExtension(app)

@app.route('/')
def display_board():
    """Generates board and save to the session, then passes the board through to HTML"""
    board = boggle_game.make_board()
    session['board'] = board
    return render_template('board.html', board=board)

@app.route('/guess')
def handle_guess():
    """Checks to see if word is included in words and then if it is on the board"""

    # Grab the input from the form
    word = request.args["word"]

    # Pull the board from the session
    board = session['board']

    # Check to see if word is in words and/or on the boggle board
    result = boggle_game.check_valid_word(board, word)

    # Respond with JSON
    info = {"result": result}
    return jsonify(info)



@app.route('/stats', methods=['POST'])
def handle_stats():
    """Stores highest score and number of playtimes in session"""

    # import pdb
    # pdb.set_trace()

    # Increment playtimes by one and store in session (set as zero if no value exists)
    playtimes = session.get("playtimes", 0)
    session['playtimes'] = playtimes + 1

    # Grab score from client, compare with logged highscore, then score highest in session
    score = request.json["score"]
    highscore = session.get('highscore', 0)
    session['highscore'] = max(score, highscore)
    
    score_data = {"highscore": session['highscore']}
    return jsonify(score_data)