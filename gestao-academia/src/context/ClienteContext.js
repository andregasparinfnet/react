// Re-export the real implementation from the .jsx file (keeps imports stable for tests)
// Re-export the named implementations from the .jsx file (keeps imports stable for tests)
export { ClienteProvider, useClientes } from './ClienteContext.jsx';
// Note: ClienteContext.jsx does not export a default export, so we intentionally
// do not re-export a default here to avoid runtime import errors in the browser.
