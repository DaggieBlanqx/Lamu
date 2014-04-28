/**
 * Data Sources
 *
 * @module     DataSources
 * @author     Ushahidi Team <team@ushahidi.com>
 * @copyright  2013 Ushahidi
 * @license    https://www.gnu.org/licenses/agpl-3.0.html GNU Affero General Public License Version 3 (AGPL3)
 */

define(['App', 'marionette', 'handlebars', 'underscore', 'text!templates/DataSources.html'],
	function(App, Marionette, Handlebars, _, template)
	{
		return Marionette.CompositeView.extend(
		{
			template: Handlebars.compile(template)
		});
	});
