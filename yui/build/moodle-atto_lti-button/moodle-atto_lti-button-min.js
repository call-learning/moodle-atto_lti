YUI.add("moodle-atto_lti-button",function(s,t){s.namespace("M.atto_lti").COMPONENTNAME="atto_lti",s.namespace("M.atto_lti").Button=s.Base.create("button",s.M.editor_atto.EditorPlugin,[],{_currentSelection:null,initializer:function(){this.addButton({icon:"icon",iconComponent:"atto_lti",callback:this._displayDialogue,tags:".lti-placeholder",tagMatchRequiresAll:!1}),this.editor.all(".lti-placeholder").setAttribute("contenteditable","false"),this.editor.delegate("dblclick",this._handleDblClick,".lti-placeholder",this),this.editor.delegate("click",this._handleClick,".lti-placeholder",this)},_displayDialogue:function(){var t;this._currentSelection=this.get("host").getSelection(),!1!==this._currentSelection&&(t=this.getDialogue({headerContent:M.util.get_string("pluginname",s.M.atto_lti.COMPONENTNAME),width:"auto",focusAfterHide:!0}),s.M.atto_lti.Dialogue.setDialogueContent(this,this._displayForm.bind(this,t)))},_displayForm:function(n,t){var c=this.get("courseid"),r=this;n.set("bodyContent",t).show(),t.all(s.M.atto_lti.CSS_SELECTORS.LTI_SELECTOR).each(function(a){var t=a.getData("contentitemurl"),o=Number.parseInt(a.getData().value);t?a.on("click",function(t){t.preventDefault(),require(["mod_lti/contentitem"],function(t){var e,i=a.getData("contentitemurl"),l={id:a.getData("value"),course:c,title:"",text:""};t.init(i,l,function(){M.mod_lti.editor.toggleGradeSection()}),e=window.processContentItemReturnData,window.processContentItemReturnData=function(t){r._setLTI(o,t.toolurl),e(t)},n.hide()})},this):a.on("click",function(t){t.preventDefault(),r._setLTI(o,""),n.hide()})})},_getLTIDiv:function(){var t=this.get("host").getSelectedNodes(),e=null;return t?(t.each(function(t){t.hasClass("lti-placeholder")&&(e=t)}),e):null},_setLTI:function(l,a){var o,t=this._getLTIDiv(),n=this.get("host");n.focus(),t&&t.remove(),n.setSelection(this._currentSelection),o=this,require(["core/ajax","core/notification"],function(t,e){var i={typeid:l,courseid:o.get("courseid"),toolurl:a};t.call([{methodname:"atto_lti_fetch_param",args:i}])[0].then(function(t){var e=s.Handlebars.compile(s.M.atto_lti.LTI_TEMPLATE),t=e(t);return n.insertContentAtFocusPoint(t),o.markUpdated(),!0})["catch"](e.exception)})},_handleClick:function(t){t=this.get("host").getSelectionFromNode(t.target);this.get("host").getSelection()!==t&&this.get("host").setSelection(t)},_handleDblClick:function(){this._displayDialogue()}},{ATTRS:{langs:{value:["Default","Value"]},courseid:{value:1},contentitemurl:{value:""}}}),s.namespace("M.atto_lti").Dialogue={setDialogueContent:function(i,l){require(["core/ajax","core/notification"],function(t,e){return t.call([{methodname:"atto_lti_get_tool_types_config",args:{}}])[0].then(function(t){var e=s.Handlebars.compile(s.M.atto_lti.FORM_TEMPLATE),t=s.Node.create(e({elementid:i.get("host").get("elementid"),CSS:s.M.atto_lti.CSS_SELECTORS,component:s.M.atto_lti.COMPONENTNAME,ltitypes:t,contentitemurl:i.get("contentitemurl")}));return l(t),!0})["catch"](e.exception)})}},s.namespace("M.atto_lti").LTI_TEMPLATE='{{#if addParagraphs}}<p><br></p>{{/if}}<div class="lti-placeholder" contenteditable="false"><iframe id="contentframe" height="600px" width="100%" src="{{launchurl}}" allow="microphone {{ltiallowurl}}; camera {{ltiallowurl}}; geolocation {{ltiallowurl}}; midi {{ltiallowurl}}; encrypted-media {{ltiallowurl}}; autoplay {{ltiallowurl}} " allowfullscreen="1"><div class="att-lti-login-info">{{#loginparameters}}<div class="d-none" data-name="{{key}}" data-value="{{value}}"></div> {{/loginparameters}}</div></iframe></div>{{#if addParagraphs}}<p><br></p>{{/if}}',s.namespace("M.atto_lti").FORM_TEMPLATE='<div class="atto_form mform d-flex" id="{{ elementid }}_atto_lti_form">{{#ltitypes}}<div class="card m-1"><div class="card-header d-flex" data-toggle="tooltip" data-placement="top" title="{{ description }}"><img class="img-thumbnail" src="{{ urls.icon }}" alt="{{ name }}"><h5 class="m-auto">{{ name }}</h5></div><div class="card-body d-flex"><button class="m-auto btn btn-secondary ml-0 lti-content-selector"  name="selectcontent-{{ id }}" id="id_selectcontent-{{ id }}"  type="button" {{#hascontentitemurl}}data-contentitemurl="{{ ../../contentitemurl }}"{{/hascontentitemurl}} data-value="{{ id }}" data-title="{{ name }}">\n                {{get_string "selectlti" ../component}}</button></div></div>{{/ltitypes}}</div>',s.namespace("M.atto_lti").CSS_SELECTORS={LTI_SELECTOR:".lti-content-selector"}},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});