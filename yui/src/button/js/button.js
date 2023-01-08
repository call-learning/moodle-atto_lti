// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_lti
 * @copyright  2022 Laurent David <laurent@call-learning.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
Y.namespace('M.atto_lti').COMPONENTNAME = 'atto_lti';
Y.namespace('M.atto_lti').Button = Y.Base.create(
    'button',
    Y.M.editor_atto.EditorPlugin,
    [],
    {
        initializer: function() {
            this.addButton({
                icon: 'icon',
                iconComponent: 'atto_lti',
                callback: this._displayDialogue,
                // Watch the following tags and add/remove highlighting as appropriate:
                tags: '.lti-placeholder',
                tagMatchRequiresAll: false,
                inlineFormat: true,

                // Key code for the keyboard shortcut which triggers this button:
                keys: '66',
            });
            this.editor.all('.lti-placeholder').setAttribute('contenteditable', 'false');
            //this.editor.delegate('dblclick', this._handleDblClick, '.lti-placeholder', this);
            //this.editor.delegate('click', this._handleClick, '.lti-placeholder', this);
        },
        /**
         * Display the lti selection tool.
         *
         * @method _displayDialogue
         * @private
         */
        _displayDialogue: function() {
            // Store the current selection.
            this._currentSelection = this.get('host').getSelection();

            if (this._currentSelection === false) {
                return;
            }

            var currentDiv = this._getLTIDiv();

            var dialogue = this.getDialogue({
                headerContent: M.util.get_string('pluginname', Y.M.atto_lti.COMPONENTNAME),
                width: 'auto',
                focusAfterHide: true
            });
            // Set the dialogue content, and then show the dialogue.
            var form = Y.M.atto_lti.Dialogue.getDialogueContent(this);
            dialogue.set('bodyContent', form).show();
            M.form.shortforms({formid: this.get('host').get('elementid') + '_atto_lti_form'});
            this._setLTI(currentDiv);
            form.one("." + Y.M.atto_lti.CSS_SELECTORS.INPUTSUBMIT).on('click', function (e) {
                e.preventDefault();
                this._setLTI(currentDiv);
                }, this);
        },
        /**
         * Get the LTI iframe
         *
         * @return {Node} The LTI iframe selected.
         * @private
         */
        _getLTIDiv: function() {
            var selectednodes = this.get('host').getSelectedNodes();
            var LTIDiv = null;
            selectednodes.each(function(selNode) {
                if (selNode.hasClass('lti-placeholder')) {
                    LTIDiv = selNode;
                }
            });
            return LTIDiv;
        },
        /**
         * Update the lti in the contenteditable.
         *
         * @method _setLTI
         * @param {Element} currentDiv
         * @private
         */
        _setLTI: function(currentDiv) {
            var host = this.get('host');
            // Focus on the editor in preparation for inserting the H5P.
            host.focus();

            // Add an empty paragraph after new H5P container that can catch the cursor.
            var addParagraphs = true;

            // If a LTI placeholder was selected we can destroy it now.
            if (currentDiv) {
                currentDiv.remove();
                addParagraphs = false;
            }

            Y.io(M.cfg.wwwroot + '/lib/ajax/service.php', {
                'method': 'POST',
                'data': JSON.encode({
                    'sesskey': M.cfg.sesskey,
                    'typeid': 1,
                    'instanceid': 1,
                }),
                'context': this,
                on: {
                    complete: function(id, o) {
                        var ltiTemplate = Y.Handlebars.compile(Y.M.atto_lti.LTI_TEMPLATE, JSON.decode(o.responseText));

                        var ltiHtml = ltiTemplate({});
                        host.insertContentAtFocusPoint(ltiHtml);
                        this.markUpdated();
                    }
                },
            });
        },
    }, {
        ATTRS: {
            // If any parameters were defined in the 'params_for_js' function,
            // they should be defined here for proper access.
            langs: {
                value: ['Default', 'Value']
            }
        }
    }

);
