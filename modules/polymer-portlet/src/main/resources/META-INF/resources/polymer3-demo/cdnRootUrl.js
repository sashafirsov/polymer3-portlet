const readPkg = require('read-pkg');
const { walk } = require('estree-walker');
const MagicString = require('magic-string');
const fs = require('fs');
const { lstatSync } = require('fs')
const glob = require("glob");
const isDirectory = source => { try{ return lstatSync(source).isDirectory() }catch(_){} }

const readJson = fName => JSON.parse( fs.readFileSync(fName) );
const builds = readJson('polymer.json' ).builds || [];
const deps = readJson('package-lock.json' ).dependencies || [];
const mod2url = {};

builds.filter( b=>b.cdnRootUrl ).map( build =>
{
    const forEachMod = cb => Object.keys(deps).forEach( mod =>
    { const path = `build/${build.name}/node_modules/${mod}`;
        if( !isDirectory(path) )
            return;
        cb( mod, path )
    });

    forEachMod( (mod, path) =>
    {
        const modUrl = u => u && `${u}/${mod}@${deps[mod].version}/`;
        const url = modUrl( build.cdnRootUrl[mod] ) || modUrl(build.basePath ) || modUrl('./node_modules');
        mod2url[ mod ] = {url:url, path:`${path}@${deps[mod].version}` };
    });
    forEachMod( (mod, dir) =>
    {
        const dstPath = mod2url[mod].path;
        const modUrl = mod2url[mod].url;
        // console.log(mod+' | '+dstPath+' <> '+modUrl);
        const files = glob.sync( `${dir}/**/*` );
        files.map( f =>copyMap(mod,f)  );
    });


    // const files = glob.sync( `build/${build.name}/node_modules/**/*` );
    // files.map( f =>
    // {
    //     if( isDirectory(f) )
    //         console.log( f +"/");
    //     else
    //         console.log( f );
    // });
    // const modulesPath = `build/${build.name}/node_modules`;
    // fs.readdir( modulesPath, ( err, files )=>
    // {   files.filter( f=>build.cdnRootUrl[f] ).map( f=>
    //     {   const ver = getVersion( f );
    //         if( ver )
    //             applyVer( modulesPath,)
    //         console.log( f );
    //     });
    // });
});
function copyMap(mod, file)
{
    const dstPath = mod2url[mod].path;

    if( isDirectory( file ) )
    {   console.log( "+"+dstPath );
        return isDirectory( dstPath ) || fs.mkdirSync(dstPath);
    }
    console.log( '~'+file)
}
// const transform = (mod, version) => `${mod}@${version}` ;

const pkg = readPkg.sync(); //  let obj = ;

const cache = {};

function options(opts)
{
    let deps = (pkg && pkg.dependencies) || {};

    Object.keys(deps).forEach(dep => {
        const manifest = readPkg.sync( require.resolve(`${dep}/package.json`) );
        if (manifest.module) cache[manifest.name] = transform(manifest.name, manifest.version);
    });

    let external = Object.values(cache);
    if (Array.isArray(opts.external)) {
        external = Array.from(new Set(opts.external.concat(external)));
    }
    return Object.assign({}, opts, { external });
}

function transform(code, id)
{
    const ast = this.parse(code);
    const magicString = new MagicString(code);
    walk(ast, {
        enter(node, parent) {
            if (node.type === 'Literal' && parent.type === 'ImportDeclaration') {
                if (cache[node.value])
                    magicString.overwrite(node.start, node.end, padStr(cache[node.value]), {
                        storeName: false
                    });
                return node;
            }
        }
    });
    return {
        code: magicString.toString(),
        map: magicString.generateMap()
    };
}
