---
title: Modern Edge Architectures
description: "The power of general purpose hardware and open source software"
created: July 22, 2021
---

We've been working with container technology and running industrial applications using the general purpose hardware we sell in our <nuxt-link :to="{ name: 'store' }">store</nuxt-link>. This article is a summary of the architectures we've come acrossed and demonstrates the incredible benefits of using general purpose hardware, container technology, and open source software in control systems.

## The Traditional
Before getting into the more complicated architectures, let's talk about the common case. A lot of our sales has been hardware from our store set up the traditional way. Traditional meaning a computer with a Windows operating system, panel mounted display and HMI software communicating to a separate Programmable Logic Controller (PLC). It makes sense that this would still be the preferred solution. What I'd like to point out is that even with a traditional architecture, the hardware in our store has some remarkable benefits. We've carefully selected what we think is the best edge compute solution for most projects.

<jar-image aspect-ratio="1" basis="600px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/v1611504056/architectures/Traditional.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1611504056/architectures/Traditional.png" alt="Traditional Windows-based Standalone HMI"></jar-image>

The first benefit is due to choosing a modular, small form factor industrial computer that is VESA mountable to the back of the display. Every component in the system is independentally serviceable in the field. The monitor, the computer, the system memory, the hard drive and other components can be replaced without scrapping everything, like you would have to with the typical all-in-one. Our solution has all the form factor benefits of an all-in-one without the maintenance downsides.

The second benefit is value. Our most common sale is for a standard edge gateway VESA mounted to a 15" panel mounted monitor with Windows 10 Pro installed. We sell that for $2,400 in our store and, as of writing this, an Allen-Bradley Versa View 5400 with similar specs is $3,957 list price. *Note that neither price includes software.*

Lastly, we pre-install the software required for your application, whether it's listed in our store or not. We setup Windows with security in mind (which I'll detail in another post), we pre-calibrate the touch screen, and if you purchase software licenses from us (for Ignition or Codesys for example) we'll pre-install those too. Custom application development is also available if you need a turnkey deployment. Contact us for our rates!

Alright, I'll stop being sales-y and move on to the good stuff.

## The Linux Based HMI
The next logical step is to abandon Windows for Linux and layer on container technology. Why move to Linux? because it's free, updates are continuous and readily available and if your using a commercially supported distribution, like Ubuntu, you can still pay for on-demand support if you need it. Linux is more reliable, less resource intensive, and simply has better support for a myriad of community driven utilities. The only downside is it requires you to abandon traditional HMI software that only supports Windows. Luckily, that is becoming less and less of a problem as cross platform solutions like Ignition become more prevalent.

<jar-image aspect-ratio="1" basis="600px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/v1609269399/architectures/Standalone%20HMI.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1609269399/architectures/Standalone%20HMI.png" alt="Linux Programmable Controller"></jar-image>

Using Linux gives us access to an incredible container technology, LXD. If you're familiar with Virtual Machines, think of LXD as VMWare for containers. Why use containers instead of Virtual Machines? Containers give you all the benefits of virtual machines, but they use the host kernel so multiple copies of the operating system aren't required and there is no need to allocate resources like you have to do in a virtual machine environment. Specifically with LXD, you get the ability to cluster hardware together and easily move machines between environments. So you get a lot of the great things vSphere gives you but without spending the significant cash required for VMWare licenses and you get better performance with less hardware.

<jar-container-migration></jar-container-migration>

So, with that background information in mind, this architecture uses Ubuntu desktop, puts Ignition in an LXD container and potentially a database (if required) in another container. The database and ignition container are sandboxed inside containers and the HMI is visualized on the desktop using the Vision Client, Chrome, or (recently) Perspective Workstation. If the hardware needs to be replaced, the entire environment can be moved. No export/import. No configuration changes. Also it doesn't have to be JAR Edge hardware, it can be ANY other general purpose industrial computer that can run Ubuntu. **No Vendor Lock-in**

## The Linux Progammable Controller
Another use case, that may not immediately come to mind as a possibility, is using the edge hardware as a programmable logic controller. 

<jar-image aspect-ratio="2" basis="800px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/v1609268378/architectures/Standalone%20Control.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1609268378/architectures/Standalone%20Control.png" alt="Linux Programmable Controller"></jar-image>

Thanks to Codesys Control for Linux, we get a very powerful PLC that:

- Can easily be moved when the time comes to upgrade or replace hardware
- Is hardware agnostic. Select whatever general purpose computer you like, with as much processor power you need.
- Exceeds the most powerful proprietary PLCs on the market for a fraction of the cost

<br/>

More on that last point: An Allen-Bradley Controllogix 1756-L81E as of writing this is $6,420 list price, for example, and that doesn't even include the required accessories (i.e. the rack, power supply, etc.). In our store a standalone controller architecture with a license for Codesys Control for Linux MC is $1,750 and is many times more powerful, just connect your favorite remote I/O!

## The Linux Standalone Edge Control System

I bet your next questions is: "Wait, can't we just put the HMI and PLC containers on one platform?" The answer is, "Of course you can!"

<jar-image aspect-ratio="1.8" basis="1200px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/v1609271254/architectures/Standalone%20SCADA.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1609271254/architectures/Standalone%20SCADA.png" alt="Linux Programmable Controller"></jar-image>

With this architecture you get a complete control system with simple migration and no hardware vendor lock-in for as little as little as $4,200, which includes everything you'd need except I/O. The setup combines all the benefits of a Linux HMI and Linux PLC mentioned in the previous sections, so I won't re-iterate.

## High Availability

I know what your thinking now: "This is fantastic, but if I put everything on this one computer aren't I taking a big risk?" and that leads me to my favorite architecture: A clustered LXD environment with Ceph, the software defined storage platform. With at least three industrial PCs, to acheive a quorum, you can cluster the machines into a single container and storage platform. In short, if one computer fails, the containers on that computer can be started on any other computer in the cluster instantly.

<jar-image aspect-ratio="1.8" basis="1200px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/v1609275780/architectures/HA%20SCADA.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1609275780/architectures/HA%20SCADA.png" alt="Linux Programmable Controller"></jar-image>

Another excellent benefit, is that it scales. Need more containers than three nodes can handle? Need more storage? Add a node, those resources are now available to the cluster. The more nodes you have, the more resources are available and the better Ceph performs since it spreads the work over the resources of all the nodes in the cluster. Ceph also gives you excellent visibility in the form of a Grafana dashboard.

<jar-image aspect-ratio="1.8" basis="1200px" color="transparent" src="https://res.cloudinary.com/jarautomation/image/upload/v1611557670/architectures/Codesys%20Dashboard.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1611557670/architectures/Codesys%20Dashboard.png" alt="Linux Programmable Controller"></jar-image>

This architecture gets you high availability for your HMI system and your PLC system with easy expandability for a fraction of the cost of proprietary solutions.

## In Closing

Hopefully this article gives you a clear summary of how general purpose hardware and open source software can be used to make your control systems less expensive to install, easier to maintain, and more powerful in general. JAR Automation provides edge hardware pre-configured to support these architectures. At no additional cost above the prices in our store we assemble the hardware, install the operating system, setup the container environment for production use, calibrate the touch screen (if selected) and give you all the information you need to succeed with implementation. Even with clusters, we'll send a fully configured and tested system. [Send us an email](mailto:contact@jarautomation.io) if you have any questions or a project you'd like to run by us.