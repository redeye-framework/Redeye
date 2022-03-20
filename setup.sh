sudo apt install sqlcipher libsqlcipher0 libsqlcipher-dev
sudo python3 -m pip uninstall jwt
python3 -m pip install -r requirements.txt
python3 RedDB/db.py

echo "To start RedEye server => python3 redeye.py"
