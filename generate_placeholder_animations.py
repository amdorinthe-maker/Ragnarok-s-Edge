import os
import svgwrite
from svgwrite import shapes

def create_character_animation_frames(char_class, states):
    base_dir = f"/workspace/assets/characters/{char_class}"
    os.makedirs(base_dir, exist_ok=True)
    
    colors = {
        'berserker': '#d86c2f',
        'ranger': '#4a7c3e',
        'runecaster': '#9f8cff',
        'guardian': '#5a6b7c'
    }
    color = colors.get(char_class, '#888888')
    
    for state in states:
        for frame in range(1, 5):
            svg_filename = f"{base_dir}/{char_class}_{state}_{str(frame).zfill(2)}.svg"
            
            dwg = svgwrite.Drawing(svg_filename, size=('32x48'))
            
            offset_y = 0
            if state == 'walk' or state == 'run':
                offset_y = (frame % 2) * 2 - 1
            elif state == 'attack':
                offset_y = (frame - 2.5) * 3
            
            dwg.add(dwg.rect(insert=(8, 10+offset_y), size=(16, 28), fill=color))
            dwg.add(dwg.circle(center=(16, 8+offset_y), r=6, fill='#d8c39c'))
            
            arm_angle = (frame - 2.5) * 0.3 if state == 'attack' else (frame % 2) * 0.2
            dwg.add(dwg.line(start=(16, 14+offset_y), end=(10-arm_angle*10, 22+offset_y), stroke=color, stroke_width=4))
            dwg.add(dwg.line(start=(16, 14+offset_y), end=(22+arm_angle*10, 22+offset_y), stroke=color, stroke_width=4))
            
            dwg.save()
            print(f"Created: {svg_filename}")

def create_enemy_animation_frames(enemy_name, states):
    base_dir = f"/workspace/assets/enemies/{enemy_name}"
    os.makedirs(base_dir, exist_ok=True)
    
    colors = {
        'draugr': '#6b7c5a',
        'wolf': '#4a4a4a',
        'boss_golem': '#8b7355',
        'boss_wolf': '#2a2a2a'
    }
    color = colors.get(enemy_name, '#888888')
    
    is_boss = 'boss' in enemy_name
    size = 64 if is_boss else 48
    
    for state in states:
        for frame in range(1, 5):
            svg_filename = f"{base_dir}/{enemy_name}_{state}_{str(frame).zfill(2)}.svg"
            
            dwg = svgwrite.Drawing(svg_filename, size=(f'{size}x{size}'))
            
            offset_y = 0
            if state == 'walk':
                offset_y = (frame % 2) * 3 - 1.5
            elif state == 'attack':
                offset_y = (frame - 2.5) * 4
            
            if 'wolf' in enemy_name:
                dwg.add(dwg.rect(insert=(size*0.2, size*0.3+offset_y), size=(size*0.6, size*0.4), fill=color))
                dwg.add(dwg.circle(center=(size*0.3, size*0.35+offset_y), r=size*0.12, fill=color))
            else:
                dwg.add(dwg.rect(insert=(size*0.25, size*0.2+offset_y), size=(size*0.5, size*0.6), fill=color))
                dwg.add(dwg.circle(center=(size*0.5, size*0.3+offset_y), r=size*0.15, fill='#aa8866'))
            
            dwg.save()
            print(f"Created: {svg_filename}")

def create_npc_animation_frames(npc_name, states):
    base_dir = "/workspace/assets/characters/npcs"
    os.makedirs(base_dir, exist_ok=True)
    
    colors = {
        'forgekeeper': '#b87333',
        'runespeaker': '#9f8cff',
        'pathfinder': '#5a8b5a',
        'lorekeeper': '#6b5a8b',
        'merchant': '#d4af37',
        'trainer': '#8b5a5a'
    }
    color = colors.get(npc_name, '#888888')
    
    for state in states:
        for frame in range(1, 5):
            svg_filename = f"{base_dir}/npc_{npc_name}_{state}_{str(frame).zfill(2)}.svg"
            
            dwg = svgwrite.Drawing(svg_filename, size=('48x48'))
            
            offset_y = 0
            if state == 'walk':
                offset_y = (frame % 2) * 2 - 1
            elif state == 'talk':
                offset_y = (frame % 2) * 1.5 - 0.75
            
            dwg.add(dwg.polygon(points=[(24, 8+offset_y), (10, 40+offset_y), (38, 40+offset_y)], fill=color))
            dwg.add(dwg.circle(center=(24, 14+offset_y), r=7, fill='#d8c39c'))
            
            # Hood for scholars using path instead of arc
            if npc_name in ['runespeaker', 'lorekeeper']:
                hood_path = f"M {16},{12+offset_y} A 8,8 0 0,1 {32},{12+offset_y} L {32},{12+offset_y} L {16},{12+offset_y} Z"
                dwg.add(dwg.path(d=hood_path, fill=color, opacity=0.5))
            
            dwg.save()
            print(f"Created: {svg_filename}")

char_states = ['idle', 'walk', 'run', 'attack', 'hit', 'death']
enemy_states = ['idle', 'walk', 'attack', 'hit', 'death']
npc_states = ['idle', 'talk', 'walk']

print("Generating character animations...")
for char_class in ['berserker', 'ranger', 'runecaster', 'guardian']:
    create_character_animation_frames(char_class, char_states)

print("\nGenerating enemy animations...")
for enemy in ['draugr', 'wolf', 'boss_golem', 'boss_wolf']:
    create_enemy_animation_frames(enemy, enemy_states)

print("\nGenerating NPC animations...")
for npc in ['forgekeeper', 'runespeaker', 'pathfinder', 'lorekeeper', 'merchant', 'trainer']:
    create_npc_animation_frames(npc, npc_states)

print("\n✓ All placeholder animation frames generated!")
