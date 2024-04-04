import discord
from discord.ext import commands
import json
import datetime

# Load config data
with open('config.json') as f:
    config_data = json.load(f)

# Get the token
token = config_data.get('tokenChannels', [{}])[0].get('Tokens')
if not token:
    exit("Token not found in config.json. Exiting...")

# Load channels data
with open('channels.json') as f:
    channels_data = json.load(f)

# Get role log channel info
role_log_channels_data = channels_data.get('roleLogChannels', [])
role_log_channel_id = next((channel['id'] for channel in role_log_channels_data if channel.get('enabled', False)), None)
if not role_log_channel_id:
    exit("Role log channel not found or not enabled in channels.json. Exiting...")

# Bot setup

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user.name}')

@bot.event
async def on_member_update(before, after):
    role_log_channel = bot.get_channel(int(role_log_channel_id))
    if role_log_channel is None:
        print(f"Error: Role log channel with ID {role_log_channel_id} not found.")
        return

    # Check for role addition
    added_roles = [role for role in after.roles if role not in before.roles]
    if added_roles:
        
        embed = discord.Embed(color=discord.Color.green(), title="Role Added")
        embed.add_field(name="Member", value=after.mention, inline=True)
        embed.add_field(name="Role(s)", value=", ".join([role.mention for role in added_roles]), inline=True)
        embed.set_footer(text=f"ID: {after.id}")
        embed.timestamp = datetime.datetime.utcnow()
        await role_log_channel.send(embed=embed)

    # Check for role removal
    removed_roles = [role for role in before.roles if role not in after.roles]
    if removed_roles:
        
        embed = discord.Embed(color=discord.Color.orange(), title="Role Removed")
        embed.add_field(name="Member", value=after.mention, inline=True)
        embed.add_field(name="Role(s)", value=", ".join([role.mention for role in removed_roles]), inline=True)
        embed.set_footer(text=f"ID: {after.id}")
        embed.timestamp = datetime.datetime.utcnow()
        await role_log_channel.send(embed=embed)

@bot.event
async def on_guild_channel_update(before, after):
    role_log_channel = bot.get_channel(int(role_log_channel_id))
    if role_log_channel is None:
        print(f"Error: Role log channel with ID {role_log_channel_id} not found.")
        return
    
    for entity, after_overwrite in after.overwrites.items():
        before_overwrite = before.overwrites.get(entity, discord.PermissionOverwrite())
        
        # Initialize a list to store changes
        changes = []

        # Iterate through all possible permissions
        for perm_name in discord.Permissions.VALID_FLAGS:
            before_value = getattr(before_overwrite, perm_name, None)
            after_value = getattr(after_overwrite, perm_name, None)
            
            # Check if the permission has changed
            if before_value != after_value:
                perm_status = '✅ Granted' if after_value else '❌ Removed'
                changes.append(f"{perm_name.replace('_', ' ').title()}: {perm_status}")
        
        # If there were changes, send a log message
        if changes:
            entity_name = entity.name if isinstance(entity, discord.Role) else entity.display_name
            
            embed = discord.Embed(title=f"Updated in {after.name}", color=discord.Color.blue())
            embed.add_field(name="Entity", value=entity_name, inline=False)
            embed.add_field(name="Changes", value="\n".join(changes), inline=False)
            embed.set_footer(text=f"Channel ID: {after.id}")
            embed.timestamp = datetime.datetime.utcnow()
            await role_log_channel.send(embed=embed)

@bot.event
async def on_guild_channel_delete(channel):
    role_log_channel = bot.get_channel(int(role_log_channel_id))
    if role_log_channel is None:
        print(f"Error: Role log channel with ID {role_log_channel_id} not found.")
        return
    
    embed = discord.Embed(title="Channel Deleted", color=discord.Color.red())
    embed.add_field(name="Channel Name", value=channel.name, inline=False)
    embed.add_field(name="Channel ID", value=channel.id, inline=False)
    embed.set_footer(text=f"Guild: {channel.guild.name} (ID: {channel.guild.id})")
    embed.timestamp = datetime.datetime.utcnow()
    
    await role_log_channel.send(embed=embed)

bot.run(token)
