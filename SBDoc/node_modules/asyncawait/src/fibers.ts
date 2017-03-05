import Fiber = require('fibers');
export = result;


// HOTFIX for node-fibers problem.
// I have not prepared a repro unit test yet. In the meanwhile,
// here is the gist of the problem:

// A problem can occur if a node.js process has a node_modules tree that
// contains multiple copies of node-fibers, whether the same version or not.
// For instance, a project depends on two top-level modules which each
// depend on node-fibers, such that 'npm install' installs two copies of
// node-fibers. Furthermore, both of these copies are required() during execution.

// In this scenario, the expected control flow of the process can be corrupted.
// In one observed case, resuming a suspended fiber actually transfers control
// to the code encapsulated in a completely different fiber.

// The problem vanishes if we ensure that only one instance of node-fibers gets
// used throughout the process. The following lines do this by caching a
// node-fibers instance globally on first require(), and reusing that instance
// for all subsequent require()s.

// NB: This is a workaround, not a complete fix! If modules other than asyncawait
// use node-fibers, then the process may still end up using multiple instances of
// node-fibers during execution. This needs investigating in node-fibers itself.
// I intend to create a cut-down repro and raise an issue in the node-fibers project.

if (!global.asyncawait) global.asyncawait = {};
if (!global.asyncawait.Fiber) global.asyncawait.Fiber = Fiber;
var result: typeof Fiber = global.asyncawait.Fiber;
