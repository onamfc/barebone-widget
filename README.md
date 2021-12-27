# React Starter Widget
This project is a simple template for an embeddable React widget that can be inserted into a host website using a single &lt;script> tag. It supports JSX, CSS styles, and is compiled using Webpack into a single .js file which can be static-hosted.



# Overview
1. The widget is instantiated when the .js package is loaded
2. The host page supplies a **name** and a **targetElementId**
3. The widget registers a global object with the name supplied by the host page 
4. The widget renders the React component at the element specified by the host page
5. The host page can communicate with the widget via the global object


## Usage
1. Run **npm run build** to create the dist directory in the root directory
2. Create an index.html in the dist directory with the following code
```html
<html lang="en">
<head>
    <title>Client Website</title>
</head>
<script type="application/javascript">
    (function (w, d, s, o, f, js, fjs) {
        w['REACT-STARTER-WIDGET'] = o; w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
        js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
        js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
    }(window, document, 'script', 'reactstarterwidget', '/widget.js'));
    fundingoptimizer('init', { targetElementId: 'react-starter-widget-element', scriptToken:'6TeLy7qCOhoF3Y43ZVH38B934DrfENvkjtbeHWik'});
</script>
</html>
```

