---
title: Ignition Designer with SOCKS
description: "Accessing a public facing Ignition Gateway through a SOCKS proxy"
created: July 21, 2019
image: 'https://res.cloudinary.com/joyautomation/image/upload/c_lpad,f_auto,w_160,h_160/v1611514241/2019-07-21-ignition-designer-with-socks/ignition_with_socks_main.png'
imageColor: "#002256"
---


We'll kick this post off by saying it's an addendum to 
[this post](/blog/posts/2019-06-09-public-facing-ignition)
describing one way to host an Ignition Gateway publicly. In that post we
discuss how to limit access to the root gateway url to increase security
for the gateway configuration page, the designer, and vision client
access. This post assumes you've gone through that and you have an
Ignition gateway running in an LXD container on a virtual private
server.

In that post we discuss how to limit access to the root gateway url to
increase security for the gateway configuration page, the designer, and
vision client access. Here we will show you how to increase security
even more by demonstrating how to completely deny gateway root url
access in NGINX and use a SOCKS proxy to provide an encrypted, RSA keyed
tunnel to access gateway development features. This is much more secure
than just using IP address filtering in NGINX plus, anecdotally, I've
been having reliability issues when trying to access the gateway through
an NGINX HTTPS reverse proxy anyway.

<br/>

<jar-image basis="438px" aspect-ratio="1.43" src="https://res.cloudinary.com/joyautomation/image/upload/f_auto/v1564638887/2019-07-21-ignition-designer-with-socks/diagram.png" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1564638887/2019-07-21-ignition-designer-with-socks/diagram.png" alt="Architecture Diagram"></jar-image>

<br/>

We'll show you how to do this from an Ubuntu client machine, but you can
also do this from Windows using
<a href="https://www.chiark.greenend.org.uk/~sgtatham/putty/">Putty</a>
(ignoring all the LXD steps). <a href="https://alvinalexander.com/unix/edu/putty-ssh-tunnel-firefox-socks-proxy/2-configure-putty-ssh-tunnel-ssh-server.shtml">This guide</a>
has some relevant instructions for configuring Putty. <a href="https://www.perfect-privacy.com/en/manuals/windows_7_httpproxy">This Windows 7 proxy guide</a>
also has some information about where to configure Windows proxies. You
could also run Ubuntu desktop in a virtual machine and follow along.

If you're doing Ignition development from a linux computer. The best way
to get a secure connection over SSH with SOCKS that you don't have to
initialize every time is to create a development environment in LXD. In
this environment we'll set up a permanent SOCKS proxy and configure it
so all http(s) connections use it.

If you want to know how to initialize an LXD environment you can view my
[previous post](/blog/posts/2019-06-09-public-facing-ignition). Or there is also some great info on <a href="https://www.digitalocean.com/community/tutorials/how-to-set-up-and-use-lxd-on-ubuntu-16-04">Digital Ocean</a>.

LXD containers by default are headless, so we need to add a profile
allowing lxd to launch GUI (graphical user interface) applications. To
do that, create a text file with the following content called
`lxdguiprofile.txt`:

```shell
config:
  environment.DISPLAY: :0
  raw.idmap: both 1000 1000
  user.user-data: |
    #cloud-config
    runcmd:
      - 'sed -i "s/; enable-shm = yes/enable-shm = no/g" /etc/pulse/client.conf'
      - 'echo export PULSE_SERVER=unix:/tmp/.pulse-native | tee --append /home/ubuntu/.profile'
    packages:
      - x11-apps
      - mesa-utils
      - pulseaudio
description: GUI LXD profile
devices:
  PASocket:
    path: /tmp/.pulse-native
    source: /run/user/1000/pulse/native
    type: disk
  X0:
    path: /tmp/.X11-unix/X0
    source: /tmp/.X11-unix/X0
    type: disk
  mygpu:
    type: gpu
name: gui
used_by:
```

Then create the gui profile and insert the configuration:

```shell
lxc profile create gui
 cat lxdguiprofile.txt | lxc profile edit gui
```

Now we'll be able to create our ignition-client container:

```shell
lxc launch --profile default --profile gui ubuntu:18.04 ignition-client #use any container name you prefer
```

Then start a shell for you container:

```shell
lxc exec ignition-client -- su --login ubuntu
```

You can test the ability to launch GUI applications from your new
container by typing the command <code>glxgears</code>. If it's
successful, you'll see some animated gears that look like this:

<jar-image basis="250px" aspect-ratio="1.43" src="https://res.cloudinary.com/joyautomation/image/upload/v1564578909/2019-07-21-ignition-designer-with-socks/glxgears.gif" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1564578909/2019-07-21-ignition-designer-with-socks/glxgears.gif" alt="Architecture Diagram"></jar-image>

Now we'll create a permanent SOCKS connection that starts and stops with
the container. To do this we create a systemd service file:

```shell
sudo vim /etc/systemd/system/socks-proxy.service
```

Edit the file to look like this:

```shell
[Unit]
Description=Socks proxy via SSH
ConditionPathExists=|/usr/bin
After=network.target

[Service]
User=ubuntu
ExecStart=/usr/bin/ssh -D 1080 -NTC -o ServerAliveInterval=30 -o ExitOnForwardFailure=yes -o StrictHostKeyChecking=no user@ignition.jarautomation.io #Use your username and domain

# Restart every >2 seconds to avoid StartLimitInterval failure
RestartSec=5
Restart=always

[Install]
WantedBy=multi-user.target
```

Then use the following to start the service:

```shell
sudo systemctl start socks-proxy.service
```

You can check the service with:

```shell
sudo systemctl status socks-proxy.service
```

If everything is working well you can enable the socks-proxy.service to
start and stop swith the system:

```shell
sudo systemctl enable socks-proxy.service
```

If you ever need to make changes to the service file, you can make the
changes and then reload systemd with:

```shell
sudo systemctl daemon-reload
```

Now lets install the chromium browser so we can test the SOCKS proxy,
plus the Perspective module in the Ignition Designer will require all of
the dependencies that are installed with the chromium browser.

```shell
sudo apt update
sudo apt install chromium-browser
```

We'll also have to update some environment variables to tell chrome to
use our reverse proxy for all http(s) requests. To make these permanent
we'll put the environment variable assignments in our
`/etc/environment` file. Add the following to the bottom of it:

```shell
SOCKS_SERVER=localhost:1080
SOCKS_VERSION=5
```

Then <code>exit</code> your container and run the following to restart
it.
   
```shell
lxc restart ignition-client
```

Then start the shell for the ignition client again:

```shell
lxc exec ignition-client -- su --login ubuntu
```

Now start chromium by typing <code>chromium-browser</code>. You'll need
the lxd IP address of the remote Ignition server container, not to be
confused with your local Ignition client container. You can get this by
running <code>lxc list</code> on the server (I describe this more in
[this previous post](/blog/posts/2019-06-09-public-facing-ignition). Type that ip address and make sure to include the port in the url
(the default is <code>8088</code> for Ignition). You'll see something
like the below image if your Gateway is successfully running and the
proxy is working.

<jar-image basis="1150px" aspect-ratio="1.43" src="https://res.cloudinary.com/joyautomation/image/upload/f_auto/v1564590530/2019-07-21-ignition-designer-with-socks/chromium_gateway.png" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1564590530/2019-07-21-ignition-designer-with-socks/chromium_gateway.png" alt="Architecture Diagram"></jar-image>

Congratulations! You successfully, securely accessed your gateway
through an encrypted SSH tunnel!

While you're at the gateway home page, go ahead and download the
designer. Chromium will put it in <code>/home/ubuntu/Downloads</code>.
Unpack the directory:

```shell
tar xvzf Downloads/designerlauncher.tar.gz
```

Now we need to edit the designer launcher configuration file to make it
use our socks proxy. The network properties configuration file will be
located at
`/home/ubuntu/designerlauncher/runtime/conf/net.properties`.
Add the following line to the configuration file. I like to add it just
below the commented section titled: HTTP Proxy Settings.

```shell
socksProxyHost=localhost
```

We don't need to specify the port if using 1080. If you use a different
port then you need to add another line to specify
`socksProxyPort`.

I also like to add an alias so I can just type `designer` to
launch the designerlauncher. To do that we create a
`.bash_aliases` file in our home directory, if one doesn't
exist already, and the default `.bashrc` file will create the
alias upon starting the container terminal shell. Add the following to
`.bash_aliases`:

```shell
alias designer=/home/ubuntu/designerlauncher/app/designerlauncher.sh
```

Then tell your current terminal to use the new settings:

```shell
source .bashrc
```

Now type <code>designer</code> and the designer launcher window will
open like shown below:

<jar-image basis="800px" aspect-ratio="1.43" src="https://res.cloudinary.com/joyautomation/image/upload/f_auto/v1564593447/2019-07-21-ignition-designer-with-socks/designer_launcher.png" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1564593447/2019-07-21-ignition-designer-with-socks/designer_launcher.png" alt="Architecture Diagram"></jar-image>

Click Add Designer, then Manually Add Gateway and enter the IP address
and port number for the Ignition server container (again, not to be
confused with your Ignition client contaner):

<jar-image basis="400px" aspect-ratio="2.5" color="transparent" src="https://res.cloudinary.com/joyautomation/image/upload/f_auto/v1564593447/2019-07-21-ignition-designer-with-socks/designer_launcher_add_gateway.png" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1564593447/2019-07-21-ignition-designer-with-socks/designer_launcher_add_gateway.png" alt="Architecture Diagram"></jar-image>

We need to tell the designer launcher to launch designer applications
that use our new SOCKS proxy. To do this, click on the three vertical
dots in the upper right hand corner of the card for the gateway you just
added. Select Manage from the drop down menu.

Enter <code>-DsocksProxyHost=localhost</code> in the JVM Arguments entry
like shown below. To reiterate, since we're using the default port
<code>1080</code> we don't need to add a
<code>-DsocksProxyPort</code> argument here, but if you want to use a
different port you'll have to add it.

<br/>

<jar-image basis="700px" aspect-ratio="2.5" color="transparent" src="https://res.cloudinary.com/joyautomation/image/upload/f_auto/v1564593447/2019-07-21-ignition-designer-with-socks/designer_launcher_gateway_manage.png" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1564593447/2019-07-21-ignition-designer-with-socks/designer_launcher_gateway_manage.png" alt="Architecture Diagram"></jar-image>

<br/>

Save the changes and select Launch on the card for your Ignition
gateway. Enter your login information and select the project you want to
work with.

<br/>

<jar-image basis="1150px" aspect-ratio="2.5" color="transparent" src="https://res.cloudinary.com/joyautomation/image/upload/f_auto/v1564594756/2019-07-21-ignition-designer-with-socks/designer.png" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1564594756/2019-07-21-ignition-designer-with-socks/designer.png" alt="Architecture Diagram"></jar-image>

<br/>

There you have it! Persistent, secure SOCKS tunnel access to the gateway
web page and designer without exposing it to the public!