module.exports = [
"[project]/src/lib/car-api.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/node_modules_fa4f0933._.js",
  "server/chunks/ssr/src_lib_a65241c1._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/car-api.ts [app-ssr] (ecmascript)");
    });
});
}),
];