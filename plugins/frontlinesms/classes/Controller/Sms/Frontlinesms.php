<?php defined('SYSPATH') or die('No direct access allowed.');

/**
 * FrontlineSms Callback controller
 *
 * @author     Ushahidi Team <team@ushahidi.com>
 * @package    DataProvider\FrontlineSms
 * @copyright  2013 Ushahidi
 * @license    http://www.gnu.org/copyleft/gpl.html GNU General Public License Version 3 (GPLv3)
 */

class Controller_Sms_Frontlinesms extends Controller {

	public function action_index()
	{
		// Set up custom error view
		Kohana_Exception::$error_view_content_type = 'application/json';
		Kohana_Exception::$error_view = 'error/frontlinesms';
		Kohana_Exception::$error_layout = FALSE;
		HTTP_Exception_404::$error_view = 'error/frontlinesms';

		if ($this->request->method() != 'GET')
		{
			// Only GET is allowed as FrontlineSms does only GET request
			throw HTTP_Exception::factory(405, 'The :method method is not supported. Supported methods are :allowed_methods', array(
					':method'          => $this->request->method(),
					':allowed_methods' => Http_Request::GET,
				))
				->allowed(Http_Request::GET);
		}

		$provider = DataProvider::factory('frontlinesms');

		// Authenticate the request
		$options = $provider->options();

		if (! $this->request->query('key') OR
			$this->request->query('key') != $options['key'])
		{
			throw HTTP_Exception::factory(403, 'Incorrect or missing key');
		}

		// Remove Non-Numeric characters because that's what the DB has
		$from = preg_replace('/\D+/', "", $this->request->post('from'));
		$message_text = $this->request->query('m');
		$sender = $provider->from();

		// If receiving an SMS Message
		if ($from AND $message_text)
		{
			$provider->receive(Message_Type::SMS, $from, $message_text, $to);
		}

		$json = array(
			'payload' => array(
				'success' => TRUE,
				'error' => NULL
			)
		);

		// Set the correct content-type header
		$this->response->headers('Content-Type', 'application/json');
		$this->response->body(json_encode($json));
	}
}