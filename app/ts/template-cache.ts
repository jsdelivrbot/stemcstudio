import * as angular from 'angular';
import app from './app';
app.run(['$templateCache', function($templateCache: angular.ITemplateCacheService) {

  'use strict';

  $templateCache.put('copy.html',
    "<div class='modal-content'>\n" +
    "  <div class='modal-header'>\n" +
    "      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden='true' ng-click='doCancel()'>&times;</button>\n" +
    "    <h3>Make Copy of Doodle \"{{template.description}}\"</h3>\n" +
    "  </div>\n" +
    "  <div class='modal-body'>\n" +
    "    <input type='text' ng-model='description' placeholder=\"Enter description\" autofocus/>\n" +
    "  </div>\n" +
    "  <div class='modal-footer'>\n" +
    "    <button class='btn btn-primary' ng-click='doOK()'>Copy doodle</button>\n" +
    "    <button class='btn' ng-click='doCancel()'>Cancel</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('doodle.html',
    "<div id='doodle-page'>\n" +
    "  <nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "    <div class='navbar-header'>\n" +
    "      <a role='button' class='navbar-brand' ng-click='goHome()'><md-logo-text/></a>\n" +
    "    </div>\n" +
    "    <div class='ignore-collapse ignore-navbar-collapse'>\n" +
    "      <ul class='nav navbar-nav'>\n" +
    "        <li ng-show='isEditMode'>\n" +
    "          <a role='button' ng-click='showCode()'>\n" +
    "            <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\" ng-show='isShowingCode'></span>\n" +
    "            Main\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li ng-show='isEditMode'>\n" +
    "          <a role='button' ng-click='showLibs()'>\n" +
    "            <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\" ng-show='isShowingLibs'></span>\n" +
    "            Libs\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li ng-show='isEditMode'>\n" +
    "          <a role='button' ng-click='showHTML()'>\n" +
    "            <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\" ng-show='isShowingHTML'></span>\n" +
    "            Html\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li ng-show='isEditMode'>\n" +
    "          <a role='button' ng-click='showLess()'>\n" +
    "            <span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\" ng-show='isShowingLess'></span>\n" +
    "            Style\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li ng-show='isEditMode'>\n" +
    "          <a role='button' ng-click='toggleView()' ng-show='isViewVisible'>\n" +
    "            <span class=\"glyphicon glyphicon-stop\" aria-hidden=\"true\" ng-show='isViewVisible'></span>\n" +
    "            Stop\n" +
    "          </a>\n" +
    "          <a role='button' ng-click='toggleView()' ng-hide='isViewVisible'>\n" +
    "            <span class=\"glyphicon glyphicon-play\" aria-hidden=\"true\" ng-hide='isViewVisible'></span>\n" +
    "            Play\n" +
    "          </a>\n" +
    "        </li>\n" +
    "        <li uib-dropdown ng-show='isEditMode'>\n" +
    "          <a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\">\n" +
    "            <span class=\"glyphicon glyphicon-hdd\" aria-hidden='true'></span>\n" +
    "            <span class='caret'></span>\n" +
    "          </a>\n" +
    "          <ul uib-dropdown-menu role=\"menu\">\n" +
    "            <li><a role='button' ng-click='doNew()'>New</a></li>\n" +
    "            <li><a role='button' ng-click='doOpen()'>Open</a></li>\n" +
    "            <li><a role='button' ng-click='doCopy()'>Copy</a></li>\n" +
    "            <li class='divider'></li>\n" +
    "            <li><a ng-click='doProperties()' role='button'>Properties</a></li>\n" +
    "          </ul>\n" +
    "        </li>\n" +
    "        <li uib-dropdown ng-show='isEditMode &amp;&amp; isLoggedIn()'>\n" +
    "          <a ng-show='isLoggedIn()' uib-dropdown-toggle role=\"button\" aria-expanded=\"false\">\n" +
    "            <span class=\"glyphicon glyphicon-cloud\" aria-hidden=\"true\"></span>\n" +
    "            <span class='caret' ng-show='isLoggedIn()'></span>\n" +
    "          </a>\n" +
    "          <ul uib-dropdown-menu role=\"menu\">\n" +
    "            <li>\n" +
    "              <a ng-click='clickDownload()' ng-show='isLoggedIn()' role='button'>\n" +
    "                <span class=\"glyphicon glyphicon-cloud-download\" aria-hidden=\"true\"></span>\n" +
    "                Download\n" +
    "              </a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "              <a ng-click='doUpload()' ng-show='isLoggedIn()' role='button'>\n" +
    "                <span class=\"glyphicon glyphicon-cloud-upload\" aria-hidden=\"true\"></span>\n" +
    "                Upload\n" +
    "              </a>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </nav>\n" +
    "  <div id='doodle-container'>\n" +
    "    <div id='editors' resizable r-directions=\"['right']\" r-flex='true'>\n" +
    "      <div id='html-editor' ng-show='isEditMode &amp;&amp; isShowingHTML'></div>\n" +
    "      <div id='code-editor' ng-show='isEditMode &amp;&amp; isShowingCode'></div>\n" +
    "      <div id='libs-editor' ng-show='isEditMode &amp;&amp; isShowingLibs'></div>\n" +
    "      <div id='less-editor' ng-show='isEditMode &amp;&amp; isShowingLess'></div>\n" +
    "    </div>\n" +
    "    <div id='preview'></div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('download.html',
    "<div class='modal-content'>\n" +
    "  <div class='modal-header'>\n" +
    "      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden='true' ng-click='doCancel()'>&times;</button>\n" +
    "    <h3>Download Doodle</h3>\n" +
    "  </div>\n" +
    "  <div class='modal-body'>\n" +
    "    <p ng-repeat='gist in gists track by gist.id'>\n" +
    "      <a ui-sref='gists({gistId: gist.id})'>{{gist.description}}</a>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <div class='modal-footer'>\n" +
    "    <button class='btn' ng-click='doCancel()'>Close</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('header.html',
    "<header>\n" +
    "  <h1>My Header<h1>\n" +
    "</header>"
  );


  $templateCache.put('home.html',
    "<header class='navbar navbar-static-top navbar-inverse md-docs-nav'>\n" +
    "  <div class='container'>\n" +
    "    <div class='navbar-header'>\n" +
    "      <button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar-header-collapse'>\n" +
    "        <span class=\"sr-only\">Toggle navigation</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "      <!--a class='navbar-brand'><md-logo-text/></a-->\n" +
    "    </div>\n" +
    "    <div class='collapse navbar-collapse' id='navbar-header-collapse'>\n" +
    "      <button type=\"button\" class=\"btn btn-primary navbar-btn\" ng-click='goDoodle()'>Doodle Now!</button>\n" +
    "      <button type=\"button\" class=\"btn btn-default navbar-btn\" ng-click='logout()' ng-show='isLoggedIn()'>Log out {{userLogin()}}</button>\n" +
    "      <button type=\"button\" class=\"btn btn-default navbar-btn\" ng-click='login()' ng-hide='isLoggedIn()'>Log In</button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</header>\n" +
    "\n" +
    "<div class='md-docs-header'>\n" +
    "  <div class='container'>\n" +
    "    <h1><md-logo-text/></h1>\n" +
    "    <p>\n" +
    "      Learning Mathematics and Geometric Physics<br/>through Computational Modeling.\n" +
    "    </p>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class='container md-docs-container'>\n" +
    "  <div class='row'>\n" +
    "    <div class='col-md-9' role='main'>\n" +
    "      <div class='md-docs-section'>\n" +
    "        <h1 id='overview' class='page-header'>\n" +
    "          MathDoodle Overview\n" +
    "        </h1>\n" +
    "        <p class='lead'>\n" +
    "          The principle behind MathDoodle is to provide a learning environment in which the student can verify personal understanding and conceptual models by constructing a working software model. This learning environment takes the form of a general-purpose software development environment optimized for Mathematics and Computer Graphics. Programming a computer, sometimes in collaboration with others, provides a non-threatening environment, clarifies understanding, challenges mastery, and motivates further exploration.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "      <div class='md-docs-section'>\n" +
    "        <h1 id='problem' class='page-header'>\n" +
    "          Motivation\n" +
    "        </h1>\n" +
    "        <p class='lead'>\n" +
    "          <ul>\n" +
    "            <li class='lead'>\n" +
    "            The importance of geometry to modern mathematics has grown over the last century but is not reflected in student course choices.\n" +
    "            </li>\n" +
    "            <li class='lead'>\n" +
    "            The Geometry curriculum of Euclid's elements and Descartes coordinates is obsolete, ineffective, and inefficient compared to modern approaches which unify algebra and geometry.\n" +
    "            </li>\n" +
    "            <li class='lead'>\n" +
    "            Mathematics and Physics courses under-utilize and misuse computers.\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "      <div class='md-docs-section'>\n" +
    "        <h1 id='manifesto' class='page-header'>\n" +
    "          Manifesto\n" +
    "        </h1>\n" +
    "        <p class='lead'>\n" +
    "          <ul>\n" +
    "            <li class='lead'>\n" +
    "            Rework the geometry curriculum around the modern mathematical notation of Geometric Algebra.\n" +
    "            </li>\n" +
    "            <li class='lead'>\n" +
    "            Ensure students learn a general purpose programming language so that they can use computers for truly active and constructive learning by programming Mathematics, Physics and Computer Graphics.\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "      <div class='md-docs-section'>\n" +
    "        <h1 id='features' class='page-header'>\n" +
    "          Features and Benefits of MathDoodle\n" +
    "        </h1>\n" +
    "        <p class='lead'>\n" +
    "          MathDoodle is unique among browser editing environments by being optimized for learning Mathematics and Geometry.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "          <dl>\n" +
    "            <dt>Code Editor and Preview in your browser</dt>\n" +
    "            <dd>\n" +
    "              No setup or installation required. Just use a compatible browser such as Chrome, Firefox or IE9.\n" +
    "            </dd>\n" +
    "            <dt>JavaScript, HTML, CSS</dt>\n" +
    "            <dd>\n" +
    "              Use the tools that are the bread-and-butter of a contemporary software developer.\n" +
    "              The modeling-development environment is general purpose and allows external libraries to be used and services to be called over the internet.\n" +
    "            </dd>\n" +
    "            <dt>TypeScript Language</dt>\n" +
    "            <dd>\n" +
    "              TypeScript is JavaScript with optional type information and features taken from future JavaScript releases.\n" +
    "              Using TypeScript provides intelligent checking and context-sensitive help, allowing the student to spend more time focusing on the task in hand instead of trying to find errors or lookup documentation.\n" +
    "            </dd>\n" +
    "            <dt>Local Caching</dt>\n" +
    "            <dd>\n" +
    "              Allows you to work even in situations with limited internet connectivity.\n" +
    "              Your work is automatically saved locally in the browser and can be uploaded when connectivity becomes available.\n" +
    "            </dd>\n" +
    "            <dt>Cloud Sharing</dt>\n" +
    "            <dd>\n" +
    "              Students and educators can store their work permanently in their personal and free GitHub account. Educators may use GitHub as a means to create and distribute assignments, while students may use GitHub to provide a permanent record of their work and as a means for sharing.\n" +
    "            </dd>\n" +
    "            <dt>Operator Overloading</dt>\n" +
    "            <dd>\n" +
    "              Operator Overloading is essential for making mathematical programming look natural\n" +
    "              when dealing with structured types such as vectors and matrices. MathDoodle supports a rich set of mathematical operators (useful for performing multivector analysis). In addition to the usual arithmetic operators, there is support for inner and outer products, as well as left and right contraction. These operators may be used with your own custom datatypes. Operator Overloading is optional.\n" +
    "            </dd>\n" +
    "            <dt>Geometric Algebra Library</dt>\n" +
    "            <dd>\n" +
    "              MathDoodle provides a library (davinci-eight a.k.a 'EIGHT') for perfoming Geometric Algebra computations in 2D and 3D Euclidean geometries.\n" +
    "            </dd>\n" +
    "            <dt>WebGL Mathematical Computer Graphics Library</dt>\n" +
    "            <dd>\n" +
    "              MathDoodle provides a library (davinci-eight a.k.a 'EIGHT') that helps to manage the complexity of WebGL shader programs rather than trying to hide it. This is important for high-performance graphics and mathematical flexibility.\n" +
    "            </dd>\n" +
    "            <dt>Units of Measure</dt>\n" +
    "            <dd>\n" +
    "              MathDoodle incorporates a library (davinci-eight a.k.a 'EIGHT') that combines geometric quantities with units to create measures. Students can explore dimensional analysis and the S.I. system of units. Calculations may be performed without units or by carrying through units.\n" +
    "            </dd>\n" +
    "          </dl>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class='md-docs-section'>\n" +
    "        <h1 id='curriculum' class='page-header'>\n" +
    "          A STEM Curriculum for the 21st Century\n" +
    "        </h1>\n" +
    "        <p class='lead'>\n" +
    "        Learning Geometric Algebra through Computational Modeling and Computer Graphics.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "        I am frequently asked whether there is a curriculum for learning Geometric Algebra\n" +
    "        at the middle and high-school level using MathDoodle to practice the concepts.\n" +
    "        To address this need I have created a blog in which I will capture a possible\n" +
    "        approach. I hope this will be a proving ground for developing a new curriculum.\n" +
    "        The <a href='http://www.geometricphysics.org'>Geometric Physics</a> blog will explain the pedagogic philosophy, incrementally develop the necessary mathematical theory for Geometric Algebra, provide the practical information for\n" +
    "        using MathDoodle and related technologies, and finally guide the student or\n" +
    "        educator in developing their own geometric numbers, computations and graphics.\n" +
    "        Once the necessary mathematical and computing infrastructure has been developed,\n" +
    "        it will be applied to understand the laws of Physics which are described geometrically.\n" +
    "        </p>\n" +
    "        <a href='http://www.geometricphysics.org'>Geometric Physics</a> Blog\n" +
    "        <p>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class='md-docs-section'>\n" +
    "        <h1 id='audience' class='page-header'>\n" +
    "          Audience\n" +
    "        </h1>\n" +
    "        <p class='lead'>\n" +
    "        MathDoodle is a general purpose mathematical tool for the scientific community.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "        MathDoodle was conceived to tackle the problem of learning geometry effectively, but\n" +
    "        its general purpose nature makes it useful to a much wider audience. At the youngest\n" +
    "        end of the spectrum it can be used as the first introduction to a grown-up programming\n" +
    "        language. In the middle of the spectrum the tool may be used for learning and experiencing mathematical geometry with the programming being second-nature. Educators may\n" +
    "        use MathDoodle for demonstration purposes or to set hands-on problems. Researchers may use the tool for convenient computation, exploring problems, or to present their work.\n" +
    "        </p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class='md-docs-section'>\n" +
    "        <h1 id='workshops' class='page-header'>\n" +
    "          Workshops\n" +
    "        </h1>\n" +
    "        <p class='lead'>\n" +
    "        Workshops are available for both students and educators and may be customized according to your needs.\n" +
    "        </p>\n" +
    "        <address>\n" +
    "          <strong>David Geo Holmes</strong><br/>\n" +
    "          <strong>david</strong>&nbsp;DOT&nbsp;<strong>geo</strong>&nbsp;DOT&nbsp;<strong>holmes</strong>&nbsp;AT&nbsp;<strong>gmail</strong>&nbsp;DOT&nbsp;<strong>com</strong><br/>\n" +
    "          (919)&nbsp;880-8589<br/>\n" +
    "        </address>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "<footer class='md-docs-footer' role='contentinfo'>\n" +
    "  <div class='container'>\n" +
    "    <!--\n" +
    "    <div class='md-docs-social'>\n" +
    "      <ul class='md-docs-social-buttons'>\n" +
    "        <li class='follow-btn'>\n" +
    "          <a class='twitter-follow-button'\n" +
    "            href='https://twitter.com/mathdoodle'>\n" +
    "            Follow @mathdoodle</a>\n" +
    "        </li>\n" +
    "        <li class='tweet-btn'>\n" +
    "          <a class='twitter-share-button'\n" +
    "            href='https://twitter.com/intent/tweet?text={{twitterShareText}}'>\n" +
    "            Tweet</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  -->\n" +
    "  </div>\n" +
    "</footer>"
  );


  $templateCache.put('login.html',
    "<h1>Login</h1>\n" +
    "<button ng-click=\"githubLogin()\">Login with GitHub - Really</button>"
  );


  $templateCache.put('md-logo-text.html',
    "<span class='md-logo-text-math'>math</span><span class='md-logo-text-doodle'>doodle</span><span class='md-logo-text-domain'>.io</span><span class='md-logo-text-version'><sup>βετα&nbsp;{{version}}</sup></span>"
  );


  $templateCache.put('new.html',
    "<div class='modal-content'>\n" +
    "  <div class='modal-header'>\n" +
    "      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden='true' ng-click='doCancel()'>&times;</button>\n" +
    "    <h3>Create a New Doodle</h3>\n" +
    "  </div>\n" +
    "  <div class='modal-body'>\n" +
    "    <input type='text' ng-model='description' placeholder=\"Enter description\" autofocus/>\n" +
    "    <label class='text-muted'>Template:</label>\n" +
    "    <select ng-model='template' ng-options='template.description for template in templates track by template.uuid'></select>\n" +
    "  </div>\n" +
    "  <div class='modal-footer'>\n" +
    "    <button class='btn btn-primary' ng-click='doOK()'>Create doodle</button>\n" +
    "    <button class='btn' ng-click='doCancel()'>Cancel</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('open.html',
    "<div class='modal-content'>\n" +
    "  <div class='modal-header'>\n" +
    "      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden='true' ng-click='doClose()'>&times;</button>\n" +
    "    <h3>Open Doodle</h3>\n" +
    "  </div>\n" +
    "  <div class='modal-body'>\n" +
    "    <p ng-repeat='doodle in doodles() track by doodle.uuid'>\n" +
    "      <a role='button' ng-click='doDelete(doodle.uuid)' class='delete'>&times;</a>\n" +
    "      <a role='button' ng-click='doOpen(doodle.uuid)'>{{doodle.description}}</a>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <div class='modal-footer'>\n" +
    "    <button class='btn' ng-click='doClose()'>Close</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('properties.html',
    "<div class=\"modal-content\">\n" +
    "  <div class=\"modal-header\">\n" +
    "      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden='true' ng-click='doCancel()'>&times;</button>\n" +
    "    <h3>Doodle Properties</h3>\n" +
    "  </div>\n" +
    "  <div class='modal-body'>\n" +
    "    <label>Description</label>\n" +
    "    <input type='text' ng-model='zombie.description' placeholder=\"Enter description\" autofocus/>\n" +
    "    <br/>\n" +
    "    <label class='checkbox-inline'>\n" +
    "      <input type='checkbox' ng-model='zombie.operatorOverloading'>Operator Overloading</input>\n" +
    "    </label>\n" +
    "    <h4>Dependencies</h4>\n" +
    "    <table>\n" +
    "      <tbody>\n" +
    "        <tr ng-repeat='option in options track by option.name'>\n" +
    "          <td>\n" +
    "            <label class='checkbox-inline'>\n" +
    "              <input type='checkbox' ng-checked='zombie.dependencies.indexOf(option.name) > -1' ng-click='toggleDependency(option.name)'>{{option.moniker}}</input>\n" +
    "              </label>\n" +
    "          </td>\n" +
    "          <td>{{option.description}}</td>\n" +
    "          <td>{{option.version}}</td>\n" +
    "          <td><a href='{{option.homepage}}' target='_blank'>{{option.homepage}}</a></td>\n" +
    "        </tr>\n" +
    "      </tbody>\n" +
    "    </table>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\" style=\"display: block;\">\n" +
    "    <button class='btn btn-primary' ng-click='doOK()'>OK</button>\n" +
    "    <button class='btn' ng-click='doCancel()'>Cancel</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
