from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId

client = MongoClient("mongodb://localhost:27017/")
db = client["freshmeet_db"]

users_collection = db["users"]
orders_collection = db["orders"]
addresses_collection = db["addresses"]

def create_user(firstname, lastname, mobile, email, hashed_password):
    user_data = {
        "firstname": firstname,
        "lastname": lastname,
        "mobile": mobile,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    return users_collection.insert_one(user_data).inserted_id

def find_user_by_email(email):
    return users_collection.find_one({"email": email})

def set_reset_token(email, token, expiry_minutes=15):
    expiry_time = datetime.utcnow() + timedelta(minutes=expiry_minutes)
    return users_collection.update_one(
        {"email": email},
        {"$set": {"reset_token": token, "reset_token_expiry": expiry_time}}
    )

def find_user_by_reset_token(token):
    now = datetime.utcnow()
    return users_collection.find_one({
        "reset_token": token,
        "reset_token_expiry": {"$gt": now}
    })

def update_password(email, hashed_password):
    return users_collection.update_one(
        {"email": email},
        {
            "$set": {"password": hashed_password},
            "$unset": {"reset_token": "", "reset_token_expiry": ""}
        }
    )

def create_order(user_email, weight, items, total_amount):
    # Generate custom order ID: "FMYYYYMMDD:Timestamp"
    date_part = datetime.utcnow().strftime("%Y%m%d")
    timestamp = int(datetime.utcnow().timestamp())  # or use str(datetime.utcnow().timestamp()) if you prefer
    order_id = f"FM{date_part}:{timestamp}"

    order_data = {
        "_id": order_id,  # custom order ID
        "user_email": user_email,
        "items": items,
        "weight": weight,
        "total_amount": total_amount,
        "timestamp": datetime.utcnow()
    }
    return orders_collection.insert_one(order_data).inserted_id

def add_address(user_email, house_no, landmark, town, state):
    address_data = {
        "user_email": user_email,
        "houseNo": house_no,
        "landmark": landmark,
        "town": town,
        "state": state,
        "timestamp": datetime.utcnow()
    }
    return addresses_collection.insert_one(address_data).inserted_id

def get_user_addresses(user_email):
    addresses = list(addresses_collection.find({"user_email": user_email}))
    for addr in addresses:
        addr["_id"] = str(addr["_id"])
    return addresses

def update_address(address_id, updated_fields):
    try:
        result = addresses_collection.update_one(
            {"_id": ObjectId(address_id)},
            {"$set": updated_fields}
        )
        return result.modified_count > 0
    except Exception as e:
        print("Update failed:", e)
        return False

def delete_address(address_id):
    try:
        result = addresses_collection.delete_one({"_id": ObjectId(address_id)})
        return result.deleted_count > 0
    except Exception as e:
        print("Delete failed:", e)
        return False



# cd C:\Users\krshn\ecommerce\ecommerce-backend
# venv\Scripts\activate
# pip install flask flask-cors pymongo
# py app.py

# cd ecommerce-frontend/ecommerce-frontend
# npm start  192.168.0.106

# db
# "C:\Users\krshn\AppData\Local\Programs\mongosh\mongosh.exe"