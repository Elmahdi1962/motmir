import bcrypt
from dotenv import load_dotenv
load_dotenv()
from models import storage
from models.user import User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

hashed_password = bcrypt.generate_password_hash('Mamoun@1962').decode('utf-8')

admin_user = User(username="elmahdi",
                  email="mamounelmahdi1962@gmail.com",
                  password=hashed_password,
                  is_admin=1)
admin_user.save()
storage.save()
