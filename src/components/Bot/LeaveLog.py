import discord
from discord.ext import commands
import json
import datetime

# Load data from config.json
with open('config.json') as f:
    config_data = json.load(f)

# Get the token from tokenChannels
token = config_data.get('tokenChannels', [{}])[0].get('Tokens')

if not token:
    exit("Token not found in config.json. Exiting...")

# Load data from channels.json
with open('channels.json') as f:
    channels_data = json.load(f)

# Load goodbyeChannels
goodbye_channels_data = channels_data.get('goodbyeChannels', [])
goodbye_channel_enabled = any(channel.get('enabled', False) for channel in goodbye_channels_data)

intents = discord.Intents.default()
intents.members = True
intents.message_content = True
intents.guilds = True
intents.voice_states = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print('Logged in as', bot.user.name)

@bot.event
async def on_member_remove(member):
    if goodbye_channel_enabled:
        embed = discord.Embed(
            color=discord.Color.red(),
            description=f"**{member.mention}** has left the server. Goodbye!"
        )
        embed.set_author(name=member.display_name,icon_url=member.avatar.url if member.avatar else member.default_avatar.url)
        embed.set_thumbnail(url=member.avatar.url if member.avatar else member.default_avatar.url)
        embed.set_footer(text=f"ID: {member.id}")
        embed.timestamp = datetime.datetime.utcnow()

        for channel in goodbye_channels_data:
            if channel.get('enabled', False):
                channel_id = channel.get('id')
                goodbye_channel = bot.get_channel(int(channel_id))
                if goodbye_channel is not None:
                    await goodbye_channel.send(embed=embed)
                else:
                    print(f"Error: Channel with ID {channel_id} not found.")

bot.run(token)
