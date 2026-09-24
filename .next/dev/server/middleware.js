"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "proxy";
exports.ids = ["proxy"];
exports.modules = {

/***/ "(middleware)/./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=%2Fhome%2Fahmedmoftah%2FDesktop%2Fprojects%2Feldokanh%2Fsrc%2Fproxy.ts&page=%2Fproxy&rootDir=%2Fhome%2Fahmedmoftah%2FDesktop%2Fprojects%2Feldokanh&matchers=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=%2Fhome%2Fahmedmoftah%2FDesktop%2Fprojects%2Feldokanh%2Fsrc%2Fproxy.ts&page=%2Fproxy&rootDir=%2Fhome%2Fahmedmoftah%2FDesktop%2Fprojects%2Feldokanh&matchers=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   handler: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_dist_build_adapter_setup_node_env_external__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/build/adapter/setup-node-env.external */ \"next/dist/build/adapter/setup-node-env.external\");\n/* harmony import */ var next_dist_build_adapter_setup_node_env_external__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_build_adapter_setup_node_env_external__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_web_globals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/web/globals */ \"(middleware)/./node_modules/next/dist/server/web/globals.js\");\n/* harmony import */ var next_dist_server_web_globals__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_globals__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/web/adapter */ \"(middleware)/./node_modules/next/dist/server/web/adapter.js\");\n/* harmony import */ var next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_dist_server_lib_incremental_cache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/dist/server/lib/incremental-cache */ \"(middleware)/./node_modules/next/dist/server/lib/incremental-cache/index.js\");\n/* harmony import */ var next_dist_server_lib_incremental_cache__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_incremental_cache__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _src_proxy_ts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./src/proxy.ts */ \"(middleware)/./src/proxy.ts\");\n/* harmony import */ var next_dist_client_components_is_next_router_error__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/dist/client/components/is-next-router-error */ \"(middleware)/./node_modules/next/dist/client/components/is-next-router-error.js\");\n/* harmony import */ var next_dist_client_components_is_next_router_error__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_components_is_next_router_error__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/dist/server/web/utils */ \"(middleware)/./node_modules/next/dist/server/web/utils.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\nconst incrementalCacheHandler = null\n// Import the userland code.\n;\n\n\n\nconst mod = {\n    ..._src_proxy_ts__WEBPACK_IMPORTED_MODULE_4__\n};\nconst page = \"/proxy\";\nconst isProxy = page === '/proxy' || page === '/src/proxy';\nconst handlerUserland = (isProxy ? mod.proxy : mod.middleware) || mod.default;\nclass ProxyMissingExportError extends Error {\n    constructor(message){\n        super(message);\n        Object.defineProperty(this, \"__NEXT_ERROR_CODE\", {\n            value: \"E394\",\n            enumerable: false,\n            configurable: true\n        });\n        // Stack isn't useful here, remove it considering it spams logs during development.\n        this.stack = '';\n    }\n}\n// TODO: This spams logs during development. Find a better way to handle this.\n// Removing this will spam \"fn is not a function\" logs which is worse.\nif (typeof handlerUserland !== 'function') {\n    throw new ProxyMissingExportError(`The ${isProxy ? 'Proxy' : 'Middleware'} file \"${page}\" must export a function named \\`${isProxy ? 'proxy' : 'middleware'}\\` or a default function.`);\n}\n// Proxy will only sent out the FetchEvent to next server,\n// so load instrumentation module here and track the error inside proxy module.\nfunction errorHandledHandler(fn) {\n    return async (...args)=>{\n        try {\n            return await fn(...args);\n        } catch (err) {\n            // In development, error the navigation API usage in runtime,\n            // since it's not allowed to be used in proxy as it's outside of react component tree.\n            if (true) {\n                if ((0,next_dist_client_components_is_next_router_error__WEBPACK_IMPORTED_MODULE_5__.isNextRouterError)(err)) {\n                    err.message = `Next.js navigation API is not allowed to be used in ${isProxy ? 'Proxy' : 'Middleware'}.`;\n                    throw err;\n                }\n            }\n            const req = args[0];\n            const url = new URL(req.url);\n            const resource = url.pathname + url.search;\n            await (0,next_dist_server_web_globals__WEBPACK_IMPORTED_MODULE_1__.edgeInstrumentationOnRequestError)(err, {\n                path: resource,\n                method: req.method,\n                headers: Object.fromEntries(req.headers.entries())\n            }, {\n                routerKind: 'Pages Router',\n                routePath: '/proxy',\n                routeType: 'proxy',\n                revalidateReason: undefined\n            });\n            throw err;\n        }\n    };\n}\nconst internalHandler = async (opts)=>{\n    if (true) {\n        var _opts_request_requestMeta, _opts_request_requestMeta1;\n        // This mirrors what `RouteModule#prepare` does for routes\n        // edge runtime handles loading instrumentation at the edge adapter level\n        const { join, relative } = __webpack_require__(/*! node:path */ \"node:path\");\n        const { ensureInstrumentationRegistered } = __webpack_require__(/*! next/dist/server/lib/router-utils/instrumentation-globals.external */ \"next/dist/server/lib/router-utils/instrumentation-globals.external\");\n        const absoluteProjectDir = join(/* turbopackIgnore: true */ process.cwd(), ((_opts_request_requestMeta = opts.request.requestMeta) == null ? void 0 : _opts_request_requestMeta.relativeProjectDir) || '');\n        const absoluteDistDir = (_opts_request_requestMeta1 = opts.request.requestMeta) == null ? void 0 : _opts_request_requestMeta1.distDir;\n        const distDir = absoluteDistDir ? relative(absoluteProjectDir, absoluteDistDir) : '.next';\n        await ensureInstrumentationRegistered(absoluteProjectDir, distDir);\n    }\n    return (0,next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_2__.adapter)({\n        ...opts,\n        IncrementalCache: next_dist_server_lib_incremental_cache__WEBPACK_IMPORTED_MODULE_3__.IncrementalCache,\n        incrementalCacheHandler,\n        page,\n        handler: errorHandledHandler(handlerUserland)\n    });\n};\nasync function handler(request, ctx) {\n    const result = await internalHandler({\n        request: {\n            url: request.url,\n            method: request.method,\n            headers: (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_6__.toNodeOutgoingHttpHeaders)(request.headers),\n            nextConfig: {\n                basePath: \"\",\n                i18n: \"\",\n                trailingSlash: Boolean(false),\n                experimental: {\n                    cacheLife: {\"default\":{\"stale\":300,\"revalidate\":900,\"expire\":4294967294},\"seconds\":{\"stale\":30,\"revalidate\":1,\"expire\":60},\"minutes\":{\"stale\":300,\"revalidate\":60,\"expire\":3600},\"hours\":{\"stale\":300,\"revalidate\":3600,\"expire\":86400},\"days\":{\"stale\":300,\"revalidate\":86400,\"expire\":604800},\"weeks\":{\"stale\":300,\"revalidate\":604800,\"expire\":2592000},\"max\":{\"stale\":300,\"revalidate\":2592000,\"expire\":31536000}},\n                    authInterrupts: Boolean(false),\n                    clientParamParsingOrigins: []\n                }\n            },\n            page: {\n                name: page\n            },\n            body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body ?? undefined : undefined,\n            waitUntil: ctx.waitUntil,\n            requestMeta: ctx.requestMeta,\n            signal: ctx.signal || new AbortController().signal\n        }\n    });\n    ctx.waitUntil == null ? void 0 : ctx.waitUntil.call(ctx, result.waitUntil);\n    return result.response;\n}\n// backwards compat for non-adapter setups\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (internalHandler);\n\n//# sourceMappingURL=middleware.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9idWlsZC93ZWJwYWNrL2xvYWRlcnMvbmV4dC1taWRkbGV3YXJlLWxvYWRlci5qcz9hYnNvbHV0ZVBhZ2VQYXRoPSUyRmhvbWUlMkZhaG1lZG1vZnRhaCUyRkRlc2t0b3AlMkZwcm9qZWN0cyUyRmVsZG9rYW5oJTJGc3JjJTJGcHJveHkudHMmcGFnZT0lMkZwcm94eSZyb290RGlyPSUyRmhvbWUlMkZhaG1lZG1vZnRhaCUyRkRlc2t0b3AlMkZwcm9qZWN0cyUyRmVsZG9rYW5oJm1hdGNoZXJzPSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBeUQ7QUFDbkI7QUFDaUI7QUFDbUI7QUFDMUU7QUFDQTtBQUNBLENBQXVDO0FBQzBDO0FBQ0k7QUFDZDtBQUN2RTtBQUNBLE9BQU8sMENBQUk7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLGtDQUFrQyxRQUFRLEtBQUssbUNBQW1DLGlDQUFpQztBQUNoSztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsZ0JBQWdCLElBQXFDO0FBQ3JELG9CQUFvQixtR0FBaUI7QUFDckMseUZBQXlGLGlDQUFpQztBQUMxSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsK0ZBQWlDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxJQUFtQztBQUMzQztBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCLEVBQUUsbUJBQU8sQ0FBQyw0QkFBVztBQUN0RCxnQkFBZ0Isa0NBQWtDLEVBQUUsbUJBQU8sQ0FBQyw4SUFBb0U7QUFDaEk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcscUVBQU87QUFDbEI7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxRkFBeUI7QUFDOUM7QUFDQSwwQkFBMEIsRUFBNEI7QUFDdEQsc0JBQXNCLEVBQThCO0FBQ3BELHVDQUF1QyxLQUFpQztBQUN4RTtBQUNBLCtCQUErQiwyWUFBNkI7QUFDNUQsNENBQTRDLEtBQStDO0FBQzNGLCtDQUErQyxFQUErQztBQUM5RjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxlQUFlLEVBQUM7O0FBRS9CIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwibmV4dC9kaXN0L2J1aWxkL2FkYXB0ZXIvc2V0dXAtbm9kZS1lbnYuZXh0ZXJuYWxcIjtcbmltcG9ydCBcIm5leHQvZGlzdC9zZXJ2ZXIvd2ViL2dsb2JhbHNcIjtcbmltcG9ydCB7IGFkYXB0ZXIgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci93ZWIvYWRhcHRlclwiO1xuaW1wb3J0IHsgSW5jcmVtZW50YWxDYWNoZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9pbmNyZW1lbnRhbC1jYWNoZVwiO1xuY29uc3QgaW5jcmVtZW50YWxDYWNoZUhhbmRsZXIgPSBudWxsXG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyBfbW9kIGZyb20gXCIuL3NyYy9wcm94eS50c1wiO1xuaW1wb3J0IHsgZWRnZUluc3RydW1lbnRhdGlvbk9uUmVxdWVzdEVycm9yIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvd2ViL2dsb2JhbHNcIjtcbmltcG9ydCB7IGlzTmV4dFJvdXRlckVycm9yIH0gZnJvbSBcIm5leHQvZGlzdC9jbGllbnQvY29tcG9uZW50cy9pcy1uZXh0LXJvdXRlci1lcnJvclwiO1xuaW1wb3J0IHsgdG9Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycyB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3dlYi91dGlsc1wiO1xuY29uc3QgbW9kID0ge1xuICAgIC4uLl9tb2Rcbn07XG5jb25zdCBwYWdlID0gXCIvcHJveHlcIjtcbmNvbnN0IGlzUHJveHkgPSBwYWdlID09PSAnL3Byb3h5JyB8fCBwYWdlID09PSAnL3NyYy9wcm94eSc7XG5jb25zdCBoYW5kbGVyVXNlcmxhbmQgPSAoaXNQcm94eSA/IG1vZC5wcm94eSA6IG1vZC5taWRkbGV3YXJlKSB8fCBtb2QuZGVmYXVsdDtcbmNsYXNzIFByb3h5TWlzc2luZ0V4cG9ydEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2Upe1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiX19ORVhUX0VSUk9SX0NPREVcIiwge1xuICAgICAgICAgICAgdmFsdWU6IFwiRTM5NFwiLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFN0YWNrIGlzbid0IHVzZWZ1bCBoZXJlLCByZW1vdmUgaXQgY29uc2lkZXJpbmcgaXQgc3BhbXMgbG9ncyBkdXJpbmcgZGV2ZWxvcG1lbnQuXG4gICAgICAgIHRoaXMuc3RhY2sgPSAnJztcbiAgICB9XG59XG4vLyBUT0RPOiBUaGlzIHNwYW1zIGxvZ3MgZHVyaW5nIGRldmVsb3BtZW50LiBGaW5kIGEgYmV0dGVyIHdheSB0byBoYW5kbGUgdGhpcy5cbi8vIFJlbW92aW5nIHRoaXMgd2lsbCBzcGFtIFwiZm4gaXMgbm90IGEgZnVuY3Rpb25cIiBsb2dzIHdoaWNoIGlzIHdvcnNlLlxuaWYgKHR5cGVvZiBoYW5kbGVyVXNlcmxhbmQgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgUHJveHlNaXNzaW5nRXhwb3J0RXJyb3IoYFRoZSAke2lzUHJveHkgPyAnUHJveHknIDogJ01pZGRsZXdhcmUnfSBmaWxlIFwiJHtwYWdlfVwiIG11c3QgZXhwb3J0IGEgZnVuY3Rpb24gbmFtZWQgXFxgJHtpc1Byb3h5ID8gJ3Byb3h5JyA6ICdtaWRkbGV3YXJlJ31cXGAgb3IgYSBkZWZhdWx0IGZ1bmN0aW9uLmApO1xufVxuLy8gUHJveHkgd2lsbCBvbmx5IHNlbnQgb3V0IHRoZSBGZXRjaEV2ZW50IHRvIG5leHQgc2VydmVyLFxuLy8gc28gbG9hZCBpbnN0cnVtZW50YXRpb24gbW9kdWxlIGhlcmUgYW5kIHRyYWNrIHRoZSBlcnJvciBpbnNpZGUgcHJveHkgbW9kdWxlLlxuZnVuY3Rpb24gZXJyb3JIYW5kbGVkSGFuZGxlcihmbikge1xuICAgIHJldHVybiBhc3luYyAoLi4uYXJncyk9PntcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBmbiguLi5hcmdzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBJbiBkZXZlbG9wbWVudCwgZXJyb3IgdGhlIG5hdmlnYXRpb24gQVBJIHVzYWdlIGluIHJ1bnRpbWUsXG4gICAgICAgICAgICAvLyBzaW5jZSBpdCdzIG5vdCBhbGxvd2VkIHRvIGJlIHVzZWQgaW4gcHJveHkgYXMgaXQncyBvdXRzaWRlIG9mIHJlYWN0IGNvbXBvbmVudCB0cmVlLlxuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNOZXh0Um91dGVyRXJyb3IoZXJyKSkge1xuICAgICAgICAgICAgICAgICAgICBlcnIubWVzc2FnZSA9IGBOZXh0LmpzIG5hdmlnYXRpb24gQVBJIGlzIG5vdCBhbGxvd2VkIHRvIGJlIHVzZWQgaW4gJHtpc1Byb3h5ID8gJ1Byb3h5JyA6ICdNaWRkbGV3YXJlJ30uYDtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IGFyZ3NbMF07XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlcS51cmwpO1xuICAgICAgICAgICAgY29uc3QgcmVzb3VyY2UgPSB1cmwucGF0aG5hbWUgKyB1cmwuc2VhcmNoO1xuICAgICAgICAgICAgYXdhaXQgZWRnZUluc3RydW1lbnRhdGlvbk9uUmVxdWVzdEVycm9yKGVyciwge1xuICAgICAgICAgICAgICAgIHBhdGg6IHJlc291cmNlLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogcmVxLm1ldGhvZCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBPYmplY3QuZnJvbUVudHJpZXMocmVxLmhlYWRlcnMuZW50cmllcygpKVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHJvdXRlcktpbmQ6ICdQYWdlcyBSb3V0ZXInLFxuICAgICAgICAgICAgICAgIHJvdXRlUGF0aDogJy9wcm94eScsXG4gICAgICAgICAgICAgICAgcm91dGVUeXBlOiAncHJveHknLFxuICAgICAgICAgICAgICAgIHJldmFsaWRhdGVSZWFzb246IHVuZGVmaW5lZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9O1xufVxuY29uc3QgaW50ZXJuYWxIYW5kbGVyID0gYXN5bmMgKG9wdHMpPT57XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5FWFRfUlVOVElNRSAhPT0gJ2VkZ2UnKSB7XG4gICAgICAgIHZhciBfb3B0c19yZXF1ZXN0X3JlcXVlc3RNZXRhLCBfb3B0c19yZXF1ZXN0X3JlcXVlc3RNZXRhMTtcbiAgICAgICAgLy8gVGhpcyBtaXJyb3JzIHdoYXQgYFJvdXRlTW9kdWxlI3ByZXBhcmVgIGRvZXMgZm9yIHJvdXRlc1xuICAgICAgICAvLyBlZGdlIHJ1bnRpbWUgaGFuZGxlcyBsb2FkaW5nIGluc3RydW1lbnRhdGlvbiBhdCB0aGUgZWRnZSBhZGFwdGVyIGxldmVsXG4gICAgICAgIGNvbnN0IHsgam9pbiwgcmVsYXRpdmUgfSA9IHJlcXVpcmUoJ25vZGU6cGF0aCcpO1xuICAgICAgICBjb25zdCB7IGVuc3VyZUluc3RydW1lbnRhdGlvblJlZ2lzdGVyZWQgfSA9IHJlcXVpcmUoXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9yb3V0ZXItdXRpbHMvaW5zdHJ1bWVudGF0aW9uLWdsb2JhbHMuZXh0ZXJuYWxcIik7XG4gICAgICAgIGNvbnN0IGFic29sdXRlUHJvamVjdERpciA9IGpvaW4oLyogdHVyYm9wYWNrSWdub3JlOiB0cnVlICovIHByb2Nlc3MuY3dkKCksICgoX29wdHNfcmVxdWVzdF9yZXF1ZXN0TWV0YSA9IG9wdHMucmVxdWVzdC5yZXF1ZXN0TWV0YSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9vcHRzX3JlcXVlc3RfcmVxdWVzdE1ldGEucmVsYXRpdmVQcm9qZWN0RGlyKSB8fCAnJyk7XG4gICAgICAgIGNvbnN0IGFic29sdXRlRGlzdERpciA9IChfb3B0c19yZXF1ZXN0X3JlcXVlc3RNZXRhMSA9IG9wdHMucmVxdWVzdC5yZXF1ZXN0TWV0YSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9vcHRzX3JlcXVlc3RfcmVxdWVzdE1ldGExLmRpc3REaXI7XG4gICAgICAgIGNvbnN0IGRpc3REaXIgPSBhYnNvbHV0ZURpc3REaXIgPyByZWxhdGl2ZShhYnNvbHV0ZVByb2plY3REaXIsIGFic29sdXRlRGlzdERpcikgOiAnLm5leHQnO1xuICAgICAgICBhd2FpdCBlbnN1cmVJbnN0cnVtZW50YXRpb25SZWdpc3RlcmVkKGFic29sdXRlUHJvamVjdERpciwgZGlzdERpcik7XG4gICAgfVxuICAgIHJldHVybiBhZGFwdGVyKHtcbiAgICAgICAgLi4ub3B0cyxcbiAgICAgICAgSW5jcmVtZW50YWxDYWNoZSxcbiAgICAgICAgaW5jcmVtZW50YWxDYWNoZUhhbmRsZXIsXG4gICAgICAgIHBhZ2UsXG4gICAgICAgIGhhbmRsZXI6IGVycm9ySGFuZGxlZEhhbmRsZXIoaGFuZGxlclVzZXJsYW5kKVxuICAgIH0pO1xufTtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcXVlc3QsIGN0eCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGludGVybmFsSGFuZGxlcih7XG4gICAgICAgIHJlcXVlc3Q6IHtcbiAgICAgICAgICAgIHVybDogcmVxdWVzdC51cmwsXG4gICAgICAgICAgICBtZXRob2Q6IHJlcXVlc3QubWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczogdG9Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycyhyZXF1ZXN0LmhlYWRlcnMpLFxuICAgICAgICAgICAgbmV4dENvbmZpZzoge1xuICAgICAgICAgICAgICAgIGJhc2VQYXRoOiBwcm9jZXNzLmVudi5fX05FWFRfQkFTRV9QQVRILFxuICAgICAgICAgICAgICAgIGkxOG46IHByb2Nlc3MuZW52Ll9fTkVYVF9JMThOX0NPTkZJRyxcbiAgICAgICAgICAgICAgICB0cmFpbGluZ1NsYXNoOiBCb29sZWFuKHByb2Nlc3MuZW52Ll9fTkVYVF9UUkFJTElOR19TTEFTSCksXG4gICAgICAgICAgICAgICAgZXhwZXJpbWVudGFsOiB7XG4gICAgICAgICAgICAgICAgICAgIGNhY2hlTGlmZTogcHJvY2Vzcy5lbnYuX19ORVhUX0NBQ0hFX0xJRkUsXG4gICAgICAgICAgICAgICAgICAgIGF1dGhJbnRlcnJ1cHRzOiBCb29sZWFuKHByb2Nlc3MuZW52Ll9fTkVYVF9FWFBFUklNRU5UQUxfQVVUSF9JTlRFUlJVUFRTKSxcbiAgICAgICAgICAgICAgICAgICAgY2xpZW50UGFyYW1QYXJzaW5nT3JpZ2luczogcHJvY2Vzcy5lbnYuX19ORVhUX0NMSUVOVF9QQVJBTV9QQVJTSU5HX09SSUdJTlNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFnZToge1xuICAgICAgICAgICAgICAgIG5hbWU6IHBhZ2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiByZXF1ZXN0Lm1ldGhvZCAhPT0gJ0dFVCcgJiYgcmVxdWVzdC5tZXRob2QgIT09ICdIRUFEJyA/IHJlcXVlc3QuYm9keSA/PyB1bmRlZmluZWQgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICB3YWl0VW50aWw6IGN0eC53YWl0VW50aWwsXG4gICAgICAgICAgICByZXF1ZXN0TWV0YTogY3R4LnJlcXVlc3RNZXRhLFxuICAgICAgICAgICAgc2lnbmFsOiBjdHguc2lnbmFsIHx8IG5ldyBBYm9ydENvbnRyb2xsZXIoKS5zaWduYWxcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGN0eC53YWl0VW50aWwgPT0gbnVsbCA/IHZvaWQgMCA6IGN0eC53YWl0VW50aWwuY2FsbChjdHgsIHJlc3VsdC53YWl0VW50aWwpO1xuICAgIHJldHVybiByZXN1bHQucmVzcG9uc2U7XG59XG4vLyBiYWNrd2FyZHMgY29tcGF0IGZvciBub24tYWRhcHRlciBzZXR1cHNcbmV4cG9ydCBkZWZhdWx0IGludGVybmFsSGFuZGxlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWlkZGxld2FyZS5qcy5tYXBcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(middleware)/./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=%2Fhome%2Fahmedmoftah%2FDesktop%2Fprojects%2Feldokanh%2Fsrc%2Fproxy.ts&page=%2Fproxy&rootDir=%2Fhome%2Fahmedmoftah%2FDesktop%2Fprojects%2Feldokanh&matchers=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(middleware)/./src/lib/admin/route-permissions.ts":
/*!********************************************!*\
  !*** ./src/lib/admin/route-permissions.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ROUTE_PERMISSIONS: () => (/* binding */ ROUTE_PERMISSIONS)\n/* harmony export */ });\n/* harmony import */ var _types_permissions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/types/permissions */ \"(middleware)/./src/types/permissions.ts\");\n\nconst ROUTE_PERMISSIONS = {\n    \"/admin/dashboard\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.DASHBOARD_VIEW,\n    \"/admin/products\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.PRODUCTS_MANAGE,\n    \"/admin/orders\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.ORDERS_MANAGE,\n    \"/admin/brands\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.BRANDS_MANAGE,\n    \"/admin/categories\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.CATEGORIES_MANAGE,\n    \"/admin/subcategories\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.CATEGORIES_MANAGE,\n    \"/admin/magazine\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.OFFERS_MANAGE,\n    \"/admin/contact\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.CONTACTS_MANAGE,\n    \"/admin/delivery\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.DELIVERY_MANAGE,\n    \"/admin/coupons\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.PROMO_CODES_MANAGE,\n    \"/admin/customers\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.USERS_MANAGE,\n    \"/admin/admins\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.ADMINS_MANAGE,\n    \"/admin/notifications\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.NOTIFICATIONS_SEND,\n    \"/admin/reports\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.REPORTS_MANAGE,\n    \"/admin/reports/categories\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.REPORTS_MANAGE,\n    \"/admin/reports/companies\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.REPORTS_MANAGE,\n    \"/admin/reports/all\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.REPORTS_MANAGE,\n    \"/admin/reports/orders\": _types_permissions__WEBPACK_IMPORTED_MODULE_0__.ADMIN_PERMISSIONS.REPORTS_MANAGE\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vc3JjL2xpYi9hZG1pbi9yb3V0ZS1wZXJtaXNzaW9ucy50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUF3RDtBQUVqRCxNQUFNQyxvQkFBNEM7SUFDdkQsb0JBQW9CRCxpRUFBaUJBLENBQUNFLGNBQWM7SUFDcEQsbUJBQW1CRixpRUFBaUJBLENBQUNHLGVBQWU7SUFDcEQsaUJBQWlCSCxpRUFBaUJBLENBQUNJLGFBQWE7SUFDaEQsaUJBQWlCSixpRUFBaUJBLENBQUNLLGFBQWE7SUFDaEQscUJBQXFCTCxpRUFBaUJBLENBQUNNLGlCQUFpQjtJQUN4RCx3QkFBd0JOLGlFQUFpQkEsQ0FBQ00saUJBQWlCO0lBQzNELG1CQUFtQk4saUVBQWlCQSxDQUFDTyxhQUFhO0lBQ2xELGtCQUFrQlAsaUVBQWlCQSxDQUFDUSxlQUFlO0lBQ25ELG1CQUFtQlIsaUVBQWlCQSxDQUFDUyxlQUFlO0lBQ3BELGtCQUFrQlQsaUVBQWlCQSxDQUFDVSxrQkFBa0I7SUFDdEQsb0JBQW9CVixpRUFBaUJBLENBQUNXLFlBQVk7SUFDbEQsaUJBQWlCWCxpRUFBaUJBLENBQUNZLGFBQWE7SUFDaEQsd0JBQXdCWixpRUFBaUJBLENBQUNhLGtCQUFrQjtJQUM1RCxrQkFBa0JiLGlFQUFpQkEsQ0FBQ2MsY0FBYztJQUNsRCw2QkFBNkJkLGlFQUFpQkEsQ0FBQ2MsY0FBYztJQUM3RCw0QkFBNEJkLGlFQUFpQkEsQ0FBQ2MsY0FBYztJQUM1RCxzQkFBc0JkLGlFQUFpQkEsQ0FBQ2MsY0FBYztJQUN0RCx5QkFBeUJkLGlFQUFpQkEsQ0FBQ2MsY0FBYztBQUMzRCxFQUFFIiwic291cmNlcyI6WyIvaG9tZS9haG1lZG1vZnRhaC9EZXNrdG9wL3Byb2plY3RzL2VsZG9rYW5oL3NyYy9saWIvYWRtaW4vcm91dGUtcGVybWlzc2lvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQURNSU5fUEVSTUlTU0lPTlMgfSBmcm9tIFwiQC90eXBlcy9wZXJtaXNzaW9uc1wiO1xuXG5leHBvcnQgY29uc3QgUk9VVEVfUEVSTUlTU0lPTlM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIFwiL2FkbWluL2Rhc2hib2FyZFwiOiBBRE1JTl9QRVJNSVNTSU9OUy5EQVNIQk9BUkRfVklFVyxcbiAgXCIvYWRtaW4vcHJvZHVjdHNcIjogQURNSU5fUEVSTUlTU0lPTlMuUFJPRFVDVFNfTUFOQUdFLFxuICBcIi9hZG1pbi9vcmRlcnNcIjogQURNSU5fUEVSTUlTU0lPTlMuT1JERVJTX01BTkFHRSxcbiAgXCIvYWRtaW4vYnJhbmRzXCI6IEFETUlOX1BFUk1JU1NJT05TLkJSQU5EU19NQU5BR0UsXG4gIFwiL2FkbWluL2NhdGVnb3JpZXNcIjogQURNSU5fUEVSTUlTU0lPTlMuQ0FURUdPUklFU19NQU5BR0UsXG4gIFwiL2FkbWluL3N1YmNhdGVnb3JpZXNcIjogQURNSU5fUEVSTUlTU0lPTlMuQ0FURUdPUklFU19NQU5BR0UsXG4gIFwiL2FkbWluL21hZ2F6aW5lXCI6IEFETUlOX1BFUk1JU1NJT05TLk9GRkVSU19NQU5BR0UsXG4gIFwiL2FkbWluL2NvbnRhY3RcIjogQURNSU5fUEVSTUlTU0lPTlMuQ09OVEFDVFNfTUFOQUdFLFxuICBcIi9hZG1pbi9kZWxpdmVyeVwiOiBBRE1JTl9QRVJNSVNTSU9OUy5ERUxJVkVSWV9NQU5BR0UsXG4gIFwiL2FkbWluL2NvdXBvbnNcIjogQURNSU5fUEVSTUlTU0lPTlMuUFJPTU9fQ09ERVNfTUFOQUdFLFxuICBcIi9hZG1pbi9jdXN0b21lcnNcIjogQURNSU5fUEVSTUlTU0lPTlMuVVNFUlNfTUFOQUdFLFxuICBcIi9hZG1pbi9hZG1pbnNcIjogQURNSU5fUEVSTUlTU0lPTlMuQURNSU5TX01BTkFHRSxcbiAgXCIvYWRtaW4vbm90aWZpY2F0aW9uc1wiOiBBRE1JTl9QRVJNSVNTSU9OUy5OT1RJRklDQVRJT05TX1NFTkQsXG4gIFwiL2FkbWluL3JlcG9ydHNcIjogQURNSU5fUEVSTUlTU0lPTlMuUkVQT1JUU19NQU5BR0UsXG4gIFwiL2FkbWluL3JlcG9ydHMvY2F0ZWdvcmllc1wiOiBBRE1JTl9QRVJNSVNTSU9OUy5SRVBPUlRTX01BTkFHRSxcbiAgXCIvYWRtaW4vcmVwb3J0cy9jb21wYW5pZXNcIjogQURNSU5fUEVSTUlTU0lPTlMuUkVQT1JUU19NQU5BR0UsXG4gIFwiL2FkbWluL3JlcG9ydHMvYWxsXCI6IEFETUlOX1BFUk1JU1NJT05TLlJFUE9SVFNfTUFOQUdFLFxuICBcIi9hZG1pbi9yZXBvcnRzL29yZGVyc1wiOiBBRE1JTl9QRVJNSVNTSU9OUy5SRVBPUlRTX01BTkFHRSxcbn07XG4iXSwibmFtZXMiOlsiQURNSU5fUEVSTUlTU0lPTlMiLCJST1VURV9QRVJNSVNTSU9OUyIsIkRBU0hCT0FSRF9WSUVXIiwiUFJPRFVDVFNfTUFOQUdFIiwiT1JERVJTX01BTkFHRSIsIkJSQU5EU19NQU5BR0UiLCJDQVRFR09SSUVTX01BTkFHRSIsIk9GRkVSU19NQU5BR0UiLCJDT05UQUNUU19NQU5BR0UiLCJERUxJVkVSWV9NQU5BR0UiLCJQUk9NT19DT0RFU19NQU5BR0UiLCJVU0VSU19NQU5BR0UiLCJBRE1JTlNfTUFOQUdFIiwiTk9USUZJQ0FUSU9OU19TRU5EIiwiUkVQT1JUU19NQU5BR0UiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(middleware)/./src/lib/admin/route-permissions.ts\n");

/***/ }),

/***/ "(middleware)/./src/proxy.ts":
/*!**********************!*\
  !*** ./src/proxy.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth_middleware__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/middleware */ \"(middleware)/./node_modules/next-auth/middleware.js\");\n/* harmony import */ var next_auth_middleware__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth_middleware__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(middleware)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_admin_route_permissions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/admin/route-permissions */ \"(middleware)/./src/lib/admin/route-permissions.ts\");\n/* harmony import */ var _types_permissions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types/permissions */ \"(middleware)/./src/types/permissions.ts\");\n\n\n\n\nconst ALLOWED_ORIGINS = [\n    \"http://localhost:3000\",\n    \"http://localhost:5173\",\n    \"http://localhost\",\n    \"capacitor://localhost\"\n];\nfunction applyCors(req, res) {\n    const origin = req.headers.get(\"origin\") || \"\";\n    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];\n    res.headers.set(\"Access-Control-Allow-Origin\", allowedOrigin);\n    res.headers.set(\"Access-Control-Allow-Methods\", \"GET,POST,PUT,DELETE,OPTIONS\");\n    res.headers.set(\"Access-Control-Allow-Headers\", \"Content-Type, Authorization\");\n    res.headers.set(\"Access-Control-Allow-Credentials\", \"true\");\n    return res;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_auth_middleware__WEBPACK_IMPORTED_MODULE_0__.withAuth)(function middleware(req) {\n    const { pathname } = req.nextUrl;\n    const token = req.nextauth.token;\n    if (req.method === \"OPTIONS\") {\n        return applyCors(req, new next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse(null, {\n            status: 204\n        }));\n    }\n    if (pathname.startsWith(\"/api/admin\")) {\n        if (!token) {\n            return applyCors(req, next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                message: \"Unauthorized\"\n            }, {\n                status: 401\n            }));\n        }\n        if (token.role !== \"admin\") {\n            return applyCors(req, next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                message: \"Forbidden\"\n            }, {\n                status: 403\n            }));\n        }\n        const userPermissions = token.permissions;\n        const isSuperAdmin = userPermissions === \"full\";\n        // Super Admin Restriction: Only Super Admin can delete orders\n        if (pathname.startsWith(\"/api/admin/orders\") && req.method === \"DELETE\") {\n            if (!isSuperAdmin) {\n                return applyCors(req, next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json({\n                    message: \"Only Super Admin can delete orders\"\n                }, {\n                    status: 403\n                }));\n            }\n        }\n    }\n    if (pathname.startsWith(\"/admin\") && pathname !== \"/admin/login\") {\n        if (token?.role !== \"admin\") {\n            return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.redirect(new URL(\"/\", req.url));\n        }\n        // Check granular permissions for admin pages\n        const userPermissions = token.permissions;\n        // Find the matching route permission\n        let requiredPermission;\n        const sortedRoutes = Object.keys(_lib_admin_route_permissions__WEBPACK_IMPORTED_MODULE_2__.ROUTE_PERMISSIONS).sort((a, b)=>b.length - a.length);\n        for (const route of sortedRoutes){\n            if (pathname === route || pathname.startsWith(route + \"/\")) {\n                requiredPermission = _lib_admin_route_permissions__WEBPACK_IMPORTED_MODULE_2__.ROUTE_PERMISSIONS[route];\n                break;\n            }\n        }\n        if (requiredPermission && !(0,_types_permissions__WEBPACK_IMPORTED_MODULE_3__.hasPermission)(userPermissions, requiredPermission)) {\n            // If they don't have permission for this specific page, redirect to dashboard\n            if (pathname !== \"/admin/dashboard\") {\n                return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.redirect(new URL(\"/admin/dashboard\", req.url));\n            }\n        }\n    }\n    return applyCors(req, next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.next());\n}, {\n    callbacks: {\n        authorized: ({ req, token })=>{\n            const { pathname } = req.nextUrl;\n            // Allow public API paths to bypass the middleware token check\n            if (pathname.startsWith(\"/api/\") && !pathname.startsWith(\"/api/admin\")) {\n                return true;\n            }\n            return !!token;\n        }\n    },\n    pages: {\n        signIn: \"/admin/login\"\n    }\n}));\nconst config = {\n    matcher: [\n        \"/admin/:path*\",\n        \"/api/((?!auth).*)\"\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVEsQ0FBQyxJQUFJQyxJQUFJLG9CQUFvQnZCLElBQUl3QixHQUFHO1lBQ2xFO1FBQ0Y7SUFDRjtJQUVBLE9BQU96QixVQUFVQyxLQUFLTCxxREFBWUEsQ0FBQ3VDLElBQUk7QUFDekMsR0FDQTtJQUNFQyxXQUFXO1FBQ1RDLFlBQVksQ0FBQyxFQUFFcEMsR0FBRyxFQUFFVyxLQUFLLEVBQUU7WUFDekIsTUFBTSxFQUFFRixRQUFRLEVBQUUsR0FBR1QsSUFBSVUsT0FBTztZQUNoQyw4REFBOEQ7WUFDOUQsSUFDRUQsU0FBU00sVUFBVSxDQUFDLFlBQ3BCLENBQUNOLFNBQVNNLFVBQVUsQ0FBQyxlQUNyQjtnQkFDQSxPQUFPO1lBQ1Q7WUFDQSxPQUFPLENBQUMsQ0FBQ0o7UUFDWDtJQUNGO0lBQ0EwQixPQUFPO1FBQ0xDLFFBQVE7SUFDVjtBQUNGLElBQ0E7QUFFSyxNQUFNQyxTQUFTO0lBQ3BCQyxTQUFTO1FBQ1A7UUFDQTtLQUNEO0FBQ0gsRUFBRSIsInNvdXJjZXMiOlsiL2hvbWUvYWhtZWRtb2Z0YWgvRGVza3RvcC9wcm9qZWN0cy9lbGRva2FuaC9zcmMvcHJveHkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgd2l0aEF1dGggfSBmcm9tIFwibmV4dC1hdXRoL21pZGRsZXdhcmVcIjtcbmltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgUk9VVEVfUEVSTUlTU0lPTlMgfSBmcm9tIFwiLi9saWIvYWRtaW4vcm91dGUtcGVybWlzc2lvbnNcIjtcbmltcG9ydCB7IGhhc1Blcm1pc3Npb24gfSBmcm9tIFwiLi90eXBlcy9wZXJtaXNzaW9uc1wiO1xuXG5jb25zdCBBTExPV0VEX09SSUdJTlMgPSBbXG4gIFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXG4gIFwiaHR0cDovL2xvY2FsaG9zdDo1MTczXCIsXG4gIFwiaHR0cDovL2xvY2FsaG9zdFwiLFxuICBcImNhcGFjaXRvcjovL2xvY2FsaG9zdFwiLFxuXTtcblxuZnVuY3Rpb24gYXBwbHlDb3JzKHJlcTogYW55LCByZXM6IE5leHRSZXNwb25zZSkge1xuICBjb25zdCBvcmlnaW4gPSByZXEuaGVhZGVycy5nZXQoXCJvcmlnaW5cIikgfHwgXCJcIjtcbiAgY29uc3QgYWxsb3dlZE9yaWdpbiA9IEFMTE9XRURfT1JJR0lOUy5pbmNsdWRlcyhvcmlnaW4pXG4gICAgPyBvcmlnaW5cbiAgICA6IEFMTE9XRURfT1JJR0lOU1swXTtcbiAgcmVzLmhlYWRlcnMuc2V0KFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIsIGFsbG93ZWRPcmlnaW4pO1xuICByZXMuaGVhZGVycy5zZXQoXG4gICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzXCIsXG4gICAgXCJHRVQsUE9TVCxQVVQsREVMRVRFLE9QVElPTlNcIixcbiAgKTtcbiAgcmVzLmhlYWRlcnMuc2V0KFxuICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiLFxuICAgIFwiQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uXCIsXG4gICk7XG4gIHJlcy5oZWFkZXJzLnNldChcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCIsIFwidHJ1ZVwiKTtcbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgd2l0aEF1dGgoXG4gIGZ1bmN0aW9uIG1pZGRsZXdhcmUocmVxKSB7XG4gICAgY29uc3QgeyBwYXRobmFtZSB9ID0gcmVxLm5leHRVcmw7XG4gICAgY29uc3QgdG9rZW4gPSByZXEubmV4dGF1dGgudG9rZW47XG5cbiAgICBpZiAocmVxLm1ldGhvZCA9PT0gXCJPUFRJT05TXCIpIHtcbiAgICAgIHJldHVybiBhcHBseUNvcnMocmVxLCBuZXcgTmV4dFJlc3BvbnNlKG51bGwsIHsgc3RhdHVzOiAyMDQgfSkpO1xuICAgIH1cblxuICAgIGlmIChwYXRobmFtZS5zdGFydHNXaXRoKFwiL2FwaS9hZG1pblwiKSkge1xuICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICByZXR1cm4gYXBwbHlDb3JzKFxuICAgICAgICAgIHJlcSxcbiAgICAgICAgICBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiVW5hdXRob3JpemVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmICh0b2tlbi5yb2xlICE9PSBcImFkbWluXCIpIHtcbiAgICAgICAgcmV0dXJuIGFwcGx5Q29ycyhcbiAgICAgICAgICByZXEsXG4gICAgICAgICAgTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiBcIkZvcmJpZGRlblwiIH0sIHsgc3RhdHVzOiA0MDMgfSksXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVzZXJQZXJtaXNzaW9ucyA9IHRva2VuLnBlcm1pc3Npb25zIGFzIHN0cmluZztcbiAgICAgIGNvbnN0IGlzU3VwZXJBZG1pbiA9IHVzZXJQZXJtaXNzaW9ucyA9PT0gXCJmdWxsXCI7XG5cbiAgICAgIC8vIFN1cGVyIEFkbWluIFJlc3RyaWN0aW9uOiBPbmx5IFN1cGVyIEFkbWluIGNhbiBkZWxldGUgb3JkZXJzXG4gICAgICBpZiAocGF0aG5hbWUuc3RhcnRzV2l0aChcIi9hcGkvYWRtaW4vb3JkZXJzXCIpICYmIHJlcS5tZXRob2QgPT09IFwiREVMRVRFXCIpIHtcbiAgICAgICAgaWYgKCFpc1N1cGVyQWRtaW4pIHtcbiAgICAgICAgICByZXR1cm4gYXBwbHlDb3JzKFxuICAgICAgICAgICAgcmVxLFxuICAgICAgICAgICAgTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgICAgICAgIHsgbWVzc2FnZTogXCJPbmx5IFN1cGVyIEFkbWluIGNhbiBkZWxldGUgb3JkZXJzXCIgfSxcbiAgICAgICAgICAgICAgeyBzdGF0dXM6IDQwMyB9LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhdGhuYW1lLnN0YXJ0c1dpdGgoXCIvYWRtaW5cIikgJiYgcGF0aG5hbWUgIT09IFwiL2FkbWluL2xvZ2luXCIpIHtcbiAgICAgIGlmICh0b2tlbj8ucm9sZSAhPT0gXCJhZG1pblwiKSB7XG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UucmVkaXJlY3QobmV3IFVSTChcIi9cIiwgcmVxLnVybCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBncmFudWxhciBwZXJtaXNzaW9ucyBmb3IgYWRtaW4gcGFnZXNcbiAgICAgIGNvbnN0IHVzZXJQZXJtaXNzaW9ucyA9IHRva2VuLnBlcm1pc3Npb25zIGFzIHN0cmluZztcblxuICAgICAgLy8gRmluZCB0aGUgbWF0Y2hpbmcgcm91dGUgcGVybWlzc2lvblxuICAgICAgbGV0IHJlcXVpcmVkUGVybWlzc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgY29uc3Qgc29ydGVkUm91dGVzID0gT2JqZWN0LmtleXMoUk9VVEVfUEVSTUlTU0lPTlMpLnNvcnQoXG4gICAgICAgIChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoLFxuICAgICAgKTtcblxuICAgICAgZm9yIChjb25zdCByb3V0ZSBvZiBzb3J0ZWRSb3V0ZXMpIHtcbiAgICAgICAgaWYgKHBhdGhuYW1lID09PSByb3V0ZSB8fCBwYXRobmFtZS5zdGFydHNXaXRoKHJvdXRlICsgXCIvXCIpKSB7XG4gICAgICAgICAgcmVxdWlyZWRQZXJtaXNzaW9uID0gUk9VVEVfUEVSTUlTU0lPTlNbcm91dGVdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgcmVxdWlyZWRQZXJtaXNzaW9uICYmXG4gICAgICAgICFoYXNQZXJtaXNzaW9uKHVzZXJQZXJtaXNzaW9ucywgcmVxdWlyZWRQZXJtaXNzaW9uIGFzIGFueSlcbiAgICAgICkge1xuICAgICAgICAvLyBJZiB0aGV5IGRvbid0IGhhdmUgcGVybWlzc2lvbiBmb3IgdGhpcyBzcGVjaWZpYyBwYWdlLCByZWRpcmVjdCB0byBkYXNoYm9hcmRcbiAgICAgICAgaWYgKHBhdGhuYW1lICE9PSBcIi9hZG1pbi9kYXNoYm9hcmRcIikge1xuICAgICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UucmVkaXJlY3QobmV3IFVSTChcIi9hZG1pbi9kYXNoYm9hcmRcIiwgcmVxLnVybCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFwcGx5Q29ycyhyZXEsIE5leHRSZXNwb25zZS5uZXh0KCkpO1xuICB9LFxuICB7XG4gICAgY2FsbGJhY2tzOiB7XG4gICAgICBhdXRob3JpemVkOiAoeyByZXEsIHRva2VuIH0pID0+IHtcbiAgICAgICAgY29uc3QgeyBwYXRobmFtZSB9ID0gcmVxLm5leHRVcmw7XG4gICAgICAgIC8vIEFsbG93IHB1YmxpYyBBUEkgcGF0aHMgdG8gYnlwYXNzIHRoZSBtaWRkbGV3YXJlIHRva2VuIGNoZWNrXG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYXRobmFtZS5zdGFydHNXaXRoKFwiL2FwaS9cIikgJiZcbiAgICAgICAgICAhcGF0aG5hbWUuc3RhcnRzV2l0aChcIi9hcGkvYWRtaW5cIilcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICEhdG9rZW47XG4gICAgICB9LFxuICAgIH0sXG4gICAgcGFnZXM6IHtcbiAgICAgIHNpZ25JbjogXCIvYWRtaW4vbG9naW5cIixcbiAgICB9LFxuICB9LFxuKTtcblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgbWF0Y2hlcjogW1xuICAgIFwiL2FkbWluLzpwYXRoKlwiLFxuICAgIFwiL2FwaS8oKD8hYXV0aCkuKilcIiwgLy8gbWF0Y2ggL2FwaS8qIGJ1dCBOT1QgL2FwaS9hdXRoLypcbiAgXSxcbn07XG4iXSwibmFtZXMiOlsid2l0aEF1dGgiLCJOZXh0UmVzcG9uc2UiLCJST1VURV9QRVJNSVNTSU9OUyIsImhhc1Blcm1pc3Npb24iLCJBTExPV0VEX09SSUdJTlMiLCJhcHBseUNvcnMiLCJyZXEiLCJyZXMiLCJvcmlnaW4iLCJoZWFkZXJzIiwiZ2V0IiwiYWxsb3dlZE9yaWdpbiIsImluY2x1ZGVzIiwic2V0IiwibWlkZGxld2FyZSIsInBhdGhuYW1lIiwibmV4dFVybCIsInRva2VuIiwibmV4dGF1dGgiLCJtZXRob2QiLCJzdGF0dXMiLCJzdGFydHNXaXRoIiwianNvbiIsIm1lc3NhZ2UiLCJyb2xlIiwidXNlclBlcm1pc3Npb25zIiwicGVybWlzc2lvbnMiLCJpc1N1cGVyQWRtaW4iLCJyZWRpcmVjdCIsIlVSTCIsInVybCIsInJlcXVpcmVkUGVybWlzc2lvbiIsInNvcnRlZFJvdXRlcyIsIk9iamVjdCIsImtleXMiLCJzb3J0IiwiYSIsImIiLCJsZW5ndGgiLCJyb3V0ZSIsIm5leHQiLCJjYWxsYmFja3MiLCJhdXRob3JpemVkIiwicGFnZXMiLCJzaWduSW4iLCJjb25maWciLCJtYXRjaGVyIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(middleware)/./src/proxy.ts\n");

/***/ }),

/***/ "(middleware)/./src/types/permissions.ts":
/*!**********************************!*\
  !*** ./src/types/permissions.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ADMIN_PERMISSIONS: () => (/* binding */ ADMIN_PERMISSIONS),\n/* harmony export */   PERMISSION_LABELS: () => (/* binding */ PERMISSION_LABELS),\n/* harmony export */   hasPermission: () => (/* binding */ hasPermission)\n/* harmony export */ });\nconst ADMIN_PERMISSIONS = {\n    DASHBOARD_VIEW: \"dashboard:view\",\n    PRODUCTS_MANAGE: \"products:manage\",\n    CATEGORIES_MANAGE: \"categories:manage\",\n    ORDERS_MANAGE: \"orders:manage\",\n    USERS_MANAGE: \"users:manage\",\n    ADMINS_MANAGE: \"admins:manage\",\n    BRANDS_MANAGE: \"brands:manage\",\n    PROMO_CODES_MANAGE: \"promo_codes:manage\",\n    STOCK_MANAGE: \"stock:manage\",\n    DELIVERY_MANAGE: \"delivery:manage\",\n    OFFERS_MANAGE: \"offers:manage\",\n    CONTACTS_MANAGE: \"contacts:manage\",\n    NOTIFICATIONS_SEND: \"notifications:send\",\n    REPORTS_MANAGE: \"reports:mange\"\n};\nconst PERMISSION_LABELS = {\n    [ADMIN_PERMISSIONS.DASHBOARD_VIEW]: \"عرض الإحصائيات\",\n    [ADMIN_PERMISSIONS.PRODUCTS_MANAGE]: \"إدارة المنتجات\",\n    [ADMIN_PERMISSIONS.CATEGORIES_MANAGE]: \"إدارة الأقسام\",\n    [ADMIN_PERMISSIONS.ORDERS_MANAGE]: \"إدارة الطلبات\",\n    [ADMIN_PERMISSIONS.USERS_MANAGE]: \"إدارة المستخدمين\",\n    [ADMIN_PERMISSIONS.ADMINS_MANAGE]: \"إدارة المشرفين\",\n    [ADMIN_PERMISSIONS.BRANDS_MANAGE]: \"إدارة البراندات\",\n    [ADMIN_PERMISSIONS.PROMO_CODES_MANAGE]: \"إدارة أكواد الخصم\",\n    [ADMIN_PERMISSIONS.STOCK_MANAGE]: \"إدارة المخزون\",\n    [ADMIN_PERMISSIONS.DELIVERY_MANAGE]: \"إدارة التوصيل\",\n    [ADMIN_PERMISSIONS.OFFERS_MANAGE]: \"إدارة العروض\",\n    [ADMIN_PERMISSIONS.CONTACTS_MANAGE]: \"إدارة الرسائل\",\n    [ADMIN_PERMISSIONS.NOTIFICATIONS_SEND]: \"إرسال إشعارات الزوار\",\n    [ADMIN_PERMISSIONS.REPORTS_MANAGE]: \"عرض التقارير\"\n};\nfunction hasPermission(userPermissions, permission) {\n    if (!userPermissions) return false;\n    const permissionsList = userPermissions.split(\",\").map((p)=>p.trim());\n    if (permissionsList.includes(\"full\")) return true;\n    return permissionsList.includes(permission);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vc3JjL3R5cGVzL3Blcm1pc3Npb25zLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFPLE1BQU1BLG9CQUFvQjtJQUMvQkMsZ0JBQWdCO0lBQ2hCQyxpQkFBaUI7SUFDakJDLG1CQUFtQjtJQUNuQkMsZUFBZTtJQUNmQyxjQUFjO0lBQ2RDLGVBQWU7SUFDZkMsZUFBZTtJQUNmQyxvQkFBb0I7SUFDcEJDLGNBQWM7SUFDZEMsaUJBQWlCO0lBQ2pCQyxlQUFlO0lBQ2ZDLGlCQUFpQjtJQUNqQkMsb0JBQW9CO0lBQ3BCQyxnQkFBZ0I7QUFDbEIsRUFBVztBQUtKLE1BQU1DLG9CQUFxRDtJQUNoRSxDQUFDZixrQkFBa0JDLGNBQWMsQ0FBQyxFQUFFO0lBQ3BDLENBQUNELGtCQUFrQkUsZUFBZSxDQUFDLEVBQUU7SUFDckMsQ0FBQ0Ysa0JBQWtCRyxpQkFBaUIsQ0FBQyxFQUFFO0lBQ3ZDLENBQUNILGtCQUFrQkksYUFBYSxDQUFDLEVBQUU7SUFDbkMsQ0FBQ0osa0JBQWtCSyxZQUFZLENBQUMsRUFBRTtJQUNsQyxDQUFDTCxrQkFBa0JNLGFBQWEsQ0FBQyxFQUFFO0lBQ25DLENBQUNOLGtCQUFrQk8sYUFBYSxDQUFDLEVBQUU7SUFDbkMsQ0FBQ1Asa0JBQWtCUSxrQkFBa0IsQ0FBQyxFQUFFO0lBQ3hDLENBQUNSLGtCQUFrQlMsWUFBWSxDQUFDLEVBQUU7SUFDbEMsQ0FBQ1Qsa0JBQWtCVSxlQUFlLENBQUMsRUFBRTtJQUNyQyxDQUFDVixrQkFBa0JXLGFBQWEsQ0FBQyxFQUFFO0lBQ25DLENBQUNYLGtCQUFrQlksZUFBZSxDQUFDLEVBQUU7SUFDckMsQ0FBQ1osa0JBQWtCYSxrQkFBa0IsQ0FBQyxFQUFFO0lBQ3hDLENBQUNiLGtCQUFrQmMsY0FBYyxDQUFDLEVBQUU7QUFDdEMsRUFBRTtBQUVLLFNBQVNFLGNBQ2RDLGVBQTBDLEVBQzFDQyxVQUEyQjtJQUUzQixJQUFJLENBQUNELGlCQUFpQixPQUFPO0lBRTdCLE1BQU1FLGtCQUFrQkYsZ0JBQWdCRyxLQUFLLENBQUMsS0FBS0MsR0FBRyxDQUFDLENBQUNDLElBQU1BLEVBQUVDLElBQUk7SUFFcEUsSUFBSUosZ0JBQWdCSyxRQUFRLENBQUMsU0FBUyxPQUFPO0lBRTdDLE9BQU9MLGdCQUFnQkssUUFBUSxDQUFDTjtBQUNsQyIsInNvdXJjZXMiOlsiL2hvbWUvYWhtZWRtb2Z0YWgvRGVza3RvcC9wcm9qZWN0cy9lbGRva2FuaC9zcmMvdHlwZXMvcGVybWlzc2lvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IEFETUlOX1BFUk1JU1NJT05TID0ge1xuICBEQVNIQk9BUkRfVklFVzogXCJkYXNoYm9hcmQ6dmlld1wiLFxuICBQUk9EVUNUU19NQU5BR0U6IFwicHJvZHVjdHM6bWFuYWdlXCIsXG4gIENBVEVHT1JJRVNfTUFOQUdFOiBcImNhdGVnb3JpZXM6bWFuYWdlXCIsXG4gIE9SREVSU19NQU5BR0U6IFwib3JkZXJzOm1hbmFnZVwiLFxuICBVU0VSU19NQU5BR0U6IFwidXNlcnM6bWFuYWdlXCIsXG4gIEFETUlOU19NQU5BR0U6IFwiYWRtaW5zOm1hbmFnZVwiLFxuICBCUkFORFNfTUFOQUdFOiBcImJyYW5kczptYW5hZ2VcIixcbiAgUFJPTU9fQ09ERVNfTUFOQUdFOiBcInByb21vX2NvZGVzOm1hbmFnZVwiLFxuICBTVE9DS19NQU5BR0U6IFwic3RvY2s6bWFuYWdlXCIsXG4gIERFTElWRVJZX01BTkFHRTogXCJkZWxpdmVyeTptYW5hZ2VcIixcbiAgT0ZGRVJTX01BTkFHRTogXCJvZmZlcnM6bWFuYWdlXCIsXG4gIENPTlRBQ1RTX01BTkFHRTogXCJjb250YWN0czptYW5hZ2VcIixcbiAgTk9USUZJQ0FUSU9OU19TRU5EOiBcIm5vdGlmaWNhdGlvbnM6c2VuZFwiLFxuICBSRVBPUlRTX01BTkFHRTogXCJyZXBvcnRzOm1hbmdlXCIsXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgdHlwZSBBZG1pblBlcm1pc3Npb24gPVxuICAodHlwZW9mIEFETUlOX1BFUk1JU1NJT05TKVtrZXlvZiB0eXBlb2YgQURNSU5fUEVSTUlTU0lPTlNdO1xuXG5leHBvcnQgY29uc3QgUEVSTUlTU0lPTl9MQUJFTFM6IFJlY29yZDxBZG1pblBlcm1pc3Npb24sIHN0cmluZz4gPSB7XG4gIFtBRE1JTl9QRVJNSVNTSU9OUy5EQVNIQk9BUkRfVklFV106IFwi2LnYsdi2INin2YTYpdit2LXYp9im2YrYp9iqXCIsXG4gIFtBRE1JTl9QRVJNSVNTSU9OUy5QUk9EVUNUU19NQU5BR0VdOiBcItil2K/Yp9ix2Kkg2KfZhNmF2YbYqtis2KfYqlwiLFxuICBbQURNSU5fUEVSTUlTU0lPTlMuQ0FURUdPUklFU19NQU5BR0VdOiBcItil2K/Yp9ix2Kkg2KfZhNij2YLYs9in2YVcIixcbiAgW0FETUlOX1BFUk1JU1NJT05TLk9SREVSU19NQU5BR0VdOiBcItil2K/Yp9ix2Kkg2KfZhNi32YTYqNin2KpcIixcbiAgW0FETUlOX1BFUk1JU1NJT05TLlVTRVJTX01BTkFHRV06IFwi2KXYr9in2LHYqSDYp9mE2YXYs9iq2K7Yr9mF2YrZhlwiLFxuICBbQURNSU5fUEVSTUlTU0lPTlMuQURNSU5TX01BTkFHRV06IFwi2KXYr9in2LHYqSDYp9mE2YXYtNix2YHZitmGXCIsXG4gIFtBRE1JTl9QRVJNSVNTSU9OUy5CUkFORFNfTUFOQUdFXTogXCLYpdiv2KfYsdipINin2YTYqNix2KfZhtiv2KfYqlwiLFxuICBbQURNSU5fUEVSTUlTU0lPTlMuUFJPTU9fQ09ERVNfTUFOQUdFXTogXCLYpdiv2KfYsdipINij2YPZiNin2K8g2KfZhNiu2LXZhVwiLFxuICBbQURNSU5fUEVSTUlTU0lPTlMuU1RPQ0tfTUFOQUdFXTogXCLYpdiv2KfYsdipINin2YTZhdiu2LLZiNmGXCIsXG4gIFtBRE1JTl9QRVJNSVNTSU9OUy5ERUxJVkVSWV9NQU5BR0VdOiBcItil2K/Yp9ix2Kkg2KfZhNiq2YjYtdmK2YRcIixcbiAgW0FETUlOX1BFUk1JU1NJT05TLk9GRkVSU19NQU5BR0VdOiBcItil2K/Yp9ix2Kkg2KfZhNi52LHZiNi2XCIsXG4gIFtBRE1JTl9QRVJNSVNTSU9OUy5DT05UQUNUU19NQU5BR0VdOiBcItil2K/Yp9ix2Kkg2KfZhNix2LPYp9im2YRcIixcbiAgW0FETUlOX1BFUk1JU1NJT05TLk5PVElGSUNBVElPTlNfU0VORF06IFwi2KXYsdiz2KfZhCDYpdi02LnYp9ix2KfYqiDYp9mE2LLZiNin2LFcIixcbiAgW0FETUlOX1BFUk1JU1NJT05TLlJFUE9SVFNfTUFOQUdFXTogXCLYudix2LYg2KfZhNiq2YLYp9ix2YrYsVwiLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1Blcm1pc3Npb24oXG4gIHVzZXJQZXJtaXNzaW9uczogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgcGVybWlzc2lvbjogQWRtaW5QZXJtaXNzaW9uLFxuKTogYm9vbGVhbiB7XG4gIGlmICghdXNlclBlcm1pc3Npb25zKSByZXR1cm4gZmFsc2U7XG5cbiAgY29uc3QgcGVybWlzc2lvbnNMaXN0ID0gdXNlclBlcm1pc3Npb25zLnNwbGl0KFwiLFwiKS5tYXAoKHApID0+IHAudHJpbSgpKTtcblxuICBpZiAocGVybWlzc2lvbnNMaXN0LmluY2x1ZGVzKFwiZnVsbFwiKSkgcmV0dXJuIHRydWU7XG5cbiAgcmV0dXJuIHBlcm1pc3Npb25zTGlzdC5pbmNsdWRlcyhwZXJtaXNzaW9uKTtcbn1cbiJdLCJuYW1lcyI6WyJBRE1JTl9QRVJNSVNTSU9OUyIsIkRBU0hCT0FSRF9WSUVXIiwiUFJPRFVDVFNfTUFOQUdFIiwiQ0FURUdPUklFU19NQU5BR0UiLCJPUkRFUlNfTUFOQUdFIiwiVVNFUlNfTUFOQUdFIiwiQURNSU5TX01BTkFHRSIsIkJSQU5EU19NQU5BR0UiLCJQUk9NT19DT0RFU19NQU5BR0UiLCJTVE9DS19NQU5BR0UiLCJERUxJVkVSWV9NQU5BR0UiLCJPRkZFUlNfTUFOQUdFIiwiQ09OVEFDVFNfTUFOQUdFIiwiTk9USUZJQ0FUSU9OU19TRU5EIiwiUkVQT1JUU19NQU5BR0UiLCJQRVJNSVNTSU9OX0xBQkVMUyIsImhhc1Blcm1pc3Npb24iLCJ1c2VyUGVybWlzc2lvbnMiLCJwZXJtaXNzaW9uIiwicGVybWlzc2lvbnNMaXN0Iiwic3BsaXQiLCJtYXAiLCJwIiwidHJpbSIsImluY2x1ZGVzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(middleware)/./src/types/permissions.ts\n");

/***/ }),

/***/ "../app-render/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/server/app-render/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/app-render/action-async-storage.external.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./memory-cache.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/lib/incremental-cache/memory-cache.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/lib/incremental-cache/memory-cache.external.js");

/***/ }),

/***/ "./runtime-reacts.external":
/*!**************************************************************!*\
  !*** external "next/dist/server/runtime-reacts.external.js" ***!
  \**************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/runtime-reacts.external.js");

/***/ }),

/***/ "./shared-cache-controls.external":
/*!*******************************************************************************************!*\
  !*** external "next/dist/server/lib/incremental-cache/shared-cache-controls.external.js" ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js");

/***/ }),

/***/ "./tags-manifest.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/lib/incremental-cache/tags-manifest.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/lib/incremental-cache/tags-manifest.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "next/dist/build/adapter/setup-node-env.external":
/*!******************************************************************!*\
  !*** external "next/dist/build/adapter/setup-node-env.external" ***!
  \******************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/build/adapter/setup-node-env.external");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/server/lib/router-utils/instrumentation-globals.external":
/*!*************************************************************************************!*\
  !*** external "next/dist/server/lib/router-utils/instrumentation-globals.external" ***!
  \*************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/lib/router-utils/instrumentation-globals.external");

/***/ }),

/***/ "node:async_hooks":
/*!***********************************!*\
  !*** external "node:async_hooks" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("node:async_hooks");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:path");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("./webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/@swc","vendor-chunks/uuid","vendor-chunks/@panva"], () => (__webpack_exec__("(middleware)/./node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=%2Fhome%2Fahmedmoftah%2FDesktop%2Fprojects%2Feldokanh%2Fsrc%2Fproxy.ts&page=%2Fproxy&rootDir=%2Fhome%2Fahmedmoftah%2FDesktop%2Fprojects%2Feldokanh&matchers=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();