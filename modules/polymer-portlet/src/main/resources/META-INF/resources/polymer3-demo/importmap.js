/**
 *    config to generate importmap.json and rewrite the JS imports from build/ folder into dist/ folder
 */
const importmap =
{
  imports:
  /**
   * the array traversed till find the first match of the path to "from" regEx or exact string
   * ( path is relative to build/ folder )
   *
   * "from" is a JS regular expression or a string,
   *    the actual values from name of module would be set in output to importmap.json
   * "to" is a value to be set against key above within importmap.json
   * keywords to be overridden:
   *    ${buildName} - the build target name, a build/ subfolder
   *    ${version} - module version from package-lock.json "dependencies" for current module( matching the folder )
   *    ${packageName} - package name from package-lock.json or package.json "name" for current module
   *    ${hash} - a hash for current file, has a sense as alternative for revision on module and buildName
   * ? how to inject full url from baseUrl and is it really needed?
   *
   * "domain" is used as name of subfolder in dist/ and could be used for deployment
   */
    [   {   from:  /node_modules\/(.+)\/(.+)\//         // i.e. @polymer/iron-ajax/
        ,   to : "/${buildName}/$1/$2@${version}/"      // i.e. /esm-unbundled/@polymer/app-layout@3.1.0
        ,   domain: "cdn.xml4jquery.com"                // output files will reside in build/cdn.xml4jquery.com
        }
    ,   {   from:   /node_modules\/(.+)\//              // modules without org, like lodash/
        ,   to:     "/${buildName}/$1@${version}/"      //    /esm-unbundled/lodash@4.17.15/
        ,   domain: "cdn.xml4jquery.com"
        }
    ,   {   from:  /(.+)\//         // everything else
        ,   to : "/${buildName}/"   // i.e. /esm-unbundled/
//      ,   to : "/${buildName}/{packageName}@{version}/"   // i.e. /esm-unbundled/@foo/polymer3-demo@0.1.0/
        ,   domain: "default"       // default name for domain
        }
    ,   {  from:    /node_modules\/@foo\/(.*\.)([^\/]+)/    // @foo module files
        ,   to :    "/${buildName}/@foo/$1.${hash}.$2"      // /esm-unbundled/@foo/main.3e6484ae5a646bd7c625 .js
        } // @foo does not use version and all its files are using hash instead
    ,   {   from:  /(.+)/           // everything else. "default" is
        ,   to : "/${buildName}/"   // i.e. /esm-unbundled/
//      ,   to : "/${buildName}/{packageName}@{version}/"   // i.e. /esm-unbundled/@foo/polymer3-demo@0.1.0/
        }
    ]
    // scopes: TBD
};
export default  importmap;