
const path      = require( "path" );




module.exports = {
    context: path.join( __dirname, "client/pages" ),
    entry: {
        index: "./index/Index.ts",
        about: "./about/About.ts",
        contact: "./contact/Contact.ts",
        license: "./license/License.ts",
        post: "./post/Post.ts",
        privacy: "./privacy/Privacy.ts",
        terms: "./terms/Terms.ts",
        upload: "./upload/Upload.ts",
        authentication: "./authentication/Authentication.ts",
        slack_invite: "./slack-invite/SlackInvite.ts",
        get_premium: "./get-premium/GetPremium.ts",
        admin_dashboard: "./admin-dashboard/AdminDashboard.ts",

        /** 404 */

        not_found: "./404/NotFound.ts",
    },
    mode: "production",
    module: {
        rules: [
            { test: /\.html$/, use: "html-loader" },
            { test: /\.js$/, loader: "source-map-loader", enforce: "pre" },
            { test: /\.ts$/, loader: "ts-loader", options: { configFile: "client.tsconfig.json" } },
            { test: /\.scss$/, use: [ "style-loader", "css-loader", "sass-loader" ] },
            { test: /\.(jpg|png|svg|gif)$/, use: { loader: "file-loader", options: { name: "[name].[ext]", outputPath: "../img/", publicPath: "./public/img" } } },
            { test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/, use: { loader: "file-loader", options: { name: "[name].[ext]", outputPath: "../fonts/", publicPath: "./public/fonts" } } },
        ]
    },
    resolve: {
        extensions: [
            ".ts",
            ".js"
        ],
        alias: {
            "TweenLite": "node_modules/gsap/src/uncompressed/TweenLite"
        }
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve( __dirname, "./public/js" )
    }

};