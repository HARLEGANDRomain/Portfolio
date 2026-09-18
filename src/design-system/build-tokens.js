import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['src/design-system/tokens.sd.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/design-system/build/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'src/design-system/build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
    json: {
      transformGroup: 'web',
      buildPath: 'src/design-system/build/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
      ],
    },
  },
});

console.log('🔨 Building Design System Tokens with Style Dictionary...');
await sd.buildAllPlatforms();
console.log('✅ Style Dictionary build completed!');
