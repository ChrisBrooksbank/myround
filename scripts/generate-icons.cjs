// Script to generate PWA icons
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background - dark navy (#1a1a2e)
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, size, size);

  // Draw a circular badge with red/amber theme
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;

  // Outer circle - amber accent (#f5a623)
  ctx.fillStyle = '#f5a623';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Inner circle - warm red (#e94560)
  ctx.fillStyle = '#e94560';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.75, 0, Math.PI * 2);
  ctx.fill();

  // Draw beer emoji/text in center
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.35}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🍺', centerX, centerY);

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, '..', 'public', `icon-${size}.png`);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated ${outputPath}`);
}

// Generate both required sizes
generateIcon(192);
generateIcon(512);

console.log('✓ All icons generated successfully');
