var Box = React.createClass({

	getInitialState: function () {
		return { data: ''};
	},


	componentDidMount: function () {

	},


	render: function () {
		return (
			<div id="box">
				<Timeline source="/addgeneData" />
				<Map source="/addgeneData" />
			</div>
		);
	}

});




ReactDOM.render(
	<Box />,
	document.getElementById('content')
);