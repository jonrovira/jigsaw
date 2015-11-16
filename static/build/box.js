var Box = React.createClass({
	displayName: 'Box',

	getInitialState: function () {
		return { data: '' };
	},

	componentDidMount: function () {
		$.get(this.props.source, (function (result) {
			console.log(result);
			if (this.isMounted()) {
				this.setState({
					data: result
				});
			}
		}).bind(this));
	},

	render: function () {
		console.log(this.state.data);
		return React.createElement(
			'ul',
			null,
			this.state.data.map(function (year) {
				return React.createElement(
					'li',
					null,
					year
				);
			})
		);
	}

});

ReactDOM.render(React.createElement(Box, { source: '/addgeneData' }), document.getElementById('content'));