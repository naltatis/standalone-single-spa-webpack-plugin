const StandaloneSingleSpa = require("../lib/standalone-single-spa");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const StandalonePlugin = require("../lib/standalone-single-spa");
const fs = require("fs").promises;

describe("standalone-single-spa-webpack-plugin", () => {
  test("basic-usage", async () => {
    const outputDir = path.resolve(__dirname, "./output/basic-usage");

    const config = {
      entry: path.resolve(__dirname, "./fixtures/basic/index.js"),
      output: {
        libraryTarget: "system",
        path: outputDir,
      },
      plugins: [
        new HtmlWebpackPlugin(),
        new StandalonePlugin({
          appOrParcelName: "basic-usage",
          importMapUrl: new URL(
            "https://react.microfrontends.app/importmap.json"
          ),
          importMap: {
            imports: {
              foo: "/foo.js",
            },
          },
        }),
      ],
    };

    const stats = await webpackCompile(config);
    const html = await readOutputHtml(outputDir);
    expect(html).toMatchSnapshot();
  });

  test("basic-parcel", async () => {
    const outputDir = path.resolve(__dirname, "./output/basic-parcel");

    const config = {
      entry: path.resolve(__dirname, "./fixtures/basic/index.js"),
      output: {
        libraryTarget: "system",
        path: outputDir,
      },
      plugins: [
        new HtmlWebpackPlugin(),
        new StandalonePlugin({
          isParcel: true,
          appOrParcelName: "basic-parcel",
          importMapUrl: new URL(
            "https://react.microfrontends.app/importmap.json"
          ),
          importMap: {
            imports: {
              foo: "/foo.js",
            },
          },
        }),
      ],
    };

    const stats = await webpackCompile(config);
    const html = await readOutputHtml(outputDir);
    expect(html).toMatchSnapshot();
  });

  test("disabled", async () => {
    const outputDir = path.resolve(__dirname, "./output/basic-parcel");

    const config = {
      entry: path.resolve(__dirname, "./fixtures/basic/index.js"),
      output: {
        libraryTarget: "system",
        path: outputDir,
      },
      plugins: [
        new HtmlWebpackPlugin(),
        new StandalonePlugin({
          isParcel: true,
          appOrParcelName: "basic-parcel",
          importMapUrl: new URL(
            "https://react.microfrontends.app/importmap.json"
          ),
          importMap: {
            imports: {
              foo: "/foo.js",
            },
          },
          disabled: true,
        }),
      ],
    };

    const stats = await webpackCompile(config);
    const html = await readOutputHtml(outputDir);
    expect(html.includes("systemjs")).toBe(false);
  });
});

function webpackCompile(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.compilation.errors.length > 0) {
        reject(stats.compilation.errors);
      } else {
        resolve(stats);
      }
    });
  });
}

async function readOutputHtml(outputDir) {
  return await fs.readFile(path.resolve(outputDir, "./index.html"), "utf-8");
}
