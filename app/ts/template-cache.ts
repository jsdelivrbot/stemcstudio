//
// GENERATED FILE
//
import { ITemplateCacheService } from 'angular';
export function templateCache($templateCache: ITemplateCacheService) {

  'use strict';

  $templateCache.put('about.html',
    "<div id='about-page'>\n" +
    "    <nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "        <div class='container-fluid'>\n" +
    "            <div class='navbar-header'>\n" +
    "                <a role='button' class='navbar-brand' ng-click='goHome()'>\n" +
    "                    <brand />\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div class='md-docs-header'>\n" +
    "        <div class='container'>\n" +
    "            <h1>\n" +
    "                <logo-text version='{{version}}' />\n" +
    "            </h1>\n" +
    "            <p>\n" +
    "                Learning STEM through Computational Modeling.\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class='container md-docs-container'>\n" +
    "        <div class='row'>\n" +
    "            <div class='col-md-9' role='main'>\n" +
    "                <div class='md-docs-section'>\n" +
    "                    <h1 id='overview' class='page-header'>STEMCstudio Overview</h1>\n" +
    "                    <p class='lead'>\n" +
    "                        The principle behind STEMCstudio is to provide a learning environment in which the student can verify personal understanding\n" +
    "                        and conceptual models by constructing a working software model. This learning environment takes the\n" +
    "                        form of a general-purpose software development environment optimized for Mathematics and Computer\n" +
    "                        Graphics. Programming a computer, sometimes in collaboration with others, provides a non-threatening\n" +
    "                        environment, clarifies understanding, challenges mastery, and motivates further exploration.\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class='md-docs-section'>\n" +
    "                    <h1 id='problem' class='page-header'>Motivation</h1>\n" +
    "                    <p class='lead'>\n" +
    "                        <ul>\n" +
    "                            <li class='lead'>\n" +
    "                                The importance of geometry to modern mathematics has grown over the last century but is not reflected in student course choices.\n" +
    "                            </li>\n" +
    "                            <li class='lead'>\n" +
    "                                The Geometry curriculum of Euclid's elements and Descartes coordinates is obsolete, ineffective, and inefficient compared\n" +
    "                                to modern approaches which unify algebra and geometry.\n" +
    "                            </li>\n" +
    "                            <li class='lead'>\n" +
    "                                Mathematics and Physics courses under-utilize and misuse computers.\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class='md-docs-section'>\n" +
    "                    <h1 id='manifesto' class='page-header'>Manifesto</h1>\n" +
    "                    <p class='lead'>\n" +
    "                        <ul>\n" +
    "                            <li class='lead'>\n" +
    "                                Rework the geometry curriculum around the modern mathematical notation of Geometric Algebra.\n" +
    "                            </li>\n" +
    "                            <li class='lead'>\n" +
    "                                Ensure students learn a general purpose programming language so that they can use computers for truly active and constructive\n" +
    "                                learning by programming Mathematics, Physics and Computer Graphics.\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class='md-docs-section'>\n" +
    "                    <h1 id='features' class='page-header'>Features and Benefits of STEMCstudio</h1>\n" +
    "                    <p class='lead'>\n" +
    "                        STEMCstudio is unique among browser editing environments by being optimized for learning Mathematics and Geometry.\n" +
    "                    </p>\n" +
    "                    <p>\n" +
    "                        <dl>\n" +
    "                            <dt>Code Editor and Preview in your browser</dt>\n" +
    "                            <dd>\n" +
    "                                No setup or installation required. Just use a compatible browser such as Chrome, Firefox or IE9.\n" +
    "                            </dd>\n" +
    "                            <dt>JavaScript, HTML, CSS</dt>\n" +
    "                            <dd>\n" +
    "                                Use the tools that are the bread-and-butter of a contemporary software developer. The modeling-development environment is\n" +
    "                                general purpose and allows external libraries to be used and services to be called over the\n" +
    "                                internet.\n" +
    "                            </dd>\n" +
    "                            <dt>TypeScript Language</dt>\n" +
    "                            <dd>\n" +
    "                                TypeScript is JavaScript with optional type information and features taken from future JavaScript releases. Using TypeScript\n" +
    "                                provides intelligent checking and context-sensitive help, allowing the student to spend more\n" +
    "                                time focusing on the task in hand instead of trying to find errors or lookup documentation.\n" +
    "                            </dd>\n" +
    "                            <dt>Local Caching</dt>\n" +
    "                            <dd>\n" +
    "                                Allows you to work even in situations with limited internet connectivity. Your work is automatically saved locally in the\n" +
    "                                browser and can be uploaded when connectivity becomes available.\n" +
    "                            </dd>\n" +
    "                            <dt>Cloud Sharing</dt>\n" +
    "                            <dd>\n" +
    "                                Students and educators can store their work permanently in their personal and free GitHub account. Educators may use GitHub\n" +
    "                                as a means to create and distribute assignments, while students may use GitHub to provide\n" +
    "                                a permanent record of their work and as a means for sharing.\n" +
    "                            </dd>\n" +
    "                            <dt>Operator Overloading</dt>\n" +
    "                            <dd>\n" +
    "                                Operator Overloading is essential for making mathematical programming look natural when dealing with structured types such\n" +
    "                                as vectors and matrices. STEMCstudio supports a rich set of mathematical operators (useful\n" +
    "                                for performing multivector analysis). In addition to the usual arithmetic operators, there\n" +
    "                                is support for inner and outer products, as well as left and right contraction. These operators\n" +
    "                                may be used with your own custom datatypes. Operator Overloading is optional.\n" +
    "                            </dd>\n" +
    "                            <dt>VPython-like capability</dt>\n" +
    "                            <dd>\n" +
    "                                VPython creates a simple programming experience by using a high-level graphics library called <i>visual</i>.\n" +
    "                                STEMCstudio achieves the same degree of simplicity through a library called <i>EIGHT</i>.\n" +
    "                                The graphics abstractions in this library are similar to the popular 3D WebGL library called\n" +
    "                                <i>THREE</i>. The name EIGHT alludes to 2<sup>3</sup>, which is the number of basis elements\n" +
    "                                in the corresponding geometric space.\n" +
    "                            </dd>\n" +
    "                            <dt>Geometric Algebra Library</dt>\n" +
    "                            <dd>\n" +
    "                                STEMCstudio provides a library, <i>EIGHT</i> for performing Geometric Algebra computations\n" +
    "                                in 2D and 3D Euclidean geometries.\n" +
    "                            </dd>\n" +
    "                            <dt>WebGL Mathematical Computer Graphics Library</dt>\n" +
    "                            <dd>\n" +
    "                                STEMCstudio provides a library <i>EIGHT</i> that helps to manage the complexity of WebGL\n" +
    "                                shader programs rather than trying to hide it. This is important for high-performance graphics\n" +
    "                                and mathematical flexibility.\n" +
    "                            </dd>\n" +
    "                            <dt>Units of Measure</dt>\n" +
    "                            <dd>\n" +
    "                                STEMCstudio incorporates a library <i>EIGHT</i> that combines geometric quantities with units\n" +
    "                                to create measures. Students can explore dimensional analysis and the S.I. system of units.\n" +
    "                                Calculations may be performed without units or by carrying through units.\n" +
    "                            </dd>\n" +
    "                            <dt>ES6 Modules</dt>\n" +
    "                            <dd>\n" +
    "                                Even small authentic problems can require hundreds or thousands of lines of code. Professionals avoid the comprehension issues\n" +
    "                                inherent in large monolithic code bases by employing modular decomposition. STEMCstudio allows\n" +
    "                                you to break down your application into multiple re-usable files, and re-compose them automatically\n" +
    "                                into an application through the ES6 module loader.\n" +
    "                            </dd>\n" +
    "                            <dt>Unit Testing</dt>\n" +
    "                            <dd>\n" +
    "                                A unit testing framework enables the practice of test-driven development. It also ensures that the critical parts of your\n" +
    "                                code work according to specifications. Automated unit testing is supported through the popular\n" +
    "                                Jasmine framework and an HTML reporter. This allows you to run repeatable test on your code\n" +
    "                                and see the results in the browser.\n" +
    "                            </dd>\n" +
    "                            <dt>\n" +
    "                                README Documentation and LATEX support.\n" +
    "                            </dt>\n" +
    "                            <dd>\n" +
    "                                A README (Markdown) file is an invaluable adjunct to any coding project. It may describe any aspect of the project and is\n" +
    "                                a standard file in a GitHub repository. STEMCstudio supports the README markdown file format\n" +
    "                                and performs automatic real-time translation to HTML in the browser. Additionally, STEMCstudio\n" +
    "                                supports mathematical LATEX markup using MathJax.\n" +
    "                            </dd>\n" +
    "                        </dl>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class='md-docs-section'>\n" +
    "                    <h1 id='curriculum' class='page-header'>A STEM Curriculum for the 21st Century</h1>\n" +
    "                    <p class='lead'>\n" +
    "                        Learning STEM through Computational Modeling.\n" +
    "                    </p>\n" +
    "                    <p>\n" +
    "                        I am frequently asked whether there is a curriculum for learning Geometric Algebra at the middle and high-school level using\n" +
    "                        STEMCstudio to practice the concepts. To address this need I have created a blog in which I will\n" +
    "                        capture a possible approach. I hope this will be a proving ground for developing a new curriculum.\n" +
    "                        The\n" +
    "                        <a href='http://www.geometricphysics.org'>Geometric Physics</a> blog will explain the pedagogic philosophy,\n" +
    "                        incrementally develop the necessary mathematical theory for Geometric Algebra, provide the practical\n" +
    "                        information for using STEMCstudio and related technologies, and finally guide the student or educator\n" +
    "                        in developing their own geometric numbers, computations and graphics. Once the necessary mathematical\n" +
    "                        and computing infrastructure has been developed, it will be applied to understand the laws of Physics\n" +
    "                        which are described geometrically.\n" +
    "                    </p>\n" +
    "                    <a href='http://www.geometricphysics.org'>Geometric Physics</a> Blog\n" +
    "                    <p>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class='md-docs-section'>\n" +
    "                    <h1 id='audience' class='page-header'>Audience</h1>\n" +
    "                    <p class='lead'>\n" +
    "                        STEMCstudio is a general purpose cognitive tool for the scientific community.\n" +
    "                    </p>\n" +
    "                    <p>\n" +
    "                        STEMCstudio was conceived to tackle the problem of learning geometry effectively, but its general purpose nature makes it\n" +
    "                        useful to a much wider audience. At the youngest end of the spectrum it can be used as the first\n" +
    "                        introduction to a grown-up programming language. In the middle of the spectrum the tool may be used\n" +
    "                        for learning and experiencing mathematical geometry with the programming being second-nature. Educators\n" +
    "                        may use STEMCstudio for demonstration purposes or to set hands-on problems. Researchers may use the\n" +
    "                        tool for convenient computation, exploring problems, or to present their work.\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class='md-docs-section'>\n" +
    "                    <h1 id='workshops' class='page-header'>Workshops</h1>\n" +
    "                    <p class='lead'>\n" +
    "                        Workshops are available for both students and educators and may be customized according to your needs.\n" +
    "                    </p>\n" +
    "                    <address>\n" +
    "                        <strong>David Geo Holmes</strong><br/>\n" +
    "                        <strong>david</strong>&nbsp;DOT&nbsp;<strong>geo</strong>&nbsp;DOT&nbsp;<strong>holmes</strong>&nbsp;AT&nbsp;<strong>gmail</strong>&nbsp;DOT&nbsp;<strong>com</strong><br/>                        (919)&nbsp;880-8589\n" +
    "                        <br/>\n" +
    "                    </address>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <footer class='md-docs-footer' role='contentinfo'>\n" +
    "        <div class='container'>\n" +
    "            <!--\n" +
    "    <div class='md-docs-social'>\n" +
    "      <ul class='md-docs-social-buttons'>\n" +
    "        <li class='follow-btn'>\n" +
    "          <a class='twitter-follow-button'\n" +
    "            href='https://twitter.com/stemcstudio'>\n" +
    "            Follow @stemcstudio</a>\n" +
    "        </li>\n" +
    "        <li class='tweet-btn'>\n" +
    "          <a class='twitter-share-button'\n" +
    "            href='https://twitter.com/intent/tweet?text={{twitterShareText}}'>\n" +
    "            Tweet</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  -->\n" +
    "        </div>\n" +
    "    </footer>\n" +
    "</div>"
  );


  $templateCache.put('alert-modal.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <h3 class='modal-title' style=\"float: left;\"><logo-text version='{{version}}'/></h3>\n" +
    "    <h3 class='modal-title' style=\"float: right;\">{{options.title}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{options.message}}</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" data-ng-click=\"close();\">Close</button>\n" +
    "</div>"
  );


  $templateCache.put('choose-gist-or-repo-modal.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <h3 class='modal-title' style=\"float: left;\"><logo-text version='{{version}}'/></h3>\n" +
    "    <h3 class='modal-title' style=\"float: right;\">{{options.title}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{options.message}}</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">{{options.cancelButtonText}}</button>\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" data-ng-click=\"gist();\">{{options.gistButtonText}}</button>\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" data-ng-click=\"repo();\">{{options.repoButtonText}}</button>\n" +
    "</div>"
  );


  $templateCache.put('commit-message-modal.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <h3 class='modal-title' style=\"float: left;\"><logo-text version='{{version}}'/></h3>\n" +
    "    <h3 class='modal-title' style=\"float: right;\">{{options.title}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{options.message}}</p>\n" +
    "    <input ng-model='options.text' type='text' placeholder='{{options.placeholder}}'></input>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">{{options.cancelButtonText}}</button>\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" data-ng-click=\"ok();\">{{options.actionButtonText}}</button>\n" +
    "</div>"
  );


  $templateCache.put('confirm-modal.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <h3 class='modal-title' style=\"float: left;\"><logo-text version='{{version}}'/></h3>\n" +
    "    <h3 class='modal-title' style=\"float: right;\">{{options.title}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{options.message}}</p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">{{options.cancelButtonText}}</button>\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" data-ng-click=\"ok();\">{{options.actionButtonText}}</button>\n" +
    "</div>"
  );


  $templateCache.put('cookbook.html',
    "<div id='tutorials-page'>\n" +
    "    <nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "        <div class='navbar-header'>\n" +
    "            <a role='button' class='navbar-brand' ng-click='goHome()'>\n" +
    "                <brand />\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class='navbar-header'>\n" +
    "            <span class='md-logo-text-math navbar-brand'>Cookbook</span>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class='container md-docs-container'>\n" +
    "        <div class='row'>\n" +
    "            <!-- EIGHT -->\n" +
    "            <div class='md-docs-section'>\n" +
    "                <h1 class='page-header'>EIGHT</h1>\n" +
    "                <div ng-repeat='tutorial in tutorials | filter : {category : \"EIGHT\"}'>\n" +
    "                    <p class='lead'>\n" +
    "                        <a href='/#/gists/{{tutorial.gistId}}'>{{tutorial.title}}</a>\n" +
    "                    </p>\n" +
    "                    <p>\n" +
    "                        <a href='/#/gists/{{tutorial.gistId}}'>\n" +
    "                            <img src='{{tutorial.imageSrc}}' alt='{{tutorial.imageAlt}}' height='300' , width='300'><img>\n" +
    "                        </a>\n" +
    "                    </p>\n" +
    "                    <p>{{tutorial.description}}</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('dashboard.html',
    "<div id='dashboard-page'>\n" +
    "    <nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "        <div class='navbar-header'>\n" +
    "            <a role='button' class='navbar-brand' ng-click='goHome()'>\n" +
    "                <logo-text version='{{version}}' />\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div id='dashboard-account' ng-controller='GitHubAccountController as account'>\n" +
    "        <div id='dashboard-avatar'>\n" +
    "            <img class='avatar' src='{{user.avatar_url}}&amp;s=460' height='230' width='230'></img>\n" +
    "            <h1>\n" +
    "                <div class='avatar-name'>{{user.name}}</div>\n" +
    "                <div class='avatar-login'>{{user.login}}</div>\n" +
    "            </h1>\n" +
    "        </div>\n" +
    "        <div id='dashboard-repos'>\n" +
    "            <div ng-repeat='repo in repos'>\n" +
    "                <h3>\n" +
    "                    <a href='/#/users/{{user.login}}/repos/{{repo.name}}'>{{repo.name}}</a>\n" +
    "                </h3>\n" +
    "                <p>{{repo.description}}</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('doodle.html',
    "<div id='doodle-page'>\n" +
    "	<!-- The workspace directive has its own implicit controller, WorkspaceController -->\n" +
    "	<!-- The corresponding scope is WorkspaceScope -->\n" +
    "	<workspace>\n" +
    "		<nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "			<div class='navbar-header'>\n" +
    "				<a role='button' class='navbar-brand' ng-click='goHome()'>\n" +
    "					<brand />\n" +
    "				</a>\n" +
    "			</div>\n" +
    "			<div class='ignore-collapse ignore-navbar-collapse'>\n" +
    "				<ul class='nav navbar-nav'>\n" +
    "					<li>\n" +
    "						<a role='button' ng-click='toggleExplorer()'>\n" +
    "							<ng-md-icon icon=\"{{isExplorerVisible ? 'flip_to_back' : 'flip_to_front'}}\" style=\"fill: {{isExplorerVisible ? '#ffffff' : '#ffffff'}}\"\n" +
    "							 size='24' aria-hidden='true' uib-tooltip=\"{{isExplorerVisible ? 'Hide Code' : 'Show Code'}}\" tooltip-placement='bottom'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "					</li>\n" +
    "					<li ng-if='htmlFileCount() > 0'>\n" +
    "						<a role='button' ng-click='toggleView()' ng-hide='isViewVisible'>\n" +
    "							<ng-md-icon icon='launch' style=\"fill: {{true ? '#00ff00' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"Launch Program\"\n" +
    "							 tooltip-placement='bottom'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "						<a role='button' ng-click='toggleView()' ng-show='isViewVisible'>\n" +
    "							<ng-md-icon icon='stop' style=\"fill: {{true ? '#ff9900' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"Stop Program\"\n" +
    "							 tooltip-placement='bottom'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "					</li>\n" +
    "					<li uib-dropdown ng-if='htmlFileCount() > 1'>\n" +
    "						<a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"Choose Program Menu\" tooltip-placement='bottom'>\n" +
    "							<ng-md-icon icon='playlist_add_check' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "						<ul class='dropdown-menu' uib-dropdown-menu role='menu'>\n" +
    "							<li role='button' ng-repeat='(name, file) in files()' ng-if='name.indexOf(\".html\") &gt; 0'>\n" +
    "								<a ng-click='doChooseHtml(name, file)'>{{name}}&nbsp;\n" +
    "                                    <ng-md-icon icon='done' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' ng-if='file.htmlChoice'><ng-md-icon>\n" +
    "                                </a>\n" +
    "							</li>\n" +
    "						</ul>\n" +
    "					</li>\n" +
    "					<li ng-if='markdownFileCount() > 0'>\n" +
    "						<a role='button' ng-click='toggleMarkdownVisible()'>\n" +
    "							<ng-md-icon icon='description' style=\"fill: {{isMarkdownVisible ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"{{isMarkdownVisible ?  'Hide Markdown' : 'Show Markdown'}}\"\n" +
    "							 tooltip-placement='bottom'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "					</li>\n" +
    "					<li uib-dropdown ng-if='markdownFileCount() > 1'>\n" +
    "						<a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"Choose Markdown\" tooltip-placement='bottom'>\n" +
    "							<ng-md-icon icon='playlist_add_check' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "						<ul class='dropdown-menu' uib-dropdown-menu role='menu'>\n" +
    "							<li role='button' ng-repeat='(name, file) in files()' ng-if='name.indexOf(\".md\") &gt; 0'>\n" +
    "								<a ng-click='doChooseMarkdown(name, file)'>{{name}}&nbsp;\n" +
    "                                    <ng-md-icon icon='done' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' ng-if='file.markdownChoice'><ng-md-icon>\n" +
    "                                </a>\n" +
    "							</li>\n" +
    "						</ul>\n" +
    "					</li>\n" +
    "					<!--\n" +
    "                    <li>\n" +
    "                        <a role='button' ng-click='toggleCommentsVisible()'>\n" +
    "                            <ng-md-icon icon='comment' style=\"fill: {{isCommentsVisible ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"{{isCommentsVisible ?  'Hide Comments' : 'Show Comments'}}\"\n" +
    "                            tooltip-placement='bottom'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    -->\n" +
    "					<li uib-dropdown>\n" +
    "						<a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"Project Menu\" tooltip-placement='bottom'>\n" +
    "							<ng-md-icon icon='folder' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "								<ng-md-icon>\n" +
    "									<ng-md-icon icon='arrow_drop_down' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "										<ng-md-icon>\n" +
    "						</a>\n" +
    "						<ul uib-dropdown-menu role='menu'>\n" +
    "							<li>\n" +
    "								<a role='button' ng-click='doNew()'>New Project</a>\n" +
    "							</li>\n" +
    "							<li>\n" +
    "								<a role='button' ng-click='doOpen()'>Open Project from Local Storage</a>\n" +
    "							</li>\n" +
    "							<li>\n" +
    "								<a role='button' ng-click='doCopy()'>Copy current Project</a>\n" +
    "							</li>\n" +
    "						</ul>\n" +
    "					</li>\n" +
    "					<li ng-if='FEATURE_LOGIN_ENABLED' uib-dropdown ng-show='isGitHubSignedIn()'>\n" +
    "						<a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"Cloud Menu\" tooltip-placement='bottom'>\n" +
    "							<ng-md-icon icon='cloud' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "						<ul uib-dropdown-menu role=\"menu\">\n" +
    "							<li>\n" +
    "								<a ng-click='doUpload()' role='button'>Upload to GitHub</a>\n" +
    "							</li>\n" +
    "							<li>\n" +
    "								<a ng-click='doPublish()' role='button'>Publish to tsCodeHub arXiv</a>\n" +
    "							</li>\n" +
    "							<li>\n" +
    "								<a ng-click='clickDownload()' role='button'>Download from GitHub</a>\n" +
    "							</li>\n" +
    "						</ul>\n" +
    "					</li>\n" +
    "					<li ng-hide='isGitHubSignedIn()'>\n" +
    "						<a role='button'>\n" +
    "							<ng-md-icon icon='cloud_off' style=\"fill: #ffffff\" size='24' aria-hidden='true' uib-tooltip=\"\" tooltip-placement='bottom'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "					</li>\n" +
    "					<li ng-if='FEATURE_ROOM_ENABLED' uib-dropdown ng-controller='rooms-controller as rooms'>\n" +
    "						<a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"Collaboration Menu\" tooltip-placement='bottom'>\n" +
    "							<ng-md-icon icon='group' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "						<ul uib-dropdown-menu role=\"menu\">\n" +
    "							<li ng-if='rooms.isCreateRoomEnabled()'>\n" +
    "								<a ng-click='rooms.createRoom()()' role='button'>Set Up Room</a>\n" +
    "							</li>\n" +
    "							<li ng-if='rooms.isJoinRoomEnabled()'>\n" +
    "								<a ng-click='rooms.joinRoom()' role='button'>Join Room</a>\n" +
    "							</li>\n" +
    "							<li ng-if='rooms.isLeaveRoomEnabled()'>\n" +
    "								<a ng-click='rooms.leaveRoom()' role='button'>Leave Room</a>\n" +
    "							</li>\n" +
    "							<li ng-if='rooms.isDestroyRoomEnabled()'>\n" +
    "								<a ng-click='rooms.destroyRoom()' role='button'>Tear Down Room</a>\n" +
    "							</li>\n" +
    "						</ul>\n" +
    "					</li>\n" +
    "					<li uib-dropdown>\n" +
    "						<a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"More Menu\" tooltip-placement='bottom'>\n" +
    "							<ng-md-icon icon='menu' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "						<ul uib-dropdown-menu role=\"menu\">\n" +
    "							<li ng-controller='editor-preferences-controller as controller'>\n" +
    "								<a ng-click='controller.showEditorPreferences()' role='button'>Editor Preferences</a>\n" +
    "							</li>\n" +
    "						</ul>\n" +
    "					</li>\n" +
    "				</ul>\n" +
    "			</div>\n" +
    "			<div class='navbar-header' ng-if='workspace.description && workspace.owner'>\n" +
    "				<span class='md-logo-text-math navbar-brand'>{{ workspace.description }} @ {{ workspace.owner }}</span>\n" +
    "			</div>\n" +
    "			<div class='navbar-header' ng-if='workspace.description && !workspace.owner'>\n" +
    "				<span class='md-logo-text-math navbar-brand'>{{ workspace.description }}</span>\n" +
    "			</div>\n" +
    "		</nav>\n" +
    "		<div id='doodle-container'>\n" +
    "			<explorer ng-model='workspace' class='explorer' ng-show='isExplorerVisible'></explorer>\n" +
    "			<div id='editors' resizable r-directions=\"['right']\" r-flex='true' ng-if='doodleLoaded' ng-show='isExplorerVisible'>\n" +
    "				<!-- We only need the EditSession here. Would passing in the full WsFile be better? -->\n" +
    "				<div editor ng-if='file.isOpen' ng-repeat='(path, file) in files()' ng-model='file' path='{{path}}' ng-show='isEditMode &amp;&amp; file.selected'></div>\n" +
    "			</div>\n" +
    "			<div id='output' ng-if='isViewVisible'></div>\n" +
    "			<div id='readme' ng-if='isMarkdownVisible'></div>\n" +
    "			<div id='gist-comments' ng-if='isCommentsVisible && comments.length > 0'>\n" +
    "				<div ng-repeat=\"comment in comments\" class='gist-comment'><span>{{comment.msg}}</span></div>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</workspace>\n" +
    "</div>"
  );


  $templateCache.put('download.html',
    "<div class='modal-content'>\n" +
    "  <div class='modal-header'>\n" +
    "      <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden='true' ng-click='doCancel()'>&times;</button>\n" +
    "    <h3>Download Project</h3>\n" +
    "  </div>\n" +
    "  <div class='modal-body'>\n" +
    "    <p ng-repeat='gist in gists track by gist.id'>\n" +
    "      <a ui-sref='gist({gistId: gist.id})'>{{gist.description}}</a>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <div class='modal-footer'>\n" +
    "    <button class='btn' ng-click=\"doPageF()\">First</button>\n" +
    "    <button class='btn' ng-click=\"doPageP()\">Previous</button>\n" +
    "    <button class='btn' ng-click=\"doPageN()\">Next</button>\n" +
    "    <button class='btn' ng-click=\"doPageL()\">Last</button>\n" +
    "    <button class='btn' ng-click='doCancel()'>Close</button>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('editor-preferences-dialog.html',
    "<!-- Using a name on the form puts the controller on the scope with a property of the same name -->\n" +
    "<form name='labelForm' ng-submit='ok()'>\n" +
    "    <fieldset>\n" +
    "        <!-- legend>Labels and Keywords</legend -->\n" +
    "        <div class=\"modal-header\" style=\"clear: both\">\n" +
    "            <h3 class='modal-title' style=\"float: left;\">\n" +
    "                <logo-text version='{{version}}' />\n" +
    "            </h3>\n" +
    "            <h3 class='modal-title' style=\"float: right;\">Editor Preferences</h3>\n" +
    "        </div>\n" +
    "        <div id='themes-modal-body' class=\"modal-body\">\n" +
    "            <label class='text-muted'>Theme:</label>\n" +
    "            <select ng-model='theme' ng-options='theme.name for theme in themes track by theme.name' data-ng-change='themeChange()'></select>\n" +
    "            <br/>\n" +
    "            <label class='text-muted'>Font Size:</label>\n" +
    "            <select ng-model='fontSize' ng-options='fontSize for fontSize in fontSizes track by fontSize' data-ng-change='fontSizeChange()'></select>\n" +
    "            <br/>\n" +
    "            <label class='checkbox-inline text-muted'>\n" +
    "                <input type='checkbox' ng-model='showInvisibles' data-ng-change='showInvisiblesChange()'>Invisibles</input>\n" +
    "            </label>\n" +
    "            <br/>\n" +
    "            <label class='checkbox-inline text-muted'>\n" +
    "                <input type='checkbox' ng-model='showLineNumbers' data-ng-change='showLineNumbersChange()'>Line Numbers</input>\n" +
    "            </label>\n" +
    "            <br/>\n" +
    "            <label class='checkbox-inline text-muted'>\n" +
    "                <input type='checkbox' ng-model='showFoldWidgets' data-ng-change='showFoldWidgetsChange()'>Fold Widgets</input>\n" +
    "            </label>\n" +
    "            <br/>\n" +
    "            <label class='checkbox-inline text-muted'>\n" +
    "                <input type='checkbox' ng-model='showGutter' data-ng-change='showGutterChange()'>Gutter</input>\n" +
    "            </label>\n" +
    "            <br/>\n" +
    "            <label class='checkbox-inline text-muted'>\n" +
    "                <input type='checkbox' ng-model='displayIndentGuides' data-ng-change='displayIndentGuidesChange()'>Indent Guides</input>\n" +
    "            </label>\n" +
    "            <br/>\n" +
    "            <label class='checkbox-inline text-muted'>\n" +
    "                <input type='checkbox' ng-model='showPrintMargin' data-ng-change='showPrintMarginChange()'>Print Margin</input>\n" +
    "            </label>\n" +
    "            <br/>\n" +
    "            <label class='checkbox-inline text-muted'>\n" +
    "                <input type='checkbox' ng-model='useSoftTabs' data-ng-change='useSoftTabsChange()'>Soft Tabs</input>\n" +
    "            </label>\n" +
    "            <br/>\n" +
    "            <label class='text-muted'>Indent Size:</label>\n" +
    "            <select ng-model='tabSize' ng-options='tabSize for tabSize in tabSizes track by tabSize' data-ng-change='tabSizeChange()'></select>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">Cancel</button>\n" +
    "            <button class=\"btn btn-primary\" type=\"submit\">OK</button>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>"
  );


  $templateCache.put('examples.html',
    "<div id='examples-page'>\n" +
    "    <nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "        <div class='navbar-header'>\n" +
    "            <a role='button' class='navbar-brand' ng-click='goHome()'>\n" +
    "                <brand />\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class='navbar-header'>\n" +
    "            <span class='md-logo-text-math navbar-brand'>Examples</span>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class='container md-docs-container'>\n" +
    "        <div class='row'>\n" +
    "            <div class='col-md-9' role='main'>\n" +
    "\n" +
    "                <div class='md-docs-section'>\n" +
    "\n" +
    "                    <!-- Physics -->\n" +
    "                    <div class='md-docs-section'>\n" +
    "\n" +
    "                        <h1 class='page-header'>Physics Modeling</h1>\n" +
    "\n" +
    "                        <div ng-repeat='example in examples | filter : {category : \"Physics\"}'>\n" +
    "                            <p class='lead'>\n" +
    "                                <a href='/#/gists/{{example.gistId}}'>{{example.title}}</a>\n" +
    "                            </p>\n" +
    "                            <p>\n" +
    "                                <a href='/#/gists/{{example.gistId}}'>\n" +
    "                                    <img src='{{example.imageSrc}}' alt='{{example.imageAlt}}' height='300' , width='300'><img>\n" +
    "                                </a>\n" +
    "                            </p>\n" +
    "                            <p>{{example.description}}</p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <!-- Graphics -->\n" +
    "                    <div class='md-docs-section'>\n" +
    "\n" +
    "                        <h1 class='page-header'>3D Computer Graphics</h1>\n" +
    "\n" +
    "                        <div ng-repeat='example in examples | filter : {category : \"Graphics\"}'>\n" +
    "                            <p class='lead'>\n" +
    "                                <a href='/#/gists/{{example.gistId}}'>{{example.title}}</a>\n" +
    "                            </p>\n" +
    "                            <p>\n" +
    "                                <a href='/#/gists/{{example.gistId}}'>\n" +
    "                                    <img src='{{example.imageSrc}}' alt='{{example.imageAlt}}' height='300' , width='300'><img>\n" +
    "                                </a>\n" +
    "                            </p>\n" +
    "                            <p>{{example.description}}</p>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "                    <!-- Mathematics -->\n" +
    "                    <div class='md-docs-section'>\n" +
    "                        <h1 class='page-header'>Mathematics</h1>\n" +
    "\n" +
    "                        <div ng-repeat='example in examples | filter : {category : \"Mathematics\"}'>\n" +
    "                            <p class='lead'>\n" +
    "                                <a href='/#/gists/{{example.gistId}}'>{{example.title}}</a>\n" +
    "                            </p>\n" +
    "                            <p>\n" +
    "                                <a href='/#/gists/{{example.gistId}}'>\n" +
    "                                    <img src='{{example.imageSrc}}' alt='{{example.imageAlt}}' height='300' , width='300'><img>\n" +
    "                                </a>\n" +
    "                            </p>\n" +
    "                            <p>{{example.description}}</p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <!-- Chemistry -->\n" +
    "                    <div class='md-docs-section'>\n" +
    "                        <h1 class='page-header'>Chemistry</h1>\n" +
    "\n" +
    "                        <div ng-repeat='example in examples | filter : {category : \"Chemistry\"}'>\n" +
    "                            <p class='lead'>\n" +
    "                                <a href='/#/gists/{{example.gistId}}'>{{example.title}}</a>\n" +
    "                            </p>\n" +
    "                            <p>\n" +
    "                                <a href='/#/gists/{{example.gistId}}'>\n" +
    "                                    <img src='{{example.imageSrc}}' alt='{{example.imageAlt}}' height='300' , width='300'><img>\n" +
    "                                </a>\n" +
    "                            </p>\n" +
    "                            <p>{{example.description}}</p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <!-- Computer Science -->\n" +
    "                    <div class='md-docs-section'>\n" +
    "                        <h1 class='page-header'>Computer Science</h1>\n" +
    "\n" +
    "                        <div ng-repeat='example in examples | filter : {category : \"CompSci\"}'>\n" +
    "                            <p class='lead'>\n" +
    "                                <a href='/#/gists/{{example.gistId}}'>{{example.title}}</a>\n" +
    "                            </p>\n" +
    "                            <p>\n" +
    "                                <a href='/#/gists/{{example.gistId}}'>\n" +
    "                                    <img src='{{example.imageSrc}}' alt='{{example.imageAlt}}' height='300' , width='300'><img>\n" +
    "                                </a>\n" +
    "                            </p>\n" +
    "                            <p>{{example.description}}</p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('explorer.html',
    "<div id='explorer'>\n" +
    "	<div class='explorer-section' ng-controller='ExplorerFilesController as filesController'>\n" +
    "		<div class='explorer-section-header'>\n" +
    "			<div class='navbar navbar-inverse explorer-section-box'>\n" +
    "				<ul class='nav navbar-nav' style=\"display: flex; flex-direction: row;\">\n" +
    "					<li>\n" +
    "						<a role='button' ng-click='doProperties()'>\n" +
    "							<ng-md-icon icon='settings' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"Settings\"\n" +
    "								tooltip-placement='bottom'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "					</li>\n" +
    "					<li>\n" +
    "						<a role='button' ng-click='doLabel()'>\n" +
    "							<ng-md-icon icon='label' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"Labels and Tags\"\n" +
    "								tooltip-placement='bottom'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "					</li>\n" +
    "					<li>\n" +
    "						<a role='button' ng-click='filesController.newFile()'>\n" +
    "							<ng-md-icon icon='add_box' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"New File\"\n" +
    "								tooltip-placement='bottom'>\n" +
    "								<ng-md-icon>\n" +
    "						</a>\n" +
    "					</li>\n" +
    "				</ul>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<ul class='files'>\n" +
    "			<!-- workspace.filesByPath exits because workspace is set on the scope by the explorer component -->\n" +
    "			<li ng-repeat='(path, file) in workspace.filesByPath' ng-class='{open: file.isOpen && !file.selected, selected: file.selected, tainted: file.tainted}'\n" +
    "				context-menu='menu(path, file)'>\n" +
    "				<a href ng-click='$ctrl.openFile(path)'>{{path}}</a>\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "		<!-- problems ng-model='workspace' class='problems' ng-show='isProblemsVisible'></problems -->\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('gist-comment.html',
    "<div class=\"alert gist-comment\" role=\"alert\">\n" +
    "    <div ng-transclude></div>\n" +
    "</div>"
  );


  $templateCache.put('home.html',
    "<div id='home-page'>\n" +
    "    <nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "        <div class='container-fluid'>\n" +
    "            <div class='navbar-header'>\n" +
    "                <button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar-header-collapse'>\n" +
    "                    <span class=\"sr-only\">Toggle navigation</span>\n" +
    "                    <span class=\"icon-bar\"></span>\n" +
    "                    <span class=\"icon-bar\"></span>\n" +
    "                    <span class=\"icon-bar\"></span>\n" +
    "                </button>\n" +
    "                <div class='navbar-brand'>\n" +
    "                    <brand />\n" +
    "                </div>\n" +
    "                <button type=\"button\" class=\"btn btn-primary navbar-btn\" ng-click='clickCodeNow()'>Code Now!</button>\n" +
    "                <!-- button ng-if='FEATURE_COOKBOOK_ENABLED' type=\"button\" class=\"btn btn-secondary navbar-btn\" ng-click='goCookbook()'>Cookbook</button -->\n" +
    "                <!-- button ng-if='FEATURE_TUTORIALS_ENABLED' type=\"button\" class=\"btn btn-secondary navbar-btn\" ng-click='goTutorials()'>Tutorials</button -->\n" +
    "                <!-- button ng-if='FEATURE_EXAMPLES_ENABLED' type=\"button\" class=\"btn btn-secondary navbar-btn\" ng-click='goExamples()'>Examples</button -->\n" +
    "                <!-- button ng-if='FEATURE_DASHBOARD_ENABLED' type=\"button\" class=\"btn btn-secondary navbar-btn\" ng-click='goDashboard()' ng-show='isGitHubSignedIn()'>Dashboard</button -->\n" +
    "                <!-- a role=\"button\" class=\"btn btn-secondary navbar-btn\" ng-href='/stemcstudio-overview-2017-03-24.pdf' download='STEMCstudio.pdf'>Download PDF</a -->\n" +
    "                <a role=\"button\" class=\"btn btn-secondary navbar-btn\" ng-href='https://github.com/stemcstudio/stemcstudio/wiki' target='_blank'>User Guide</a>\n" +
    "                <a role=\"button\" class=\"btn btn-secondary navbar-btn\" ng-href='https://github.com/stemcstudio/stemcstudio/issues' target='_blank'>Feedback</a>\n" +
    "                <form class=\"navbar-search pull-right\" ng-submit='doSearch()'>\n" +
    "                    <input type=\"text\" ng-model='params.query' class=\"search-query\" placeholder=\"Search tsCodeHub arXiv\">\n" +
    "                </form>\n" +
    "            </div>\n" +
    "            <div class='collapse navbar-collapse' id='navbar-header-collapse'>\n" +
    "                <a ng-show='github.isLoggedIn()' ng-controller='github-login-controller as github' role='button' ng-click='github.toggleLogin()'\n" +
    "                    class='navbar-brand navbar-right'>\n" +
    "                    <span ng-show='github.isLoggedIn()' uib-tooltip=\"Sign out from GitHub\" tooltip-placement='bottom'>{{ userLogin() ? userLogin() : 'Unknown' }}</span>\n" +
    "                </a>\n" +
    "                <button ng-hide='github.isLoggedIn()' ng-controller='github-login-controller as github' type=\"button\" class=\"btn btn-github navbar-btn navbar-right\"\n" +
    "                    ng-click='github.toggleLogin()' uib-tooltip=\"Signing in to GitHub allows you to save your projects to your personal GitHub account (Recommended)\"\n" +
    "                    tooltip-placement='bottom'>\n" +
    "                    <span ng-hide='github.isLoggedIn()'>Sign in to GitHub</span>\n" +
    "                    <span ng-show='github.isLoggedIn()'>Signed in as {{userLogin()}}</span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class='md-docs-header'>\n" +
    "        <div class='container'>\n" +
    "            <h1>\n" +
    "                <logo-text version='{{version}}' />\n" +
    "            </h1>\n" +
    "            <p>Seriously fun Live Coding!</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class='container md-docs-container'>\n" +
    "        <div class='row'>\n" +
    "            <div class='col-md-9' role='main'>\n" +
    "                <div class='md-docs-section' ng-if='params.query'>\n" +
    "                    <!-- Search -->\n" +
    "                    <h1 id='overview' class='page-header'>tsCodeHub arXiv</h1>\n" +
    "                    <div class=\"thumbnails\">\n" +
    "                        <article class=\"thumbnail\" ng-repeat='doodle in doodleRefs'>\n" +
    "                            <header>\n" +
    "                                <!-- The DoodleRef has the title property -->\n" +
    "                                <h1 class='title'><a role='button' ng-href='/#/gists/{{doodle.gistId}}'>{{ (doodle.title ? doodle.title : 'Untitled') }}</a></h1>\n" +
    "                                <p class='author'>{{doodle.author ? doodle.author : 'Anonymous' }}</p>\n" +
    "                                <p class='keyword' ng-repeat='keyword in doodle.keywords'>{{keyword}}</p>\n" +
    "                            </header>\n" +
    "                            <footer>\n" +
    "                            </footer>\n" +
    "                        </article>\n" +
    "                    </div>\n" +
    "                    <div ng-if='found === 0 && params.query === query'>\n" +
    "                        <p>Your search did not match any documents.</p>\n" +
    "                        <p><span>Suggestions</span>:</p>\n" +
    "                        <ul>\n" +
    "                            <li>Make sure all words are spelled correctly.</li>\n" +
    "                            <li>Try different keywords.</li>\n" +
    "                            <li>Try more general keywords.</li>\n" +
    "                            <li>Try fewer keywords.</li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class='md-docs-section'>\n" +
    "                    <!-- Local Storage -->\n" +
    "                    <h1 id='overview' class='page-header'>Local Storage</h1>\n" +
    "                    <div class=\"thumbnails\">\n" +
    "                        <article class=\"thumbnail\" ng-repeat='doodle in doodles()'>\n" +
    "                            <header>\n" +
    "                                <!-- The Doodle has the description property -->\n" +
    "                                <h1 class='title'>\n" +
    "                                    <a role='button' ng-click='doDelete(doodle)' class='delete' uib-tooltip=\"Delete...\" tooltop-placement='bottom'>&times;</a>\n" +
    "                                    <a role='button' ng-click='doOpen(doodle)'>{{ (doodle.description ? doodle.description : 'Untitled') }}</a>\n" +
    "                                </h1>\n" +
    "                                <p class='author'>{{doodle.author ? doodle.author : 'Anonymous' }}</p>\n" +
    "                                <p class='keyword' ng-repeat='keyword in doodle.keywords'>{{keyword}}</p>\n" +
    "                            </header>\n" +
    "                            <footer>\n" +
    "                            </footer>\n" +
    "                        </article>\n" +
    "                    </div>\n" +
    "                    <div ng-if='doodles().length === 0'>\n" +
    "                        <p>Your do not have any documents in your Local Storage.</p>\n" +
    "                        <p><span>Suggestions</span>:</p>\n" +
    "                        <ul>\n" +
    "                            <li>Code Now!</li>\n" +
    "                            <!-- li>Learn using the Tutorials.</li -->\n" +
    "                            <!-- li>Take a look at some of the Examples.</li -->\n" +
    "                            <li>Search the tsCodeHub arXiv.</li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('label-modal.html',
    "<!-- Using a name on the form puts the controller on the scope with a property of the same name -->\n" +
    "<form name='labelForm' ng-submit='ok()'>\n" +
    "    <fieldset>\n" +
    "        <!-- legend>Labels and Keywords</legend -->\n" +
    "        <div class=\"modal-header\" style=\"clear: both\">\n" +
    "            <h3 class='modal-title' style=\"float: left;\"><logo-text version='{{version}}'/></h3>\n" +
    "            <h3 class='modal-title' style=\"float: right;\">Labels and Tags</h3>\n" +
    "        </div>\n" +
    "        <div id='label-modal-body' class=\"modal-body\">\n" +
    "            <label>Title</label>\n" +
    "            <br/>\n" +
    "            <input type='text' placeholder=\"Title\" style=\"min-width: 500px;\" name=\"title\" ng-model=\"f.t\" />\n" +
    "            <br/>\n" +
    "            <label>Author</label>\n" +
    "            <br/>\n" +
    "            <input type='text' placeholder=\"Your Full Name\" style=\"min-width: 500px;\" name=\"author\" ng-model=\"f.a\" />\n" +
    "            <br/>\n" +
    "            <label>Keywords</label>\n" +
    "            <br/>\n" +
    "            <input type='text' placeholder=\"Keyword1, Keyword2, ..., KeywordN\" style=\"min-width: 500px;\" name=\"keywords\" ng-model=\"f.k\"\n" +
    "            />\n" +
    "            <br/>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">Cancel</button>\n" +
    "            <button class=\"btn btn-primary\" type=\"submit\">OK</button>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>"
  );


  $templateCache.put('login.html',
    "<div id='login-page'>\n" +
    "    <nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "        <div class='navbar-header'>\n" +
    "            <a role='button' class='navbar-brand' ng-click='goHome()'>\n" +
    "                <brand />\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class='navbar-header'>\n" +
    "            <span class='md-logo-text-math navbar-brand'>Sign In</span>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class='login-container'>\n" +
    "        <div class='container md-docs-container'>\n" +
    "            <div class='row'>\n" +
    "                <div class='col-md-9' role='main'>\n" +
    "                    <div class='md-docs-section'>\n" +
    "                        <h1 class='page-header'>Source Management</h1>\n" +
    "                        <p class='lead'>\n" +
    "                            Save your work to your personal GitHub account.\n" +
    "                        </p>\n" +
    "                        <div class='login-provider-buttons'>\n" +
    "                            <div ng-controller='github-login-controller as github' ng-if='FEATURE_GITHUB_SIGNIN_ENABLED' button-id=\"github-button-id\"\n" +
    "                                options=\"options\" class='login-provider-button-container'>\n" +
    "                                <div style=\"height:34px;width:240px;\" class=\"stemcButton stemcButtonGray\">\n" +
    "                                    <div class=\"stemcButtonContentWrapper\" ng-click=\"github.login()\">\n" +
    "                                        <div class=\"stemcButtonIcon\" style=\"padding:7px;\">\n" +
    "                                            <ng-md-icon icon=\"github-circle\" size='18' />\n" +
    "                                        </div>\n" +
    "                                        <span style=\"font-size:13px;line-height:32px;\" class=\"stemcButtonContents\">\n" +
    "                                            <span ng-hide='isGitHubSignedIn()'>Sign in with GitHub</span>\n" +
    "                                        <span ng-show='isGitHubSignedIn()'>Signed in with GitHub</span>\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class='md-docs-section'>\n" +
    "                        <h1 class='page-header'>STEMCstudio Platform</h1>\n" +
    "                        <p class='lead'>\n" +
    "                            Publish your work, and gain access to other platform features.\n" +
    "                        </p>\n" +
    "                        <div class='login-provider-buttons'>\n" +
    "                            <div ng-if='FEATURE_GOOGLE_SIGNIN_ENABLED' class='login-provider-button-container'>\n" +
    "                                <google-sign-in-button ng-if='FEATURE_GOOGLE_SIGNIN_ENABLED' button-id=\"google-button-id\" options=\"googleSignInOptions\"></google-sign-in-button>\n" +
    "                            </div>\n" +
    "                            <div ng-controller='twitter-login-controller as twitter' ng-if='FEATURE_TWITTER_SIGNIN_ENABLED' button-id=\"github-button-id\"\n" +
    "                                options=\"options\" class='login-provider-button-container'>\n" +
    "                                <div style=\"height:34px;width:240px;\" class=\"stemcButton stemcButtonTwitter\">\n" +
    "                                    <div class=\"stemcButtonContentWrapper\" ng-click=\"twitter.login()\">\n" +
    "                                        <div class=\"stemcButtonIcon\" style=\"padding:7px;\">\n" +
    "                                            <ng-md-icon icon=\"twitter\" size='18' />\n" +
    "                                        </div>\n" +
    "                                        <span style=\"font-size:13px;line-height:32px;\" class=\"stemcButtonContents\">\n" +
    "                                            <span>Sign in with Twitter</span>\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div ng-controller='facebook-login-controller as facebook' ng-if='FEATURE_FACEBOOK_SIGNIN_ENABLED' button-id=\"github-button-id\"\n" +
    "                                options=\"options\" class='login-provider-button-container'>\n" +
    "                                <div style=\"height:34px;width:240px;\" class=\"stemcButton stemcButtonFacebook\">\n" +
    "                                    <div class=\"stemcButtonContentWrapper\" ng-click=\"facebook.login()\">\n" +
    "                                        <div class=\"stemcButtonIcon\" style=\"padding:7px;\">\n" +
    "                                            <ng-md-icon icon=\"facebook\" size='18' />\n" +
    "                                        </div>\n" +
    "                                        <span style=\"font-size:13px;line-height:32px;\" class=\"stemcButtonContents\">\n" +
    "                                            <span>Sign in with Facebook</span>\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('messages.html',
    "Field is required."
  );


  $templateCache.put('project-copy.html',
    "<!-- The name attribute pushes the form into the scope -->\n" +
    "<!-- Using AngularJSform validation requires a name for the form. -->\n" +
    "<!-- The novalidate attribute prevents the browser from natively validating the form. -->\n" +
    "<form name='form' ng-submit='ok()' novalidate class=\"css-form\">\n" +
    "    <fieldset>\n" +
    "        <div class=\"modal-header\" style=\"clear: both\">\n" +
    "            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden='true' ng-click='cancel()'>&times;</button>\n" +
    "            <h3 class='modal-title' style=\"float: left;\">\n" +
    "                <logo-text version='{{version}}' />\n" +
    "            </h3>\n" +
    "            <h3 class='modal-title' style=\"float: right;\">Copy Project \"{{project.oldDescription}}\"</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <label class='text-muted'><span>Description</span>: <input type='text' name=\"description\" ng-model='project.newDescription' placeholder=\"Enter description\" required/></label><br/>\n" +
    "            <br/>\n" +
    "            <div ng-show=\"form.$submitted || form.description.$touched\">\n" +
    "                <div ng-show=\"form.description.$error.required\">Description is required.</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"reset(form)\">Reset</button>\n" +
    "            <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">Cancel</button>\n" +
    "            <button class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"form.$invalid\">Copy project</button>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>"
  );


  $templateCache.put('project-new.html',
    "<!-- The name attribute pushes the form into the scope -->\n" +
    "<!-- Using AngularJSform validation requires a name for the form. -->\n" +
    "<!-- The novalidate attribute prevents the browser from natively validating the form. -->\n" +
    "<form name='form' ng-submit='ok()' novalidate class=\"css-form\">\n" +
    "    <fieldset>\n" +
    "        <div class=\"modal-header\" style=\"clear: both\">\n" +
    "            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden='true' ng-click='cancel()'>&times;</button>\n" +
    "            <h3 class='modal-title' style=\"float: left;\">\n" +
    "                <logo-text version='{{version}}' />\n" +
    "            </h3>\n" +
    "            <h3 class='modal-title' style=\"float: right;\">Create a New Project</h3>\n" +
    "        </div>\n" +
    "        <div class=\"modal-body\">\n" +
    "            <label class='text-muted'><span>Description</span>: <input type='text' name=\"description\" ng-model='project.description' placeholder=\"Your project description\" required/></label><br/>\n" +
    "            <br/>\n" +
    "            <div ng-show=\"form.$submitted || form.description.$touched\">\n" +
    "                <div ng-show=\"form.description.$error.required\">Description is required.</div>\n" +
    "            </div>\n" +
    "            <label class='text-muted'><span>Template</span>: <select ng-model='project.template' ng-options='template.description for template in templates track by template.name'></select></label>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">Cancel</button>\n" +
    "            <button class=\"btn btn-primary\" type=\"submit\" ng-disabled=\"form.$invalid\">OK</button>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>"
  );


  $templateCache.put('project-open.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden='true' ng-click='cancel()'>&times;</button>\n" +
    "    <h3 class='modal-title' style=\"float: left;\">\n" +
    "        <logo-text version='{{version}}' />\n" +
    "    </h3>\n" +
    "    <h3 class='modal-title' style=\"float: right;\">Open Project from Local Storage</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p ng-repeat='doodle in doodles()'>\n" +
    "        <a role='button' ng-click='doOpen(doodle)'>{{doodle.description}}</a>\n" +
    "    </p>\n" +
    "</div>\n" +
    "<div class='modal-footer'>\n" +
    "    <button class='btn' ng-click='doClose()'>Close</button>\n" +
    "</div>\n"
  );


  $templateCache.put('prompt-modal.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <h3 class='modal-title' style=\"float: left;\"><logo-text version='{{version}}'/></h3>\n" +
    "    <h3 class='modal-title' style=\"float: right;\">{{options.title}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{options.message}}</p>\n" +
    "    <input ng-model='options.text' type='text' placeholder='{{options.placeholder}}'></input>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">{{options.cancelButtonText}}</button>\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" data-ng-click=\"ok();\">{{options.actionButtonText}}</button>\n" +
    "</div>"
  );


  $templateCache.put('properties-modal.html',
    "<!-- Using a name on the form puts the controller on the scope with a property of the same name -->\n" +
    "<form name='propertiesForm' ng-submit='ok()'>\n" +
    "    <fieldset>\n" +
    "        <!-- legend>Labels and Keywords</legend -->\n" +
    "        <div class=\"modal-header\" style=\"clear: both\">\n" +
    "            <h3 class='modal-title' style=\"float: left;\">\n" +
    "                <logo-text version='{{version}}' />\n" +
    "            </h3>\n" +
    "            <h3 class='modal-title' style=\"float: right;\">Project Properties</h3>\n" +
    "        </div>\n" +
    "        <div id='properties-modal-body' class=\"modal-body\">\n" +
    "            <label>Name</label>\n" +
    "            <br/>\n" +
    "            <input type='text' placeholder=\"project-name\" style=\"min-width: 500px;\" name=\"title\" ng-model=\"f.n\" />\n" +
    "            <br/>\n" +
    "            <label>Version</label>\n" +
    "            <br/>\n" +
    "            <input type='text' placeholder=\"1.0.0\" style=\"min-width: 500px;\" name=\"version\" ng-model=\"f.v\" />\n" +
    "            <br/>\n" +
    "            <label class='checkbox-inline'>\n" +
    "                <input type='checkbox' ng-model='f.loopCheck'>Infinite Loop Detection</input>\n" +
    "            </label>\n" +
    "            <br/>\n" +
    "            <label class='checkbox-inline'>\n" +
    "                <input type='checkbox' ng-model='f.o'>Operator Overloading</input>\n" +
    "            </label>\n" +
    "            <br/>\n" +
    "            <label class='checkbox-inline'>\n" +
    "                <input type='checkbox' ng-model='f.linting'>Linting</input>\n" +
    "            </label>\n" +
    "            <h4>Dependencies</h4>\n" +
    "            <table>\n" +
    "                <thead>\n" +
    "                    <tr>\n" +
    "                        <td>Package</td>\n" +
    "                        <td>Module</td>\n" +
    "                        <td>Global</td>\n" +
    "                        <td>Description</td>\n" +
    "                    </tr>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                    <tr ng-repeat='option in options track by option.packageName'>\n" +
    "                        <td>\n" +
    "                            <label class='checkbox-inline'>\n" +
    "                                <input type='checkbox' ng-checked='f.dependencies.indexOf(option.packageName) > -1' ng-click='toggleDependency(option.packageName)'>{{option.packageName}}</input>\n" +
    "                            </label>\n" +
    "                        </td>\n" +
    "                        <td>{{option.moduleName}}</td>\n" +
    "                        <td>{{option.globalName}}</td>\n" +
    "                        <td><a href='{{option.homepage}}' target='_blank'>{{option.description}}</a></td>\n" +
    "                    </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "        <div class=\"modal-footer\">\n" +
    "            <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">Cancel</button>\n" +
    "            <button class=\"btn btn-primary\" type=\"submit\">OK</button>\n" +
    "        </div>\n" +
    "    </fieldset>\n" +
    "</form>"
  );


  $templateCache.put('publish-modal.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <h3 class='modal-title' style=\"float: left;\"><logo-text version='{{version}}'/></h3>\n" +
    "    <h3 class='modal-title' style=\"float: right;\">Publish Settings</h3>\n" +
    "</div>\n" +
    "<div id='publish-modal-body' class=\"modal-body\">\n" +
    "    <h3>Subject</h3>\n" +
    "    <ui-select ng-model=\"selected.category\" theme=\"select2\" on-select='onCategorySelect($item, $model)' ng-disabled=\"!categoriesEnabled\"\n" +
    "    style=\"min-width: 200px;\" title=\"Choose a Category\">\n" +
    "        <ui-select-match placeholder=\"Select a category in the list or search...\">{{$select.selected.title}}</ui-select-match>\n" +
    "        <!-- $item is the category, $model is category.code -->\n" +
    "        <ui-select-choices repeat=\"category.code as category in categories | propsFilter: {title: $select.search} track by category.code\">\n" +
    "            <div ng-bind-html=\"category.title | highlight: $select.search\"></div>\n" +
    "        </ui-select-choices>\n" +
    "    </ui-select>\n" +
    "    <h3>Book</h3>\n" +
    "    <ui-select ng-model=\"selected.book\" theme=\"select2\" on-select='onBookSelect($item, $model)' ng-disabled=\"!booksEnabled\" style=\"min-width: 200px;\" title=\"Choose a Book\">\n" +
    "        <ui-select-match placeholder=\"Select a book in the list or search...\">{{$select.selected.title}}</ui-select-match>\n" +
    "        <ui-select-choices repeat=\"book.code as book in books | propsFilter: {title: $select.search} track by book.code\">\n" +
    "            <div ng-bind-html=\"book.title | highlight: $select.search\"></div>\n" +
    "        </ui-select-choices>\n" +
    "    </ui-select>\n" +
    "    <h3>Chapter</h3>\n" +
    "    <ui-select ng-model=\"selected.chapter\" theme=\"select2\" on-select='onChapterSelect($item, $model)' ng-disabled=\"!chaptersEnabled\" style=\"min-width: 200px;\" title=\"Choose a Chapter\">\n" +
    "        <ui-select-match placeholder=\"Select a chapter in the list or search...\">{{$select.selected.title}}</ui-select-match>\n" +
    "        <ui-select-choices repeat=\"chapter.code as chapter in chapters | propsFilter: {title: $select.search}\">\n" +
    "            <div ng-bind-html=\"chapter.title | highlight: $select.search\"></div>\n" +
    "        </ui-select-choices>\n" +
    "    </ui-select>\n" +
    "    <h3>Topic</h3>\n" +
    "    <ui-select ng-model=\"selected.topic\" theme=\"select2\" on-select='onTopicSelect($item, $model)' ng-disabled=\"!topicsEnabled\" style=\"min-width: 200px;\" title=\"Choose a Topic\">\n" +
    "        <ui-select-match placeholder=\"Select a topic in the list or search...\">{{$select.selected.title}}</ui-select-match>\n" +
    "        <ui-select-choices repeat=\"topic.title as topic in topics | propsFilter: {title: $select.search}\">\n" +
    "            <div ng-bind-html=\"topic.title | highlight: $select.search\"></div>\n" +
    "        </ui-select-choices>\n" +
    "    </ui-select>\n" +
    "    <h3>Level</h3>\n" +
    "    <ui-select ng-model=\"ctrl.level.selected\" theme=\"select2\" style=\"min-width: 200px;\" title=\"Choose a Level\">\n" +
    "        <ui-select-match placeholder=\"Select a level in the list or search...\">{{$select.selected.name}}</ui-select-match>\n" +
    "        <ui-select-choices repeat=\"level.name as level in levels | propsFilter: {name: $select.search}\">\n" +
    "            <div ng-bind-html=\"level.name | highlight: $select.search\"></div>\n" +
    "        </ui-select-choices>\n" +
    "    </ui-select>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">Cancel</button>\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" data-ng-click=\"ok()\">Publish</button>\n" +
    "</div>"
  );


  $templateCache.put('repo-data-modal.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <h3 class='modal-title' style=\"float: left;\"><logo-text version='{{version}}'/></h3>\n" +
    "    <h3 class='modal-title' style=\"float: right;\">{{options.title}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{options.message}}</p>\n" +
    "    <label>Name</label>\n" +
    "    <input ng-model='data.name' type='text'></input>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"cancel()\">{{options.cancelButtonText}}</button>\n" +
    "    <button class=\"btn btn-primary\" type=\"button\" data-ng-click=\"ok();\">{{options.actionButtonText}}</button>\n" +
    "</div>"
  );


  $templateCache.put('search.html',
    "<div id='search-page'>\n" +
    "    <nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "        <div class='navbar-header'>\n" +
    "            <a role='button' class='navbar-brand' ng-click='goHome()'>\n" +
    "                <brand />\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class='navbar-header'>\n" +
    "            <span class='md-logo-text-math navbar-brand'>Search</span>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class='search-container'>\n" +
    "        <div class='container md-docs-container'>\n" +
    "            <div class='row'>\n" +
    "                <div class='col-md-9' role='main'>\n" +
    "                    <div class='md-docs-section'>\n" +
    "                        <h1 class='page-header'>Search</h1>\n" +
    "                        <!-- p class='lead'></p -->\n" +
    "                        <input type='text' ng-model='params.query' required='1' />\n" +
    "                        <div>\n" +
    "                            <div button-id=\"search-button-id\" options=\"options\">\n" +
    "                                <div style=\"height:34px;width:240px;\" class=\"stemcButton stemcButtonGray\">\n" +
    "                                    <div class=\"stemcButtonContentWrapper\" ng-click=\"search()\">\n" +
    "                                        <div class=\"stemcButtonIcon\" style=\"padding:7px;\">\n" +
    "                                            <ng-md-icon icon=\"search\" size='18' />\n" +
    "                                        </div>\n" +
    "                                        <span style=\"font-size:13px;line-height:32px;\" class=\"stemcButtonContents\">\n" +
    "                                            <span>Go</span>\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class='md-docs-section'>\n" +
    "                        <div ng-repeat='doodle in doodleRefs'>\n" +
    "                            <a ng-href='/#/gists/{{doodle.gistId}}'>{{doodle.title}}</a>\n" +
    "                            <div>{{doodle.author}}</div>\n" +
    "                            <div>{{doodle.keywords.join(', ')}}</div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('share-modal.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <h3 class='modal-title' style=\"float: left;\"><logo-text version='{{version}}'/></h3>\n" +
    "    <h3 class='modal-title' style=\"float: right;\">{{options.title}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p>{{options.message}}</p>\n" +
    "    <!-- Target -->\n" +
    "    <input id='share' ng-model='options.text' type='text' readonly='readonly'></input>\n" +
    "    <!-- Trigger -->\n" +
    "    <button class=\"btn btn-primary\" data-clipboard-target=\"#share\" type=\"button\">\n" +
    "        {{options.actionButtonText}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-secondary\" type=\"button\" data-ng-click=\"close()\">{{options.closeButtonText}}</button>\n" +
    "</div>"
  );


  $templateCache.put('tutorials.html',
    "<div id='tutorials-page'>\n" +
    "    <nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "        <div class='navbar-header'>\n" +
    "            <a role='button' class='navbar-brand' ng-click='goHome()'>\n" +
    "                <brand />\n" +
    "            </a>\n" +
    "        </div>\n" +
    "        <div class='navbar-header'>\n" +
    "            <span class='md-logo-text-math navbar-brand'>Tutorials</span>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "    <div class='container md-docs-container'>\n" +
    "        <div class='row'>\n" +
    "            <!-- EIGHT -->\n" +
    "            <div class='md-docs-section'>\n" +
    "                <h1 class='page-header'>EIGHT</h1>\n" +
    "                <div ng-repeat='tutorial in tutorials | filter : {category : \"EIGHT\"}'>\n" +
    "                    <div class='lead'>\n" +
    "                        <a href='/#/gists/{{tutorial.gistId}}'>{{tutorial.title}}</a>\n" +
    "                    </div>\n" +
    "                    <div>{{tutorial.description}}</div>\n" +
    "                    <a href='/#/gists/{{tutorial.gistId}}'>\n" +
    "                        <img src='{{tutorial.imageSrc}}' alt='{{tutorial.imageAlt}}' height='300' , width='300'><img>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>"
  );

}
