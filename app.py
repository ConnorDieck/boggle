from boggle import Boggle
from flask import Flask, session, render_template
from flask_debugtoolbar import DebugToolbarExtension

boggle_game = Boggle()

app = Flask(__name__)
app.config['SECRET_KEY'] = "no-telling"

debug = DebugToolbarExtension(app)

@app.route('/')
def display_board():
    board = Boggle.make_board(boggle_game)
    session['board'] = board
    return render_template('board.html', board=board)