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

# Check if avatarChannels is enabled
avatar_channels = channels_data.get('avatarChannels', [])
avatar_channel_enabled = any(channel.get('enabled', False) for channel in avatar_channels)

if not avatar_channel_enabled:
    exit("Avatar channels are not enabled. Exiting...")

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print('Logged in as')
    print(bot.user.name)
    print(bot.user.id)
    print('------')

avatar_changes = []

@bot.event
async def on_user_update(before, after):
    if before.avatar != after.avatar:
        avatar_changes.append(after.id)
        # Automatically call the 'av' command to display the updated avatar
        await bot.get_command('av').callback(bot.get_context(after))

@bot.command(name='av')
async def avatar(ctx):
    # If there's no input, use the message sender
    member_id = ctx.author.id if not avatar_changes else avatar_changes[-1]

    guild_id = 1088356545613537280  # ID of the guild to fetch the member from
    guild = bot.get_guild(guild_id)

    if guild is None:
        await ctx.send("Guild not found.")
        return

    try:
        # Get the member with the ID
        member = await guild.fetch_member(member_id)
    except:
        await ctx.send("User not found.")
        return

    # Create an embed to display the avatar
    embed = discord.Embed(title="Avatar Update")
    embed.timestamp = datetime.datetime.utcnow()

    # Check if the user's avatar has changed recently
    if member.id in avatar_changes:
        # Fetch the updated member to get the latest avatar URL
        updated_member = await bot.fetch_user(member.id)
        if updated_member:
            embed.set_image(url=updated_member.avatar.url)
    else:
        # Check if a global avatar is available
        if member.avatar:
            embed.set_image(url=member.avatar.url)
        else:
            # If no global avatar is available, use the default image URL
            default_avatar_url = "https://cdn.discordapp.com/attachments/1142146347106050210/1181855579505963079/Discord_Computer_Icons_Social_Media_Online_Chat_Internet_Bot_PNG_-_Free_Download-removebg-preview.png"
            embed.set_image(url=default_avatar_url)

    # Get the user's avatar in the guild
    if member.guild_avatar:
        embed.set_thumbnail(url=member.guild_avatar.url)
        embed.add_field(name="Name", value=member.mention)
        embed.add_field(name="ID", value=avatar_changes)
    else:
        embed.add_field(name="Name", value=member.mention)
        embed.add_field(name="ID", value=avatar_changes)
    # Retrieve the channel ID from channels.json
    target_channel_id = None
    for channel_data in avatar_channels:
        if channel_data.get('enabled', False):
            target_channel_id = channel_data.get('id')
            break

    if not target_channel_id:
        await ctx.send("No enabled avatar channel found.")
        return

    target_channel = discord.utils.get(guild.channels, id=int(target_channel_id))

    if target_channel is None:
        await ctx.send(f"Channel with ID '{target_channel_id}' not found.")
        return

    # Send the embed to the specified channel
    await target_channel.send(embed=embed)

bot.run(token)
