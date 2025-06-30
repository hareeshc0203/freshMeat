from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import users_collection
from pymongo import MongoClient
import secrets
from datetime import timedelta
from datetime import datetime
from models import add_address, addresses_collection
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

# Connect to local MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['freshmeet_db']
users_collection = db['users']
orders_collection = db['orders']

# Configurations
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change in production!
jwt = JWTManager(app)

# Store reset tokens in a temporary in-memory dictionary (in production, use a DB or Redis)
reset_tokens = {}


# Dummy product data
products = [
    {
        "id": 1,
        "title": "Fresh Mutton Curry Cut",
        "description": "Juicy, tender goat meat",
        "weight": "500g",
        "pieces": "9-12",               #optional, if not in response, use fallback
        "price": 450,
        "oldPrice": 800,               #optional
        "image": "http://localhost:5000/static/images/MuttonCurryCut.jpg",
    },
    {
        "id": 2,
        "title": "Premium Lamb Chops",
        "description": "Succulent bone-in lamb pieces",
        "weight": "500g",
        "pieces": "9-12",               #optional, if not in response, use fall
        "price": 450,
        "oldPrice": 500,
        "image": "http://localhost:5000/static/images/BonelessMutton.jpg",
    }
    ,
        {
        "id": 3,
        "title": "Mutton Keema",
        "description": "Finely minced goat meat, perfect for keema dishes",
        "price": 430,
        "oldPrice": 500,
        "image": "http://localhost:5000/static/images/MuttonKeema.jpg",
        "weight": "500g"
    },
  {
    "id": 4,
    "title": "Mutton Biryani Cut",
    "description": "Bone-in cuts ideal for rich biryanis",
    "price": 470,
    "oldPrice": 500,
    "image": "http://localhost:5000/static/images/MuttonBiryaniCut.jpg",
    "weight": "500g"
  },
  {
    "id": 5,
    "title": "Mutton Liver",
    "description": "Fresh goat liver, nutrient-rich and flavorful",
    "price": 270,
    "oldPrice": 300,
    "image": "http://localhost:5000/static/images/MuttonLiver.jpg",
    "weight": "250g"
  },
  {
    "id": 6,
    "title": "Mutton Paya/Trotters (Whole): Pack of 4",
    "description": "Goat leg trotters, cleaned and ready to cook",
    "price": 300,
    "oldPrice": 500,
    "image": "http://localhost:5000/static/images/MuttonPaya.jpg",
    "weight": "2 pieces"
  },
  {
    "id": 7,
    "title": "Mutton Boneless",
    "description": "Lean, juicy boneless goat meat",
    "price": 440,
    "oldPrice": 650,
    "image": "http://localhost:5000/static/images/MuttonBoneless.jpg",
    "weight": "400g"
  },
  {
    "id": 8,
    "title": "Mutton Boti & Intestine (1 set)",
    "description": "Mutton Boti (tripe and intestine) is known for its rich, buttery yet earthy taste & chewy texture",
    "price": 250,
    "oldPrice": 400,
    "image": "http://localhost:5000/static/images/MuttonBoti&Intestine.jpg",    
    "weight": "500g"
  }
]

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    required_fields = ['firstname', 'lastname', 'mobile' , 'email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'msg': 'Missing fields'}), 400
    
    # Check if user already exists
    if users_collection.find_one({'email': data['email']}):
        return jsonify({'msg': 'Email already registered'}), 400
    
    if users_collection.find_one({'mobile': data['mobile']}):
        return jsonify({"msg": "User with this mobile already exists"}), 409

    # Hash password and insert user
    hashed_password = generate_password_hash(data['password'])
    user_data = {
        'firstname': data['firstname'],
        'lastname': data['lastname'],
        'mobile': data['mobile'],
        'email': data['email'],
        'password': hashed_password
    }
    
    users_collection.insert_one(user_data)
    return jsonify({'msg': 'User registered successfully'}), 201

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'msg': 'Missing email or password'}), 400

    user = users_collection.find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'msg': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=email)
    return jsonify({'token': access_token, 'firstname': user['firstname']}), 200


# Forget password
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email', '').strip()

    if not email:
        return jsonify({'msg': 'Email is required'}), 400

    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'msg': 'No user found with this email'}), 404

    # Generate a secure random token
    token = secrets.token_urlsafe(32)

    # Save the token in memory with expiration (or better, store in DB with expiry field)
    reset_tokens[token] = {
        'email': email,
        'expires_at': datetime.utcnow() + timedelta(minutes=15)
    }

    # In real case, you’d send this via email
    print(f"Reset link: http://localhost:3000/reset-password?token={token}")

    return jsonify({
        'token': token  # only for dev, not in production
    }), 200


# Reset password API
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password', '').strip()

    if not token or not new_password:
        return jsonify({'msg': 'Token and new password are required'}), 400

    token_data = reset_tokens.get(token)
    if not token_data:
        return jsonify({'msg': 'Invalid or expired token'}), 400

    if token_data['expires_at'] < datetime.utcnow():
        reset_tokens.pop(token, None)
        return jsonify({'msg': 'Token has expired'}), 400

    email = token_data['email']

    # Hash and update new password in DB
    hashed_password = generate_password_hash(new_password)
    users_collection.update_one(
        {'email': email},
        {'$set': {'password': hashed_password}}
    )

    # Delete token after use
    reset_tokens.pop(token, None)

    return jsonify({'msg': 'Password updated successfully.'}), 200

# Products API (Optional JWT)
@app.route('/api/products', methods=['GET'])
@jwt_required(optional=True)
def get_products():
    current_user = get_jwt_identity()
    return jsonify({
        "user": current_user,
        "products": products
    })

# Confirm Order API
@app.route('/orders', methods=['POST'])
@jwt_required()
def confirm_order():
    data = request.get_json()
    current_user = get_jwt_identity()
    weight = data.get('weight')
    items = data.get('items')
    total_amount = data.get('totalAmount')

    if not items or total_amount is None:
        return jsonify({"msg": "Missing order details"}), 400

    # Generate custom order ID: FM + YYYYMMDD + HHMMSSmmm
    now = datetime.utcnow()
    date_time_str = now.strftime('%Y%m%d%H%M%S') + f"{int(now.microsecond / 1000):03d}"
    order_id = f"FM{date_time_str}"  # e.g., FM20250629172000234

    order = {
        "_id": order_id,
        "user_email": current_user,
        "weight": weight,
        "items": items,
        "total_amount": total_amount,
        "timestamp": now
    }

    try:
        orders_collection.insert_one(order)

        return jsonify({
            "msg": "Order confirmed!",
            "order_id": order_id,
            "total": total_amount,
            "timestamp": now.isoformat()
        }), 201
    except Exception as e:
        print("Error saving order:", e)
        return jsonify({"msg": "Failed to confirm order"}), 500
    

# get orders API
@app.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    user_email = get_jwt_identity()
    orders = list(orders_collection.find({"user_email": user_email}))
    for order in orders:
        order["_id"] = str(order["_id"])
    return jsonify({"orders": orders}), 200

# Add address API
@app.route('/add-address', methods=['POST'])
@jwt_required()
def add_address_route():
    user_email = get_jwt_identity()
    data = request.get_json()

    houseNo = data.get("houseNo", "").strip()
    landmark = data.get("landmark", "").strip()
    town = data.get("town", "").strip()
    state = data.get("state", "").strip()

    if not houseNo or not landmark or not town or not state:
        return jsonify({"msg": "All fields are required."}), 400

    try:
        inserted_id = add_address(user_email, houseNo, landmark, town, state)
        return jsonify({"msg": "Address saved successfully.", "id": str(inserted_id)}), 200
    except Exception as e:
        print("Error saving address:", e)
        return jsonify({"msg": f"Failed to save address: {str(e)}"}), 500
    

# Get address API
@app.route('/get-addresses', methods=['GET'])
@jwt_required()
def get_addresses():
    user_email = get_jwt_identity()
    try:
        user_addresses = list(addresses_collection.find({"user_email": user_email}))
        for addr in user_addresses:
            addr['_id'] = str(addr['_id'])  # Convert ObjectId to string
        return jsonify({"addresses": user_addresses}), 200
    except Exception as e:
        print("Error fetching addresses:", e)
        return jsonify({"msg": "Failed to fetch addresses."}), 500

# update address API
@app.route('/update-address/<address_id>', methods=['PUT'])
@jwt_required()
def update_address_route(address_id):
    user_email = get_jwt_identity()
    data = request.get_json()

    allowed_fields = ['houseNo', 'landmark', 'town', 'state']
    updates = {k: v for k, v in data.items() if k in allowed_fields}

    if not updates:
        return jsonify({"msg": "No valid fields provided."}), 400

    from models import update_address  # if in separate file

    success = update_address(address_id, updates)
    if success:
        return jsonify({"msg": "Address updated successfully."}), 200
    else:
        return jsonify({"msg": "Failed to update address."}), 400
    

# delete address API
@app.route('/delete-address/<address_id>', methods=['DELETE'])
@jwt_required()
def delete_address_route(address_id):
    from models import delete_address  # if in separate file

    success = delete_address(address_id)
    if success:
        return jsonify({"msg": "Address deleted successfully."}), 200
    else:
        return jsonify({"msg": "Failed to delete address."}), 400


if __name__ == '__main__':
    app.run(debug=True)
