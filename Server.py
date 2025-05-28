import sqlite3
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

# SQLite Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Initialize the database
with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'message': 'User or email already exists'}), 400

    # Hash the password and store it
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password')

    user = None
    if identifier:
        if "@" in identifier:
            user = User.query.filter_by(email=identifier).first()
        else:
            user = User.query.filter_by(username=identifier).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials'}), 400

    return jsonify({'message': 'Login successful', 'username': user.username, 'email': user.email}), 200

# GPU API
@app.route('/api/gpus', methods=['GET'])
def get_gpus():
    conn = sqlite3.connect('instance/pc-parts.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name, manufacturer, image_url, price, memory_size, memory_type, core_clock, boost_clock, tdp, slot FROM GPU")
    gpus = [
        {
            'name': row[0],
            'manufacturer': row[1],
            'image_url': row[2],
            'price': row[3],
            'memory_size': row[4],
            'memory_type': row[5],
            'core_clock': row[6],
            'boost_clock': row[7],
            'tdp': row[8],
            'slot': row[9],
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(gpus)

# CPU API
@app.route('/api/cpus', methods=['GET'])
def get_cpus():
    conn = sqlite3.connect('instance/pc-parts.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name, manufacturer, image_url, price, core_count, thread_count, base_clock, boost_clock, tdp, socket, integrated_graphics FROM CPU")
    cpus = [
        {
            'name': row[0],
            'manufacturer': row[1],
            'image_url': row[2],
            'price': row[3],
            'core_count': row[4],
            'thread_count': row[5],
            'base_clock': row[6],
            'boost_clock': row[7],
            'tdp': row[8],
            'socket': row[9],
            'integrated_graphics': row[10],
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(cpus)

# Motherboard API
@app.route('/api/motherboards', methods=['GET'])
def get_motherboards():
    conn = sqlite3.connect('instance/pc-parts.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name, manufacturer, image_url, price, socket, chipset, form_factor FROM Motherboard")
    motherboards = [
        {
            'name': row[0],
            'manufacturer': row[1],
            'image_url': row[2],
            'price': row[3],
            'socket': row[4],
            'chipset': row[5],
            'form_factor': row[6],
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(motherboards)

# RAM API
@app.route('/api/rams', methods=['GET'])
def get_rams():
    conn = sqlite3.connect('instance/pc-parts.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name, manufacturer, image_url, price, capacity, ram_speed, ram_type FROM RAM")
    rams = [
        {
            'name': row[0],
            'manufacturer': row[1],
            'image_url': row[2],
            'price': row[3],
            'capacity': row[4],
            'ram_speed': row[5],
            'ram_type': row[6]
        }
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(rams)

if __name__ == '__main__':
    app.run(debug=True)