#!/bin/bash
# Splash: 2732x2732, dark navy bg, neon cyan arrow, NO text

SIZE=2732
CX=1366  # center x
CY=1366  # center y

# Arrow geometry (scaled up from icon)
# Chevron: left-pointing, ~600px tall, 500px wide
# Body: right-pointing filled arrow

# Scale from 1024 base to 2732: factor ~2.67
# Let's define the arrow at splash scale

# Chevron stroke path
CHEV_X1=760; CHEV_Y1=960
CHEV_XM=1200; CHEV_YM=1366
CHEV_X2=760; CHEV_Y2=1772

# Filled arrow body
ARR_TIP_X=1972
ARR_TOP_X=1070; ARR_TOP_Y=960; ARR_BOT_Y=1772
ARR_IN_X=1070; ARR_IN_TOP_Y=1166; ARR_IN_BOT_Y=1566

magick -size ${SIZE}x${SIZE} xc:'#04070F' \
  \( -size ${SIZE}x${SIZE} radial-gradient:'#0A1A3A-#04070F' \) \
  -compose Screen -composite \
  \
  -fill none -stroke '#00C8FF' -strokewidth 90 \
  -draw "stroke-linecap Round stroke-linejoin Round path 'M ${CHEV_X1},${CHEV_Y1} L ${CHEV_XM},${CHEV_YM} L ${CHEV_X2},${CHEV_Y2}'" \
  \
  -fill '#00C8FF' -stroke none \
  -draw "path 'M ${ARR_TOP_X},${ARR_TOP_Y} L ${ARR_TIP_X},${CY} L ${ARR_TOP_X},${ARR_BOT_Y} L ${ARR_TOP_X},${ARR_IN_BOT_Y} L 1560,${CY} L ${ARR_TOP_X},${ARR_IN_TOP_Y} Z'" \
  \
  splash_raw.png

# Add glow by blurring and compositing
magick splash_raw.png \
  \( +clone -blur 0x60 -modulate 100,200 \) \
  -compose Screen -composite \
  \( +clone -blur 0x20 \) \
  -compose Screen -composite \
  splash.png

cp splash.png splash-dark.png
echo "Splash generated"
