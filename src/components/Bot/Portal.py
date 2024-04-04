import discord
from discord.ext import commands
import logging
import requests
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import json

# Logging setup
logging.basicConfig(level=logging.INFO)

# Load data from config.json
with open('config.json') as f:
    config_data = json.load(f)

# Get the token from tokenChannels
token = config_data.get('tokenChannels', [{}])[0].get('Tokens')

if not token:
    exit("Token not found in config.json. Exiting...")

# Konfigurasi bot
prefix = "?"

# Prefix Setup
intents = discord.Intents.default()
intents.members = True
intents.message_content = True

# Membuat bot
bot = commands.Bot(command_prefix=prefix, intents=intents)

# Load data from channels.json
with open('channels.json') as f:
    channels_data = json.load(f)

# Get welcomeChannels data
welcomeMessageChannels_data = channels_data.get('welcomeMessageChannels', [])
welcomeMessageChannels_enabled = any(channel.get('enabled', False) for channel in welcomeMessageChannels_data)

GUILD_ID = 1088356545613537280  # Replace with your server's ID

# Fungsi untuk mengunduh avatar atau menggunakan default
# Fungsi untuk mengunduh avatar atau menggunakan default
def download_avatar(avatar_url):
    response = requests.get(avatar_url)
    if response.status_code == 200:
        return Image.open(BytesIO(response.content))
    else:
        # Log an error if the avatar cannot be downloaded
        print(f"Failed to download avatar from {avatar_url}")
        return None

# Fungsi untuk membuat gambar boarding pass
def create_welcome_image(member, background_url, guild_member_count, join_date, weather_info):
    try:
        # Download background image
        response = requests.get(background_url)
        if response.status_code == 200:
            background = Image.open(BytesIO(response.content)).convert("RGBA")
            draw = ImageDraw.Draw(background)

            # Define fonts
            font_large = ImageFont.truetype("arial.ttf", 60)
            font_small = ImageFont.truetype("arial.ttf", 30)
            font_smoll = ImageFont.truetype("arial.ttf", 20)

            # Add texts
            draw.text((240, 350), f"{member.name}", (0, 0, 0), font=font_large)
            draw.text((610, 555), f"{join_date}", (0, 0, 0), font=font_small)
            draw.text((230, 945), f"GUEST NO. {guild_member_count}", (0, 0, 0), font=font_smoll)
            draw.text((227, 700), f"{weather_info}", (0, 0, 0), font=font_small)
            draw.text((227, 555), "PLASTICQUE AREA", (0, 0, 0), font=font_small)

            # Determine the correct avatar URL and download
            avatar_url = member.avatar.url if member.avatar else member.default_avatar.url
            avatar = download_avatar(avatar_url)
            if avatar:
                avatar = avatar.convert("RGBA").resize((200, 200))
                # Use avatar as the mask for itself to handle transparency correctly
                background.paste(avatar, (600, 600), avatar)

            # Save image to a buffer
            buffer = BytesIO()
            background.save(buffer, format="PNG")
            buffer.seek(0)
            return buffer
        else:
            print("Failed to download background image")
            return None
    except Exception as e:
        print(f"Error creating welcome image: {e}")
        return None



@bot.event
async def on_ready():
    print(f"Bot connected as {bot.user.name}")

@bot.event
async def on_member_join(member):
    if welcomeMessageChannels_enabled and member.guild.id == GUILD_ID:
        welcome_channel_id = next((channel['id'] for channel in welcomeMessageChannels_data if channel.get('enabled', False)), None)
        if welcome_channel_id:
            welcome_channel = bot.get_channel(int(welcome_channel_id))
            background_url = "https://cdn.discordapp.com/attachments/1117792919139659786/1214787092115103794/Yellow_and_Black_Lines_Boarding_Pass_Invitation_1.jpg?ex=65fa61a4&is=65e7eca4&hm=934ff96359b99e82585e1adcfee4dcc8063111de41c3cfe16b784beabea21969&"
            join_date = member.joined_at.strftime("%Y-%m-%d")
            guild_member_count = member.guild.member_count
            weather_info = "Sunny"  # Example, replace with real weather data if desired

            image_buffer = create_welcome_image(member, background_url, guild_member_count, join_date, weather_info)
            if image_buffer:
                await welcome_channel.send(file=discord.File(image_buffer, "welcome.png"))
            else:
                print("Failed to create welcome image.")

if __name__ == "__main__":
    bot.run(token)
