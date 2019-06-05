<%@ include file="/init.jsp" %>
<%@ page import="com.liferay.portal.kernel.servlet.BrowserSnifferUtil" %>
<%@ page import="com.liferay.portal.kernel.util.SessionParamUtil" %>
<%@ page import="com.liferay.portal.kernel.theme.ThemeDisplay" %>
<%@ page import="com.liferay.portal.kernel.util.WebKeys" %>
<%@ page import="com.liferay.portal.kernel.util.PortalUtil" %>
<%@ page import="com.liferay.portal.kernel.util.ParamUtil" %>
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

	boolean themeJsFastLoad = themeDisplay.isThemeJsFastLoad();// SessionParamUtil.getBoolean( request, "js_fast_load", false );
	if( !themeJsFastLoad && hasModule && hasWebComponent )
		jsProfile = "esm-unbundled";
//	HttpServletRequest sr = PortalUtil.getHttpServletRequest( themeDisplay.getportletRequest);
	String jsBundle = ParamUtil.getString(PortalUtil.getOriginalServletRequest(request), "jsBundle");
	if( null!= jsBundle && jsBundle.length()>0 )
		jsProfile = jsBundle;


%>

<script src="<%= request.getContextPath() %>/js/main.js" type="text/javascript"></script>
<link href="<%= request.getContextPath() %>/css/main.css" rel="stylesheet">
<p class="polymer-portlet">
	<img  src="<%= request.getContextPath() %>/image/p-logo.svg" />
	<b><liferay-ui:message key="polymer.caption"/></b>
	<img  src="<%= request.getContextPath() %>/image/logoLiferay.svg" />
</p>
Browser: <%=browser%> <%=version%> <%=isWebkit?"Webkit":""%> <%=isSafari?"Safari":""%> &bull;
Selected bundle: <b><%=jsProfile%></b>
| <a href="./?jsBundle=esm-unbundled">esm-unbundled</a>
| <a href="./?jsBundle=esm-bundled">esm-bundled</a>
| <a href="./?jsBundle=es6-bundled">es6-bundled</a>
| <a href="./?jsBundle=es5-bundled">es5-bundled</a>
&bull; Debug: <a href="./?js_fast_load=0&css_fast_load=0&strip=0">js_fast_load=0</a>
<%
	String currentURL = themeDisplay.getURLCurrent();
%>
<%--<base href="<%=currentURL%>"/>--%>
<%--<j sp:include page="/polymer3-demo/build/${ jsProfile }/index.html" flush="true" />--%>
<%--<j sp:include page="/polymer3-demo/build/<%= jsProfile %>/index.html" flush="true" />--%>

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
<%--<base href="<%=currentURL%>"/>--%>

<%--<jsp:include page="/polymer3-demo/build/es6-bundled/index.html" />--%>
