var Map = React.createClass({

	getInitialState: function () {
		return { data: ''};
	},


	componentDidMount: function () {
		$.get(this.props.source, function (result) {
			var data = result[2015];
			var min = 0,
				max = 0;
			var ratio;
			var orgs = [];
			var fillKeys = ['USA', 'RUS', 'FRA'];

			for (var country in data) {
				if (data.hasOwnProperty(country)) {
					min = Math.min(min, data[country].count);
					max = Math.max(max, data[country].count);
				}
			}

			ratio = (max - min) / 100;

			for (var country in data) {
			  	if (data.hasOwnProperty(country)) {
			  		orgs.push({
			  			radius: Math.ceil(data[country].count / ratio) + 5,
			  			latitude: data[country].lat,
			  			longitude: data[country].lng,
			  			fillKey: function () {
			  				var r = Math.floor(Math.random() * 3);
			  				return fillKeys[r];
			  			},
			  		});
			  	}
			}

			var map = new Datamap({
				element: document.getElementById('map'),
				projection: 'mercator',
				fills: {
					'USA': '#8E5D4B',
					'RUS': '#A3B29E',
					'FRA': '#666666',
		            defaultFill: '#EDEEEF'
		        },
		        geographyConfig: {
		        	borderColor: '#AEA6A6',
	                highlightOnHover: false,
	                popupOnHover: false
	            },
			});

			map.bubbles(orgs, {
				borderWidth: 0,
				popupOnHover: false,
				highlightOnHover: false,
			});
			
		});
	},


	render: function () {
		return (
			<div className="map">
				<div id="map"></div>
			</div>
		);
	}

});