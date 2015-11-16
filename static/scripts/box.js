var Box = React.createClass({

	getInitialState: function () {
		return { data: ''};
	},


	componentDidMount: function () {
		$.get(this.props.source, function (result) {
			console.log(result);
			if (this.isMounted()) {
				this.setState({
					data: result
				});
			}
		}.bind(this));
	},


	render: function () {
		console.log(this.state.data);
		return (
			<ul>
				{this.state.data.map(function (year) { return <li>{year}</li> }) }
			</ul>
		);
	}

});




ReactDOM.render(
	<Box source="/addgeneData" />,
	document.getElementById('content')
);