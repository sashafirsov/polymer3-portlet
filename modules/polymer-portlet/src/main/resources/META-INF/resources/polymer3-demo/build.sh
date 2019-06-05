polymer build
replacef(){
    replace-in-file "$1" "$2" "$3" --verbose --isRegex
}
applyRootPath(){
    rootPath="/o/polymer-portlet/polymer3-demo/build/$1/"
    # echo "========== rootPath: '${rootPath}'"
    indexHtml="build/$1/index.html"
    replacef "/\<base(.*?)\>/g" " "                                              $indexHtml
    replacef "/rootPath:(.*?)[\'\"]/[\'\"]/g" "rootPath: '${rootPath}'"          $indexHtml
    replacef "/[\'\"]service-worker.js[\'\"]/g" "'${rootPath}service-worker.js'" $indexHtml
    replacef "/src\=\"\.\//g" "src=\"${rootPath}"                                $indexHtml
    replacef "/define\(\[\'\.\//g" "define(['${rootPath}"                        $indexHtml
}

for D in ./build/*; do
    if [ -d "${D}" ]; then
        applyRootPath "${D##*/}"
    fi
done
