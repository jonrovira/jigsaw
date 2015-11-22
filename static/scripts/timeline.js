var Timeline = React.createClass({

	getInitialState: function () {
		return { data: ''};
	},


	componentDidMount: function () {
	},


	render: function () {
		return (
			<div className="timeline">
				<ul>
					<li>2004</li>
					<li>2005</li>
					<li>2006</li>
					<li>2007</li>
					<li>2008</li>
					<li>2009</li>
					<li>2010</li>
					<li>2011</li>
					<li>2012</li>
					<li>2013</li>
					<li>2014</li>
					<li>2015</li>
				</ul>
			</div>
		);
	}

});