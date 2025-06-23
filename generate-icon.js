const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(
  fileName = 'icon.png',
  backgroundColor = '#4a86e8',
  textColor = '#ffffff',
) {
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = textColor;
  ctx.font = 'bold 70px Arial';
  ctx.fillText('CC', 14, 90);

  fs.writeFileSync(fileName, canvas.toBuffer('image/png'));
}

// Создаем иконку для светлой темы
generateIcon(
  'icon.png',
  '#4a86e8',
  '#ffffff',
);

// Создаем иконку для темной темы
generateIcon(
  'icon-dark.png',
  '#1a1a1a',
  '#4a86e8',
);