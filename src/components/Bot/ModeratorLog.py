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

# Check if moderatorLogChannels is enabled
moderator_channels = channels_data.get('moderatorLogChannels', [])
moderator_channel_enabled = any(channel.get('enabled', False) for channel in moderator_channels)


intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print('Logged in as', bot.user.name)

@bot.event
async def on_voice_state_update(member, before, after):
    if moderator_channel_enabled:
        if before.channel != after.channel:
            if before.channel is not None:
                # Member Moved
                embed = discord.Embed(
                    title="Member Moved",
                    description=f"**Member:** {member.mention}\n**From:** {before.channel.name}\n**To:** {after.channel.name if after.channel else 'None'}",
                    color=discord.Color.blue()
                )
                embed.timestamp = datetime.datetime.utcnow()

                for channel in moderator_channels:
                    if channel.get('enabled', False):
                        channel_id = channel.get('id')
                        log_channel = bot.get_channel(int(channel_id))
                        if log_channel is not None:
                            await log_channel.send(embed=embed)
                        else:
                            print(f"Error: Channel with ID {channel_id} not found.")
            else:
                # Member Disconnected
                embed = discord.Embed(
                    title="Member Disconnected",
                    description=f"**Member:** {member.mention}",
                    color=discord.Color.orange()
                )
                embed.timestamp = datetime.datetime.utcnow()

                for channel in moderator_channels:
                    if channel.get('enabled', False):
                        channel_id = channel.get('id')
                        log_channel = bot.get_channel(int(channel_id))
                        if log_channel is not None:
                            await log_channel.send(embed=embed)
                        else:
                            print(f"Error: Channel with ID {channel_id} not found.")

        if before.mute != after.mute:
            # Member Mute Status Changed
            action = "Muted" if after.mute else "Unmuted"
            embed = discord.Embed(
                title=f"Member {action}",
                description=f"**Member:** {member.mention}",
                color=discord.Color.gold()
            )
            embed.timestamp = datetime.datetime.utcnow()

            for channel in moderator_channels:
                if channel.get('enabled', False):
                    channel_id = channel.get('id')
                    log_channel = bot.get_channel(int(channel_id))
                    if log_channel is not None:
                        await log_channel.send(embed=embed)
                    else:
                        print(f"Error: Channel with ID {channel_id} not found.")

        if before.deaf != after.deaf:
            # Member Deafen Status Changed
            action = "Deafened" if after.deaf else "Undeafened"
            embed = discord.Embed(
                title=f"Member {action}",
                description=f"**Member:** {member.mention}",
                color=discord.Color.dark_gold()
            )
            embed.timestamp = datetime.datetime.utcnow()

            for channel in moderator_channels:
                if channel.get('enabled', False):
                    channel_id = channel.get('id')
                    log_channel = bot.get_channel(int(channel_id))
                    if log_channel is not None:
                        await log_channel.send(embed=embed)
                    else:
                        print(f"Error: Channel with ID {channel_id} not found.")




bot.run(token)
