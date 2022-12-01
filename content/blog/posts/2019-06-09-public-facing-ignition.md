---
title: Public Facing Ignition
description: "Using DigitalOcean, Ubuntu, LXD and NGINX"
image: "https://res.cloudinary.com/joyautomation/image/upload/c_lpad,f_auto,w_150,h_150/v1561924770/2019-06-09-public-facing-ignition/main.png"
created: June 9, 2019
---

Here is one way to deploy a secure Inductive Automation Ignition gateway to a cloud platform with encryption and access control.

<jar-image basis="438px" aspect-ratio="1.43" src="https://res.cloudinary.com/joyautomation/image/upload/f_auto/v1564637943/2019-06-09-public-facing-ignition/diagram.png" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1564637943/2019-06-09-public-facing-ignition/diagram.png" alt="Architecture Diagram"></jar-image>

## DigitalOcean

This would work on any cloud platform, like Google Cloud Platform or
Amazon Web Services, but I'm demonstrating on Digital Ocean because it
has straight forward pricing, a low learning curve, and great
documentation. I may add links and instructions to using the other
platforms later. Click [here](https://m.do.co/c/7eb43ff4819d) to get $50 in credits for the next 30 days! Let's get to it.

### Initial Droplet Setup

First, we need a server. So follow the [quick start guide](https://www.digitalocean.com/docs/droplets/quickstart/) to create an Ubuntu 18.04 droplet.

<jar-image basis="310px" aspect-ratio="1" src="https://res.cloudinary.com/joyautomation/image/upload/f_auto/v1560138164/2019-06-09-public-facing-ignition/digital-ocean-ubuntu-18.04-x64.png" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1560138164/2019-06-09-public-facing-ignition/digital-ocean-ubuntu-18.04-x64.png" add-classes="pl-2 pr-1 pt-1" alt="DigitalOcean Ubtunu 18.04 x64 Button"></jar-image>

I chose a 2 GB / 2 CPU with a 60 GB SSD disk, which at the time of
writing this was $15.00/month. Choose what you want, but make sure there
is enough resources to meet the [minimum system requirements](https://inductiveautomation.com/downloads/ignition/) of Ignition and the application you're going to build with it.

Choose a datacenter region close to you.

You don't need any of the additional options to follow along here, but
if you know what you're doing and want an additional option, you do you!

While you don't need to upload an SSH key, Digital Ocean will default to
password based security and email you a password for the root account of
the new droplet if you don't, I strongly recommend that you generate an
SSH key for your SSH client of choice and upload it here. However, if
you want to simply access the droplet from the web console, feel free to
ignore me.
 
If you're using the SSH client in Ubuntu you can follow [this guide]("https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/), but here's the brief version. Run 

```shell
ssh-keygen
```

follow the prompts. You can enter a passphrase if you want to add security, or if you prefer not to enter a passphrase every time you SSH into the server, you can omit it. Then run 

```shell
cat ~/.ssh/id_rsa.pub
``` 

and copy/paste the output into the window that opens when you click add SSH key while you're 
creating the droplet on DigitalOcean.

If you're using putty, you can follow
[this guide](https://www.ssh.com/ssh/putty/windows/puttygen)
to generate and load ssh keys.
        
Now that we have a server, let's set it up. DigitalOcean has a great 
guide for initial setup [here](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04)
that walks you through creating your user account and initial
configuration of the firewall, but in short, SSH into the server as root (or use the DigitalOcean web console):

```shell
ssh root@your_server_ip #replace with your IP address
```

If you'd like your username to be joyja you'll run the following
commands on the server:

```shell
adduser joyja 
usermod -aG sudo joyja 
ufw app list #Make sure OpenSSH is in there 
ufw allow OpenSSH 
ufw enable 
ufw status
```

Then if you're using ssh keys:

```shell
rsync --archive --chown=joyja:joyja ~/.ssh /home/joyja</jar-code
```

and test logging in as your user from your ssh client:

```shell
ssh joyja@your_server_ip #replace with your IP address</jar-code
```

If you're not using ssh keys, it will ask you for the password you set
up when you created your user.

## LXD
 
LXD is a linux container management system. If you aren't familiar with
containers, but you've worked with virtual machines, containers are
similar in that they provide an isolated environment, but they utilize
the host's operating system kernel. They are much more resource
friendly. We'll be using LXD to give us isolated environments for our
Ignition server and our NGINX server.

If your familiar with Docker, LXD is a similar technology that is more
focused on isolated environments that you can interact with after
launching. Docker is more about automating the creation of application
environments. Both technologies are incredible and become even more
powerful when used together, but that's a topic for another day.

The first thing we need to do is give our user permissions to run LXD
container management commands. Remember to use your username in place of
joyja.
```shell
sudo usermod --append --groups lxd joyja
```
 
Log out and then back in afterward.
 
The recommended storage backend is ZFS, but to use it you need to
install ZFS utilities.

```shell
sudo apt-get update
sudo apt-get install zfsutils-linux
```
 
Now we're ready to initialize LXD. It will go through a series of
questions. You should choose a larger size than the default for the new
loop device, I chose 30GB. Other than that the defaults are good as long
as you installed `zfsutils-linux`
      
```shell
lxd init

Would you like to use LXD clustering? (yes/no) [default=no]: no
Do you want to configure a new storage pool? (yes/no) [default=yes]: yes
Name of the storage pool [default=default]: default #or your preference
Name of the storage backend to use (btrfs, dir, lvm, zfs) [default=zfs]: zfs
Create a new ZFS pool? (yes/no) [default=yes]: yes
Would you like to use an existing block device? (yes/no) [default=no]: no
Size in GB of the new loop device (1GB minimum) [default=15GB]: 30GB #default is too small
Would you like to connect to a MAAS server (yes/no): no
Would you like stale cached images to be updated automatically? (yes/no) [default=yes]) [default=no]: no
Would you like to create a new local network bridge? (yes/no) [default=yes]: yes
What should the new bridge be called? [default=lxdbr0]: lxdbr0 #or your preference
What IPv4 address should be used? (CIDR subnet notation, “auto” or “none” [default=auto]: auto
What IPv6 address should be used? (CIDR subnet notation, “auto” or “none”) [default=auto]: auto
Would you like LXD to be available over the network? (yes/no) [default=no]: no
Would you like stale cached images to be updated automatically? (yes/no) [default=yes]: yes
Would you like a YAML "lxd init" preseed to be printed? (yes/no) [default=no]: no
``` 

Now you can run isolated environments of almost any Linux flavor and
version you want, congrats! Let's create some. Run the following to
create an Ubuntu 18.04 container named ignition.

```shell
lxc launch ubuntu:18.04 ignition
```
 
You might be wondering why the command uses `lxc` instead of `lxd`. LXC
is the original linux container environment and LXD adds additional
features to lxc. I know it's confusing, but just take a breath and
accept that you'll be typing `lxc` the majority of the time your working
with containers.

LXD will retrieve the Ubuntu 18.04 image from the repository and create
your new container. We can see the containers we've created by running
the following.

```shell
lxc list
```
 
You'll get a table like this:

<jar-image src="https://res.cloudinary.com/joyautomation/image/upload/f_auto,r_3/v1560192608/2019-06-09-public-facing-ignition/lxc_list.png" alt="Container List"></jar-image>

We'll also need another container to run NGINX, so might as well create
that now too.
      
```shell
lxc launch ubuntu:18.04 nginx
```
 
It should go faster the second time because we've already downloaded the
Ubuntu 18.04 image from the repository. Now run
`lxc list` one more time and record the IPV4 addresses for
the containers. We'll need them later.

## Inductive Automation Ignition
 
Inductive Automation's Ignition is a modern Human Machine Interface
software that includes all the features we need to monitor and control
process controls systems. Unlike traditional HMI software, the clients
are 100% served over http(s) and therefore capable of being served over
the internet. It's also available for linux, mac OSX, and Windows.
Ignition includes the Perspective module, which allows a modern web
browser to be used as a client. They also have some very nice third
party MQTT modules that allow for simple, low bandwidth, secure data
transfer accross the internet.

### Ignition Setup
 
Let's access the shell on our brand new ignition container. Each
container has a default user called "ubuntu".

```shell
lxc exec ignition -- su --login ubuntu
```
 
Now we'll download Ignition. The current version is 8.0.2:
      
```shell
curl -L -O -H 'Referer: https://inductiveautomation.com/downloads/ignition' https://files.inductiveautomation.com/release/ia/build8.0.2/20190605-1127/Ignition-8.0.2-linux-x64-installer.run --output "Ignition-8.0.2-linux-x64-installer.run"
```
 
If you need a different version, you can find it
[here](https://inductiveautomation.com/downloads/ignition/)
and copy the appropriate link.

Add execute permissions to the downloaded file and install:
      
```shell
chmod +x Ignition-8.0.2-linux-x64-installer.run
sudo ./Ignition-8.0.2-linux-x64-installer.run
```

You'll be asked a series of questions. I selected all the defaults for
the purposes of this guide. After the questions, Ignition will be
installed and started automatically if you said yes to that question.

## NGINX
 
NGINX is a popular web server, reverse proxy, and load balancer. We'll
be using it as a reverse proxy here. It will allow us to control access
to specific gateway URLs and give us encryption through HTTPS with Let's
Encrypt.

## Port Forwarding

Befor we setup our NGINX container lets make sure http/https requests
are forwarded to the nginx container. Run `lxc list` and
record the nginx container IPV4 address if you haven't done that
already.

Run the following commands to create iptables rules that will forward
port 80 and port 443 requests to our nginx container.
`your_server_ip` is the IP address of your DigitalOcean
droplet and `your_container_ip` is the nginx container IP
address:
      
```shell
PORT=80 PUBLIC_IP=your_server_ip CONTAINER_IP=your_container_ip \
sudo -E bash -c 'iptables -t nat -I PREROUTING -i eth0 -p TCP -d $PUBLIC_IP --dport $PORT -j DNAT --to-destination $CONTAINER_IP:$PORT -m comment --comment "forward http to nginx"'
```
      
```shell
PORT=443 PUBLIC_IP=your_server_ip CONTAINER_IP=your_container_ip \
sudo -E bash -c 'iptables -t nat -I PREROUTING -i eth0 -p TCP -d $PUBLIC_IP --dport $PORT -j DNAT --to-destination $CONTAINER_IP:$PORT -m comment --comment "forward https to nginx"'
```

```shell
sudo iptables -t nat -L PREROUTING --line-numbers
```

and if you need to delete a rule you can use the following, replacing 1
with the line number you want to delete:

```shell
sudo iptables -t nat -D PREROUTING 1
```

### NGINX Setup

Let's access the shell on our NGINX container.
```shell
lxc exec nginx -- su --login ubuntu
```

and install nginx
      
```shell
sudo apt-get update
sudo apt-get install nginx
```

Next we're going to configure NGINX as a reverse proxy for our Ignition
server. NGINX is configured by setting up server blocks, which means
that we write a configuration file for each domain that is served by
this NGINX server. The standard convention is to name these server
blocks with the name of the domain being served. The following uses my
test domain <code>ignition.jarautomation.io</code> so please replace it
with your own.

Let's create our server block. I'm using vim, but feel free to use nano
or any other command line text editor you prefer.

```shell
sudo vim /etc/nginx/sites-available/ignition.jarautomation.io
```

The configuration below will simply proxy all requests to the Ignition
server. If you want to know more about the options, linuxize has a
[great post](https://linuxize.com/post/nginx-reverse-proxy/).
Remember to use the Ignition container IP address we recorded from
running <code>lxc list</code> earlier.

```shell
server {
        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        server_name ignition.jarautomation.io;

        location / {
          
                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }
}
```
 
We can also use the following more complex configuration to limit the IP
addresses that can access the root gateway page, designer and vision
module while keeping the Perspective module public. It only allows
public access to the URLs required for Perspective to function using the
mobile app or directly from a web browser.
      
```shell
server {

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        server_name ignition.jarautomation.io;

        location / {
                allow xx.xx.xx.xx; #IP addresses listed here can access the gateway (and vision module)
                deny all;

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

        location /system/images/ {
                
                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

        location /data/perspective/ {

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

        location /res/perspective/ {

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

        location /system/perspective-download/ {

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }


        location /system/pws/ {

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

        location /system/gwinfo {

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }
}
```
 
Now we need to enable our server block configuration by creating a
symbolic link from these files to the sites-enabled directory:
      
```shell
sudo ln -s /etc/nginx/sites-available/ignition.jarautomation.io /etc/nginx/sites-enabled/
```

Now let's add some encryption!

### Let's Encrypt
 
[Let's Encrypt](https://letsencrypt.org/) is making the
internet a better place by providing free SSL certificates and tools
that makes it easy to renew them. Because they make it easy and free,
certificates can be renewed more often.

<jar-alert></jar-alert>

If you're familiar with Ignition, you may be wondering why we don't just
install the SSL certificates on the gateway and use that. We totally
could, but I prefer to use SSL with NGINX and Let's Encrypt because we
can use auto renewal and we don't have to go through the extra step of
adding the SSL certificate to the java keystore whenever we want to
renew. The connection from NGINX to Ignition is also completely private
through the container bridge network so there is no real benefit to
encrypting it.

First, we'll install the Let's Encrypt Certbot utility that will install
and manage our certificates.
      
```shell
sudo add-apt-repository ppa:certbot/certbot
sudo apt install python-certbot-nginx
```
 
Then we'll run the utility.
```shell
sudo certbot --nginx -d ignition.jarautomation.io
```
 
Add <kbd>-d <code>&lt;domain name&gt;</code></kbd> for each domain you
want to create a certificate for. You'll be asked a series of questions
including whether you agree to the terms of service, if you want to join
the Electronic Frontier Foundation email list, and if you want to force
all traffic to HTTPS. You can answer these how you wish, other than you
won't be able to proceed without agreeing to the terms of service. I
force all traffic to HTTPS so all Ignition traffic is encrypted.

Once you've answered all the questions Certbot will generate your
certificate and automatically configure NGINX for HTTPS. If you open
your NGINX configuration again you'll see what Certbot added.
      
```shell
server {

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        server_name ignition.jarautomation.io;

        location / {
                allow xx.xx.xx.xx; #IP addresses listed here can access the gateway (and vision module)
                deny all;

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

        location /system/images/ {
                
                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

        location /data/perspective/ {

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

        location /res/perspective/ {

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

        location /system/perspective-download/ {

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }


        location /system/pws/ {

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

        location /system/gwinfo {

                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade                $http_upgrade;
                proxy_set_header Connection             "Upgrade";
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto      $scheme;
                proxy_set_header X-Forwarded-Host       $host;
                proxy_set_header X-Forwarded-Port       $server_port;

                proxy_pass http://xx.xx.xx.xx:8088; #Use ignition container ip address
        }

    listen [::]:443 ssl ipv6only=on; ## managed by Certbot
    listen 443 ssl; ## managed by Certbot
    ssl_certificate /etc/letsencrypt/live/ignition.jarautomation.io/fullchain.pem; ## managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/ignition.jarautomation.io/privkey.pem; ## managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; ## managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; ## managed by Certbot

}
server {
    if ($host = ignition.jarautomation.io) {
        return 301 https://$host$request_uri;
    } ## managed by Certbot


        listen 80;
        listen [::]:80;

        server_name ignition.jarautomation.io;
    return 404; ## managed by Certbot
}
```
 
You should now be able to go to your url, mine is <https://ignition.jarautomation.io> and you'll see the Ignition gateway welcome page. Just remember, if
you limited which IP addresses can access the root gateway page, you'll
need to be in the right location to access it.

<jar-image aspect-ratio="1.2" src="https://res.cloudinary.com/joyautomation/image/upload/f_auto/v1562005047/2019-06-09-public-facing-ignition/ignition.png" alt="Ignition Gateway Home Screen"></jar-image>
 
There you have it! A public facing Ignition gateway in the cloud with
access control and easy to maintain encryption.
