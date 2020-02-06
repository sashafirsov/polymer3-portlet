/**
 * process build/ folder content using importmap.js
 * output is generated to dist/ folder
 *
 * @type {{(options?: readPkg.NormalizeOptions): Promise<readPkg.NormalizedPackageJson>; (options: readPkg.Options): Promise<readPkg.PackageJson>; sync: {(options?: readPkg.NormalizeOptions): readPkg.NormalizedPackageJson; (options: readPkg.Options): readPkg.PackageJson}} | readPkg}
 */
import importmap from "./importmap.js";
import readPkg from 'read-pkg';
import  walk  from 'estree-walker';
import MagicString from 'magic-string';
import fs from 'fs';
import { lstatSync } from 'fs';
import glob from "glob";
const isDirectory = source => { try{ return lstatSync(source).isDirectory() }catch(_){} };

const readJson = fName => JSON.parse( fs.readFileSync(fName) );
const builds = readJson('polymer.json' ).builds || [];
const deps = readJson('package-lock.json' ).dependencies || {};
const pathMap = importmap.imports.filter( im=> (im.from+"").endsWith('\\//') )
,    filesMap = importmap.imports.filter( im=>!(im.from+"").endsWith('\\//') );
const path2im = {}
,     path2mod = {};
/**
 * 1. traverse over build/, get list of files.
 *      for each file:
 *      - define package+version  from package-lock, keep undefined if not found
 *      - assign target URL from importmap.js
 * 2. traverse over build/, get list of files.
 *      for each file:
 *      - get import path
 *      - resolve relative path to build/bundle/
 *      - replace URL to pathMap[path].to expression
 */

glob.sync( `build/*/` ).map( buildFolder=>
{
    const buildName = buildFolder.split('/').pop();
    glob.sync( `${buildFolder}/*` ).forEach( p=>process(p) );
    function process( path, module )
    {
        if( isDirectory(path) )
        {
            if( !module && path.startsWith(`${buildFolder}node_modules/`)  )
            {   let names = path.split('/');
                let mPath = names.pop();
                while( names.length )
                {   if( module = deps[mPath] )
                    {   module.name = mPath;
                        break;
                    }
                    let n = names.pop();
                    mPath = n+'/'+mPath;
                }
            }
            glob.sync( `${path}/*` ).forEach( p => process( p, module ) );
        }else
        {   if( module )
                path2mod[path] = module;
            const im = filesMap.find( im => im.from.test ? im.from.test( path ) : im.from == path );
            if ( !im )
                return;
            path2im[ path ] = im;
        }
    }
});


Object.keys(path2mod).map( p=>console.log(p, path2mod[p].name, path2mod[p].version ) )
if(0)
{






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

}

function getModuleByPath( path )
{
    return
}