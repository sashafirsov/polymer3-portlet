polymer build

applyRootPath(){
    echo "$1"
    rootPath="/o/polymer-portlet/polymer3-demo/build/$1/"
    indexHtml="build/$1/index.html"
    replace-in-file "/\<base(.*?)\>/g" " "                                  $indexHtml --verbose --isRegex
    replace-in-file "/rootPath:(.*?)[\'\"]/[\'\"]/g" "rootPath: '${rootPath}'"          $indexHtml --verbose --isRegex
    replace-in-file "/[\'\"]service-worker.js[\'\"]/g" "'${rootPath}service-worker.js'" $indexHtml --verbose --isRegex
    replace-in-file "/src\=\"\.\//g" "src=\"${rootPath}"                                $indexHtml --verbose --isRegex
    replace-in-file "/define\(\[\'\.\//g" "define(['${rootPath}"                        $indexHtml --verbose --isRegex
}

for D in ./build/*; do
    if [ -d "${D}" ]; then
        applyRootPath "${D##*/}"
    fi
done
