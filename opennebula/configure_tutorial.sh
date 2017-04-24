#!/bin/bash

txtred='\e[0;31m'
txtgrn='\e[0;32m'
txtblu='\e[0;34m'
txtrst='\e[0m'

action() {

    echo -e "${txtblu}* $@${txtrst}"
}

report_status() {
    exit_status=$?

    if [ $exit_status = 0 ]; then
        echo -e "${txtgrn}Success${txtrst}"
    else
        echo -e "${txtred}Fail${txtrst}"
    fi
    echo
}

execute_and_log() {
    echo -e "$ $@"
    bash -s <<EOF
    export LANG=C
    export LC_ALL=C
    $@
EOF
}

action "Use the QEMU hypervisor, instead of KVM (tutorial)"
#execute_and_log "sed -i 's/\"kvm\",/\"qemu\",/' /etc/one/oned.conf"
report_status

action "Define the Onegate Endpoint (tutorial)"
execute_and_log "echo 'ONEGATE_ENDPOINT = \"http://192.168.0.1:5030\"' >> /etc/one/oned.conf"
report_status

action "Use virtio networking drivers by default (recommended)"
execute_and_log "echo 'NIC = [ MODEL = \"virtio\" ]' >> /etc/one/vmm_exec/vmm_exec_kvm.conf"
report_status

action "Make Sunstone listen on all interfaces (tutorial)"
execute_and_log "sed -i 's/127.0.0.1/0.0.0.0/' /etc/one/sunstone-server.conf"
report_status

action "Make Onegate listen on all interfaces (recommended)"
execute_and_log "sed -i 's/127.0.0.1/0.0.0.0/' /etc/one/onegate-server.conf"
report_status


action "Allow oneadmin to use sudo (tutorial)"
execute_and_log "gpasswd -a oneadmin wheel"
report_status



action "fix kvm..."
sed -i '93s/nil/"kvm"/' /var/lib/one/remotes/vnm/vnm_driver.rb
