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

# Check if deleteMessageChannels is enabled
delete_channels = channels_data.get('deleteMessageChannels', [])
delete_channel_enabled = any(channel.get('enabled', False) for channel in delete_channels)


intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print('Logged in as', bot.user.name)

@bot.event
async def on_message_delete(message):
    if delete_channel_enabled:
        channel_name = message.channel.name
        deleted_by = message.author.mention
        deleted_content = message.content
        
        embed = discord.Embed(
            title="Message Deleted",
            description=f"**Channel:** {channel_name}\n**Author:** {deleted_by}\n**Content:** {deleted_content}",
            color=discord.Color.red()
        )
        embed.timestamp = datetime.datetime.utcnow()
        
        for channel in delete_channels:
            if channel.get('enabled', False):
                channel_id = channel.get('id')
                delete_channel = bot.get_channel(int(channel_id))
                if delete_channel is not None:
                    await delete_channel.send(embed=embed)
                else:
                    print(f"Error: Channel with ID {channel_id} not found.")

bot.run(token)
