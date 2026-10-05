import os
import math
import random
import wave
import struct

sample_rate = 44100
duration = 12.0  # 12 seconds loop
total_samples = int(sample_rate * duration)

output_dir = 'public/audio'
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'underwater_ambient.wav')

# Initialize stereo channels
left_channel = [0.0] * total_samples
right_channel = [0.0] * total_samples

# 1. Deep Oceanic Sub-bass Drone & Current Swells (35Hz - 85Hz)
# Seamless loop using integer frequency multiples of 1/duration
f_base = 1.0 / duration  # 1/12 Hz fundamental
for k in [480, 540, 600, 720, 960]: # ~40Hz to 80Hz
    freq = k * f_base
    phase_l = random.uniform(0, 2 * math.pi)
    phase_r = random.uniform(0, 2 * math.pi)
    for i in range(total_samples):
        t = i / sample_rate
        # Slow tidal swell modulation
        swell = 0.6 + 0.4 * math.sin(2 * math.pi * 2 * f_base * t + 0.5)
        val_l = math.sin(2 * math.pi * freq * t + phase_l) * 0.22 * swell
        val_r = math.sin(2 * math.pi * freq * t + phase_r) * 0.22 * swell
        left_channel[i] += val_l
        right_channel[i] += val_r

# 2. Pink & Brown Noise Filtered Water Current Flow
# Generate brown noise through integration and low-pass
b0_l, b1_l, b2_l = 0.0, 0.0, 0.0
b0_r, b1_r, b2_r = 0.0, 0.0, 0.0

noise_l = [0.0] * total_samples
noise_r = [0.0] * total_samples

for i in range(total_samples):
    wl = random.gauss(0, 1)
    wr = random.gauss(0, 1)
    
    b0_l = 0.992 * b0_l + wl * 0.08
    b1_l = 0.985 * b1_l + b0_l * 0.15
    b0_r = 0.992 * b0_r + wr * 0.08
    b1_r = 0.985 * b1_r + b0_r * 0.15
    
    noise_l[i] = b1_l
    noise_r[i] = b1_r

# Smooth crossfade loop seam for noise (last 1 second crossfaded with first)
cross_samples = int(sample_rate * 1.5)
for i in range(cross_samples):
    alpha = i / cross_samples
    idx_end = total_samples - cross_samples + i
    noise_l[idx_end] = noise_l[idx_end] * (1 - alpha) + noise_l[i] * alpha
    noise_r[idx_end] = noise_r[idx_end] * (1 - alpha) + noise_r[i] * alpha

for i in range(total_samples):
    t = i / sample_rate
    current_swell = 0.7 + 0.3 * math.sin(2 * math.pi * 3 * f_base * t)
    left_channel[i] += noise_l[i] * 0.35 * current_swell
    right_channel[i] += noise_r[i] * 0.35 * current_swell

# 3. Gentle Oceanic Bubbles (random resonant water droplet chirps)
num_bubbles = 45
random.seed(42)
for _ in range(num_bubbles):
    bubble_t = random.uniform(0.5, duration - 0.5)
    bubble_start = int(bubble_t * sample_rate)
    bubble_freq = random.uniform(320, 850)
    bubble_duration = random.uniform(0.08, 0.22)
    bubble_samples = int(bubble_duration * sample_rate)
    pan = random.uniform(0.1, 0.9)
    vol = random.uniform(0.08, 0.25)
    
    for j in range(bubble_samples):
        if bubble_start + j < total_samples:
            progress = j / bubble_samples
            env = math.sin(math.pi * progress) ** 2
            # Frequency pitch rise characteristic of underwater air bubbles
            inst_freq = bubble_freq * (1.0 + progress * 0.6)
            sample_val = math.sin(2 * math.pi * inst_freq * (j / sample_rate)) * env * vol
            left_channel[bubble_start + j] += sample_val * (1.0 - pan)
            right_channel[bubble_start + j] += sample_val * pan

# 4. Normalize and soft-clip
max_val = max(max(abs(x) for x in left_channel), max(abs(y) for y in right_channel), 0.001)
scale = 0.88 / max_val

# Write 16-bit PCM Stereo WAV
with wave.open(output_path, 'w') as wav_file:
    wav_file.setnchannels(2)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    
    frames = bytearray()
    for i in range(total_samples):
        sl = int(max(-32767, min(32767, left_channel[i] * scale * 32767)))
        sr = int(max(-32767, min(32767, right_channel[i] * scale * 32767)))
        frames.extend(struct.pack('<hh', sl, sr))
    
    wav_file.writeframes(frames)

print(f"Generated underwater ambient soundscape at: {output_path}")
