( function ( $ ) {
	"use strict";

	
	var ctx = document.getElementById( "pieChart" );
	var users_len = document.getElementById("users_info");
	var servers_len = document.getElementById("servers_info");
	var no_access_servers_len = document.getElementById('no_access_servers_info');
	var vulns_len = document.getElementById("vulns_info");
	var net_devices_len = document.getElementById("netdevices_info");
	var cracked_users = document.getElementById("cracked_users_info");
	
	ctx.height = 300;
	var myChart = new Chart( ctx, {
		type: 'pie',
		data: {
			datasets: [ {
				data: [ users_len.value - cracked_users.value, cracked_users.value, servers_len.value - no_access_servers_len.value, no_access_servers_len.value, vulns_len.value, net_devices_len.value ],
				backgroundColor: [
                                    "rgba(0, 123, 255,1.1)",
                                    "rgba(0, 123, 255,0.9)",
									"rgba(0, 123, 255,0.7)",
									"rgba(0, 123, 255,0.5)",
									"rgba(0, 123, 255,0.3)",
									"rgba(0, 123, 255,0.1)"
                                    
                                ],
				hoverBackgroundColor: [
                                    "rgba(0, 123, 255,1.1)",
                                    "rgba(0, 123, 255,0.9)",
									"rgba(0, 123, 255,0.7)",
									"rgba(0, 123, 255,0.5)",
									"rgba(0, 123, 255,0.3)",
									"rgba(0, 123, 255,0.1)"
                                ]

                            } ],
			labels: [
							"Uncracked Users",
							"Cracked Users",
							"Owned Servers",
							"Not Owned Servers",
							"vulnerabilites",
							"Net Devices"
                        ]
		},
		options: {
			responsive: true
		}
	} );

	
} )( jQuery );
