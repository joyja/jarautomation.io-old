---
title: The Future of Operational Technology
description: "Containerization and an Open Source Stack"
created: July 6, 2020
image: 'https://res.cloudinary.com/jarautomation/image/upload/c_lpad,f_auto,w_160,h_160/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Modern%20Architecture.png'
---

<jar-image basis="1150px" aspect-ratio="1.8" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Modern%20Architecture.png" lazy-src="https://res.cloudinary.com/jarautomation/image/upload/e_blur:1000,q_1,f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Modern%20Architecture.png" alt="Architecture Diagram"></jar-image>

I am a firm believer that operational technology could benefit from the responsible application of modern open source technology. We've made a lot of progress when it comes to networking and virtualization environments, but I believe there is a huge opportunity in leveraging open source internet application development and deployment technology too. In the near future, I hope we can do away with the engineering limitations of over-priced software licenses and start creating systems that are truly robust.

Some may feel that internet technology has no place on the plant floor. That it's designed around building social media platforms and online stores. I would argue that these systems, serving millions, are more robust and meet higher availability standards than the expensive proprietary software platforms we use to run our industrial plants today. They have larger developer teams working on them. They are far more battle tested. They are better designed for deployment of changes with little to no downtime.

Here are a few topics for your consideration:

## Infrastructure

### Linux

The most popular automation platforms to this point have been built to run on Microsoft Windows, including HMI platforms, PLC programming software, and configuration tools. It makes sense. In the past, people who worked in industrial automation didn't come from computer science and software development backgrounds. They were electricians with an interest in technology or electrical, mechanical, chemical or process engineers with an aptitude for logic. Their operating system safe zone is Windows. It's what they use at home and their non-automation work so it makes sense that automation software developers would stay in that lane. Windows has its quirks, but automation professionals have come to understand them just as I did when I was developing my electrical engineering and automation skills.

However, if you want something rock solid, fully automated, and a hell of a lot more flexible, we need to make the transition to Linux for our industrial automation server operating systems. The internet has proven this for decades. Whether it's CentOS, Ubuntu, Red Hat or some other flavor, the most popular Linux operating systems are built to stay running, stay secure, and provide the bedrock for reliable applications. The capabilities of cutting edge open source technology available to us as automation engineers once we embrace Linux dwarfs that of proprietary operating systems.

I say this as someone who has spent a lot of time implementing and managing Windows systems within industrial environments and working with Linux environments on the web applications. Linux is just more reliable, lightweight, and capable for production work loads.

### Containers

I'm just going to describe my journey to discovering container technology:

So virtual machines were great. I was so eager to use them on a project when I first learned of the technology, years ago, after constantly fighting with installing and maintaining sets of physical servers. I got to use them on a few greenfield plants. I had to convince others who either hadn't heard of them or hadn't recognized the benefits, but after that I had a lot of implementation success.

There are inefficiencies though, like requiring shared storage for clusters when you have perfectly good storage local to each server in the cluster. Also it seems inefficient to have 20 virtual machines with the same operating system files. I jumped straight into hyper converged infrastructure (HCI) wanting to solve this. It allowed the use of local storage, de-duplication and compression to efficiently store data. However, I ran hard into the other limitation of most production grade converged virtual machine solutions: proprietary....ness.

Engineering around licensing is a critical problem with a fully proprietary stack. A fully proprietary stack meaning ***proprietary*** hyper-converged hardware and software housing a ***proprietary*** hypervisor hosting ***proprietary*** operating systems on which we install ***proprietary*** applications. Licensing becomes your biggest cost, let alone how hard proprietary software hits the operational budget when you factor in support and upgrades. You also end up spending more engineering time and money trying to limit the licensing costs than engineering a quality system. It is frustrating to say the least, and had me turning to open source immediately after spending so much effort and client money on a couple hyper-converged infrastructure projects. Enter containers!

<br/>

<jar-image basis="675px" aspect-ratio="1.56" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Proprietary%20Stack.png" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Proprietary%20Stack.png" alt="Architecture Diagram"></jar-image>

<jar-image basis="675px" aspect-ratio="1.56" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Open%20Source%20Stack.png" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Open%20Source%20Stack.png" alt="Architecture Diagram"></jar-image>

<br/>

Open source applications on open source operating systems using container technology solves all of the licensing and operational problems with a proprietary stack. It gives you the ability to cluster machines together without spending any money on licensing. Container technology reduces the need for de-duplication because each container uses the host kernel. Also, if you use open source applications you can scale out horizontally infinitely without spending a dime on licensing or one second on license cost engineering.

## Applications

Using horizontally scalable open source applications on container technology also eliminates the need for live migration. The need for live migration is a consequence of application licensing. Open source applications within an open source container are ephemeral, you spin up and down containers as you need them, so they no longer have to move between servers. Once you no longer need live migration, the requirement for shared storage goes away as well and the need for proprietary software to manage it. This is the architecture of Kubernetes (the foremost open source container orchestration platform at the time of this writing) which I think could be a great platform to host future industrial automation applications, whether it be on-premise or in the Cloud. 

### Programmable Logic Controllers

My opinion, and many may not agree, is that the future of programmable logic should be in containers on industrial computers instead of dedicated micro-controllers. This isn't my idea or even a new one. Once upon a time, software PLCs were a market offering from many reputable automation vendors like Rockwell (Softlogix) and Wonderware (InControl). I think the downfall of those products, is that they ran on Windows (hurting their reliability) and their cost.

Here is what I'd like to see: a programmable logic environment being executed in a container and completely configurable via a web served application including an API for programmatic access. No development software to purchase or install. That way the container could run in Docker at the edge, at the server, or anywhere it required. Fault tolerance would be a trivial implementation without purchasing dedicated proprietary hardware or software.

We can even keep the initialization! Programmable Logic Container = PLC

<br/>

<jar-image basis="675px" aspect-ratio="1.78" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Programmable%20Logic%20Containers.gif" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Programmable%20Logic%20Containers.gif" alt="Web-based Programmable Logic ontroller IDE"></jar-image>

<br/>

The following video is a proof of concept web, ladder logic program in nuxtjs (connected to a nodejs GraphQL API that runs the logic):

<br/>

<jar-image basis="675px" aspect-ratio="2.38" src="https://res.cloudinary.com/jarautomation/image/upload/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Web-Based%20Programmabe%20Logic%20IDE.gif" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Web-Based%20Programmabe%20Logic%20IDE.gif" alt="Web-based Programmable Logic ontroller IDE"></jar-image>

<br/>

"What about the I/O hardware?!" you may ask. I think I/O should be just that. Put I/O out in the field, the logic can run on whatever hardware it needs to and be moved around to provide for flexible hardware maintenance.

## Human Machine Interface

<br/>

<jar-image basis="275px" aspect-ratio="2.38" src="https://res.cloudinary.com/jarautomation/image/upload/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/High%20Availability%20and%20Scalability%20HMI.gif" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/High%20Availability%20and%20Scalability%20HMI.gif" alt="High Availability and Scalability Human-Machine Interface"></jar-image>

<br/>

Human Machine Interface (HMI) software has long been overdue for disruption by open source technology, particularly when its functionality is basically the same as a web server connected to some data source (be it OPC or direct connections via industrial protocols). In my experience as an automation engineer, the offerings to this point have been overpriced and unreliable, especially when it comes to fault tolerant systems.

What would I replace Factorytalk, InTouch, iFix or Ignition with? Personally, I would choose a Nodejs GraphQL API with a Nuxtjs front end and a handful of fantastic industrial protocol libraries for Nodejs that have been popping up. I'm working on creating something like this with my github project, which is currently an industrial edge gateway with a GraphQL API, MQTT (Sparkplug B), Industrial Protocols, and store and forward ([https://github.com/joyja/tentacle](https://github.com/joyja/tentacle)), though I plan to add the ability to process and visualization logic through the browser as well. Tentacle is fully ready for running in a container orchestration environment from docker hub or using the dockerfile in the repository to build an image. Once applications are in a container, push them to a production container orchestrator, like Kubernetes, then let it scale with demand and run on multiple servers for high availability. Beyond what I'd use personally, applications written in any contemporary open source programming language, using linting and automated testing, will give you a more reliable application with significantly better performance and scalability, especially on an open source operating system within an open source container orchestration platform.

Proprietary clients should definitely be a thing of the past. The web browser is sufficiently powerful these days to outperform any proprietary HMI clients (plus most vendors are trending that way anyway). I propose we do away with the proprietary server applications too.

## Automated Testing

A strong trend in web and other application development that hasn't made it into PLC and HMI applications is automated testing. Automated testing is writing programs that test your application and give you passed or failed feedback. It gives developers improved confidence in their code and minimizes the risk of production bugs, which happens to be even more critical in an industrial environment where our programs control real world equipment. When I first learned of this paradigm I thought it had a great application in industrial automation systems. If we write our applications using modern open source technology, the environments to do this are readily available. However, I would also argue that any abstraction we create to write programmable logic for automating plant equipment, such as ladder logic or function block, should have this built in as well.

## Version Control and Continuous Integration/Delivery

<br/>

<jar-image basis="400px" aspect-ratio="2.38" src="https://res.cloudinary.com/jarautomation/image/upload/f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Automated%20Testing.gif" lazy-src="https://res.cloudinary.com/joyautomation/image/upload/e_blur:1000,q_1,f_auto/v1594103000/blog/2020-07-06%20The%20Future%20of%20Operational%20Technology/Automated%20Testing.gif" alt="Automated Testing"></jar-image>

<br/>

To some extent, our existing automation software offerings have already addressed continuous integration and delivery. We can make changes to HMI and PLC applications with minimal downtime. I would say though, that it is far inferior to the git workflows and pipelines used in modern day web application development. Something is always missing, whether it be version control, concurrent editing, or using automated testing to validate code before deployment. 

I would like to see a future where I can make an edit to an HMI or PLC application, push it to a production branch of a repository, the environment will push my commit to history, run all my tests and only push my application to production if they pass.

## Remote Access

I think one thing we can all agree on is that process logic should be hosted on the plant floor and not on the internet. Yet remote access to process data and limited controls access is definitely a feature of the automation platform of the future. We already accomplish this with VPN technology among other things, but remote capabilities should be baked into the systems of the future whether it be by leveraging a messaging protocol like MQTT, SSH, or even a baked in VPN. There will always be aspects of control systems that we need to access from everywhere. Encryption with certificates and key authentication is easier than ever, allowing for automatic setup and configuration of encrypted remote connections. Finding a place to host APIs and modern front ends that make this data available to web browser clients has become increasingly easier and less expensive.

# Final Thoughts

I hope the future of automation incorporates a lot of the design patterns from modern web application development: an open source stack, with programmable logic that can run anywhere and is accessible without expensive development software, and inexpensive scaling/high availability. I'm working on projects to address some of this. If you're interested in taking a look or contributing, head to my [github](https://github.com/joyja):

Projects:
- **tentacle**: A nodejs industrial automation edge gateway with a GraphQL API
- **tentacle-ui**: A nuxtjs frontend for tentacle
- **mantle**: A nodejs central management and monitoring platform for tentacle edge devices and the data from them, with a GraphQL API.

<br/>

Also, if you have an open source project related to industrial automation and think I could be helpful as a contributor, feel free to reach out.