define([
    'quark',
    'knockout'
], function($$, ko) {

    function <%- className %>() {
        var self = this;
<%
    if (outlet.length > 0) {
%>
        this.sendParameters = function(name) {
            switch(name) {
<%
        for (var i = 0; i < outlet.length; i++) {
%>                case "<%- outlet[i].name %>":
                    return {};
<%
        }
%>
            }
        }
<%
    }
%>
    }

    return <%- className %>;
});
