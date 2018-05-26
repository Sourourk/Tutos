

auth_username = 'admin';
auth_password = 'labstack';
auth_url = 'http://192.168.2.233/identity';
project_name = 'demo';
region_name = 'RegionOne'
//step 1
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


//step 2
flavor_id = '4d095568-251c-4514-9ceb-a7154d6f7e31';
image_id = '95d8b0a9-dab3-474c-b71b-6bf8bfe02423';

// step-3
console.log('Checking for existing SSH key pair...');
keypair_name = 'admin-key';
pub_key_file = '/home/user/.ssh/id_rsa.pub';
pub_key_string = '';
keypair_exists = false;
conn.listKeys(function (err, keys) {
    for (i=0; i<keys.length; i++){
        if (keys[i].keypair.name == keypair_name) {
            keypair_exists = true;
}}});


if (keypair_exists) {
    console.log('Keypair already exists.  Skipping import.');
} else {
    console.log('adding keypair...');
    fs = require('fs');
    fs.readFile(pub_key_file, 'utf8', function (err, data) {
      pub_key_string = data;
    });
    conn.addKey({name: keypair_name, public_key:pub_key_string}, console.log);
}

conn.listKeys(function (err, keys) {
    for (i=0; i<keys.length; i++){
        console.log(keys[i].keypair.name)
        console.log(keys[i].keypair.fingerprint)
}});

// step-4
security_group_name = 'default';
security_group_exists = false;
all_in_one_security_group = false;
conn.listGroups(function (err, groups) {
    for (i=0; i<groups.length; i++){
        if (groups[i].name == security_group_name) {
            security_group_exists = true;
}}});

if (security_group_exists) {
    console.log('Security Group already exists.  Skipping creation.');
} else {
    conn.addGroup({ name: 'all-in-one',
                    description: 'network access for all-in-one application.'
                  }, function (err, group) {
    all_in_one_security_group = group.id;
    conn.addRule({ groupId: group.id,
                   ipProtocol: 'TCP',
                   fromPort: 80,
                   toPort: 80}, console.log);
    conn.addRule({ groupId: group.id,
                   ipProtocol: 'TCP',
                   fromPort: 22,
                   toPort: 22}, console.log);
   });
};

// step-5
userdata = "#!/usr/bin/env bash\n" +
    "curl -L -s https://git.openstack.org/cgit/openstack/faafo/plain/contrib/install.sh" +
    " | bash -s -- -i faafo -i messaging -r api -r worker -r demo";
userdata = new Buffer(userdata).toString('base64')

// step-6
instance_name = 'server1'
conn.createServer({ name: instance_name,
                    image: image_id,
                    flavor: flavor_id,
                    keyname: keypair_name,
                    cloudConfig: userdata,
                    securityGroups: all_in_one_security_group},
                    function(err, server) {
                        server.setWait({ status: server.STATUS.running }, 5000, console.log)
                    });

// step-7
console.log('Checking for unused Floating IP...')
unused_floating_ips = []
conn.getFloatingIps(function (err, ips) {
    console.log(ips)
    for (i=0; i<ips.length; i++){
        if (ips[i].node_id) {
            unused_floating_ips = ips[i];
            break;
}}});


if (!unused_floating_ips) {
    conn.allocateNewFloatingIp(function (err, ip) {
    unused_floating_ips = ip.ip;
})};

console.log(unused_floating_ips);

// step-8
conn.addFloatingIp(instance_name, unused_floating_ips, console.log)

// step-9
console.log('The Fractals app will be deployed to http://%s' % unused_floating_ips.ip_address)
