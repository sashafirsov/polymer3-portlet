# polymer3-portlet
demo for polymer3 application integration into Liferay portlet

The project comprise the liferay workspace with portlet code in `modules/polymer-portlet`

# Setup & build

* prepare Liferay instance in `bundles/` folder by running `InitBundle` gradle task. 
In IntelliJ it is available in "Liferay" context menu on project level.

*  in `modules/polymer-portlet/src/main/resources/META-INF/resources/polymer3-demo` 
    * follow [README.md](modules/polymer-portlet/src/main/resources/META-INF/resources/polymer3-demo) "Setup" and "Build" instructions 
* run gradle `deploy` task
* run portal and insert into page `Polymer demo portlet` portlet
