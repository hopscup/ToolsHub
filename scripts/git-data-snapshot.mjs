import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {build} from 'esbuild';

// Read historical data without a checkout, a second node_modules or generated files.
export const createGitDataSnapshot = (revision, root = process.cwd()) => {
  const git = args => execFileSync('git', args, {cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024});
  const commit = git(['rev-parse', '--verify', revision + '^{commit}']).trim();
  const files = new Set(git(['ls-tree', '-r', '--name-only', commit]).trim().split('\n'));
  const cache = new Map();
  const read = file => {
    const relative = path.isAbsolute(file) ? path.relative(root, file).replaceAll('\\', '/') : file;
    if (!files.has(relative)) throw Error('Missing Git source: ' + relative + ' at ' + commit);
    if (!cache.has(relative)) cache.set(relative, git(['show', commit + ':' + relative]));
    return cache.get(relative);
  };
  const plugin = {
    name: 'git-data-snapshot',
    setup(builder) {
      builder.onResolve({filter: /^\./}, args => {
        const parent = args.namespace === 'git-data' ? path.posix.dirname(args.importer) : path.relative(root, args.resolveDir).replaceAll('\\', '/');
        const target = path.posix.normalize(path.posix.join(parent, args.path));
        const found = [target, target + '.js', target + '.json', target + '/index.js'].find(file => files.has(file));
        if (!found) throw Error('Cannot resolve Git data: ' + target);
        return {path: found, namespace: 'git-data'};
      });
      builder.onLoad({filter: /.*/, namespace: 'git-data'}, args => ({
        contents: read(args.path), loader: args.path.endsWith('.json') ? 'json' : 'js',
      }));
    },
  };
  const bundle = async contents => {
    const result = await build({stdin: {contents, resolveDir: root, loader: 'js'}, plugins: [plugin], bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent'});
    return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
  };
  return {commit, root, read, plugin, bundle};
};
