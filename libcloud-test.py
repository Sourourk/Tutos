from libcloud.compute.types import Provider
from libcloud.compute.providers import get_driver

auth_username = 'admin'
auth_password = 'labstack'
auth_url = 'http://192.168.2.233/identity/'
project_name = 'wolphin'
region_name = 'RegionOne'

provider = get_driver(Provider.OPENSTACK)
conn = provider(auth_username,
                auth_password,
                ex_force_auth_url=auth_url,
                ex_force_auth_version='2.0_password',
                ex_tenant_name=project_name,
                ex_force_service_region=region_name)
images = conn.list_images()
for image in images:
    print(image)
