//
// GENERATED FILE
//
import { ITemplateCacheService } from 'angular';
export function templateCache($templateCache: ITemplateCacheService) {

  'use strict';

  $templateCache.put('alert-modal.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <h3 class='modal-title' style=\"float: left;\">\n" +
    "        <logo-text version='{{version}}' />\n" +
    "    </h3>\n" +
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
    "    <h3 class='modal-title' style=\"float: left;\">\n" +
    "        <logo-text version='{{version}}' />\n" +
    "    </h3>\n" +
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
    "    <h3 class='modal-title' style=\"float: left;\">\n" +
    "        <logo-text version='{{version}}' />\n" +
    "    </h3>\n" +
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
    "    <h3 class='modal-title' style=\"float: left;\">\n" +
    "        <logo-text version='{{version}}' />\n" +
    "    </h3>\n" +
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
    "    <!-- The workspace directive has its own implicit controller, WorkspaceController -->\n" +
    "    <!-- The corresponding scope is WorkspaceScope -->\n" +
    "    <workspace>\n" +
    "        <nav id='toolbar' class='navbar navbar-inverse'>\n" +
    "            <div class='navbar-header'>\n" +
    "                <a role='button' class='navbar-brand' ng-click='goHome()'>\n" +
    "                    <brand />\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class='ignore-collapse ignore-navbar-collapse'>\n" +
    "                <ul class='nav navbar-nav'>\n" +
    "                    <li>\n" +
    "                        <a role='button' ng-click='toggleExplorer()'>\n" +
    "                            <ng-md-icon icon=\"{{isExplorerVisible ? 'flip_to_back' : 'flip_to_front'}}\" style=\"fill: {{isExplorerVisible ? '#ffffff' : '#ffffff'}}\"\n" +
    "                                size='24' aria-hidden='true' uib-tooltip=\"{{isExplorerVisible ? 'Hide Code' : 'Show Code'}}\"\n" +
    "                                tooltip-placement='bottom'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li ng-if='htmlFileCount() > 0'>\n" +
    "                        <a role='button' ng-click='toggleView()' ng-hide='isViewVisible'>\n" +
    "                            <ng-md-icon icon='launch' style=\"fill: {{true ? '#00ff00' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"Launch Program\"\n" +
    "                                tooltip-placement='bottom'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                        <a role='button' ng-click='toggleView()' ng-show='isViewVisible'>\n" +
    "                            <ng-md-icon icon='stop' style=\"fill: {{true ? '#ff9900' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"Stop Program\"\n" +
    "                                tooltip-placement='bottom'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li uib-dropdown ng-if='htmlFileCount() > 1'>\n" +
    "                        <a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"Choose Program Menu\" tooltip-placement='bottom'>\n" +
    "                            <ng-md-icon icon='playlist_add_check' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                        <ul class='dropdown-menu' uib-dropdown-menu role='menu'>\n" +
    "                            <li role='button' ng-repeat='(name, file) in files()' ng-if='name.indexOf(\".html\") &gt; 0'>\n" +
    "                                <a ng-click='doChooseHtml(name, file)'>{{name}}&nbsp;\n" +
    "<ng-md-icon icon='done' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' ng-if='file.htmlChoice'><ng-md-icon>\n" +
    "</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                    <li ng-if='markdownFileCount() > 0'>\n" +
    "                        <a role='button' ng-click='toggleMarkdownVisible()'>\n" +
    "                            <ng-md-icon icon='description' style=\"fill: {{isMarkdownVisible ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"{{isMarkdownVisible ?  'Hide Markdown' : 'Show Markdown'}}\"\n" +
    "                                tooltip-placement='bottom'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li uib-dropdown ng-if='markdownFileCount() > 1'>\n" +
    "                        <a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"Choose Markdown\" tooltip-placement='bottom'>\n" +
    "                            <ng-md-icon icon='playlist_add_check' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                        <ul class='dropdown-menu' uib-dropdown-menu role='menu'>\n" +
    "                            <li role='button' ng-repeat='(name, file) in files()' ng-if='name.indexOf(\".md\") &gt; 0'>\n" +
    "                                <a ng-click='doChooseMarkdown(name, file)'>{{name}}&nbsp;\n" +
    "<ng-md-icon icon='done' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' ng-if='file.markdownChoice'><ng-md-icon>\n" +
    "</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                    <li uib-dropdown>\n" +
    "                        <a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"Project Menu\" tooltip-placement='bottom'>\n" +
    "                            <ng-md-icon icon='folder' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "                                <ng-md-icon>\n" +
    "                                    <ng-md-icon icon='arrow_drop_down' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "                                        <ng-md-icon>\n" +
    "                        </a>\n" +
    "                        <ul uib-dropdown-menu role='menu'>\n" +
    "                            <li>\n" +
    "                                <a role='button' ng-click='doNew()'>New Project</a>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <a role='button' ng-click='doOpen()'>Open Project from Local Storage</a>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <a role='button' ng-click='doCopy()'>Copy current Project</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                    <li uib-dropdown ng-show='isGitHubSignedIn()'>\n" +
    "                        <a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"Cloud Menu\" tooltip-placement='bottom'>\n" +
    "                            <ng-md-icon icon='cloud' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                        <ul uib-dropdown-menu role=\"menu\">\n" +
    "                            <li>\n" +
    "                                <a ng-click='doUpload()' role='button'>Upload to GitHub</a>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <a ng-click='doPublish()' role='button'>Publish to arXiv</a>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <a ng-click='clickDownload()' role='button'>Download from GitHub</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                    <li ng-hide='isGitHubSignedIn()'>\n" +
    "                        <a role='button'>\n" +
    "                            <ng-md-icon icon='cloud_off' style=\"fill: #ffffff\" size='24' aria-hidden='true' uib-tooltip=\"\" tooltip-placement='bottom'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li uib-dropdown ng-controller='rooms-controller as rooms'>\n" +
    "                        <a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"Collaboration Menu\" tooltip-placement='bottom'>\n" +
    "                            <ng-md-icon icon='group' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                        <ul uib-dropdown-menu role=\"menu\">\n" +
    "                            <li ng-if='rooms.isCreateRoomEnabled()'>\n" +
    "                                <a ng-click='rooms.createRoom()()' role='button'>Set Up Room</a>\n" +
    "                            </li>\n" +
    "                            <li ng-if='rooms.isJoinRoomEnabled()'>\n" +
    "                                <a ng-click='rooms.joinRoom()' role='button'>Join Room</a>\n" +
    "                            </li>\n" +
    "                            <li ng-if='rooms.isLeaveRoomEnabled()'>\n" +
    "                                <a ng-click='rooms.leaveRoom()' role='button'>Leave Room</a>\n" +
    "                            </li>\n" +
    "                            <li ng-if='rooms.isDestroyRoomEnabled()'>\n" +
    "                                <a ng-click='rooms.destroyRoom()' role='button'>Tear Down Room</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                    <li uib-dropdown>\n" +
    "                        <a uib-dropdown-toggle role=\"button\" aria-expanded=\"false\" uib-tooltip=\"More Menu\" tooltip-placement='bottom'>\n" +
    "                            <ng-md-icon icon='menu' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                        <ul uib-dropdown-menu role=\"menu\">\n" +
    "                            <li ng-controller='editor-preferences-controller as controller'>\n" +
    "                                <a ng-click='controller.showEditorPreferences()' role='button'>Editor Preferences</a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class='navbar-header' ng-if='workspace.description && workspace.owner'>\n" +
    "                <a role='button' ng-click='doLabelsAndTags()'>\n" +
    "                    <span class='md-logo-text-math navbar-brand'>{{ workspace.description }} @ {{ workspace.owner }}</span>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class='navbar-header' ng-if='workspace.description && !workspace.owner'>\n" +
    "                <a role='button' ng-click='doLabelsAndTags()'>\n" +
    "                    <span class='md-logo-text-math navbar-brand'>{{ workspace.description }}</span>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </nav>\n" +
    "        <div id='doodle-container'>\n" +
    "            <explorer ng-model='workspace' class='explorer' ng-show='isExplorerVisible'></explorer>\n" +
    "            <div id='editors' resizable r-directions=\"['right']\" r-flex='true' ng-if='doodleLoaded' ng-show='isExplorerVisible'>\n" +
    "                <!-- We only need the EditSession here. Would passing in the full WsFile be better? -->\n" +
    "                <div editor ng-if='file.isOpen' ng-repeat='(path, file) in files()' ng-model='file' path='{{path}}' ng-show='isEditMode &amp;&amp; file.selected'></div>\n" +
    "            </div>\n" +
    "            <div id='output' ng-if='isViewVisible'></div>\n" +
    "            <div id='readme' ng-if='isMarkdownVisible'></div>\n" +
    "        </div>\n" +
    "    </workspace>\n" +
    "</div>"
  );


  $templateCache.put('download.html',
    "<div class='modal-content'>\n" +
    "  <div class='modal-header'>\n" +
    "    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden='true' ng-click='doCancel()'>&times;</button>\n" +
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
    "</div>"
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
    "                <div class='md-docs-section'>\n" +
    "                    <div ng-repeat='category in categories' class='md-docs-section'>\n" +
    "                        <h1 class='page-header'>{{category}}</h1>\n" +
    "                        <div ng-repeat='example in examples | filter : {category}'>\n" +
    "                            <p class='lead'>\n" +
    "                                <a href='/gists/{{example.gistId}}'>{{example.title}} (Level: {{example.level}})</a>\n" +
    "                            </p>\n" +
    "                            <p>\n" +
    "                                <a href='/gists/{{example.gistId}}'>\n" +
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
    "    <div class='explorer-section' ng-controller='ExplorerFilesController as filesController'>\n" +
    "        <div class='explorer-section-header'>\n" +
    "            <div class='navbar navbar-inverse explorer-section-box'>\n" +
    "                <ul class='nav navbar-nav' style=\"display: flex; flex-direction: row;\">\n" +
    "                    <li>\n" +
    "                        <a role='button' ng-click='doProperties()'>\n" +
    "                            <ng-md-icon icon='settings' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"Settings\"\n" +
    "                                tooltip-placement='bottom'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a role='button' ng-click='doLabelsAndTags()'>\n" +
    "                            <ng-md-icon icon='label' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"Labels and Tags\"\n" +
    "                                tooltip-placement='bottom'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a role='button' ng-click='filesController.newFile()'>\n" +
    "                            <ng-md-icon icon='add_box' style=\"fill: {{true ? '#ffffff' : '#9d9d9d'}}\" size='24' aria-hidden='true' uib-tooltip=\"New File\"\n" +
    "                                tooltip-placement='bottom'>\n" +
    "                                <ng-md-icon>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <ul class='files'>\n" +
    "            <li ng-repeat='file in $ctrl.files track by file.path' ng-class='{open: file.isOpen && !file.selected, selected: file.selected, tainted: file.tainted}'\n" +
    "                context-menu='menu(file.path)'>\n" +
    "                <a href ng-click='$ctrl.openFile(file.path)'>{{file.path}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
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
    "                <button ng-if='FEATURE_EXAMPLES_ENABLED' type=\"button\" class=\"btn btn-secondary navbar-btn\" ng-click='goExamples()'>Examples</button>\n" +
    "                <!-- button ng-if='FEATURE_DASHBOARD_ENABLED' type=\"button\" class=\"btn btn-secondary navbar-btn\" ng-click='goDashboard()' ng-show='isGitHubSignedIn()'>Dashboard</button -->\n" +
    "                <a role=\"button\" class=\"btn btn-secondary navbar-btn\" ng-href='/stemcstudio-overview-2017-03-24.pdf' download='STEMCstudio.pdf'>Download PDF</a>\n" +
    "                <a role=\"button\" class=\"btn btn-secondary navbar-btn\" ng-href='https://github.com/stemcstudio/stemcstudio/wiki' target='_blank'>User Guide</a>\n" +
    "                <a role=\"button\" class=\"btn btn-secondary navbar-btn\" ng-href='https://github.com/stemcstudio/stemcstudio/issues' target='_blank'>Feedback</a>\n" +
    "                <form class=\"navbar-search pull-right\" ng-submit='doSearch()'>\n" +
    "                    <input type=\"text\" ng-model='params.query' class=\"search-query\" placeholder=\"Search arXiv\">\n" +
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
    "    <a href=\"https://github.com/geometryzen\" target='_blank'>\n" +
    "      <img style=\"position: absolute; top: 60; right: 0; border: 0;\" src=\"https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67\" alt=\"Fork me on GitHub\" data-canonical-src=\"https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png\">\n" +
    "    </a>\n" +
    "    <div class='md-docs-header'>\n" +
    "        <div class='container'>\n" +
    "            <h1>\n" +
    "                <logo-text version='{{version}}' />\n" +
    "            </h1>\n" +
    "            <p>Live TypeScript Coding in a Gist</p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class='container md-docs-container'>\n" +
    "        <div class='row'>\n" +
    "            <div class='col-md-9' role='main'>\n" +
    "                <div class='md-docs-section' ng-if='params.query'>\n" +
    "                    <!-- Search -->\n" +
    "                    <h1 id='overview' class='page-header'>arXiv</h1>\n" +
    "                    <div class=\"thumbnails\">\n" +
    "                        <article class=\"thumbnail\" ng-repeat='doodle in doodleRefs'>\n" +
    "                            <header>\n" +
    "                                <!-- The DoodleRef has the title property -->\n" +
    "                                <h1 class='title'><a role='button' ng-href='/gists/{{doodle.gistId}}'>{{ (doodle.title ? doodle.title : 'Untitled') }}</a></h1>\n" +
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
    "                            <li>Search the arXiv.</li>\n" +
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
    "            <h3 class='modal-title' style=\"float: left;\">\n" +
    "                <logo-text version='{{version}}' />\n" +
    "            </h3>\n" +
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
    "                <input type='checkbox' ng-model='f.hideConfigFiles'>Hide Configuration Files</input>\n" +
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


  $templateCache.put('repo-data-modal.html',
    "<div class=\"modal-header\" style=\"clear: both\">\n" +
    "    <h3 class='modal-title' style=\"float: left;\">\n" +
    "        <logo-text version='{{version}}' />\n" +
    "    </h3>\n" +
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
    "                            <a ng-href='/gists/{{doodle.gistId}}'>{{doodle.title}}</a>\n" +
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
    "    <h3 class='modal-title' style=\"float: left;\">\n" +
    "        <logo-text version='{{version}}' />\n" +
    "    </h3>\n" +
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

}
