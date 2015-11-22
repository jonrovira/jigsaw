var Box = React.createClass({
	displayName: "Box",

	getInitialState: function () {
		return { data: '' };
	},

	componentDidMount: function () {},

	render: function () {
		return React.createElement(
			"div",
			{ id: "box" },
			React.createElement(Timeline, { source: "/addgeneData" }),
			React.createElement(Map, { source: "/addgeneData" })
		);
	}

});

ReactDOM.render(React.createElement(Box, null), document.getElementById('content'));