window.replainSettings = {
  id: 'f850a881-dab4-440e-81ea-0ea6dc705813'
};

// Match the widget document's color scheme so its transparent canvas stays clear.
var chatStyle = document.createElement('style');
chatStyle.textContent = '#__replain_widget_iframe { color-scheme: light; }';
document.head.appendChild(chatStyle);

(function (url) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = url;
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
})('https://widget.replain.cc/dist/client.js');
