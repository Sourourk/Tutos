import openstack.cloud

# Initialize and turn on debug logging
openstack.enable_logging(debug=True)

# Initialize connection
# Cloud configs are read with openstack.config
conn = openstack.connect(cloud='openstack')

# Upload an image to the cloud
image = conn.create_image('ubuntu-trusty', filename='ubuntu-trusty.qcow2', wait=True)

# Find a flavor with at least 512M of RAM
flavor = conn.get_flavor_by_ram(512)

# Boot a server, wait for it to boot, and then do whatever is needed
# to get a public ip for it.
conn.create_server('my-server', image=image, flavor=flavor, wait=True, auto_ip=True)
