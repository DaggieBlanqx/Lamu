/**
 * Post Detail
 *
 * @module     PostDetailView
 * @author     Ushahidi Team <team@ushahidi.com>
 * @copyright  2013 Ushahidi
 * @license    https://www.gnu.org/licenses/agpl-3.0.html GNU Affero General Public License Version 3 (AGPL3)
 */

define(['underscore', 'jquery', 'App', 'handlebars', 'views/PostItemView', 'text!templates/PostDetail.html', 'ddt'],
	function(_, $, App, Handlebars, PostItemView, template, ddt)
	{
		var PostDetailView = PostItemView.extend(
		{
			//Template HTML string
			template: Handlebars.compile(template),

			modelEvents: {
				'sync': 'render',
				'destroy' : 'handleDeleted'
			},

			handleDeleted : function()
			{
				// Redirect user to previous page (probably post list)
				// @todo does this always make sense?
				window.history.back();
			},

			onDomRefresh : function()
			{
				var $valuesEl = this.$('.post-values'),
					data = this.model.toJSON(),
					i;

				for (i in data.values)
				{
					this.renderField(i, data.values[i], $valuesEl);
				}
			},

			renderField : function(key, value, $el)
			{
				var
					form = App.Collections.Forms.get(this.model.get('form')),
					attribute = form.getAttribute(key),
					i,
					$fieldEl;

				ddt.log('PostDetailView', 'renderField, attribute', attribute);

				$fieldEl = $('<div></div>')
					.addClass('post-value')
					.text(attribute.label);
				$el.append($fieldEl);

				if (_.isArray(value))
				{
					for (i = 0; i < value.length; i++)
					{
						this.renderFieldValue(attribute, key + '.' + i, value[i].value, $fieldEl);
					}
				}
				else
				{
					this.renderFieldValue(attribute, key, value, $fieldEl);
				}
			},
			//@todo move elsewhere
			attributeTypeViewMap : {
				'datetime' : 'DateTimeValue',
				'link' : 'LinkValue',
				'point' : 'PointValue',
				'geometry' : 'GeometryValue',
			},
			renderFieldValue : function (attribute, key, value, $el)
			{
				var viewName = (typeof this.attributeTypeViewMap[attribute.type] !== 'undefined') ?
					this.attributeTypeViewMap[attribute.type] :
					'Value';

				require(['views/values/' + viewName], function (ValueView)
				{
					var view = new ValueView({
						attribute : attribute,
						key : key,
						value : value
					});
					view.render();
					$el.append(view.el);
				});
			}

		});

		return PostDetailView;
	});
