#!/bin/bash
sudo rm -r /var/lib/dpkg/lock

sudo rm -r /var/lib/apt/lists/lock

sudo chown -R stack /var/lib/apt/

sudo chown -R stack /var/cache/apt/

sudo rm -r /var/lib/apt/lists/*

#apt-get update

#sudo echo "auto enp0s8 \

#iface enp0s8 inet static
 #       address $1
 #       netmask 255.255.255.0
#        gateway 192.168.56.1" >>/etc/network/interfaces


#sudo /etc/init.d/networking restart
#sudo route del default gw 192.168.56.1

#sudo /etc/init.d/networking restart
#sudo echo "controller" > /etc/hostname
#sudo reboot
