const fs = require('fs');
const sharp = require('sharp');

// Function to convert SVG to PNG
async function createPNGFromSVG(inputSVG, outputPath, size) {
    try {
        await sharp(inputSVG)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`✅ Created ${outputPath} (${size}x${size})`);
    } catch (error) {
        console.error(`❌ Error creating ${outputPath}:`, error.message);
    }
}

// Main function to generate all icon sizes
async function generateIcons() {
    const svgPath = './assets/food-casino-logo.svg';
    
    // Check if SVG exists
    if (!fs.existsSync(svgPath)) {
        console.error('❌ SVG file not found at:', svgPath);
        return;
    }

    console.log('🎨 Generating Food Casino app icons...\n');

    // Generate all required icon sizes
    const icons = [
        { path: './assets/icon.png', size: 1024 },
        { path: './assets/adaptive-icon.png', size: 1024 },
        { path: './assets/splash-icon.png', size: 512 },
        { path: './assets/favicon.png', size: 32 },
    ];

    for (const icon of icons) {
        await createPNGFromSVG(svgPath, icon.path, icon.size);
    }

    console.log('\n🎉 All icons generated successfully!');
    console.log('📱 Your Food Casino app now has a beautiful new logo!');
}

// Run the generator
if (require.main === module) {
    generateIcons();
}

module.exports = { generateIcons, createPNGFromSVG };
