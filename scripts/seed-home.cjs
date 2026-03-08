// CommonJS wrapper to run the TypeScript seed-home script via ts-node
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
    moduleResolution: "node",
  },
});

require("./seed-home.ts");

