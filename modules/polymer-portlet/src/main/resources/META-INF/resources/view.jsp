<%@ include file="/init.jsp" %>
<%@ page import="com.liferay.portal.kernel.servlet.BrowserSnifferUtil" %>
<%@ page import="com.liferay.portal.kernel.util.SessionParamUtil" %>
<%@ page import="com.liferay.portal.kernel.theme.ThemeDisplay" %>
<%@ page import="com.liferay.portal.kernel.util.WebKeys" %>
<%
	String browser = BrowserSnifferUtil.getBrowserId(request);
	float version = BrowserSnifferUtil.getMajorVersion(request);
	boolean isWebkit = BrowserSnifferUtil.isWebKit(request);
	boolean isSafari = BrowserSnifferUtil.isSafari(request);
	boolean hasModule 	=  (  version >= 16   && BrowserSnifferUtil.isEdge		(request) )
						|| (  version >= 60   && BrowserSnifferUtil.isFirefox	(request) )
						|| (  version >= 61   && BrowserSnifferUtil.isChrome	(request) )
						|| (  version >= 11   && BrowserSnifferUtil.isSafari	(request) )
						|| (  version >= 48   && BrowserSnifferUtil.isOpera		(request) )
			;
	boolean hasWebComponent
						=  (  version >= 75   && BrowserSnifferUtil.isEdge		(request) )
						|| (  version >= 63   && BrowserSnifferUtil.isFirefox	(request) )
						|| (  version >= 67   && BrowserSnifferUtil.isChrome	(request) )
						|| (  version >= 12.1 && BrowserSnifferUtil.isSafari	(request) )
						|| (  version >= 58  && BrowserSnifferUtil.isOpera		(request) )
			;
	String jsProfile = (hasModule && hasWebComponent) ? "esm-bundled" : hasWebComponent? "es6-bundled": "es5-bundled";

	boolean themeJsFastLoad = SessionParamUtil.getBoolean( request, "js_fast_load", false );
	if( themeJsFastLoad && hasModule && hasWebComponent )
		jsProfile = "esm-unbundled";

jsProfile = "es6-bundled";


%>

<script src="<%= request.getContextPath() %>/js/main.js" type="text/javascript"></script>
<link href="<%= request.getContextPath() %>/css/main.css" rel="stylesheet">
<p class="polymer-portlet">
	<img  src="<%= request.getContextPath() %>/image/p-logo.svg" />
	<b><liferay-ui:message key="polymer.caption"/></b>
	<img  src="<%= request.getContextPath() %>/image/logoLiferay.svg" />
</p>
Browser: <%=browser%> <%=version%> <%=isWebkit?"Webkit":""%> <%=isSafari?"Safari":""%>
selected bundle: <%=jsProfile%>
<%
	String currentURL = themeDisplay.getURLCurrent();
%>
<%--<base href="<%=currentURL%>"/>--%>
<%--<jsp:include page="/polymer3-demo/build/${ jsProfile }/index.html" flush="true" />--%>
<%--<jsp:include page="/polymer3-demo/build/<%= jsProfile %>/index.html" flush="true" />--%>
<%--<jsp:include page="/polymer3-demo/build/esm-unbundled/index.html" />--%>
<%--
<% if("esm-unbundled".equals(jsProfile) ) { %>1
<jsp:include page="/polymer3-demo/build/esm-unbundled/index.html" />
<% }%>
<% if("esm-bundled".equals(jsProfile) ) { %>2
<jsp:include page="/polymer3-demo/build/esm-bundled/index.html" />
<% }%>
<% if("es6-bundled".equals(jsProfile) ) { %>3
<jsp:include page="/polymer3-demo/build/es6-bundled/index.html" />
<% }%>
<% if("es5-bundled".equals(jsProfile) ) { %>4
<jsp:include page="/polymer3-demo/build/es5-bundled/index.html" />
<% }%>
--%>
<%--<base href="<%=currentURL%>"/>--%>

<jsp:include page="/polymer3-demo/build/es6-bundled/index.jsp" />
