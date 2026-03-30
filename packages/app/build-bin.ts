Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: true,
  target: 'bun',
  compile: {
    target: 'bun-windows-x64',
    outfile: 'serverlite-windows-x64.exe'
  }
});

Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: true,
  target: 'bun',
  compile: {
    target: 'bun-darwin-x64',
    outfile: 'serverlite-darwin-x64'
  }
});

Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  minify: true,
  target: 'bun',
  compile: {
    target: 'bun-linux-x64',
    outfile: 'serverlite-linux-x64'
  }
});
