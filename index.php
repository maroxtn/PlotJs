<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="UTF-8">
    <title>Plotjs by Abdesaslem</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="stylesheets/normalize.css" media="screen">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css" media="screen">
    <link rel="stylesheet" type="text/css" href="stylesheets/github-light.css" media="screen">
    <link type="text/css" rel="stylesheet" href="stylesheets/shCoreDefault.css"/>  
    <script type="text/javascript" src="js/shCore.js"></script>
    <script type="text/javascript" src="js/shBrushJScript.js"></script>
    <script src="plugin/plot.js"></script>
  </head>
  <body>
    <section class="page-header">
      <h1 class="project-name">Plotjs</h1>
      <h2 class="project-tagline">A lightweight JavaScript function plotter Plugin </h2>
      <a href="https://github.com/Abdesaslem/PlotJs/tarball/master" class="btn">Documentation</a>
      <a href="https://github.com/Abdesaslem/PlotJs" class="btn">View on GitHub</a>
      <a href="https://github.com/Abdesaslem/PlotJs/zipball/master" class="btn">Download .zip</a>
    </section>

    <section class="main-content">
      <h3>
<a id="welcome-to-github-pages" class="anchor" href="#welcome-to-github-pages" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>What is Plotjs ?</h3>
<?php echo 'kkk'; ?>
<p>Plotjs is a fully customizable and open source JavaScript plugin for plotting Math function, it may be useful either in educational or scientifical fields.</p>
<p>It is released under the GNU <a target="_blank" href="http://www.gnu.org/licenses/gpl-3.0.en.html">The GNU General Public License v3.0</a></p>
<b>Demo: </b>
<p>This is the plot of :  <pre>f(x) = sin(x)*5 ,  f(x) = 1/x and f(x) = x^2</pre></p>

<div id="canvas" height="600px" width="800px"></div>

<p>You can test it <a target="_blank" href="">here</a></p>
<p>For a <a target="_blank" href="demo.html"> full demo</a></p>

<h3>
<a id="designer-templates" class="anchor" href="#designer-templates" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>How to use it ?</h3>

<p>Using PlotJs is as simple as could it be, first of all link it to your code:</p>
<pre>&lt;script type=&quot;text/javascript&quot; src=&quot;plotjs.min.js&quot;&gt;&lt;/script&gt;</pre>
<p>The div which will contain the plane in it:</p>
<pre>&lt;div id=&quot;plot&quot;&gt;&lt;/div&gt;</pre>
<p><b>IMPORTANT:</b> the container should be a div</p>
<p>Then create the plane object and plot the function: </p>
<pre>var plane = new Plot({
    container: document.getElementById('plot')
});

//You can either write the function as a string or as a JavaScript function
plane.plot('sin(x)*5'); 
</pre>
<p>For the full usage see the <a href="">documentation</a></p>

<h3>
<a id="creating-pages-manually" class="anchor" href="#creating-pages-manually" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>How to format a function as string</h3>

<ul>
  <li>Any mathematical function such as <code>sin,cos,exp,log ....</code> parentheses are required or it will not be accepted</li>
  <li>The power: for example <code>X²</code> it shall be written like this : <code>X^2</code>, If you want the power of a combined number you shoud add parentheses <code>x^(1/x)</code></li>
  <li>The math function that currently are supported by PlotJs are: <code>sin,cos,tan,asin,acos,atan,abs,floor,ceil,exp,sqrt,max,min,sec,csc,
  cot,asec,acsc,ln,log,sinh,cosh,tanh,asinh,acosh,atanh,sech,csch,coth,asech,acsch,acoth</code></li>
</ul>

<h3>
<a id="authors-and-contributors" class="anchor" href="#authors-and-contributors" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Author</h3>

<a href="https://github.com/Abdesaslem" class="user-mention">@Abdessalem</a> 

<h3>
<a id="support-or-contact" class="anchor" href="#support-or-contact" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Support or Contact</h3>

<p>Having trouble with Pages? Check out our <a href="https://help.github.com/pages">documentation</a> or <a href="https://github.com/contact">contact support</a> and we’ll help you sort it out.</p>

      <footer class="site-footer">
        <span class="site-footer-owner"><a href="https://github.com/Abdesaslem/PlotJs">Plotjs</a> is maintained by <a href="https://github.com/Abdesaslem">Abdesaslem</a>.</span>
  </footer>

    </section>

  <script>
  
    
  var container = document.getElementById('canvas');

  var plane = new Plot({

    container: container,
    height: '400px',
    width: '800px', 
    min: -15,
    max: 15,  

  });

  plane.plot({

    equation: function(x){ return Math.sin(x) * 5; },
    borderColor: 'blue',
    borderThickness: 4

  });

  plane.plot({

    equation: function(x){ return 1/x; },
    borderColor: 'red',

  });

  plane.plot({

    equation: function(x){ return x*x; },
    borderColor: 'green'

  });

  </script>
  </body>
</html>