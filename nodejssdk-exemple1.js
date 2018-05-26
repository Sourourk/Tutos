
auth_username = 'admin';
auth_password = 'labstack';
auth_url = 'http://192.168.2.233/identity';
project_name = 'demo';
region_name = 'RegionOne';

var pkgcloud = require('pkgcloud'),
    _ = require('lodash');

// create our client with your openstack credentials
var client = pkgcloud.compute.createClient({
  provider: 'openstack',
  username: auth_username,
  password: auth_password,
  region: region_name, //default for DevStack, might be different on other OpenStack distributions
  authUrl: auth_url
});


// first we're going to get our flavors
client.getFlavors(function (err, flavors) {
    if (err) {
        console.dir(err);
        return;
    }

    // then get our base images
    client.getImages(function (err, images) {
        if (err) {
            console.dir(err);
            return;
        }
        console.log(images);
        // Pick a 512MB instance flavor
        var flavor = _.findWhere(flavors, { name: 'cirros256' });
        
        // Pick an image based on Ubuntu 12.04
        var image = _.findWhere(images, { name: 'cirros-0.3.5-x86_64-disk' }); // Check if this version is correct

        // Create our first server
        client.createServer({
            name: 'server1',
            image: image,
            flavor: flavor
        }, handleServerResponse);
    });
});

// This function will handle our server creation,
// as well as waiting for the server to come online after we've
// created it.
function handleServerResponse(err, server) {
    if (err) {
        console.dir(err);
        return;
    }

    console.log('SERVER CREATED: ' + server.name + ', waiting for active status');

    // Wait for status: RUNNING on our server, and then callback
    server.setWait({ status: server.STATUS.running }, 5000, function (err) {
        if (err) {
            console.dir(err);
            return;
        }

        console.log('SERVER INFO');
        console.log(server.name);
        console.log(server.status);
        console.log(server.id);

        console.log('Make sure you DELETE server: ' + server.id +
            ' in order to not accrue billing charges');
    });
}

