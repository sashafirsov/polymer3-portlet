/**
 * process build/ folder content using importmap.js
 * output is generated to dist/ folder
 *
 */
import importmap from "./importmap.js";
import readPkg from 'read-pkg';
import  walk  from 'estree-walker';
import MagicString from 'magic-string';
import fs from 'fs';
import path from 'path';
import { lstatSync } from 'fs';
import glob from "glob";
import rimraf from "rimraf";

const isDirectory = source => { try{ return lstatSync(source).isDirectory() }catch(_){} };
const    readJson = fName => JSON.parse( fs.readFileSync(fName) );

const pkgLock = readJson('package-lock.json' ) || {}
,        deps = pkgLock.dependencies || {};
const pathMap = importmap.imports.filter( im=> (im.from+"").endsWith('\\//') )
,    filesMap = importmap.imports.filter( im=>!(im.from+"").endsWith('\\//') );
const path2im = {}
,    path2mod = {};
const   projModule = { name: pkgLock.name, version: pkgLock.version };
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
fs.readdirSync('build').forEach( bundleName =>
{
    const bundleFolder = `build/${bundleName}`;
    isDirectory( bundleFolder ) && fs.readdirSync( bundleFolder ).forEach( p => process( p ) );
    // glob.sync( `*`,{cwd:`./build/${bundleName}`} ).forEach( p => process( p ) );

    function process( relPath, module )
    {   const path=`${bundleFolder}/${relPath}`;
        if( isDirectory(path) )
        {
            if( !module && relPath.startsWith(`node_modules/`)  )
            {   let names = relPath.split('/');
                let mPath = names.pop();
                while( names.length )
                {   if( deps[mPath] )
                    {
                        const im = pathMap.find( im => im.from.test ? im.from.test( path+'/' ) : im.from === path );
                        module = { name: mPath, version: deps[mPath].version, relPath, ...im }
                        break;
                    }
                    let n = names.pop();
                    mPath = n+'/'+mPath;
                }
            }
            glob.sync( `${relPath}/*`,{cwd:`${bundleFolder}`} ).forEach( p => process( p, module ) );
        }else
        {   if( module )
                path2mod[path] = module;
            const im = filesMap.find( im => im.from.test ? im.from.test( path ) : im.from === path );
            if ( !im )
                return;
            path2im[ path ] = {...im, bundleName, relPath };
        }
    }
});


Object.keys(path2mod).map( p=>console.log(p, path2mod[p].name, path2mod[p].version ) );

const DIST='dist';
rimraf.sync(DIST);
mkDir( DIST );
glob.sync( 'build/**/*').forEach( move2dist );

function move2dist( path )
{
    const    m = path2mod[path] || projModule
    ,        i = path2im [path]
    ,        a = path.split('/')
    , fileName = a.pop();
    a.shift();// build folder
    const buildName = a.shift() || fileName;

    const modPath = a.join('/').replace(m.relPath,'') ;// path within module
    const dstDir = `${DIST}/${m.domain}/${buildName}/${m.name}@${m.version}${modPath}`;

    mkDir( dstDir );
    if( isDirectory(path) )
        return;
    if( i )
    {
        // read file
        // override imports
        // write file
        // console.log( i );
    }
    // if( isDirectory( path ) )
    //     return mkDir( path );
    // console.log( `cp( ${path} )` );

}
function mkDir( f ) {
    if( !isDirectory(f) )
        fs.mkdirSync( f, { recursive: true } );
}